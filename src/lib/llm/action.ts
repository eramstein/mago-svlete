import ollama, { type ToolCall } from 'ollama';
import { LLM_MODEL } from './config';
import { getTools } from './tools';
import { vectorDatabaseClient } from './vector-db';
import { ActionType } from '../config';

async function getToolsFromText(message: string) {
  const memoryPrompt = await queryWorldsMemory(message);
  console.log('getToolsFromText memoryPrompt', message, memoryPrompt);
  const systemMessage = {
    role: 'system',
    content: `You are a tool selection assistant. Only select a tool if you are quite confident that the user's message matches the tool's purpose. If you're not confident, don't select any tool.`,
  };
  const query = {
    role: 'user',
    content: memoryPrompt + message,
  };
  const response = await ollama.chat({
    model: LLM_MODEL,
    messages: [systemMessage, query],
    tools: getTools(),
  });
  console.log('getToolsFromText tools response', response);
  return response;
}

async function queryWorldsMemory(message: string) {
  const collection = await vectorDatabaseClient.getOrCreateCollection({
    name: 'world',
  });
  const results = await collection.query({
    queryTexts: message,
    nResults: 1,
  });
  // Check if we have results and their distances
  if (!results.documents.length || !results.distances?.[0]) {
    console.log('No memory found');
    return '';
  }
  // ChromaDB returns cosine distances, where:
  // - 0 means perfect similarity
  // - 1 means orthogonal (no similarity)
  // - 2 means opposite
  const distance = results.distances[0]?.[0];
  if (distance > 1.7) {
    console.log('Memory query distance too high:', results, distance);
    return '';
  }
  return 'The following information is relevant: ' + results.documents[0] + '. ';
}

export async function getActionFromText(actionText: string): Promise<{
  actionType: ActionType;
  args: Record<string, any>;
}> {
  const llmResponse = await getToolsFromText(actionText);
  const toolCalls = llmResponse.message.tool_calls;
  if (toolCalls === undefined || toolCalls.length === 0) {
    console.log('No tool found');
    return {
      actionType: ActionType.None,
      args: {},
    };
  }
  const tool = (toolCalls as ToolCall[])[0];
  const actionType = tool.function.name as ActionType;
  const args = tool.function.arguments;
  return {
    actionType,
    args,
  };
}
