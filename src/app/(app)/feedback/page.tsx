"use client";

import { useState } from "react";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Loader2,
  CheckCircle,
  Bug,
  Lightbulb,
  Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FeedbackType = "bug" | "feature" | "general" | null;
type Rating = "positive" | "neutral" | "negative" | null;

const feedbackTypes = [
  {
    id: "bug" as const,
    icon: Bug,
    label: "Bug Report",
    description: "Something isn't working correctly",
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-900",
  },
  {
    id: "feature" as const,
    icon: Lightbulb,
    label: "Feature Request",
    description: "Suggest a new feature or improvement",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
    borderColor: "border-yellow-200 dark:border-yellow-900",
  },
  {
    id: "general" as const,
    icon: Heart,
    label: "General Feedback",
    description: "Share your thoughts or say thanks",
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-950",
    borderColor: "border-pink-200 dark:border-pink-900",
  },
];

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>(null);
  const [rating, setRating] = useState<Rating>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackType || !message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  const resetForm = () => {
    setFeedbackType(null);
    setRating(null);
    setMessage("");
    setSubmitted(false);
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Share Your Feedback</h1>
        <p className="text-muted-foreground">
          Help us make Critted better for everyone
        </p>
      </div>

      {submitted ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Thank You!</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Your feedback has been submitted. We read every piece of feedback and use it to improve Critted.
            </p>
            <Button onClick={resetForm}>Submit More Feedback</Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          {/* Feedback Type Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">What type of feedback?</CardTitle>
              <CardDescription>Select the category that best fits your feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-3">
                {feedbackTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFeedbackType(type.id)}
                      className={cn(
                        "p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50",
                        feedbackType === type.id
                          ? `${type.borderColor} ${type.bgColor}`
                          : "border-border"
                      )}
                    >
                      <Icon className={cn("h-6 w-6 mb-2", type.color)} />
                      <p className="font-medium text-sm">{type.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Rating (optional) */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">How&apos;s your experience?</CardTitle>
              <CardDescription>Rate your overall experience with Critted (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setRating("negative")}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all hover:border-red-300",
                    rating === "negative"
                      ? "border-red-500 bg-red-50 dark:bg-red-950"
                      : "border-border"
                  )}
                >
                  <ThumbsDown
                    className={cn(
                      "h-8 w-8",
                      rating === "negative" ? "text-red-500" : "text-muted-foreground"
                    )}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setRating("neutral")}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all hover:border-yellow-300",
                    rating === "neutral"
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
                      : "border-border"
                  )}
                >
                  <Meh
                    className={cn(
                      "h-8 w-8",
                      rating === "neutral" ? "text-yellow-500" : "text-muted-foreground"
                    )}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setRating("positive")}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all hover:border-green-300",
                    rating === "positive"
                      ? "border-green-500 bg-green-50 dark:bg-green-950"
                      : "border-border"
                  )}
                >
                  <ThumbsUp
                    className={cn(
                      "h-8 w-8",
                      rating === "positive" ? "text-green-500" : "text-muted-foreground"
                    )}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Message */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Tell us more</CardTitle>
              <CardDescription>
                {feedbackType === "bug"
                  ? "Describe the issue and steps to reproduce it"
                  : feedbackType === "feature"
                  ? "Describe the feature you'd like to see"
                  : "Share your thoughts with us"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="message" className="sr-only">
                  Your feedback
                </Label>
                <Textarea
                  id="message"
                  placeholder={
                    feedbackType === "bug"
                      ? "I encountered an issue when... The steps to reproduce are..."
                      : feedbackType === "feature"
                      ? "I would love to see a feature that..."
                      : "I wanted to share that..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {message.length}/1000 characters
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting || !feedbackType || !message}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Privacy Note */}
      <p className="text-xs text-center text-muted-foreground mt-8">
        Your feedback is anonymous unless you choose to include your email.
        We use this information to improve Critted.
      </p>
    </div>
  );
}
