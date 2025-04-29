'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { joinWaitlist, getWaitlistStats } from '@/lib/waitlist-service';

export default function WaitlistPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinedWaitlist, setJoinedWaitlist] = useState(false);
  const [waitlistStats, setWaitlistStats] = useState<{
    position: number;
    referralCount: number;
    referralCode: string;
    totalEntries: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = joinWaitlist(name, email, referralCode);
      
      if (result.success && result.entry) {
        setJoinedWaitlist(true);
        const stats = getWaitlistStats(email);
        setWaitlistStats(stats);
        
        toast({
          title: "You're on the waitlist!",
          description: `Your position is #${result.entry.position}`,
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    if (!waitlistStats) return;
    
    const referralLink = `${window.location.origin}/waitlist?ref=${waitlistStats.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-[800px] mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
            Join Our Waitlist
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-[600px] mx-auto">
            Sign up for early access and move up the queue by referring friends.
          </p>
        </div>

        {!joinedWaitlist ? (
          <Card className="max-w-[500px] mx-auto shadow-lg">
            <CardHeader>
              <CardTitle>Get Early Access</CardTitle>
              <CardDescription>
                Join our waitlist and invite friends to move up in line
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="referralCode">Referral Code (Optional)</Label>
                  <Input 
                    id="referralCode" 
                    placeholder="Enter referral code" 
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Joining..." : "Join Waitlist"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        ) : (
          <Card className="max-w-[500px] mx-auto shadow-lg">
            <CardHeader>
              <CardTitle>You're on the waitlist!</CardTitle>
              <CardDescription>
                Share your referral link to move up in line
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-muted rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-2">Your current position</p>
                <p className="text-5xl font-bold text-primary">#{waitlistStats?.position}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  out of {waitlistStats?.totalEntries} people
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-center block mb-2">Your referral code</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={waitlistStats?.referralCode || ''} 
                      readOnly 
                      className="font-mono"
                    />
                    <Button 
                      variant="outline" 
                      onClick={copyReferralLink}
                      className="shrink-0"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    People you've referred
                  </p>
                  <p className="text-3xl font-bold">
                    {waitlistStats?.referralCount || 0}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <div className="text-center text-sm text-muted-foreground">
                <p>For each friend who joins using your referral code, you'll move up in the waitlist!</p>
              </div>
              <Button 
                onClick={copyReferralLink}
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700"
              >
                Share Your Referral Link
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
