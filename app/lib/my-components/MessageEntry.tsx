import clsx from 'clsx';
import { useMemo } from 'react';
import { MarkdownRenderer } from '../utils/MarkdownRenderer';

export const MessageEntry: React.FC<{ message: Message }> = ({ message }) => {

  const [mdMessage] = useMemo(() => {
    const mdRenderer = new MarkdownRenderer();
    return [
      mdRenderer.render(message?.content || ""),
    ];
  }, [message]);

  return (
    <div className={clsx(
      {
        "bg-gray-100 text-gray-800 self-end": message.role === "user",
        "bg-gray-800 text-gray-100 self-start": message.role === "agent",
      },
      "max-w-2/3 max-[900px]:max-w-5/6",
      "rounded-md",
      "p-4",
      "text-left",
      "wrap-break-word",
      "chat-entry max-[1100px]:text-sm"
    )} dangerouslySetInnerHTML={{ __html: mdMessage }}>
      {/* {message.content} */}
    </div>
  );
};

export default MessageEntry;