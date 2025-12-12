export interface CreateProductDTO {
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryIds: number[];
}
