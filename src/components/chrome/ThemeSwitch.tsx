import { useCallback, useRef } from "react";
import { Icon } from "./Icon";
import { setThemeMode, useThemeMode, type ThemeMode } from "../../lib/settings";

const choices: { id: ThemeMode; label: string; icon: "sun" | "moon" | "auto" }[] = [
  { id: "light", label: "亮色", icon: "sun" },
  { id: "dark", label: "暗色", icon: "moon" },
  { id: "auto", label: "跟随系统", icon: "auto" },
];

export function ThemeSwitch() {
  const mode = useThemeMode();
  const current = choices.find((choice) => choice.id === mode) ?? choices[2];
  const panelRef = useRef<HTMLDivElement>(null);

  /** 悬停展开面板、移出收起（参考站用 mouseenter / mouseleave 控制）。 */
  const setPanelOpen = useCallback((open: boolean) => {
    panelRef.current?.classList.toggle("float-panel-closed", !open);
  }, []);

  const cycle = () => {
    const order: ThemeMode[] = ["light", "dark", "auto"];
    const next = order[(order.indexOf(mode) + 1) % order.length];
    setThemeMode(next);
  };

  return (
    <div
      className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[9999] pointer-events-auto"
      onMouseEnter={() => setPanelOpen(true)}
      onMouseLeave={() => setPanelOpen(false)}
    >
      <div className="relative z-50 flex items-center justify-center" role="menu" tabIndex={-1}>
        <button
          type="button"
          role="menuitem"
          aria-label={`Light/Dark Mode: ${current.label}`}
          onClick={cycle}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 bg-white/35 dark:bg-black/45 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg active:scale-95 text-[var(--primary)]"
        >
          <Icon name={current.icon} className="text-[1.5rem]" />
        </button>

        <div
          ref={panelRef}
          className="absolute transition float-panel-closed bottom-full left-0 mb-3 hidden lg:block"
        >
          <div className="card-base p-2 bg-white/35 dark:bg-black/45 backdrop-blur-2xl shadow-xl border border-white/40 dark:border-white/10 rounded-2xl">
            {choices.map((choice) => (
              <button
                key={choice.id}
                type="button"
                role="menuitemradio"
                aria-checked={mode === choice.id}
                data-theme-choice={choice.id}
                onClick={() => setThemeMode(choice.id)}
                className={`theme-choice flex transition whitespace-nowrap items-center justify-start! w-full btn-plain scale-animation rounded-lg h-9 px-3 font-medium active:scale-95 ${
                  mode === choice.id ? "text-[var(--primary)]" : ""
                }`}
              >
                <Icon name={choice.icon} className="mr-2 text-[1.1rem]" />
                {choice.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
