import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';
import { DollarSign, MessageSquare, Briefcase, Plus } from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [myGigs, setMyGigs] = useState([]);
  const [myBids, setMyBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      const [gigsRes, bidsRes] = await Promise.all([
        api.get('/gigs/my-gigs'),
        api.get('/bids/my-bids'),
      ]);

      if (gigsRes.data.success) {
        setMyGigs(gigsRes.data.data);
      }
      if (bidsRes.data.success) {
        setMyBids(bidsRes.data.data);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Manage your gigs and bids from here.
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Gigs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myGigs.length}</div>
              <p className="text-xs text-muted-foreground">Total gigs posted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Bids</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{myBids.length}</div>
              <p className="text-xs text-muted-foreground">Total bids submitted</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hired</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {myBids.filter(b => b.status === 'hired').length}
              </div>
              <p className="text-xs text-muted-foreground">Successful bids</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="gigs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="gigs">My Gigs</TabsTrigger>
            <TabsTrigger value="bids">My Bids</TabsTrigger>
          </TabsList>

          <TabsContent value="gigs" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Your Posted Gigs</h2>
              <Button asChild>
                <Link to="/gigs/create">
                  <Plus className="h-4 w-4" />
                  Post New Gig
                </Link>
              </Button>
            </div>

            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : myGigs.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">You haven't posted any gigs yet</p>
                  <Button asChild>
                    <Link to="/gigs/create">Post Your First Gig</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {myGigs.map((gig) => (
                  <Card key={gig.id} className="hover:shadow-card transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="line-clamp-2">{gig.title}</CardTitle>
                        <Badge variant={gig.status === 'open' ? 'open' : 'assigned'}>
                          {gig.status}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {gig.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Budget:</span>
                        <span className="font-semibold text-primary">${gig.budget}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Bids:</span>
                        <span className="font-semibold">{gig.bidsCount || 0}</span>
                      </div>
                      <Button asChild variant="outline" className="w-full">
                        <Link to={`/gigs/${gig.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="bids" className="space-y-4">
            <h2 className="text-2xl font-semibold mb-4">Your Submitted Bids</h2>

            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : myBids.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">You haven't submitted any bids yet</p>
                  <Button asChild>
                    <Link to="/gigs">Browse Available Gigs</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myBids.map((bid) => (
                  <Card key={bid.id} className={bid.status === 'hired' ? 'border-success' : ''}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <CardTitle className="mb-1">{bid.gigTitle}</CardTitle>
                          <CardDescription>
                            {bid.gigStatus === 'open' ? 'Open for bidding' : 'Project assigned'}
                          </CardDescription>
                        </div>
                        <Badge variant={bid.status}>{bid.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Your Bid:</span>
                        <span className="text-lg font-bold text-primary">${bid.price}</span>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Your Proposal:</p>
                        <p className="text-sm line-clamp-2">{bid.message}</p>
                      </div>
                      <Button asChild variant="outline" className="w-full">
                        <Link to={`/gigs/${bid.gigId}`}>View Gig Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
