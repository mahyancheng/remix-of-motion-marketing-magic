import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, BarChart3 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const USERNAME_DOMAIN = 'client.local';

export default function ClientLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/client/dashboard');
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const u = username.trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '');
    if (u.length < 3) {
      setLoading(false);
      toast.error('Enter your username');
      return;
    }
    const email = `${u}@${USERNAME_DOMAIN}`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error('Invalid username or password');
      return;
    }
    navigate('/client/dashboard');
  };

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      {/* 在这里添加了 flex-col，确保元素垂直排列 */}
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-accent/10 p-3">
                <BarChart3 className="h-6 w-6 text-accent" />
              </div>
            </div>
            <CardTitle className="font-display text-2xl">Client Portal</CardTitle>
            <p className="text-sm text-muted-foreground">Sign in to view your performance</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label>Username</Label>
                <Input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your-username" 
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input 
                  type="password" 
                  autoComplete="current-password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              <Button type="submit" variant="accent" className="w-full" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sign in
              </Button>
              <p className="text-xs text-muted-foreground text-center">Access by invitation only. Contact your account manager.</p>
            </form>
          </CardContent>
        </Card>
        
        {/* 把 Back to home 移到了 Card 外面，并加了 mt-6 增加一些顶部间距 */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to home
          </button>
        </div>
        
      </div>
    </>
  );
}