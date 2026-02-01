import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-6 text-white">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="sentiment_satisfied" className="text-sm" />
            </div>
            <span className="text-lg font-bold font-display">Turds with Friends</span>
          </div>
          <p className="max-w-xs mb-8">
            Making bowel health conversation accessible, fun, and data-driven for
            everyone around the world.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
            >
              <Icon name="share" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors"
            >
              <Icon name="chat" />
            </a>
          </div>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="font-bold text-white mb-6">Product</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="#chart" className="hover:text-primary transition-colors">
                Stool Chart
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy First
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Premium Plan
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h4 className="font-bold text-white mb-6">Legal</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Medical Disclaimer
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-primary transition-colors">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium uppercase tracking-widest text-slate-500">
        <p>&copy; {new Date().getFullYear()} Turds with Friends. All rights reserved.</p>
        <p>Stay Regular. Stay Happy. 💩</p>
      </div>
    </footer>
  );
}
