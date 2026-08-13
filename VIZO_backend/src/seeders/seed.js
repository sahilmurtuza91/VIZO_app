// require("dotenv").config();
// const mongoose = require("mongoose");
// const connectDB = require("../config/db.config");

// const User = require("../models/user.model");
// const ClientRequest = require("../models/clientRequest.model");
// const Conversation = require("../models/conversation.model");
// const Message = require("../models/message.model");
// const Referral = require("../models/referral.model");
// const DailyActivity = require("../models/dailyActivity.model");
// const Notification = require("../models/notification.model");
// const SubscriptionPlan = require("../models/subscriptionPlan.model");

// const DEMO_AGENT_EMAIL = "sahilmurtuza91@gmail.com";
// const DEMO_AGENT_PASSWORD = "12345678";

// const CLIENT_NAMES = [
//     "Rahul Mehta", "Sara Khan", "Amit Verma", "Priya Nair", "Vikram Rao",
//     "Anjali Gupta", "Karan Malhotra", "Neha Joshi",
// ];

// const PROPERTY_TYPES = ["Apartment", "Villa", "House", "Land"];
// const INTENTS = ["Buy", "Rent", "Sell"];
// const AREAS = ["Bandra West", "Andheri East", "Powai", "Whitefield", "Koramangala", "Sector 62 Noida"];

// const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
// const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

// const run = async () => {
//     await connectDB();

//     // ---------------------------------------------------------------
//     // 1. Demo agent (the account you actually log into)
//     // ---------------------------------------------------------------
//     let agent = await User.findOne({ email: DEMO_AGENT_EMAIL });
//     if (!agent) {
//         agent = await User.create({
//             name: "Alex Carter",
//             email: DEMO_AGENT_EMAIL,
//             password: DEMO_AGENT_PASSWORD,
//             phone: "9876500001",
//             countryCode: "+91",
//             isEmailVerified: true,
//             isPhoneVerified: true,
//             role: "agent",
//             avatarUrl: "https://i.pravatar.cc/300?img=12",
//             bio: "Real estate agent specializing in residential properties across Mumbai & Bangalore.",
//             rating: 4.6,
//             reviewCount: 128,
//             // NEW fields (this pass): back the previously-hardcoded rating
//             // breakdown + profile view stat on the dashboard.
//             ratingBreakdown: { 5: 98, 4: 22, 3: 6, 2: 1, 1: 1 },
//             profileViewCount: 1240,
//             isProfileComplete: true, // demo login shouldn't hit ProfileSetup
//             experienceYears: 6,
//             specialties: ["Residential", "Luxury Homes"],
//             languagesSpoken: ["English", "Hindi"],
//             currentCity: "Mumbai, India",
//             isAvailable: true,
//             licenseType: "Real Estate Broker",
//             licenseNumber: "RERA-MH-2019-00452",
//             licenseState: "Maharashtra",
//             isLicenseVerified: true,
//             myReferralCode: "ALEX4F2B",
//         });
//         console.log(`✅ Demo agent created: ${DEMO_AGENT_EMAIL} / ${DEMO_AGENT_PASSWORD}`);
//     } else {
//         console.log("↺ Demo agent already exists, skipping creation.");
//     }

//     // ---------------------------------------------------------------
//     // 2. A handful of client users (the people who message/request the agent)
//     // ---------------------------------------------------------------
//     const clientUsers = [];
//     for (let i = 0; i < CLIENT_NAMES.length; i++) {
//         const name = CLIENT_NAMES[i];
//         const email = `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`;
//         let client = await User.findOne({ email });
//         if (!client) {
//             client = await User.create({
//                 name,
//                 email,
//                 password: "Client@1234",
//                 phone: `98765${String(10 + i).padStart(5, "0")}`,
//                 countryCode: "+91",
//                 isEmailVerified: true,
//                 role: "client",
//                 avatarUrl: `https://i.pravatar.cc/150?img=${20 + i}`,
//                 currentCity: randomFrom(AREAS),
//                 myReferralCode: `CLIENT${String(i + 1).padStart(2, "0")}`,
//             });
//         }
//         clientUsers.push(client);
//     }
//     console.log(`✅ ${clientUsers.length} demo clients ready.`);

//     // ---------------------------------------------------------------
//     // 3. Client (showing) requests -> feeds OverviewCards + PerformanceChart
//     // ---------------------------------------------------------------
//     const existingRequests = await ClientRequest.countDocuments({ assignedAgent: agent._id });
//     if (existingRequests === 0) {
//         const requests = [];
//         for (let i = 0; i < 24; i++) {
//             const client = randomFrom(clientUsers);
//             requests.push({
//                 assignedAgent: agent._id,
//                 clientUser: client._id,
//                 name: client.name,
//                 avatarUrl: client.avatarUrl,
//                 intent: randomFrom(INTENTS),
//                 address: `${100 + i}, ${randomFrom(AREAS)}`,
//                 status: randomFrom(["pending", "approved", "completed", "pending"]),
//                 budgetMin: 3000000 + i * 100000,
//                 budgetMax: 6000000 + i * 150000,
//                 propertyType: randomFrom(PROPERTY_TYPES),
//                 preferredArea: randomFrom(AREAS),
//                 createdAt: daysAgo(Math.floor(Math.random() * 340)),
//             });
//         }
//         // insertMany with explicit createdAt needs timestamps disabled per-doc;
//         // easiest is to create then patch createdAt directly.
//         const created = await ClientRequest.insertMany(requests, { timestamps: true });
//         await Promise.all(
//             created.map((doc, i) => ClientRequest.updateOne({ _id: doc._id }, { createdAt: requests[i].createdAt }))
//         );
//         console.log(`✅ ${created.length} demo client requests seeded.`);
//     } else {
//         console.log("↺ Client requests already exist, skipping.");
//     }

//     // ---------------------------------------------------------------
//     // 4. Conversations + messages -> feeds Chat tab
//     // ---------------------------------------------------------------
//     const existingConversations = await Conversation.countDocuments({ participants: agent._id });
//     if (existingConversations === 0) {
//         for (const client of clientUsers.slice(0, 5)) {
//             const conversation = await Conversation.create({
//                 participants: [agent._id, client._id],
//                 unreadCounts: { [agent._id.toString()]: 0, [client._id.toString()]: 0 },
//             });
//             const scripted = [
//                 { from: client, text: "Hi, is the Bandra apartment still available?" },
//                 { from: agent, text: "Yes it is! Would you like to schedule a viewing this week?" },
//                 { from: client, text: "That works, how about Saturday morning?" },
//                 { from: agent, text: "Saturday 11 AM works for me. I'll send the exact address." },
//             ];
//             let lastMsg = null;
//             for (let i = 0; i < scripted.length; i++) {
//                 lastMsg = await Message.create({
//                     conversation: conversation._id,
//                     sender: scripted[i].from._id,
//                     text: scripted[i].text,
//                     messageType: "text",
//                     createdAt: daysAgo(3 - i * 0.3),
//                 });
//             }
//             conversation.lastMessage = scripted[scripted.length - 1].text;
//             conversation.lastMessageAt = new Date();
//             conversation.lastMessageSender = agent._id;
//             await conversation.save();
//         }
//         console.log("✅ 5 demo conversations with message history seeded.");
//     } else {
//         console.log("↺ Conversations already exist, skipping.");
//     }

//     // ---------------------------------------------------------------
//     // 5. Referrals -> feeds the dashboard Referrals ring chart
//     // ---------------------------------------------------------------
//     const existingReferrals = await Referral.countDocuments({ referringAgent: agent._id });
//     if (existingReferrals === 0) {
//         const statuses = ["Pending", "Pending", "Pending", "Accepted", "Accepted", "Under Contract", "Closed", "Closed", "Closed", "Closed"];
//         const referrals = statuses.map((status, i) => ({
//             referringAgent: agent._id,
//             customerName: randomFrom(CLIENT_NAMES),
//             customerLocation: randomFrom(AREAS),
//             propertyType: randomFrom(PROPERTY_TYPES),
//             budget: 2000000 + i * 250000,
//             status,
//         }));
//         await Referral.insertMany(referrals);
//         console.log(`✅ ${referrals.length} demo referrals seeded.`);
//     } else {
//         console.log("↺ Referrals already exist, skipping.");
//     }

//     // ---------------------------------------------------------------
//     // 6. Daily activities
//     // ---------------------------------------------------------------
//     const existingActivities = await DailyActivity.countDocuments({ agent: agent._id });
//     if (existingActivities === 0) {
//         const activities = [
//             { category: "Property Handling", title: "Prepare listing photos for Powai 2BHK", status: "Completed" },
//             { category: "Client Meeting", title: "Site visit with Rahul Mehta", clientName: "Rahul Mehta", status: "Completed" },
//             { category: "Follow Up", title: "Call Priya Nair about loan pre-approval", clientName: "Priya Nair", status: "Ongoing" },
//             { category: "Client Meeting", title: "Virtual walkthrough with Vikram Rao", clientName: "Vikram Rao", status: "Ongoing" },
//         ].map((a, i) => ({ ...a, agent: agent._id, date: daysAgo(i) }));
//         await DailyActivity.insertMany(activities);
//         console.log(`✅ ${activities.length} demo daily activities seeded.`);
//     } else {
//         console.log("↺ Daily activities already exist, skipping.");
//     }

//     // ---------------------------------------------------------------
//     // 7. Notifications
//     // ---------------------------------------------------------------
//     const existingNotifications = await Notification.countDocuments({ recipient: agent._id });
//     if (existingNotifications === 0) {
//         const notifications = [
//             { message: "Sara Khan sent you a new showing request.", senderName: "Sara Khan", targetScreen: "ClientDetail" },
//             { message: "Your Ruby subscription renews in 5 days.", senderName: "VIZO", targetScreen: "SubscriptionPlansScreen" },
//             { message: "New message from Rahul Mehta.", senderName: "Rahul Mehta", targetScreen: "ChatDetailScreen" },
//         ].map((n) => ({ ...n, recipient: agent._id }));
//         await Notification.insertMany(notifications);
//         console.log(`✅ ${notifications.length} demo notifications seeded.`);
//     } else {
//         console.log("↺ Notifications already exist, skipping.");
//     }

//     // ---------------------------------------------------------------
//     // 8. Subscription plans (same defaults as /subscriptions/seed-plans)
//     // ---------------------------------------------------------------
//     const existingPlans = await SubscriptionPlan.countDocuments();
//     if (existingPlans === 0) {
//         await SubscriptionPlan.insertMany([
//             { name: "Diamond", tagLine: "Ultimate tier for top performing brokers", monthlyPrice: 99, annualPricePerMonth: 79, iconName: "diamond", features: ["Priority Lead Allocation", "Unlimited Showing Requests", "Featured Agent Badge", "Dedicated Account Manager"], sortOrder: 1 },
//             { name: "Ruby", tagLine: "Advanced plan for growing real estate teams", monthlyPrice: 69, annualPricePerMonth: 49, iconName: "ruby", features: ["Advanced Showing Requests", "Direct Client Messaging", "Profile Analytics"], sortOrder: 2 },
//             { name: "Sapphire", tagLine: "Standard plan for individual agents", monthlyPrice: 39, annualPricePerMonth: 29, iconName: "sapphire", features: ["Basic Showing Requests", "Standard Lead Access"], sortOrder: 3 },
//             { name: "Emerald", tagLine: "Starter plan for new realtors", monthlyPrice: 19, annualPricePerMonth: 15, iconName: "emerald", features: ["Community Access", "Basic Profile Listing"], sortOrder: 4 },
//         ]);
//         console.log("✅ 4 subscription plans seeded.");
//     } else {
//         console.log("↺ Subscription plans already exist, skipping.");
//     }

//     console.log("\n----------------------------------------------------");
//     console.log("Demo login -> email:", DEMO_AGENT_EMAIL, " password:", DEMO_AGENT_PASSWORD);
//     console.log("----------------------------------------------------\n");

//     await mongoose.connection.close();
//     process.exit(0);
// };

// run().catch((err) => {
//     console.error("Seeder failed:", err);
//     process.exit(1);
// });

require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db.config");

// All 13 Mongoose Models Imports
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

        // 1. PRIMARY AGENT 1
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
            bio: "Senior Real Estate Broker & Property Advisor specializing in Luxury Apartments, Villas & Commercial Properties across Mumbai & Bangalore.",
            rating: 4.8,
            reviewCount: 86,
            ratingBreakdown: { 5: 76, 4: 8, 3: 2, 2: 0, 1: 0 },
            experienceYears: 8,
            specialties: ["Luxury", "Residential", "Commercial", "Flats"],
            languagesSpoken: ["English", "Hindi", "Spanish", "French"],
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
        console.log(`✅ Primary Agent Created: ${PRIMARY_DEMO_EMAIL} / ${DEMO_PASSWORD}`);

        // 2. SECONDARY AGENT 2
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
            bio: "PropTech Specialist & Commercial Land Consultant.",
            rating: 4.9,
            reviewCount: 42,
            ratingBreakdown: { 5: 38, 4: 4, 3: 0, 2: 0, 1: 0 },
            experienceYears: 5,
            specialties: ["Commercial Properties", "Land & Plots"],
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
        });
        await secondaryAgent.save();
        console.log(`✅ Secondary Agent Created: ${SECONDARY_DEMO_EMAIL} / ${DEMO_PASSWORD}`);

        // 3. CO-AGENTS
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

        const samanthaLee = new User({
            name: "Samantha Lee",
            email: "samantha.lee@vizo.com",
            password: DEMO_PASSWORD,
            phone: "9876500002",
            countryCode: "+1",
            role: "agent",
            avatarUrl: "https://i.pravatar.cc/150?img=5",
            currentCity: "Newport Beach, CA 92660",
            myReferralCode: "SAMLEE007",
            isProfileComplete: true,
        });
        await samanthaLee.save();

        // 4. CLIENT USERS
        const clientDataList = [
            { name: "John Smith", email: "john.smith@gmail.com", phone: "9876510001", avatarUrl: "https://i.pravatar.cc/150?img=11", city: "123 Main St, Apt 4B, Mohali" },
            { name: "Maria Johnson", email: "maria.j@gmail.com", phone: "9876510002", avatarUrl: "https://i.pravatar.cc/150?img=9", city: "Powai, Mumbai" },
            { name: "William Butcher", email: "william.b@gmail.com", phone: "9876510003", avatarUrl: "https://i.pravatar.cc/150?img=60", city: "Andheri East, Mumbai" },
            { name: "Julia Black", email: "julia.black@gmail.com", phone: "9876510004", avatarUrl: "https://i.pravatar.cc/150?img=24", city: "Whitefield, Bangalore" },
            { name: "Rahul Mehta", email: "rahul.mehta@gmail.com", phone: "9876510005", avatarUrl: "https://i.pravatar.cc/150?img=68", city: "Worli, Mumbai" },
            { name: "Sara Khan", email: "sara.khan@gmail.com", phone: "9876510006", avatarUrl: "https://i.pravatar.cc/150?img=47", city: "Juhu, Mumbai" },
            { name: "Amit Verma", email: "amit.verma@gmail.com", phone: "9876510007", avatarUrl: "https://i.pravatar.cc/150?img=14", city: "Koramangala, Bangalore" },
            { name: "Priya Nair", email: "priya.nair@gmail.com", phone: "9876510008", avatarUrl: "https://i.pravatar.cc/150?img=32", city: "Indiranagar, Bangalore" },
            { name: "Vikram Rao", email: "vikram.rao@gmail.com", phone: "9876510009", avatarUrl: "https://i.pravatar.cc/150?img=53", city: "Sector 62, Noida" },
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

        // 5. SUBSCRIPTION PLANS & USER SUBSCRIPTION
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
            {
                name: "Sapphire",
                tagLine: "Standard plan for individual agents",
                monthlyPrice: 39,
                annualPricePerMonth: 29,
                iconName: "sapphire",
                features: ["Basic Showing Requests", "Standard Lead Access", "In-App Messaging"],
                isActive: true,
                sortOrder: 3,
            },
            {
                name: "Emerald",
                tagLine: "Starter plan for new realtors",
                monthlyPrice: 19,
                annualPricePerMonth: 15,
                iconName: "emerald",
                features: ["Community Access", "Basic Profile Listing"],
                isActive: true,
                sortOrder: 4,
            },
        ]);

        const rubyPlan = plans.find((p) => p.name === "Ruby");
        await UserSubscription.create({
            user: primaryAgent._id,
            plan: rubyPlan._id,
            billingCycle: "monthly",
            status: "active",
            startDate: daysAgo(20),
            expiryDate: daysAgo(-10),
            razorpayOrderId: "order_ruby_998877",
            razorpayPaymentId: "pay_ruby_112233",
        });
        console.log("✅ Subscription Plans & Active Plan Seeded.");

        // 6. CLIENT REQUESTS (47 Total)
        const clientRequestsData = [];
        for (let i = 0; i < 5; i++) {
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

        for (let i = 5; i < 47; i++) {
            const client = createdClients[i % createdClients.length];
            const isApproved = i % 2 === 0;
            clientRequestsData.push({
                assignedAgent: primaryAgent._id,
                clientUser: client._id,
                name: client.name,
                avatarUrl: client.avatarUrl,
                isVerified: i % 3 !== 0,
                intent: i % 3 === 0 ? "Sell" : i % 2 === 0 ? "Buy" : "Rent",
                distance: `${2.0 + (i % 5)} mi away`,
                address: `${200 + i}, Hiranandani Gardens, Powai`,
                selectedSlot: daysAgo(i % 10),
                clientNotes: "Looking for waterfront luxury condo with 2 parking spaces.",
                status: isApproved ? "approved" : i % 5 === 0 ? "completed" : "pending",
                budgetMin: 7500000,
                budgetMax: 25000000,
                propertyType: PropertyTypes[i % PropertyTypes.length],
                configuration: `${(i % 3) + 2} BHK`,
                preferredArea: Areas[i % Areas.length],
                location: {
                    type: "Point",
                    coordinates: [72.9050, 19.1176],
                },
                isReviewRequested: isApproved && i % 4 === 0,
                reviewRequestedAt: isApproved && i % 4 === 0 ? daysAgo(2) : null,
                createdAt: daysAgo(Math.floor(i * 3.5)),
            });
        }
        await ClientRequest.insertMany(clientRequestsData);
        console.log("✅ 47 Client Requests Seeded.");

        // 7. CONVERSATIONS & MESSAGES
        const johnSmithClient = createdClients.find((c) => c.name === "John Smith");
        const mariaClient = createdClients.find((c) => c.name === "Maria Johnson");
        const williamClient = createdClients.find((c) => c.name === "William Butcher");
        const juliaClient = createdClients.find((c) => c.name === "Julia Black");

        const convJohn = await Conversation.create({
            participants: [primaryAgent._id, johnSmithClient._id],
            lastMessage: "Mid or higher floor would be fine.",
            lastMessageAt: minutesAgo(5),
            lastMessageSender: primaryAgent._id,
            unreadCounts: { [primaryAgent._id.toString()]: 0, [johnSmithClient._id.toString()]: 0 },
        });

        await Message.insertMany([
            {
                conversation: convJohn._id,
                sender: johnSmithClient._id,
                text: "Hey! I saw your request for Looking home.",
                messageType: "text",
                isRead: true,
                createdAt: minutesAgo(45),
            },
            {
                conversation: convJohn._id,
                sender: primaryAgent._id,
                text: "Preferably ready-to-move. Also, I need good connectivity and nearby schools.",
                messageType: "text",
                isRead: true,
                createdAt: minutesAgo(35),
            },
            {
                conversation: convJohn._id,
                sender: johnSmithClient._id,
                text: "Got it. I have 2-3 good options in gated societies with amenities like parking, security, clubhouse, and nearby schools. Would you prefer higher floors or lower floors?",
                messageType: "text",
                isRead: true,
                createdAt: minutesAgo(15),
            },
            {
                conversation: convJohn._id,
                sender: primaryAgent._id,
                text: "Mid or higher floor would be fine.",
                messageType: "text",
                isRead: true,
                createdAt: minutesAgo(5),
            },
        ]);

        const convMaria = await Conversation.create({
            participants: [primaryAgent._id, mariaClient._id],
            lastMessage: "Did you like the property?",
            lastMessageAt: minutesAgo(120),
            lastMessageSender: mariaClient._id,
            unreadCounts: { [primaryAgent._id.toString()]: 2, [mariaClient._id.toString()]: 0 },
        });

        await Message.insertMany([
            { conversation: convMaria._id, sender: primaryAgent._id, text: "I've shared the video walkthrough of Powai 3BHK.", messageType: "text", isRead: true, createdAt: minutesAgo(180) },
            { conversation: convMaria._id, sender: mariaClient._id, text: "Thanks Sahil! Checking it out now.", messageType: "text", isRead: false, createdAt: minutesAgo(140) },
            { conversation: convMaria._id, sender: mariaClient._id, text: "Did you like the property?", messageType: "text", isRead: false, createdAt: minutesAgo(120) },
        ]);

        const convWilliam = await Conversation.create({
            participants: [primaryAgent._id, williamClient._id],
            lastMessage: "Yeah, Sure!",
            lastMessageAt: daysAgo(1),
            lastMessageSender: williamClient._id,
            unreadCounts: { [primaryAgent._id.toString()]: 0, [williamClient._id.toString()]: 0 },
        });
        await Message.create({ conversation: convWilliam._id, sender: williamClient._id, text: "Yeah, Sure!", messageType: "text", isRead: true, createdAt: daysAgo(1) });

        const convJulia = await Conversation.create({
            participants: [primaryAgent._id, juliaClient._id],
            lastMessage: "Hi, How are you?",
            lastMessageAt: minutesAgo(240),
            lastMessageSender: juliaClient._id,
            unreadCounts: { [primaryAgent._id.toString()]: 0, [juliaClient._id.toString()]: 0 },
        });
        await Message.create({ conversation: convJulia._id, sender: juliaClient._id, text: "Hi, How are you?", messageType: "text", isRead: true, createdAt: minutesAgo(240) });

        console.log("✅ Chat Conversations & Messages Seeded.");

        // 8. REFERRALS (🛠️ FIXED: acceptedByAgent: null without quotes)
        const referralItems = [];
        for (let i = 0; i < 19; i++) {
            referralItems.push({
                referringAgent: primaryAgent._id,
                acceptedByAgent: secondaryAgent._id,
                customerName: `Client Ref ${i + 1}`,
                customerLocation: Areas[i % Areas.length],
                propertyType: PropertyTypes[i % PropertyTypes.length],
                budget: 8000000 + i * 500000,
                referralFeePercent: 25,
                notes: "Client looking for urgent possession.",
                status: "Accepted",
                rewardAmount: 2500,
            });
        }
        for (let i = 0; i < 10; i++) {
            referralItems.push({
                referringAgent: primaryAgent._id,
                acceptedByAgent: null, // 🛠️ FIXED: Real null value
                customerName: `Pending Lead ${i + 1}`,
                customerLocation: Areas[i % Areas.length],
                propertyType: PropertyTypes[i % PropertyTypes.length],
                budget: 12000000,
                referralFeePercent: 25,
                notes: "Awaiting co-broker acceptance.",
                status: "Pending",
                rewardAmount: 0,
            });
        }
        for (let i = 0; i < 6; i++) {
            referralItems.push({
                referringAgent: primaryAgent._id,
                acceptedByAgent: secondaryAgent._id,
                customerName: `Closed Deal ${i + 1}`,
                customerLocation: "Bandra West, Mumbai",
                propertyType: "Villa",
                budget: 35000000,
                referralFeePercent: 25,
                notes: "Deal successfully registered at registrar office.",
                status: "Closed",
                rewardAmount: 15000,
            });
        }
        await Referral.insertMany(referralItems);
        console.log("✅ 35 Referrals Seeded.");

        // 9. SHOWING LOCATION REQUESTS
        await ShowingLocationRequest.insertMany([
            {
                requestedBy: primaryAgent._id,
                sharedBy: albertBlack._id,
                mlsPropertyId: "12345678",
                propertyTitle: "1234 Ocean View Dr.",
                propertyAddress: "Newport Beach, CA 92660",
                propertyImageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
                requestedShowingDate: new Date("2026-08-22"),
                requestedShowingTime: "9:30 AM - 10:30 AM",
                message: "Hi!, I have a showing schedule and would love to see your ETA. Thanks!",
                status: "accepted",
                currentLocation: {
                    type: "Point",
                    coordinates: [-117.9298, 33.6189],
                },
                etaMinutes: 5,
                lastLocationUpdateAt: Date.now(),
            },
            {
                requestedBy: primaryAgent._id,
                sharedBy: samanthaLee._id,
                mlsPropertyId: "87654321",
                propertyTitle: "251 antiliya View Dr.",
                propertyAddress: "Newport Beach, CA 92660",
                propertyImageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
                requestedShowingDate: new Date("2026-08-22"),
                requestedShowingTime: "11:00 AM - 12:00 PM",
                message: "Looking forward to seeing the property location.",
                status: "live",
                currentLocation: {
                    type: "Point",
                    coordinates: [-117.9300, 33.6200],
                },
                etaMinutes: 8,
                lastLocationUpdateAt: Date.now(),
            },
        ]);
        console.log("✅ Showing Location Requests Seeded.");

        // 10. DAILY ACTIVITIES
        await DailyActivity.insertMany([
            {
                agent: primaryAgent._id,
                category: "Property Handling",
                title: "Prepare listing photos for Powai 3BHK Apartment",
                clientName: "Rahul Mehta",
                propertyRef: "PROP-POWAI-301",
                date: new Date(),
                status: "Completed",
            },
            {
                agent: primaryAgent._id,
                category: "Client Meeting",
                title: "Site visit at Bandra West Villa with John Smith",
                clientName: "John Smith",
                propertyRef: "PROP-BANDRA-09",
                date: new Date(),
                status: "Completed",
            },
            {
                agent: primaryAgent._id,
                category: "Follow Up",
                title: "Call Priya Nair about bank pre-approval documents",
                clientName: "Priya Nair",
                propertyRef: "PROP-WHITEFIELD-12",
                date: new Date(),
                status: "Ongoing",
            },
            {
                agent: primaryAgent._id,
                category: "Client Meeting",
                title: "Virtual walkthrough with Vikram Rao for Koramangala Plot",
                clientName: "Vikram Rao",
                propertyRef: "PROP-KORA-55",
                date: new Date(),
                status: "Ongoing",
            },
        ]);
        console.log("✅ Daily Activities Seeded.");

        // 11. NOTIFICATIONS
        await Notification.insertMany([
            {
                recipient: primaryAgent._id,
                senderName: "John Smith",
                senderImage: "https://i.pravatar.cc/150?img=11",
                message: "John Smith approved your viewing request for Bandra Apartment.",
                isRead: false,
                targetScreen: "ClientDetail",
                createdAt: minutesAgo(10),
            },
            {
                recipient: primaryAgent._id,
                senderName: "Sara Khan",
                senderImage: "https://i.pravatar.cc/150?img=47",
                message: "Sara Khan sent you a new showing request for Juhu Beach Villa.",
                isRead: false,
                targetScreen: "ClientDetail",
                createdAt: minutesAgo(45),
            },
            {
                recipient: primaryAgent._id,
                senderName: "VIZO Platform",
                senderImage: "https://i.pravatar.cc/150?img=33",
                message: "Your Ruby Plan subscription will renew in 10 days.",
                isRead: true,
                targetScreen: "SubscriptionPlansScreen",
                createdAt: daysAgo(1),
            },
            {
                recipient: primaryAgent._id,
                senderName: "Maria Johnson",
                senderImage: "https://i.pravatar.cc/150?img=9",
                message: "New message: 'Did you like the property?'",
                isRead: true,
                targetScreen: "ChatDetailScreen",
                createdAt: daysAgo(2),
            },
        ]);
        console.log("✅ Notifications Seeded.");

        // 12. SUPPORT TICKETS
        await Ticket.insertMany([
            {
                user: primaryAgent._id,
                ticketNumber: "#10024",
                issueType: "Technical Issue",
                description: "GPS location tracking dot was slightly lagging during live showing.",
                status: "In Progress",
            },
            {
                user: primaryAgent._id,
                ticketNumber: "#10018",
                issueType: "Upload Issue",
                description: "License document image re-upload verification required.",
                status: "Resolved",
            },
        ]);
        console.log("✅ Support Tickets Seeded.");

        // 13. INVITES & WORKING HOURS
        await Invite.create({
            invitedBy: primaryAgent._id,
            friendName: "Rohan Sharma",
            friendContact: "rohan@gmail.com",
            referralStatus: "Successful",
            rewardAmount: 50,
        });

        await WorkingHours.create({
            user: primaryAgent._id,
            hours: [
                { dayShort: "S", dayFull: "Sunday", isAvailable: false, startTime: "", endTime: "" },
                { dayShort: "M", dayFull: "Monday", isAvailable: true, startTime: "9:00 AM", endTime: "6:00 PM" },
                { dayShort: "T", dayFull: "Tuesday", isAvailable: true, startTime: "9:00 AM", endTime: "6:00 PM" },
                { dayShort: "W", dayFull: "Wednesday", isAvailable: true, startTime: "9:00 AM", endTime: "6:00 PM" },
                { dayShort: "T", dayFull: "Thursday", isAvailable: true, startTime: "9:00 AM", endTime: "6:00 PM" },
                { dayShort: "F", dayFull: "Friday", isAvailable: true, startTime: "9:00 AM", endTime: "5:00 PM" },
                { dayShort: "S", dayFull: "Saturday", isAvailable: true, startTime: "10:00 AM", endTime: "4:00 PM" },
            ],
            selectedDate: ["2026-12-01", "2026-12-02", "2026-12-15"],
            syncedCalendar: "Google Calendar",
            isCalendarSynced: true,
        });
        console.log("✅ Invites & Working Hours Seeded.");

        console.log("\n==========================================================");
        console.log("🚀 ALL DATABASE MODELS SEEDED SUCCESSFULLY!");
        console.log("==========================================================");
        console.log(`🔑 PRIMARY LOGIN 1   : ${PRIMARY_DEMO_EMAIL}`);
        console.log(`🔑 PRIMARY LOGIN 2   : ${SECONDARY_DEMO_EMAIL}`);
        console.log(`🔒 PASSWORD FOR BOTH : ${DEMO_PASSWORD}`);
        console.log("==========================================================\n");

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeder script failed:", error);
        process.exit(1);
    }
};

runSeeder();