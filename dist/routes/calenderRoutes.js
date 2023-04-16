"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const calenderController_1 = require("../controller/calenderController");
const validateToken_1 = __importDefault(require("../middleware/validateToken"));
const router = express_1.default.Router();
router.get('/get-recipe-calender/:filter', validateToken_1.default, calenderController_1.getRecipeCalender);
router.put('/add-recipe-to-calender', validateToken_1.default, calenderController_1.addRecipeToCalender);
exports.default = router;
