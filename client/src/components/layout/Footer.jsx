import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-hero">
                <Briefcase className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">GigFlow</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connect with top talent and find your next opportunity.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/gigs" className="hover:text-foreground transition-colors">Browse Gigs</Link></li>
              <li><Link to="/gigs/create" className="hover:text-foreground transition-colors">Post a Gig</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} GigFlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
