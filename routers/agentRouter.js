const { Router } = require("express");
const { agnetInformation } = require("../controllers/agentController");

const router = Router();

router.get("/:agentId", agnetInformation);

module.exports = router;
