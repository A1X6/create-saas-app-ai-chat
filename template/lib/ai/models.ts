import modelsData from './models.json';

export interface AIModel {
  id: string;
  name: string;
  maxTokens: number;
  type: 'free' | 'paid';
  category: string;
  inputPrice?: number;  // Price per million tokens (only for paid models)
  outputPrice?: number; // Price per million tokens (only for paid models)
}

// Cast JSON data to AIModel array
export const AI_MODELS: AIModel[] = modelsData as AIModel[];

// Group models by type
export const FREE_MODELS = AI_MODELS.filter(m => m.type === 'free');
export const PAID_MODELS = AI_MODELS.filter(m => m.type === 'paid');

// Group models by category
export const MODELS_BY_CATEGORY = AI_MODELS.reduce((acc, model) => {
  if (!acc[model.category]) {
    acc[model.category] = [];
  }
  acc[model.category].push(model);
  return acc;
}, {} as Record<string, AIModel[]>);

// Get model by ID
export function getModelById(id: string): AIModel | undefined {
  return AI_MODELS.find(m => m.id === id);
}

// Get default model (first free model)
export function getDefaultModel(): AIModel {
  return FREE_MODELS[0] || AI_MODELS[0];
}

// Check if a model is free
export function isModelFree(modelId: string): boolean {
  const model = getModelById(modelId);
  return model?.type === 'free';
}
