export interface FlowchartExample {
  explanation: string;
  symbols: Record<string, string>;
  example: string;
}

export const flowchartExamples: Record<string, FlowchartExample> = {
  "basic": {
    explanation: "A flowchart is a visual representation of a process or algorithm using standardized symbols connected by arrows.",
    symbols: {
      "Oval": "Start/End points",
      "Rectangle": "Process steps",
      "Diamond": "Decision points",
      "Parallelogram": "Input/Output",
      "Arrow": "Flow direction"
    },
    example: `Here's a simple flowchart for a login process:

START
↓
[Input Username and Password]
↓
<Check if credentials are valid>
→ [No] → [Display Error Message] → [Return to Input]
↓ [Yes]
[Grant Access]
↓
END`
  }
};