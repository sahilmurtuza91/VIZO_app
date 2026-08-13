const { required } = require("joi");
const mongoose = require("mongoose");

const showingLocationRequestSchema = new mongoose.Schema({
    requestedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sharedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    mlsPropertyId: {
        type: String,
        default: ''
    },
    propertyTitle: {
        type: String,
        default: "",
    },
    propertyAddress: {
        type: String,
        default: ''
    },
    propertyImageUrl: {
        type: String,
        default: ''
    },
    requestedShowingDate: {
        type: Date,
        default: null
    },
    requestedShowingTime: {
        type: String,
        default: ''
    },
    message: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'live', 'arrived', 'completed', 'cancelled'],
        default: 'pending',
    },
    currentLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        },
    },
    etaMinutes: {
        type: Number,
        default: null
    },
    lastLocationUpdateAt: {
        type: Date,
        default: null
    },
    arrivedAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    },
}, { timestamp: true });


showingLocationRequestSchema.index({ currentLocation: '2dsphere' });

const ShowingLocationRequest = mongoose.model("ShowingLocationRequest", showingLocationRequestSchema);
module.exports = ShowingLocationRequest;