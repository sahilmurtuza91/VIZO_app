require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const helmet = require("helmet");
const compress = require("compression");

const connectDB = require("./src/config/db.config");
const errorHandler = require("./src/middlewares/errorHandler");

const authRoutes = require("./src/routes/auth.routes");
const profleRoutes = require("./src/routes/profile.routes");
const workingHoursRoutes = require("./src/routes/workingHours.routes");
const clientRequestRoutes = require("./src/routes/clientRequest.routes");
const dailyActivityRoutes = require("./src/routes/dailyActivity.routes");
const referralRoutes = require("./src/routes/referral.routes");
const inviteRoutes = require("./src/routes/invite.routes");
const ticketRoutes = require("./src/routes/ticket.routes");
const notificationRoutes = require("./src/routes/notification.routes");
const subscriptionRoutes = require("./src/routes/subscription.routes");
const lookupRoutes = require("./src/routes/lookup.routes");
const chatRoutes = require("./src/routes/chat.routes");

const initializeSocket = require("./src/socket");

// connect db
connectDB();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

initializeSocket(io);

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(compress());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VIZO app server is running",
  })
})

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profleRoutes);
app.use("/api/v1/working-hours", workingHoursRoutes);
app.use("/api/v1/client-requests", clientRequestRoutes);
app.use("/api/v1/daily-activities", dailyActivityRoutes);
app.use("/api/v1/referrals", referralRoutes);
app.use("/api/v1/invites", inviteRoutes);
app.use("/api/v1/tickets", ticketRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/subscriptions", subscriptionRoutes);
app.use("/api/v1/lookup", lookupRoutes);
app.use("/api/v1/chat", chatRoutes);


// Global Error Handler Middleware
app.use(errorHandler);

// app.listen(PORT, () => {
//   console.log(`Server is running on the port: ${PORT}`);
// })

server.listen(PORT, () => {
    console.log(`Server is running on the port: ${PORT}`);
});