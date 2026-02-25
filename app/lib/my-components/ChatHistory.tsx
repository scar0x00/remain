import MessageEntry from "~/lib/my-components/MessageEntry";
import clsx from "clsx";

export const ChatHistory = ({ messages }: { messages: Message[] }) => {

  return (
    <div id="chat"
      className={clsx(`flex flex-col gap-4 w-full h-full px-3 
      overflow-y-auto
      scrollbar-thin
      scrollbar-track-transparent
      scrollbar-thumb:neutral-700/40
      hover:scrollbar-thumb:neutral-500/70
      [&::-webkit-scrollbar]:w-1
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-neutral-600/50
      [&::-webkit-scrollbar-thumb]:rounded-xl
      hover:[&::-webkit-scrollbar-thumb]:bg-neutral-500/80
      `)}
    >
      {messages.map((message, index) => (
        <MessageEntry message={message} key={index} />
      ))}
    </div>
  );
};

export default ChatHistory;