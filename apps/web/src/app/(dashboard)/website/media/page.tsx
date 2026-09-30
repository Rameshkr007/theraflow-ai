"use client";

import React, { useState } from "react";
import {
  Image as ImageIcon,
  Upload,
  Search,
  Copy,
  Trash2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { notify } from "@/components/ui/toast";

export default function MediaLibraryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const [mediaItems, setMediaItems] = useState([
    {
      id: "med-1",
      name: "Dr_Sarah_Bennett_Headshot.jpg",
      category: "headshots",
      size: "1.4 MB",
      dimensions: "1200x1600",
      url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
      uploadedAt: "2 days ago",
    },
    {
      id: "med-2",
      name: "Willow_Mind_Logo_Dark.svg",
      category: "branding",
      size: "42 KB",
      dimensions: "Vector",
      url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80",
      uploadedAt: "1 week ago",
    },
    {
      id: "med-3",
      name: "Austin_Office_Therapy_Room.jpg",
      category: "office",
      size: "2.8 MB",
      dimensions: "2400x1600",
      url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      uploadedAt: "2 weeks ago",
    },
    {
      id: "med-4",
      name: "Mindfulness_Nature_Hero.jpg",
      category: "stock",
      size: "3.1 MB",
      dimensions: "2800x1800",
      url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
      uploadedAt: "3 weeks ago",
    },
  ]);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    notify.success("Image URL copied to clipboard!");
  };

  const handleUploadSim = () => {
    notify.info("Select image to upload (PNG, JPG, SVG max 10MB)");
  };

  const filtered = mediaItems.filter((item) => {
    const matchesCat = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Media Asset Library
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              CDN Optimized
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Upload practice logos, clinician headshots, and therapy room imagery for use across your website.
          </p>
        </div>

        <button
          onClick={handleUploadSim}
          className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:bg-primary/90 flex items-center gap-1.5 shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Upload Media
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg border border-border">
          {["all", "headshots", "branding", "office", "stock"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-md capitalize font-medium transition-colors ${
                activeCategory === cat ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media files..."
            className="w-full pl-9 pr-3 py-1.5 bg-background border border-input rounded-md text-xs"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border bg-card overflow-hidden shadow-sm group hover:border-primary/50 transition-all flex flex-col justify-between"
          >
            <div className="aspect-video bg-muted relative overflow-hidden flex items-center justify-center">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-background/80 backdrop-blur-xs text-foreground uppercase tracking-wider">
                {item.category}
              </span>
            </div>

            <div className="p-3 text-xs space-y-2">
              <div>
                <p className="font-semibold text-foreground truncate" title={item.name}>
                  {item.name}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {item.dimensions} · {item.size}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <button
                  onClick={() => handleCopyUrl(item.url)}
                  className="px-2 py-1 bg-muted hover:bg-primary hover:text-primary-foreground rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" /> Copy URL
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
