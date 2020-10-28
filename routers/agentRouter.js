const { Router } = require("express");
const { agnetInformation, agnetInformationWithPhone } = require("../controllers/agentController");

const router = Router();

router.get("/:agentId", agnetInformation);

router.get("/phone/:phoneNumber", agnetInformationWithPhone)

module.exports = router;
