import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setLoading(true);

    try {
      const response = await axios.post(import.meta.env.VITE_CHATBOT_URL, {
        message: input,
      });

      const data = response.data;

      if (data.products) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.message, products: data.products },
        ]);
      } else {
        setMessages((prev) => [...prev, { sender: "bot", text: data.message }]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  const handleCloseChatBot = () => setIsOpen(false);
  const handleToggleChatBot = () => setIsOpen((prev) => !prev);

  return (
    <div>
      {/* Floating ChatBot Icon */}
      <button
        onClick={handleToggleChatBot}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600"
      >
        🗨️
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={handleCloseChatBot}
          className="fixed inset-0 bg-gray-500 opacity-50 z-10"
        />
      )}

      {/* ChatBot */}
      {isOpen && (
        <div className="chatbot-container fixed bottom-4 right-4 max-w-lg w-full p-4 bg-white shadow-lg rounded-lg z-20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-blue-500">
              Chat with us!
            </h2>
            <button
              onClick={handleCloseChatBot}
              className="text-gray-500 hover:text-gray-700"
            >
              ✖️
            </button>
          </div>

          {messages.length === 0 && <h1>Hello</h1>}

          <div className="chat-messages h-96 overflow-y-auto mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 my-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-gray-200 text-black self-start"
                }`}
              >
                <p>{msg.text}</p>
                {msg.products && (
                  <div className="product-recommendations mt-2">
                    {msg.products.map((product, idx) => (
                      <Link
                        to={`/productDetails/${product.id}`}
                        key={idx}
                        className="product-item flex items-center space-x-3"
                      >
                        <img
                          src={`${import.meta.env.VITE_IMAGES_URL}/${
                            product.image
                          }`}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-600">
                            ${product.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && <p className="text-center text-gray-500">Loading...</p>}
          </div>
          <div className="chat-input flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
