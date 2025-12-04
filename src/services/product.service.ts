import { createDatabaseConnection } from "../database";
import type { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { In, type Repository } from "typeorm";

export class ProductService {
  constructor(
    private productRepository: Repository<Product>,
    private categoryRepository: Repository<Category>,
  ) {}

  async createProduct(
    name: string,
    slug: string,
    description: string,
    price: number,
    categoryIds: number[],
  ): Promise<Product> {
    const categories = await this.categoryRepository.find({
      where: {
        id: In(categoryIds),
      },
    });

    const product = new Product();
    product.name = name;
    product.slug = slug;
    product.description = description;
    product.price = price;
    product.categories = categories;

    return await this.productRepository.save(product);
  }

  async getProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({
      where: { id },
      relations: ["categories"],
    });
  }
}

export async function createProductService(): Promise<ProductService> {
  const { productRepository, categoryRepository } =
    await createDatabaseConnection();

  return new ProductService(productRepository, categoryRepository);
}
