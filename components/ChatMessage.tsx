import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import { FileCode, Terminal, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAi = message.role === 'assistant';

  return (
    <div className={`flex gap-4 px-4 py-6 ${isAi ? '' : ''} hover:bg-gray-50/50 transition-colors`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${isAi ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
        {isAi ? <Terminal size={14} /> : <User size={14} />}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden min-w-0 pt-1">
        <div className="flex items-baseline gap-2 mb-1">
            <span className="font-bold text-sm text-gray-900">
                {isAi ? 'Archive' : 'You'}
            </span>
        </div>

        <div className={`prose prose-sm max-w-none prose-p:leading-relaxed ${
            isAi 
                ? 'prose-p:text-gray-800 prose-headings:text-black prose-strong:text-black prose-a:text-black' 
                : 'bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none text-gray-800 inline-block max-w-full'
        }`}>
          <ReactMarkdown
             components={{
                code({node, inline, className, children, ...props}: any) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline ? (
                    <div className="relative my-4 not-prose">
                      <div className="absolute top-0 left-0 right-0 flex justify-between items-center px-4 py-1 bg-gray-100 border border-gray-200 border-b-0 rounded-t-md">
                         <span className="text-[10px] text-gray-500 uppercase font-mono">{match ? match[1] : 'code'}</span>
                      </div>
                      <code className={`${className} block bg-white p-4 border border-gray-200 rounded-b-md font-mono text-xs text-gray-800 overflow-x-auto`} {...props}>
                        {children}
                      </code>
                    </div>
                  ) : (
                    <code className="bg-gray-200 text-gray-900 px-1.5 py-0.5 rounded-sm font-mono text-[11px]" {...props}>
                      {children}
                    </code>
                  )
                },
                a: ({node, ...props}) => <a className="text-black border-b border-black hover:bg-black hover:text-white transition-colors no-underline" {...props} />,
                ul: ({node, ...props}) => <ul className="space-y-1 my-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="text-gray-800" {...props}><span className="mr-2">•</span>{props.children}</li>,
                blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-black pl-4 italic text-gray-600 my-4" {...props} />,
                h3: ({node, ...props}) => <h3 className="font-bold text-gray-900 mt-4 mb-2 text-sm uppercase tracking-wider" {...props} />,
             }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Draft Indicator */}
        {isAi && message.content.includes('---') && message.content.includes('path:') && (
           <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 border border-gray-200 rounded-md p-2 w-fit bg-white">
              <FileCode size={12} />
              <span>Markdown Update Proposal Detected</span>
           </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;