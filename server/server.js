
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import productRoutes from "./routes/productRoutes.js";
import prisma from "./db/prisma.js";


const app = express();

const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

console.log(__dirname);

app.use(express.json());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(morgan("dev"));

app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
  // server our react app
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("/{*splat}", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`);
});


