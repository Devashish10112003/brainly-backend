import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import contentRoutes from "./routes/content.route.js";
import shareRoutes from "./routes/share.route.js";
import botRoutes from "./routes/bot.route.js";
import coookieParser from "cookie-parser";


import { ENV_VARS } from "./config/envVars.js";
import { initVectorStore} from "./utils/queryAndAskGemini.js";

const app=express();
const PORT=ENV_VARS.PORT;
app.use(express.json());
app.use(coookieParser());
app.use(cors());

let store=initVectorStore();

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/content',contentRoutes);
app.use('/api/v1/share',shareRoutes);
app.use('/api/v1/bot',botRoutes);



app.listen(PORT,()=>{
    console.log("server started running at https://localhost:"+PORT);
});