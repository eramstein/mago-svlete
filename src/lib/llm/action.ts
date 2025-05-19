import ollama, { type ToolCall } from 'ollama';
import { LLM_MODEL } from './config';
import { getTools } from './tools';
import { vectorDatabaseClient } from './vector-db';

async function getToolsFromText(message: string) {
  const memoryPrompt = await queryWorldsMemory(message);
  console.log('getToolsFromText memoryPrompt', message, memoryPrompt);
  const query = {
    role: 'user',
    content: memoryPrompt + message,
  };
  const response = await ollama.chat({
    model: LLM_MODEL,
    messages: [query],
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
  if (!results.documents.length) {
    return '';
  }
  return 'The following information is relevant: ' + results.documents[0] + '. ';
}

// export async function getActionFromText(actionText: string): Promise<{
//   actionType: ActionType;
//   args: Record<string, any>;
// }> {
//   const llmResponse = await getToolsFromText(actionText);
//   const toolCalls = llmResponse.message.tool_calls;
//   if (toolCalls === undefined || toolCalls.length === 0) {
//     console.log("No tool found");
//     return {
//       actionType: ActionType.Wait,
//       args: {},
//     };
//   }
//   const tool = (toolCalls as ToolCall[])[0];
//   const actionType = tool.function.name as ActionType;
//   const args = tool.function.arguments;
//   return {
//     actionType,
//     args,
//   };
// }
