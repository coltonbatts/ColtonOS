import React, { useState, useEffect, useRef } from 'react';
import { ViewMode, MarkdownFile, Message, ChatState } from './types';
import { INITIAL_KNOWLEDGE_BASE } from './constants';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ReactMarkdown from 'react-markdown';
import { Send, ArrowRight, FileText, Edit2, Save, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>(ViewMode.CHAT);
  const [knowledgeBase, setKnowledgeBase] = useState<MarkdownFile[]>(INITIAL_KNOWLEDGE_BASE);
  const [input, setInput] = useState('');
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    selectedFile: null,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Gemini on mount
  useEffect(() => {
    const init = async () => {
      try {
        await initializeChat(knowledgeBase);
        setChatState(prev => ({
          ...prev,
          messages: [{
            id: 'init',
            role: 'assistant',
            content: `**System Initialized.**\n\nArchive loaded with ${knowledgeBase.length} records. Ready to assist with retrieval, drafting, or brand alignment.`,
            timestamp: Date.now()
          }]
        }));
      } catch (e) {
        console.error("Failed to init AI", e);
        setChatState(prev => ({
          ...prev,
          messages: [{
            id: 'error',
            role: 'assistant',
            content: `**Connection Error.**\n\nUnable to establish link with Intelligence Layer. Verify API Key configuration.`,
            timestamp: Date.now()
          }]
        }));
      }
    };
    init();
  }, [knowledgeBase]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages, mode]);

  const handleSendMessage = async () => {
    if (!input.trim() || chatState.isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isLoading: true
    }));
    setInput('');

    try {
      const response = await sendMessageToGemini(userMsg.content);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMsg],
        isLoading: false
      }));
    } catch (error) {
       setChatState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // --- RENDERERS ---

  const renderChatInterface = () => (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto">
        {chatState.messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {chatState.isLoading && (
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
             <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
             <span className="text-xs font-mono text-gray-500">PROCESSING...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Input command or query..."
            className="w-full bg-white border border-gray-300 rounded-none p-4 pr-14 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-mono text-sm resize-none h-16 transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={chatState.isLoading || !input.trim()}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-black disabled:opacity-30 transition-colors"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderKnowledgeBase = () => {
    const file = chatState.selectedFile || knowledgeBase[0];
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Toolbar */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white">
             <div className="flex items-center gap-3">
                <FileText className="text-black" size={20} />
                <span className="text-black font-mono font-bold text-sm">{file.path}</span>
                <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-sm">
                    UPDATED: {file.lastUpdated}
                </span>
             </div>
             <div className="flex gap-3">
                 <button className="flex items-center gap-2 text-gray-500 hover:text-black text-xs font-mono font-bold px-3 py-2 border border-transparent hover:border-gray-200 transition-all">
                    <Edit2 size={14} />
                    EDIT
                 </button>
                 <button className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 text-xs font-mono font-bold px-4 py-2 transition-all">
                    <Save size={14} />
                    SAVE
                 </button>
             </div>
        </div>
        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-12 bg-gray-50">
            <div className="max-w-3xl mx-auto bg-white p-12 border border-gray-200 shadow-sm min-h-[800px]">
                <ReactMarkdown
                  className="prose prose-sm max-w-none font-sans prose-headings:font-bold prose-headings:font-sans prose-h1:text-3xl prose-h1:tracking-tight prose-h1:text-black prose-h2:text-lg prose-h2:uppercase prose-h2:tracking-widest prose-h2:border-b prose-h2:border-black prose-h2:pb-2 prose-h2:mt-8 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-black"
                >
                    {file.content}
                </ReactMarkdown>
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-white text-gray-900 overflow-hidden font-sans">
      <Sidebar
        files={knowledgeBase}
        currentMode={mode}
        onModeChange={setMode}
        onFileSelect={(file) => setChatState(prev => ({ ...prev, selectedFile: file }))}
        selectedFile={chatState.selectedFile}
      />
      <main className="flex-1 relative flex flex-col">
        {mode === ViewMode.CHAT ? renderChatInterface() : renderKnowledgeBase()}
      </main>
    </div>
  );
};

export default App;