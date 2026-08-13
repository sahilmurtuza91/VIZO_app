const express = require("express");
const router = express.Router();

const {
    accessConversation,
    getMyConversations,
    getMessages,
    sendMessage,
    getChatStats,
} = require("../controllers/chat.controller");

const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/multer");

router.use(protect);

router.route("/conversations")
    .get(getMyConversations)
    .post(accessConversation);

router.get("/stats", getChatStats);
router.get("/messages/:conversationId", getMessages);
router.post("/message", upload.single("media"), sendMessage);

module.exports = router;