const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
    if (event.httpMethod === 'POST') {
        const { prompt } = JSON.parse(event.body);

        try {
            const completion = await openai.createCompletion({
                model: "gpt-4o",  // Or "gpt-4" if you have access
                prompt,
                max_tokens: 150
            });

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
