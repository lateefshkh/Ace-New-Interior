"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useScrollReveal, useParallax } from "@/hooks/use-motion";
import { 
  Building2, 
  BedDouble, 
  Bath, 
  Maximize2, 
  MapPin, 
  Filter, 
  SlidersHorizontal,
  X, 
  ArrowRight,
  Sparkles,
  PhoneCall,
  CheckCircle2
} from "lucide-react";

interface Property {
  $id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  city?: string;
  state?: string;
  property_type: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  status: string;
  images: string;
  $createdAt?: string;
}

// Architectural Sample/Fallback properties in case DB has zero entries initially
const MOCK_PROPERTIES: Property[] = [
  {
    $id: "mock-1",
    title: "The Kyoto Sanctuary",
    description: "An architectural marvel combining traditional minimalist wooden aesthetics with contemporary floor-to-ceiling glass paneling and private Zen courtyards.",
    price: 4500000,
    location: "Arashiyama District",
    city: "Kyoto",
    state: "Kansai",
    property_type: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 5200,
    status: "available",
    images: "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.1347174.Woblo.png",
  },
  {
    $id: "mock-2",
    title: "Atelier O Living Residence",
    description: "A refined urban living space boasting monolith marble kitchen islands, natural teak accents, and custom ambient acoustic ceiling systems.",
    price: 2850000,
    location: "Mayfair",
    city: "London",
    state: "Greater London",
    property_type: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    area_sqft: 3400,
    status: "available",
    images: "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.modern-living-room-interior-design-scaled.Woblo.jpg",
  },
  {
    $id: "mock-3",
    title: "Luminescence Loft",
    description: "Expansive light-filled gallery residence featuring polished micro-cement floors, skylights with solar tracking, and bespoke minimalist joinery.",
    price: 1950000,
    location: "Tribeca",
    city: "New York",
    state: "NY",
    property_type: "Penthouse",
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 2800,
    status: "reserved",
    images: "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.PHOTO-2020-01-19-18-32-40-2.Woblo.jpg",
  },
  {
    $id: "mock-4",
    title: "The Framework HQ & Suites",
    description: "State-of-the-art multi-level studio workspace featuring industrial glass partitions, internal green gardens, and subterranean parking facilities.",
    price: 6200000,
    location: "Zurich Nord",
    city: "Zurich",
    state: "Zurich",
    property_type: "Commercial",
    bedrooms: 5,
    bathrooms: 6,
    area_sqft: 8500,
    status: "available",
    images: "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.1347177.Woblo.png",
  },
  {
    $id: "mock-5",
    title: "Minimalist Horizon Estate",
    description: "Overlooking coastal cliffs, this organic architectural villa incorporates raw stone walls, infinity water channels, and integrated smart solar climate control.",
    price: 5400000,
    location: "Montecito",
    city: "California",
    state: "CA",
    property_type: "Villa",
    bedrooms: 5,
    bathrooms: 5,
    area_sqft: 6700,
    status: "available",
    images: "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.2-6-19-Yvonne-Jacobs-01-1600x965-1.Woblo.jpg",
  }
];

export default function PropertiesShowcasePage() {
  useScrollReveal();
  useParallax();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Selected property for Modal details
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/properties");
      const data = await res.json();
      if (data.success && Array.isArray(data.properties) && data.properties.length > 0) {
        setProperties(data.properties);
      } else {
        // Fallback to sample architectural properties if Appwrite collection is empty
        setProperties(MOCK_PROPERTIES);
      }
    } catch (err) {
      console.error("Failed to fetch properties from API, rendering showcase collection.", err);
      setProperties(MOCK_PROPERTIES);
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      // Type Filter
      if (selectedType !== "all" && p.property_type?.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }
      // Bedrooms Filter
      if (selectedBedrooms !== "all") {
        const beds = parseInt(selectedBedrooms);
        if (selectedBedrooms === "4+" ? p.bedrooms < 4 : p.bedrooms !== beds) {
          return false;
        }
      }
      // Status Filter
      if (selectedStatus !== "all" && p.status?.toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }
      // Search Filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(q);
        const matchesLoc = p.location?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesLoc) return false;
      }
      return true;
    });
  }, [properties, selectedType, selectedBedrooms, selectedStatus, searchQuery]);

  const formatCurrency = (val: number) => {
    if (!val) return "Contact for Price";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-primary">
      <SiteNav />

      {/* Hero Header */}
      <section className="relative pt-36 pb-20 border-b border-primary/10 bg-surface">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 mb-6 text-label-sm font-label-sm uppercase tracking-widest bg-primary/5 text-secondary border border-secondary/20">
                <Sparkles className="w-3.5 h-3.5" /> Curated Real Estate Collection
              </span>
              <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary tracking-tight">
                Architectural Properties
              </h1>
              <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Explore our handpicked portfolio of minimalist residences, luxury penthouses, and sanctuary spaces crafted for architectural clarity and spatial elegance.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/admin/properties"
                className="hidden sm:inline-flex items-center gap-2 px-6 py-3.5 border border-primary/20 bg-surface hover:bg-primary hover:text-on-primary transition-all duration-300 font-label-sm text-label-sm uppercase tracking-widest"
              >
                Manage Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow py-16">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          {/* Controls & Filter Bar */}
          <div className="mb-12 border border-primary/10 bg-surface p-6 md:p-8 backdrop-blur-md">
            <div className="flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between">
              
              {/* Search Bar */}
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  placeholder="Search by title, city, location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-background border border-primary/15 px-4 py-3 pl-10 text-body-md font-body-md placeholder:text-primary/40 focus:outline-none focus:border-secondary transition-colors"
                />
                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-primary/40" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-3.5 text-primary/40 hover:text-primary"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filters Group */}
              <div className="flex flex-wrap items-center gap-4">
                {/* Property Type Dropdown */}
                <div className="flex items-center gap-2 border border-primary/15 bg-background px-3 py-2">
                  <Building2 className="w-4 h-4 text-secondary" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="bg-transparent text-body-md font-body-md text-primary focus:outline-none cursor-pointer pr-2"
                  >
                    <option value="all">All Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>

                {/* Bedrooms Filter */}
                <div className="flex items-center gap-2 border border-primary/15 bg-background px-3 py-2">
                  <BedDouble className="w-4 h-4 text-secondary" />
                  <select
                    value={selectedBedrooms}
                    onChange={(e) => setSelectedBedrooms(e.target.value)}
                    className="bg-transparent text-body-md font-body-md text-primary focus:outline-none cursor-pointer pr-2"
                  >
                    <option value="all">Any Bedrooms</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="4+">4+ Bedrooms</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2 border border-primary/15 bg-background px-3 py-2">
                  <SlidersHorizontal className="w-4 h-4 text-secondary" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="bg-transparent text-body-md font-body-md text-primary focus:outline-none cursor-pointer pr-2"
                  >
                    <option value="all">All Statuses</option>
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                {/* Clear Filters Button */}
                {(selectedType !== "all" || selectedBedrooms !== "all" || selectedStatus !== "all" || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedType("all");
                      setSelectedBedrooms("all");
                      setSelectedStatus("all");
                      setSearchQuery("");
                    }}
                    className="text-label-sm font-label-sm uppercase tracking-widest text-secondary hover:underline px-2"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-8 flex justify-between items-center text-body-md font-body-md text-on-surface-variant">
            <p>Showing <span className="font-bold text-primary">{filteredProperties.length}</span> property architectural spaces</p>
          </div>

          {/* Loading Grid Skeleton */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="animate-pulse bg-surface border border-primary/10 h-[480px]" />
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            /* No Results state */
            <div className="text-center py-24 border border-dashed border-primary/20 bg-surface px-6">
              <Building2 className="w-12 h-12 text-primary/30 mx-auto mb-4" />
              <h3 className="font-headline-md text-headline-md text-primary mb-2">No matching properties found</h3>
              <p className="text-on-surface-variant max-w-md mx-auto mb-6">
                Try adjusting your search criteria or resetting filters to view all available architectural properties.
              </p>
              <button
                onClick={() => {
                  setSelectedType("all");
                  setSelectedBedrooms("all");
                  setSelectedStatus("all");
                  setSearchQuery("");
                }}
                className="px-6 py-3 bg-primary text-on-primary font-label-sm uppercase tracking-widest text-label-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Property Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((prop) => {
                const imgSource = prop.images || "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.1347174.Woblo.png";
                
                return (
                  <article
                    key={prop.$id}
                    className="group flex flex-col bg-surface border border-primary/10 hover:border-secondary/50 transition-all duration-500 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl"
                    onClick={() => setActiveProperty(prop)}
                  >
                    {/* Image Box */}
                    <div className="relative w-full h-72 overflow-hidden bg-primary/5">
                      <img
                        src={imgSource}
                        alt={prop.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      
                      {/* Status Tag */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className={`px-3 py-1 text-xs font-label-sm uppercase tracking-widest ${
                          prop.status === 'available'
                            ? 'bg-primary text-on-primary'
                            : prop.status === 'reserved'
                            ? 'bg-secondary text-on-secondary'
                            : 'bg-on-surface-variant text-surface'
                        }`}>
                          {prop.status}
                        </span>
                      </div>

                      {/* Property Type Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-3 py-1 text-xs font-label-sm uppercase tracking-widest bg-surface/90 backdrop-blur-sm text-primary border border-primary/10">
                          {prop.property_type || 'Residence'}
                        </span>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-on-primary text-label-sm uppercase tracking-widest font-label-sm flex items-center gap-2">
                          Explore Details <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        {/* Location */}
                        <div className="flex items-center gap-1.5 text-secondary font-label-sm text-xs uppercase tracking-widest mb-2">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{prop.location}{prop.city ? `, ${prop.city}` : ''}</span>
                        </div>

                        {/* Title */}
                        <h3 className="font-headline-md text-headline-md text-primary group-hover:text-secondary transition-colors duration-300 line-clamp-1 mb-2">
                          {prop.title}
                        </h3>

                        {/* Price */}
                        <p className="font-headline-lg text-headline-md text-primary font-bold mb-4">
                          {formatCurrency(prop.price)}
                        </p>

                        {/* Description excerpt */}
                        {prop.description && (
                          <p className="font-body-md text-body-md text-on-surface-variant/90 line-clamp-2 mb-6">
                            {prop.description}
                          </p>
                        )}
                      </div>

                      {/* Specs Row */}
                      <div className="pt-4 border-t border-primary/10 grid grid-cols-3 gap-2 text-center text-on-surface-variant font-label-sm text-xs">
                        <div className="flex flex-col items-center justify-center p-2 bg-background/50 border border-primary/5">
                          <BedDouble className="w-4 h-4 text-secondary mb-1" />
                          <span>{prop.bedrooms || 0} Beds</span>
                        </div>

                        <div className="flex flex-col items-center justify-center p-2 bg-background/50 border border-primary/5">
                          <Bath className="w-4 h-4 text-secondary mb-1" />
                          <span>{prop.bathrooms || 0} Baths</span>
                        </div>

                        <div className="flex flex-col items-center justify-center p-2 bg-background/50 border border-primary/5">
                          <Maximize2 className="w-4 h-4 text-secondary mb-1" />
                          <span>{prop.area_sqft ? `${prop.area_sqft.toLocaleString()} sqft` : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Property Details Modal Drawer */}
      {activeProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/70 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-300">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-surface border border-primary/20 shadow-2xl flex flex-col md:flex-row">
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveProperty(null)}
              aria-label="Close details"
              className="absolute top-4 right-4 z-20 p-2 bg-surface/80 text-primary hover:bg-primary hover:text-on-primary transition-colors border border-primary/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="w-full md:w-1/2 h-64 md:h-auto min-h-[300px] relative bg-primary/10">
              <img
                src={activeProperty.images || "/home-ace-interior-architect-mangalore-udupi-bangalore-goa.image.1347174.Woblo.png"}
                alt={activeProperty.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4">
                <span className="px-3 py-1 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest">
                  {activeProperty.status}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between">
              <div>
                <span className="font-label-sm text-xs uppercase tracking-widest text-secondary mb-1 block">
                  {activeProperty.property_type} • {activeProperty.location}
                </span>
                
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">
                  {activeProperty.title}
                </h2>

                <p className="font-headline-lg text-2xl text-primary font-bold mb-6">
                  {formatCurrency(activeProperty.price)}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-3 gap-3 mb-6 p-4 bg-background border border-primary/10">
                  <div className="text-center">
                    <span className="block text-xs font-label-sm text-on-surface-variant uppercase">Bedrooms</span>
                    <span className="font-headline-md text-lg text-primary">{activeProperty.bedrooms}</span>
                  </div>
                  <div className="text-center border-x border-primary/10">
                    <span className="block text-xs font-label-sm text-on-surface-variant uppercase">Bathrooms</span>
                    <span className="font-headline-md text-lg text-primary">{activeProperty.bathrooms}</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-label-sm text-on-surface-variant uppercase">Area</span>
                    <span className="font-headline-md text-lg text-primary">{activeProperty.area_sqft ? `${activeProperty.area_sqft} sqft` : 'N/A'}</span>
                  </div>
                </div>

                {/* Description */}
                <h4 className="font-label-sm text-xs uppercase tracking-widest text-primary mb-2">Architectural Description</h4>
                <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
                  {activeProperty.description || "Designed with architectural silence and spatial harmony. Every material selected expresses tactile truth and natural lighting."}
                </p>

                {/* Features Highlights */}
                <div className="space-y-2 mb-8">
                  <div className="flex items-center gap-2 text-xs font-body-md text-primary">
                    <CheckCircle2 className="w-4 h-4 text-secondary" /> Custom Interior Space Planning Included
                  </div>
                  <div className="flex items-center gap-2 text-xs font-body-md text-primary">
                    <CheckCircle2 className="w-4 h-4 text-secondary" /> Premium Natural Finish Options
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-primary/10">
                <Link
                  href="/#inquiry"
                  onClick={() => setActiveProperty(null)}
                  className="flex-1 text-center py-3.5 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest hover:bg-secondary transition-colors"
                >
                  Schedule Private Tour
                </Link>
                <a
                  href="tel:+1234567890"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3.5 border border-primary/20 text-primary font-label-sm text-xs uppercase tracking-widest hover:bg-primary/5 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" /> Call Agent
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
