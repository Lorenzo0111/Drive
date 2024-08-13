"use client";

import { cn } from "@/lib/utils";
import { Laptop, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export function ThemeSwitch({ className }: { className?: string }) {
  const [theme, setTheme] = useState(
    (typeof window !== "undefined" && localStorage.getItem("theme")) ||
      "system",
  );

  useEffect(() => {
    if (theme === "system") {
      const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.body.classList.add(dark ? "dark" : "light");
    }

    if (theme === "dark") document.body.classList.add("dark");
  }, [theme]);

  const toggleTheme = () => {
    const themes = ["system", "light", "dark"];
    const current = themes.indexOf(theme);
    const next = themes[(current + 1) % themes.length];

    document.body.classList.remove("dark");

    setTheme(next);

    localStorage.setItem("theme", next);

    if (next === "dark") document.body.classList.add("dark");
  };

  return (
    <Button
      variant={"outline"}
      className={cn("p-2", className)}
      onClick={toggleTheme}
    >
      {theme === "system" ? <Laptop /> : theme === "light" ? <Sun /> : <Moon />}
    </Button>
  );
}
