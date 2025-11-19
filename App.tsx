import React, { useState, useEffect, useRef } from 'react';
import { ViewMode, MarkdownFile, Message, ChatState } from './types';
import { INITIAL_KNOWLEDGE_BASE } from './constants';
import { initializeChat, sendMessageToGemini } from './services/geminiService';
import Sidebar from './components/Sidebar';
import ChatMessage from './components/ChatMessage';
import ReactMarkdown from 'react-markdown';
import { ArrowRight, FileText, Edit2, Save, Trash2, X, Terminal, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'colton-archive-kb-v2';

const App: React.FC = () => {
  const [mode, setMode] = useState<ViewMode>(ViewMode.CHAT);
  
  // Initialize from LocalStorage if available
  const [knowledgeBase, setKnowledgeBase] = useState<MarkdownFile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_KNOWLEDGE_BASE;
  });

  const [input, setInput] = useState('');
  
  // Chat State
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    selectedFile: null,
  });

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<MarkdownFile | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- EFFECTS ---

  // Persist to LocalStorage whenever KB changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(knowledgeBase));
  }, [knowledgeBase]);

  // Initialize Gemini on mount or when KB changes
  useEffect(() => {
    const init = async () => {
      try {
        await initializeChat(knowledgeBase);
      } catch (e) {
        console.error("Failed to init AI", e);
      }
    };
    init();
  }, [knowledgeBase]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages, mode, chatState.isLoading]);

  // --- HANDLERS ---

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || chatState.isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
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

  // File Management Handlers
  const handleCreateFile = () => {
      const newFile: MarkdownFile = {
          path: '/New/Untitled.md',
          category: 'Drafts',
          content: '# New Entry\n\nStart typing...',
          lastUpdated: new Date().toISOString().split('T')[0]
      };
      
      setKnowledgeBase(prev => [...prev, newFile]);
      setChatState(prev => ({ ...prev, selectedFile: newFile }));
      setMode(ViewMode.KNOWLEDGE_BASE);
      
      // Enter edit mode immediately
      setEditForm(newFile);
      setIsEditing(true);
  };

  const handleEditClick = () => {
      if (chatState.selectedFile) {
          setEditForm({ ...chatState.selectedFile });
          setIsEditing(true);
      }
  };

  const handleCancelEdit = () => {
      setIsEditing(false);
      setEditForm(null);
  };

  const handleSave = () => {
      if (!editForm) return;

      const updatedFile = {
          ...editForm,
          lastUpdated: new Date().toISOString().split('T')[0]
      };

      setKnowledgeBase(prev => prev.map(f => 
          f.path === chatState.selectedFile?.path ? updatedFile : f
      ));
      
      setChatState(prev => ({ ...prev, selectedFile: updatedFile }));
      setIsEditing(false);
      setEditForm(null);
  };

  const handleDelete = () => {
      if (!chatState.selectedFile) return;
      if (window.confirm(`Are you sure you want to delete ${chatState.selectedFile.path}?`)) {
          const newKb = knowledgeBase.filter(f => f.path !== chatState.selectedFile?.path);
          setKnowledgeBase(newKb);
          
          if (newKb.length > 0) {
              setChatState(prev => ({ ...prev, selectedFile: newKb[0] }));
          } else {
              setChatState(prev => ({ ...prev, selectedFile: null }));
          }
          setIsEditing(false);
      }
  };

  // --- RENDERERS ---

  const renderChatInterface = () => {
    const isEmpty = chatState.messages.length === 0;

    return (
      <div className="flex flex-col h-full bg-white relative">
        
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto pt-4 pb-32"> {/* padding bottom for fixed input */}
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4 space-y-8 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
              <div className="bg-black text-white p-4 rounded-full mb-2">
                <Terminal size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-black mb-2">Colton_OS v3.1</h1>
                <p className="text-gray-500 max-w-md mx-auto">
                  Knowledge Base Active. {knowledgeBase.length} files indexed. 
                  <br/>Ready for retrieval or content generation.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                 <button onClick={() => handleSendMessage("What is Colton's current focus?")} className="text-left p-4 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all group">
                    <span className="block text-xs font-mono text-gray-400 mb-1 uppercase">Bio Query</span>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-black">"What is Colton's current focus?"</span>
                 </button>
                 <button onClick={() => handleSendMessage("Draft a tweet about my new project.")} className="text-left p-4 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all group">
                    <span className="block text-xs font-mono text-gray-400 mb-1 uppercase">Generation</span>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-black">"Draft a tweet about my project."</span>
                 </button>
                 <button onClick={() => handleSendMessage("List all active projects.")} className="text-left p-4 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all group">
                    <span className="block text-xs font-mono text-gray-400 mb-1 uppercase">Retrieval</span>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-black">"List all active projects."</span>
                 </button>
                 <button onClick={() => handleSendMessage("What is the design philosophy?")} className="text-left p-4 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all group">
                    <span className="block text-xs font-mono text-gray-400 mb-1 uppercase">Brand</span>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-black">"What is the design philosophy?"</span>
                 </button>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto w-full">
              {chatState.messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {chatState.isLoading && (
                <div className="px-4 py-6 flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0">
                      <Sparkles size={14} className="text-white animate-pulse" />
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-4">
          <div className="max-w-3xl mx-auto relative shadow-2xl shadow-gray-200/50 rounded-xl">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Query the archive..."
              className="w-full bg-white border border-gray-200 rounded-xl p-4 pr-14 text-gray-900 focus:outline-none focus:border-black focus:ring-1 focus:ring-black font-sans text-base resize-none h-14 shadow-sm transition-all placeholder:text-gray-400"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={chatState.isLoading || !input.trim()}
              className="absolute top-2 right-2 p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-black transition-colors"
            >
              <ArrowRight size={18} />
            </button>
          </div>
          <div className="text-center mt-2">
             <span className="text-[10px] text-gray-400 font-mono">AI can make mistakes. Verify with Knowledge Base.</span>
          </div>
        </div>
      </div>
    );
  };

  const renderKnowledgeBase = () => {
    const file = chatState.selectedFile || knowledgeBase[0];
    if (!file) return <div className="p-10 font-mono text-sm text-gray-500">No archives found. Create a new entry.</div>;

    return (
      <div className="h-full flex flex-col bg-white">
        {/* Toolbar */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white shrink-0">
             <div className="flex items-center gap-3 flex-1 mr-4">
                <FileText className="text-black shrink-0" size={20} />
                {isEditing && editForm ? (
                    <div className="flex gap-2 w-full max-w-md">
                        <input 
                            type="text" 
                            value={editForm.category}
                            onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                            className="border border-gray-300 px-2 py-1 text-xs font-mono w-24 focus:outline-none focus:border-black"
                            placeholder="Category"
                        />
                        <span className="text-gray-300">/</span>
                        <input 
                            type="text" 
                            value={editForm.path}
                            onChange={(e) => setEditForm({...editForm, path: e.target.value})}
                            className="border border-gray-300 px-2 py-1 text-xs font-mono flex-1 focus:outline-none focus:border-black"
                            placeholder="Path (e.g., /Bio/Me.md)"
                        />
                    </div>
                ) : (
                    <>
                        <span className="text-black font-mono font-bold text-sm truncate">{file.path}</span>
                        <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-sm shrink-0">
                            UPDATED: {file.lastUpdated}
                        </span>
                    </>
                )}
             </div>
             
             <div className="flex gap-3">
                 {isEditing ? (
                    <>
                        <button 
                            onClick={handleDelete}
                            className="flex items-center gap-2 text-red-500 hover:bg-red-50 text-xs font-mono font-bold px-3 py-2 transition-all rounded-sm"
                        >
                            <Trash2 size={14} />
                        </button>
                        <button 
                            onClick={handleCancelEdit}
                            className="flex items-center gap-2 text-gray-500 hover:text-black text-xs font-mono font-bold px-3 py-2 border border-transparent hover:border-gray-200 transition-all"
                        >
                            <X size={14} />
                            CANCEL
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800 text-xs font-mono font-bold px-4 py-2 transition-all"
                        >
                            <Save size={14} />
                            SAVE CHANGES
                        </button>
                    </>
                 ) : (
                    <button 
                        onClick={handleEditClick}
                        className="flex items-center gap-2 text-gray-500 hover:text-black text-xs font-mono font-bold px-3 py-2 border border-transparent hover:border-gray-200 transition-all"
                    >
                        <Edit2 size={14} />
                        EDIT
                    </button>
                 )}
             </div>
        </div>

        {/* Content Viewer / Editor */}
        <div className="flex-1 overflow-hidden relative">
            {isEditing && editForm ? (
                <textarea 
                    value={editForm.content}
                    onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                    className="w-full h-full p-12 bg-gray-50 resize-none focus:outline-none font-mono text-sm text-gray-800 leading-relaxed"
                    spellCheck={false}
                />
            ) : (
                <div className="h-full overflow-y-auto p-12 bg-gray-50">
                    <div className="max-w-3xl mx-auto bg-white p-12 border border-gray-200 shadow-sm min-h-[800px]">
                        <ReactMarkdown
                            className="prose prose-sm max-w-none font-sans"
                            components={{
                                h1: ({node, ...props}) => <h1 className="text-4xl font-bold tracking-tight text-black mb-8 pb-6 border-b border-gray-100" {...props} />,
                                h2: ({node, ...props}) => <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mt-12 mb-6 border-b border-gray-100 pb-2" {...props} />,
                                h3: ({node, ...props}) => <h3 className="text-lg font-bold text-black mt-8 mb-3" {...props} />,
                                p: ({node, ...props}) => <p className="text-gray-700 leading-7 mb-5 text-[15px]" {...props} />,
                                ul: ({node, ...props}) => <ul className="space-y-2 mb-6 ml-2" {...props} />,
                                ol: ({node, ...props}) => <ol className="list-decimal ml-6 space-y-2 mb-6 text-gray-700" {...props} />,
                                li: ({node, ...props}) => (
                                    <li className="flex gap-3 items-start text-gray-700 leading-7 text-[15px]" {...props}>
                                        {/* Custom bullet to look more tech/clean than standard disc */}
                                        <span className="mt-2.5 w-1 h-1 bg-black shrink-0" /> 
                                        <span>{props.children}</span>
                                    </li>
                                ),
                                strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                                blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-black pl-6 italic text-gray-600 my-8" {...props} />,
                                code: ({node, inline, className, children, ...props}: any) => {
                                    return inline ? (
                                        <code className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded-sm font-mono text-xs" {...props}>
                                            {children}
                                        </code>
                                    ) : (
                                        <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto my-6 font-mono text-xs leading-relaxed">
                                            {children}
                                        </div>
                                    );
                                }
                            }}
                        >
                            {file.content}
                        </ReactMarkdown>
                    </div>
                </div>
            )}
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
        onFileSelect={(file) => {
            setChatState(prev => ({ ...prev, selectedFile: file }));
            // Exit edit mode if changing files
            if (isEditing) {
                setIsEditing(false);
                setEditForm(null);
            }
        }}
        selectedFile={chatState.selectedFile}
        onCreateFile={handleCreateFile}
      />
      <main className="flex-1 relative flex flex-col">
        {mode === ViewMode.CHAT ? renderChatInterface() : renderKnowledgeBase()}
      </main>
    </div>
  );
};

export default App;