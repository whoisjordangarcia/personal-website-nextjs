import { describe, it, expect } from "vitest";
import { resolve } from "node:path";
import { getAllArticles, getArticle } from "./articles";

const FIXTURES_DIR = resolve(__dirname, "./__fixtures__/articles");

describe("getAllArticles", () => {
  it("returns all articles as ArticleMeta objects", async () => {
    const articles = await getAllArticles(FIXTURES_DIR);
    expect(articles).toHaveLength(2);
  });

  it("returns articles sorted newest first by date", async () => {
    const articles = await getAllArticles(FIXTURES_DIR);
    expect(articles[0]!.date).toBe("2026-06-01");
    expect(articles[1]!.date).toBe("2026-05-01");
  });

  it("returns correct frontmatter fields", async () => {
    const articles = await getAllArticles(FIXTURES_DIR);
    const article = articles.find((a) => a.slug === "test-article-two");
    expect(article).toMatchObject({
      title: "Test Article Two",
      slug: "test-article-two",
      date: "2026-06-01",
      description: "Second fixture article for testing.",
      readingTime: 5,
    });
  });
});

describe("getArticle", () => {
  it("returns meta and content for a valid slug", async () => {
    const { meta, content } = await getArticle(
      "test-article-one",
      FIXTURES_DIR,
    );
    expect(meta.title).toBe("Test Article One");
    expect(content).toContain("content of test article one");
  });

  it("throws for a slug that does not exist", async () => {
    await expect(getArticle("does-not-exist", FIXTURES_DIR)).rejects.toThrow();
  });
});
