const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const { generateResponse, generateSummary } = require('./gpt');

const client = new Client();
const respondToGroups = false; // Set to true if you want the bot to respond to groups
const messageLimit = 10; // Set this to the number of messages you want to use for generating the summary

client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message',  msg => {
    onMessage(msg)
});

client.initialize();

async function fetchChatHistory(chat) {
    let allMessages = await chat.fetchMessages({limit: messageLimit});
    return allMessages.reverse();
}

function formatChatPrompt(summary, lastMessages) {
    let formattedPrompt = `<Summary: ${summary}>\n\n###\n\n`;

    let formattedMessages = lastMessages.map((msg) => {
        let sender = (msg.fromMe) ? "איתי" : "Friend";
        return `${sender}: ${msg.body}`;
    }).join('\n');

    formattedPrompt+=formattedMessages
    return formattedPrompt + "\n->";
}

const  onMessage = async (msg) => {
    try {
        if (!respondToGroups && msg.isGroup) {
            return;
        }
        const chat = await msg.getChat();
        let history = await fetchChatHistory(chat);
        const summary = await generateSummary(history);
        let formattedPrompt = formatChatPrompt(summary, history);
        const reply = await generateResponse(formattedPrompt);
        chat.sendMessage(reply);
    } catch (error) {
        console.error('Error handling message:', error);
    }
}
