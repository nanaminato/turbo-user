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
    generator.generate("gpt-3.5-turbo-1106"),
    generator.generate("gpt-3.5-turbo"),
    generator.generate("gpt-3.5-turbo-16k"),
    generator.generate("gemini-pro",true),
    generator.generate("claude-2.1"),
    generator.generateWithName("gemini(转接)","gemini-pro_o",true),
    generator.generate("claude-3-opus-20240229"),
    generator.generate("claude-3-sonnet-20240229"),
    generator.generate("claude-3-haiku-20240307"),
    generator.generate("gpt-4"),
    generator.generate("gpt-4-1106-preview"),
    generator.generate("gpt-4-vision-preview",true),
    generator.generate("gpt-4-turbo",true)
  ];

