"use client";

import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useParallax, useScrollReveal } from "@/hooks/use-motion";
import { useState } from "react";

// ============================================================================
// PASTE YOUR OWN IMAGE URLS HERE
// You can use local paths (e.g. "/images/hero.jpg") or web links ("https://...")
// ============================================================================
const HERO_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.1347174.Woblo.png";

const KITCHEN_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.modern-living-room-interior-design-scaled.Woblo.jpg";

const STUDIO_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.PHOTO-2020-01-19-18-32-40-2.Woblo.jpg";

const DETAIL_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.2-6-19-Yvonne-Jacobs-01-1600x965-1.Woblo.jpg";

const CTA_BG_IMG =
  "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.1347177.Woblo.png";
// ============================================================================

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

const testimonials = [
  {
    quote:
      "Ace New Interior transformed our residence into a sanctuary of architectural silence. Every detail reflects extraordinary discipline.",
    author: "Private Collector",
    location: "Kyoto Residence",
  },
  {
    quote:
      "The spatial geometry and light trajectories in our studio have completely redefined how our team creates.",
    author: "Founder & Creative Director",
    location: "Atelier O, London",
  },
];

export default function HomePage() {
  useScrollReveal();
  useParallax();

  // ============================================================
  // INQUIRY FORM STATE
  // ============================================================
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        // Auto-hide success after 5 seconds
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to submit inquiry');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav />

      <header className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={HERO_IMG}
            alt="Minimalist living space with a monolithic concrete wall, warm wood flooring and a sculptural lounge chair"
            data-parallax="30"
            className="absolute -top-[25%] left-0 h-[150%] w-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-background/20 mix-blend-overlay" />
        </div>

        <div className="relative z-10 mx-auto mt-20 max-w-container-max px-margin-mobile text-center md:px-margin-desktop">
          <div className="inline-block border-architectural bg-surface/85 px-6 py-12 backdrop-blur-md md:px-10 md:py-16">
            <h1 className="mb-6 font-display-lg text-headline-lg-mobile text-primary md:text-display-lg">
              Defining
              <br />
              Architectural Silence
            </h1>
            <p className="mx-auto mb-8 max-w-lg font-body-lg text-body-lg text-on-surface-variant">
              Spaces curated for clarity, materiality, and enduring presence.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/#inquiry"
                className="inline-block border border-primary/30 bg-surface/60 px-8 py-4 font-label-sm text-label-sm uppercase tracking-widest text-primary transition-all duration-300 hover:border-primary hover:bg-surface"
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 bg-background">
        {/* Expertise Section */}
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

        {/* Selected Works Section */}
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
                  data-parallax="20"
                  className="absolute -top-[25%] left-0 h-[150%] w-full object-cover object-center scale-105"
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
                  data-parallax="20"
                  className="absolute -top-[25%] left-0 h-[150%] w-full object-cover object-center scale-105"
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

        {/* Philosophy Section */}
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
              <p className="mb-8 font-body-md text-body-md text-on-surface-variant">
                Every project is an opportunity to cultivate stillness in an increasingly noisy
                world. We design interiors that serve as tranquil retreats—spaces that demand
                nothing, yet offer profound calm and clarity through their very existence.
              </p>
              <Link
                href="/philosophy"
                className="inline-block border-b border-primary font-label-sm text-label-sm uppercase tracking-widest text-primary pb-1 transition-colors hover:text-secondary hover:border-secondary"
              >
                Read Our Full Manifesto →
              </Link>
            </div>
            <div className="reveal stagger-1 md:col-span-6 md:col-start-7">
              <div className="relative aspect-[3/4] overflow-hidden border-architectural">
                <img
                  src={DETAIL_IMG}
                  alt="Architectural detail of a warm grey concrete wall meeting a vertical slit of glass"
                  data-parallax="35"
                  className="absolute -top-[25%] left-0 h-[150%] w-full object-cover scale-105"
                />
              </div>
            </div>
          </div>
        </section>

        {/* NEW SECTION: Client Testimonials / Accolades */}
        <section className="border-t border-primary/10 bg-background px-margin-mobile py-32 md:px-margin-desktop">
          <div className="mx-auto max-w-container-max">
            <div className="mb-16 border-b border-primary/10 pb-4 reveal">
              <h2 className="font-headline-md text-headline-md text-primary">Client Reflections</h2>
            </div>
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
              {testimonials.map((t, i) => (
                <div
                  key={t.author}
                  className={`border-architectural bg-surface p-10 reveal stagger-${i}`}
                >
                  <p className="mb-8 font-display-lg text-headline-md italic leading-relaxed text-primary">
                    "{t.quote}"
                  </p>
                  <div>
                    <span className="block font-label-sm text-label-sm uppercase tracking-widest text-primary">
                      {t.author}
                    </span>
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      {t.location}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEW SECTION: High-Impact Call To Action (CTA) Banner */}
        <section className="relative overflow-hidden bg-primary px-margin-mobile py-36 text-on-primary md:px-margin-desktop">
          <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
            <img
              src={CTA_BG_IMG}
              alt="Architectural space background"
              data-parallax="25"
              className="absolute -top-[25%] left-0 h-[150%] w-full object-cover scale-105"
            />
          </div>
          <div className="relative z-10 mx-auto max-w-4xl text-center reveal">
            <span className="mb-4 block font-label-sm text-label-sm uppercase tracking-widest text-secondary">
              Commission Inquiry
            </span>
            <h2 className="mb-6 font-display-lg text-headline-lg-mobile text-on-primary md:text-display-lg">
              Ready to Craft Your Sanctuary?
            </h2>
            <p className="mx-auto mb-10 max-w-xl font-body-lg text-body-lg text-on-primary/80">
              We collaborate with discerning private clients and corporate leadership worldwide.
              Initiate a private consultation for your project.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/#inquiry"
                className="inline-block bg-secondary px-10 py-5 font-label-sm text-label-sm uppercase tracking-widest text-on-secondary transition-all duration-300 hover:bg-surface hover:text-primary"
              >
                Schedule Private Consultation
              </Link>
              <Link
                href="/services"
                className="inline-block border border-on-primary/30 px-10 py-5 font-label-sm text-label-sm uppercase tracking-widest text-on-primary transition-all duration-300 hover:bg-on-primary hover:text-primary"
              >
                Explore Practice Scope
              </Link>
            </div>
          </div>
        </section>

        {/* Inquiry Form Section */}
        <section className="border-t border-primary/10 bg-background px-margin-mobile py-32 md:px-margin-desktop" id="inquiry">
          <div className="mx-auto grid max-w-container-max grid-cols-1 gap-gutter md:grid-cols-2">
            <div>
              <h2 className="mb-6 font-display-lg text-headline-lg-mobile text-primary md:text-display-lg">
                Begin a
                <br />
                Conversation.
              </h2>
              <p className="mb-12 max-w-sm font-body-md text-body-md text-on-surface-variant">
                We accept a limited number of commissions each year to ensure uncompromising quality.
              </p>
            </div>

            <div className="border-architectural bg-surface p-8">
              <form className="space-y-8" onSubmit={handleInquirySubmit}>
                <div>
                  <label htmlFor="name" className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-primary">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border-0 border-b border-primary/20 bg-transparent px-0 py-2 font-body-md text-primary transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-primary">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border-0 border-b border-primary/20 bg-transparent px-0 py-2 font-body-md text-primary transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-primary">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border-0 border-b border-primary/20 bg-transparent px-0 py-2 font-body-md text-primary transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-primary"
                  />
                </div>
                <div>
                  <label htmlFor="project" className="mb-2 block font-label-sm text-label-sm uppercase tracking-widest text-primary">
                    Project Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="project"
                    rows={3}
                    placeholder="Briefly describe your vision..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full resize-none border-0 border-b border-primary/20 bg-transparent px-0 py-2 font-body-md text-primary transition-colors outline-none placeholder:text-on-surface-variant/50 focus:border-primary"
                    required
                  />
                </div>

                {/* Status Messages */}
                {status === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-sm">
                    ✅ Thank you! We'll get back to you shortly.
                  </div>
                )}
                {status === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm">
                    ❌ {errorMessage || 'Something went wrong. Please try again.'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-8 w-full bg-primary py-4 font-label-sm text-label-sm uppercase tracking-widest text-on-primary transition-colors duration-300 hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Submit Inquiry'}
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