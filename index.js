import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

app.get("/ping", (req, res) => {
	if (req.statusCode === "200") {
		res.send("Health Check Request Successful");
	} else {
		res.send("Health Check Request Failed");
	}
});

// Market Insights
app.get("/market-insights", async (req, res) => {
	const industry = req.query.industry;
	const region = req.query.region;

	const prompt = `Provide key market insights for the ${industry} industry in ${region}, covering trends, opportunities, challenges, major players, and future outlook. Return the response in raw JSON format with the following fields: trends (as a list), opportunities, challenges, major_players (as a list), and future_outlook. Do not include any symbols, markdown formatting, or backticks.`;

	const completion = await openai.chat.completions.create({
		messages: [{ role: "user", content: prompt }],
		model: "gpt-4o-mini",
	});

	res.send(completion.choices[0].message.content);
});

// Tech Stack
app.get("/get-tech-stack", async (req, res) => {
	const idea_description = req.query.idea_description;
	const scale = req.query.scale;

	const prompt = `Suggest the most suitable tech stack for building a ${scale} project described as: '${idea_description}'. Return the response in raw JSON format with the following fields: frontend, backend, database, devops_tools, and additional_technologies. Do not include any symbols, markdown formatting, or backticks.`;

	const completion = await openai.chat.completions.create({
		messages: [{ role: "user", content: prompt }],
		model: "gpt-4o-mini",
	});

	res.send(completion.choices[0].message.content);
});

// Monetization Strategies
app.get("/monetization-strategies", async (req, res) => {
	const idea_description = req.query.idea_description;

	const prompt = `Suggest effective monetization strategies for a startup idea described as: '${idea_description}'. Return the response in raw JSON format with the following fields: strategies (as a list), target_audience, and business_type. Do not include any symbols, markdown formatting, or backticks.`;

	const completion = await openai.chat.completions.create({
		messages: [{ role: "user", content: prompt }],
		model: "gpt-4o-mini",
	});

	res.send(completion.choices[0].message.content);
});

// Generate Startup Idea
app.get("/generate-idea", async (req, res) => {
	const industry = req.query.industry;
	const skills = req.query.skills;
	const budget = req.query.budget;
	const target_audience = req.query.target_audience;
	const passions = req.query.passions;

	const prompt = `Create a unique startup idea based on the following: industry (${industry}), available skills (${skills}), budget (${budget}), target audience (${target_audience}), and passions (${passions}). Return the response in raw JSON format with the following fields: startup_name, overview, key_features (as a list), what_sets_it_apart, target_audience, and conclusion. Do not include any symbols, markdown formatting, or backticks.`;

	const completion = await openai.chat.completions.create({
		messages: [{ role: "user", content: prompt }],
		model: "gpt-4o-mini",
	});

	res.send(completion.choices[0].message.content);
});

// Refine Idea
app.get("/refine-idea", async (req, res) => {
	const idea_description = req.query.idea_description;
	const refinement_criteria = req.query.refinement_criteria;

	const prompt = `Refine the startup idea described as: '${idea_description}' based on the following criteria: ${refinement_criteria}. Return the response in raw JSON format with the following fields: improved_idea, additional_features (as a list), and adjustments. Do not include any symbols, markdown formatting, or backticks.`;

	const completion = await openai.chat.completions.create({
		messages: [{ role: "user", content: prompt }],
		model: "gpt-4o-mini",
	});

	res.send(completion.choices[0].message.content);
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

// TODO: The idea_id implementation was to created by saving the contents of the /generate-idea endpoint to a database and then using the idea_id to retrieve the idea for further refinement. This can be implemented using a database like MongoDB or Firebase Firestore.
// TODO: Split the response into key value pairs in an object and send the object as the response to the client.
