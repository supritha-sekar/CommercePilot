import express from "express";
import cors from "cors";
import apiRouter from "./src/routes/api.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "commercepilot-backend" });
});

app.listen(PORT, () => {
  console.log(`CommercePilot backend running on http://localhost:${PORT}`);
});
