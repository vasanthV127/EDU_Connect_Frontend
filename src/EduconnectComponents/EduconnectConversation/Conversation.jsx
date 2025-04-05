import React, { useEffect, useState } from 'react';
import { makeAuthenticatedRequest,getUserId } from '../../services/auth.service';
import './Conversation.css'; // We'll create this next

const Conversation = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hardcoded senderId and receiverId for this example
  const senderId = 9; // Could come from props or context
  const receiverId = 7; // Could come from props or context
  const currentUserId = getUserId(); // Get the logged-in user's ID

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const endpoint = `/api/messages/conversation?senderId=${senderId}&receiverId=${receiverId}`;
        const data = await makeAuthenticatedRequest(endpoint);
        setMessages(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load conversation');
        setLoading(false);
      }
    };

    fetchConversation();
  }, [senderId, receiverId]); // Refetch if senderId or receiverId changes

  if (loading) return <div>Loading conversation...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="conversation-container">
      <h2>Conversation</h2>
      <div className="messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${
              message.senderId === currentUserId ? 'sent' : 'received'
            }`}
          >
            <div className="message-content">
              <p>{message.content}</p>
              <span className="timestamp">
                {new Date(message.sentAt).toLocaleTimeString()}
              </span>
              <span className="sender">
                {message.senderId === currentUserId
                  ? 'You'
                  : message.senderName}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Conversation;