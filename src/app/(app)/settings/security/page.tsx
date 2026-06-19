"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Key,
  Smartphone,
  ArrowLeft,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Copy,
  QrCode,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export default function SecurityPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [is2FADialogOpen, setIs2FADialogOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

  // Mock backup codes
  const backupCodes = [
    "XXXX-XXXX-1234",
    "XXXX-XXXX-5678",
    "XXXX-XXXX-9012",
    "XXXX-XXXX-3456",
    "XXXX-XXXX-7890",
  ];

  // Password validation
  const hasMinLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;
  const isValidPassword = hasMinLength && hasUppercase && hasLowercase && hasNumber;

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPassword || !passwordsMatch || !currentPassword) return;

    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordChanged(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      // Reset after showing success
      setTimeout(() => setPasswordChanged(false), 3000);
    }, 1500);
  };

  const handleEnable2FA = () => {
    if (verificationCode.length !== 6) return;
    setIsVerifying2FA(true);
    setTimeout(() => {
      setIsVerifying2FA(false);
      setTwoFactorEnabled(true);
      setIs2FADialogOpen(false);
      setVerificationCode("");
    }, 1500);
  };

  const handleDisable2FA = () => {
    setTwoFactorEnabled(false);
  };

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
          Security Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Protect your account with strong security measures
        </p>
      </div>

      {/* Change Password */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle className="text-lg">Change Password</CardTitle>
          </div>
          <CardDescription>
            Update your password regularly to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          {passwordChanged ? (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
              <CheckCircle className="h-5 w-5" />
              <span>Password changed successfully!</span>
            </div>
          ) : (
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Password requirements */}
              {newPassword && (
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`flex items-center gap-2 ${hasMinLength ? "text-green-600" : "text-muted-foreground"}`}>
                      <CheckCircle className={`h-4 w-4 ${hasMinLength ? "opacity-100" : "opacity-30"}`} />
                      <span>8+ characters</span>
                    </div>
                    <div className={`flex items-center gap-2 ${hasUppercase ? "text-green-600" : "text-muted-foreground"}`}>
                      <CheckCircle className={`h-4 w-4 ${hasUppercase ? "opacity-100" : "opacity-30"}`} />
                      <span>Uppercase</span>
                    </div>
                    <div className={`flex items-center gap-2 ${hasLowercase ? "text-green-600" : "text-muted-foreground"}`}>
                      <CheckCircle className={`h-4 w-4 ${hasLowercase ? "opacity-100" : "opacity-30"}`} />
                      <span>Lowercase</span>
                    </div>
                    <div className={`flex items-center gap-2 ${hasNumber ? "text-green-600" : "text-muted-foreground"}`}>
                      <CheckCircle className={`h-4 w-4 ${hasNumber ? "opacity-100" : "opacity-30"}`} />
                      <span>Number</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPassword && !passwordsMatch && (
                  <p className="text-sm text-red-500">Passwords do not match</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isChangingPassword || !isValidPassword || !passwordsMatch || !currentPassword}
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Changing...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
            </div>
            {twoFactorEnabled && (
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                Enabled
              </Badge>
            )}
          </div>
          <CardDescription>
            Add an extra layer of security to your account using an authenticator app
          </CardDescription>
        </CardHeader>
        <CardContent>
          {twoFactorEnabled ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-950">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    Two-factor authentication is enabled
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your account is protected with an authenticator app
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="font-medium mb-2">Backup Codes</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Use these codes if you lose access to your authenticator app
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {backupCodes.map((code) => (
                    <code
                      key={code}
                      className="px-2 py-1 rounded bg-muted font-mono text-sm"
                    >
                      {code}
                    </code>
                  ))}
                </div>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Codes
                </Button>
              </div>

              <Separator />

              <AlertDialog>
                <AlertDialogTrigger
                  render={<Button variant="outline" className="text-red-600 hover:text-red-700" />}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Disable 2FA
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disable two-factor authentication?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will make your account less secure. You can always re-enable it later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDisable2FA}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Disable 2FA
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-200">
                    Two-factor authentication is not enabled
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">
                    Enable 2FA to add an extra layer of security
                  </p>
                </div>
              </div>

              <Dialog open={is2FADialogOpen} onOpenChange={setIs2FADialogOpen}>
                <DialogTrigger render={<Button />}>
                  <Smartphone className="h-4 w-4 mr-2" />
                  Enable Two-Factor Authentication
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Set up two-factor authentication</DialogTitle>
                    <DialogDescription>
                      Scan the QR code with your authenticator app
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* QR Code Placeholder */}
                    <div className="flex justify-center">
                      <div className="h-48 w-48 rounded-lg bg-muted flex items-center justify-center">
                        <QrCode className="h-24 w-24 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                      <p>Or enter this code manually:</p>
                      <code className="text-lg font-mono mt-1 block">XXXX-XXXX-XXXX-XXXX</code>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="verificationCode">Enter verification code</Label>
                      <Input
                        id="verificationCode"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="text-center text-lg tracking-widest"
                        maxLength={6}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleEnable2FA}
                      disabled={verificationCode.length !== 6 || isVerifying2FA}
                      className="w-full"
                    >
                      {isVerifying2FA ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Enable"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions Link */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Active Sessions</h3>
              <p className="text-sm text-muted-foreground">
                View and manage devices where you&apos;re signed in
              </p>
            </div>
            <Link href="/settings/sessions">
              <Button variant="outline">View Sessions</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
