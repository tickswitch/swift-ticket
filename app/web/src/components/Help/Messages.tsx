import { useEffect, useRef, useState } from "react";
import { TicketIcon } from "./HelpIcons";
import Title from "../Common/Title";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
  time: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "bot",
    text: "Hi there! 😊 What can we help you with today?",
    time: "10:00 AM",
  },
];

const topics = [
  {
    id: 1,
    question: "Selling or Sold tickets",
    answer: "Are you selling a ticket or have you already sold one?",
  },
  {
    id: 2,
    question: "Buying or bought tickets",
    answer: "Are you looking to buy a ticket or already bought one?",
  },
  {
    id: 3,
    question: "How ticket swap works",
    answer: "SwiftTickets connects buyers and sellers safely. Here's how...",
  },
  {
    id: 4,
    question: "Payment issues",
    answer: "Having trouble with payment? We can help.",
  },
  {
    id: 5,
    question: "Something else",
    answer: "Sure! Let us know what you're trying to do.",
  },
];

const MessageBubble = ({ message }: { message: Message }) => {
  const isBot = message.sender === "bot";
  return (
    <div className={`w-full flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`rounded-xl p-3 ${
          isBot
            ? "bg-secondaryText001/10 text-secondaryText001"
            : "bg-primary001 text-white"
        } max-w-[70%]`}
      >
        <div className="flex flex-col gap-1">
          {isBot && (
            <p className="text-[16px] font-semibold flex items-center gap-1 text-primary001">
              <TicketIcon /> SwiftTickets
            </p>
          )}
          <p className="text-[16px]">{message.text}</p>
        </div>
      </div>
    </div>
  );
};

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  const messageRef = useRef<HTMLDivElement>(null);

  const handleTopicClick = (topic: (typeof topics)[number]) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "user",
        text: topic.question,
        time: "10:01 AM",
      },
      {
        id: prev.length + 2,
        sender: "bot",
        text: topic.answer,
        time: "10:01 AM",
      },
    ]);
  };

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTo({
        top: messageRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="bg-white rounded-2xl w-full">
      <div>
        <Title className="p-4">The team can also help</Title>
        <hr className="my-4" />
      </div>

      <div
        className="p-3 h-[300px] md:h-[500px] overflow-y-auto flex flex-col gap-4"
        ref={messageRef}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      <div className="pb-10">
        <div className="flex items-center justify-center flex-wrap gap-4">
          {topics.map((topic) => (
            <button
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              className="bg-white px-3 py-2 rounded-full shadow-lg text-primary001 font-semibold"
            >
              {topic.question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
