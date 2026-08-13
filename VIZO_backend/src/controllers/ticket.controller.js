const Ticket = require("../models/ticket.model");
const asyncHandler = require("../utils/AsyncHandler");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/apiResponse");

const generateTicketNumber = () => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000)
    return `#${randomDigits}`;
};

// create ticket
const createTicket = asyncHandler(async (req, res, next) => {
    const { issueType, description } = req.body;

    if (!issueType || !description) {
        return next(new ApiError("Issue type and description are required.", 400));
    }
    let ticketNumber = generateTicketNumber();
    let existingTicket = await Ticket.findOne({ ticketNumber });

    while (existingTicket) {
        ticketNumber = generateTicketNumber();
        existingTicket = await Ticket.create({ ticketNumber });
    }
    const ticket = await Ticket.create({
        user: req.user._id,
        ticketNumber,
        issueType,
        description,
        status: "In Progress",
    });
    return sendSuccess(res, 201, "Support ticket created successfully.", ticket);
});

// get ticket
const getMyTickets = asyncHandler(async (req, res, next) => {
    const { status } = req.query;

    const query = { user: req.user._id };
    if (status) {
        query.status = status;
    }

    const ticket = await Ticket.find(query).sort({ createdAt: -1 });
    return sendSuccess(res, 200, "Tickets fetched successfully.", ticket);
});

// fetch single ticket
const getTicketById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const ticket = await Ticket.findOne({
        _id: id,
        user: req.user._id,
    });

    if (!ticket) {
        return next(new ApiError("Support ticket not found.", 404));
    }
    return sendSuccess(res, 200, "Ticket details fetched successfully.", ticket);
});

// updat ticket status done by admin
const updateTicketStatus = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["In Progress", "Resolved"];

    if (!status || !allowedStatuses.includes(status)) {
        return next(new ApiError("Valid status ('In Progress' or 'Resolved') is required.", 400));
    }
    const ticket = await Ticket.findById(id);
    if (!ticket) {
        return next(new ApiError("Support ticket not found.", 404));
    }
    ticket.status = status;
    await ticket.save();
    return sendSuccess(res, 200, `Ticket status updated to ${status}.`, ticket);
});

module.exports = {
    createTicket,
    getMyTickets,
    getTicketById,
    updateTicketStatus,
}