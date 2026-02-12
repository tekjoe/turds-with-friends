import { describe, it, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import MedicalDisclaimerPage, { metadata } from "./page";

// Mock the Footer component
jest.mock("@/components/landing/Footer", () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

// Mock the Icon component
jest.mock("@/components/ui/Icon", () => ({
  Icon: ({ name, className }: { name: string; className?: string }) => (
    <span data-testid={`icon-${name}`} className={className}>
      {name}
    </span>
  ),
}));

describe("MedicalDisclaimerPage", () => {
  describe("Page Structure", () => {
    it("renders the medical disclaimer page", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByText("Medical Disclaimer")).toBeInTheDocument();
    });

    it("includes the footer", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("renders JSON-LD structured data", () => {
      render(<MedicalDisclaimerPage />);
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      expect(scripts.length).toBeGreaterThan(0);
    });
  });

  describe("Hero Section", () => {
    it("displays the correct page title", () => {
      render(<MedicalDisclaimerPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Medical Disclaimer");
    });

    it("displays the health and safety badge", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByText("Health & Safety Notice")).toBeInTheDocument();
    });

    it("displays the medical icon in badge", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByTestId("icon-medical_services")).toBeInTheDocument();
    });

    it("displays the last updated date", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByText(/Last Updated: February 11, 2025/)).toBeInTheDocument();
    });
  });

  describe("Warning Banner", () => {
    it("displays the warning banner", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByText("Important Warning")).toBeInTheDocument();
    });

    it("displays warning icon", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByTestId("icon-warning")).toBeInTheDocument();
    });

    it("contains medical disclaimer warning text", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByText(/Bowel Buddies is a health tracking and educational tool/i)).toBeInTheDocument();
    });

    it("mentions not a substitute for professional medical advice", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByText(/not a substitute for professional medical advice/i)).toBeInTheDocument();
    });
  });

  describe("Sidebar Navigation", () => {
    it("displays 'On This Page' heading", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByText("On This Page")).toBeInTheDocument();
    });

    it("includes all section navigation links", () => {
      render(<MedicalDisclaimerPage />);
      const sections = [
        "Not Medical Advice",
        "No Doctor-Patient Relationship",
        "Emergency Situations",
        "Information Accuracy",
        "User Responsibility",
        "Consult Your Physician",
        "Liability Limitation",
      ];

      sections.forEach((section) => {
        const links = screen.getAllByText(section);
        expect(links.length).toBeGreaterThan(0);
      });
    });

    it("has navigation links with correct hrefs", () => {
      render(<MedicalDisclaimerPage />);
      const links = screen.getAllByRole("link");
      const sectionIds = [
        "#not-medical-advice",
        "#no-relationship",
        "#emergency",
        "#accuracy",
        "#responsibility",
        "#consult-physician",
        "#liability",
      ];

      sectionIds.forEach((id) => {
        const matchingLinks = links.filter((link) => link.getAttribute("href") === id);
        expect(matchingLinks.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Disclaimer Sections", () => {
    it("displays all section headings", () => {
      render(<MedicalDisclaimerPage />);
      const headings = [
        "Not Medical Advice",
        "No Doctor-Patient Relationship",
        "Emergency Situations",
        "Information Accuracy",
        "User Responsibility",
        "Consult Your Physician",
        "Liability Limitation",
      ];

      headings.forEach((heading) => {
        const elements = screen.getAllByRole("heading", { name: heading });
        expect(elements.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Emergency Section", () => {
    it("displays emergency heading", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByRole("heading", { name: "Emergency Situations" })).toBeInTheDocument();
    });

    it("includes emergency icon", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByTestId("icon-emergency")).toBeInTheDocument();
    });

    it("contains clear 911 emergency instructions", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByText(/call 911 immediately/i)).toBeInTheDocument();
    });

    it("mentions local emergency number", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByText(/local emergency number/i)).toBeInTheDocument();
    });

    it("lists severe symptoms that require emergency care", () => {
      render(<MedicalDisclaimerPage />);
      const symptoms = [
        "Severe abdominal pain",
        "Blood in stool",
        "Persistent vomiting",
        "severe dehydration",
        "High fever",
        "weight loss",
      ];

      symptoms.forEach((symptom) => {
        expect(screen.getByText(new RegExp(symptom, "i"))).toBeInTheDocument();
      });
    });
  });

  describe("Related Documents", () => {
    it("displays 'Related Documents' heading", () => {
      render(<MedicalDisclaimerPage />);
      expect(screen.getByText("Related Documents")).toBeInTheDocument();
    });

    it("links to Terms of Service", () => {
      render(<MedicalDisclaimerPage />);
      const link = screen.getByRole("link", { name: /Terms of Service/i });
      expect(link).toHaveAttribute("href", "/terms");
    });

    it("links to Privacy Policy", () => {
      render(<MedicalDisclaimerPage />);
      const link = screen.getByRole("link", { name: /Privacy Policy/i });
      expect(link).toHaveAttribute("href", "/privacy");
    });

    it("links to Contact page", () => {
      render(<MedicalDisclaimerPage />);
      const link = screen.getByRole("link", { name: /Contact Us/i });
      expect(link).toHaveAttribute("href", "/contact");
    });
  });

  describe("Metadata", () => {
    it("has title under 60 characters", () => {
      const title = metadata.title as string;
      expect(title.length).toBeLessThanOrEqual(60);
      expect(title).toBe("Medical Disclaimer | Bowel Buddies");
    });

    it("has description between 150-160 characters", () => {
      const description = metadata.description as string;
      expect(description.length).toBeGreaterThanOrEqual(150);
      expect(description.length).toBeLessThanOrEqual(160);
    });

    it("mentions medical disclaimer in description", () => {
      const description = metadata.description as string;
      expect(description.toLowerCase()).toContain("medical disclaimer");
    });

    it("has correct Open Graph configuration", () => {
      expect(metadata.openGraph).toMatchObject({
        type: "article",
        title: "Medical Disclaimer | Bowel Buddies",
        url: "https://bowelbuddies.app/medical-disclaimer",
      });
    });

    it("has Open Graph description", () => {
      expect(metadata.openGraph?.description).toBeDefined();
      expect(metadata.openGraph?.description).toContain("medical disclaimer");
    });

    it("has Twitter Card configuration", () => {
      expect(metadata.twitter).toMatchObject({
        card: "summary",
        title: "Medical Disclaimer | Bowel Buddies",
      });
    });

    it("has Twitter Card description", () => {
      expect(metadata.twitter?.description).toBeDefined();
      expect(metadata.twitter?.description).toContain("medical disclaimer");
    });

    it("has canonical URL", () => {
      expect(metadata.alternates).toEqual({
        canonical: "/medical-disclaimer",
      });
    });
  });

  describe("JSON-LD Structured Data", () => {
    it("includes WebPage schema type", () => {
      render(<MedicalDisclaimerPage />);
      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
      
      const jsonLd = JSON.parse(script?.textContent || "{}");
      expect(jsonLd["@type"]).toBe("WebPage");
    });

    it("has correct schema context", () => {
      render(<MedicalDisclaimerPage />);
      const script = document.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || "{}");
      expect(jsonLd["@context"]).toBe("https://schema.org");
    });

    it("includes page name", () => {
      render(<MedicalDisclaimerPage />);
      const script = document.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || "{}");
      expect(jsonLd.name).toBe("Medical Disclaimer | Bowel Buddies");
    });

    it("includes page URL", () => {
      render(<MedicalDisclaimerPage />);
      const script = document.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || "{}");
      expect(jsonLd.url).toBe("https://bowelbuddies.app/medical-disclaimer");
    });

    it("includes isPartOf referencing WebSite", () => {
      render(<MedicalDisclaimerPage />);
      const script = document.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || "{}");
      expect(jsonLd.isPartOf).toMatchObject({
        "@type": "WebSite",
        name: "Bowel Buddies",
        url: "https://bowelbuddies.app",
      });
    });

    it("includes dateModified", () => {
      render(<MedicalDisclaimerPage />);
      const script = document.querySelector('script[type="application/ld+json"]');
      const jsonLd = JSON.parse(script?.textContent || "{}");
      expect(jsonLd.dateModified).toBe("2025-02-11");
    });
  });
});
