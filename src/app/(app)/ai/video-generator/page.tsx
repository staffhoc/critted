"use client";

import { useState } from "react";
import {
  Video,
  Wand2,
  Upload,
  FileText,
  Image as ImageIcon,
  Music,
  Sparkles,
  Play,
  Download,
  RefreshCw,
  Clock,
  Zap,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const recentVideos = [
  {
    id: "v1",
    title: "Viral Skincare Product Demo",
    thumbnail: "https://picsum.photos/seed/video1/300/500",
    duration: "0:32",
    createdAt: "2 hours ago",
    status: "completed",
  },
  {
    id: "v2",
    title: "LED Lights Unboxing",
    thumbnail: "https://picsum.photos/seed/video2/300/500",
    duration: "0:45",
    createdAt: "Yesterday",
    status: "completed",
  },
  {
    id: "v3",
    title: "Kitchen Gadget Review",
    thumbnail: "https://picsum.photos/seed/video3/300/500",
    duration: "0:28",
    createdAt: "2 days ago",
    status: "completed",
  },
];

const trendingSounds = [
  { id: "s1", name: "Original Sound - That Trend", uses: "2.3M" },
  { id: "s2", name: "Chill Lo-Fi Beat", uses: "890K" },
  { id: "s3", name: "Upbeat Product Demo", uses: "1.2M" },
];

export default function VideoGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleGenerate = () => {
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Video className="h-8 w-8 text-primary" />
            AI Video Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            Create viral TikTok videos with AI-powered generation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Sparkles className="h-3 w-3 mr-1" />
            10 Credits Left
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Generator */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Create New Video
              </CardTitle>
              <CardDescription>
                Describe your video or upload product images to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="prompt">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="prompt">
                    <FileText className="h-4 w-4 mr-2" />
                    Prompt
                  </TabsTrigger>
                  <TabsTrigger value="product">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Product
                  </TabsTrigger>
                  <TabsTrigger value="template">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Template
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="prompt" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label>Video Description</Label>
                    <Textarea
                      placeholder="Describe your video... e.g., 'Create a 30-second product demo for a skincare serum, showing application steps with trending transitions and upbeat music'"
                      className="min-h-32"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Video Style</Label>
                      <Select defaultValue="product-demo">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="product-demo">Product Demo</SelectItem>
                          <SelectItem value="unboxing">Unboxing</SelectItem>
                          <SelectItem value="review">Review</SelectItem>
                          <SelectItem value="tutorial">Tutorial</SelectItem>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">60 seconds</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="product" className="space-y-4 mt-4">
                  <div className="border-2 border-dashed rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium mb-1">Drop product images here</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or click to browse (PNG, JPG up to 10MB)
                    </p>
                    <Button variant="outline">Choose Files</Button>
                  </div>
                </TabsContent>

                <TabsContent value="template" className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {["Before/After", "Unboxing Reveal", "3-Step Tutorial", "Quick Review", "Lifestyle Shot", "Comparison"].map((template) => (
                      <Card key={template} className="cursor-pointer hover:border-primary transition-colors">
                        <CardContent className="p-4 text-center">
                          <div className="aspect-[9/16] bg-muted rounded-lg mb-2 flex items-center justify-center">
                            <Video className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-sm font-medium">{template}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Sound Selection */}
              <div className="space-y-2">
                <Label>Background Sound</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a trending sound..." />
                  </SelectTrigger>
                  <SelectContent>
                    {trendingSounds.map((sound) => (
                      <SelectItem key={sound.id} value={sound.id}>
                        <div className="flex items-center justify-between w-full">
                          <span className="flex items-center gap-2">
                            <Music className="h-4 w-4" />
                            {sound.name}
                          </span>
                          <Badge variant="secondary" className="ml-2">
                            {sound.uses} uses
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generate Button */}
              {isGenerating ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Generating video...</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    This may take a minute. Don&apos;t close this page.
                  </p>
                </div>
              ) : (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleGenerate}
                  disabled={!prompt}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate Video
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {[
                  "Use trending sounds for better reach",
                  "Keep videos under 30s for higher completion",
                  "Include a hook in the first 3 seconds",
                  "Add text overlays for silent viewers",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recent Videos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Videos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentVideos.map((video) => (
                <div
                  key={video.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                >
                  <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{video.title}</p>
                    <p className="text-xs text-muted-foreground">{video.createdAt}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm">
                View All Videos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
