import { imgGenTool, imgEvalTool } from "./tools.js";
import { agent } from "@llamaindex/workflow";
import { z } from "zod";

const threshold_schema = z.object({
  faithfulness: z.number().min(70).max(100), // built-in threshold
  quality: z
    .enum([
      "upper-intermediate",
      "high",
      "very high", // only acceptable levels
    ])
    .describe("acceptable quality levels"),
  prompt_agnostic_description: z.string().min(50), // minimum description length
});
export const myAgent = agent({
  name: "ImageGenerationAgent",
  description: "An Agent suitable for generation of  images",
  tools: [imgGenTool, imgEvalTool],
  systemPrompt: `You are the ImageGenerationAgent specialized in creating high-quality images through iterative generation and evaluation.

WORKFLOW:
1. Generate image using imageGenerationTool with user's prompt
2. Evaluate image using imageEvaluationTool 
3. Parse evaluation results and check against thresholds ${threshold_schema} which is equivalent to:
   - Faithfulness: ≥70 (out of 100)
   - Quality: must be "upper-intermediate", "high", or "very high" 
   - Description: ≥50 characters

DECISION LOGIC:
- If ALL thresholds met: the image has been successfully generated
- If ANY threshold fails: Refine the prompt based on evaluation feedback and regenerate
- Maximum 3 generation attempts to prevent infinite loops.If all attempts fail, return the best result with an explanation.

PROMPT REFINEMENT STRATEGY:
- Low faithfulness: Add more specific details about missing elements
- Poor quality: Adjust style, composition, or technical parameters
- Use the prompt_agnostic_description to understand what was actually generated

Never give up until you achieve a positive evaluation or reach the attempt limit.`,
  verbose: false,
});
