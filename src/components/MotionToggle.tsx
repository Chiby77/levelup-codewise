import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const MotionToggle = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const storedPreference = localStorage.getItem("reducedMotion");
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const initialState =
      storedPreference !== null ? storedPreference === "true" : mediaQuery.matches;

    setPrefersReducedMotion(initialState);
    document.documentElement.classList.toggle("reduce-motion", initialState);

    const handleChange = () => {
      if (storedPreference === null) {
        setPrefersReducedMotion(mediaQuery.matches);
        document.documentElement.classList.toggle("reduce-motion", mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleToggle = (checked: boolean) => {
    setPrefersReducedMotion(checked);
    document.documentElement.classList.toggle("reduce-motion", checked);
    localStorage.setItem("reducedMotion", String(checked));
  };

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-background/70 text-foreground p-2 rounded-full backdrop-blur-md border border-border shadow-sm">
      <Label htmlFor="reduce-motion" className="text-xs">
        Reduce motion
      </Label>
      <Switch
        id="reduce-motion"
        checked={prefersReducedMotion}
        onCheckedChange={handleToggle}
      />
    </div>
  );
};

export default MotionToggle;
