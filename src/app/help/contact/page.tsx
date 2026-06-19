"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ArrowLeft,
  MessageCircle,
  Mail,
  Clock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PublicNavbar } from "@/components/public-navbar";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !category || !subject || !message) return;

    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PublicNavbar />

      <div className="flex-1 py-12">
        <div className="container px-4 mx-auto max-w-3xl">
          {/* Back Link */}
          <Link
            href="/help"
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Help Center
          </Link>

          {submitted ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-3">Message Sent!</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Thank you for reaching out. We&apos;ve received your message and will respond within 24 hours.
                </p>
                <p className="text-sm text-muted-foreground mb-8">
                  Ticket ID: <strong>#TF-{Date.now().toString().slice(-6)}</strong>
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/help">
                    <Button variant="outline">Back to Help Center</Button>
                  </Link>
                  <Button onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Contact Support</h1>
                <p className="text-muted-foreground">
                  Fill out the form below and we&apos;ll get back to you as soon as possible
                </p>
              </div>

              {/* Response Time Notice */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 mb-8">
                <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
                <div className="text-sm">
                  <p className="font-medium">Average response time: 4-6 hours</p>
                  <p className="text-muted-foreground">
                    Pro subscribers get priority support with faster response times
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Please provide as much detail as possible so we can help you effectively
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={(value) => value && setCategory(value)} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="billing">Billing & Subscription</SelectItem>
                            <SelectItem value="feature">Feature Request</SelectItem>
                            <SelectItem value="account">Account Help</SelectItem>
                            <SelectItem value="feedback">General Feedback</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          placeholder="Brief description of your issue"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your issue or question in detail..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Include any relevant details like error messages, screenshots, or steps to reproduce the issue.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                      <Link href="/help">
                        <Button type="button" variant="outline" className="w-full sm:w-auto">
                          Cancel
                        </Button>
                      </Link>
                      <Button
                        type="submit"
                        disabled={isSubmitting || !name || !email || !category || !subject || !message}
                        className="w-full sm:w-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Alternative Contact */}
              <div className="mt-8 text-center text-sm text-muted-foreground">
                <p>
                  Prefer email? Reach us directly at{" "}
                  <a href="mailto:support@critted.com" className="text-primary hover:underline">
                    support@critted.com
                  </a>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold">Critted</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 Critted. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
