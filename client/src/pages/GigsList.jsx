import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import api from '@/lib/api';
import { Search, DollarSign, MessageSquare, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function GigsList() {
  const [gigs, setGigs] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchGigs = async () => {
    try {
      const params = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await api.get(`/gigs${params}`);
      if (response.data.success) {
        setGigs(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load gigs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Browse Gigs</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find your next opportunity or post a gig to get started
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8 max-w-2xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search gigs by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </div>
        </form>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading gigs...</p>
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No gigs found</p>
            <Button asChild>
              <Link to="/gigs/create">Post a Gig</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {gigs.map((gig) => (
              <Card key={gig.id} className="hover:shadow-card transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-xl line-clamp-2">{gig.title}</CardTitle>
                    <Badge variant={gig.status === 'open' ? 'open' : 'assigned'}>
                      {gig.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-3">
                    {gig.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-primary">${gig.budget}</span>
                    <span className="text-muted-foreground">budget</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>{gig.bidsCount || 0} bids</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Posted by {gig.ownerName}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant="outline">
                    <Link to={`/gigs/${gig.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
