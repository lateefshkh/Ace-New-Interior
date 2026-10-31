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
  PhoneCall,
  CheckCircle2,
  Search
} from "lucide-react";
import { IMAGES } from "@/lib/constants/images";

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

// Fallback listings when Appwrite has no entries yet
const MOCK_PROPERTIES: Property[] = [
  {
    $id: "mock-1",
    title: "Premium 3BHK, Kadri Hills",
    description: "Spacious apartment with teak interiors, cross-ventilation, and panoramic city views.",
    price: 12500000,
    location: "Kadri Hills",
    city: "Mangalore",
    state: "Karnataka",
    property_type: "Apartment",
    bedrooms: 3,
    bathrooms: 3,
    area_sqft: 1850,
    status: "available",
    images: IMAGES.hero,
  },
  {
    $id: "mock-2",
    title: "Heritage Villa, Manipal",
    description: "Restored villa with laterite walls, courtyard garden, and Ace New Interior turnkey fit-out.",
    price: 28000000,
    location: "Manipal",
    city: "Udupi",
    state: "Karnataka",
    property_type: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 4200,
    status: "available",
    images: IMAGES.livingRoom,
  },
  {
    $id: "mock-3",
    title: "2BHK, Koramangala",
    description: "Modern apartment in a quiet lane, ready for custom interior design consultation.",
    price: 15000000,
    location: "Koramangala 5th Block",
    city: "Bangalore",
    state: "Karnataka",
    property_type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 1280,
    status: "available",
    images: IMAGES.studio,
  },
  {
    $id: "mock-4",
    title: "Beachfront Villa, Calangute",
    description: "Coastal villa with open-plan living, salt-resistant finishes, and private pool.",
    price: 35000000,
    location: "Calangute",
    city: "Goa",
    state: "Goa",
    property_type: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    area_sqft: 3800,
    status: "reserved",
    images: IMAGES.detail,
  },
  {
    $id: "mock-5",
    title: "Design Studio Space, HSR Layout",
    description: "Commercial studio with high ceilings, natural light, and flexible zoning for creative teams.",
    price: 42000000,
    location: "HSR Layout",
    city: "Bangalore",
    state: "Karnataka",
    property_type: "Commercial",
    bedrooms: 0,
    bathrooms: 3,
    area_sqft: 3200,
    status: "available",
    images: IMAGES.heroAlt,
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
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);

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
        setProperties(MOCK_PROPERTIES);
      }
    } catch (err) {
      console.error("Failed to fetch properties from API, rendering showcase collection.", err);
      setProperties(MOCK_PROPERTIES);
    } finally {
      setLoading(false);
    }
  };

  // Active filter count calculation
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedType !== "all") count++;
    if (selectedBedrooms !== "all") count++;
    if (selectedStatus !== "all") count++;
    if (searchQuery.trim() !== "") count++;
    return count;
  }, [selectedType, selectedBedrooms, selectedStatus, searchQuery]);

  // Filter Logic
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (selectedType !== "all" && p.property_type?.toLowerCase() !== selectedType.toLowerCase()) {
        return false;
      }
      if (selectedBedrooms !== "all") {
        const beds = parseInt(selectedBedrooms);
        if (selectedBedrooms === "4+" ? p.bedrooms < 4 : p.bedrooms !== beds) {
          return false;
        }
      }
      if (selectedStatus !== "all" && p.status?.toLowerCase() !== selectedStatus.toLowerCase()) {
        return false;
      }
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
    return `Rs. ${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-primary">
      <SiteNav />

      {/* Main Content Area starting higher up */}
      <main className="flex-grow pt-28 pb-16">
        <div className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
          
          {/* Header Row with Title and Filter Button */}
          <div className="flex items-center justify-between gap-4 mb-8 border-b border-primary/10 pb-6">
            <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-primary tracking-tight">
              Properties
            </h1>

            <button
              onClick={() => setShowFilterModal(true)}
              className="relative inline-flex items-center gap-2 px-6 py-3.5 border border-primary/20 bg-surface hover:bg-primary hover:text-on-primary transition-all duration-300 font-label-sm text-xs uppercase tracking-widest cursor-pointer shadow-sm"
            >
              <Filter className="w-4 h-4 text-secondary" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Active Filter Chips Bar (if filters applied) */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-8 bg-surface p-4 border border-primary/10">
              <span className="text-xs font-label-sm uppercase tracking-widest text-primary/60 mr-2">Active Filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary border border-primary/15 text-xs font-label-sm">
                  Search: "{searchQuery}"
                  <X className="w-3.5 h-3.5 cursor-pointer hover:text-secondary" onClick={() => setSearchQuery("")} />
                </span>
              )}
              {selectedType !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary border border-primary/15 text-xs font-label-sm">
                  Type: {selectedType}
                  <X className="w-3.5 h-3.5 cursor-pointer hover:text-secondary" onClick={() => setSelectedType("all")} />
                </span>
              )}
              {selectedBedrooms !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary border border-primary/15 text-xs font-label-sm">
                  Beds: {selectedBedrooms}
                  <X className="w-3.5 h-3.5 cursor-pointer hover:text-secondary" onClick={() => setSelectedBedrooms("all")} />
                </span>
              )}
              {selectedStatus !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary border border-primary/15 text-xs font-label-sm">
                  Status: {selectedStatus}
                  <X className="w-3.5 h-3.5 cursor-pointer hover:text-secondary" onClick={() => setSelectedStatus("all")} />
                </span>
              )}

              <button
                onClick={() => {
                  setSelectedType("all");
                  setSelectedBedrooms("all");
                  setSelectedStatus("all");
                  setSearchQuery("");
                }}
                className="text-xs font-label-sm uppercase tracking-widest text-secondary hover:underline ml-auto"
              >
                Clear All
              </button>
            </div>
          )}

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
                Try adjusting your search criteria or clearing filters to view available properties.
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

      {/* FILTER MODAL POPUP */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-surface border border-primary/20 shadow-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 border-b border-primary/10 pb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-secondary" />
                <h3 className="font-headline-md text-headline-md text-primary">Filter Properties</h3>
              </div>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-2 text-primary/60 hover:text-primary hover:bg-primary/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Search Query */}
              <div>
                <label className="block text-xs font-label-sm uppercase tracking-widest text-primary mb-2">
                  Keyword / Location Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by title, location, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-background border border-primary/15 px-4 py-3 pl-10 text-body-md font-body-md focus:outline-none focus:border-secondary"
                  />
                  <Search className="absolute left-3 top-3.5 w-4 h-4 text-primary/40" />
                </div>
              </div>

              {/* Property Type Dropdown */}
              <div>
                <label className="block text-xs font-label-sm uppercase tracking-widest text-primary mb-2">
                  Property Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-background border border-primary/15 px-4 py-3 text-body-md font-body-md text-primary focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Penthouse">Penthouse</option>
                  <option value="Commercial">Commercial</option>
                </select>
              </div>

              {/* Bedrooms Filter */}
              <div>
                <label className="block text-xs font-label-sm uppercase tracking-widest text-primary mb-2">
                  Bedrooms
                </label>
                <select
                  value={selectedBedrooms}
                  onChange={(e) => setSelectedBedrooms(e.target.value)}
                  className="w-full bg-background border border-primary/15 px-4 py-3 text-body-md font-body-md text-primary focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value="all">Any Bedrooms</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4">4 Bedrooms</option>
                  <option value="4+">4+ Bedrooms</option>
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-xs font-label-sm uppercase tracking-widest text-primary mb-2">
                  Availability Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full bg-background border border-primary/15 px-4 py-3 text-body-md font-body-md text-primary focus:outline-none focus:border-secondary cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="available">Available</option>
                  <option value="reserved">Reserved</option>
                  <option value="sold">Sold</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-4 pt-6 mt-8 border-t border-primary/10">
              <button
                onClick={() => {
                  setSelectedType("all");
                  setSelectedBedrooms("all");
                  setSelectedStatus("all");
                  setSearchQuery("");
                }}
                className="flex-1 py-3 border border-primary/20 text-primary font-label-sm text-xs uppercase tracking-widest hover:bg-primary/5 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-3 bg-primary text-on-primary font-label-sm text-xs uppercase tracking-widest hover:bg-secondary transition-colors"
              >
                Apply Filters ({filteredProperties.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROPERTY DETAILS MODAL DRAWER */}
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
