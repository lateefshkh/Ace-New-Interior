'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Minimize2, Maximize2, MapPin, BedDouble } from 'lucide-react';

interface PropertyCard {
  $id: string;
  title: string;
  price: number;
  location: string;
  city?: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  images?: string[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  properties?: PropertyCard[];
}

function formatPrice(price: number) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
}

function PropertyCardView({ property }: { property: PropertyCard }) {
  const image = property.images?.[0];
  return (
    <div className="w-full bg-[#1F1B17] border border-[#3A322A] rounded-xl overflow-hidden shadow-lg hover:border-[#B08D57]/50 transition-colors duration-300">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={property.title} className="w-full h-32 object-cover" />
      )}
      <div className="p-3">
        <p className="font-medium text-sm text-[#F5F1E8] truncate">{property.title}</p>
        <p className="text-sm font-semibold text-[#D4AF6A] mt-1 tracking-wide">{formatPrice(property.price)}</p>
        <div className="flex items-center gap-1.5 text-xs text-[#A89A82] mt-1.5">
          <MapPin className="w-3 h-3 text-[#B08D57]" />
          <span className="truncate">{property.location}</span>
        </div>
        {(property.bedrooms || property.area_sqft) && (
          <div className="flex items-center gap-1.5 text-xs text-[#A89A82] mt-1">
            <BedDouble className="w-3 h-3 text-[#B08D57]" />
            <span>
              {property.bedrooms ? `${property.bedrooms} BHK` : ''}
              {property.bedrooms && property.area_sqft ? ' · ' : ''}
              {property.area_sqft ? `${property.area_sqft} sqft` : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi there! I'm Ace, your property assistant. Are you looking to buy, rent, or just exploring options?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [leadId, setLeadId] = useState<string | null>(null);
  const [shownPropertyIds, setShownPropertyIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
          leadId,
          sourcePage: window.location.pathname,
          shownPropertyIds,
          history: messages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      if (data.sessionId) setSessionId(data.sessionId);
      if (data.leadId) setLeadId(data.leadId);
      if (data.properties && data.properties.length > 0) {
        setShownPropertyIds(prev => [...prev, ...data.properties.map((p: PropertyCard) => p.$id)]);
      }

      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || "I'm here to help! Could you please share your name and phone number so our agent can assist you?",
          timestamp: new Date(),
          properties: data.properties && data.properties.length > 0 ? data.properties : undefined,
        }]);
      }, 300);

    } catch (error) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "I'm here to help! Could you please share your name and phone number so our agent can assist you with finding the perfect property?",
          timestamp: new Date(),
        }]);
      }, 300);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* One-time font import — better to move this into your global layout/CSS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Manrope:wght@400;500;600;700&display=swap');
        .ace-serif { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .ace-sans { font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif; }
        .ace-scrollbar::-webkit-scrollbar { width: 6px; }
        .ace-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .ace-scrollbar::-webkit-scrollbar-thumb { background: #3A322A; border-radius: 999px; }
        .ace-scrollbar::-webkit-scrollbar-thumb:hover { background: #B08D57; }
      `}</style>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 24 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="w-[400px] max-w-[calc(100vw-48px)] bg-[#14110F] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden border border-[#3A322A] ace-sans"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-b from-[#1F1B17] to-[#14110F] px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF6A] to-[#8A6A3A] flex items-center justify-center">
                    <span className="ace-serif text-[#14110F] text-sm font-semibold">A</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="ace-serif text-[#F5F1E8] text-base tracking-wide">Ace</span>
                      <span className="w-1.5 h-1.5 bg-[#D4AF6A] rounded-full animate-pulse" />
                    </div>
                    <span className="text-[10px] text-[#A89A82] tracking-wide uppercase">Property Concierge</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsMinimized(!isMinimized)}
                    className="text-[#A89A82] hover:text-[#D4AF6A] transition-colors p-1.5"
                  >
                    {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-[#A89A82] hover:text-[#D4AF6A] transition-colors p-1.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* Signature hairline */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B08D57] to-transparent" />
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="h-[420px] overflow-y-auto p-4 space-y-4 bg-[#14110F] ace-scrollbar">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index === messages.length - 1 ? 0 : 0, duration: 0.3 }}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                          msg.role === 'user'
                            ? 'bg-gradient-to-br from-[#8A6A3A] to-[#6B5028] text-[#F5F1E8] rounded-br-sm'
                            : 'bg-[#1F1B17] border border-[#3A322A] text-[#EAE4D8] rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        {msg.timestamp && (
                          <span className={`text-[10px] mt-1 block ${msg.role === 'user' ? 'text-[#F5F1E8]/50' : 'text-[#A89A82]'}`}>
                            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      {msg.properties && msg.properties.length > 0 && (
                        <div className="mt-2 w-[85%] space-y-2">
                          {msg.properties.map(p => (
                            <PropertyCardView key={p.$id} property={p} />
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-[#1F1B17] border border-[#3A322A] rounded-2xl rounded-bl-sm px-4 py-3">
                        <div className="flex gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[#B08D57] rounded-full animate-bounce" />
                          <span className="w-1.5 h-1.5 bg-[#B08D57] rounded-full animate-bounce [animation-delay:0.1s]" />
                          <span className="w-1.5 h-1.5 bg-[#B08D57] rounded-full animate-bounce [animation-delay:0.2s]" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 bg-[#1F1B17] border-t border-[#3A322A]">
                  <div className="flex gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-2.5 bg-[#14110F] border border-[#3A322A] rounded-full focus:outline-none focus:ring-1 focus:ring-[#B08D57] focus:border-[#B08D57] text-sm text-[#F5F1E8] placeholder:text-[#6B6156] transition-all"
                      disabled={isLoading}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim() || isLoading}
                      className="p-2.5 bg-gradient-to-br from-[#D4AF6A] to-[#8A6A3A] text-[#14110F] rounded-full hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-[#6B6156] text-center mt-2.5 tracking-wide">
                    Connecting you with exceptional properties
                  </p>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-br from-[#1F1B17] to-[#14110F] text-[#F5F1E8] p-4 rounded-full shadow-2xl shadow-black/40 border border-[#3A322A] hover:border-[#B08D57] transition-all duration-300 flex items-center gap-2 ace-sans"
          >
            <MessageSquare className="w-5 h-5 text-[#D4AF6A]" />
            <span className="text-sm font-medium hidden sm:inline">Chat with Ace</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}