import { Link } from "@tanstack/react-router";

const social = ["Instagram", "LinkedIn", "Journal"];

export function SiteFooter() {
  return (
    <footer className="mt-auto w-full border-t border-primary/10 bg-surface py-20">
      <div className="mx-auto grid max-w-container-max grid-cols-1 gap-gutter px-margin-mobile md:grid-cols-2 md:px-margin-desktop">
        <div className="flex flex-col justify-between">
          <Link
            to="/"
            className="mb-12 block font-headline-lg text-headline-lg-mobile text-primary md:mb-0 md:text-headline-lg"
          >
            Ace New Interior
          </Link>
          <p className="mt-8 font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant md:mt-0">
            © 2024 Ace New Interior. All Rights Reserved.
          </p>
        </div>

        <nav className="flex flex-col gap-4 md:items-end">
          {social.map((item) => (
            <a
              key={item}
              href="#"
              className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant transition-all duration-300 ease-out hover:text-primary hover:opacity-70"
            >
              {item}
            </a>
          ))}
          <Link
            to="/"
            hash="inquiry"
            className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-on-surface-variant transition-all duration-300 ease-out hover:text-primary hover:opacity-70"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
