import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useParallax, useScrollReveal } from "@/hooks/use-motion";

const KYOTO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB7zoNGxCIYk4AR8aJdXmeqFU96uQCw5CuE9A-Zkv-TKCaUx7cDenZ72A4_GhLTR7a8iZL1glKiWzvXuT8q0_suEs5vTKD-xacoxMac3Y4nvHjd6Sf5hpmAKl8GP_4CLi1lCiOcScZqB4sLnrGXJd6jjVN2qtbjr_hshpx_a7bU33RBSR9swHqL9JXS_4akw5gPpRZ0BhMNIE5PQl2gT3xvxBsWiE_wQdeyaJT9MNT_lDI_jrWPlTfTzQ";
const ATELIER_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDoNRSLcARJ9o-NiY5_0briaY_JWxUFpV-ERGaKmWEwRn2EYhX3y7kaspLoHt4txpkwfGnjBiH0eCO0UVEd-RFeF6egdYazKnxiyo-01RPgv0SbHaPqfqNkmIsXSp7nu-YjudcjFXDo4uYGINNqInx_IO1oEQbPAATn3kjHJhmUHh2o3FABS6lkNHtNfQGQiH2__bfEFcJIdjTAeCZ50hGPpt3EAkIfIKreiCqAwDyuEH4qDK_NUfu7Dg";
const LUMEN_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC0h5EA2H7nUcaYW1lXW2gbYCkFGYvy6COHiItOTBHra0cJMPtQqzrcsPW9JIjRv_mBQtrY8YTGAOu6mDGShH0fFhmg6t3uErDk_gkijNHEr91cFn12E9m3KidDeINftJPau0ge0_3SCo4zpgUhoUe66i4lk9ljpb3_rOhWLAZ3_oKqUWggX0EGbxWDDiW--QxsOya_zHzunsBHCE_wDjobdoxC55aHHJ0N6N78ASwgJA_nCm6o-svVYQ";
const FRAMEWORK_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC3NanV5XrTvFeFtqDM9IseR9v5RPdfYhLJN8MEVI-Fuea7-NWs9Hnh99wr9NRH_4xjTojlBDF8Cc7Q1X44WldEmQpsh93aDOQbHuqqzM-yX794L_Q04FNMtdQiRch1bQgPVceERRnpdiq2-p9QEgd5nhasLXxp3VP0QbiIVvrQ49tKyaEnSwVVApni3W3T1tU3kicghA9s5D99uxBXOeDz98hA5ZqJdC4Bljc4yRABw_i0iPcJIELWRw";

const TITLE = "Selected Works | Ace New Interior";
const DESCRIPTION =
  "A portfolio of residential, commercial and cultural interiors exploring spatial harmony, materiality and light.";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:image", content: KYOTO_IMG },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: KYOTO_IMG },
    ],
  }),
  component: ProjectsPage,
});

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

function ProjectsPage() {
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
                  data-parallax="14"
                  className="absolute inset-0 h-[120%] w-full object-cover"
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
