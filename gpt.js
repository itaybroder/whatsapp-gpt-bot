const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const generateSummary = async (chatHistory) => {
  try {

      // Format conversation text for GPT model
      let text = chatHistory.map(msg => {
        let sender = (msg.fromMe) ? "Itay" : "Nadav(Friend)";
        return `${sender}: ${msg.body}`;
      }).join('\n');

      // Construct prompt
      let prompt = `
          "Given the conversation of Itay and his friend Nadav,
          ${text}
          shortly summarize the key points discussed in less than 35 words
      `;

      const chatCompletion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "system", content: "You are an AI that can summarize very well chat conversations between people"}, {role: "user", content: prompt}],
      });

    return chatCompletion.data.choices[0].message.content;
  } catch (error) {
    console.error(error);
  }
};

const generateResponse = async (formattedPrompt) => {
  try {
    let completion = await openai.createCompletion({
      model: "davinci:ft-intune:itai-training-2023-06-28-19-55-57",
      prompt: formattedPrompt,
      temperature: 0,
      max_tokens: 250,
    });
    let response = completion.data.choices[0].text;
    
    // Remove "<Media omitted>" from response
    response = response.replace(/<Media omitted>/g, '');

    console.log(response);

    if (response.startsWith('->')) {
      response = response.slice(2).trim();
    }

    return response;
  } catch (error) {
    console.error(error);
  }
};
prompt_ex = "<Summary: Itay is tired and studying, while Nadav asks about his day and what he's doing. They inquire about each other's well-being and mention their fathers.>\\n\\n###\\n\\nFriend: תספר לי מה קורה איתך\\nFriend: עייף היום האמת ו\\nאיתי: לומד.. מה איתך\\nFriend: מה אתה עושה היום\\nאיתי: שמע אתה אחלה גבר באמת\\nFriend: אבא סבבה\\nאיתי: בסדר הכל טוב? מה עם אבא\\nFriend: היי אחי, אני אחלה מה איתך\\nאיתי: היי מה קורה\\nFriend: \\n->"
generateResponse(prompt_ex)
module.exports = { generateResponse, generateSummary };


