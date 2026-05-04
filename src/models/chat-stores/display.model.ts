export interface DisplayModel{
  modelName: string;
  modelValue: string;
  vision?: boolean;
  internet?: boolean;
}
export class DisplayModelGenerator{
  generate(value: string,vision:boolean = false): DisplayModel{
    return {
      modelName: value,
      modelValue: value,
      vision: vision
    };
  }
  generateWithName(name: string, value: string,vision:boolean = false): DisplayModel{
    return {
      modelName: name,
      modelValue: value,
      vision: vision
    };
  }
}
export const generator = new DisplayModelGenerator();
export const displayModels =
  [
    generator.generate("gpt-5.4-mini", true),
    generator.generate("grok-4.3", true),
    generator.generate("deepseek-v4-flash"),
    generator.generate("xiaomi-mimo-v2.5", true),
    generator.generate("claude-sonnet-4-6", true),
    generator.generate("gemini-3.1-pro-preview", true),
    generator.generate("gemini-3-flash-preview-free"),
  ];

