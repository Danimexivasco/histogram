import { useState, useEffect } from "react";
import { SunMedium, Moon, Laptop } from "lucide-react";
import Cookies from "js-cookie";
import { cn } from "@/lib/utils";

type Theme = "light" | "dark" | "system";

type ThemeSwitchProps = {
  className?: string;
};

export default function ThemeSwitch({ className }: ThemeSwitchProps) {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      setTheme("system");
      applyTheme("system");
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (newTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      Cookies.set("theme", systemTheme);
      root.classList.add(systemTheme);
    } else {
      Cookies.set("theme", newTheme);
      root.classList.add(newTheme);
    }

    localStorage.setItem("theme", newTheme);
  };

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const selectedClassNames = "bg-red-100 text-red-600";
  const selectedDarkClassNames = "bg-red-100 text-red-600 dark:bg-gray-700 dark:text-red-400";
  const unselectedClassNames = "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300";

  return theme && (
    <div className={cn("bg-white dark:bg-gray-800 rounded-full p-1 flex shadow-md w-fit", className)}>
      <button
        onClick={() => toggleTheme("light")}
        className={`p-2 rounded-full ${
          theme === "light"
            ? selectedClassNames
            : unselectedClassNames
        }`}
        aria-label="Light mode"
        title="Switch to light mode"
      >
        <SunMedium size={20} />
      </button>

      <button
        onClick={() => toggleTheme("dark")}
        className={`p-2 rounded-full ${
          theme === "dark"
            ? selectedDarkClassNames
            : unselectedClassNames
        }`}
        aria-label="Dark mode"
        title="Switch to dark mode"
      >
        <Moon size={20} />
      </button>

      <button
        onClick={() => toggleTheme("system")}
        className={`p-2 rounded-full ${
          theme === "system"
            ? selectedDarkClassNames
            : unselectedClassNames
        }`}
        aria-label="System preference"
        title="Switch to system preference"
      >
        <Laptop size={20} />
      </button>
    </div>
  );
}