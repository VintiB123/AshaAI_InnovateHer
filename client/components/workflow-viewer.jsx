import React, { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Upload, X, Paperclip } from "lucide-react";

const WorkflowViewer = ({ workflow }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && !selectedFile) return;

    setIsProcessing(true);
    const formData = new FormData();
    formData.append('workflow', workflow.name);
    if (input.trim()) formData.append('query', input);
    if (selectedFile) formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/process-workflow', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      // Add messages to chat
      if (input.trim()) {
        setMessages(prev => [...prev, { type: 'user', content: input }]);
      }
      if (selectedFile) {
        setMessages(prev => [...prev, { 
          type: 'user', 
          content: `Uploaded file: ${selectedFile.name}`,
          isFile: true 
        }]);
      }
      setMessages(prev => [...prev, { type: 'assistant', content: data.response }]);
      
      // Clear inputs
      setInput('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error processing workflow:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Workflow Display */}
      <div className="p-4 bg-coolTeal-50">
        <h2 className="text-xl font-bold text-coolTeal-800 mb-4">{workflow.name}</h2>
        <div className="flex gap-4 items-center">
          {workflow.agents?.map((agent, index) => (
            <React.Fragment key={agent.name}>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                <span className="text-sm font-medium">{agent.name}</span>
              </div>
              {index < workflow.agents.length - 1 && (
                <div className="text-coolTeal-400">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                message.type === 'user'
                  ? 'bg-coolTeal-100 ml-auto max-w-[80%]'
                  : 'bg-gray-100 mr-auto max-w-[80%]'
              }`}
            >
              {message.isFile ? (
                <div className="flex items-center gap-2">
                  <Paperclip size={16} />
                  {message.content}
                </div>
              ) : (
                message.content
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 mb-14 border-y">
        <form onSubmit={handleSubmit} className="space-y-2">
          {selectedFile && (
            <div className="flex items-center gap-2 bg-coolTeal-50 p-2 rounded">
              <Paperclip size={16} />
              <span className="text-sm">{selectedFile.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeFile}
                className="ml-auto"
              >
                <X size={16} />
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isProcessing}
              className="flex-1"
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <Upload size={18} />
            </Button>
            <Button 
              type="submit" 
              disabled={isProcessing}
              className="bg-coolTeal-600 hover:bg-coolTeal-700"
            >
              <Send size={18} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkflowViewer;