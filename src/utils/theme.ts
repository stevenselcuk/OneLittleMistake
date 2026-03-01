export type ThemeName = 'sepia' | 'tron' | 'duotone';

export interface Theme {
  name: ThemeName;
  appBg: string;
  appText: string;
  dot: string;
  p1Line: string;
  p2Line: string;
  p1Square: string;
  p2Square: string;
  p1Text: string;
  p2Text: string;
  p1Pulse: string;
  p2Pulse: string;
  hoverLine: string;
  mutedText: string;
  dropdownBg: string;
  dropdownBorder: string;
  dropdownHover: string;
}

export const THEMES: Record<ThemeName, Theme> = {
  sepia: {
    name: 'sepia',
    appBg: 'bg-[#f4ecd8]',
    appText: 'text-[#433422]',
    dot: 'bg-[#d3c5a3]',
    p1Line: 'bg-[#8c3a3a]',
    p2Line: 'bg-[#3a6b58]',
    p1Square: 'bg-[#8c3a3a]/30',
    p2Square: 'bg-[#3a6b58]/30',
    p1Text: 'text-[#8c3a3a]',
    p2Text: 'text-[#3a6b58]',
    p1Pulse: 'bg-[#8c3a3a]',
    p2Pulse: 'bg-[#3a6b58]',
    hoverLine: 'group-hover:bg-[#e3d5b3]',
    mutedText: 'text-[#a3957b]',
    dropdownBg: 'bg-[#e8dfc8]',
    dropdownBorder: 'border-[#d3c5a3]',
    dropdownHover: 'hover:bg-black/5',
  },
  tron: {
    name: 'tron',
    appBg: 'bg-[#000000]',
    appText: 'text-[#00ffff]',
    dot: 'bg-[#113333]',
    p1Line: 'bg-[#00ffff] shadow-[0_0_8px_#00ffff]',
    p2Line: 'bg-[#ff00ff] shadow-[0_0_8px_#ff00ff]',
    p1Square: 'bg-[#00ffff]/20',
    p2Square: 'bg-[#ff00ff]/20',
    p1Text: 'text-[#00ffff] drop-shadow-[0_0_5px_#00ffff]',
    p2Text: 'text-[#ff00ff] drop-shadow-[0_0_5px_#ff00ff]',
    p1Pulse: 'bg-[#00ffff] shadow-[0_0_8px_#00ffff]',
    p2Pulse: 'bg-[#ff00ff] shadow-[0_0_8px_#ff00ff]',
    hoverLine: 'group-hover:bg-[#003333]',
    mutedText: 'text-[#008888]',
    dropdownBg: 'bg-[#050505]',
    dropdownBorder: 'border-[#003333]',
    dropdownHover: 'hover:bg-[#00ffff]/10',
  },
  duotone: {
    name: 'duotone',
    appBg: 'bg-[#ffffff]',
    appText: 'text-[#000000]',
    dot: 'bg-[#cccccc]',
    p1Line: 'bg-[#000000]',
    p2Line: 'bg-[#888888]',
    p1Square: 'bg-[#000000]/20',
    p2Square: 'bg-[#888888]/20',
    p1Text: 'text-[#000000]',
    p2Text: 'text-[#888888]',
    p1Pulse: 'bg-[#000000]',
    p2Pulse: 'bg-[#888888]',
    hoverLine: 'group-hover:bg-[#eeeeee]',
    mutedText: 'text-[#888888]',
    dropdownBg: 'bg-[#f5f5f5]',
    dropdownBorder: 'border-[#e0e0e0]',
    dropdownHover: 'hover:bg-black/5',
  },
};
