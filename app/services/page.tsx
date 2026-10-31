"use client";

import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useParallax, useScrollReveal } from "@/hooks/use-motion";
import { IMAGES } from "@/lib/constants/images";

const SERVICES_HERO_IMG = IMAGES.livingRoom;

const servicesList = [
  {
    number: "01",
    title: "Interior Architecture & Spatial Design",
    description:
      "Comprehensive spatial planning, volume re-configuration, custom millwork engineering, and structural finish selection for luxury residences and flagship commercial spaces.",
    deliverables: [
      "Spatial Layout Diagrams",
      "3D Architectural Renderings",
      "Technical Millwork Drawings",
    ],
  },
  {
    number: "02",
    title: "Custom Furniture & Object Curation",
    description:
      "Designing bespoke furniture pieces, sculptural joinery, and sourcing materials from trusted local and regional craftspeople.",
    deliverables: [
      "Custom Furniture Prototypes",
      "Art & Vintage Procurement",
      "Material & Finish Palette",
    ],
  },
  {
    number: "03",
    title: "Lighting Architecture & Atmosphere",
    description:
      "Architectural lighting design that celebrates natural daylight trajectories during the day and creates contemplative evening atmospheres with hidden linear channels.",
    deliverables: [
      "Daylight Flow Studies",
      "Custom Fixture Specs",
      "Atmospheric Scene Programming",
    ],
  },
  {
    number: "04",
    title: "Turnkey Site Supervision & Executive Oversight",
    description:
      "On-site architectural supervision working alongside general contractors and master stonemasons to guarantee absolute technical execution of every joint and tolerance.",
    deliverables: [
      "Construction Quality Control",
      "Contractor Coordination",
      "Final Turnkey Delivery",
    ],
  },
];

export default function ServicesPage() {
  useScrollReveal();
  useParallax();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <header className="relative flex min-h-[60vh] items-center justify-center overflow-hidden py-16">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={SERVICES_HERO_IMG}
            alt="Ace New Interior architectural detail"
            data-parallax="25"
            className="absolute -top-[20%] left-0 h-[140%] w-full object-cover scale-105"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-container-max px-margin-mobile text-center md:px-margin-desktop">
          <div className="inline-block border-architectural bg-surface/85 px-8 py-12 backdrop-blur-md md:px-14 md:py-16">
            <span className="mb-3 block font-label-sm text-label-sm uppercase tracking-widest text-secondary">
              Scope of Practice
            </span>
            <h1 className="mb-4 font-display-lg text-headline-lg-mobile text-primary md:text-display-lg">
              Architectural Services
            </h1>
            <p className="mx-auto max-w-lg font-body-lg text-body-lg text-on-surface-variant">
              From concept development to custom millwork and turnkey realization.
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 bg-surface">
        <section className="px-margin-mobile py-32 md:px-margin-desktop">
          <div className="mx-auto max-w-container-max">
            <div className="mb-20 max-w-3xl reveal">
              <span className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                Capabilities
              </span>
              <h2 className="font-display-lg text-headline-lg-mobile text-primary md:text-headline-lg">
                Precision & Excellence Across Every Dimension.
              </h2>
            </div>

            <div className="space-y-16">
              {servicesList.map((service, i) => (
                <div
                  key={service.title}
                  className={`grid grid-cols-1 gap-gutter border-t border-primary/10 pt-10 reveal stagger-${i % 3} md:grid-cols-12`}
                >
                  <div className="md:col-span-3">
                    <span className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                      {service.number}
                    </span>
                    <h3 className="font-headline-md text-headline-md text-primary">
                      {service.title}
                    </h3>
                  </div>

                  <div className="md:col-span-5">
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      {service.description}
                    </p>
                  </div>

                  <div className="md:col-span-4">
                    <span className="mb-3 block font-label-sm text-label-sm uppercase tracking-widest text-primary/60">
                      Deliverables
                    </span>
                    <ul className="space-y-2 font-body-md text-body-md text-primary">
                      {service.deliverables.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 bg-secondary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="border-t border-primary/10 bg-primary px-margin-mobile py-28 text-on-primary md:px-margin-desktop">
          <div className="mx-auto max-w-container-max text-center">
            <h2 className="mb-6 font-display-lg text-headline-lg-mobile text-on-primary md:text-display-lg">
              Initiate Your Commission
            </h2>
            <p className="mx-auto mb-10 max-w-xl font-body-lg text-body-lg text-on-primary/80">
              Discuss your residential or commercial project scope with our architectural team.
            </p>
            <Link
              href="/#inquiry"
              className="inline-block bg-secondary px-10 py-5 font-label-sm text-label-sm uppercase tracking-widest text-on-secondary transition-all duration-300 hover:bg-surface hover:text-primary"
            >
              Request Consultation
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
