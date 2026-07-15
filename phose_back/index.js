import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from "./routes/userRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import errorHandler from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT;

app.use('/api/users', userRoutes); 
app.use('/api/services', serviceRoutes); 

app.get("/test", async (req, res) => {
  try {
    const { db } = await import("./config/firebase.js");
    res.json({ status: "ok", db: "connected" });
  } catch (err) {
    res.json({ status: "error", message: err.message });
  }
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
