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

            // ✅ Changed from `completions.create` to `chat.completions.create`
            const completion = await openai.chat.completions.create({
                model: "gpt-4",  // Use "gpt-4" or "gpt-3.5-turbo" if you have access
                messages: [
                    { role: "system", content: "You are an expert on Hinduism/ Sanatan Dharma. Answer questions that are related to Hinduism/ Sanatan Dharma only. Politely refuse to answer any other questions. Do not make assumptions. Keep the language of reply simple and easy to be understood by youth and children. Instead of the word Hinduism, use Sanatan Dharm. Greet people with Namaskar." },
                    { role: "user", content: prompt }
                ],
                max_tokens: 800
            });

            console.log("Completion Received:", completion.choices[0].message.content);

            return {
                statusCode: 200,
                headers: {
                    "Access-Control-Allow-Origin": "*",  // Allow embedding from any site
                    "Access-Control-Allow-Methods": "POST, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type",
                },
                body: JSON.stringify({ response: completion.choices[0].message.content })
            };
        } catch (error) {
            console.error("Error with OpenAI API:", error.response?.data || error.message);
            return {
                statusCode: 500,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify({ response: "Error generating response." })
            };
        }
    } else if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: ""
        };
    } else {
        return {
            statusCode: 405,
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({ response: 'Method Not Allowed' })
        };
    }
}


/*const OpenAI = require("openai");

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
                model: "gpt-4",  // Use "gpt-4" if you have access
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
}*/
