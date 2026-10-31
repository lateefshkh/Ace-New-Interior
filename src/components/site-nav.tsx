"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/services", label: "Services" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/account", label: "Account" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/15 bg-[#fbf9f6] opacity-100 shadow-md transition-all duration-300">
      <div className="mx-auto flex w-full max-w-container-max items-center justify-between px-margin-mobile py-6 md:px-margin-desktop">
        <Link
          href="/"
          className="font-headline-md text-headline-md tracking-tight text-primary transition-opacity hover:opacity-70"
        >
          Ace New Interior
        </Link>

        <nav className="hidden gap-8 md:flex">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-body-md text-body-md uppercase tracking-wider transition-all duration-300 hover:text-secondary ${
                  isActive ? "border-b-2 border-secondary pb-1 text-secondary" : "text-primary/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/#inquiry"
          className="hidden bg-primary px-6 py-3 font-label-sm text-label-sm uppercase tracking-widest text-on-primary transition-colors duration-300 hover:bg-secondary md:inline-block"
        >
          Consultation
        </Link>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="font-label-sm text-label-sm uppercase tracking-widest text-primary md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav className="absolute top-full left-0 w-full flex flex-col gap-6 border-b border-t border-primary/15 bg-[#fbf9f6] px-margin-mobile py-8 shadow-2xl z-50 md:hidden">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`font-body-md text-body-md uppercase tracking-wider ${
                  isActive ? "text-secondary" : "text-primary/70"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/#inquiry"
            onClick={() => setOpen(false)}
            className="bg-primary px-6 py-3 text-center font-label-sm text-label-sm uppercase tracking-widest text-on-primary"
          >
            Consultation
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
