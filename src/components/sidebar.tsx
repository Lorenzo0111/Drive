"use client";

import { cn } from "@/lib/utils";
import { Home, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "./utils/theme-switch";
import { ButtonLink } from "./ui/button";
import type { Session } from "better-auth/types";

export function SidebarLink({
  href,
  icon,
  className,
}: {
  href: string;
  icon: React.ReactNode;
  className?: string;
}) {
  const path = usePathname();

  return (
    <ButtonLink
      variant={
        (href === "/" ? path === "/" : path.startsWith(href))
          ? "secondary"
          : "outline"
      }
      className={cn("p-2", className)}
      href={href}
    >
      {icon}
    </ButtonLink>
  );
}

export function Sidebar({ session }: { session: Session | null }) {
  if (!session) return null;

  return (
    <nav
      suppressHydrationWarning
      className="flex h-screen w-20 flex-col items-center gap-3 border-r py-4"
    >
      <SidebarLink href="/" icon={<Home size={24} />} />

      <ThemeSwitch className="mt-auto" />
      <SidebarLink href="/logout" icon={<LogOut size={24} />} />
    </nav>
  );
}
