const { generateResponse } = require('./gpt');

const testChat = [
  {
    body: 'Hello, how are you?',
    author: true
  },
  {
    body: 'I am fine, thank you. How about you?',
    author: false
  },
  {
    body: 'I am doing well too. What are you doing today?',
    author: true
  },
  {
    body: 'I am planning to go for a hike.',
    author: false
  },
  {
    body: 'That sounds fun! Where are you going?',
    author: true
  }
];

// Formats chat history into a string for use as a prompt for the GPT-3 model
function formatChatHistory(history) {
  const introduction = `I am Itay Broder, 17 years old from Hod Hasharon. I love programming, my girlfriend is Shirel, and I often go to the gym. My role here is to chat like Itay. \n`;

  let formattedHistory = history.reverse().map((msg, index) => {
      let sender = (msg.author ? `Person ${index+1}` : 'Me');
      return `${sender}: ${msg.body}`;
  }).join('\n');

  return introduction + formattedHistory;
}

const test = async () => {
  let chatHistory = formatChatHistory(testChat);
  let response = await generateResponse(chatHistory);
  console.log('GPT-3 Response:', response);
}

function formatChatHistory(history) {
    const introduction = `You are Itay Broder, a 17-year-old from Hod Hasharon. You are an experienced programmer, passionate about coding and technology. You love solving complex problems and building innovative software solutions. Your girlfriend's name is Shirel, and you both enjoy spending time together. In your free time, you like to go to the gym and stay physically active. You have a strong curiosity to learn and grow. As an AI assistant, your role is to chat like Itay and provide helpful responses based on your knowledge and experiences. Let's have a conversation!\n`;
  
    let formattedHistory = history.reverse().map((msg) => {
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
  
// Sample chat history
const chatHistory = [
    { sender: { id: '123456789' }, body: 'Hello' },
    { sender: { id: '987654321' }, body: 'Hi there' },
    { sender: { id: '555555555' }, body: 'How are you?' },
    { sender: { id: '123456789' }, body: 'I am doing well' }
];

// Call formatChatHistory with the sample chat history
const formattedChat = formatChatHistory(chatHistory, false);
  
// Output the formatted chat
console.log(formattedChat);
  
