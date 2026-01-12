import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl text-muted-foreground mb-8">Page Not Found</p>
        <Button asChild>
          <Link to="/">
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </Layout>
  );
}
