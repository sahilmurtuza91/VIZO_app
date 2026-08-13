const mongoose = require("mongoose");

const clientRequestSchema = new mongoose.Schema({
    assignedAgent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    clientUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    name: {
        type: String,
        default: "",
    },
    avatarUrl: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    intent: {
        type: String,
        enum: ["Buy", "Rent", "Sell"],
        required: true,
    },
    distance: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    selectedSlot: {
        type: Date,
        default: null,
    },
    clientNotes: {
        type: String,
        default: "",
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        },
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'cancelled', 'completed'],
        default: "pending",
    },
    budgetMin: {
        type: Number,
        default: null
    },
    budgetMax: {
        type: Number,
        default: null
    },
    propertyType: {
        type: String,
        default: ''
    },
    configuration: {
        type: String,
        default: ''
    },
    preferredArea: {
        type: String,
        default: ''
    },
    isReviewRequested: {
        type: Boolean,
        default: false
    },
    reviewRequestedAt: {
        type: Date,
        default: null
    },
}, { timestamps: true });

clientRequestSchema.index({ location: '2dsphere' });

const ClientRequest = mongoose.model("ClientRequest", clientRequestSchema);
module.exports = ClientRequest;