import { useSyncExternalStore } from "react";
import { palettes } from "../data/site";

export type ThemeMode = "light" | "dark" | "auto";

const THEME_KEY = "site:theme-mode";
const PALETTE_KEY = "site:palette";

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function prefersDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "auto";
  const stored = window.localStorage.getItem(THEME_KEY);
  return stored === "light" || stored === "dark" || stored === "auto" ? stored : "auto";
}

function readStoredPalette(): string {
  if (typeof window === "undefined") return palettes[0].id;
  const stored = window.localStorage.getItem(PALETTE_KEY);
  return palettes.some((palette) => palette.id === stored) ? (stored as string) : palettes[0].id;
}

let themeMode: ThemeMode = readStoredTheme();
let paletteId: string = readStoredPalette();

function isDark(mode: ThemeMode = themeMode) {
  return mode === "dark" || (mode === "auto" && prefersDark());
}

function paintTheme(mode: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const dark = isDark(mode);
  root.classList.toggle("dark", dark);
  root.dataset.themeMode = mode;
  root.style.colorScheme = dark ? "dark" : "light";
}

function paintPalette(id: string) {
  if (typeof document === "undefined") return;
  const palette = palettes.find((item) => item.id === id) ?? palettes[0];
  const root = document.documentElement;
  root.dataset.palette = palette.id;
  root.style.setProperty("--hue", String(palette.hue));
  root.style.setProperty("--brand", palette.primary);
}

export function initSettings() {
  paintTheme(themeMode);
  paintPalette(paletteId);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    if (themeMode === "auto") {
      paintTheme(themeMode);
      emit();
    }
  };
  media.addEventListener("change", onSystemChange);
  return () => media.removeEventListener("change", onSystemChange);
}

export function setThemeMode(mode: ThemeMode) {
  themeMode = mode;
  window.localStorage.setItem(THEME_KEY, mode);
  paintTheme(mode);
  emit();
}

export function setPalette(id: string) {
  paletteId = id;
  window.localStorage.setItem(PALETTE_KEY, id);
  paintPalette(id);
  emit();
}

export function useThemeMode(): ThemeMode {
  return useSyncExternalStore(subscribe, () => themeMode, () => "auto");
}

export function usePaletteId(): string {
  return useSyncExternalStore(subscribe, () => paletteId, () => palettes[0].id);
}

export function useIsDark(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => isDark(themeMode),
    () => false
  );
}

export function useResolvedTheme(): "light" | "dark" {
  return useIsDark() ? "dark" : "light";
}
