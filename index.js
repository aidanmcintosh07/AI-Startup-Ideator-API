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

	const prompt = `Provide a concise summary of key market insights for the ${industry} industry in ${region}, covering trends, opportunities, challenges, major players, and future outlook. Ensure the output is clean, professional, and free of any symbols or markdown formatting.`;

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

	const prompt = `Suggest the most suitable tech stack for building a ${scale} project described as: '${idea_description}'. Include frontend, backend, database, and any other relevant technologies. Keep the response concise and practical. Ensure the output is clean, professional, and free of any symbols or markdown formatting.`;

	const completion = await openai.chat.completions.create({
		messages: [{ role: "user", content: prompt }],
		model: "gpt-4o-mini",
	});

	res.send(completion.choices[0].message.content);
});

// Monetization Strategies
app.get("/monetization-strategies", async (req, res) => {
	const idea_description = req.query.idea_description;

	const prompt = `Suggest effective monetization strategies for a startup idea described as: '${idea_description}'. Include specific methods tailored to the target audience and business type. Keep the response practical and concise. Ensure the output is clean, professional, and free of any symbols or markdown formatting.`;

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

	const prompt = `Create a unique startup idea based on the following: industry (${industry}), available skills (${skills}), budget (${budget}), target audience (${target_audience}), and passions (${passions}). Provide a clear, structured response with labeled sections like Startup Idea, Overview, Key Features, What Sets It Apart, Target Audience, and Conclusion. Ensure the output is clean, professional, and free of any symbols or markdown formatting.`;

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

	const prompt = `Refine the startup idea described as: '${idea_description}' based on the following criteria: ${refinement_criteria}. Provide specific improvements, additional features, or adjustments to make the idea more viable and appealing. Ensure the output is clean, professional, and free of any symbols or markdown formatting.`;

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
