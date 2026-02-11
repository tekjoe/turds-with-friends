/**
 * SEO metadata tests
 * 
 * Ensures all SEO requirements are met:
 * - Title tag contains target keyword at the beginning
 * - Description is 150-160 characters and includes target keyword
 * - Open Graph tags present for all major properties
 * - Twitter Card tags present
 */
import { metadata } from "../layout";

describe("SEO Metadata", () => {
  describe("Title", () => {
    it("starts with 'poop tracker app'", () => {
      const title = metadata.title as string;
      expect(title.toLowerCase()).toMatch(/^poop tracker app/);
    });

    it("is under 60 characters", () => {
      const title = metadata.title as string;
      expect(title.length).toBeLessThanOrEqual(60);
    });

    it("contains brand name 'Bowel Buddies'", () => {
      const title = metadata.title as string;
      expect(title).toContain("Bowel Buddies");
    });
  });

  describe("Description", () => {
    it("is between 150-160 characters", () => {
      const desc = metadata.description as string;
      expect(desc.length).toBeGreaterThanOrEqual(150);
      expect(desc.length).toBeLessThanOrEqual(160);
    });

    it("includes target keyword 'poop tracker app'", () => {
      const desc = metadata.description as string;
      expect(desc.toLowerCase()).toContain("poop tracker app");
    });

    it("includes compelling CTA", () => {
      const desc = metadata.description as string;
      expect(desc.toLowerCase()).toContain("today");
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
        expect(image.alt).toContain("Poop Tracker");
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

  describe("Keywords", () => {
    it("includes target keyword in keywords list", () => {
      const keywords = metadata.keywords as string[];
      expect(keywords).toContain("poop tracker app");
    });

    it("includes related keywords", () => {
      const keywords = metadata.keywords as string[];
      expect(keywords).toContain("bowel tracking");
      expect(keywords).toContain("bristol stool chart");
      expect(keywords).toContain("gut health");
    });
  });
});
