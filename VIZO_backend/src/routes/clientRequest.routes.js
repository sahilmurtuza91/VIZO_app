const express = require("express");
const router = express.Router();

const { getAllRequest, getRequestById,createRequest, updateRequestStatus, requestReview} = require("../controllers/clientRequest.controller");

const { protect } = require("../middlewares/auth");

router.use(protect);

router.route("/")
    .get(getAllRequest)
    .post(createRequest)

router.get("/:id", getRequestById);

router.patch("/:id/status", updateRequestStatus);

router.patch("/:id/request-review", requestReview);

module.exports = router;