"use client"

import { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from '@/components/providers/i18n-provider';
import { 
  parseColor, 
  rgbaToHex, 
  rgbaToHsla, 
  hslaToRgba, 
  formatRgba, 
  formatHsla, 
  RGBA, 
  HSLA 
} from '@/lib/colors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Copy, Palette, Hash, Trash2, RefreshCcw, Pipette, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ToolSEOContent } from '@/components/tools/ToolSEOContent';

export default function ColorConverterPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const colorInputRef = useRef<HTMLInputElement>(null);
  
  const [input, setInput] = useState('#3b82f6');
  const [rgba, setRgba] = useState<RGBA>({ r: 59, g: 130, b: 246, a: 1 });

  // Update RGBA whenever input changes
  useEffect(() => {
    const parsed = parseColor(input);
    if (parsed) {
      setRgba(parsed);
    }
  }, [input]);

  const hex = useMemo(() => rgbaToHex(rgba), [rgba]);
  const hsla = useMemo(() => rgbaToHsla(rgba), [rgba]);

  const handleHslaChange = (updates: Partial<HSLA>) => {
    const newHsla = { ...hsla, ...updates };
    const newRgba = hslaToRgba(newHsla);
    setRgba(newRgba);
    setInput(rgbaToHex(newRgba));
  };

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setInput(newHex);
  };

  const copy = (val: string) => {
    navigator.clipboard.writeText(val);
    toast({ title: t('common.copied') });
  };

  const OutputCard = ({ label, value, icon: Icon }: any) => (
    <Card className="border-border shadow-sm group">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-lg text-muted-foreground group-hover:text-primary transition-colors">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="font-code text-sm font-bold truncate max-w-[180px]">{value}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copy(value)}>
          <Copy className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <Palette className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">{t('tools.color_converter.name')}</h1>
          <p className="text-muted-foreground">{t('tools.color_converter.description')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Pipette className="h-5 w-5 text-primary" />
                Color Input
              </CardTitle>
              <CardDescription>Enter any color format (HEX, RGB, HSL) or use the picker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Value</Label>
                <div className="relative">
                  <Input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="#000 or rgb(0,0,0)"
                    className="h-12 font-code text-lg pl-4 pr-12"
                  />
                  <div 
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full border shadow-sm cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: formatRgba(rgba) }}
                    onClick={() => colorInputRef.current?.click()}
                    title="Open color picker"
                  />
                  <input 
                    type="color"
                    ref={colorInputRef}
                    value={hex.substring(0, 7)} // Native picker only supports 6-char hex
                    onChange={handleColorPickerChange}
                    className="sr-only"
                  />
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Hue</Label>
                    <span className="text-xs font-mono font-bold">{hsla.h}°</span>
                  </div>
                  <Slider value={[hsla.h]} min={0} max={360} onValueChange={([h]) => handleHslaChange({ h })} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Saturation</Label>
                    <span className="text-xs font-mono font-bold">{hsla.s}%</span>
                  </div>
                  <Slider value={[hsla.s]} min={0} max={100} onValueChange={([s]) => handleHslaChange({ s })} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Lightness</Label>
                    <span className="text-xs font-mono font-bold">{hsla.l}%</span>
                  </div>
                  <Slider value={[hsla.l]} min={0} max={100} onValueChange={([l]) => handleHslaChange({ l })} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs font-bold uppercase text-muted-foreground">Alpha (Opacity)</Label>
                    <span className="text-xs font-mono font-bold">{Math.round(rgba.a * 100)}%</span>
                  </div>
                  <Slider value={[rgba.a * 100]} min={0} max={100} onValueChange={([a]) => handleHslaChange({ a: a / 100 })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <div 
            className="w-full h-48 rounded-3xl shadow-2xl border-4 border-background transition-colors duration-200 flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: formatRgba(rgba) }}
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://picsum.photos/seed/bg/800/400')] bg-cover mix-blend-overlay" />
            <div className="bg-background/80 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border border-white/20">
              <span className="font-code font-black text-foreground text-xl">{hex}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OutputCard label="Hexadecimal" value={hex} icon={Hash} />
            <OutputCard label="RGB / RGBA" value={formatRgba(rgba)} icon={Palette} />
            <OutputCard label="HSL / HSLA" value={formatHsla(hsla)} icon={RefreshCcw} />
            <OutputCard label="CSS Variable" value={`${hsla.h} ${hsla.s}% ${hsla.l}%`} icon={Share2} />
          </div>

          <Card className="border-border shadow-md bg-secondary/5">
            <CardHeader className="py-4 bg-background border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Implementation Snippets</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <code className="text-xs text-muted-foreground font-code">color: {hex};</code>
                  <Button variant="ghost" size="sm" onClick={() => copy(`color: ${hex};`)} className="h-7 text-[10px]">Copy</Button>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <code className="text-xs text-muted-foreground font-code">background-color: {formatRgba(rgba)};</code>
                  <Button variant="ghost" size="sm" onClick={() => copy(`background-color: ${formatRgba(rgba)};`)} className="h-7 text-[10px]">Copy</Button>
                </div>
                <div className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <code className="text-xs text-muted-foreground font-code">border-color: {formatHsla(hsla)};</code>
                  <Button variant="ghost" size="sm" onClick={() => copy(`border-color: ${formatHsla(hsla)};`)} className="h-7 text-[10px]">Copy</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ToolSEOContent 
        title="Color Conversion"
        sections={[
          {
            title: "What is a Color Converter?",
            content: "A Color Converter is a tool that allows you to translate color values between different digital formats such as HEX, RGB, and HSL. This is essential for web developers and designers who need to ensure color consistency across various CSS frameworks, design tools like Figma, and different browser rendering engines."
          },
          {
            title: "Understanding Color Formats",
            content: "HEX (Hexadecimal) uses a base-16 numbering system, common in CSS. RGB (Red, Green, Blue) represents colors as light combinations. HSL (Hue, Saturation, Lightness) is often preferred by designers because it is more intuitive for adjusting how 'vibrant' or 'bright' a color is."
          },
          {
            title: "How to use this tool?",
            content: "Simply type your color value into the 'Value' field. It automatically detects HEX, RGB, or HSL strings. You can also use the live sliders to fine-tune the Hue, Saturation, and Lightness. The large preview block updates instantly, and you can copy implementation snippets for your CSS files."
          },
          {
            title: "Privacy and Accuracy",
            content: "All calculations are performed client-side in your browser using high-precision conversion algorithms. No data is sent to a server, ensuring your project's brand colors remain private. Our converter supports the Alpha channel (opacity) for full transparency control in modern web design."
          }
        ]}
      />
    </div>
  );
}
