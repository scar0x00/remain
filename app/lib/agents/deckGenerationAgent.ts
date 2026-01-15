import { llm } from "~/lib/agents/models/Grok4.1Fast";
import * as z from "zod";
import { createAgent, tool } from "langchain";
import { MemorySaver } from "@langchain/langgraph";

console.log(import.meta.url);
console.log(process.argv[1]);

const checkpointer = new MemorySaver();

const SYSTEM_PROMT = `Nothing`;

const responseFormat = z.object({
  summary: z.string(),
  deck: z.array(
    z.object(
      { front: z.string(), back: z.string() },
    ),
  ).optional(),
});

export const deckGenerationAgent = createAgent({
  model: llm,
  systemPrompt: SYSTEM_PROMT,
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
  };

  const response = await deckGenerationAgent.invoke(
    { messages: [{ role: "user", content: userMessage }] },
    config,
  );

  return response;
}
