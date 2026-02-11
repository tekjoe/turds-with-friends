import { render, screen } from "@testing-library/react";
import FeaturesPage from "./page";

// Mock the Icon component
jest.mock("@/components/ui/Icon", () => ({
  Icon: ({ name, className }: { name: string; className?: string }) => (
    <span data-testid={`icon-${name}`} className={className}>
      {name}
    </span>
  ),
}));

describe("FeaturesPage", () => {
  it("renders the page with main heading", () => {
    render(<FeaturesPage />);
    
    expect(
      screen.getByRole("heading", { level: 1, name: /Everything You Need/i })
    ).toBeInTheDocument();
  });

  it("renders all four main feature sections", () => {
    render(<FeaturesPage />);
    
    expect(
      screen.getByRole("heading", { name: "Smart Bowel Tracking" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Gamification & Rewards" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Social Features" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Privacy First" })
    ).toBeInTheDocument();
  });

  it("renders the main feature icons", () => {
    render(<FeaturesPage />);
    
    expect(screen.getByTestId("icon-track_changes")).toBeInTheDocument();
    expect(screen.getByTestId("icon-emoji_events")).toBeInTheDocument();
    expect(screen.getByTestId("icon-groups")).toBeInTheDocument();
    expect(screen.getByTestId("icon-lock")).toBeInTheDocument();
  });

  it("renders additional features section", () => {
    render(<FeaturesPage />);
    
    expect(
      screen.getByRole("heading", { level: 2, name: "More Great Features" })
    ).toBeInTheDocument();
    
    expect(screen.getByText("Daily Reminders")).toBeInTheDocument();
    expect(screen.getByText("Health Insights")).toBeInTheDocument();
    expect(screen.getByText("Doctor Reports")).toBeInTheDocument();
    expect(screen.getByText("Fiber Tracking")).toBeInTheDocument();
    expect(screen.getByText("Hydration Monitor")).toBeInTheDocument();
    expect(screen.getByText("Streak Tracking")).toBeInTheDocument();
  });

  it("renders the CTA section", () => {
    render(<FeaturesPage />);
    
    expect(
      screen.getByRole("heading", { name: "Ready to Get Started?" })
    ).toBeInTheDocument();
    
    expect(
      screen.getByRole("link", { name: "Start Tracking Free" })
    ).toBeInTheDocument();
  });

  it("includes JSON-LD structured data script", () => {
    render(<FeaturesPage />);
    
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    
    const jsonData = JSON.parse(script?.textContent || "{}");
    expect(jsonData["@context"]).toBe("https://schema.org");
    expect(jsonData["@type"]).toBe("WebPage");
    expect(jsonData.name).toBe("Features | Bowel Buddies");
  });

  it("renders the subtitle paragraph", () => {
    render(<FeaturesPage />);
    
    expect(
      screen.getByText(/Bowel Buddies combines powerful tracking tools/i)
    ).toBeInTheDocument();
  });

  it("renders descriptions for main features", () => {
    render(<FeaturesPage />);
    
    expect(screen.getByText(/Log your bowel movements with the Bristol Stool Chart/i)).toBeInTheDocument();
    expect(screen.getByText(/Earn XP, unlock badges like 'Fiber King'/i)).toBeInTheDocument();
    expect(screen.getByText(/Create private groups with friends/i)).toBeInTheDocument();
    expect(screen.getByText(/Your data is encrypted and secure/i)).toBeInTheDocument();
  });
});
