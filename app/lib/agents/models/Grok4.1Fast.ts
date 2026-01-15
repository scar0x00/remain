import { ChatXAI } from "@langchain/xai"

export const llm = new ChatXAI({
    model: "grok-4-1-fast-non-reasoning", // default
    temperature: 0,
    maxTokens: undefined,
    maxRetries: 2,
    apiKey: process.env.XAI_API_KEY,
});