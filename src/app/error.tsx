"use client";

import { useEffect } from "react";
import Link from "next/link";
import { TrendingUp, Home, RefreshCw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl mb-12">
        <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <span className="text-foreground">Critted</span>
      </Link>

      {/* Error Content */}
      <div className="text-center max-w-md">
        <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          We encountered an unexpected error. Our team has been notified and is working on a fix.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" onClick={() => reset()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>

        {/* Error Details (only show digest in production) */}
        {error.digest && (
          <p className="mt-6 text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>

      {/* Help Links */}
      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground mb-3">Still having issues?</p>
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <Link href="/help/contact" className="text-primary hover:underline">
            Contact Support
          </Link>
          <a
            href="https://status.critted.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            System Status
          </a>
        </div>
      </div>
    </div>
  );
}
