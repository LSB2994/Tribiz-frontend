"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Chrome, Github } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: authLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Handle the token from social login redirect
      localStorage.setItem("token", token);
      setSuccess("Social login successful! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    }

    if (searchParams.get("registered")) {
      setSuccess("Registration successful! Please login with your new account.");
    }
    if (searchParams.get("error") === "unauthorized") {
      setError("You must be logged in as an administrator to access the admin panel.");
    }
  }, [searchParams, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result = await signIn("credentials", {
        email: values.username, // Map username to email for NextAuth
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Login failed. Please check your credentials.");
      } else if (result?.ok) {
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }


  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Call the backend to get the social login URL
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/social/google`);
      const data = await response.json();
      if (data.authUrl) {
         // The backend returns a relative URL like /oauth2/authorization/google
         // We need the full URL: BACKEND_BASE + authUrl
         const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');
         window.location.href = `${backendBase}${data.authUrl}`;
      }
    } catch (error) {
      setError("Google login failed.");
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/social/github`);
      const data = await response.json();
      if (data.authUrl) {
         const backendBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api', '');
         window.location.href = `${backendBase}${data.authUrl}`;
      }
    } catch (error) {
      setError("GitHub login failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-8rem)] py-8">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-bold text-center">Login</CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success && (
            <Alert className="mb-6 bg-green-50 text-green-700 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-12 gap-2" 
                onClick={handleGoogleLogin}
                type="button"
                disabled={isLoading}
              >
                <Chrome className="h-5 w-5" />
                Google
              </Button>
              
              <Button 
                variant="outline" 
                className="h-12 gap-2" 
                onClick={handleGitHubLogin}
                type="button"
                disabled={isLoading}
              >
                <Github className="h-5 w-5" />
                GitHub
              </Button>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username / Email</FormLabel>
                      <FormControl>
                        <Input placeholder="johndoe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link 
                          href="/forgot-password" 
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input placeholder="******" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full text-lg h-12 mt-4" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t py-4">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
