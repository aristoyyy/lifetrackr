import OpenAI from "openai";

const openai = new OpenAI({
    apiKey:'api-key',
});

const thoughts = [];
const tasks = [];

const prompt = `
You are an intelligent assistant that helps organize unstructured thoughts and tasks into a focused action item. Given the following inputs, analyze and synthesize them into a single, meaningful suggested task that helps move things forward.

Inputs:
Thoughts:
- ${thoughts.join('\n- ')}

Tasks:
- ${tasks.join('\n- ')}

Your job:
1. Understand the intent and priorities behind the thoughts and tasks.
2. Output a single suggested task that would have the most meaningful impact.
3. Be specific and action-oriented.

Respond with only the suggested task.
`;

const response = await openai.responses.create({
    model: "gpt-4.1",
    input: prompt,
});

const answer = response.output[0].content[0].text;

console.log(answer);


