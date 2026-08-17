require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const connectDB = require("../config/db.config");

// Mongoose Models
const User = require("../models/user.model");
const ClientRequest = require("../models/clientRequest.model");
const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const Referral = require("../models/referral.model");
const DailyActivity = require("../models/dailyActivity.model");
const Notification = require("../models/notification.model");
const SubscriptionPlan = require("../models/subscriptionPlan.model");
const UserSubscription = require("../models/userSubscription.model");
const ShowingLocationRequest = require("../models/showingLocationRequest.model");
const Invite = require("../models/invite.model");
const Ticket = require("../models/ticket.model");
const WorkingHours = require("../models/workingHours.model");

// 🟢 Test Accounts
const PRIMARY_DEMO_EMAIL = "sahilmurtuza91@gmail.com";
const SECONDARY_DEMO_EMAIL = "sahilmurtuza.it@gmail.com";
const DEMO_PASSWORD = "12345678";

const Areas = [
    "Bandra West, Mumbai", 
    "Andheri East, Mumbai", 
    "Powai, Mumbai", 
    "Worli, Mumbai",
    "Juhu, Mumbai",
    "Whitefield, Bangalore", 
    "Koramangala, Bangalore", 
    "Indiranagar, Bangalore",
    "Sector 62, Noida", 
    "123 Main St, Apt 4B, Mohali"
];

const PropertyTypes = ["Apartment", "Villa", "House", "Land"];

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const minutesAgo = (m) => new Date(Date.now() - m * 60 * 1000);

const runSeeder = async () => {
    try {
        console.log("⏳ Connecting to Database...");
        await connectDB();
        console.log("✅ Database Connected Successfully.");

        console.log("🧹 Wiping old database collections...");
        await Promise.all([
            User.deleteMany({}),
            ClientRequest.deleteMany({}),
            Conversation.deleteMany({}),
            Message.deleteMany({}),
            Referral.deleteMany({}),
            DailyActivity.deleteMany({}),
            Notification.deleteMany({}),
            SubscriptionPlan.deleteMany({}),
            UserSubscription.deleteMany({}),
            ShowingLocationRequest.deleteMany({}),
            Invite.deleteMany({}),
            Ticket.deleteMany({}),
            WorkingHours.deleteMany({}),
        ]);
        console.log("🧹 Old collections wiped clean.");

        // 1. PRIMARY AGENT 1 (Phone 1)
        const primaryAgent = new User({
            name: "Sahil Murtuza",
            email: PRIMARY_DEMO_EMAIL,
            password: DEMO_PASSWORD,
            phone: "9876543210",
            countryCode: "+91",
            isEmailVerified: true,
            isPhoneVerified: true,
            role: "agent",
            avatarUrl: "https://i.pravatar.cc/300?img=11",
            headshotUrl: "https://i.pravatar.cc/300?img=11",
            isPhotoBlurredUntilVerified: false,
            bio: "Senior Real Estate Broker & Property Advisor in Mumbai.",
            rating: 4.9,
            reviewCount: 94,
            ratingBreakdown: { 5: 86, 4: 8, 3: 0, 2: 0, 1: 0 },
            experienceYears: 8,
            specialties: ["Luxury", "Residential", "Commercial", "Flats"],
            languagesSpoken: ["English", "Hindi"],
            currentCity: "Mumbai, Maharashtra",
            currentLocation: {
                type: "Point",
                coordinates: [72.8777, 19.0760],
            },
            isAvailable: true,
            isProfileComplete: true,
            profileViewCount: 1200,
            reDesignations: ["REALTOR®", "Certified Residential Specialist (CRS)"],
            licenseType: "Broker License",
            licenseNumber: "RERA-MH-2024-98765",
            licenseState: "Maharashtra",
            isLicenseVerified: true,
            myReferralCode: "SAHIL91AG",
            settings: {
                gpsLocationTracking: true,
                pushNotifications: true,
                aiChatbot: true,
                inAppMessaging: true,
            },
            notificationPreferences: {
                newClientRequest: true,
                newMessage: true,
                reviewsRatings: true,
                meetingReminders: true,
                licenseExpiryAlerts: true,
                platformUpdates: true,
                marketingPromotions: false,
            },
        });
        await primaryAgent.save();
        console.log(`✅ Primary Agent 1 Created: ${PRIMARY_DEMO_EMAIL}`);

        // 2. SECONDARY AGENT 2 (Phone 2)
        const secondaryAgent = new User({
            name: "Sahil Tech Broker",
            email: SECONDARY_DEMO_EMAIL,
            password: DEMO_PASSWORD,
            phone: "9876543211",
            countryCode: "+91",
            isEmailVerified: true,
            isPhoneVerified: true,
            role: "agent",
            avatarUrl: "https://i.pravatar.cc/300?img=33",
            headshotUrl: "https://i.pravatar.cc/300?img=33",
            isPhotoBlurredUntilVerified: false,
            bio: "PropTech Commercial Land Consultant in Bangalore.",
            rating: 4.8,
            reviewCount: 42,
            ratingBreakdown: { 5: 38, 4: 4, 3: 0, 2: 0, 1: 0 },
            experienceYears: 5,
            specialties: ["Commercial Properties", "Luxury Homes"],
            languagesSpoken: ["English", "Hindi"],
            currentCity: "Bangalore, Karnataka",
            currentLocation: {
                type: "Point",
                coordinates: [77.5946, 12.9716],
            },
            isAvailable: true,
            isProfileComplete: true,
            profileViewCount: 850,
            reDesignations: ["Real Estate Broker"],
            licenseType: "Broker License",
            licenseNumber: "RERA-KA-2024-11223",
            licenseState: "Karnataka",
            isLicenseVerified: true,
            myReferralCode: "SAHILIT99",
            settings: {
                gpsLocationTracking: true,
                pushNotifications: true,
                aiChatbot: true,
                inAppMessaging: true,
            },
            notificationPreferences: {
                newClientRequest: true,
                newMessage: true,
                reviewsRatings: true,
                meetingReminders: true,
                licenseExpiryAlerts: true,
                platformUpdates: true,
                marketingPromotions: false,
            },
        });
        await secondaryAgent.save();
        console.log(`✅ Secondary Agent 2 Created: ${SECONDARY_DEMO_EMAIL}`);

        // 3. CO-AGENTS & CLIENTS
        const albertBlack = new User({
            name: "Albert Black",
            email: "albert.black@vizo.com",
            password: DEMO_PASSWORD,
            phone: "9876500001",
            countryCode: "+1",
            role: "agent",
            avatarUrl: "https://i.pravatar.cc/150?img=12",
            currentCity: "Newport Beach, CA 92660",
            myReferralCode: "ALBERTBLK",
            isProfileComplete: true,
        });
        await albertBlack.save();

        const clientDataList = [
            { name: "John Smith", email: "john.smith@gmail.com", phone: "9876510001", avatarUrl: "https://i.pravatar.cc/150?img=11", city: "123 Main St, Apt 4B, Mohali" },
            { name: "Maria Johnson", email: "maria.j@gmail.com", phone: "9876510002", avatarUrl: "https://i.pravatar.cc/150?img=9", city: "Powai, Mumbai" },
            { name: "William Butcher", email: "william.b@gmail.com", phone: "9876510003", avatarUrl: "https://i.pravatar.cc/150?img=60", city: "Andheri East, Mumbai" },
            { name: "Julia Black", email: "julia.black@gmail.com", phone: "9876510004", avatarUrl: "https://i.pravatar.cc/150?img=24", city: "Whitefield, Bangalore" },
        ];

        const createdClients = [];
        for (const cData of clientDataList) {
            const client = new User({
                name: cData.name,
                email: cData.email,
                password: DEMO_PASSWORD,
                phone: cData.phone,
                countryCode: "+91",
                isEmailVerified: true,
                role: "client",
                avatarUrl: cData.avatarUrl,
                currentCity: cData.city,
                myReferralCode: `CL-${cData.name.substring(0, 3).toUpperCase()}`,
            });
            await client.save();
            createdClients.push(client);
        }
        console.log(`✅ ${createdClients.length} Demo Clients Seeded.`);

        // 4. SUBSCRIPTIONS (For both Phone 1 and Phone 2)
        const plans = await SubscriptionPlan.insertMany([
            {
                name: "Diamond",
                tagLine: "Ultimate tier for top performing brokers",
                monthlyPrice: 99,
                annualPricePerMonth: 79,
                iconName: "diamond",
                features: ["Priority Lead Allocation", "Unlimited Showing Requests", "Featured Agent Badge", "Dedicated Account Manager"],
                isActive: true,
                sortOrder: 1,
            },
            {
                name: "Ruby",
                tagLine: "Advanced plan for growing real estate teams",
                monthlyPrice: 69,
                annualPricePerMonth: 49,
                iconName: "ruby",
                features: ["Advanced Showing Requests", "Direct Client Messaging", "Profile Analytics", "Priority Support"],
                isActive: true,
                sortOrder: 2,
            },
        ]);

        const rubyPlan = plans.find((p) => p.name === "Ruby");
        await UserSubscription.insertMany([
            {
                user: primaryAgent._id,
                plan: rubyPlan._id,
                billingCycle: "monthly",
                status: "active",
                startDate: daysAgo(20),
                expiryDate: daysAgo(-10),
                razorpayOrderId: "order_ruby_111",
                razorpayPaymentId: "pay_ruby_111",
            },
            {
                user: secondaryAgent._id,
                plan: rubyPlan._id,
                billingCycle: "monthly",
                status: "active",
                startDate: daysAgo(20),
                expiryDate: daysAgo(-10),
                razorpayOrderId: "order_ruby_222",
                razorpayPaymentId: "pay_ruby_222",
            },
        ]);
        console.log("✅ Active Subscriptions Seeded for Both Agents.");

        // 5. DIRECT CONVERSATION BETWEEN AGENT 1 & AGENT 2 (⭐ CALL & CHAT TESTING)
        const directAgentConv = await Conversation.create({
            participants: [primaryAgent._id, secondaryAgent._id],
            lastMessage: "Let's connect on a quick call to discuss the client requirements.",
            lastMessageAt: minutesAgo(2),
            lastMessageSender: secondaryAgent._id,
            unreadCounts: new Map([
                [primaryAgent._id.toString(), 0],
                [secondaryAgent._id.toString(), 0],
            ]),
        });

        await Message.insertMany([
            {
                conversation: directAgentConv._id,
                sender: primaryAgent._id,
                text: "Hi Sahil, I saw your listing for the Whitefield Commercial Land.",
                messageType: "text",
                isRead: true,
                createdAt: minutesAgo(15),
            },
            {
                conversation: directAgentConv._id,
                sender: secondaryAgent._id,
                text: "Hello! Yes, it's a prime 2-acre plot with all regulatory approvals cleared.",
                messageType: "text",
                isRead: true,
                createdAt: minutesAgo(10),
            },
            {
                conversation: directAgentConv._id,
                sender: primaryAgent._id,
                text: "Sounds great. My client is looking to close the deal by next week.",
                messageType: "text",
                isRead: true,
                createdAt: minutesAgo(5),
            },
            {
                conversation: directAgentConv._id,
                sender: secondaryAgent._id,
                text: "Let's connect on a quick call to discuss the client requirements.",
                messageType: "text",
                isRead: true,
                createdAt: minutesAgo(2),
            },
        ]);
        console.log("⭐ Direct Chat & Call Channel between Agent 1 & Agent 2 created!");

        // Other Demo Chats for Agent 1
        const johnSmithClient = createdClients[0];
        const convJohn = await Conversation.create({
            participants: [primaryAgent._id, johnSmithClient._id],
            lastMessage: "Mid or higher floor would be fine.",
            lastMessageAt: minutesAgo(30),
            lastMessageSender: primaryAgent._id,
            unreadCounts: new Map([
                [primaryAgent._id.toString(), 0],
                [johnSmithClient._id.toString(), 0],
            ]),
        });
        await Message.create({
            conversation: convJohn._id,
            sender: johnSmithClient._id,
            text: "Hey! I saw your request for Looking home.",
            messageType: "text",
            isRead: true,
            createdAt: minutesAgo(30),
        });

        // 6. CLIENT REQUESTS
        const clientRequestsData = [];
        for (let i = 0; i < 8; i++) {
            const client = createdClients[i % createdClients.length];
            clientRequestsData.push({
                assignedAgent: primaryAgent._id,
                clientUser: client._id,
                name: client.name,
                avatarUrl: client.avatarUrl,
                isVerified: true,
                intent: i % 2 === 0 ? "Buy" : "Rent",
                distance: `${1.2 + i * 0.5} mi away`,
                address: `${101 + i}, Palm Beach Road, Bandra West`,
                selectedSlot: new Date(Date.now() + (i + 1) * 3600000 * 4),
                clientNotes: "Prefer ready-to-move 2/3 BHK with bank pre-approval ready.",
                status: "pending",
                budgetMin: 5000000,
                budgetMax: 15000000,
                propertyType: "Apartment",
                configuration: "3 BHK",
                preferredArea: "Bandra West, Mumbai",
                location: {
                    type: "Point",
                    coordinates: [72.8258, 19.0596],
                },
                createdAt: minutesAgo(i * 45),
            });
        }
        await ClientRequest.insertMany(clientRequestsData);

        // 7. SHOWING LOCATION REQUESTS
        await ShowingLocationRequest.create({
            requestedBy: primaryAgent._id,
            sharedBy: albertBlack._id,
            mlsPropertyId: "12345678",
            propertyTitle: "1234 Ocean View Dr.",
            propertyAddress: "Newport Beach, CA 92660",
            propertyImageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
            requestedShowingDate: new Date(),
            requestedShowingTime: "9:30 AM - 10:30 AM",
            message: "Showing location ETA test.",
            status: "accepted",
            currentLocation: {
                type: "Point",
                coordinates: [-117.9298, 33.6189],
            },
            etaMinutes: 5,
            lastLocationUpdateAt: Date.now(),
        });

        // 8. WORKING HOURS & NOTIFICATIONS
        await WorkingHours.create({
            user: primaryAgent._id,
            hours: [
                { dayShort: "M", dayFull: "Monday", isAvailable: true, startTime: "9:00 AM", endTime: "6:00 PM" },
                { dayShort: "T", dayFull: "Tuesday", isAvailable: true, startTime: "9:00 AM", endTime: "6:00 PM" },
            ],
            selectedDate: ["2026-12-01"],
            syncedCalendar: "Google Calendar",
            isCalendarSynced: true,
        });

        await Notification.insertMany([
            {
                recipient: primaryAgent._id,
                senderName: "Sahil Tech Broker",
                senderImage: "https://i.pravatar.cc/300?img=33",
                message: "New message: 'Let's connect on a quick call...'",
                isRead: false,
                targetScreen: "ChatDetailScreen",
                createdAt: minutesAgo(2),
            },
            {
                recipient: secondaryAgent._id,
                senderName: "Sahil Murtuza",
                senderImage: "https://i.pravatar.cc/300?img=11",
                message: "Sahil Murtuza opened a chat channel with you.",
                isRead: false,
                targetScreen: "ChatDetailScreen",
                createdAt: minutesAgo(15),
            }
        ]);

        console.log("\n==========================================================");
        console.log("🚀 DATABASE SEEDED FOR DUAL-PHONE REALTIME TESTING!");
        console.log("==========================================================");
        console.log(`📱 PHONE 1 LOGIN : ${PRIMARY_DEMO_EMAIL}`);
        console.log(`📱 PHONE 2 LOGIN : ${SECONDARY_DEMO_EMAIL}`);
        console.log(`🔑 PASSWORD FOR BOTH: ${DEMO_PASSWORD}`);
        console.log("==========================================================\n");

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeder script failed:", error);
        process.exit(1);
    }
};

runSeeder();