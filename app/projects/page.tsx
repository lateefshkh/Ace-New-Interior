"use client";

import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useParallax, useScrollReveal } from "@/hooks/use-motion";
import { IMAGES } from "@/lib/constants/images";

const portfolio = [
  {
    title: "Coastal Residence, Mangalore",
    category: "Residential",
    description:
      "A 4,200 sqft home balancing laterite stone, teak joinery, and cross-ventilation for the coastal climate.",
    image: IMAGES.hero,
  },
  {
    title: "Heritage Café, Udupi",
    category: "Commercial",
    description:
      "Adaptive reuse of a century-old structure with restrained material palette and custom brass lighting.",
    image: IMAGES.livingRoom,
  },
  {
    title: "Urban Penthouse, Bangalore",
    category: "Residential",
    description:
      "Monolithic kitchen island, hidden storage, and daylight-driven zoning across 3,400 sqft.",
    image: IMAGES.studio,
  },
  {
    title: "Beach Villa, Goa",
    category: "Residential",
    description:
      "Indoor-outdoor living with local stone, open courtyards, and salt-air-resistant finishes.",
    image: IMAGES.detail,
  },
];

export default function ProjectsPage() {
  useScrollReveal();
  useParallax();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <header className="relative flex min-h-[50vh] items-center justify-center overflow-hidden py-16">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={IMAGES.heroAlt}
            alt="Ace New Interior project showcase"
            data-parallax="25"
            className="absolute -top-[20%] left-0 h-[140%] w-full object-cover scale-105"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-container-max px-margin-mobile text-center md:px-margin-desktop">
          <div className="inline-block border-architectural bg-surface/85 px-8 py-12 backdrop-blur-md md:px-14 md:py-16">
            <span className="mb-3 block font-label-sm text-label-sm uppercase tracking-widest text-secondary">
              Selected Work
            </span>
            <h1 className="mb-4 font-display-lg text-headline-lg-mobile text-primary md:text-display-lg">
              Design Projects
            </h1>
            <p className="mx-auto max-w-lg font-body-lg text-body-lg text-on-surface-variant">
              Residential and commercial interiors across Mangalore, Udupi, Bangalore, and Goa.
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 bg-surface px-margin-mobile py-32 md:px-margin-desktop">
        <div className="mx-auto max-w-container-max">
          <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
            {portfolio.map((project, i) => (
              <article
                key={project.title}
                className={`group border-architectural bg-background reveal stagger-${i}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8">
                  <span className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                    {project.category}
                  </span>
                  <h2 className="mb-3 font-headline-md text-headline-md text-primary">{project.title}</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">{project.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-24 border-t border-primary/10 pt-16 text-center reveal">
            <p className="mb-6 font-body-lg text-body-lg text-on-surface-variant">
              Interested in a similar project for your space?
            </p>
            <Link
              href="/#inquiry"
              className="inline-block border border-primary/30 bg-surface px-8 py-4 font-label-sm text-label-sm uppercase tracking-widest text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-on-primary"
            >
              Start a Consultation
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
