import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import db from "./db/conn.mjs";
import { ObjectId } from "mongodb";

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
app.post("/generate-idea", async (req, res) => {
	const industry = req.query.industry;
	const skills = req.query.skills;
	const budget = req.query.budget;
	const target_audience = req.query.target_audience;
	const passions = req.query.passions;

	const prompt = `Create a unique startup idea based on the following: industry (${industry}), available skills (${skills}), budget (${budget}), target audience (${target_audience}), and passions (${passions}). Return the response in raw JSON format with the following fields: startup_name, overview, key_features (as a list), what_sets_it_apart, target_audience, and conclusion. Do not include any symbols, markdown formatting, or backticks.`;

	try {
		const completion = await openai.chat.completions.create({
			messages: [{ role: "user", content: prompt }],
			model: "gpt-4o-mini",
		});

		const startup_idea = db.collection("ideas");
		const newDoc = JSON.parse(completion.choices[0].message.content);

		await startup_idea.insertOne(newDoc);

		res.send({
			success: true,
			message: "Startup idea generated and saved successfully.",
			idea_id: newDoc._id,
			data: {
				startup_name: newDoc.startup_name,
				overview: newDoc.overview,
				key_features: newDoc.key_features,
				what_sets_it_apart: newDoc.what_sets_it_apart,
				target_audience: newDoc.target_audience,
				conclusion: newDoc.conclusion,
			},
		});
	} catch (error) {
		console.error("Error generating or saving startup idea:", error);
		res
			.status(500)
			.send("An error occurred while generating the startup idea.");
	}
});

// Refine Idea
app.get("/refine-idea", async (req, res) => {
	const idea_id = req.query.idea_id;
	const refinement_criteria = req.query.refinement_criteria;

	try {
		const ideas = db.collection("ideas");

		const query = { _id: new ObjectId(idea_id) };

		const idea = await ideas.findOne(query);

		if (!idea) {
			return res
				.status(404)
				.send({ success: false, message: "Idea not found." });
		}

		const prompt = `Refine the startup idea as shown: '${JSON.stringify(
			idea
		)}' based on the following criteria: ${refinement_criteria}. Return the response in raw JSON format with the following fields: improved_idea, additional_features (as a list), and adjustments. Do not include any symbols, markdown formatting, or backticks.`;

		const completion = await openai.chat.completions.create({
			messages: [{ role: "user", content: prompt }],
			model: "gpt-4o-mini",
		});

		const refinedContent = JSON.parse(completion.choices[0].message.content);

		res.send({
			success: true,
			message: "Startup idea refined successfully.",
			idea_id,
			data: refinedContent,
		});
	} catch (error) {
		console.error("Error refining startup idea:", error);
		res.status(500).send("An error occurred while refining the startup idea.");
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
