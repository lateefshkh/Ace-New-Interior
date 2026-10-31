"use client";

import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { useParallax, useScrollReveal } from "@/hooks/use-motion";
import { useState } from "react";
import { IMAGES } from "@/lib/constants/images";

const HERO_IMG = IMAGES.hero;
const KITCHEN_IMG = IMAGES.livingRoom;
const STUDIO_IMG = IMAGES.studio;
const DETAIL_IMG = IMAGES.detail;
const CTA_BG_IMG = IMAGES.heroAlt;

const services = [
  {
    title: "Full-Home Residential Interiors",
    tag: "Turnkey Execution",
    body: "Complete spatial transformation for 2BHK, 3BHK, and luxury villas. We handle everything from 3D layouts and ceiling design to custom lighting and furniture.",
    icon: "🏠",
  },
  {
    title: "Modular Kitchens & Custom Millwork",
    tag: "Italian & German Fittings",
    body: "Ergonomic, marine-grade plywood kitchens with soft-close mechanisms, quartz countertops, and concealed storage designed for modern culinary living.",
    icon: "🍳",
  },
  {
    title: "Architectural Renovation & Civil",
    tag: "Structural & Finishes",
    body: "Revitalizing existing structures with wall removals, Italian marble flooring, electrical revamps, and weatherproof exterior finishes.",
    icon: "📐",
  },
  {
    title: "Commercial & Retail Environments",
    tag: "Offices, Cafés & Stores",
    body: "Brand-focused interior designs that optimize customer flow, employee productivity, and spatial acoustics while maintaining a distinct visual identity.",
    icon: "🏢",
  },
];

const selectedProjects = [
  {
    id: "residence-01",
    title: "The Kadri Monolith Villa",
    category: "Residential Villa",
    location: "Kadri, Mangalore",
    area: "4,200 sq.ft.",
    year: "2024",
    image: KITCHEN_IMG,
    description: "Custom teakwood millwork, hidden ambient LED channels, and open-plan kitchen flow.",
  },
  {
    id: "studio-space",
    title: "Coastal Heritage Studio",
    category: "Commercial Office",
    location: "Udupi",
    area: "2,800 sq.ft.",
    year: "2023",
    image: STUDIO_IMG,
    description: "Exposed concrete columns, custom bronze workstations, and acoustically insulated meeting rooms.",
  },
  {
    id: "penthouse-detail",
    title: "Panambur Oceanfront Penthouse",
    category: "Luxury Penthouse",
    location: "Mangalore",
    area: "3,500 sq.ft.",
    year: "2024",
    image: DETAIL_IMG,
    description: "Floor-to-ceiling glass paneling, floor heating, and imported Italian travertine accents.",
  },
];

const stats = [
  { value: "150+", label: "Completed Projects" },
  { value: "12+", label: "Years of Experience" },
  { value: "100%", label: "Turnkey On-Time Delivery" },
  { value: "4.9★", label: "Client Satisfaction Rating" },
];

const testimonials = [
  {
    quote:
      "Ace New Interior delivered our 3BHK villa in Kadri 2 weeks ahead of schedule. The quality of their modular kitchen hardware and living room wood panelling is exceptional.",
    author: "Rajesh & Priya Hegde",
    location: "Kadri, Mangalore",
    type: "3BHK Villa Interior",
  },
  {
    quote:
      "They took complete ownership of our boutique café in Udupi—from civil alterations to custom lighting. Professional team, transparent pricing, and zero delays.",
    author: "Ananya Shetty",
    location: "Udupi",
    type: "Commercial Retail",
  },
  {
    quote:
      "The 3D renders matched the final handover down to the exact lighting temperature and fabric textures. Best interior team in Coastal Karnataka.",
    author: "Dr. Vikram K. Rao",
    location: "Bejai, Mangalore",
    type: "Luxury Apartment",
  },
];

export default function HomePage() {
  useScrollReveal();
  useParallax();

  const [activeCategory, setActiveCategory] = useState("All");

  // ============================================================
  // INQUIRY FORM STATE
  // ============================================================
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceType: 'Full-Home Residential',
    budget: '15L - 30L',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const filteredProjects =
    activeCategory === "All"
      ? selectedProjects
      : selectedProjects.filter((p) => p.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          message: `[Service: ${formData.serviceType} | Budget: ${formData.budget}] ${formData.message}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          serviceType: 'Full-Home Residential',
          budget: '15L - 30L',
          message: '',
        });
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
    <div className="flex min-h-screen flex-col bg-background font-body text-primary">
      <SiteNav />

      {/* Hero Section - Clean Hovering Card & Untinted Image */}
      <header className="relative flex min-h-[75vh] items-center justify-center overflow-hidden py-16">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={HERO_IMG}
            alt="Modern interior architectural living room"
            data-parallax="30"
            className="absolute -top-[20%] left-0 h-[140%] w-full object-cover scale-105"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-container-max px-margin-mobile text-center md:px-margin-desktop">
          <div className="group mx-auto max-w-xl border border-primary/20 bg-surface/90 p-8 shadow-xl backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:bg-surface/95 hover:shadow-2xl md:p-10">
            <span className="mb-3 block font-label-sm text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
              Ace New Interior
            </span>
            <h1 className="mb-4 font-display text-3xl font-normal leading-tight text-primary md:text-5xl">
              Bespoke Interior Architecture
            </h1>
            <p className="mx-auto mb-6 max-w-md font-body text-sm text-on-surface-variant md:text-base">
              Turnkey residential & commercial spatial design.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#inquiry"
                className="bg-primary px-7 py-3.5 font-label-sm text-xs uppercase tracking-widest text-on-primary transition-all duration-300 hover:bg-secondary shadow-sm"
              >
                Book Consultation
              </Link>
              <Link
                href="#projects"
                className="border border-primary/30 bg-surface/80 px-7 py-3.5 font-label-sm text-xs uppercase tracking-widest text-primary transition-all duration-300 hover:border-primary hover:bg-surface"
              >
                View Projects
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Stats Banner */}
      <section className="border-y border-primary/10 bg-surface-container-low py-8 px-margin-mobile md:px-margin-desktop">
        <div className="mx-auto max-w-container-max grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
          {stats.map((s) => (
            <div key={s.label} className="p-2">
              <div className="font-display text-3xl md:text-4xl font-bold text-secondary mb-1">{s.value}</div>
              <div className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <main className="relative z-10 bg-background">
        {/* Practice Scope / Services Section */}
        <section className="bg-surface px-margin-mobile py-24 md:px-margin-desktop" id="services">
          <div className="mx-auto max-w-container-max">
            <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between border-b border-primary/10 pb-6 reveal">
              <div>
                <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-semibold">
                  What We Deliver
                </span>
                <h2 className="mt-2 font-display text-3xl md:text-4xl text-primary font-normal">
                  Our Comprehensive Services
                </h2>
              </div>
              <p className="mt-4 md:mt-0 max-w-md font-body text-sm text-on-surface-variant">
                From initial 3D layout concepts to final site handover, we ensure seamless execution with transparent timelines and uncompromised material quality.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {services.map((item, i) => (
                <div
                  key={item.title}
                  className={`flex flex-col justify-between border border-primary/15 bg-background p-8 transition-all duration-300 hover:border-secondary hover:shadow-md reveal stagger-${(i % 3) + 1}`}
                >
                  <div>
                    <div className="mb-4 text-3xl">{item.icon}</div>
                    <span className="mb-2 inline-block font-label-sm text-xs font-semibold text-secondary uppercase tracking-wider">
                      {item.tag}
                    </span>
                    <h3 className="mb-3 font-display text-xl text-primary font-normal">
                      {item.title}
                    </h3>
                    <p className="font-body text-sm leading-relaxed text-on-surface-variant">{item.body}</p>
                  </div>
                  <Link
                    href="/services"
                    className="mt-6 inline-flex items-center text-xs uppercase tracking-wider font-semibold text-primary hover:text-secondary"
                  >
                    Learn More →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Selected Works Portfolio Showcase */}
        <section className="bg-background py-24 px-margin-mobile md:px-margin-desktop" id="projects">
          <div className="mx-auto max-w-container-max">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-primary/10 pb-6">
              <div>
                <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-semibold">
                  Recent Work
                </span>
                <h2 className="mt-2 font-display text-3xl md:text-4xl text-primary font-normal">
                  Featured Portfolio
                </h2>
              </div>

              {/* Filter Tabs */}
              <div className="mt-6 md:mt-0 flex flex-wrap gap-2">
                {["All", "Villa", "Commercial", "Penthouse"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors font-medium border ${
                      activeCategory === cat
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-surface text-primary border-primary/20 hover:bg-surface-container-high"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="group flex flex-col border border-primary/15 bg-surface overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative h-64 overflow-hidden bg-surface-container-high">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-primary/90 px-3 py-1 text-xs uppercase tracking-wider text-on-primary font-medium">
                      {proj.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-on-surface-variant mb-2">
                        <span>📍 {proj.location}</span>
                        <span>{proj.area}</span>
                      </div>
                      <h3 className="font-display text-xl text-primary font-normal mb-2 group-hover:text-secondary transition-colors">
                        {proj.title}
                      </h3>
                      <p className="font-body text-sm text-on-surface-variant line-clamp-2">
                        {proj.description}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-primary/10 flex items-center justify-between">
                      <span className="text-xs text-on-surface-variant">Completed {proj.year}</span>
                      <Link
                        href={`/projects`}
                        className="text-xs uppercase tracking-wider font-semibold text-primary group-hover:text-secondary"
                      >
                        View Project Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/projects"
                className="inline-block border border-primary px-8 py-4 font-label-sm text-xs uppercase tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-on-primary"
              >
                View Full Portfolio (20+ Projects)
              </Link>
            </div>
          </div>
        </section>

        {/* Practical Process Steps */}
        <section className="bg-surface-container-low px-margin-mobile py-24 md:px-margin-desktop border-y border-primary/10">
          <div className="mx-auto max-w-container-max">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-semibold">
                Transparent Execution
              </span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl text-primary font-normal">
                How We Work With You
              </h2>
              <p className="mt-4 font-body text-sm text-on-surface-variant">
                Our structured 4-step interior design workflow ensures complete transparency from initial sketch to final key handover.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "01", title: "Consultation & Brief", text: "In-depth site evaluation, budget alignment, and lifestyle requirements gathering." },
                { step: "02", title: "3D Design & Specs", text: "Photorealistic 3D renders, material sampling, and itemized cost estimations." },
                { step: "03", title: "Factory Fabrication", text: "Precision modular manufacturing using top-tier hardware and marine plywood." },
                { step: "04", title: "Site Handover", text: "On-site installation, thorough quality checks, and timely key handover." },
              ].map((p) => (
                <div key={p.step} className="border border-primary/15 bg-background p-8 relative">
                  <span className="font-display text-4xl font-bold text-secondary/30 block mb-4">{p.step}</span>
                  <h3 className="font-display text-lg text-primary font-normal mb-2">{p.title}</h3>
                  <p className="font-body text-xs leading-relaxed text-on-surface-variant">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Real Client Testimonials & Reviews */}
        <section className="bg-background px-margin-mobile py-24 md:px-margin-desktop">
          <div className="mx-auto max-w-container-max">
            <div className="mb-14 border-b border-primary/10 pb-6 reveal">
              <span className="font-label-sm text-xs uppercase tracking-widest text-secondary font-semibold">
                Verified Client Feedback
              </span>
              <h2 className="mt-2 font-display text-3xl md:text-4xl text-primary font-normal">
                What Our Clients Say
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <div
                  key={t.author}
                  className={`flex flex-col justify-between border border-primary/15 bg-surface p-8 shadow-sm reveal stagger-${i + 1}`}
                >
                  <div>
                    <div className="flex gap-1 text-amber-500 mb-4 text-sm">★★★★★</div>
                    <p className="font-body text-sm italic leading-relaxed text-primary mb-6">
                      "{t.quote}"
                    </p>
                  </div>
                  <div className="pt-4 border-t border-primary/10">
                    <span className="block font-label-sm text-xs font-bold uppercase tracking-wider text-primary">
                      {t.author}
                    </span>
                    <span className="font-body text-xs text-on-surface-variant block mt-0.5">
                      {t.location} • <span className="text-secondary">{t.type}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Minimal Consultation Booking Section */}
        <section className="bg-primary px-margin-mobile py-20 text-on-primary md:px-margin-desktop" id="inquiry">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-label-sm text-xs font-semibold uppercase tracking-widest text-secondary">
              Get In Touch
            </span>
            <h2 className="mt-2 font-display text-3xl font-normal text-on-primary md:text-4xl">
              Book a Consultation
            </h2>
            <p className="mt-2 font-body text-sm text-on-primary/70">
              Share your project details below and our team will get in touch within 24 hours.
            </p>

            <form className="mt-8 space-y-4 text-left" onSubmit={handleInquirySubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-b border-on-primary/20 bg-transparent py-2.5 font-body text-sm text-on-primary placeholder:text-on-primary/40 outline-none transition-colors focus:border-secondary"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border-b border-on-primary/20 bg-transparent py-2.5 font-body text-sm text-on-primary placeholder:text-on-primary/40 outline-none transition-colors focus:border-secondary"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-b border-on-primary/20 bg-transparent py-2.5 font-body text-sm text-on-primary placeholder:text-on-primary/40 outline-none transition-colors focus:border-secondary"
                  required
                />
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="w-full border-b border-on-primary/20 bg-transparent py-2.5 font-body text-sm text-on-primary/90 outline-none transition-colors focus:border-secondary [&>option]:bg-primary [&>option]:text-on-primary"
                >
                  <option value="Full-Home Residential">Full-Home Residential</option>
                  <option value="Modular Kitchen & Millwork">Modular Kitchen & Millwork</option>
                  <option value="Commercial / Office">Commercial / Office</option>
                  <option value="Renovation & Civil Work">Renovation & Civil Work</option>
                </select>
              </div>

              <input
                type="text"
                placeholder="Location / Project Note (e.g. 3BHK in Kadri, Mangalore)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full border-b border-on-primary/20 bg-transparent py-2.5 font-body text-sm text-on-primary placeholder:text-on-primary/40 outline-none transition-colors focus:border-secondary"
              />

              {/* Status Messages */}
              {status === 'success' && (
                <div className="border border-green-500/40 bg-green-950/70 p-3 text-xs font-medium text-green-300">
                  ✓ Thank you! Your request has been received. We will contact you shortly.
                </div>
              )}
              {status === 'error' && (
                <div className="border border-red-500/40 bg-red-950/70 p-3 text-xs font-medium text-red-300">
                  ✕ {errorMessage || 'Something went wrong. Please try again.'}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 w-full bg-secondary py-3.5 font-label-sm text-xs font-bold uppercase tracking-widest text-on-secondary transition-colors hover:bg-surface hover:text-primary disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit Request →'}
              </button>
            </form>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}