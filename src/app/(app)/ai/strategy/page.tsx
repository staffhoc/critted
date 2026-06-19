"use client";

import { useState } from "react";
import {
  Wand2,
  MessageSquare,
  Send,
  Lightbulb,
  TrendingUp,
  Target,
  Calendar,
  BarChart3,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  User,
  Bot,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const suggestedPrompts = [
  {
    icon: TrendingUp,
    title: "Content Strategy",
    prompt: "What content should I create this week based on trending topics?",
  },
  {
    icon: Target,
    title: "Product Selection",
    prompt: "Which products should I promote based on my niche and commission rates?",
  },
  {
    icon: Calendar,
    title: "Posting Schedule",
    prompt: "What's the optimal posting schedule for maximum engagement?",
  },
  {
    icon: BarChart3,
    title: "Performance Analysis",
    prompt: "Analyze my content performance and suggest improvements",
  },
];

type Message = {
  role: "assistant" | "user";
  content: string;
};

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "Hi! I'm your Critted Strategy Assistant. I can help you with content planning, product selection, trend analysis, and optimizing your TikTok Shop strategy. What would you like to work on today?",
  },
];

export default function StrategyPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text?: string) => {
    const message = text || input;
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: getAIResponse(message),
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (query: string): string => {
    if (query.toLowerCase().includes("content")) {
      return "Based on current trends, I recommend focusing on these content themes this week:\n\n1. **Skincare Routines** - Morning routine videos are seeing 2.5x higher engagement\n2. **Kitchen Gadget Reviews** - The air fryer niche is exploding with 45% growth\n3. **Unboxing Content** - Use the trending 'reveal' sound for maximum reach\n\nWould you like me to generate specific video ideas for any of these themes?";
    }
    if (query.toLowerCase().includes("product")) {
      return "Looking at your niche and current trends, here are the top products to promote:\n\n1. **LED Strip Lights** - 15% commission, high conversion rate\n2. **Portable Blender** - 12% commission, trending in fitness content\n3. **Phone Ring Light** - 18% commission, perfect for creator audience\n\nThese products have strong GMV growth and work well with your content style.";
    }
    if (query.toLowerCase().includes("schedule") || query.toLowerCase().includes("posting")) {
      return "Based on your audience analytics, here's your optimal posting schedule:\n\n**Best Times to Post:**\n- Monday-Friday: 7-9 AM, 12-2 PM, 7-9 PM\n- Weekends: 10 AM-12 PM, 6-8 PM\n\n**Recommended Frequency:** 2-3 videos per day\n\nConsistency is key! Would you like me to create a content calendar for the next week?";
    }
    return "I can help you with that! To give you the best strategy advice, I'll analyze your account performance, current trends, and competitor data. What specific aspect would you like me to focus on?";
  };

  return (
    <div className="container px-4 py-8 mx-auto max-w-5xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Wand2 className="h-8 w-8 text-primary" />
            Strategy Assistant
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights to grow your TikTok Shop business
          </p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary w-fit">
          <Sparkles className="h-3 w-3 mr-1" />
          Powered by AI
        </Badge>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <Card className="lg:col-span-3 flex flex-col h-[600px]">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">Critted AI</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Online and ready to help
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3",
                  message.role === "user" && "flex-row-reverse"
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback
                    className={cn(
                      message.role === "assistant"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    {message.role === "assistant" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "rounded-lg px-4 py-3 max-w-[80%]",
                    message.role === "assistant"
                      ? "bg-muted"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/50">
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-3 bg-muted">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          {/* Input */}
          <div className="border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <Input
                placeholder="Ask about strategy, trends, products..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>

        {/* Sidebar - Suggested Prompts */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Quick Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedPrompts.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(item.prompt)}
                  className="w-full p-3 rounded-lg border hover:border-primary hover:bg-muted transition-colors text-left group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <item.icon className="h-4 w-4 text-primary" />
                    <span className="font-medium text-sm">{item.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {item.prompt}
                  </p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-auto mt-1" />
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">
                What I can help with
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Content strategy & planning
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Product recommendations
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Trend analysis
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Performance insights
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Competitor research
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
