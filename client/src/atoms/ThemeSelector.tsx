import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@nextui-org/react";
import { FaSun, FaMoon } from "react-icons/fa"; // Importamos los iconos desde react-icons

export const ThemeSelector = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Button isIconOnly onPress={() => setTheme(isDark ? "light" : "dark")}>
      {isDark ? <FaSun size={20} /> : <FaMoon size={20} />}
    </Button>
  );
};
