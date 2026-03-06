
/**
 * Utility for color conversion between HEX, RGB, and HSL.
 */

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface HSLA {
  h: number;
  s: number;
  l: number;
  a: number;
}

export function hexToRgba(hex: string): RGBA {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length === 6) {
    hex += 'ff';
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const a = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;
  
  return { r, g, b, a };
}

export function rgbaToHex(rgba: RGBA): string {
  const r = rgba.r.toString(16).padStart(2, '0');
  const g = rgba.g.toString(16).padStart(2, '0');
  const b = rgba.b.toString(16).padStart(2, '0');
  const a = Math.round(rgba.a * 255).toString(16).padStart(2, '0');
  
  const hex = `#${r}${g}${b}${a === 'ff' ? '' : a}`;
  return hex.toUpperCase();
}

export function rgbaToHsla(rgba: RGBA): HSLA {
  let { r, g, b, a } = rgba;
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
    a
  };
}

export function hslaToRgba(hsla: HSLA): RGBA {
  let { h, s, l, a } = hsla;
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a
  };
}

export function parseColor(str: string): RGBA | null {
  str = str.trim().toLowerCase();
  
  // Hex
  if (/^#?[0-9a-f]{3,8}$/.test(str)) {
    try { return hexToRgba(str); } catch(e) {}
  }
  
  // RGB / RGBA
  const rgbMatch = str.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d?\.?\d+))?\)$/);
  if (rgbMatch) {
    return {
      r: Math.min(255, parseInt(rgbMatch[1])),
      g: Math.min(255, parseInt(rgbMatch[2])),
      b: Math.min(255, parseInt(rgbMatch[3])),
      a: rgbMatch[4] ? Math.min(1, parseFloat(rgbMatch[4])) : 1
    };
  }
  
  // HSL / HSLA
  const hslMatch = str.match(/^hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*(\d?\.?\d+))?\)$/);
  if (hslMatch) {
    const hsla = {
      h: parseInt(hslMatch[1]) % 360,
      s: Math.min(100, parseInt(hslMatch[2])),
      l: Math.min(100, parseInt(hslMatch[3])),
      a: hslMatch[4] ? Math.min(1, parseFloat(hslMatch[4])) : 1
    };
    return hslaToRgba(hsla);
  }
  
  return null;
}

export function formatRgba(rgba: RGBA): string {
  if (rgba.a === 1) return `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a.toFixed(2)})`;
}

export function formatHsla(hsla: HSLA): string {
  if (hsla.a === 1) return `hsl(${hsla.h}, ${hsla.s}%, ${hsla.l}%)`;
  return `hsla(${hsla.h}, ${hsla.s}%, ${hsla.l}%, ${hsla.a.toFixed(2)})`;
}
