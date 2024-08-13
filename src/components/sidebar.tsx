"use client";

import { cn } from "@/lib/utils";
import { Home, LogOut, Plus } from "lucide-react";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { ThemeSwitch } from "./theme-switch";
import { Button, ButtonLink } from "./ui/button";
import { useRef } from "react";
import axios from "axios";

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
  const input = useRef<HTMLInputElement>(null);

  if (!session?.user) return null;

  return (
    <nav className="flex h-screen w-20 flex-col items-center gap-3 border-r py-4">
      <SidebarLink href="/" icon={<Home size={24} />} />
      <Button
        onClick={() => {
          if (input.current) input.current.click();
        }}
        variant="outline"
        className="p-2"
      >
        <Plus size={24} />
      </Button>

      <ThemeSwitch className="mt-auto" />
      <SidebarLink href="/logout" icon={<LogOut size={24} />} />

      <input
        hidden
        type="file"
        ref={input}
        onChange={() => {
          if (input.current?.files) {
            const file = input.current.files[0];
            const formData = new FormData();
            formData.append("file", file);

            axios.postForm("/api/files", formData).then(() => {
              location.reload();
            });
          }
        }}
      />
    </nav>
  );
}
