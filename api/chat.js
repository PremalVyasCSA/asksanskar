const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

exports.handler = async (event) => {
    console.log("Received Request");

    if (event.httpMethod === 'POST') {
        console.log("Processing POST request");

        try {
            const { prompt } = JSON.parse(event.body);
            console.log("Prompt Received:", prompt);

            const completion = await openai.completions.create({
                model: "text-davinci-003",  // Use "gpt-4" if you have access
                prompt,
                max_tokens: 150
            });

            console.log("Completion Received:", completion.choices[0].text.trim());

            return {
                statusCode: 200,
                body: JSON.stringify({ response: completion.choices[0].text.trim() })
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
