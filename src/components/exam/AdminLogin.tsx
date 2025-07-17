import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (pin === '5026') {
      toast.success('Authentication successful!');
      onLogin();
    } else {
      toast.error('Invalid PIN. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Portal Selection
        </Button>

        <Card className="shadow-xl border-2">
          <CardHeader className="text-center pb-4">
            <div className="bg-secondary/10 p-4 rounded-full w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-secondary" />
            </div>
            <CardTitle className="text-2xl">Admin Authentication</CardTitle>
            <p className="text-muted-foreground">Enter your PIN to access the admin panel</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pin">Admin PIN</Label>
                <Input
                  id="pin"
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  maxLength={4}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={loading || pin.length !== 4}
              >
                {loading ? 'Authenticating...' : 'Access Admin Panel'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                CS Experts Zimbabwe Digital Examination System
                <br />
                Powered by Intellix Inc
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};