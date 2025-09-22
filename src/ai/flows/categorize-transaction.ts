'use server';

/**
 * @fileOverview AI-powered transaction categorization.
 *
 * This file defines a Genkit flow that suggests a transaction category based on the user's description.
 * The flow uses a language model to analyze the transaction description and recommend the most suitable category.
 *
 * @exports categorizeTransaction - A function that calls the categorizeTransactionFlow to categorize a transaction.
 * @exports CategorizeTransactionInput - The input type for the categorizeTransaction function.
 * @exports CategorizeTransactionOutput - The return type for the categorizeTransaction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTransactionInputSchema = z.object({
  description: z.string().describe('The description of the transaction.'),
  userId: z.string().describe('The ID of the user making the transaction.'),
});
export type CategorizeTransactionInput = z.infer<typeof CategorizeTransactionInputSchema>;

const CategorizeTransactionOutputSchema = z.object({
  categoryId: z.string().describe('The ID of the suggested category.'),
});
export type CategorizeTransactionOutput = z.infer<typeof CategorizeTransactionOutputSchema>;

export async function categorizeTransaction(input: CategorizeTransactionInput): Promise<CategorizeTransactionOutput> {
  return categorizeTransactionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeTransactionPrompt',
  input: {schema: CategorizeTransactionInputSchema},
  output: {schema: CategorizeTransactionOutputSchema},
  prompt: `You are an expert financial advisor helping users categorize their transactions.

  Given the following transaction description, suggest the most appropriate category ID.

  Transaction Description: {{{description}}}
  User ID: {{{userId}}}

  Respond with only the category ID.
  `,
});

const categorizeTransactionFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionFlow',
    inputSchema: CategorizeTransactionInputSchema,
    outputSchema: CategorizeTransactionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
