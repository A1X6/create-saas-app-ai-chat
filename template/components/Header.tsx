"use client";

import { useState } from "react";
import Link from "next/link";
import { GalleryVerticalEnd, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOutAction } from "@/lib/actions/auth-actions";

interface HeaderProps {
  isLoggedIn?: boolean;
}

export default function Header({ isLoggedIn = false }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const navLinks = [{ label: "Home", href: "/" }];

  const handleLogout = async () => {
    await signOutAction();
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <GalleryVerticalEnd className="h-6 w-6" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <Button asChild variant="ghost">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <Link href="/" className="flex items-center gap-2">
                  <GalleryVerticalEnd className="h-6 w-6" />
                  <span className="text-lg font-semibold">App</span>
                </Link>
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                </SheetHeader>
              </div>
              <div className="flex flex-col gap-4 mt-2">
                {/* Mobile Nav Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-muted-foreground/10">
                  {isLoggedIn ? (
                    <>
                      <Button asChild variant="ghost">
                        <Link href="/dashboard" onClick={() => setOpen(false)}>
                          Dashboard
                        </Link>
                      </Button>
                      <Button onClick={handleLogout}>Logout</Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="ghost">
                        <Link
                          href="/auth/sign-in"
                          onClick={() => setOpen(false)}
                        >
                          Sign In
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link
                          href="/auth/sign-up"
                          onClick={() => setOpen(false)}
                        >
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
                {/* show theme toggle again inside mobile actions area for convenience */}
                <div className="md:hidden mt-4">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
