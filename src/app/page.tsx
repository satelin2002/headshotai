import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Camera, Users, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="h-6 w-6" />
            <span className="text-xl font-bold">AI Headshot Studio</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-sm font-medium hover:underline"
            >
              Pricing
            </Link>
            <Link
              href="/enterprise"
              className="text-sm font-medium hover:underline"
            >
              Enterprise
            </Link>
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="container space-y-6 py-24 sm:py-32">
          <div className="mx-auto flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="text-4xl font-bold sm:text-6xl">
              Professional Headshots,{" "}
              <span className="text-primary">Powered by AI</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Generate stunning professional headshots in minutes. Perfect for
              LinkedIn, company websites, and personal branding.
            </p>
            <div className="flex gap-4">
              <Button size="lg" asChild>
                <Link href="/create">
                  Create Your Headshot <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/enterprise">Enterprise Solution</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-12 sm:py-16">
          <div className="grid gap-8 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <Camera className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Professional Quality
                </h3>
                <p className="text-muted-foreground">
                  AI-powered technology ensures consistent, high-quality results
                  every time.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Sparkles className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Instant Results</h3>
                <p className="text-muted-foreground">
                  Get your professional headshots in minutes, not days or weeks.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Team Solutions</h3>
                <p className="text-muted-foreground">
                  Perfect for teams of any size, with enterprise-grade features.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2024 AI Headshot Studio. All rights reserved.
          </p>
          <nav className="flex gap-4">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
