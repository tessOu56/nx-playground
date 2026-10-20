export type EmbeddingVector = number[];

export type EmbeddingResult = {
  model: string;
  dimensions: number;
  values: EmbeddingVector;
};

export type ExhibitionEmbeddingText = {
  id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  tags?: string[] | null;
  priceText?: string | null;
  contentHash?: string | null;
};

export interface EmbeddingProvider {
  readonly name: string;
  readonly model: string;
  readonly dimensions: number | null;
  embed(texts: string[]): Promise<EmbeddingResult[]>;
}
