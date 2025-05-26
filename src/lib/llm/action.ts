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
    content: `You are a tool selection assistant. Your task is to carefully analyze the user's intent and only select a tool if there is a clear match between the user's request and the tool's specific purpose. Pay attention to action verbs and context, not just keywords. For example:
    - For startGame: Only select if there's an explicit request to START or BEGIN a game
    - For goTo: Only select if there's a clear intention to MOVE or GO somewhere
    If you're not 100% confident about the intent matching the tool's purpose, don't select any tool.`,
  };
  const query = {
    role: 'user',
    content: `This is the key information to select the tool, give it priority: ${message}. ${memoryPrompt}`,
  };
  const response = await ollama.chat({
    model: LLM_MODEL,
    messages: [systemMessage, query],
    tools: getTools(),
    options: {
      temperature: 0.1, // Lower temperature for more deterministic responses
    },
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
