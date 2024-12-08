'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Github, Mail } from 'lucide-react';
import Link from 'next/link';
import { toast } from '@/components/ui/use-toast';

export function AuthForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
      }

      if (data) {
        router.refresh();
      }
    } catch (error) {
      console.error(`Error during ${provider} OAuth sign-in:`, error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-2xl overflow-hidden bg-card">
        <CardHeader className="text-center bg-[#FF6C37] text-white py-10 px-6">
          <div className="flex justify-center mb-6">
            <svg width="64" height="64" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M37.793 10.793c-3.906-3.906-10.236-3.906-14.142 0l-13.06 13.06c-3.905 3.906-3.905 10.236 0 14.142 3.906 3.905 10.236 3.905 14.142 0l13.06-13.06c3.905-3.906 3.905-10.236 0-14.142z" fill="#fff" />
              <path d="M24 36c6.627 0 12-5.373 12-12S30.627 12 24 12 12 17.373 12 24s5.373 12 12 12z" fill="#FF6C37" />
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold mb-2">Welcome to NextInBox</CardTitle>
          <CardDescription className="text-white/90 text-lg">Sign in to continue</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4 w-full">
            <Button
              onClick={() => handleOAuthSignIn('github')}
              disabled={loading}
              variant="outline"
              className="w-full py-6 text-lg font-semibold border-2 border-gray-200 hover:bg-gray-50 hover:border-[#FF6C37] focus:ring-2 focus:ring-[#FF6C37] transition-all duration-300 ease-in-out"
            >
              <Github className="mr-2 h-5 w-5" />
              Sign in with GitHub
            </Button>
            <Button
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
              variant="outline"
              className="w-full py-6 text-lg font-semibold border-2 border-gray-200 hover:bg-gray-50 hover:border-[#FF6C37] focus:ring-2 focus:ring-[#FF6C37] transition-all duration-300 ease-in-out"
            >
              <Mail className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>
          </div>
        </CardContent>
        <CardFooter className="bg-muted py-6 px-8 text-center">
          <p className="text-sm text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-[#FF6C37] hover:underline font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#FF6C37] hover:underline font-medium">
              Privacy Policy
            </Link>
            <br /><br />
            <Link href="/" className="text-[#FF6C37] hover:underline font-medium">
              Home
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}