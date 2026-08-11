"use client";

import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useParallax, useScrollReveal } from "@/hooks/use-motion";

const SKETCH_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.PHOTO-2020-01-19-18-32-40-2.Woblo.jpg";
const MOODBOARD_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.2-6-19-Yvonne-Jacobs-01-1600x965-1.Woblo.jpg";
const RENDER_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.modern-living-room-interior-design-scaled.Woblo.jpg";
const FINAL_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.1347174.Woblo.png";

const steps = [
  {
    number: "01",
    title: "Inception & Brief",
    body: "The foundation of every project begins with a deep understanding of the client's vision and the architectural context. We analyze space, light, and function to establish a comprehensive brief.",
    image: SKETCH_IMG,
    alt: "Blueprint-style sketch of a modern interior drawn with precise thin black lines",
    imageClass: "mix-blend-multiply opacity-80",
    inset: "m-4",
    height: "h-[400px]",
  },
  {
    number: "02",
    title: "Conceptualization",
    body: "Translating the brief into a tangible aesthetic. We curate a palette of materials, textures, and structural forms, presenting a cohesive design language through mood boards and preliminary sketches.",
    image: MOODBOARD_IMG,
    alt: "Material mood board with raw concrete, brushed bronze, bone-white linen and charcoal wood",
    imageClass: "",
    inset: "",
    height: "h-[400px]",
  },
  {
    number: "03",
    title: "Design Development",
    body: "Concepts are refined into precise architectural drawings. Every millwork detail, lighting fixture, and spatial transition is specified, resulting in a comprehensive technical package.",
    image: RENDER_IMG,
    alt: "3D render of a minimalist living space under construction with structural shadows",
    imageClass: "",
    inset: "",
    height: "h-[400px]",
  },
  {
    number: "04",
    title: "Realization",
    body: "The culmination of rigorous planning. We oversee the construction and installation phases, ensuring absolute fidelity to the design intent. The result is a space of enduring elegance and precision.",
    image: FINAL_IMG,
    alt: "Completed high-end interior with bone-white walls, charcoal accents and bronze details",
    imageClass: "",
    inset: "m-6",
    height: "h-[500px]",
  },
];

export default function ProcessPage() {
  useScrollReveal();
  useParallax();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />

      <header className="mx-auto max-w-container-max px-margin-mobile pb-20 pt-40 reveal md:px-margin-desktop">
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
          <div className="text-center md:col-span-8 md:col-start-3">
            <span className="mb-4 block font-label-sm text-label-sm uppercase tracking-[0.2em] text-secondary">
              Methodology
            </span>
            <h1 className="mb-6 font-display-lg text-headline-lg-mobile text-primary md:text-display-lg">
              From Inception
              <br />
              To Realization.
            </h1>
            <p className="mx-auto max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
              A rigorous, architectural approach to interior design. Every phase is meticulously
              planned and executed, ensuring the final space reflects structural integrity and quiet
              luxury.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-container-max px-margin-mobile pb-32 md:px-margin-desktop">
        <div className="relative">
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-primary/10 md:block" />

          {steps.map((step, index) => {
            const imageFirst = index % 2 === 1;
            const text = (
              <div
                className={imageFirst ? "order-1 md:order-2 md:pl-12" : "md:pr-12 md:text-right"}
              >
                <span
                  className={`mb-2 block font-headline-lg text-headline-lg ${
                    index === steps.length - 1 ? "text-secondary" : "text-surface-dim"
                  }`}
                >
                  {step.number}
                </span>
                <h2 className="mb-4 font-headline-md text-headline-md text-primary">
                  {step.title}
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">{step.body}</p>
              </div>
            );

            const media = (
              <div
                className={`relative ${step.height} overflow-hidden border border-primary/10 bg-surface-container-lowest ${
                  imageFirst ? "order-2 md:order-1" : ""
                }`}
              >
                <img
                  src={step.image}
                  alt={step.alt}
                  data-parallax="20"
                  className={`absolute -top-[25%] left-0 h-[150%] w-full object-cover scale-105 ${step.imageClass}`}
                />
                {step.inset ? (
                  <div
                    className={`pointer-events-none absolute inset-0 border border-primary/20 ${step.inset}`}
                  />
                ) : null}
              </div>
            );

            return (
              <section key={step.number} className="relative py-20 reveal">
                <div className="grid grid-cols-1 items-center gap-gutter md:grid-cols-2">
                  {imageFirst ? (
                    <>
                      {media}
                      {text}
                    </>
                  ) : (
                    <>
                      {text}
                      {media}
                    </>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
