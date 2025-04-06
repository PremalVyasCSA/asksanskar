const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

exports.handler = async (event) => {
    console.log("Received Request");  // Log incoming request

    if (event.httpMethod === 'POST') {
        console.log("Processing POST request");  // Log request type

        const { prompt } = JSON.parse(event.body);

        console.log("Prompt Received:", prompt);  // Log the received prompt

        try {
            const completion = await openai.createCompletion({
                model: "text-davinci-003",  // Use "gpt-4" if you have access
                prompt,
                max_tokens: 150
            });

            console.log("Completion Received:", completion.data.choices[0].text.trim());  // Log the completion text

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
        console.log("Method Not Allowed");  // Log invalid request method
        return {
            statusCode: 405,
            body: JSON.stringify({ response: 'Method Not Allowed' })
        };
    }
}
