const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");
/* 
 -> inside the io connected sockets, rooms, events, broadcasting all are managed inside io
 -> socket is a prticular connected user connection

            IO
       ┌───────┼────────┐
       ↓       ↓        ↓
    Socket   Socket   Socket
    Sahil    Rahul     Amit

----------------------------------------------------------
| Cheez                | Meaning                         |
| -------------------- | ------------------------------- |
| `io`                 | Pura Socket.IO server           |
| `socket`             | Ek connected client/user        |
| `socket.on()`        | Ek socket se event sunna        |
| `socket.emit()`      | Ek socket ko event bhejna       |
| `io.emit()`          | Sab connected clients ko bhejna |
| `io.to(room).emit()` | Specific room ko bhejna         |
----------------------------------------------------------

on --> perfomr listen
emit --> event or send data 
socke.join --> room join perform

*/

const handleChatSocket = (io, socket) => {
    // Join Conversation Room
    socket.on("join_conversation", (conversationId) => {
        if (!conversationId) return;
        socket.join(`conversation_${conversationId}`);
    });

    // Leave Conversation Room
    socket.on("leave_conversation", (conversationId) => {
        if (!conversationId) return;
        socket.leave(`conversation_${conversationId}`);
    });

    // Send Message Event
    socket.on("send_message", async (data) => {
        try {
            const { conversationId, text, imageUrl } = data;

            if (!conversationId || (!text && !imageUrl)) return;

            const message = await Message.create({
                conversation: conversationId,
                sender: socket.user._id,
                text: text || "",
                imageUrl: imageUrl || "",
            });

            const populatedMessage = await Message.findById(message._id).populate(
                "sender",
                "name avatarUrl"
            );

            const conversation = await Conversation.findById(conversationId);
            if (conversation) {
                conversation.lastMessage = text || "Image";
                conversation.lastMessageAt = Date.now();
                conversation.lastMessageSender = socket.user._id;
                await conversation.save();
            }

            // Broadcast message to everyone inside conversation room
            io.to(`conversation_${conversationId}`).emit("receive_message", populatedMessage);

            // Send notification trigger to other participants
            if (conversation) {
                conversation.participants.forEach((participantId) => {
                    if (participantId.toString() !== socket.user._id.toString()) {
                        io.to(`user_${participantId}`).emit("new_message_notification", {
                            conversationId,
                            senderName: socket.user.name,
                            message: text || "sent an image",
                        });
                    }
                });
            }
        } catch (error) {
            console.error("Socket send_message error:", error);
        }
    });

    // Typing Indicators
    socket.on("typing", ({ conversationId }) => {
        if (!conversationId) return;
        socket.to(`conversation_${conversationId}`).emit("user_typing", {
            userId: socket.user._id,
            username: socket.user.name,
        });
    });

    socket.on("stop_typing", ({ conversationId }) => {
        if (!conversationId) return;
        socket.to(`conversation_${conversationId}`).emit("user_stop_typing", {
            userId: socket.user._id,
        });
    });

    // Caller starts a call
    socket.on("call_user", ({ toUserId, conversationId, callType, offer }) => {
        if (!toUserId || !offer) return;
        io.to(`user_${toUserId}`).emit("incoming_call", {
            fromUserId: socket.user._id,
            fromUserName: socket.user.name,
            fromUserAvatar: socket.user.avatarUrl,
            conversationId,
            callType: callType === "video" ? "video" : "audio",
            offer,
        });
    });

    // Callee accepts and sends back their SDP answer
    socket.on("answer_call", ({ toUserId, answer }) => {
        if (!toUserId || !answer) return;
        io.to(`user_${toUserId}`).emit("call_answered", {
            fromUserId: socket.user._id,
            answer,
        });
    });

    // Either side trickles ICE candidates
    socket.on("ice_candidate", ({ toUserId, candidate }) => {
        if (!toUserId || !candidate) return;
        io.to(`user_${toUserId}`).emit("ice_candidate", {
            fromUserId: socket.user._id,
            candidate,
        });
    });

    // Callee declines
    socket.on("reject_call", ({ toUserId }) => {
        if (!toUserId) return;
        io.to(`user_${toUserId}`).emit("call_rejected", {
            fromUserId: socket.user._id,
        });
    });

    // Either side hangs up
    socket.on("end_call", ({ toUserId }) => {
        if (!toUserId) return;
        io.to(`user_${toUserId}`).emit("call_ended", {
            fromUserId: socket.user._id,
        });
    });
};

module.exports = handleChatSocket;