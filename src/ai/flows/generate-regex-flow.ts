'use server';
/**
 * @fileOverview A regular expression generation AI agent.
 *
 * - generateRegex - A function that handles the regex generation process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRegexInputSchema = z.object({
  description: z.string().describe('A description of what the regular expression should match.'),
  flavor: z.string().optional().describe('The regex flavor (e.g. JavaScript, Python, PCRE). Default is JavaScript.'),
});

const GenerateRegexOutputSchema = z.object({
  regex: z.string().describe('The generated regular expression string.'),
  explanation: z.string().describe('A step-by-step explanation of how the regex works.'),
  samples: z.array(z.string()).describe('A few sample strings that would be matched by this regex.'),
});

export async function generateRegex(input: z.infer<typeof GenerateRegexInputSchema>) {
  return generateRegexFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRegexPrompt',
  input: {schema: GenerateRegexInputSchema},
  output: {schema: GenerateRegexOutputSchema},
  prompt: `You are an expert in regular expressions. 
  Given the following description, generate a regular expression that accurately matches the requirement.
  
  Description: {{{description}}}
  Flavor: {{#if flavor}}{{{flavor}}}{{else}}JavaScript{{/if}}
  
  Provide the regex (just the pattern string, no delimiters unless necessary for the flavor), a clear explanation of each part, and 3-5 sample strings that match.`,
});

const generateRegexFlow = ai.defineFlow(
  {
    name: 'generateRegexFlow',
    inputSchema: GenerateRegexInputSchema,
    outputSchema: GenerateRegexOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) throw new Error('Failed to generate regex');
    return output;
  }
);
