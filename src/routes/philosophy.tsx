import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useParallax, useScrollReveal } from "@/hooks/use-motion";

const HERO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuARSpk5pdbPaCWs-IMC7YUerkCDZ7U3Wnr4YRzSQEWBsQg_jb5hdMqdBo-Vahc3AxAgWe4vndtdfHNMaCc1iU1JsS3xxMsOrs4JiEgs6-8uYiI16tygOH_ffpLfdZdpc3-oZjdCzX0lhYRO_HQwTDKub3YC89B0UX0CoHsxDr4q_t5Gqsf0po6i2hvQWJyGLlFjWvwS1a4Cx0O9jhLH3BNxLwXJIEy0tnxb6NoRvIP6nLWAHW5frkAGAA";
const MATERIAL_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDsqqpRkThlP01H-8OYrdcAgpjIeTB9WPh6IIiRDCUPjl1UYZ1AQwu5j7AeT7gPGor_b_HF9g2iSnpVQdXf9oFQWHIVkHh6BxYRP7_uehgQ21KuHvUWSXpIhslvXoQnbWkTuI20TfErjSs2seuT2iNksvKAMjyAU1k38BN29zAwzdkM_rtyOaBe0pYJ0s0vv5y9mjWe5oTn42T_JXhtszhU_UtXpLrI09LsjznCCWIMDYMF-y1945QzYA";

const TITLE = "Philosophy | Ace New Interior";
const DESCRIPTION =
  "Architectural silence: how Ace New Interior uses raw materiality and light as structure to design interiors of quiet, enduring luxury.";

export const Route = createFileRoute("/philosophy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:image", content: HERO_IMG },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: HERO_IMG },
    ],
  }),
  component: PhilosophyPage,
});

const chapters = [
  {
    number: "01",
    heading: "Materiality",
    lead: "True luxury is not loud. It is found in the tactile truth of raw materials allowed to speak for themselves.",
    body: [
      "We believe that an interior should be felt before it is seen. The rough texture of unpolished stone against the smooth plane of warm timber. The cold precision of blackened steel contrasting with the soft weave of natural linen. In our pursuit of architectural silence, materiality is our primary language.",
      "We strip away layers of artifice to reveal the inherent beauty of the structural elements. This reduction requires immense discipline; when there is nowhere to hide flaws, every joint, every intersection, and every surface must be executed with absolute perfection.",
    ],
  },
  {
    number: "02",
    heading: "Light as Structure",
    lead: "Light is the unseen material. It defines the volume, measures time, and breathes life into static forms.",
    body: [
      "Shadow is just as crucial as illumination. We sculpt spaces around the trajectory of the sun, orchestrating how light washes across walls, penetrates deep into a room, or fractures through carefully positioned architectural fins.",
      "Artificial lighting is treated with equal reverence. It is never merely decorative; it is structural. Hidden linear channels graze textured walls, while discrete focal points highlight specific functional zones. The goal is an atmosphere that feels entirely natural, even at midnight.",
    ],
  },
];

function PhilosophyPage() {
  useScrollReveal();
  useParallax();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />

      <main className="pb-32 pt-32">
        <section className="relative mb-32 flex h-[560px] w-full items-center justify-center overflow-hidden md:h-[819px]">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <div
              role="img"
              aria-label="Minimalist interior with bone-white plastered walls, seamless concrete floor and a low charcoal stone bench"
              className="ken-burns-bg h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url('${HERO_IMG}')` }}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 bg-surface/30 mix-blend-multiply" />
          <div className="relative z-20 px-margin-mobile text-center md:px-margin-desktop">
            <h1 className="mb-6 font-display-lg text-headline-lg-mobile tracking-tight text-primary reveal md:text-display-lg">
              Architectural Silence
            </h1>
            <p className="mx-auto max-w-2xl font-body-lg text-body-lg text-primary/80 reveal stagger-1">
              The space between the lines. The profound resonance of intentional absence.
            </p>
          </div>
        </section>

        <section className="mx-auto mb-32 max-w-4xl px-margin-mobile md:px-margin-desktop">
          <Chapter chapter={chapters[0]!} />
        </section>

        <section className="mx-auto mb-32 max-w-container-max px-margin-mobile reveal md:px-margin-desktop">
          <div className="relative h-[420px] w-full overflow-hidden border border-primary/10 md:h-[614px]">
            <img
              src={MATERIAL_IMG}
              alt="Macro shot of rough travertine stone meeting a matte bronze column"
              data-parallax="12"
              className="absolute inset-0 h-[120%] w-full object-cover"
            />
          </div>
        </section>

        <section className="mx-auto mb-32 max-w-4xl px-margin-mobile md:px-margin-desktop">
          <Chapter chapter={chapters[1]!} />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

function Chapter({ chapter }: { chapter: (typeof chapters)[number] }) {
  return (
    <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
      <div className="col-span-1 border-t border-primary/20 pt-4 reveal md:col-span-4">
        <span className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-primary/60">
          {chapter.number}
        </span>
        <h2 className="font-headline-md text-headline-md text-primary">{chapter.heading}</h2>
      </div>
      <div className="col-span-1 border-t border-primary/20 pt-4 md:col-span-8 md:pl-8">
        <p className="mb-8 font-headline-md text-headline-md leading-snug text-primary reveal">
          {chapter.lead}
        </p>
        {chapter.body.map((paragraph, i) => (
          <p
            key={i}
            className={`font-body-lg text-body-lg text-on-surface-variant reveal stagger-${i + 1} ${
              i === 0 ? "mb-6" : ""
            }`}
          >
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
