import { Icon } from "./Icon";
import { palettes } from "../../data/site";
import { setPalette, usePaletteId } from "../../lib/settings";

/** Palette picker. Default theme keeps the locked #66ccff accent. */
export function DisplaySettings({ open }: { open: boolean }) {
  const active = usePaletteId();

  return (
    <div
      id="display-setting"
      className={`float-panel absolute transition-all w-[22rem] max-w-[calc(100vw-2rem)] right-4 px-4 py-4 pointer-events-auto ${
        open ? "" : "float-panel-closed"
      }`}
      role="dialog"
      aria-label="配色主题"
      aria-hidden={!open}
    >
      <div className="flex items-center gap-2 mb-3 ml-1 text-[var(--text-strong)]">
        <Icon name="palette" className="text-xl text-[var(--primary)]" />
        <div>
          <div className="font-bold text-base">配色主题</div>
          <div className="text-xs text-[var(--text-muted)] font-normal mt-0.5">
            选择一套完整的站点配色
          </div>
        </div>
      </div>

      <div className="grid gap-2" role="radiogroup" aria-label="配色主题">
        {palettes.map((palette) => {
          const selected = palette.id === active;
          return (
            <button
              key={palette.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`使用${palette.label}主题`}
              onClick={() => setPalette(palette.id)}
              className={`palette-option ${selected ? "active" : ""}`}
              style={{ ["--palette-accent" as string]: palette.colors[1] }}
            >
              <span className="palette-emblem" aria-hidden="true">
                <Icon name={palette.id === "mist" ? "sparkle" : "palette"} className="w-[1.35rem] h-[1.35rem]" />
                <span className="palette-swatches">
                  {palette.colors.map((color) => (
                    <span key={color} className="palette-swatch" style={{ background: color }} />
                  ))}
                </span>
              </span>
              <span className="min-w-0 flex-1 text-left">
                <span className="block text-sm font-bold text-[var(--text-strong)]">{palette.label}</span>
                <span className="block text-xs text-[var(--text-muted)] mt-0.5">
                  {palette.description}
                </span>
              </span>
              <span aria-hidden="true" className={`palette-check ${selected ? "visible" : ""}`}>
                <Icon name="heart" className="text-lg" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
