import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function handler(event) {
    console.log("Received Request");

    if (event.httpMethod === 'POST') {
        console.log("Processing POST request");

        const { prompt } = JSON.parse(event.body);
        console.log("Prompt Received:", prompt);

        try {
            const completion = await openai.createCompletion({
                model: "text-davinci-003",
                prompt,
                max_tokens: 150
            });

            console.log("Completion Received:", completion.data.choices[0].text.trim());

            return {
                statusCode: 200,
                body: JSON.stringify({ response: completion.data.choices[0].text.trim() })
            };
        } catch (error) {
            console.error("Error with OpenAI API:", error.response?.data || error.message);
            return {
                statusCode: 500,
                body: JSON.stringify({ response: "Error generating response." })
            };
        }
    } else {
        return {
            statusCode: 405,
            body: JSON.stringify({ response: 'Method Not Allowed' })
        };
    }
}
