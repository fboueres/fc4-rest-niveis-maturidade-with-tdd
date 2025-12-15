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

  it("should find a category by ID", async () => {
    const category = await categoryService.createCategory(
      "Minha Categoria",
      "minha-categoria",
    );

    const res = await categoryService.getCategoryById(category.id);

    expect(res?.id).toBe(category.id);
    expect(res?.name).toBe(category.name);
    expect(res?.slug).toBe(category.slug);
  });

  it("should find a category by slug", async () => {
    const category = await categoryService.createCategory(
      "Minha Categoria",
      "minha-categoria",
    );

    const res = await categoryService.getCategoryBySlug(category.slug);

    expect(res?.slug).toBe(category.slug);
  });

  it("should update a category", async () => {
    const category = await categoryService.createCategory(
      "Minha Categoria",
      "minha-categoria",
    );

    const updatedCategoryData = {
      id: category.id,
      name: "New Name",
      slug: "New Slug",
    };

    const updatedCategory =
      await categoryService.updateCategory(updatedCategoryData);

    expect(updatedCategory?.id).toBe(category.id);
    expect(updatedCategory?.name).toBe(updatedCategoryData.name);
    expect(updatedCategory?.slug).toBe(updatedCategoryData.slug);
  });
});
