import { Repository } from "typeorm";
import { createDatabaseConnection } from "./database";
import { Product } from "./entities/Product";
import { Category } from "./entities/Category";

describe("createDatabaseConnection", () => {
  it("should return entities repository", async () => {
    const { productRepository, categoryRepository } =
      await createDatabaseConnection();

    expect(productRepository).toBeInstanceOf(Repository<Product>);
    expect(categoryRepository).toBeInstanceOf(Repository<Category>);
  });
});
