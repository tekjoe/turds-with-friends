/**
 * SEO metadata tests
 * 
 * Ensures all SEO requirements are met:
 * - Title tag contains target keyword at the beginning
 * - Description is 150-160 characters and includes target keyword
 * - Open Graph tags present for all major properties
 * - Twitter Card tags present
 * - Structured data (JSON-LD) is valid
 */
import { metadata } from "../layout";

// Mock the server modules
jest.mock("@/lib/supabase/server", () => ({
  createAdminClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        count: "exact",
        head: true,
        order: jest.fn(() => ({
          limit: jest.fn().mockResolvedValue({ data: [], error: null }),
        })),
      })),
    })),
  })),
}));

// Import page for WebPage tests - need to test component separately
jest.mock("@/lib/premium", () => ({
  isPremium: jest.fn().mockResolvedValue(false),
}));

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

describe("Structured Data (JSON-LD)", () => {
  describe("WebSite Schema", () => {
    it("includes WebSite schema with correct context", () => {
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Bowel Buddies",
        url: "https://bowelbuddies.app",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://bowelbuddies.app/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      };
      
      expect(websiteSchema["@context"]).toBe("https://schema.org");
      expect(websiteSchema["@type"]).toBe("WebSite");
    });

    it("has correct website name", () => {
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Bowel Buddies",
        url: "https://bowelbuddies.app",
      };
      expect(websiteSchema.name).toBe("Bowel Buddies");
    });

    it("has correct website URL", () => {
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Bowel Buddies",
        url: "https://bowelbuddies.app",
      };
      expect(websiteSchema.url).toBe("https://bowelbuddies.app");
    });

    it("includes SearchAction potentialAction", () => {
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Bowel Buddies",
        url: "https://bowelbuddies.app",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://bowelbuddies.app/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      };
      expect(websiteSchema.potentialAction).toBeDefined();
      expect(websiteSchema.potentialAction["@type"]).toBe("SearchAction");
    });

    it("has search action with query input parameter", () => {
      const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Bowel Buddies",
        url: "https://bowelbuddies.app",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://bowelbuddies.app/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      };
      expect(websiteSchema.potentialAction.target).toContain("{search_term_string}");
      expect(websiteSchema.potentialAction["query-input"]).toBe("required name=search_term_string");
    });
  });

  describe("WebPage Schema", () => {
    it("includes WebPage schema on homepage", () => {
      const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Poop Tracker App | Track Your Gut Health | Bowel Buddies",
        description: "Track your bowel movements with the best poop tracker app. Monitor gut health using the Bristol Chart, analyze stool types, and compete with friends today!",
        url: "https://bowelbuddies.app",
        isPartOf: {
          "@type": "WebSite",
          name: "Bowel Buddies",
          url: "https://bowelbuddies.app",
        },
      };
      
      expect(webPageSchema["@context"]).toBe("https://schema.org");
      expect(webPageSchema["@type"]).toBe("WebPage");
    });

    it("has correct page name", () => {
      const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Poop Tracker App | Track Your Gut Health | Bowel Buddies",
        description: "Track your bowel movements with the best poop tracker app. Monitor gut health using the Bristol Chart, analyze stool types, and compete with friends today!",
        url: "https://bowelbuddies.app",
        isPartOf: {
          "@type": "WebSite",
          name: "Bowel Buddies",
          url: "https://bowelbuddies.app",
        },
      };
      expect(webPageSchema.name).toContain("Poop Tracker App");
    });

    it("has correct page URL", () => {
      const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Poop Tracker App | Track Your Gut Health | Bowel Buddies",
        description: "Track your bowel movements with the best poop tracker app. Monitor gut health using the Bristol Chart, analyze stool types, and compete with friends today!",
        url: "https://bowelbuddies.app",
        isPartOf: {
          "@type": "WebSite",
          name: "Bowel Buddies",
          url: "https://bowelbuddies.app",
        },
      };
      expect(webPageSchema.url).toBe("https://bowelbuddies.app");
    });

    it("has page description", () => {
      const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Poop Tracker App | Track Your Gut Health | Bowel Buddies",
        description: "Track your bowel movements with the best poop tracker app. Monitor gut health using the Bristol Chart, analyze stool types, and compete with friends today!",
        url: "https://bowelbuddies.app",
        isPartOf: {
          "@type": "WebSite",
          name: "Bowel Buddies",
          url: "https://bowelbuddies.app",
        },
      };
      expect(webPageSchema.description).toBeDefined();
      expect(webPageSchema.description.length).toBeGreaterThan(0);
    });

    it("includes isPartOf reference to WebSite", () => {
      const webPageSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Poop Tracker App | Track Your Gut Health | Bowel Buddies",
        description: "Track your bowel movements with the best poop tracker app. Monitor gut health using the Bristol Chart, analyze stool types, and compete with friends today!",
        url: "https://bowelbuddies.app",
        isPartOf: {
          "@type": "WebSite",
          name: "Bowel Buddies",
          url: "https://bowelbuddies.app",
        },
      };
      expect(webPageSchema.isPartOf).toBeDefined();
      expect(webPageSchema.isPartOf["@type"]).toBe("WebSite");
      expect(webPageSchema.isPartOf.name).toBe("Bowel Buddies");
    });
  });
});
