const express = require("express");

const router = express.Router();

const masterController = require("../controllers/master.controller");
const { route } = require("../app");

router.get("/countries", masterController.getCountries);

module.exports = router;