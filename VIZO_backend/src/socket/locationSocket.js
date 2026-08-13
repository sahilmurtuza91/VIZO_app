const ShowingLocationRequest = require("../models/showingLocationRequest.model");

const handleLocationSocket = (io, socket) => {
    // Join Showing Location Room
    socket.on("join-showing_room", async (showingRequestId) => {
        try {
            if (!showingRequestId) return;

            const roomName = `showing_${showingRequestId}`;
            socket.join(roomName);

            console.log(`User ${socket.user.name} joined location tracking room: ${roomName}`);

            const request = await ShowingLocationRequest.findById(showingRequestId);
            if (request) {
                socket.emit("initial_location_data", {
                    currentLocation: request.currentLocation,
                    etaMinutes: request.etaMinutes,
                    status: request.status,
                    lastLocationUpdateAt: request.lastLocationUpdateAt,
                });
            }
        } catch (error) {
            console.log("Socket join_showing_room error: ", error);
        }
    });

    // Leave Showing Location Room
    socket.on("leave_showing_room", (showingRequestId) => {
        if (!showingRequestId) return;
        const roomName = `showing_${showingRequestId}`;
        socket.leave(roomName);
        console.log(`User ${socket.user.name} left room: ${roomName}`);
    });

    // Live Location Update
    socket.on("update_live_location", async (data) => {
        try {
            const { showingRequestId, lat, lng, etaMinutes } = data;

            if (!showingRequestId || lat === undefined || lng === undefined) {
                return;
            }

            const showingRequest = await ShowingLocationRequest.findById(showingRequestId);

            if (!showingRequest) {
                return socket.emit("error_message", "Showing location request not found.");
            }

            showingRequest.currentLocation = {
                type: "Point",
                coordinates: [Number(lng), Number(lat)],
            };

            if (etaMinutes !== undefined) {
                showingRequest.etaMinutes = Number(etaMinutes);
            }
            showingRequest.lastLocationUpdateAt = Date.now();
            await showingRequest.save();

            const locationPayload = {
                showingRequestId,
                currentLocation: showingRequest.currentLocation,
                etaMinutes: showingRequest.etaMinutes,
                lastLocationUpdateAt: showingRequest.lastLocationUpdateAt,
            };

            socket.to(`showing_${showingRequestId}`).emit("location_updated", locationPayload);
        } catch (error) {
            console.log("socket update_live_location error: ", error);
        }
    });

    // Update Status
    socket.on("update_showing_status", async (data) => {
        try {
            const { showingRequestId, status } = data;
            const allowedStatuses = ["accepted", "declined", "live", "arrived", "completed", "cancelled"];

            if (!showingRequestId || !allowedStatuses.includes(status)) {
                return;
            }

            const showingRequest = await ShowingLocationRequest.findById(showingRequestId);
            if (!showingRequest) return;

            if (status === "arrived") {
                showingRequest.arrivedAt = Date.now();
            } else if (status === "completed") {
                showingRequest.completedAt = Date.now();
            }

            await showingRequest.save();

            io.to(`showing_${showingRequestId}`).emit("showing_status_changed", {
                showingRequestId,
                status: showingRequest.status,
                arrivedAt: showingRequest.arrivedAt,
                completedAt: showingRequest.completedAt,
            });
        } catch (error) {
            console.error("Socket update_showing_status error:", error);
        }
    });
};

module.exports = handleLocationSocket;