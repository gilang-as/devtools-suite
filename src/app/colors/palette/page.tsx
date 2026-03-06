
"use client"

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { 
  parseColor, 
  rgbaToHex, 
  rgbaToHsla, 
  hslaToRgba, 
  formatRgba, 
  generatePalette,
  RGBA, 
  HSLA 
} from '@/lib/colors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Palette, Pipette, Share2, Code2, Check, LayoutGrid } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type PaletteType = 'analogous' | 'complementary' | 'triadic' | 'tetradic' | 'monochromatic';

export default function ColorPalettePage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const colorInputRef = useRef<HTMLInputElement>(null);
  
  const [input, setInput] = useState('#3b82f6');
  const [rgba, setRgba] = useState<RGBA>({ r: 59, g: 130, b: 246, a: 1 });
  const [paletteType, setPaletteType] = useState<PaletteType>('analogous');

  // Update RGBA whenever input changes
  useEffect(() => {
    const parsed = parseColor(input);
    if (parsed) {
      setRgba(parsed);
    }
  }, [input]);

  const hsla = useMemo(() => rgbaToHsla(rgba), [rgba]);
  const palette = useMemo(() => generatePalette(hsla, paletteType), [hsla, paletteType]);

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    toast({ title: t('common.copied') });
  };

  const copyFullPalette = (format: 'css' | 'json') => {
    let text = '';
    if (format === 'css') {
      text = palette.map((hex, i) => `--color-${i + 1}: ${hex};`).join('\n');
    } else {
      text = JSON.stringify(palette, null, 2);
    }
    copy(text);
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <LayoutGrid className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.color_palette.name')}</h1>
          <p className="text-muted-foreground">{t('tools.color_palette.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Pipette className="h-5 w-5 text-primary" />
                Base Color
              </CardTitle>
              <CardDescription>Starting point for harmony</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Pick a Color</Label>
                <div className="relative">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="#3b82f6"
                    className="h-12 font-code text-lg pl-4 pr-12"
                  />
                  <div 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border shadow-sm cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: formatRgba(rgba) }}
                    onClick={() => colorInputRef.current?.click()}
                  />
                  <input 
                    type="color"
                    ref={colorInputRef}
                    value={rgbaToHex(rgba).substring(0, 7)}
                    onChange={handleColorPickerChange}
                    className="sr-only"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <Label className="text-xs font-bold uppercase text-muted-foreground">Harmony Logic</Label>
                <div className="grid grid-cols-1 gap-2">
                  {(['analogous', 'complementary', 'triadic', 'tetradic', 'monochromatic'] as PaletteType[]).map((type) => (
                    <Button
                      key={type}
                      variant={paletteType === type ? 'secondary' : 'ghost'}
                      className={cn("justify-start h-10 px-4", paletteType === type && "bg-primary/10 text-primary border-primary/20")}
                      onClick={() => setPaletteType(type)}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      <span className="capitalize">{type}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Code2 className="h-4 w-4 text-primary" />
                Export Palette
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => copyFullPalette('css')}>
                <Copy className="h-3 w-3 mr-2" /> CSS Vars
              </Button>
              <Button variant="outline" size="sm" onClick={() => copyFullPalette('json')}>
                <Copy className="h-3 w-3 mr-2" /> JSON
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div 
            className="w-full h-32 rounded-3xl shadow-xl border-4 border-background transition-colors duration-500 overflow-hidden relative"
            style={{ backgroundColor: formatRgba(rgba) }}
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://picsum.photos/seed/palette/800/200')] bg-cover mix-blend-overlay" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-background/80 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border border-white/20">
                <span className="font-code font-black text-foreground text-xl">Harmony View</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {palette.map((hex, i) => (
              <Card key={i} className="border-border shadow-md group hover:border-primary/30 transition-all">
                <div 
                  className="h-24 w-full"
                  style={{ backgroundColor: hex }}
                />
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Color {i + 1}</p>
                    <p className="font-code font-black text-sm">{hex}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copy(hex)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-border shadow-md bg-secondary/5">
            <CardHeader className="py-4 bg-background border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Harmony Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-sm text-muted-foreground leading-relaxed">
              {paletteType === 'analogous' && "Analogous palettes use colors that are next to each other on the color wheel. They usually match well and create serene and comfortable designs."}
              {paletteType === 'complementary' && "Complementary palettes use colors that are opposite each other on the color wheel. This creates high contrast and vibrant look."}
              {paletteType === 'triadic' && "Triadic palettes use colors that are evenly spaced around the color wheel. They tend to be quite vibrant, even if you use pale or unsaturated versions of your hues."}
              {paletteType === 'tetradic' && "Tetradic (double complementary) palettes use four colors arranged into two complementary pairs. This rich color scheme offers plenty of possibilities for variation."}
              {paletteType === 'monochromatic' && "Monochromatic palettes use different tones, tints, and shades of a single hue. They are very easy on the eyes and create a soothing effect."}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
