const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateSummary = async (chatHistory) => {
  try {
    const prompt = chatHistory.map(msg => `${msg.fromMe ? 'איתי' : 'נדב'}: ${msg.body}`).join('\n');
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 60, // Adjust this value as needed
    });

    return completion.data.choices[0].text.trim();
  } catch (error) {
    console.log(error);
  }
};

const generateResponse = async (formattedPrompt) => {
  try {
    const completion = await openai.createCompletion({
      model: "your-fine-tuned-model-id", // Replace with your fine-tuned model ID
      prompt: formattedPrompt,
      max_tokens: 150, 
    });

    // Remove the arrow and newline from the start of the response
    let response = completion.data.choices[0].text.trim();
    if (response.startsWith('->')) {
      response = response.slice(2);
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { generateResponse, generateSummary };
