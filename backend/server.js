import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./config/db.js";
import doctorRouter from "./routes/doctorRouter.js";
import serviceRouter from "./routes/serviceRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import serviceAppointmentRouter from "./routes/serviceAppointmentRouter.js";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
console.log("Found .env?", fs.existsSync(".env"));

const app = express();
const PORT = process.env.PORT || 4000;

const allowedOrigins = [
  "https://caresync-frontend-brown.vercel.app",
  "https://caresync-admin-psi.vercel.app",
];

// MIDDLEWARES
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(clerkMiddleware());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// DB
connectDB();

// ROUTES
app.use("/api/doctors", doctorRouter);
app.use("/api/services", serviceRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/services-appointments", serviceAppointmentRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

// PING ENDPOINT FOR RENDER COOLDOWN
app
  .route("/health")
  .get((req, res) => {
    res.status(200).json({ status: "ok" });
  })
  .head((req, res) => {
    res.sendStatus(200);
  });

app.listen(PORT, () => {
  console.log(`Server Started http://localhost:${PORT}`);
});
