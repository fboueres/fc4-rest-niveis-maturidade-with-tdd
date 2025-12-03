import { createDatabaseConnection } from "../database";
import { CategoryService } from "./category.service";
import { createProductService, ProductService } from "./product.service";

describe("ProductService", () => {
  let productService: ProductService;
  let categoryService: CategoryService;
  let productRepository;
  let categoryRepository;

  beforeAll(async () => {
    const database = await createDatabaseConnection();
    categoryRepository = database.categoryRepository;
    categoryService = new CategoryService(categoryRepository);
    productRepository = database.productRepository;
    productService = new ProductService(productRepository, categoryRepository);
  });

  it("should create a product", async () => {
    const category1 = await categoryService.createCategory(
      "Minha Categoria",
      "minha-categoria",
    );
    const category2 = await categoryService.createCategory(
      "My Categoria",
      "my-category",
    );

    const product = await productService.createProduct(
      "Meu Produto",
      "meu-produto",
      "Este é o Meu Produto.",
      100,
      [category1.id, category2.id],
    );

    expect(product.name).toBe("Meu Produto");
    expect(product.slug).toBe("meu-produto");
    expect(product.description).toBe("Este é o Meu Produto.");
    expect(product.price).toBe(100);
    expect(product.categories.map(item => item.id)).toEqual([category1.id, category2.id]);
  });
});
