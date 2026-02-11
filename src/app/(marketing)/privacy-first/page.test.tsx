import { metadata } from "./page";

describe("Privacy First Page SEO", () => {
  it("has correct title", () => {
    expect(metadata.title).toBe("Privacy First | Bowel Buddies");
  });

  it("has description between 150-160 characters", () => {
    const desc = metadata.description as string;
    expect(desc.length).toBeGreaterThanOrEqual(150);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it("has Open Graph metadata configured", () => {
    expect(metadata.openGraph).toBeDefined();
    expect(metadata.openGraph?.type).toBe("website");
    expect(metadata.openGraph?.siteName).toBe("Bowel Buddies");
    expect(metadata.openGraph?.title).toBe("Privacy First | Bowel Buddies");
  });

  it("has Open Graph description", () => {
    const ogDesc = metadata.openGraph?.description as string;
    expect(ogDesc).toBeDefined();
    expect(ogDesc.length).toBeGreaterThanOrEqual(150);
    expect(ogDesc.length).toBeLessThanOrEqual(160);
  });

  it("has Open Graph image", () => {
    expect(metadata.openGraph?.images).toBeDefined();
    const images = metadata.openGraph?.images as Array<{
      url: string;
      width: number;
      height: number;
      alt: string;
    }>;
    expect(images?.length).toBeGreaterThan(0);
    expect(images?.[0].url).toBe("/og-image.png");
    expect(images?.[0].width).toBe(1200);
    expect(images?.[0].height).toBe(630);
  });

  it("has Twitter Card metadata", () => {
    expect(metadata.twitter).toBeDefined();
    expect(metadata.twitter?.card).toBe("summary_large_image");
  });

  it("has Twitter title", () => {
    expect(metadata.twitter?.title).toBe("Privacy First | Bowel Buddies");
  });

  it("has Twitter description", () => {
    const twitterDesc = metadata.twitter?.description as string;
    expect(twitterDesc).toBeDefined();
    expect(twitterDesc.length).toBeGreaterThanOrEqual(150);
    expect(twitterDesc.length).toBeLessThanOrEqual(160);
  });

  it("has Twitter image", () => {
    const images = metadata.twitter?.images as string[];
    expect(images).toBeDefined();
    expect(images?.[0]).toBe("/og-image.png");
  });
});
