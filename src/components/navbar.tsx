"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import {
  TrendingUp,
  Music,
  Package,
  LayoutGrid,
  Users,
  Store,
  Video,
  Sparkles,
  Bookmark,
  Bell,
  Settings,
  CreditCard,
  Shield,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  Wand2,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type UserData = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  userType: "CREATOR" | "SELLER";
  locale: "US" | "UK" | "ID" | "MY" | "TH" | "VN" | "PH" | "NG" | "KE" | "DE" | "CA" | "UG";
};

const mainNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/sounds", label: "Sounds", icon: Music },
  { href: "/products", label: "Products", icon: Package },
];

const discoverNavItems = [
  { href: "/categories", label: "Categories", icon: LayoutGrid },
  { href: "/creators", label: "Creators", icon: Users },
  { href: "/shops", label: "Shops", icon: Store },
  { href: "/videos", label: "Videos", icon: Video },
  { href: "/predictions", label: "Predictions", icon: Sparkles },
];

const aiNavItems = [
  { href: "/ai/video-generator", label: "Video Generator", icon: Video },
  { href: "/strategy", label: "Strategy Builder", icon: Brain },
  { href: "/ai/affiliate", label: "Affiliate Program", icon: Users },
];

const userNavItems = [
  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
  { href: "/alerts", label: "Alerts", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/billing", label: "Billing", icon: CreditCard },
];

const locales = [
  { code: "US", label: "United States", flag: "\u{1F1FA}\u{1F1F8}" },
  { code: "UK", label: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}" },
  { code: "ID", label: "Indonesia", flag: "\u{1F1EE}\u{1F1E9}" },
  { code: "MY", label: "Malaysia", flag: "\u{1F1F2}\u{1F1FE}" },
  { code: "TH", label: "Thailand", flag: "\u{1F1F9}\u{1F1ED}" },
  { code: "VN", label: "Vietnam", flag: "\u{1F1FB}\u{1F1F3}" },
  { code: "PH", label: "Philippines", flag: "\u{1F1F5}\u{1F1ED}" },
  { code: "NG", label: "Nigeria", flag: "\u{1F1F3}\u{1F1EC}" },
  { code: "KE", label: "Kenya", flag: "\u{1F1F0}\u{1F1EA}" },
  { code: "DE", label: "Germany", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "CA", label: "Canada", flag: "\u{1F1E8}\u{1F1E6}" },
  { code: "UG", label: "Uganda", flag: "\u{1F1FA}\u{1F1EC}" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [currentLocale, setCurrentLocale] = useState("US");

  useEffect(() => {
    fetch("/api/user")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && !data.error) {
          setUser(data);
          setCurrentLocale(data.locale || "US");
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const handleLocaleChange = async (code: string) => {
    setCurrentLocale(code);
    if (user) {
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale: code }),
      });
    }
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email[0].toUpperCase();
  };

  const NavLink = ({
    href,
    label,
    icon: Icon,
    mobile = false,
  }: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    mobile?: boolean;
  }) => (
    <Link
      href={href}
      onClick={() => mobile && setMobileOpen(false)}
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive(href)
          ? "bg-[#fe2c55] text-white"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );

  const selectedLocale = locales.find((l) => l.code === currentLocale);
  const displayName = user?.name || user?.email?.split("@")[0] || "User";
  const displayEmail = user?.email || "";
  const initials = user ? getInitials(user.name, user.email) : "U";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="hidden sm:inline text-foreground">Critted</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {mainNavItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}

          {/* Discover Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                discoverNavItems.some((item) => isActive(item.href))
                  ? "bg-[#fe2c55] text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Sparkles className="h-4 w-4" />
              Discover
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {discoverNavItems.map((item) => (
                <DropdownMenuItem key={item.href} className="p-0">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer w-full px-2 py-1.5",
                      isActive(item.href) && "text-[#fe2c55] font-medium"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* AI Features Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                aiNavItems.some((item) => isActive(item.href))
                  ? "bg-[#fe2c55] text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Wand2 className="h-4 w-4" />
              AI Tools
              <ChevronDown className="h-3 w-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {aiNavItems.map((item) => (
                <DropdownMenuItem key={item.href} className="p-0">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 cursor-pointer w-full px-2 py-1.5",
                      isActive(item.href) && "text-[#fe2c55] font-medium"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Locale Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger className="hidden md:flex items-center gap-1.5 px-2 py-1.5 rounded-lg border hover:bg-muted transition-colors text-sm">
              <span>{selectedLocale?.flag}</span>
              <span className="hidden lg:inline">{selectedLocale?.code}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {locales.map((locale) => (
                <DropdownMenuItem
                  key={locale.code}
                  onClick={() => handleLocaleChange(locale.code)}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer",
                    currentLocale === locale.code && "bg-muted"
                  )}
                >
                  <span>{locale.flag}</span>
                  <span>{locale.label}</span>
                  {currentLocale === locale.code && (
                    <span className="ml-auto text-[#fe2c55]">&#10003;</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Nav Items - Desktop */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/watchlist">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors",
                  isActive("/watchlist")
                    ? "bg-[#fe2c55] text-white hover:bg-[#fe2c55]/90"
                    : "hover:bg-muted"
                )}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/alerts">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors",
                  isActive("/alerts")
                    ? "bg-[#fe2c55] text-white hover:bg-[#fe2c55]/90"
                    : "hover:bg-muted"
                )}
              >
                <Bell className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-9 w-9 rounded-full focus:outline-none ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.image || undefined} alt={displayName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.image || undefined} alt={displayName} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{displayName}</span>
                  <span className="text-xs text-muted-foreground">{displayEmail}</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="p-0">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 cursor-pointer w-full px-2 py-1.5"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/settings"
                  className="flex items-center gap-2 cursor-pointer w-full px-2 py-1.5"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/billing"
                  className="flex items-center gap-2 cursor-pointer w-full px-2 py-1.5"
                >
                  <CreditCard className="h-4 w-4" />
                  Billing
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 cursor-pointer w-full px-2 py-1.5"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="flex items-center gap-2 cursor-pointer text-[#fe2c55] px-2 py-1.5"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted transition-colors">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                  <span className="font-bold text-lg">Menu</span>
                  <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Mobile Locale Selector */}
                <div className="p-4 border-b">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                    Market
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center justify-between w-full px-3 py-2 rounded-lg border hover:bg-muted transition-colors text-sm">
                      <div className="flex items-center gap-2">
                        <span>{selectedLocale?.flag}</span>
                        <span>{selectedLocale?.label}</span>
                      </div>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      {locales.map((locale) => (
                        <DropdownMenuItem
                          key={locale.code}
                          onClick={() => handleLocaleChange(locale.code)}
                          className={cn(
                            "flex items-center gap-2 cursor-pointer",
                            currentLocale === locale.code && "bg-muted"
                          )}
                        >
                          <span>{locale.flag}</span>
                          <span>{locale.label}</span>
                          {currentLocale === locale.code && (
                            <span className="ml-auto text-[#fe2c55]">&#10003;</span>
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-6">
                  {/* Main */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Main
                    </h3>
                    {mainNavItems.map((item) => (
                      <NavLink key={item.href} {...item} mobile />
                    ))}
                  </div>

                  {/* Discover */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Discover
                    </h3>
                    {discoverNavItems.map((item) => (
                      <NavLink key={item.href} {...item} mobile />
                    ))}
                  </div>

                  {/* AI Tools */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      AI Tools
                    </h3>
                    {aiNavItems.map((item) => (
                      <NavLink key={item.href} {...item} mobile />
                    ))}
                  </div>

                  {/* Account */}
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Account
                    </h3>
                    {userNavItems.map((item) => (
                      <NavLink key={item.href} {...item} mobile />
                    ))}
                  </div>
                </nav>

                <div className="p-4 border-t">
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-[#fe2c55] hover:bg-red-50 rounded-lg w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
