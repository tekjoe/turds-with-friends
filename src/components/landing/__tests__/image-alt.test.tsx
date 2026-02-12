/**
 * Image alt tag tests for landing page SEO and accessibility
 * 
 * Ensures all images have descriptive alt attributes:
 * - Hero section user avatars have descriptive alt text
 * - Leaderboard avatars have user names as alt text
 * - Footer logo has descriptive alt text
 * - No images lack alt attributes (WCAG compliance)
 */
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/landing/Footer";

// Mock next/image to properly test alt attributes
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    fill?: boolean;
  }) => {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={props.src}
        alt={props.alt}
        width={props.width}
        height={props.height}
        className={props.className}
        data-testid="next-image"
      />
    );
  },
}));

describe("Landing Page Image Alt Tags", () => {
  describe("Hero Component", () => {
    const mockLeaderboard = [
      {
        rank: 1,
        name: "TestUser1",
        badge: "7 Day Streak 🔥",
        points: "1,000",
        avatarUrl: "https://example.com/avatar1.jpg",
      },
      {
        rank: 2,
        name: "TestUser2",
        badge: "3 Day Streak ⚡",
        points: "500",
        avatarUrl: null,
      },
    ];

    const mockAvatars = [
      "https://example.com/user1.jpg",
      null,
      "https://example.com/user3.jpg",
    ];

    it("hero user avatars have descriptive alt text including 'Poop Tracker App'", () => {
      render(
        <Hero
          userCount={1000}
          leaderboard={mockLeaderboard}
          avatars={mockAvatars}
        />
      );

      const images = screen.getAllByRole("img");
      const heroAvatars = images.filter((img) =>
        img.getAttribute("alt")?.includes("Poop Tracker App")
      );

      expect(heroAvatars.length).toBeGreaterThanOrEqual(2);
    });

    it("all hero avatars have non-empty alt attributes", () => {
      render(
        <Hero
          userCount={1000}
          leaderboard={mockLeaderboard}
          avatars={mockAvatars}
        />
      );

      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        const alt = img.getAttribute("alt");
        expect(alt).toBeTruthy();
        expect(alt?.trim()).not.toBe("");
      });
    });

    it("leaderboard avatars have user names as alt text", () => {
      render(
        <Hero
          userCount={1000}
          leaderboard={mockLeaderboard}
          avatars={mockAvatars}
        />
      );

      // Find the image with the user's name as alt
      const userAvatar = screen.getByAltText("TestUser1");
      expect(userAvatar).toBeInTheDocument();
    });

    it("avatar alt text is descriptive and meaningful", () => {
      render(
        <Hero
          userCount={1000}
          leaderboard={mockLeaderboard}
          avatars={mockAvatars}
        />
      );

      const images = screen.getAllByRole("img");
      images.forEach((img) => {
        const alt = img.getAttribute("alt") || "";
        // Alt text should be at least 5 characters (descriptive)
        expect(alt.length).toBeGreaterThanOrEqual(5);
      });
    });
  });

  describe("Footer Component", () => {
    it("footer logo has descriptive alt text", () => {
      render(<Footer />);

      const logo = screen.getByAltText(/Bowel Buddies Logo/i);
      expect(logo).toBeInTheDocument();
    });

    it("footer logo alt includes brand name", () => {
      render(<Footer />);

      const logo = screen.getByAltText(/Bowel Buddies/i);
      expect(logo).toBeInTheDocument();
    });
  });

  describe("WCAG Compliance", () => {
    const mockLeaderboard = [
      {
        rank: 1,
        name: "User1",
        badge: "Streak",
        points: "100",
        avatarUrl: "https://example.com/1.jpg",
      },
    ];

    const mockAvatars = ["https://example.com/a.jpg"];

    it("no images have empty or missing alt attributes", () => {
      render(
        <Hero userCount={100} leaderboard={mockLeaderboard} avatars={mockAvatars} />
      );
      render(<Footer />);

      const images = screen.getAllByRole("img");
      expect(images.length).toBeGreaterThan(0);

      images.forEach((img) => {
        const alt = img.getAttribute("alt");
        expect(alt).not.toBeNull();
        expect(alt?.trim()).not.toBe("");
      });
    });

    it("all images have meaningful alt descriptions", () => {
      render(
        <Hero userCount={100} leaderboard={mockLeaderboard} avatars={mockAvatars} />
      );
      render(<Footer />);

      const images = screen.getAllByRole("img");
      const meaningfulAltPatterns = [
        /user/i,
        /logo/i,
        /avatar/i,
        /profile/i,
        /Poop Tracker/i,
        /Bowel Buddies/i,
      ];

      images.forEach((img) => {
        const alt = img.getAttribute("alt") || "";
        const hasMeaningfulAlt = meaningfulAltPatterns.some((pattern) =>
          pattern.test(alt)
        );
        expect(hasMeaningfulAlt).toBe(true);
      });
    });
  });

  describe("SEO Impact", () => {
    it("alt text includes target keywords for image SEO", () => {
      const mockLeaderboard = [
        {
          rank: 1,
          name: "TestUser",
          badge: "Streak",
          points: "1000",
          avatarUrl: "https://example.com/avatar.jpg",
        },
      ];
      const mockAvatars = ["https://example.com/user.jpg"];

      render(
        <Hero userCount={1000} leaderboard={mockLeaderboard} avatars={mockAvatars} />
      );

      const images = screen.getAllByRole("img");
      const targetKeywords = ["Poop Tracker", "Bowel Buddies"];

      const imagesWithKeywords = images.filter((img) => {
        const alt = img.getAttribute("alt") || "";
        return targetKeywords.some((keyword) => alt.includes(keyword));
      });

      expect(imagesWithKeywords.length).toBeGreaterThanOrEqual(1);
    });
  });
});
