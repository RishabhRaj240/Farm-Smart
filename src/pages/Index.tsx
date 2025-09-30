import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Cloud, Droplets, Sparkles, Sprout, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-farm.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 text-sm font-medium text-primary">
                <Sprout className="h-4 w-4" />
                Smart Farm Management
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Grow Smarter with{" "}
                <span className="text-primary">FarmSmart</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Harness the power of AI and real-time weather data to optimize your farm operations. 
                Make informed decisions about irrigation, plant health, and crop management.
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
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
              <img
                src={heroImage}
                alt="Modern smart farm"
                className="relative rounded-3xl shadow-hover w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Modern Farmers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your farm efficiently and sustainably
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-hover transition-all hover:-translate-y-1">
              <div className="bg-primary/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Cloud className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Real-Time Weather</h3>
              <p className="text-muted-foreground">
                Get accurate weather information for your location using PIN codes. 
                Stay updated on temperature, humidity, and conditions.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-hover transition-all hover:-translate-y-1">
              <div className="bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Droplets className="h-7 w-7 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Smart Irrigation</h3>
              <p className="text-muted-foreground">
                AI-powered recommendations tell you exactly when to water your crops 
                based on weather conditions and soil needs.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-soft hover:shadow-hover transition-all hover:-translate-y-1">
              <div className="bg-accent/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-3">AI Plant Advisor</h3>
              <p className="text-muted-foreground">
                Chat with our AI to get instant advice on plant diseases, treatments, 
                and best farming practices tailored to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Farm?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using FarmSmart to increase yields 
            and reduce costs.
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
    </div>
  );
};

export default Index;
