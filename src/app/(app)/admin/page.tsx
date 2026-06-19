"use client";

import {
  Shield,
  Activity,
  Database,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  HardDrive,
  Cpu,
  Users,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const jobs = [
  {
    name: "snapshot.sounds",
    schedule: "Every 6h",
    lastRun: "2026-06-12 14:30:00",
    status: "success",
    duration: "2m 34s",
    nextRun: "2026-06-12 20:30:00",
  },
  {
    name: "snapshot.products",
    schedule: "Every 12h",
    lastRun: "2026-06-12 12:00:00",
    status: "success",
    duration: "8m 12s",
    nextRun: "2026-06-13 00:00:00",
  },
  {
    name: "metrics.recompute",
    schedule: "Hourly",
    lastRun: "2026-06-12 15:00:00",
    status: "success",
    duration: "45s",
    nextRun: "2026-06-12 16:00:00",
  },
  {
    name: "alerts.evaluate",
    schedule: "Every 15m",
    lastRun: "2026-06-12 15:15:00",
    status: "warning",
    duration: "12s",
    nextRun: "2026-06-12 15:30:00",
  },
  {
    name: "predictions.score",
    schedule: "Daily",
    lastRun: "2026-06-12 00:00:00",
    status: "success",
    duration: "15m 42s",
    nextRun: "2026-06-13 00:00:00",
  },
];

const dataFreshness = [
  { locale: "US", sounds: "2 hours ago", products: "4 hours ago", status: "fresh" },
  { locale: "UK", sounds: "2 hours ago", products: "4 hours ago", status: "fresh" },
];

export default function AdminPage() {
  const getStatusIcon = (status: string) => {
    if (status === "success") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (status === "warning") return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    return <XCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === "success")
      return <Badge className="bg-green-500">Healthy</Badge>;
    if (status === "warning")
      return <Badge className="bg-yellow-500">Warning</Badge>;
    return <Badge className="bg-red-500">Error</Badge>;
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor system health, job status, and data freshness
          </p>
        </div>
        <Badge variant="outline" className="text-sm w-fit bg-red-500/10 text-red-600 border-red-500/30">
          Admin Only
        </Badge>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">System Status</p>
                <p className="text-xl font-bold text-green-500">Healthy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-xl font-bold">1,245</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Products Tracked</p>
                <p className="text-xl font-bold">89.4K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sounds Tracked</p>
                <p className="text-xl font-bold">12.8K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Usage */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Resource Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">CPU Usage</span>
                </div>
                <span className="text-sm font-medium">32%</span>
              </div>
              <Progress value={32} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Memory</span>
                </div>
                <span className="text-sm font-medium">58%</span>
              </div>
              <Progress value={58} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Database</span>
                </div>
                <span className="text-sm font-medium">24%</span>
              </div>
              <Progress value={24} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Freshness */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Data Freshness
          </CardTitle>
          <CardDescription>Last snapshot times per locale</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Locale</TableHead>
                <TableHead>Sounds</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dataFreshness.map((row) => (
                <TableRow key={row.locale}>
                  <TableCell className="font-medium">{row.locale}</TableCell>
                  <TableCell>{row.sounds}</TableCell>
                  <TableCell>{row.products}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-500">Fresh</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Job Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Background Jobs
            </CardTitle>
            <CardDescription>Status of scheduled snapshot and processing jobs</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.name}>
                    <TableCell className="font-mono text-sm">{job.name}</TableCell>
                    <TableCell>{job.schedule}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{job.lastRun}</TableCell>
                    <TableCell>{job.duration}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        <span className="capitalize">{job.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{job.nextRun}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        Run Now
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
