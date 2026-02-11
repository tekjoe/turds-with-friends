import { metadata } from "./page";

describe("Login Page SEO", () => {
  it("has title containing 'Poop Tracker App' at the start", () => {
    const title = metadata.title as string;
    expect(title).toMatch(/^Poop Tracker App/);
  });

  it("has description between 150-160 characters", () => {
    const desc = metadata.description as string;
    expect(desc.length).toBeGreaterThanOrEqual(150);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it("has Open Graph title present", () => {
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.title).toBeDefined();
    expect(metadata.openGraph?.title).toContain("Poop Tracker App");
  });

  it("has Open Graph description present", () => {
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.description).toBeDefined();
    expect(metadata.openGraph?.description).toContain("poop tracker app");
  });

  it("has Open Graph type set to website", () => {
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.type).toBe("website");
  });

  it("has Twitter card meta tag present", () => {
    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter?.card).toBe("summary_large_image");
  });

  it("has Twitter title present", () => {
    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter?.title).toBeDefined();
    expect(metadata.twitter?.title).toContain("Poop Tracker App");
  });

  it("has Twitter description present", () => {
    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter?.description).toBeDefined();
  });
});
