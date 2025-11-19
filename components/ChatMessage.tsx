import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { FileCode } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAi = message.role === 'assistant';

  return (
    <div className={`group flex gap-6 p-6 border-b border-gray-100 ${isAi ? 'bg-white' : 'bg-gray-50/50'}`}>
      {/* Label */}
      <div className="flex-shrink-0 w-24 pt-1">
        <span className={`font-mono text-xs font-bold tracking-wider block mb-1 ${isAi ? 'text-black' : 'text-gray-500'}`}>
          {isAi ? 'ARCHIVE' : 'USER'}
        </span>
        <span className="text-[10px] text-gray-300 font-mono block">
            {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="prose prose-sm max-w-none prose-p:text-gray-800 prose-headings:font-bold prose-headings:text-black prose-strong:text-black prose-strong:font-bold">
          <ReactMarkdown
             components={{
                // Custom renderer for code blocks
                code({node, inline, className, children, ...props}: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline ? (
                    <div className="relative my-4">
                      <div className="absolute -top-3 right-2 text-[10px] text-gray-500 bg-white px-2 py-0.5 border border-gray-200 uppercase font-mono">
                         {match ? match[1] : 'code'}
                      </div>
                      <code className={`${className} block bg-gray-50 p-4 border border-gray-200 rounded-sm font-mono text-xs text-gray-800 overflow-x-auto`} {...props}>
                        {children}
                      </code>
                    </div>
                  ) : (
                    <code className="bg-gray-100 text-gray-900 px-1.5 py-0.5 rounded-sm font-mono text-xs border border-gray-200" {...props}>
                      {children}
                    </code>
                  )
                },
                a: ({node, ...props}) => <a className="text-black border-b border-black hover:bg-black hover:text-white transition-colors no-underline" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 space-y-1 text-gray-700 marker:text-gray-400" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 space-y-1 text-gray-700 marker:text-gray-400" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-black pl-4 italic text-gray-600" {...props} />,
             }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Draft Indicator */}
        {message.content.includes('---') && message.content.includes('path:') && (
           <div className="mt-6 flex items-center gap-3 text-xs text-gray-900 bg-white p-3 border border-gray-200 shadow-sm max-w-max">
              <FileCode size={14} />
              <span className="font-mono font-bold">FILE_UPDATE_DRAFT</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;