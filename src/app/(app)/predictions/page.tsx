"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  Calendar,
  Target,
  Package,
  Music,
  ChevronRight,
  Zap,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Prediction = {
  id: string;
  itemType: "PRODUCT" | "SOUND";
  itemId: string;
  itemName: string;
  itemImage: string | null;
  confidenceScore: number;
  predictedPeakDate: string;
  predictedPeakValue: number;
  currentValue: number;
  accelerationScore: number;
  signals: string[];
  potentialGrowth: number;
  daysUntilPeak: number;
};

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchPredictions = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (activeTab !== "all") {
          params.set("itemType", activeTab.toUpperCase());
        }
        params.set("minConfidence", "50");
        params.set("limit", "50");

        const res = await fetch(`/api/predictions?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setPredictions(data.predictions || []);
          setTotal(data.total || 0);
        }
      } catch (error) {
        console.error("Failed to fetch predictions:", error);
      }
      setIsLoading(false);
    };

    fetchPredictions();
  }, [activeTab]);

  const productPredictions = predictions.filter((p) => p.itemType === "PRODUCT");
  const soundPredictions = predictions.filter((p) => p.itemType === "SOUND");

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Before Saturation
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered predictions of products and sounds about to break out
          </p>
        </div>
        <Badge variant="outline" className="text-sm w-fit">
          {total} predictions
        </Badge>
      </div>

      {/* Info Banner */}
      <Card className="mb-8 border-2 border-dashed border-muted-foreground/30 bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-muted-foreground/20 flex items-center justify-center shrink-0">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">How Predictions Work</h3>
              <p className="text-muted-foreground text-sm mb-3">
                Our AI analyzes velocity patterns, acceleration curves, and cross-platform signals
                to identify items in the 48-72 hour pre-peak window. Higher confidence scores
                indicate stronger signals.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  Confidence Score
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  Acceleration Pattern
                </Badge>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Peak Estimate
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Predictions Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Predictions</TabsTrigger>
          <TabsTrigger value="product">Products</TabsTrigger>
          <TabsTrigger value="sound">Sounds</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : predictions.length === 0 ? (
          <Card className="p-12 text-center">
            <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No predictions available</h3>
            <p className="text-muted-foreground">
              Predictions will appear after the AI analyzes enough data patterns.
            </p>
          </Card>
        ) : (
          <>
            <TabsContent value="all" className="space-y-6">
              {predictions.map((prediction) => (
                <PredictionCard key={prediction.id} prediction={prediction} />
              ))}
            </TabsContent>

            <TabsContent value="product" className="space-y-6">
              {productPredictions.length === 0 ? (
                <Card className="p-12 text-center">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No product predictions available.</p>
                </Card>
              ) : (
                productPredictions.map((prediction) => (
                  <PredictionCard key={prediction.id} prediction={prediction} />
                ))
              )}
            </TabsContent>

            <TabsContent value="sound" className="space-y-6">
              {soundPredictions.length === 0 ? (
                <Card className="p-12 text-center">
                  <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No sound predictions available.</p>
                </Card>
              ) : (
                soundPredictions.map((prediction) => (
                  <PredictionCard key={prediction.id} prediction={prediction} />
                ))
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}

function PredictionCard({ prediction }: { prediction: Prediction }) {
  const getConfidenceColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <Card className="hover:border-muted-foreground/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left - Item Info */}
          <div className="flex items-start gap-4 lg:w-1/3">
            <Avatar className="h-16 w-16 rounded-xl">
              <AvatarImage src={prediction.itemImage || undefined} alt={prediction.itemName} />
              <AvatarFallback>
                {prediction.itemType === "PRODUCT" ? (
                  <Package className="h-8 w-8" />
                ) : (
                  <Music className="h-8 w-8" />
                )}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <Badge variant="outline" className="mb-2">
                {prediction.itemType === "PRODUCT" ? (
                  <Package className="h-3 w-3 mr-1" />
                ) : (
                  <Music className="h-3 w-3 mr-1" />
                )}
                {prediction.itemType}
              </Badge>
              <h3 className="font-semibold truncate">{prediction.itemName}</h3>
              <Link
                href={prediction.itemType === "PRODUCT" ? `/products/${prediction.itemId}` : `/sounds/${prediction.itemId}`}
                className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-1"
              >
                View Details
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Middle - Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:flex-1">
            <div className="text-center p-3 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Confidence</p>
              <p className={`text-2xl font-bold ${getConfidenceColor(prediction.confidenceScore)}`}>
                {prediction.confidenceScore}%
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Peak Est.</p>
              <p className="text-lg font-semibold">
                {new Date(prediction.predictedPeakDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground mb-1">Current</p>
              <p className="text-lg font-semibold">
                {prediction.currentValue.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-500/10">
              <p className="text-sm text-muted-foreground mb-1">Peak Est.</p>
              <p className="text-lg font-semibold text-green-600">
                {prediction.predictedPeakValue.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Right - Acceleration & Signals */}
          <div className="lg:w-1/4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Acceleration Score</span>
                <span className="font-semibold">{prediction.accelerationScore}</span>
              </div>
              <Progress value={prediction.accelerationScore} className="h-2" />
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">Key Signals</p>
              <div className="flex flex-wrap gap-1">
                {prediction.signals.map((signal, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {signal}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
