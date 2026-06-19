import Link from "next/link";
import { TrendingUp, Wrench, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 p-4">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 font-bold text-2xl mb-12">
        <div className="h-10 w-10 rounded-lg bg-black flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-white" />
        </div>
        <span className="text-foreground">Critted</span>
      </Link>

      {/* Maintenance Content */}
      <div className="text-center max-w-lg">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Wrench className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          Under Maintenance
        </h1>
        <p className="text-lg text-muted-foreground mb-4">
          We&apos;re performing scheduled maintenance to improve your experience.
        </p>
        <p className="text-muted-foreground mb-8">
          We apologize for the inconvenience. Our team is working hard to bring Critted back online as soon as possible.
        </p>

        {/* Estimated Time */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-8">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            Estimated completion: <strong>2:00 PM UTC</strong>
          </span>
        </div>

        {/* Status Updates */}
        <div className="space-y-4 max-w-sm mx-auto">
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-medium mb-2">Get notified when we&apos;re back</h3>
            <p className="text-sm text-muted-foreground mb-3">
              We&apos;ll send you an email when maintenance is complete.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-md border bg-background text-sm"
              />
              <Button size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Notify Me
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>
              Follow{" "}
              <a
                href="https://twitter.com/critted"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @critted
              </a>{" "}
              for real-time updates
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          Questions?{" "}
          <a href="mailto:support@critted.com" className="text-primary hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
