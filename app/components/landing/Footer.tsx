import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "Changelog", href: "#" },
    { label: "Roadmap", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

const socialLinks = [
  { label: "Twitter", href: "#", icon: FaXTwitter },
  { label: "Instagram", href: "#", icon: FaInstagram },
  { label: "LinkedIn", href: "#", icon: FaLinkedinIn },
];
export default function Footer() {
  return (
    <footer className="bg-indigo-600 text-white w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">
        {/* Gornji dio */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Logo + opis */}
          <div className="md:col-span-2">
            <span className="font-display text-2xl font-bold text-white mb-4 block">
              BookEasy
            </span>
            <p className="text-indigo-200 text-sm leading-relaxed mb-6 max-w-xs">
              The all-in-one booking platform for small businesses. Automate
              scheduling and grow faster.
            </p>

            {/* Newsletter */}
            <p className="text-sm font-medium text-white mb-3">
              Stay up to date
            </p>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-indigo-500 rounded-xl px-4 py-2.5 flex-1">
                <EnvelopeIcon className="w-4 h-4 text-indigo-300 shrink-0" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-transparent text-sm text-white placeholder-indigo-300 outline-none w-full"
                />
              </div>
              <button className="bg-white text-indigo-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-50 shrink-0">
                Subscribe
              </button>
            </div>
          </div>

          {/* Linkovi po kolonama */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-white mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-indigo-200 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Donji dio */}
        <div className="border-t border-indigo-500 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-indigo-200 text-sm">
            © 2026 BookEasy. All rights reserved.
          </p>

          {/* Social ikone */}
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 rounded-xl bg-indigo-500 hover:bg-indigo-400 flex items-center justify-center transition-colors"
              >
                <social.icon className="w-4 h-4 text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
