import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Briefcase, Users, DollarSign, Shield, Zap, Globe } from 'lucide-react';

export default function Landing() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.15),transparent)]" />
        
        <div className="container relative mx-auto px-4 py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm backdrop-blur-sm animate-fade-in">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">The future of freelancing is here</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl animate-slide-up">
              Find Talent.
              <br />
              <span className="text-gradient">Get Hired.</span>
            </h1>
            
            <p className="mb-10 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              GigFlow connects skilled freelancers with clients who value quality. 
              Post jobs, submit bids, and build something great together.
            </p>
            
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/register">
                  Start for Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/gigs">Browse Gigs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border/50 bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: '10K+', label: 'Active Freelancers' },
              { value: '5K+', label: 'Jobs Posted' },
              { value: '$2M+', label: 'Total Paid Out' },
              { value: '98%', label: 'Success Rate' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-3xl font-bold text-gradient md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-muted-foreground text-lg">
              From posting jobs to managing payments, we've got you covered.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Briefcase,
                title: 'Post Jobs Easily',
                description: 'Create detailed job postings in minutes. Set your budget and let the bids come to you.',
              },
              {
                icon: Users,
                title: 'Find Top Talent',
                description: 'Browse qualified freelancers and review their proposals to find the perfect match.',
              },
              {
                icon: DollarSign,
                title: 'Competitive Bidding',
                description: 'Receive multiple bids and choose the best value for your project needs.',
              },
              {
                icon: Shield,
                title: 'Secure Payments',
                description: 'Our escrow system protects both clients and freelancers throughout the project.',
              },
              {
                icon: Zap,
                title: 'Instant Hiring',
                description: 'Accept a bid with one click. Start working together immediately.',
              },
              {
                icon: Globe,
                title: 'Global Reach',
                description: 'Connect with talent and opportunities from around the world.',
              },
            ].map((feature, index) => (
              <Card key={index} className="group border-border/50 bg-card shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
              How GigFlow Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Post or Browse',
                description: 'Post a job with your requirements or browse open gigs that match your skills.',
              },
              {
                step: '02',
                title: 'Bid & Connect',
                description: 'Submit competitive bids or review proposals from qualified freelancers.',
              },
              {
                step: '03',
                title: 'Hire & Deliver',
                description: 'Accept the best bid, start working, and deliver exceptional results.',
              },
            ].map((item, index) => (
              <div key={index} className="relative text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-hero text-primary-foreground text-xl font-bold shadow-glow">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold text-xl">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl gradient-hero p-12 md:p-16 text-center shadow-glow">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(0_0%_100%/0.1),transparent)]" />
            
            <div className="relative">
              <h2 className="text-3xl font-bold text-primary-foreground md:text-4xl mb-4">
                Ready to get started?
              </h2>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Join thousands of freelancers and clients already using GigFlow to build amazing projects.
              </p>
              <Button 
                size="xl" 
                className="bg-background text-foreground hover:bg-background/90 shadow-elevated"
                asChild
              >
                <Link to="/register">
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
