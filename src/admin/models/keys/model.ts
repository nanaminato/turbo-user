export interface Model{
  modelId?: number;
  name?: string;
  enable?: boolean;
  isChatModel: boolean;
  vision: boolean;
  modelValue?: string;
}
