"use client";

import React, { useState } from "react";
import {
  PenTool,
  Sparkles,
  BookOpen,
  Share2,
  FileText,
  Search,
  Plus,
  Loader2,
  Eye,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { notify } from "@/components/ui/toast";

export default function ContentStudioPage() {
  const [topic, setTopic] = useState("");
  const [targetAudience, setTargetAudience] = useState("High-achieving professionals in Austin, TX");
  const [format, setFormat] = useState("blog");
  const [isGenerating, setIsGenerating] = useState(false);

  const [articles, setArticles] = useState([
    {
      id: "art-1",
      title: "5 Signs You May Be Experiencing High-Functioning Anxiety",
      slug: "signs-of-high-functioning-anxiety",
      readTime: "5 min read",
      publishedAt: "Published 3 days ago",
      views: 342,
      category: "Anxiety & Panic",
      excerpt:
        "High-functioning anxiety often disguises itself as ambitious perfectionism, punctuality, and relentless drive. Here is how to recognize when achievement turns into exhaustion.",
    },
    {
      id: "art-2",
      title: "Breaking the Perfectionism-Burnout Loop: A CBT Framework",
      slug: "breaking-perfectionism-burnout-loop",
      readTime: "7 min read",
      publishedAt: "Published 2 weeks ago",
      views: 580,
      category: "Burnout Recovery",
      excerpt:
        "When your self-worth is tied exclusively to productivity, rest feels like laziness. Explore cognitive reframing techniques to establish sustainable boundaries at work.",
    },
    {
      id: "art-3",
      title: "What Actually Happens in Your First Couples Therapy Session?",
      slug: "what-to-expect-first-couples-session",
      readTime: "4 min read",
      publishedAt: "Published 1 month ago",
      views: 890,
      category: "Relationships",
      excerpt:
        "Demystifying Gottman Method couples counseling: intake assessment, individual check-ins, and building a foundation of constructive conflict resolution.",
    },
  ]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      notify.error("Please provide a topic or therapeutic subject");
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const newArt = {
        id: `art-${Date.now()}`,
        title: topic,
        slug: topic.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        readTime: "6 min read",
        publishedAt: "Draft created just now",
        views: 0,
        category: "Clinical Psychoeducation",
        excerpt: `An evidence-based guide exploring ${topic}, integrating clinical insights from cognitive-behavioral therapy and mindfulness-based stress reduction.`,
      };
      setArticles([newArt, ...articles]);
      notify.success("AI draft generated and saved to Content Studio!");
      setTopic("");
    }, 1200);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-foreground">
              AI Content Studio & Clinical Blog
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              SEO & AEO Optimized
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Generate evidence-based psychoeducation articles, patient self-help guides, and local therapy blog posts.
          </p>
        </div>
      </div>

      {/* Generator Form */}
      <div className="p-5 rounded-xl border border-primary/20 bg-primary/5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <Sparkles className="w-4 h-4" />
          <span>Generate New Clinical Article or Guide</span>
        </div>

        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
          <div className="md:col-span-5">
            <label className="font-medium text-foreground">Article Topic or Specialty Angle</label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Navigating Imposter Syndrome as a Tech Professional"
              className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
            />
          </div>

          <div className="md:col-span-4">
            <label className="font-medium text-foreground">Target Audience</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full mt-1.5 p-2 bg-background border border-input rounded-md"
            />
          </div>

          <div className="md:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
              Generate Draft
            </button>
          </div>
        </form>
      </div>

      {/* Articles List */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">
          Published & Draft Content ({articles.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.map((art) => (
            <div
              key={art.id}
              className="p-5 rounded-xl border border-border bg-card shadow-sm hover:border-primary/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded font-semibold bg-muted text-muted-foreground">
                    {art.category}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {art.readTime}
                  </span>
                </div>

                <h4 className="font-serif font-bold text-base text-foreground leading-snug">
                  {art.title}
                </h4>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-border mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">{art.publishedAt}</span>
                <span className="text-primary font-semibold flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {art.views} views
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
