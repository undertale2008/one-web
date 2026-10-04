/**
 * Fixed background: soft base + three blurred colour blobs.
 * Ported from the reference site's palette layer, re-keyed to the cool accent.
 */
export function BackgroundLayer() {
  return (
    <div className="k-on-palette-bg fixed inset-0 z-[-1] overflow-hidden transition-colors duration-500">
      <div className="palette-blob palette-blob--sakura absolute -top-[10%] -left-[10%] w-[55%] h-[55%] rounded-full blur-[90px] pointer-events-none transition-colors duration-500" />
      <div className="palette-blob palette-blob--azusa absolute -bottom-[10%] -right-[10%] w-[65%] h-[65%] rounded-full blur-[110px] pointer-events-none transition-colors duration-500" />
      <div className="palette-blob palette-blob--mio absolute top-[35%] right-[15%] w-[35%] h-[35%] rounded-full blur-[80px] pointer-events-none transition-colors duration-500" />
    </div>
  );
}
