import express from "express";
import dotenv from "dotenv";
import cors from "cors";

//routes imported
import authRouter from "./routes/user";

const app = express();
dotenv.config();

const allowedOrigins = ["http://localhost:4200"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        console.error("CORS blocked origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(express.json());

//Base path for auth
app.use("/api/auth", authRouter);

const port = 8800;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
