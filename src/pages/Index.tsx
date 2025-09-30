import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Cloud,
  Droplets,
  Sparkles,
  Sprout,
  ArrowRight,
  CheckCircle2,
  Leaf,
  LineChart,
  ShieldCheck,
  Users,
  Shield,
  Github,
  Twitter,
  Mail,
  Loader2,
  ArrowUp,
} from "lucide-react";
import heroImage from "@/assets/crops.jpg";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [cooldownEndsAt, setCooldownEndsAt] = useState<number | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [heroVisible, setHeroVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const heroRef = useRef<HTMLElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHeroVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    // Observe hero visibility to toggle the floating button
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollTop(!entry.isIntersecting);
      },
      { threshold: 0.4 }
    );
    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToHero = () => {
    const el = document.getElementById("hero");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNewsletterSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    // Basic spam protection: honeypot + 30s cooldown
    if (honeypot) {
      return; // silently ignore bots filling hidden field
    }
    const now = Date.now();
    if (cooldownEndsAt && now < cooldownEndsAt) {
      const seconds = Math.ceil((cooldownEndsAt - now) / 1000);
      toast({
        title: `Please wait ${seconds}s`,
        description: "You're sending too fast.",
        variant: "destructive",
      });
      return;
    }
    const email = newsletterEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    setNewsletterLoading(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email });
      if (error) throw error;
      toast({
        title: "Subscribed",
        description: "Thanks! We'll keep you updated.",
      });
      setNewsletterEmail("");
      setCooldownEndsAt(Date.now() + 30_000);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Subscription failed";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <section
        id="hero"
        ref={heroRef}
        className="relative overflow-hidden min-h-[70vh]"
      >
        {/* Background image from public folder with soft gradient overlay for text contrast */}
        <div
          className={`absolute inset-0 z-0 pointer-events-none bg-[url('/gradient-3.jpg')] bg-cover bg-center bg-no-repeat transition-transform duration-[2000ms] ease-out ${
            heroVisible ? "scale-100" : "scale-110"
          }`}
        />
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-background/80 via-background/30 to-transparent" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Mobile navbar */}
          <div className="flex items-center justify-between md:hidden mb-6">
            <div className="text-xl font-bold">
              <span className="text-primary">Farm</span>Smart
            </div>
            <button
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
              className="h-10 w-10 inline-flex items-center justify-center rounded-md bg-black/30 text-white backdrop-blur hover:bg-black/40 transition-colors"
            >
              <span className="sr-only">Open menu</span>
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect y="0" width="20" height="2" rx="1" fill="currentColor" />
                <rect y="6" width="20" height="2" rx="1" fill="currentColor" />
                <rect y="12" width="20" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className={`space-y-6 transition-all duration-700 ease-out ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 text-sm font-medium text-primary">
                <Sprout className="h-4 w-4" />
                Smart Farm Management
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight text-white drop-shadow-md">
                Grow Smarter with{" "}
                <span className="text-primary">FarmSmart</span>
              </h1>
              <p className="text-xl text-white/90 drop-shadow-md">
                Harness the power of AI and real-time weather data to optimize
                your farm operations. Make informed decisions about irrigation,
                plant health, and crop management.
              </p>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/auth")}
                  className="shadow-soft hover:shadow-hover transition-all"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/auth")}
                >
                  Sign In
                </Button>
              </div>
            </div>
            <div
              className={`relative transition-all duration-700 ease-out delay-150 ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              } group overflow-hidden rounded-3xl`}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="Modern smart farm"
                className="relative rounded-3xl shadow-hover w-full transform transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute right-0 top-0 h-full w-72 bg-background/95 backdrop-blur shadow-hover p-6 animate-in slide-in-from-right">
            <div className="flex items-center justify-between mb-8">
              <div className="text-lg font-semibold">
                <span className="text-primary">Farm</span>Smart
              </div>
              <button
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className="h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-muted"
              >
                <span className="sr-only">Close</span>×
              </button>
            </div>
            <nav className="space-y-6">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg hover:text-primary"
              >
                Home
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg hover:text-primary"
              >
                Features
              </a>
              <a
                href="#crops"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg hover:text-primary"
              >
                Popular Crops
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg hover:text-primary"
              >
                How It Works
              </a>
              <a
                href="#cta"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-lg hover:text-primary"
              >
                Ready to Transform?
              </a>
            </nav>
            <div className="mt-10 grid grid-cols-1 gap-3">
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/auth");
                }}
                className="w-full"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/auth");
                }}
                className="w-full"
              >
                Sign In
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToHero}
          aria-label="Back to top"
          className="fixed bottom-6 right-6 z-50 inline-flex h-10 w-10 items-center justify-center rounded-md bg-lime-500 text-foreground shadow-soft hover:shadow-hover transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Powerful Features for Modern Farmers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your farm efficiently and
              sustainably
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-hover transition-all hover:-translate-y-1">
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Cloud className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Real-Time Weather</h3>
              <p className="text-muted-foreground">
                Get accurate weather information for your location using PIN
                codes. Stay updated on temperature, humidity, and conditions.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-hover transition-all hover:-translate-y-1">
              <div className="bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Droplets className="h-7 w-7 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Smart Irrigation</h3>
              <p className="text-muted-foreground">
                AI-powered recommendations tell you exactly when to water your
                crops based on weather conditions and soil needs.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-hover transition-all hover:-translate-y-1">
              <div className="bg-accent/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Plant Advisor</h3>
              <p className="text-muted-foreground">
                Chat with our AI to get instant advice on plant diseases,
                treatments, and best farming practices tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Crop Gallery Section */}
      <section id="crops" className="py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold mb-3">Explore Popular Crops</h2>
              <p className="text-muted-foreground max-w-2xl">
                A visual guide to common crops. Tap into best practices and
                seasonal insights.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3 text-sm text-muted-foreground">
              <Leaf className="h-4 w-4" />
              Curated for your region
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[
              {
                name: "Wheat",
                img: "public/wheat.jpg",
              },
              {
                name: "Rice",
                img: "public/Rice.webp",
              },
              {
                name: "Corn",
                img: "public/Corn.webp",
              },
              {
                name: "Tomato",
                img: "public/tomato.jpeg",
              },
              {
                name: "Potato",
                img: "public/potatoes.webp",
              },
              {
                name: "Cotton",
                img: "public/Cotton.webp",
              },
              {
                name: "Sugarcane",
                img: "public/Sugarcane.webp",
              },
              {
                name: "Mustard",
                img: "public/Mustard.jpg",
              },
            ].map((crop) => (
              <div
                key={crop.name}
                className="group overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-hover transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={crop.img}
                    alt={crop.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                    <span className="text-white font-semibold text-lg drop-shadow">
                      {crop.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get actionable insights for your fields
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CheckCircle2 className="h-7 w-7" />,
                title: "Create your plot",
                desc: "Add your location and crops to personalize insights.",
              },
              {
                icon: <LineChart className="h-7 w-7" />,
                title: "Track and analyze",
                desc: "Monitor weather and irrigation needs in real-time.",
              },
              {
                icon: <ShieldCheck className="h-7 w-7" />,
                title: "Act confidently",
                desc: "Follow AI-backed advice to protect yield and save water.",
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-hover transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-primary/10 text-primary">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Band */}
      <section className="py-20 relative">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 via-secondary/10 to-background" />
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                label: "Farmers helped",
                value: "500+",
                icon: <Users className="h-5 w-5" />,
              },
              {
                label: "Water saved",
                value: "100 L",
                icon: <Droplets className="h-5 w-5" />,
              },
              {
                label: "Avg. yield boost",
                value: "18%",
                icon: <LineChart className="h-5 w-5" />,
              },
              {
                label: "Accuracy",
                value: "92%",
                icon: <Shield className="h-5 w-5" />,
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="relative rounded-2xl p-8 shadow-soft bg-white/60 dark:bg-card/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md border border-border/50 hover:shadow-hover hover:-translate-y-1 transition-all"
              >
                <div className="mx-auto mb-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className="text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(800px_400px_at_20%_10%,theme(colors.primary/10),transparent_60%)]" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(800px_400px_at_80%_90%,theme(colors.secondary/10),transparent_60%)]" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3">Loved by Farmers</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real stories from the fields using FarmSmart every day
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Ravi Kumar",
                quote:
                  "The irrigation tips saved me time and water. My crops look healthier than ever!",
                location: "Punjab",
              },
              {
                name: "Asha Devi",
                quote:
                  "Weather alerts are spot-on. I avoided a pest outbreak thanks to timely advice.",
                location: "Bihar",
              },
              {
                name: "Imran Khan",
                quote:
                  "Simple to use and powerful insights. Yield improved noticeably this season.",
                location: "Karnataka",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="relative rounded-2xl p-8 shadow-soft bg-white/70 dark:bg-card/70 border border-border/50 backdrop-blur supports-[backdrop-filter]:backdrop-blur-md hover:shadow-hover hover:-translate-y-1 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <div className="font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.location}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">“{t.quote}”</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 relative overflow-hidden">
        {/* Match hero background: image + gradient overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[url('/gradient.png')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 z-0 pointer-events-none bg-gradient-to-r from-background/80 via-background/30 to-transparent" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using FarmSmart to
            increase yields and reduce costs.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="shadow-soft hover:shadow-hover transition-all"
          >
            Start Free Today
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mt-10 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-secondary/10 via-background to-background" />
        <div className="container mx-auto px-4 py-14">
          <div className="grid md:grid-cols-4 gap-10">
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-2 text-2xl font-bold">
                <span className="text-primary">Farm</span>Smart
              </div>
              <p className="text-muted-foreground max-w-md">
                Smarter decisions for healthier crops. AI advice, weather
                insights, and tools that help you grow with confidence.
              </p>
              <div className="flex items-center gap-3 text-muted-foreground">
                <a
                  href="#"
                  aria-label="GitHub"
                  className="hover:text-primary transition-colors"
                >
                  <Github className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  aria-label="Email"
                  className="hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <div className="font-semibold mb-3">Product</div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#features" className="hover:text-foreground">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#crops" className="hover:text-foreground">
                    Popular Crops
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-foreground">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#cta" className="hover:text-foreground">
                    Ready to Transform?
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-semibold mb-3">Stay updated</div>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-2"
              >
                {/* Honeypot field for bots, hidden from users */}
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  aria-hidden="true"
                />
                <Input
                  placeholder="Your email"
                  className="bg-background"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  disabled={newsletterLoading}
                  type="email"
                  required
                />
                <Button type="submit" disabled={newsletterLoading}>
                  {newsletterLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Subscribing
                    </span>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-3">
            <span>
              © {new Date().getFullYear()} FarmSmart. All rights reserved.
            </span>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground">
                Terms
              </a>
              <a href="#" className="hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
