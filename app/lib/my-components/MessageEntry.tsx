import clsx from 'clsx';
import { useMemo } from 'react';
import { MarkdownRenderer } from '../utils/MarkdownRenderer';

export const MessageEntry: React.FC<{ message: Message }> = ({ message }) => {

  const [mdMessage] = useMemo(() => {
    const mdRenderer = new MarkdownRenderer();
    // console.log(card.back);
    return [
      mdRenderer.render(message.content),
    ];
  }, [message]);

  return (
    <div className={clsx({
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
    )} dangerouslySetInnerHTML={{  __html: mdMessage }}>
      {/* {message.content} */}
    </div>
  );
};

export default MessageEntry;