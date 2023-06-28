const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const { generateResponse, generateSummary } = require('./gpt');

const client = new Client();
const respondToGroups = false; // Set to true if you want the bot to respond to groups
const messageLimit = 5; // Set this to the number of messages you want to use for generating the summary

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', async msg => {
    try {
        console.log('MESSAGE RECEIVED', msg.body);
        const chat = await msg.getChat();

        // Do not reply to group messages if respondToGroups is set to false
        if (!respondToGroups && chat.isGroup) {
            return;
        }

        let history = await fetchChatHistory(chat);

        // Generate a summary from the chat history
        const summary = await generateSummary(history);

        // Fetch last 5 messages
        let lastMessages = await chat.fetchMessages({limit: messageLimit});

        // Format history into a prompt for the GPT-3 model
        let formattedPrompt = formatChatPrompt(summary, lastMessages, msg.fromMe, msg.author);

        const reply = await generateResponse(formattedPrompt);
        chat.sendMessage(reply);
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

client.initialize();

async function fetchChatHistory(chat) {
    let allMessages = await chat.fetchMessages();
    let totalChars = 0;
    let messages = [];

    for(let i = allMessages.length-1; i>=0; i--) {
        let message = allMessages[i];
        totalChars += message.body.length;
        if (totalChars > 2000) break; // Stop if messages exceed 2000 chars
        messages.unshift(message); // Insert message at the beginning of array
    }
    
    return messages;
}

// Formats chat history into a string for use as a prompt for the GPT-3 model
function formatChatPrompt(summary, lastMessages, fromMe, author) {
    let formattedPrompt = `<Summary: ${summary}>\n\n###\n\n`;
  
    let formattedMessages = lastMessages.map((msg) => {
        let sender = (msg.fromMe === fromMe) ? "איתי" : `Friend(${author || msg.contact.number})`;
        return `${sender}: ${msg.body}`;
    }).join('\n');
  
    return formattedPrompt + "\n->";
}
