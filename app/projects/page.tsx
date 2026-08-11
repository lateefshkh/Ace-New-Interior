"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useParallax, useScrollReveal } from "@/hooks/use-motion";

const KYOTO_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.1347174.Woblo.png";
const ATELIER_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.modern-living-room-interior-design-scaled.Woblo.jpg";
const LUMEN_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.PHOTO-2020-01-19-18-32-40-2.Woblo.jpg";
const FRAMEWORK_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.1347177.Woblo.png";

const projects = [
  {
    number: "01",
    title: "The Kyoto Residence",
    category: "Residential Study",
    image: KYOTO_IMG,
    alt: "Minimalist living space with expansive negative space and warm timber",
    span: "md:col-span-12",
    height: "h-[614px] md:h-[819px]",
    large: true,
    offset: "",
  },
  {
    number: "02",
    title: "Atelier O",
    category: "Commercial Space",
    image: ATELIER_IMG,
    alt: "Close-up of a kitchen island expressing architectural materiality",
    span: "md:col-span-6",
    height: "h-[512px] md:h-[716px]",
    large: false,
    offset: "",
  },
  {
    number: "03",
    title: "Luminescence",
    category: "Gallery Extension",
    image: LUMEN_IMG,
    alt: "Minimalist architectural hallway in a light neutral palette",
    span: "md:col-span-6",
    height: "h-[512px] md:h-[716px]",
    large: false,
    offset: "md:mt-32",
  },
  {
    number: "04",
    title: "The Framework",
    category: "Corporate Headquarters",
    image: FRAMEWORK_IMG,
    alt: "Open-plan office space designed with architectural rigor",
    span: "md:col-span-12",
    height: "h-[409px] md:h-[614px]",
    large: true,
    offset: "mt-12 md:mt-24",
  },
];

export default function ProjectsPage() {
  useScrollReveal();
  useParallax();

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SiteNav />

      <main className="flex-grow pb-24 pt-32">
        <section className="mx-auto mb-20 max-w-container-max px-margin-mobile md:mb-32 md:px-margin-desktop">
          <div className="max-w-3xl">
            <h1 className="mb-6 font-display-lg text-headline-lg-mobile text-primary md:text-display-lg">
              Selected Works
            </h1>
            <p className="max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
              An exploration of spatial harmony, materiality, and light. Each project represents a
              unique dialogue between the architectural envelope and the human experience within it.
            </p>
          </div>
          <div className="mt-16 h-px w-full bg-primary/10" />
        </section>

        <section className="mx-auto grid max-w-container-max grid-cols-1 gap-gutter gap-y-24 px-margin-mobile md:grid-cols-12 md:px-margin-desktop">
          {projects.map((project) => (
            <article
              key={project.number}
              className={`group col-span-1 cursor-pointer reveal ${project.span} ${project.offset}`}
            >
              <div
                className={`relative mb-6 w-full overflow-hidden border border-primary/10 ${project.height}`}
              >
                <img
                  src={project.image}
                  alt={project.alt}
                  data-parallax="20"
                  className="absolute -top-[25%] left-0 h-[150%] w-full object-cover scale-105"
                />
                <div className="absolute inset-0 bg-primary/0 transition-colors duration-500 group-hover:bg-primary/10" />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <h2
                    className={`text-primary transition-colors duration-300 group-hover:text-secondary ${
                      project.large
                        ? "font-headline-lg text-headline-lg-mobile md:text-headline-lg"
                        : "font-headline-md text-headline-md"
                    }`}
                  >
                    {project.title}
                  </h2>
                  <p className="mt-2 font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant transition-colors duration-300 group-hover:text-secondary/70">
                    {project.category}
                  </p>
                </div>
                <span className="font-body-md text-body-md text-primary/60">{project.number}</span>
              </div>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
