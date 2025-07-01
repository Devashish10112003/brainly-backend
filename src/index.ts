import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route";
import contentRoutes from "./routes/content.route";
import shareRoutes from "./routes/share.route";
import coookieParser from "cookie-parser";

import { ENV_VARS } from "./config/envVars";


const app=express();
const PORT=ENV_VARS.PORT;
app.use(express.json());
app.use(coookieParser());
app.use(cors());

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/content',contentRoutes);
app.use('/api/v1/share',shareRoutes);



app.listen(PORT,()=>{
    console.log("server started running at https://localhost:"+PORT);
});