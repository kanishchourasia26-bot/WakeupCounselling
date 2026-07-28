import { useState, useRef, useEffect } from 'react';
import { FaCommentDots, FaTimes, FaPaperPlane } from 'react-icons/fa';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Hello! Welcome to Wake-Up Counseling. How can I support you today?' 
    }
  ]);
  
  const messagesEndRef = useRef(null);

  // Naya message aane par automatically niche scroll karne ke liye
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 1. User ka message add karo
    const userText = input;
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput(''); // Input box khali karo

    // 2. Yahan baad me hum apni Backend AI API lagayenge
    // Abhi ke liye ek dummy loading message dalte hain
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: 'Main abhi seekh raha hu! Backend AI lagne ke baad main aapke har sawal ka jawab dunga. 😊' 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* --- Chat Window (Jab open ho) --- */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[500px] max-h-[80vh] mb-4 animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-700 to-teal-600 p-4 text-white flex justify-between items-center shadow-md">
            <div>
              <h3 className="font-bold text-lg">Wake-Up Assistant</h3>
              <p className="text-teal-100 text-xs">We reply immediately</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-teal-100 hover:text-white hover:bg-teal-800/50 p-2 rounded-full transition"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Chat Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-teal-600 text-white rounded-tr-none' // User Message UI
                      : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none' // Bot Message UI
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {/* Auto scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..." 
              className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 rounded-full px-4 py-2 text-sm outline-none transition-all"
            />
            <button 
              type="submit" 
              disabled={!input.trim()}
              className="bg-teal-600 text-white p-3 rounded-full hover:bg-teal-700 disabled:opacity-50 disabled:hover:bg-teal-600 transition shadow-sm"
            >
              <FaPaperPlane size={14} />
            </button>
          </form>
        </div>
      )}

      {/* --- Floating Button (Jab chat band ho) --- */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 text-white p-4 rounded-full shadow-lg hover:bg-teal-700 hover:scale-105 transition-all duration-300 flex items-center justify-center animate-bounce-slight"
        >
          <FaCommentDots size={28} />
        </button>
      )}
    </div>
  );
}