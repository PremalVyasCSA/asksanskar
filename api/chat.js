import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { prompt } = req.body;

        try {
            const completion = await openai.createCompletion({
                model: "gpt-4o",  // Or "gpt-4" if you have access
                prompt,
                max_tokens: 150
            });

            res.status(200).json({ response: completion.data.choices[0].text.trim() });
        } catch (error) {
            console.error("Error with OpenAI API:", error.response?.data || error.message);
            res.status(500).json({ response: "Error generating response." });
        }
    } else {
        res.status(405).json({ response: 'Method Not Allowed' });
    }
}
