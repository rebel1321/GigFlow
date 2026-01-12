import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function CreateGig() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/gigs', {
        title,
        description,
        budget: parseFloat(budget),
      });

      if (response.data.success) {
        toast.success('Gig created successfully!');
        navigate(`/gigs/${response.data.data.id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create gig');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Post a Gig</h1>
            <p className="text-muted-foreground">
              Share your project details and receive competitive bids
            </p>
          </div>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Gig Details</CardTitle>
              <CardDescription>
                Provide clear information to attract the best freelancers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Build a React Dashboard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    maxLength={100}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project requirements, scope, and expectations..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={8}
                    maxLength={2000}
                  />
                  <p className="text-xs text-muted-foreground">
                    {description.length}/2000 characters
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget (USD) *</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="1000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                    min="1"
                    step="0.01"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter your maximum budget for this project
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/gigs')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Post Gig'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
