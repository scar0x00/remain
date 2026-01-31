import { llm } from "~/lib/agents/models/Grok4.1Fast";
import * as z from "zod";
import { createAgent } from "langchain";
import { SqliteSaver } from "@langchain/langgraph-checkpoint-sqlite";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

console.log(import.meta.url);
console.log(process.argv[1]);

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(
  join(__dirname, "SYSTEM_PROMPT.md"),
  "utf-8",
);

const checkpointer = SqliteSaver.fromConnString(
  `/home/oscar/Repos/remain/app/lib/agents/chats/chat_history.db`,
);

const responseFormat = z.object({
  answer: z.string(),
  deck: z.array(
    z.object(
      { front: z.string(), back: z.string() },
    ),
  ).optional(),
  action: z.enum(["add_to_deck", "replace_deck"]).optional(),
});

export const deckGenerationAgent = createAgent({
  model: llm,
  systemPrompt: SYSTEM_PROMPT,
  responseFormat,
  checkpointer,
});

export async function getAgentCompletion({
  userMessage,
  threadId,
  userId,
}: {
  userMessage: string;
  threadId: string;
  userId: string;
}): Promise<any> {
  const config = {
    configurable: { thread_id: threadId },
    context: { user_id: userId },
    // callbacks: [agentLoggingMiddleware]
  };

  const response = await deckGenerationAgent.invoke(
    { messages: [{ role: "user", content: userMessage }] },
    config,
  );


  return response;
}

export async function getChatHistory(
  threadId: string,
): Promise<{ role: "user" | "agent"; content: string }[]> {
  const config = { configurable: { thread_id: threadId } };

  // Get the most recent checkpoint (contains full conversation history)
  const checkpointTuple = await checkpointer.getTuple(config);

  if (!checkpointTuple) {
    return [];
  }

  const messages = checkpointTuple.checkpoint?.channel_values?.messages;
  if (!messages || !Array.isArray(messages)) {
    return [];
  }

  // Convert LangChain messages to simplified format
  return messages
    .filter((msg) => {
      const constructorName = msg.constructor?.name;
      return constructorName === "HumanMessage" ||
        constructorName === "AIMessage";
    })
    .map((msg) => {
      const content = JSON.parse(msg.content)?.userMessage
        ? JSON.parse(msg.content)?.userMessage
        : JSON.parse(msg.content)?.answer;
      return {
        role: msg.constructor?.name === "HumanMessage" ? "user" : "agent",
        content: content,
      };
    });
}
