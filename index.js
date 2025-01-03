import "dotenv/config";
import express from "express";
import v1Router from "./routes/v1.js";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/api/v1", v1Router);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
