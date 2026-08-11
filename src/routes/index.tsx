import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useParallax, useScrollReveal } from "@/hooks/use-motion";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAJaNH1lwJYjIV8fEK7ww3MDS4IYhTHAW-zetMxW9l3oWVTMQPtBy6pgB4RDAuLpLCHNxScU2hcKkjb5CD_Eh4gS8FWHK6jg3PKPItBr0OyVCYyS2HIkE0MW_--AVYeJ1waUQhjUomBAd1LQoSliMzCyexpvXJG9YloSI0yRNdbnZV3aQ_2aByCj3v4uFkwoKon7MkPLjVZ46tcoRl6Na0e5ZhZ480gf0a3YjurW5rfiLr9iZJ033N4Zw";
const KITCHEN_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB0AK-DhMzxWvdEJyr_UFTYzZy5ALWIOXNT4_6cp7_2lMT8fc9peHKTnsA8kCIETZryc017s5ojvcwFKZN6wDlZby70ewVLvxEE1Pr2Ibaw9FhUEDj7yKeHGH3D3sg_JoNzN6zvW8Oks68KsGnV2WVRdmex9f_YoA07pX-o-71qMYQXyD2wCS1vQIoa854lPzHtMkWgGNMCOF1xGUHSclZiVI7kK-9Sp9JRDI7J-ej0TUQdDMDPmxFiJg";
const STUDIO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAHkiqEmKoUcTtV5DOHZQioWxiDy3DGYS3Gmw46QJLXquMzvWPMxGaygkmSPutO7_lzRMZT_Q0PDF7Nlq-NxpCUs8rtuBmeFXy19xITwT3Zvro_D5etv85egJkx4TArirIEfAahe7ZVWW289r5gU7xDJvlwaaF5lwHlAx-E6-2Yz4tv2Ptx5asydhuL2LmH5vko44YB2AXXs9qZmjNZdSkkfbt7cxmPHTOfL7mrR3c2jH2jzeBIkszgCQ";
const DETAIL_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDThGA_FS9RsDZgrsQUQ878BvwvTRS9PLRe9rp6dbYkqgCDtTPxxM-uencrI5y11iqCqN84cSD5MNINItFm-OOny6k_d9m_bquWm_9oNANejpAqwkSm6WEzjuHv0HA88GHJcjf-jal-eUvJ-OMRgXNTrFixgD3GJ9m5TpfydH4EPnUHD04IzArstJeczZ0Zyo1UW5E1PEDYqhTf9K7yOKYDMzAZKveQVEusg5F6Wptkb3MBFTBqf8A3Iw";

const TITLE = "Ace New Interior — Architectural Interior Design Studio";
const DESCRIPTION =
  "Ace New Interior curates residential and commercial spaces defined by clarity, materiality and enduring architectural presence.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:image", content: HERO_IMG },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: HERO_IMG },
    ],
  }),
  component: Index,
});

const expertise = [
  {
    title: "Spatial Curation",
    body: "We orchestrate volume and void, ensuring every dimension serves a purposeful narrative of movement and stillness.",
  },
  {
    title: "Material Narrative",
    body: "Selecting elements not just for aesthetic appeal, but for their tactile truth and how they age with grace over time.",
  },
  {
    title: "Structural Harmony",
    body: "Aligning aesthetic vision with engineering precision to create environments that feel inherently grounded and secure.",
  },
];

function Index() {
  useScrollReveal();
  useParallax();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />

      <header className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={HERO_IMG}
            alt="Minimalist living space with a monolithic concrete wall, warm wood flooring and a sculptural lounge chair"
            data-parallax="10"
            className="absolute -top-[10%] left-0 h-[120%] w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/20 mix-blend-overlay" />
        </div>

        <div className="relative z-10 mx-auto mt-20 max-w-container-max px-margin-mobile text-center md:px-margin-desktop">
          <div className="inline-block border-architectural bg-surface/80 px-6 py-12 backdrop-blur-md md:px-10 md:py-16">
            <h1 className="mb-6 font-display-lg text-headline-lg-mobile text-primary md:text-display-lg">
              Defining
              <br />
              Architectural Silence
            </h1>
            <p className="mx-auto max-w-lg font-body-lg text-body-lg text-on-surface-variant">
              Spaces curated for clarity, materiality, and enduring presence.
            </p>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-surface px-margin-mobile py-32 md:px-margin-desktop">
          <div className="mx-auto max-w-container-max">
            <div className="mb-16 border-b border-primary/10 pb-4 reveal">
              <h2 className="font-headline-md text-headline-md text-primary">Our Expertise</h2>
            </div>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
              {expertise.map((item, i) => (
                <div
                  key={item.title}
                  className={`border-architectural p-8 transition-colors duration-300 hover:bg-surface-container-low reveal stagger-${i}`}
                >
                  <div className="mb-8 h-px w-12 bg-secondary" />
                  <h3 className="mb-4 font-headline-md text-headline-md text-primary">
                    {item.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-background py-32" id="projects">
          <div className="mx-auto mb-16 max-w-container-max border-b border-primary/10 px-margin-mobile pb-4 md:px-margin-desktop">
            <h2 className="font-headline-md text-headline-md text-primary">Selected Works</h2>
          </div>

          <div className="flex flex-col gap-32">
            <div className="relative mx-auto flex h-[560px] w-full max-w-container-max items-end px-margin-mobile pb-12 md:h-[819px] md:px-margin-desktop">
              <div className="absolute inset-0 overflow-hidden border-architectural md:inset-x-margin-desktop">
                <img
                  src={KITCHEN_IMG}
                  alt="Minimalist kitchen with a monolithic marble island and matte black cabinetry"
                  data-parallax="15"
                  className="absolute -top-[10%] left-0 h-[120%] w-full object-cover object-center"
                />
              </div>
              <div className="relative z-10 max-w-md border-architectural bg-surface/90 p-8 backdrop-blur-sm">
                <span className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                  Residence 01
                </span>
                <h3 className="font-headline-md text-headline-md text-primary">
                  The Monolith Kitchen
                </h3>
              </div>
            </div>

            <div className="relative mx-auto flex h-[560px] w-full max-w-container-max items-start px-margin-mobile pt-12 md:h-[716px] md:pl-[20%] md:pr-margin-desktop">
              <div className="absolute inset-0 overflow-hidden border-architectural md:left-[20%] md:right-margin-desktop">
                <img
                  src={STUDIO_IMG}
                  alt="Studio space with raw concrete pillars, gallery walls and a sculptural bronze desk"
                  data-parallax="15"
                  className="absolute -top-[10%] left-0 h-[120%] w-full object-cover object-center"
                />
              </div>
              <div className="relative z-10 ml-auto mt-20 max-w-md border-architectural bg-surface/90 p-8 backdrop-blur-sm md:ml-0 md:-translate-x-1/2">
                <span className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                  Studio Space
                </span>
                <h3 className="font-headline-md text-headline-md text-primary">Raw Volume</h3>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface px-margin-mobile py-32 md:px-margin-desktop" id="philosophy">
          <div className="mx-auto grid max-w-container-max grid-cols-1 items-center gap-gutter md:grid-cols-12">
            <div className="mb-16 reveal md:col-span-5 md:mb-0">
              <div className="mb-8 border-b border-primary/10 pb-4">
                <h2 className="font-headline-md text-headline-md text-primary">The Philosophy</h2>
              </div>
              <p className="mb-6 font-body-md text-body-md text-on-surface-variant">
                We believe that true luxury lies in restraint. By stripping away the superfluous, we
                reveal the essential character of a space. Our practice is rooted in the rigorous
                application of geometric principles and an uncompromising dedication to material
                integrity.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Every project is an opportunity to cultivate stillness in an increasingly noisy
                world. We design interiors that serve as tranquil retreats—spaces that demand
                nothing, yet offer profound calm and clarity through their very existence.
              </p>
            </div>
            <div className="reveal stagger-1 md:col-span-6 md:col-start-7">
              <div className="relative aspect-[3/4] overflow-hidden border-architectural">
                <img
                  src={DETAIL_IMG}
                  alt="Architectural detail of a warm grey concrete wall meeting a vertical slit of glass"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          className="border-t border-primary/10 bg-background px-margin-mobile py-32 md:px-margin-desktop"
          id="inquiry"
        >
          <div className="mx-auto grid max-w-container-max grid-cols-1 gap-gutter md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-display-lg text-headline-lg-mobile text-primary md:text-display-lg">
                Begin a
                <br />
                Conversation.
              </h2>
              <p className="mb-12 max-w-sm font-body-md text-body-md text-on-surface-variant">
                We accept a limited number of commissions each year to ensure uncompromising
                quality.
              </p>
            </div>

            <div className="border-architectural bg-surface p-8">
              <form className="space-y-8" onSubmit={(event) => event.preventDefault()}>
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-primary"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full border-0 border-b border-primary/20 bg-transparent px-0 py-2 font-body-md text-primary transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-primary"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full border-0 border-b border-primary/20 bg-transparent px-0 py-2 font-body-md text-primary transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="project"
                    className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-primary"
                  >
                    Project Details
                  </label>
                  <textarea
                    id="project"
                    rows={3}
                    placeholder="Briefly describe your vision..."
                    className="w-full resize-none border-0 border-b border-primary/20 bg-transparent px-0 py-2 font-body-md text-primary transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="mt-8 w-full bg-primary py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-primary transition-colors duration-300 hover:bg-secondary"
                >
                  Submit Inquiry
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
