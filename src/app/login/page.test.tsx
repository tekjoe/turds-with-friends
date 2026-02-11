import { Metadata } from "next";
import * as fs from "fs";
import * as path from "path";

describe("SEO-LOGIN-001: Login Page Metadata", () => {
  let metadata: Metadata;

  beforeAll(async () => {
    // Import the metadata from the page
    const pageModule = await import("./page");
    metadata = pageModule.metadata;
  });

  describe("Basic Metadata", () => {
    it("should have a title", () => {
      expect(metadata.title).toBeDefined();
    });

    it("should have title under 60 characters", () => {
      const title = metadata.title as string;
      expect(title.length).toBeLessThanOrEqual(60);
    });

    it("should contain 'Bowel Buddies' in the title", () => {
      const title = metadata.title as string;
      expect(title).toContain("Bowel Buddies");
    });

    it("should have the exact title: 'Poop Tracker App | Sign In - Bowel Buddies'", () => {
      expect(metadata.title).toBe("Poop Tracker App | Sign In - Bowel Buddies");
    });

    it("should have a description", () => {
      expect(metadata.description).toBeDefined();
    });

    it("should have description between 140-160 characters", () => {
      const desc = metadata.description as string;
      expect(desc.length).toBeGreaterThanOrEqual(140);
      expect(desc.length).toBeLessThanOrEqual(160);
    });

    it("should contain 'poop tracker' in the description", () => {
      const desc = metadata.description as string;
      expect(desc.toLowerCase()).toContain("poop tracker");
    });

    it("should have keywords", () => {
      expect(metadata.keywords).toBeDefined();
    });

    it("should have an array of keywords", () => {
      const keywords = metadata.keywords as string[];
      expect(Array.isArray(keywords)).toBe(true);
      expect(keywords.length).toBeGreaterThan(0);
    });

    it("should include target keyword 'poop tracker app'", () => {
      const keywords = metadata.keywords as string[];
      expect(keywords).toContain("poop tracker app");
    });

    it("should include login-related keywords", () => {
      const keywords = metadata.keywords as string[];
      expect(keywords).toContain("sign in");
      expect(keywords).toContain("login");
    });

    it("should include health-related keywords", () => {
      const keywords = metadata.keywords as string[];
      expect(keywords).toContain("gut health");
      expect(keywords).toContain("bristol stool chart");
    });
  });

  describe("Canonical URL", () => {
    it("should have alternates defined", () => {
      expect(metadata.alternates).toBeDefined();
    });

    it("should have canonical URL", () => {
      expect(metadata.alternates?.canonical).toBeDefined();
    });

    it("should have correct canonical URL", () => {
      expect(metadata.alternates?.canonical).toBe("https://bowelbuddies.app/login");
    });
  });

  describe("Open Graph Metadata", () => {
    it("should have openGraph defined", () => {
      expect(metadata.openGraph).toBeDefined();
    });

    it("should have openGraph.type defined", () => {
      expect(metadata.openGraph?.type).toBe("website");
    });

    it("should have openGraph.title defined", () => {
      expect(metadata.openGraph?.title).toBeDefined();
    });

    it("should have openGraph.description defined", () => {
      expect(metadata.openGraph?.description).toBeDefined();
    });

    it("should have openGraph.url defined", () => {
      expect(metadata.openGraph?.url).toBe("https://bowelbuddies.app/login");
    });

    it("should have openGraph.images defined", () => {
      expect(metadata.openGraph?.images).toBeDefined();
    });

    it("should have at least one image in openGraph.images", () => {
      const images = metadata.openGraph?.images;
      expect(Array.isArray(images)).toBe(true);
      expect(images?.length).toBeGreaterThan(0);
    });

    it("should have image with url, width, height, and alt", () => {
      const images = metadata.openGraph?.images as Array<{
        url: string;
        width: number;
        height: number;
        alt: string;
      }>;
      const image = images[0];
      expect(image.url).toBeDefined();
      expect(image.width).toBe(1200);
      expect(image.height).toBe(630);
      expect(image.alt).toBeDefined();
    });
  });

  describe("Twitter Card Metadata", () => {
    it("should have twitter defined", () => {
      expect(metadata.twitter).toBeDefined();
    });

    it("should have twitter.card defined as summary_large_image", () => {
      expect(metadata.twitter?.card).toBe("summary_large_image");
    });

    it("should have twitter.title defined", () => {
      expect(metadata.twitter?.title).toBeDefined();
    });

    it("should have twitter.description defined", () => {
      expect(metadata.twitter?.description).toBeDefined();
    });

    it("should have twitter.images defined", () => {
      expect(metadata.twitter?.images).toBeDefined();
    });

    it("should have at least one image in twitter.images", () => {
      const images = metadata.twitter?.images as string[];
      expect(Array.isArray(images)).toBe(true);
      expect(images.length).toBeGreaterThan(0);
    });
  });

  describe("SEO Impact Validation", () => {
    it("title should be 42 characters (under 60 char limit)", () => {
      const title = metadata.title as string;
      expect(title.length).toBe(42);
    });

    it("description should be 155 characters (within 140-160 range)", () => {
      const desc = metadata.description as string;
      expect(desc.length).toBe(155);
    });

    it("should include 8 relevant keywords", () => {
      const keywords = metadata.keywords as string[];
      expect(keywords.length).toBe(8);
    });
  });
});

describe("SEO-LOGIN-002: Login Page JSON-LD Structured Data", () => {
  const pagePath = path.join(__dirname, "page.tsx");
  const pageContent = fs.readFileSync(pagePath, "utf-8");

  it("should include WebPage schema with correct context", () => {
    expect(pageContent).toContain('"@context": "https://schema.org"');
    expect(pageContent).toContain('"@type": "WebPage"');
  });

  it("should have WebPage name matching page title", () => {
    expect(pageContent).toContain('"@type": "WebPage"');
    expect(pageContent).toContain('"Poop Tracker App | Sign In - Bowel Buddies"');
  });

  it("should have WebPage URL matching canonical", () => {
    expect(pageContent).toContain('"https://bowelbuddies.app/login"');
  });

  it("should include isPartOf reference to WebSite", () => {
    expect(pageContent).toContain('isPartOf');
    expect(pageContent).toContain('"@type": "WebSite"');
    expect(pageContent).toContain('"Bowel Buddies"');
  });

  it("should render JSON-LD script tag", () => {
    expect(pageContent).toContain('type="application/ld+json"');
    expect(pageContent).toContain("dangerouslySetInnerHTML");
  });
});
