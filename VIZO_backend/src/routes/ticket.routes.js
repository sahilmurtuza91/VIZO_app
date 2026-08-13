const express = require("express");

const router = express.Router();

const { createTicket, getMyTickets, getTicketById, updateTicketStatus } = require("../controllers/ticket.controller");

const { protect } = require("../middlewares/auth");

router.use(protect);

router.route("/")
    .get(getMyTickets)
    .post(createTicket);

router.get("/:id", getTicketById);
router.patch("/:id/status", updateTicketStatus);

module.exports = router;