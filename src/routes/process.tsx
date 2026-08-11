import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useParallax, useScrollReveal } from "@/hooks/use-motion";

const SKETCH_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAc36prTbiwu2UafT2Q7neXzVtK1S442IZNO9DuRS_0yGdocU9t_UrFZGCQlfzQUwgtv65GMl6Z4KgdD4xN6i5-0tjbhardGZQ3skS9ZqaRkGa6VtjcQn9cKNEl1lov6NrscqKOue2AZJUL0_qv-4w-m5PA4PsUy_By8-vx3G7r0wMRSn6BTQSoRHJTwH49xnoGWVXI9i1GHTZ5Q1BTec0KTBEVtjgxfq634l_89jmTQhtGccoPIlMtHQ";
const MOODBOARD_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD6uWuSYEz-tNtbw9KAKDhpAeDLBleHca1pVuHABs78PZkxp5aQdTi_ghJ2T9lM3dJ3kEbr0FJbnjTeSWfPSxy7sDwzYgtndQ08IV8JWtx3lRgOhHABgIrextyNhcP-YZ1DK_7cWEzOgethduhiZQU-26Ge7i5mhN7b85C9erxyjyUXGlQRawUYB63OCDE9S7NmSbiqycGnhDtScULiWEBc7x_D6SuUJ3i8Ogu2OZKGv3w5yMDWTBdC5w";
const RENDER_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDGv76ZJDXWpLRXrqDiskW5DMf8HzgnJTsiD25p9ir7wRX84jrs8LMGMONXDwbedzqOR-XCf-axX5GWW178hft9ggHougeA6skmVrIYVAAYmd0XXDta1sV27a9L8M0UP5-nDSUn_fLAHe6S4HtLh0WfqgDckQF9INHcfIKaU10PO21xqRB6Cm0b53UFRGYxYCr1Rr6tRZ5HVFoGo0g6z8dOGeJxeu2ZaleBDlm1yiMJHIPafNaV93pJCw";
const FINAL_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCS0C4qxfcIUSjDcju0I8Ac5gAjC7P-Dv3rfXhqyjKTYIWOQSlpbrv76KQxaApIQNYrPJdwMj5a9B08Jf00wpGxFddsow3NPgb5QaHqFHnTnWB7FdEx2CKt6XeOFlj-2ibddUW4Wgwx3ldecKSYG_3g8Jp5cZC1de1zJph_1PhhotZAQvN1mX1sCla_Q9FI0S5AgoDpZib52hjZwWgmlsuFbY4NZ3UPXYXIUH1yDuiGMXep8mFbOMqU7Q";

const TITLE = "Our Process | Ace New Interior";
const DESCRIPTION =
  "From inception to realization — the four-phase architectural methodology behind every Ace New Interior commission.";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:image", content: FINAL_IMG },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: FINAL_IMG },
    ],
  }),
  component: ProcessPage,
});

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

function ProcessPage() {
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
                className={
                  imageFirst ? "order-1 md:order-2 md:pl-12" : "md:pr-12 md:text-right"
                }
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
                  data-parallax="12"
                  className={`absolute -top-[10%] left-0 h-[120%] w-full object-cover ${step.imageClass}`}
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
