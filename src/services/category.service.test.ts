import {
  createCategoryService,
  type CategoryService,
} from "./category.service";

describe("CategoryService", () => {
  let categoryService: CategoryService;

  beforeAll(async () => {
    categoryService = await createCategoryService();
  });

  it("should create a category", async () => {
    const category = await categoryService.createCategory(
      "Minha Categoria",
      "minha-categoria",
    );

    expect(category.name).toBe("Minha Categoria");
    expect(category.slug).toBe("minha-categoria");
  });
});
