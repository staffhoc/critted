"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Clock,
  MapPin,
  LogOut,
  Shield,
  ArrowLeft,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Session {
  id: string;
  device: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  location: string;
  ip: string;
  lastActive: string;
  isCurrent: boolean;
}

const mockSessions: Session[] = [
  {
    id: "sess-1",
    device: "MacBook Pro",
    deviceType: "desktop",
    browser: "Chrome 121",
    location: "New York, US",
    ip: "192.168.1.xxx",
    lastActive: "Now",
    isCurrent: true,
  },
  {
    id: "sess-2",
    device: "iPhone 15 Pro",
    deviceType: "mobile",
    browser: "Safari",
    location: "New York, US",
    ip: "192.168.1.xxx",
    lastActive: "2 hours ago",
    isCurrent: false,
  },
  {
    id: "sess-3",
    device: "iPad Air",
    deviceType: "tablet",
    browser: "Safari",
    location: "Boston, US",
    ip: "10.0.0.xxx",
    lastActive: "3 days ago",
    isCurrent: false,
  },
  {
    id: "sess-4",
    device: "Windows PC",
    deviceType: "desktop",
    browser: "Firefox 122",
    location: "Chicago, US",
    ip: "172.16.0.xxx",
    lastActive: "1 week ago",
    isCurrent: false,
  },
];

function getDeviceIcon(type: Session["deviceType"]) {
  switch (type) {
    case "desktop":
      return Monitor;
    case "mobile":
      return Smartphone;
    case "tablet":
      return Tablet;
    default:
      return Monitor;
  }
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState(mockSessions);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const [isRevokingAll, setIsRevokingAll] = useState(false);

  const handleRevokeSession = (sessionId: string) => {
    setIsRevoking(sessionId);
    // Simulate revoking
    setTimeout(() => {
      setSessions(sessions.filter((s) => s.id !== sessionId));
      setIsRevoking(null);
    }, 1000);
  };

  const handleRevokeAllOther = () => {
    setIsRevokingAll(true);
    // Simulate revoking all
    setTimeout(() => {
      setSessions(sessions.filter((s) => s.isCurrent));
      setIsRevokingAll(false);
    }, 1500);
  };

  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <div className="container px-4 py-8 mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/settings"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Link>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Active Sessions
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage devices where you&apos;re signed in to Critted
        </p>
      </div>

      {/* Security Notice */}
      <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">
                Security Tip
              </p>
              <p className="text-yellow-700 dark:text-yellow-300">
                If you see any devices you don&apos;t recognize, sign them out immediately and change your password.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Session */}
      <Card className="mb-6 border-2 border-green-200 dark:border-green-900">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Current Session</CardTitle>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              Active Now
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {sessions
            .filter((s) => s.isCurrent)
            .map((session) => {
              const DeviceIcon = getDeviceIcon(session.deviceType);
              return (
                <div key={session.id} className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <DeviceIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{session.device}</p>
                    <p className="text-sm text-muted-foreground">{session.browser}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {session.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {session.ip}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>

      {/* Other Sessions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg">Other Sessions</CardTitle>
              <CardDescription>
                {otherSessions.length} other device{otherSessions.length !== 1 ? "s" : ""} signed in
              </CardDescription>
            </div>
            {otherSessions.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger
                  render={<Button variant="outline" className="text-red-600 hover:text-red-700" />}
                >
                  {isRevokingAll ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <LogOut className="h-4 w-4 mr-2" />
                  )}
                  Sign Out All Others
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sign out all other devices?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will sign out all devices except your current one. You&apos;ll need to sign in again on those devices.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRevokeAllOther}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Sign Out All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {otherSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No other active sessions</p>
              <p className="text-sm">You&apos;re only signed in on this device</p>
            </div>
          ) : (
            <div className="space-y-4">
              {otherSessions.map((session) => {
                const DeviceIcon = getDeviceIcon(session.deviceType);
                return (
                  <div
                    key={session.id}
                    className="flex items-start gap-4 p-4 rounded-lg border"
                  >
                    <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                      <DeviceIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{session.device}</p>
                      <p className="text-sm text-muted-foreground">{session.browser}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" />
                          {session.ip}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.lastActive}
                        </span>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            disabled={isRevoking === session.id}
                          />
                        }
                      >
                        {isRevoking === session.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Sign out this device?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will sign out {session.device} ({session.browser}). You&apos;ll need to sign in again on that device.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRevokeSession(session.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Sign Out
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
