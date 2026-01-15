import React from 'react';
import MessageEntry from "~/lib/my-components/MessageEntry";

interface Message {
  role: "agent" | "user";
  content: string;
}

export const ChatHistory: React.FC<{ messages: Message[] }> = ({ messages }) => {
  return (
    <div className="flex flex-col gap-4 w-full h-full overflow-y-auto">
      {messages.map((message, index) => (
        <MessageEntry message={message} key={index} />
      ))}
    </div>
  );
};

export default ChatHistory;