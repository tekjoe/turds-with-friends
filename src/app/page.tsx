import { Navbar } from "@/components/ui/Navbar";
import { Hero } from "@/components/landing/Hero";
import { BristolChart } from "@/components/bristol-scale/BristolChart";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-200">
      <Navbar />
      <main>
        <Hero />
        <BristolChart />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
