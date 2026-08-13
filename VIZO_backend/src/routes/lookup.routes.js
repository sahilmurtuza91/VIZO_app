const express = require("express");

const router = express.Router();

const {
    getAllLookupData,
} = require("../controllers/lookup.controller");

router.get("/", getAllLookupData);

module.exports = router;