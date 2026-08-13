const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const handleChatSocket = require("./chatSocket");
const handleLocationSocket = require("./locationSocket");

const initializeSocket = (io) => {
    io.use(async (socket, next) => {
        try {
            // extract token from header
            const token = socket.handshake.auth?.token || (socket.handshake.headers?.authorization &&
                socket.handshake.headers.authorization.split(" ")[1]);

            if (!token) {
                return next(new Error("You are not logged in. Please log in to get access."));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next(new Error("The user belonging to this token no longer exists."));
            }
            if (!currentUser.isActive) {
                return next(new Error("User account is deactivated."));
            }
            socket.user = currentUser;
            next();
        } catch (error) {
            return next(new Error("Invalid or expired authentication token."));
        }
    });

    io.on("connection", (socket) => {
        console.log(`Connected User: ${socket.user.name} (${socket.user._id})`);

        // Personal user room for targeted notifications/alerts
        socket.join(`user_${socket.user._id}`);

        handleChatSocket(io, socket);
        handleLocationSocket(io, socket);

        socket.on("disconnect", () => {
            console.log(`🔌 Disconnected User: ${socket.user.name}`);
        });
    });
};

module.exports = initializeSocket;