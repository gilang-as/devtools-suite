"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/components/providers/i18n-provider';
import { generatePKCS, PKCSVersion, PKCSResult } from '@/lib/pkcs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  ShieldCheck, 
  Copy, 
  Trash2, 
  Download, 
  RefreshCcw, 
  Loader2, 
  Key, 
  FileText, 
  Lock,
  Info,
  HelpCircle,
  FileBadge
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PKCSGeneratorProps {
  version: PKCSVersion;
}

export default function PKCSGenerator({ version }: PKCSGeneratorProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const pathname = usePathname();
  const [result, setResult] = useState<PKCSResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Options
  const [bits, setBits] = useState(2048);
  const [algorithm, setAlgorithm] = useState('RSA');
  const [commonName, setCommonName] = useState('example.com');
  const [password, setPassword] = useState('password');
  const [org, setOrg] = useState('DevTools Suite');
  const [unit, setUnit] = useState('Engineering');
  const [validityYears, setValidityYears] = useState(1);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generatePKCS(version, { 
        bits, 
        algorithm,
        commonName, 
        password,
        organization: org,
        unit: unit,
        years: validityYears
      });
      setResult(res);
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: t('common.error'),
        description: e.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (version === 'p1') {
      setAlgorithm('RSA');
    } else if (version === 'p8') {
      setAlgorithm('RSA');
    } else if (version === 'p12') {
      setAlgorithm('RSA-2048');
    }
    
    if (version === 'p1' || version === 'p8' || version === 'x509') {
      handleGenerate();
    } else {
      setResult(null);
    }
  }, [version]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('common.copied'),
    });
  };

  const handleDownload = () => {
    if (!result) return;
    
    let blob: Blob;
    let ext: string;
    
    if (version === 'p12' && result.binary) {
      blob = new Blob([result.binary], { type: 'application/x-pkcs12' });
      ext = 'p12';
    } else {
      blob = new Blob([result.content], { type: 'text/plain' });
      ext = version === 'x509' ? 'crt' : 'pem';
    }
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-${version}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const navItems = [
    { name: 'PKCS#1', href: '/pkcs/p1' },
    { name: 'PKCS#7', href: '/pkcs/p7' },
    { name: 'PKCS#8', href: '/pkcs/p8' },
    { name: 'PKCS#10', href: '/pkcs/p10' },
    { name: 'PKCS#12', href: '/pkcs/p12' },
    { name: 'X.509', href: '/pkcs/x509' },
  ];

  const bitPresets = ['1024', '2048', '3072', '4096'];

  const KnowledgeBaseContent = {
    p1: {
      title: "PKCS#1: RSA Cryptography",
      description: "Specific to RSA keys. Defines the structure of public/private keys and padding schemes.",
      items: [
        { label: "Padding PKCS#1", text: "Used in RSA encryption (v1.5 or OAEP) to prevent chosen-ciphertext attacks." },
        { label: "Key Structure", text: "Standard format for RSA-specific key pairs (RSAPrivateKey/RSAPublicKey)." }
      ]
    },
    p7: {
      title: "PKCS#7: Cryptographic Message Syntax",
      description: "Used for signing and/or encrypting data. Often used in S/MIME or code signing.",
      items: [
        { label: "Padding PKCS#7", text: "Used for Block Ciphers (AES/DES). Pads data to match the block size (e.g., 16 bytes)." },
        { label: "Containers", text: "Can wrap certificates, CRLs, and signed data into a single CMS container." }
      ]
    },
    p8: {
      title: "PKCS#8: Private-Key Information",
      description: "A generic syntax for private keys that supports multiple algorithms (RSA, EC, etc.).",
      items: [
        { label: "Algorithm Agnostic", text: "Unlike PKCS#1, it wraps the key with an OID that identifies the algorithm." },
        { label: "Encryption", text: "Can optionally be encrypted (EncryptedPrivateKeyInfo) with a password." }
      ]
    },
    p10: {
      title: "PKCS#10: Certification Request (CSR)",
      description: "A request sent to a Certificate Authority (CA) to sign a public key.",
      items: [
        { label: "Subject Info", text: "Includes identity details like Common Name (CN), Org (O), and Country (C)." },
        { label: "Signature", text: "The CSR is self-signed by the private key to prove ownership of the public key." }
      ]
    },
    p12: {
      title: "PKCS#12: Personal Information (PFX)",
      description: "A binary container (PFX) used to store certificates and their matching private keys.",
      items: [
        { label: "Full Identity", text: "Includes the end-entity certificate, the private key, and the CA chain." },
        { label: "Security", text: "The container is always password-protected to secure the private key during transit." }
      ]
    },
    x509: {
      title: "X.509: Digital Certificates",
      description: "The standard format for public key certificates used in HTTPS/TLS and other protocols.",
      items: [
        { label: "Self-Signed", text: "A certificate where the issuer and subject are the same. Used for internal testing." },
        { label: "Validity", text: "Defines the 'notBefore' and 'notAfter' dates between which the certificate is considered valid." },
        { label: "Extensions", text: "Additional metadata like Subject Alternative Name (SAN) for supporting multiple domains." }
      ]
    }
  }[version];

  const InfoIcon = ({ content }: { content: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="inline-flex text-muted-foreground hover:text-primary transition-colors">
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="bg-primary/10 p-2 rounded-xl text-primary">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-bold">
            {t(`tools.pkcs_${version}.name`)}
          </h1>
          <p className="text-muted-foreground">
            {t(`tools.pkcs_${version}.description`)}
          </p>
        </div>
      </div>

      <div className="flex p-1 bg-muted rounded-lg w-fit overflow-x-auto max-w-full">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button 
              variant={pathname === item.href ? 'secondary' : 'ghost'} 
              className={cn("px-6 h-8 whitespace-nowrap", pathname === item.href && "bg-background shadow-sm")}
              size="sm"
            >
              {item.name}
            </Button>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Options Column */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-border shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCcw className="h-4 w-4 text-primary" />
                {t('common.generate')}
              </CardTitle>
              <CardDescription>Configure security parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Algorithm Selector */}
              {(version === 'p8' || version === 'p12') && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label>Algorithm</Label>
                    <InfoIcon content="The cryptographic algorithm used to generate the key pair." />
                  </div>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {version === 'p8' ? (
                        <>
                          <SelectItem value="RSA">RSA (Classic)</SelectItem>
                          <SelectItem value="ECDSA">ECDSA (Elliptic Curve)</SelectItem>
                          <SelectItem value="Ed25519">Ed25519 (Fast/Secure)</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="RSA-2048">RSA 2048 (Legacy/Standard)</SelectItem>
                          <SelectItem value="ECC-256">ECC 256 (NIST P-256)</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Bit Length Selector */}
              {(version === 'p1' || version === 'p8' || version === 'p10' || version === 'x509') && algorithm === 'RSA' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="bits">Key Length (bits)</Label>
                    <InfoIcon content="Higher bit counts offer more security but slower processing. 2048 is standard; 4096 is high-security." />
                  </div>
                  <div className="flex gap-2">
                    <Select 
                      value={bits.toString()} 
                      onValueChange={(val) => setBits(parseInt(val))}
                    >
                      <SelectTrigger className={cn("bg-background", version !== 'p1' ? 'w-[120px]' : 'w-full')}>
                        <SelectValue placeholder="Bits" />
                      </SelectTrigger>
                      <SelectContent>
                        {bitPresets.map(preset => (
                          <SelectItem key={preset} value={preset}>{preset}</SelectItem>
                        ))}
                        {version !== 'p1' && <SelectItem value="custom">Custom</SelectItem>}
                      </SelectContent>
                    </Select>
                    {version !== 'p1' && !bitPresets.includes(bits.toString()) && (
                      <Input 
                        id="bits" 
                        type="number" 
                        value={bits} 
                        onChange={(e) => setBits(parseInt(e.target.value) || 0)}
                        className="flex-1 bg-background"
                        placeholder="Manual"
                      />
                    )}
                  </div>
                </div>
              )}
              
              {(version === 'p10' || version === 'p12' || version === 'x509') && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="cn">Common Name (CN)</Label>
                    <InfoIcon content="The primary name the certificate is issued for (e.g., your domain or server name)." />
                  </div>
                  <Input 
                    id="cn" 
                    value={commonName} 
                    onChange={(e) => setCommonName(e.target.value)}
                    placeholder="example.com"
                  />
                </div>
              )}

              {(version === 'p10' || version === 'x509') && (
                <>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="org">Organization (O)</Label>
                      <InfoIcon content="The legal name of your organization." />
                    </div>
                    <Input 
                      id="org" 
                      value={org} 
                      onChange={(e) => setOrg(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="unit">Organizational Unit (OU)</Label>
                      <InfoIcon content="The department or sub-unit within the organization." />
                    </div>
                    <Input 
                      id="unit" 
                      value={unit} 
                      onChange={(e) => setUnit(e.target.value)}
                    />
                  </div>
                </>
              )}

              {version === 'x509' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="years">Validity (Years)</Label>
                    <InfoIcon content="How long the certificate should be valid for. Typical values are 1-2 years." />
                  </div>
                  <Input 
                    id="years" 
                    type="number"
                    value={validityYears} 
                    onChange={(e) => setValidityYears(parseInt(e.target.value) || 1)}
                    min={1}
                    max={10}
                  />
                </div>
              )}

              {version === 'p12' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="pass">PFX Password</Label>
                    <InfoIcon content="The password required to import the certificate and private key into other systems." />
                  </div>
                  <Input 
                    id="pass" 
                    type="password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              {version === 'p7' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="content">Sample Content to Wrap</Label>
                    <InfoIcon content="The message or data you want to sign or wrap in the PKCS#7 container." />
                  </div>
                  <Textarea 
                    id="content"
                    placeholder="Hello, PKCS#7!"
                    className="h-20"
                  />
                </div>
              )}

              <Button onClick={handleGenerate} className="w-full mt-2" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
                {t('common.generate')}
              </Button>
            </CardContent>
          </Card>

          {/* Dynamic Knowledge Base */}
          <Card className="border-border bg-primary/5 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-primary" />
                {KnowledgeBaseContent.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs leading-relaxed">
              <p className="text-muted-foreground">{KnowledgeBaseContent.description}</p>
              {KnowledgeBaseContent.items.map((item, idx) => (
                <div key={idx} className="pt-2 border-t border-primary/10">
                  <p className="font-bold text-primary">{item.label}</p>
                  <p className="text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {t('common.output')}
            </h2>
            {result && (
              <Button variant="ghost" size="sm" onClick={() => setResult(null)} className="text-muted-foreground">
                <Trash2 className="h-4 w-4 mr-2" />
                {t('common.clear')}
              </Button>
            )}
          </div>

          {!result ? (
            <Card className="border-dashed border-2 flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/10">
              <ShieldCheck className="h-12 w-12 opacity-20 mb-4" />
              <p>Generated results will appear here</p>
              <Button variant="link" onClick={handleGenerate} className="mt-2">
                Click to generate now
              </Button>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex gap-2">
                <Button onClick={handleDownload} className="flex-1 shadow-md" variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  {t('common.download')} {version === 'p12' ? '.p12' : version === 'x509' ? '.crt' : '.pem'}
                </Button>
                <Button onClick={() => copyToClipboard(result.content)} variant="outline" className="flex-1">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Full Payload
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {result.parts && Object.entries(result.parts).map(([label, val]) => (
                  <Card key={label} className="border-border shadow-sm overflow-hidden">
                    <CardHeader className="py-3 px-4 bg-secondary/30 flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        {label.includes('Private') || label.includes('Key') ? <Lock className="h-4 w-4 text-orange-500" /> : <FileBadge className="h-4 w-4 text-blue-500" />}
                        <CardTitle className="text-sm font-bold uppercase tracking-wider">{label}</CardTitle>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0" 
                        onClick={() => copyToClipboard(val)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Textarea
                        readOnly
                        className="font-code text-[10px] sm:text-xs min-h-[150px] bg-transparent border-none focus-visible:ring-0 rounded-none resize-none leading-relaxed"
                        value={val}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
