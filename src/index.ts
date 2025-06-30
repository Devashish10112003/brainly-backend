import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.route";
import contentRoutes from "./routes/content.route";
import shareRoutes from "./routes/share.route";



const app=express();
app.use(express.json());
app.use(cors());

app.use('api/v1/auth',authRoutes);
app.use('api/v1/content',contentRoutes);
app.use('api/v1/share',shareRoutes);



app.listen(3000);