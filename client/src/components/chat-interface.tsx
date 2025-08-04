import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Paperclip, Eye, Phone, Palette } from "lucide-react";
import type { ChatMessage } from "@/types";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  quickSuggestions?: string[];
}

export default function ChatInterface({ 
  messages, 
  onSendMessage, 
  isLoading = false,
  placeholder = "Type your message...",
  quickSuggestions = []
}: ChatInterfaceProps) {
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim() || isLoading) return;
    onSendMessage(newMessage);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="overflow-hidden">
      {/* Chat Header */}
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold">A2S AI Assistant</h3>
            <p className="text-sm opacity-90">Online • Ready to help</p>
          </div>
        </div>
      </CardHeader>

      {/* Chat Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-100">
                <Bot className="w-4 h-4 text-blue-600" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="bg-slate-100 rounded-lg p-3 max-w-md">
                <p className="text-slate-800">
                  Hello! I'm your A2S AI Assistant. I can help you find properties, suggest room designs, and answer questions about real estate. What can I help you with today?
                </p>
              </div>
              <p className="text-xs text-slate-500 mt-1">Just now</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={index} className={`flex items-start space-x-3 ${
              message.role === 'user' ? 'justify-end' : ''
            }`}>
              {message.role === 'assistant' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                <div className={`rounded-lg p-3 max-w-2xl ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-100 text-slate-800'
                }`}>
                  <p className="mb-2">{message.content}</p>
                  
                  {/* AI Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="space-y-3 mt-3">
                      {message.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-lg p-3 bg-white">
                          <div className="flex items-center space-x-3">
                            {suggestion.image && (
                              <img 
                                src={suggestion.image}
                                alt={suggestion.title}
                                className="w-12 h-8 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-slate-800 text-sm">{suggestion.title}</p>
                              {suggestion.location && suggestion.price && (
                                <p className="text-xs text-slate-600">
                                  ₹{suggestion.price >= 100000 ? `${(suggestion.price / 100000).toFixed(0)}L` : `${(suggestion.price / 1000).toFixed(0)}K`} • {suggestion.location}
                                </p>
                              )}
                              {suggestion.description && (
                                <p className="text-xs text-slate-600">{suggestion.description}</p>
                              )}
                            </div>
                            <Button size="sm" variant="outline" className="text-xs">
                              {suggestion.action}
                            </Button>
                          </div>
                        </div>
                      ))}
                      
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                          <Eye className="w-3 h-3 mr-1" />
                          View All
                        </Button>
                        <Button size="sm" variant="outline" className="text-green-700 border-green-200 hover:bg-green-50">
                          <Phone className="w-3 h-3 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline" className="text-purple-700 border-purple-200 hover:bg-purple-50">
                          <Palette className="w-3 h-3 mr-1" />
                          Design
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>

              {message.role === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-r from-teal-500 to-purple-500 text-white text-xs font-semibold">
                    JD
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex items-start space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-blue-100">
                <Bot className="w-4 h-4 text-blue-600" />
              </AvatarFallback>
            </Avatar>
            <div className="bg-slate-100 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={placeholder}
              className="pr-12"
              onKeyPress={handleKeyPress}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-blue-600"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
          </div>
          <Button 
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>

        {/* Quick Suggestions */}
        {quickSuggestions.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {quickSuggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setNewMessage(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
