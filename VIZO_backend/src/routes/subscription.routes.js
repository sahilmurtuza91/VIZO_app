const express = require("express");

const router = express.Router();

const { getSubscriptionPlan, getCurrentSubscription, createSubscriptionOrder, verifySubscriptionPayment, seedSubscriptionPlans } = require("../controllers/subscription.controller");

const { protect } = require("../middlewares/auth");

router.get("/plans", getSubscriptionPlan);
router.post("/seed-plans", seedSubscriptionPlans);

router.use(protect);

router.get("/me", getCurrentSubscription);

router.post("/checkout", createSubscriptionOrder);

router.post("/verify", verifySubscriptionPayment);

module.exports = router;