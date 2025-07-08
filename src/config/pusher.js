// Example: Pusher configuration for production real-time chat
// Install: npm install pusher-js
// Uncomment and configure if you want to use Pusher instead of Socket.IO

/*
import Pusher from 'pusher-js';

const pusher = new Pusher('YOUR_PUSHER_APP_KEY', {
  cluster: 'YOUR_CLUSTER', // e.g., 'us2'
  encrypted: true
});

export const subscribeToChatChannel = (conversationId, onMessage) => {
  const channel = pusher.subscribe(`chat-${conversationId}`);
  
  channel.bind('new-message', (data) => {
    onMessage(data);
  });
  
  return () => {
    pusher.unsubscribe(`chat-${conversationId}`);
  };
};

export const sendMessageViaPusher = async (conversationId, message) => {
  // Send to your backend API which triggers Pusher event
  const response = await fetch('/api/chat/send-pusher', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ conversationId, message })
  });
  
  return response.json();
};

export default pusher;
*/

// For now, using HTTP polling in production and Socket.IO in development
export const isPusherEnabled = false; 