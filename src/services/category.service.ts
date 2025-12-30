import type { Repository } from "typeorm";
import { Category } from "../entities/Category";
import { createDatabaseConnection } from "../database";
import { CreateCategoryDTO } from "../dtos/create_category.dto";

export class CategoryService {
  constructor(private categoryRepository: Repository<Category>) {}

  async createCategory(name: string, slug: string): Promise<Category> {
    const category = new Category();
    category.name = name;
    category.slug = slug;

    return await this.categoryRepository.save(category);
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    return await this.categoryRepository.findOne({ where: { slug } });
  }

  async updateCategory(data: {
    id: number;
    name?: string;
    slug?: string;
  }): Promise<Category | null> {
    const { id, name, slug } = data;
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) return null;

    if (name) category.name = name;
    if (slug) category.slug = slug;

    return await this.categoryRepository.save(category);
  }

  async createManyCategories(
    categoriesDTOs: CreateCategoryDTO[],
  ): Promise<Category[]> {
    const categories: Category[] = [];

    categoriesDTOs.forEach(dto => {
      const category = new Category();
      category.name = dto.name;
      category.slug = dto.slug;
      categories.push(category);
    });

    return await this.categoryRepository.save(categories);
  }
}

export async function createCategoryService(): Promise<CategoryService> {
  const { categoryRepository } = await createDatabaseConnection();
  return new CategoryService(categoryRepository);
}
