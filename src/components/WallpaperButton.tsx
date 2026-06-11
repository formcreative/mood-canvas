import type { Emotion } from "../data/emotions";

interface WallpaperButtonProps {
  emotion: Emotion;
}

const WALLPAPER_WIDTH = 1290;
const WALLPAPER_HEIGHT = 2796;

function hexToRgba(hex: string, alpha: number) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized.length === 3 ? normalized.replace(/(.)/g, "$1$1") : normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

export function WallpaperButton({ emotion }: WallpaperButtonProps) {
  function saveWallpaper() {
    const canvas = document.createElement("canvas");
    canvas.width = WALLPAPER_WIDTH;
    canvas.height = WALLPAPER_HEIGHT;

    const context = canvas.getContext("2d");
    if (!context) return;

    const gradient = context.createLinearGradient(0, 0, WALLPAPER_WIDTH, WALLPAPER_HEIGHT);
    emotion.gradient.forEach((color, index) => {
      gradient.addColorStop(index / (emotion.gradient.length - 1), color);
    });

    context.fillStyle = gradient;
    context.fillRect(0, 0, WALLPAPER_WIDTH, WALLPAPER_HEIGHT);

    const glow = context.createRadialGradient(645, 1020, 80, 645, 1020, 820);
    glow.addColorStop(0, hexToRgba(emotion.accentColor, 0.54));
    glow.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, WALLPAPER_WIDTH, WALLPAPER_HEIGHT);

    context.font = "500 54px -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
    context.textAlign = "center";
    context.fillStyle = emotion.textColor;
    context.shadowColor = "rgba(0,0,0,0.25)";
    context.shadowBlur = 24;
    context.fillText(`Today I feel ${emotion.label.toLowerCase()}`, WALLPAPER_WIDTH / 2, 1450);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.download = `mood-canvas-${emotion.id}.png`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 0);
    }, "image/png");
  }

  return (
    <button
      aria-label="Save current mood as your phone wallpaper image"
      className="wallpaper-button"
      onClick={saveWallpaper}
      type="button"
    >
      Save as your phone wallpaper
    </button>
  );
}
