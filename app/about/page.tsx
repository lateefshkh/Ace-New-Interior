"use client";

import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useParallax, useScrollReveal } from "@/hooks/use-motion";

// ============================================================================
// PASTE YOUR OWN IMAGE URLS HERE
// You can use local paths (e.g. "/images/hero.jpg") or web links ("https://...")
// ============================================================================
const ABOUT_HERO_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.1347177.Woblo.png";

const ARCHITECT_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.PHOTO-2020-01-19-18-32-40-2.Woblo.jpg";
// ============================================================================

const values = [
  {
    number: "01",
    title: "Restraint & Reduction",
    description:
      "We remove noise until only purpose and beauty remain. True architecture does not shout; it holds space for clarity.",
  },
  {
    number: "02",
    title: "Tactile Truth",
    description:
      "Every stone, timber plane, and bronze detail is chosen for its structural honesty and how it acquires character over decades.",
  },
  {
    number: "03",
    title: "Light & Atmosphere",
    description:
      "Sunlight and shadow dictate spatial rhythm. We design volumes around natural illumination to shape serenity.",
  },
];

const press = [
  { outlet: "Architectural Digest", title: "The New Wave of Quiet Luxury Interiors" },
  { outlet: "Wallpaper* Magazine", title: "Minimalist Residences Redefining Spatial Silence" },
  { outlet: "Elle Decor", title: "Monolithic Geometry & Material Integrity in Modern Homes" },
];

export default function AboutPage() {
  useScrollReveal();
  useParallax();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />

      <header className="relative flex h-[70vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={ABOUT_HERO_IMG}
            alt="Ace New Interior studio workspace"
            data-parallax="25"
            className="absolute -top-[25%] left-0 h-[150%] w-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-background/30 mix-blend-overlay" />
        </div>

        <div className="relative z-10 mx-auto mt-20 max-w-container-max px-margin-mobile text-center md:px-margin-desktop">
          <div className="inline-block border-architectural bg-surface/85 px-8 py-12 backdrop-blur-md md:px-14 md:py-16">
            <span className="mb-3 block font-label-sm text-label-sm uppercase tracking-widest text-secondary">
              The Studio
            </span>
            <h1 className="mb-4 font-display-lg text-headline-lg-mobile text-primary md:text-display-lg">
              Curating Spatial Silence
            </h1>
            <p className="mx-auto max-w-lg font-body-lg text-body-lg text-on-surface-variant">
              An architectural practice dedicated to residential and commercial environments of
              enduring presence.
            </p>
          </div>
        </div>
      </header>

      <main className="relative z-10 bg-surface">
        {/* Story Section */}
        <section className="px-margin-mobile py-32 md:px-margin-desktop">
          <div className="mx-auto grid max-w-container-max grid-cols-1 items-center gap-gutter md:grid-cols-12">
            <div className="reveal md:col-span-6">
              <span className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                Our Vision
              </span>
              <h2 className="mb-8 font-display-lg text-headline-lg-mobile text-primary md:text-headline-lg">
                Crafting Spaces That Stand Outside of Time.
              </h2>
              <p className="mb-6 font-body-lg text-body-lg text-on-surface-variant">
                Founded on the belief that interior environments profoundly influence human
                experience, Ace New Interior designs spaces stripped of artificial ornamentation.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Our team collaborates with master artisans, structural engineers, and landscape
                architects across Kyoto, London, and New York to deliver commissions that age with
                timeless distinction.
              </p>
            </div>

            <div className="reveal stagger-1 md:col-span-5 md:col-start-8">
              <div className="relative aspect-[3/4] overflow-hidden border-architectural">
                <img
                  src={ARCHITECT_IMG}
                  alt="Principal Architect portrait"
                  data-parallax="20"
                  className="absolute -top-[25%] left-0 h-[150%] w-full object-cover scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="border-t border-primary/10 bg-background px-margin-mobile py-32 md:px-margin-desktop">
          <div className="mx-auto max-w-container-max">
            <div className="mb-16 border-b border-primary/10 pb-4 reveal">
              <h2 className="font-headline-md text-headline-md text-primary">Core Principles</h2>
            </div>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
              {values.map((v, i) => (
                <div
                  key={v.title}
                  className={`border-architectural bg-surface p-8 reveal stagger-${i}`}
                >
                  <span className="mb-4 block font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                    {v.number}
                  </span>
                  <h3 className="mb-4 font-headline-md text-headline-md text-primary">{v.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    {v.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Press Section */}
        <section className="bg-surface px-margin-mobile py-32 md:px-margin-desktop">
          <div className="mx-auto max-w-container-max">
            <div className="mb-16 border-b border-primary/10 pb-4 reveal">
              <h2 className="font-headline-md text-headline-md text-primary">
                Recognition & Press
              </h2>
            </div>
            <div className="space-y-6">
              {press.map((item, i) => (
                <div
                  key={item.title}
                  className={`flex flex-col justify-between border-b border-primary/10 pb-6 reveal stagger-${i} md:flex-row md:items-center`}
                >
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                    {item.outlet}
                  </span>
                  <p className="mt-2 font-headline-md text-headline-md text-primary md:mt-0">
                    "{item.title}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call To Action Banner */}
        <section className="border-t border-primary/10 bg-primary px-margin-mobile py-28 text-on-primary md:px-margin-desktop">
          <div className="mx-auto max-w-container-max text-center">
            <h2 className="mb-6 font-display-lg text-headline-lg-mobile text-on-primary md:text-display-lg">
              Transform Your Environment
            </h2>
            <p className="mx-auto mb-10 max-w-xl font-body-lg text-body-lg text-on-primary/80">
              We accept a limited number of residential and commercial commissions each year.
            </p>
            <Link
              href="/#inquiry"
              className="inline-block bg-secondary px-10 py-5 font-label-sm text-label-sm uppercase tracking-widest text-on-secondary transition-all duration-300 hover:bg-surface hover:text-primary"
            >
              Schedule a Consultation
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
