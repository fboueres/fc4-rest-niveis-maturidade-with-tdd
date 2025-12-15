import { createDatabaseConnection } from "../database";
import type { CreateProductDTO } from "../dtos/create_product.dto";
import { Product } from "../entities/Product";
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
    expect(product.categories.map((item) => item.id)).toEqual([
      category1.id,
      category2.id,
    ]);
  });

  it("should get a Product by it's ID", async () => {
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

    const savedProduct = await productService.getProductById(product.id);

    expect(savedProduct).toBeInstanceOf(Product);
    expect(savedProduct?.id).toBe(product.id);
    expect(savedProduct?.name).toBe(product.name);
    expect(savedProduct?.slug).toBe(product.slug);
    expect(savedProduct?.description).toBe(product.description);
    expect(savedProduct?.price).toBe(product.price);
    expect(savedProduct?.categories).toEqual(product.categories);
  });

  it("should get a Product by it's slug", async () => {
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
      "my-product-slug",
      "Este é o Meu Produto.",
      100,
      [category1.id, category2.id],
    );

    const savedProduct = await productService.getProductBySlug(product.slug);

    expect(savedProduct).toBeInstanceOf(Product);
    expect(savedProduct?.id).toBe(product.id);
    expect(savedProduct?.name).toBe(product.name);
    expect(savedProduct?.slug).toBe(product.slug);
    expect(savedProduct?.description).toBe(product.description);
    expect(savedProduct?.price).toBe(product.price);
    expect(savedProduct?.categories).toEqual(product.categories);
  });

  it("should update a Product", async () => {
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
      "my-product-slug",
      "Este é o Meu Produto.",
      100,
      [category1.id, category2.id],
    );
    const category3 = await categoryService.createCategory(
      "Mine Category",
      "mine-category",
    );

    const data = {
      id: product.id,
      name: "Novo Produto",
      slug: "novo-produto",
      description: "Novissimo produto.",
      price: 200,
      categoryIds: [category3.id],
    };
    const updatedProduct = await productService.updateProduct(data);

    expect(updatedProduct).toBeInstanceOf(Product);
    expect(updatedProduct?.id).toBe(data.id);
    expect(updatedProduct?.name).toBe(data.name);
    expect(updatedProduct?.slug).toBe(data.slug);
    expect(updatedProduct?.description).toBe(data.description);
    expect(updatedProduct?.price).toBe(data.price);
    expect(updatedProduct?.categories.map((product) => product.id)).toEqual(
      data.categoryIds,
    );
  });

  it("should delete a Product", async () => {
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
      "my-product-slug",
      "Este é o Meu Produto.",
      100,
      [category1.id, category2.id],
    );

    await productService.deleteProduct(product.id);

    expect(await productService.getProductById(product.id)).toBeNull();
  });

  it("should list Products", async () => {
    const res = await productService.listProducts();

    expect(res.products.every((item) => item instanceof Product)).toBe(true);
    expect(res.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.anything(),
          name: expect.anything(),
          slug: expect.anything(),
          description: expect.anything(),
          price: expect.anything(),
        }),
      ]),
    );
    expect(typeof res.total).toBe("number");
  });

  it("should create many Products", async () => {
    await categoryService.createCategory("Minha Categoria", "minha-categoria");
    await categoryService.createCategory("My Categoria", "my-category");
    await categoryService.createCategory("My Categoria", "my-category");

    const productsDTOs: CreateProductDTO[] = [
      {
        name: "Wireless Headphones",
        slug: "wireless-headphones",
        description:
          "Premium over-ear wireless headphones with active noise cancellation and long battery life.",
        price: 249.99,
        categoryIds: [1],
      },
      {
        name: "Running Shoes",
        slug: "running-shoes",
        description:
          "Lightweight and cushioned running shoes designed for comfort and high performance.",
        price: 129.99,
        categoryIds: [2],
      },
      {
        name: "Yoga Mat Premium",
        slug: "yoga-mat-premium",
        description:
          "Extra-thick, non-slip yoga mat made from eco-friendly materials for ultimate comfort.",
        price: 44.99,
        categoryIds: [3],
      },
    ];

    const res: Product[] =
      await productService.createManyProducts(productsDTOs);

    expect(res.every((item) => item instanceof Product)).toBe(true);
    expect(res).toEqual(
      productsDTOs.map((dto) =>
        expect.objectContaining({
          name: dto.name,
          slug: dto.slug,
          description: dto.description,
          price: dto.price,
        }),
      ),
    );
  });
});
