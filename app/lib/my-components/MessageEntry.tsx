import clsx from 'clsx';
import React from 'react';

interface Message {
  role: "agent" | "user";
  content: string;
}

export const MessageEntry: React.FC<{ message: Message }> = ({ message }) => {
  return (
        <p className={clsx({
            "bg-gray-100 text-gray-800 self-end": message.role === "user",
            "bg-gray-800 text-gray-100 self-start": message.role === "agent",
        }, 
        "max-w-2/3",
        "rounded-md",
        "p-4",
        // "odd:self-end even:self-start",
        "text-left",
        "wrap-break-word",
        "chat-entry"
        )}>
            {message.content}
        </p>
  );
};

export default MessageEntry;