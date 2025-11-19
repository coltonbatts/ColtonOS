import React from 'react';
import { MarkdownFile, ViewMode } from '../types';
import { Folder, FileText, Database, Box, Command, Plus } from 'lucide-react';

interface SidebarProps {
  files: MarkdownFile[];
  currentMode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  onFileSelect: (file: MarkdownFile) => void;
  selectedFile: MarkdownFile | null;
  onCreateFile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  files, 
  currentMode, 
  onModeChange, 
  onFileSelect,
  selectedFile,
  onCreateFile
}) => {
  
  // Group files by category
  const groupedFiles = files.reduce((acc, file) => {
    if (!acc[file.category]) acc[file.category] = [];
    acc[file.category].push(file);
    return acc;
  }, {} as Record<string, MarkdownFile[]>);

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full text-sm">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-2 text-black mb-1">
          <Box size={18} strokeWidth={2.5} />
          <span className="font-bold tracking-tight font-mono text-base">COLTON_OS</span>
        </div>
        <div className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">
          Colton Batts // v3.1
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col p-3 gap-1">
        <button
          onClick={() => onModeChange(ViewMode.CHAT)}
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all font-medium ${
            currentMode === ViewMode.CHAT 
              ? 'bg-black text-white' 
              : 'text-gray-500 hover:bg-gray-100 hover:text-black'
          }`}
        >
          <Command size={16} />
          <span>Operations</span>
        </button>
        <button
          onClick={() => onModeChange(ViewMode.KNOWLEDGE_BASE)}
          className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all font-medium ${
            currentMode === ViewMode.KNOWLEDGE_BASE
              ? 'bg-black text-white' 
              : 'text-gray-500 hover:bg-gray-100 hover:text-black'
          }`}
        >
          <Database size={16} />
          <span>Knowledge Base</span>
        </button>
      </div>

      {/* Archive Explorer */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
             <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
              File System
            </div>
            <button 
                onClick={onCreateFile}
                className="text-black hover:bg-gray-100 p-1 rounded-sm transition-colors"
                title="New Entry"
            >
                <Plus size={14} />
            </button>
        </div>
        
        <div className="space-y-6">
          {(Object.entries(groupedFiles) as [string, MarkdownFile[]][]).map(([category, categoryFiles]) => (
            <div key={category}>
              <div className="flex items-center gap-2 text-gray-900 mb-2 font-bold text-xs font-mono uppercase tracking-wide">
                <Folder size={12} className="text-gray-400" />
                {category}
              </div>
              <div className="pl-3 space-y-1 border-l border-gray-200 ml-1.5">
                {categoryFiles.map(file => (
                  <button
                    key={file.path}
                    onClick={() => {
                        onFileSelect(file);
                        onModeChange(ViewMode.KNOWLEDGE_BASE);
                    }}
                    className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded text-xs transition-all ${
                      selectedFile?.path === file.path
                        ? 'text-black font-bold bg-gray-100'
                        : 'text-gray-500 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <FileText size={12} />
                    <span className="truncate font-mono">{file.path.split('/').pop()}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-mono">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>SYNC: LOCAL_STORAGE</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;