"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config/config");
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const recipeRoutes_1 = __importDefault(require("./routes/recipeRoutes"));
const calenderRoutes_1 = __importDefault(require("./routes/calenderRoutes"));
const searchRoutes_1 = __importDefault(require("./routes/searchRoutes"));
const node_cron_1 = __importDefault(require("node-cron"));
const calenderModel_1 = __importDefault(require("./models/calenderModel"));
const app = (0, express_1.default)();
(0, db_1.default)();
const port = 8000;
node_cron_1.default.schedule('50 23 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    yield calenderModel_1.default.updateMany({ completed: false, date: { $lt: date } }, {
        $set: {
            completed: true,
        },
    });
}));
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('Hello, this is Express + TypeScript');
});
app.use('/api/users', userRoutes_1.default);
app.use('/api/posts', postRoutes_1.default);
app.use('/api/comments', commentRoutes_1.default);
app.use('/api/recipes', recipeRoutes_1.default);
app.use('/api/calenders', calenderRoutes_1.default);
app.use('/api/search', searchRoutes_1.default);
app.listen(config_1.config.server.port, () => {
    console.log(`[Server]: I am running at http://localhost:${port}`);
});
