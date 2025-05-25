import ollama, { type ToolCall } from 'ollama';
import { LLM_MODEL } from './config';
import { getTools } from './tools';
import { ActionType } from '../config';
import { queryWorldsMemory } from './world';

async function getToolsFromText(message: string) {
  const memoryPrompt = await queryWorldsMemory(message);
  console.log('getToolsFromText memoryPrompt', message, memoryPrompt);
  const systemMessage = {
    role: 'system',
    content: `You are a tool selection assistant. Only select a tool if you are quite confident that the user's message matches the tool's purpose. If you're not confident, don't select any tool.`,
  };
  const query = {
    role: 'user',
    content: `This is the key information to select the tool, give it priority: ${message}. ${memoryPrompt}`,
  };
  const response = await ollama.chat({
    model: LLM_MODEL,
    messages: [systemMessage, query],
    tools: getTools(),
  });
  console.log('getToolsFromText tools response', response);
  return response;
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
