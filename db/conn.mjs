import { MongoClient } from "mongodb";
const connectionString = process.env.ATLAS_URI || "";
const client = new MongoClient(connectionString, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
let db;
async function connectToDatabase() {
	try {
		await client.connect();
		db = client.db("ai_startup_ideator");
		console.log("Successfully connected to the database");
	} catch (e) {
		console.error("Connection error", e);
	}
}
connectToDatabase();
export default db;
