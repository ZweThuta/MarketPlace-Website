import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import TrendBuddy from "../logo/TrendBuddyModel1.gif";
import {
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/solid";
import { Comment } from "react-loader-spinner";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, isOpen]);

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
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-200"
        aria-label="ChatBot"
      >
        <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={handleCloseChatBot}
          className="fixed inset-0 bg-black bg-opacity-40 z-10"
        />
      )}

      {/* ChatBot */}
      {isOpen && (
        <div className="fixed bottom-6 right-6  max-w-lg w-full bg-white shadow-xl rounded-lg z-20 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-neroBlack950">
            <h2 className="text-white font-semibold text-lg">TrendBuddy</h2>
            <button
              onClick={handleCloseChatBot}
              className="text-white hover:text-gray-300 transition duration-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="p-4 flex flex-col h-36 items-center text-center">
              <img
                src={TrendBuddy}
                alt="TrendBuddy"
                className="w-28 h-28 object-contain mb-3"
              />
              <h1 className="text-lg font-medium text-gray-800">
                Hello, I'm {""}
                <span className="text-blue-600 font-bold">TrendBuddy</span>. How
                can I assist you today?
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Ask me about products, deals, or anything else you need!
              </p>
            </div>
          )}

          {/* Chat Messages */}
          <div className="chat-messages px-4 py-2 h-96 overflow-y-auto bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } mb-3`}
              >
                <div
                  className={`p-3 max-w-xs rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.products && (
                    <div className="product-recommendations mt-2">
                      {msg.products.map((product, idx) => (
                        <Link
                          to={`/productDetails/${product.id}`}
                          key={idx}
                          className="flex items-center space-x-3 bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition duration-200 mb-2"
                        >
                          <img
                            src={`${import.meta.env.VITE_IMAGES_URL}/${
                              product.image
                            }`}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-gray-800">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              ${product.price}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center space-x-3 py-2 px-4 rounded-lg animate-pulse">
                <p className="text-gray-600 font-medium">
                  TrendBuddy is typing...
                </p>
                <Comment
                  visible={true}
                  height="40"
                  width="40"
                  ariaLabel="comment-loading"
                  wrapperStyle={{}}
                  wrapperClass="comment-wrapper"
                  color="#3b82f6"
                  backgroundColor="#e5e7eb"
                />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="chat-input flex items-center p-3 bg-white border-t border-gray-300">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message here..."
              className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 px-4 py-2 bg-neutral-700 text-white rounded-lg hover:bg-neroBlack950 transition duration-200"
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
