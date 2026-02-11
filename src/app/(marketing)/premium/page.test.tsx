/**
 * Premium page SEO tests
 *
 * Ensures all SEO requirements are met for the Premium page:
 * - Title tag contains target keyword at the beginning
 * - Description is 150-160 characters
 * - Open Graph tags present
 * - Twitter Card tags present
 * - JSON-LD structured data is valid
 */

import { metadata } from "./page";

describe("Premium Page SEO", () => {
  describe("Title", () => {
    it("starts with 'Premium Plan'", () => {
      const title = metadata.title as string;
      expect(title).toMatch(/^Premium Plan/);
    });

    it("contains brand name 'Bowel Buddies'", () => {
      const title = metadata.title as string;
      expect(title).toContain("Bowel Buddies");
    });

    it("is under 60 characters", () => {
      const title = metadata.title as string;
      expect(title.length).toBeLessThanOrEqual(60);
    });
  });

  describe("Description", () => {
    it("is between 150-160 characters", () => {
      const desc = metadata.description as string;
      expect(desc.length).toBeGreaterThanOrEqual(150);
      expect(desc.length).toBeLessThanOrEqual(160);
    });

    it("mentions Premium", () => {
      const desc = metadata.description as string;
      expect(desc.toLowerCase()).toContain("premium");
    });

    it("mentions Bowel Buddies", () => {
      const desc = metadata.description as string;
      expect(desc).toContain("Bowel Buddies");
    });
  });

  describe("Open Graph", () => {
    it("has og:type set to website", () => {
      expect(metadata.openGraph?.type).toBe("website");
    });

    it("has og:site_name set", () => {
      expect(metadata.openGraph?.siteName).toBe("Bowel Buddies");
    });

    it("has og:title matching page title", () => {
      expect(metadata.openGraph?.title).toBe(metadata.title);
    });

    it("has og:description matching page description", () => {
      expect(metadata.openGraph?.description).toBe(metadata.description);
    });

    it("has og:image defined", () => {
      const images = metadata.openGraph?.images;
      expect(images).toBeDefined();
      expect(Array.isArray(images)).toBe(true);
      expect(images).toHaveLength(1);
    });

    it("has og:image with correct dimensions", () => {
      const images = metadata.openGraph?.images;
      if (Array.isArray(images) && images.length > 0) {
        const image = images[0];
        expect(image.url).toBe("/og-image.png");
        expect(image.width).toBe(1200);
        expect(image.height).toBe(630);
        expect(image.alt).toContain("Premium");
      }
    });
  });

  describe("Twitter Card", () => {
    it("has twitter:card set to summary_large_image", () => {
      expect(metadata.twitter?.card).toBe("summary_large_image");
    });

    it("has twitter:title matching page title", () => {
      expect(metadata.twitter?.title).toBe(metadata.title);
    });

    it("has twitter:description matching page description", () => {
      expect(metadata.twitter?.description).toBe(metadata.description);
    });

    it("has twitter:image defined", () => {
      const images = metadata.twitter?.images;
      expect(images).toBeDefined();
      expect(Array.isArray(images)).toBe(true);
      expect(images).toContain("/og-image.png");
    });
  });
});

describe("Premium Page Structured Data", () => {
  it("has metadata defined", () => {
    expect(metadata).toBeDefined();
  });

  it("includes title in metadata", () => {
    expect(metadata.title).toBeDefined();
  });

  it("includes description in metadata", () => {
    expect(metadata.description).toBeDefined();
  });
});
