import { llm } from "~/lib/agents/models/Grok4.1Fast";
import * as z from "zod";
import { createAgent, tool } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

console.log(import.meta.url);
console.log(process.argv[1]);

const checkpointer = new MemorySaver();

const __dirname = dirname(fileURLToPath(import.meta.url));
const SYSTEM_PROMPT = readFileSync(join(__dirname, 'SYSTEM_PROMPT.md'), 'utf-8');

const responseFormat = z.object({
  answer: z.string(),
  deck: z.array(
    z.object(
      { front: z.string(), back: z.string() },
    ),
  ).optional(),
  action: z.enum(["add_to_deck", "replace_deck"]).optional()
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
  };

  const response = await deckGenerationAgent.invoke(
    { messages: [{ role: "user", content: userMessage }] },
    config,
  );

  // console.log(response.structuredResponse.answer);

  return response;
}
