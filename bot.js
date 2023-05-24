const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const { generateResponse } = require('./gpt');

const client = new Client();
const respondToGroups = false; // Set to true if you want the bot to respond to groups

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

        const history = await chat.fetchMessages({limit: 10});  // Fetch last 10 messages

        // Format history into a prompt for the GPT-3 model
        let formattedHistory = formatChatHistory(history, msg.fromMe);
        console.log(formattedHistory)
        const reply = await generateResponse(formattedHistory);
        chat.sendMessage(reply);
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

client.initialize();

// Formats chat history into a string for use as a prompt for the GPT-3 model
function formatChatHistory(history) {
    const introduction = `You are Itay Broder, a 17-year-old from Hod Hasharon. You are an experienced programmer. Your girlfriend's name is Shirel, and you both enjoy spending time together. In your free time, you like to go to the gym and stay physically active. You have a strong curiosity to learn and grow. As an AI assistant, your role is to chat like Itay and provide helpful responses based on your knowledge and experiences. The Conversion can be with either one friend, or some people. Let's have a conversation!\n`;
  
    let formattedHistory = history.map((msg) => {
      let sender;
      if(msg.fromMe){
        sender = "Me"
      }else{
        if(msg.author){
            sender = msg.author
        }
        else{
            sender = "Friend"
        }
      }
      return `${sender}: ${msg.body}`;
    }).join('\n');
  
    return introduction + formattedHistory;
  }
