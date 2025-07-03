import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import contentRoutes from "./routes/content.route.js";
import shareRoutes from "./routes/share.route.js";
import coookieParser from "cookie-parser";

import { ENV_VARS } from "./config/envVars.js";
import { initVectorStore,embedAndStoreContent,queryAndAskGemini } from "./utils/queryAndAskGemini.js";

const app=express();
const PORT=ENV_VARS.PORT;
app.use(express.json());
app.use(coookieParser());
app.use(cors());

async function vectortest() {
    let store=await initVectorStore();
    await embedAndStoreContent("Something about express being the best library to run backend",
    "THIS IS SOME CONTENT THAT SAYS SOME GOOD THING ABOUT EXPRESS","hello","hello",store);
}
vectortest();

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/content',contentRoutes);
app.use('/api/v1/share',shareRoutes);



app.listen(PORT,()=>{
    console.log("server started running at https://localhost:"+PORT);
});