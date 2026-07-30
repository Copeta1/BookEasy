"use client";

import { useTranslation } from "react-i18next";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";

const socialLinks = [
  { label: "Twitter", href: "#", icon: FaXTwitter },
  { label: "Instagram", href: "#", icon: FaInstagram },
  { label: "LinkedIn", href: "#", icon: FaLinkedinIn },
];

export default function Footer() {
  const { t } = useTranslation();

  const productLinks = t("footer.productLinks", { returnObjects: true }) as string[];
  const companyLinks = t("footer.companyLinks", { returnObjects: true }) as string[];
  const supportLinks = t("footer.supportLinks", { returnObjects: true }) as string[];

  const footerColumns = [
    { category: t("footer.product"), links: productLinks },
    { category: t("footer.company"), links: companyLinks },
    { category: t("footer.support"), links: supportLinks },
  ];

  return (
    <footer className="bg-stone-900 text-white w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">
        {/* Gornji dio */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          {/* Logo + opis */}
          <div className="md:col-span-2">
            <span className="font-display text-2xl font-bold text-white mb-4 block">
              BookEasy
            </span>
            <p className="text-stone-400 text-sm leading-relaxed mb-6 max-w-xs">
              {t("footer.description")}
            </p>

            {/* Newsletter */}
            <p className="text-sm font-medium text-white mb-3">
              {t("footer.stayUpToDate")}
            </p>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-stone-800 rounded-full px-4 py-2.5 flex-1">
                <EnvelopeIcon className="w-4 h-4 text-moss-400 shrink-0" />
                <input
                  type="email"
                  placeholder={t("footer.emailPlaceholder") ?? ""}
                  className="bg-transparent text-sm text-white placeholder-stone-500 outline-none w-full"
                />
              </div>
              <button className="bg-moss-500 text-white text-sm font-semibold px-4 py-2.5 rounded-full hover:bg-moss-400 shrink-0">
                {t("footer.subscribe")}
              </button>
            </div>
          </div>

          {/* Linkovi po kolonama */}
          {footerColumns.map((column) => (
            <div key={column.category}>
              <h4 className="text-sm font-semibold text-white mb-4">
                {column.category}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-stone-400 text-sm hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Donji dio */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-stone-400 text-sm">{t("footer.copyright")}</p>

          {/* Social ikone */}
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-moss-600 flex items-center justify-center transition-colors"
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
