"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MenuIcon } from "lucide-react";

import logo from "@/app/images/logo.png";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const navLinks = [
  { href: "/jobs", label: "Browse Jobs" },
  { href: "/company", label: "Company" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 w-full px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <div className="mx-auto flex h-11 max-w-6xl items-center justify-between rounded-xl border border-white/[0.08] bg-[#1a1a1e]/90 py-2.5 pr-2.5 pl-4 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-md sm:h-12">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image
            src={logo}
            alt="HireLoop"
            width={150}
            height={38}
            priority
            className="h-7 w-auto sm:h-8 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 md:flex lg:gap-6">
          <nav className="flex items-center gap-4 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[11px] font-medium text-neutral-300 transition-colors hover:text-white lg:text-xs"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Separator
            orientation="vertical"
            className="h-4 bg-white/20"
          />

          <Link
            href="/sign-in"
            className="text-[11px] font-medium text-[#786fff] transition-colors hover:text-[#a39dff] lg:text-xs"
          >
            Sign In
          </Link>

          <Link
            href="/sign-up"
            className="inline-flex h-8 items-center justify-center rounded-lg bg-[#5c53fe] px-3.5 text-[11px] font-medium text-white shadow-[0_0_15px_rgba(92,83,254,0.3)] transition-all hover:bg-[#6c63ff] lg:text-xs"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Navigation Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            render={
              <button
                type="button"
                aria-label="Open navigation menu"
                className="flex size-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
              />
            }
          >
            <MenuIcon className="size-5" />
          </SheetTrigger>

          <SheetContent
            side="right"
            className="border-white/10 bg-[#111113] text-white z-[9999]"
          >
            <SheetHeader>
              <SheetTitle className="text-left text-white">
                HireLoop Menu
              </SheetTitle>
            </SheetHeader>

            <nav className="mt-6 flex flex-col gap-2 px-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm text-neutral-300 transition-colors hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}

              <Separator className="my-2 bg-white/10" />

              <Link
                href="/sign-in"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-[#827aff] transition-colors hover:bg-white/10"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center rounded-lg bg-[#5c53fe] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#6c63ff]"
              >
                Get Started
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}