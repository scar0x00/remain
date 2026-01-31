import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import type { ChainValues } from "@langchain/core/utils/types";
import type { LLMResult } from "@langchain/core/outputs";

export class AgentLoggingMiddleware extends BaseCallbackHandler {
  name = "AgentLoggingMiddleware";
  private runTimes = new Map<string, number>();

  handleChainStart(_chain: any, inputs: ChainValues, runId: string, _parentRunId?: string, _tags?: string[], metadata?: Record<string, any>) {
    this.runTimes.set(runId, Date.now());
    console.log(`[Agent] Start - RunID: ${runId}`);
    if (metadata?.user_id) console.log(`[Agent] UserID: ${metadata.user_id}`);
    console.log(`[Agent] Inputs:`, JSON.stringify(inputs, null, 2));
  }

  handleLLMStart(_llm: any, prompts: string[], runId: string) {
    console.log(`[Agent] LLM Start - RunID: ${runId} - Prompts: ${prompts.length}`);
  }

  handleLLMEnd(output: LLMResult, runId: string) {
    const tokens = output.llmOutput?.tokenUsage?.totalTokens || 'unknown';
    console.log(`[Agent] LLM End - RunID: ${runId} - Tokens: ${tokens}`);
  }

  handleChainEnd(outputs: ChainValues, runId: string) {
    const startTime = this.runTimes.get(runId);
    const duration = startTime ? Date.now() - startTime : -1;
    this.runTimes.delete(runId);
    
    console.log(`[Agent] End - RunID: ${runId} - Duration: ${duration}ms`);
    console.log(`[Agent] Outputs:`, JSON.stringify(outputs, null, 2));
  }

  handleChainError(err: Error, runId: string) {
    this.runTimes.delete(runId);
    console.error(`[Agent] Error - RunID: ${runId}:`, err);
  }
}

export const agentLoggingMiddleware = new AgentLoggingMiddleware();
