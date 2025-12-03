import { DataSource } from "typeorm";
import { Product } from "./entities/Product";
import { Category } from "./entities/Category";

let dataSource: DataSource;

export async function createDatabaseConnection() {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "sqlite",
      //database: "database.sqlite",
      database: ":memory:",
      entities: [Product, Category],
      //logging: true,
      synchronize: true,
    });
    await dataSource.initialize();
  }

  return {
    productRepository: dataSource.getRepository(Product),
    categoryRepository: dataSource.getRepository(Category),
  };
}
