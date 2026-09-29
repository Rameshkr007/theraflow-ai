import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-surface">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-sans text-sm flex">
        <h1 className="text-4xl font-bold text-primary">TheraFlow AI</h1>
      </div>
      <div className="mt-8">
        <p className="text-text-secondary mb-4">Production-grade SaaS platform for therapy practices.</p>
        <Button variant="primary">Get Started</Button>
      </div>
    </main>
  );
}
