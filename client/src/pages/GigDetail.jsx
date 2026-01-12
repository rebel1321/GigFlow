import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';
import { DollarSign, User, Calendar, MessageSquare } from 'lucide-react';

export default function GigDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [gig, setGig] = useState(null);
  const [bids, setBids] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  
  // Bid form state
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGigDetails();
  }, [id]);

  useEffect(() => {
    if (gig && user) {
      setIsOwner(gig.ownerId === user.id);
      if (gig.ownerId === user.id) {
        fetchBids();
      }
    }
  }, [gig, user]);

  const fetchGigDetails = async () => {
    try {
      const response = await api.get(`/gigs/${id}`);
      if (response.data.success) {
        setGig(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load gig details');
      navigate('/gigs');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBids = async () => {
    try {
      const response = await api.get(`/bids/${id}`);
      if (response.data.success) {
        setBids(response.data.data);
      }
    } catch (error) {
      console.error('Failed to load bids:', error);
    }
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to submit a bid');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post('/bids', {
        gigId: id,
        message,
        price: parseFloat(price),
      });

      if (response.data.success) {
        toast.success('Bid submitted successfully!');
        setMessage('');
        setPrice('');
        fetchGigDetails();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit bid');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHire = async (bidId) => {
    if (!confirm('Are you sure you want to hire this freelancer? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.patch(`/bids/${bidId}/hire`);
      if (response.data.success) {
        toast.success('Freelancer hired successfully!');
        fetchGigDetails();
        fetchBids();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to hire freelancer');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading gig details...</p>
        </div>
      </Layout>
    );
  }

  if (!gig) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Gig Details */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{gig.title}</CardTitle>
                  <CardDescription className="text-base">
                    Posted by {gig.ownerName}
                  </CardDescription>
                </div>
                <Badge variant={gig.status === 'open' ? 'open' : 'assigned'} className="text-sm px-3 py-1">
                  {gig.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{gig.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-semibold text-lg text-primary">${gig.budget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Bids</p>
                    <p className="font-semibold">{gig.bidsCount || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Posted</p>
                    <p className="font-semibold">{new Date(gig.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Bid Form (for non-owners, open gigs) */}
          {isAuthenticated && !isOwner && gig.status === 'open' && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Submit Your Bid</CardTitle>
                <CardDescription>
                  Propose your price and explain why you're the best fit
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitBid} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bid-price">Your Bid Price (USD) *</Label>
                    <Input
                      id="bid-price"
                      type="number"
                      placeholder="Enter your bid amount"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                      min="1"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bid-message">Proposal Message *</Label>
                    <Textarea
                      id="bid-message"
                      placeholder="Explain your approach, experience, and why you're the best choice..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      rows={6}
                      maxLength={1000}
                    />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Bid'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {/* View Bids (for owners) */}
          {isOwner && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Received Bids ({bids.length})</CardTitle>
                <CardDescription>
                  Review proposals and hire the best freelancer
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bids.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No bids received yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {bids.map((bid) => (
                      <Card key={bid.id} className={bid.status === 'hired' ? 'border-success' : ''}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="font-semibold">{bid.freelancerName}</span>
                                <Badge variant={bid.status}>{bid.status}</Badge>
                              </div>
                              <p className="text-2xl font-bold text-primary mb-2">${bid.price}</p>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{bid.message}</p>
                            </div>
                          </div>
                          {bid.status === 'pending' && gig.status === 'open' && (
                            <Button
                              onClick={() => handleHire(bid.id)}
                              variant="success"
                              className="w-full"
                            >
                              Hire This Freelancer
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Login prompt for non-authenticated users */}
          {!isAuthenticated && gig.status === 'open' && (
            <Card className="shadow-card text-center">
              <CardContent className="py-12">
                <p className="text-muted-foreground mb-4">
                  Please sign in to submit a bid on this gig
                </p>
                <Button asChild variant="hero">
                  <a href="/login">Sign In</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
