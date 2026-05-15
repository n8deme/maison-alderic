"use client";

import {
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  saveStep1,
  saveStep2,
  sendTeamInvites,
  importClients,
  finalizeOnboarding,
  createCheckoutSession,
} from "./actions";

type Step1Data = { address: string; phone: string; website_url: string };
type Step2Data = { primary_color: string; accent_color: string; logo_url: string };
type Invite    = { email: string; role: "avocat" | "secretaire" | "admin" };
type Client    = { name: string; email: string };
type WizardState = { step1?: Step1Data; step2?: Step2Data; step3?: Invite[]; step4?: Client[] };

const STORAGE_KEY = "__lawyeros_onboarding";
const TOTAL_STEPS  = 5;

export default function OnboardingPage() {
  return <Suspense fallback={<LoadingScreen />}><OnboardingWizard /></Suspense>;
}

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "var(--background)" }}>
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Chargement...</p>
    </div>
  );
}

function OnboardingWizard() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const tenant       = searchParams.get("__tenant") || "";

  const [step,    setStep]    = useState(1);
  const [orgId,   setOrgId]   = useState<string | null>(null);
  const [wizard,  setWizard]  = useState<WizardState>({});
  const [error,   setError]   = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) setWizard(JSON.parse(saved)); } catch {}
    if (!tenant) return;
    const supabase = createClient();
    supabase.from("organizations").select("id").eq("subdomain", tenant).single()
      .then(({ data }) => { if (data) setOrgId(data.id); });
  }, [tenant]);

  function persist(updates: Partial<WizardState>) {
    setWizard((prev) => {
      const next = { ...prev, ...updates };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function next() { setError(null); setStep((s) => Math.min(s + 1, TOTAL_STEPS)); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function back() { setError(null); setStep((s) => Math.max(s - 1, 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }

  async function handleStep1(data: Step1Data) {
    persist({ step1: data });
    if (!orgId) { next(); return; }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("org_id", orgId); fd.set("address", data.address); fd.set("phone", data.phone); fd.set("website_url", data.website_url);
      const result = await saveStep1(fd);
      if (!result.ok) { setError(result.error); return; }
      next();
    });
  }

  async function handleStep2(data: Step2Data) {
    persist({ step2: data });
    if (!orgId) { next(); return; }
    startTransition(async () => {
      const fd = new FormData();
      fd.set("org_id", orgId); fd.set("primary_color", data.primary_color); fd.set("accent_color", data.accent_color); fd.set("logo_url", data.logo_url);
      const result = await saveStep2(fd);
      if (!result.ok) { setError(result.error); return; }
      next();
    });
  }

  async function handleStep3(invites: Invite[]) {
    persist({ step3: invites });
    if (!orgId || invites.length === 0) { next(); return; }
    startTransition(async () => {
      const result = await sendTeamInvites(orgId, invites);
      if (!result.ok) { setError(result.error); return; }
      next();
    });
  }

  async function handleStep4(clients: Client[]) {
    persist({ step4: clients });
    if (!orgId || clients.length === 0) { next(); return; }
    startTransition(async () => {
      const result = await importClients(orgId, clients);
      if (!result.ok) { setError(result.error); return; }
      next();
    });
  }

  async function handleTrialSubmit() {
    if (!orgId) return;
    startTransition(async () => {
      const result = await finalizeOnboarding(orgId, tenant);
      if (!result.ok) { setError(result.error); return; }
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/onboarding/success?__tenant=${tenant}&subdomain=${tenant}`);
    });
  }

  async function handleStripeCheckout(planId: string, billing: "monthly" | "yearly") {
    if (!orgId) return;
    startTransition(async () => {
      const result = await createCheckoutSession(orgId, planId, billing, tenant);
      if (!result.ok) {
        if (result.error === "STRIPE_NOT_CONFIGURED") {
          // Fallback silencieux : démarrer le trial
          await handleTrialSubmit();
          return;
        }
        setError(result.error);
        return;
      }
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = result.url;
    });
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      <header className="border-b px-6 py-4 flex items-center justify-between" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
        <span className="text-lg font-heading font-medium tracking-tight" style={{ color: "var(--foreground)" }}>LawyerOS</span>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>Étape {step} sur {TOTAL_STEPS}</span>
      </header>
      <div className="h-1 w-full" style={{ backgroundColor: "var(--border)" }}>
        <div className="h-full transition-all duration-500" style={{ width: `${(step / TOTAL_STEPS) * 100}%`, backgroundColor: "var(--accent)" }} />
      </div>
      <main className="max-w-2xl mx-auto px-6 py-12">
        {error && <div className="mb-6 rounded-sm border p-4 text-sm" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca", color: "#991b1b" }}>{error}</div>}
        {step === 1 && <Step1 initial={wizard.step1} onSubmit={handleStep1} isPending={isPending} />}
        {step === 2 && <Step2 initial={wizard.step2} onSubmit={handleStep2} onBack={back} isPending={isPending} />}
        {step === 3 && <Step3 initial={wizard.step3} onSubmit={handleStep3} onBack={back} isPending={isPending} />}
        {step === 4 && <Step4 initial={wizard.step4} onSubmit={handleStep4} onBack={back} isPending={isPending} />}
        {step === 5 && <Step5 orgId={orgId} tenant={tenant} onTrialSubmit={handleTrialSubmit} onStripeCheckout={handleStripeCheckout} onBack={back} isPending={isPending} />}
      </main>
    </div>
  );
}

function Step1({ initial, onSubmit, isPending }: { initial?: Step1Data; onSubmit: (d: Step1Data) => void; isPending: boolean }) {
  const [address, setAddress] = useState(initial?.address || "");
  const [phone,   setPhone]   = useState(initial?.phone || "");
  const [website, setWebsite] = useState(initial?.website_url || "");
  function handleSubmit(e: React.FormEvent) { e.preventDefault(); onSubmit({ address, phone, website_url: website }); }
  return (
    <StepShell step={1} title="Informations du cabinet" subtitle="Ces informations apparaîtront sur votre portail client.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField id="address" label="Adresse" placeholder="Avenue Louise 480, 1050 Bruxelles" value={address} onChange={(e) => setAddress(e.target.value)} />
        <FormField id="phone" label="Téléphone" type="tel" placeholder="+32 2 000 00 00" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <FormField id="website" label="Site web" type="url" placeholder="https://votre-cabinet.be" value={website} onChange={(e) => setWebsite(e.target.value)} />
        <StepActions submitLabel="Continuer" isPending={isPending} />
      </form>
    </StepShell>
  );
}

function Step2({ initial, onSubmit, onBack, isPending }: { initial?: Step2Data; onSubmit: (d: Step2Data) => void; onBack: () => void; isPending: boolean }) {
  const [primary, setPrimary] = useState(initial?.primary_color || "#1A1A1A");
  const [accent,  setAccent]  = useState(initial?.accent_color  || "#7A1F2B");
  const [logoUrl, setLogoUrl] = useState(initial?.logo_url      || "");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleLogoUpload(file: File) {
    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploading(false); return; }
    const ext = file.name.split(".").pop();
    const path = `logos/${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("org-assets").upload(path, file, { upsert: true });
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from("org-assets").getPublicUrl(path);
      setLogoUrl(publicUrl);
    }
    setUploading(false);
  }

  function handleSubmit(e: React.FormEvent) { e.preventDefault(); onSubmit({ primary_color: primary, accent_color: accent, logo_url: logoUrl }); }

  return (
    <StepShell step={2} title="Identité visuelle" subtitle="Personnalisez votre portail aux couleurs de votre cabinet.">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-3">
          <label className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>Logo du cabinet</label>
          <div className="flex items-center gap-4 rounded-sm border border-dashed p-6 cursor-pointer" style={{ borderColor: "var(--border)" }} onClick={() => fileRef.current?.click()}>
            {logoUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={logoUrl} alt="Logo" className="h-12 w-auto object-contain" />
              : <div className="flex h-12 w-12 items-center justify-center rounded-sm text-xs" style={{ backgroundColor: "var(--surface-alt)", color: "var(--text-muted)" }}>Logo</div>
            }
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{uploading ? "Téléchargement..." : "Choisir un fichier"}</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>PNG, SVG ou JPG — max 2 Mo</p>
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/png,image/svg+xml,image/jpeg" className="hidden"
            onChange={(e) => { const file = e.target.files?.[0]; if (file) handleLogoUpload(file); }} />
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>Couleur principale</label>
            <div className="flex items-center gap-3">
              <input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} className="h-10 w-10 rounded cursor-pointer border-0 p-0" />
              <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>{primary.toUpperCase()}</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>Couleur accent</label>
            <div className="flex items-center gap-3">
              <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-10 w-10 rounded cursor-pointer border-0 p-0" />
              <span className="text-sm font-mono" style={{ color: "var(--text-secondary)" }}>{accent.toUpperCase()}</span>
            </div>
          </div>
        </div>
        <div className="rounded-sm border p-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-alt)" }}>
          <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Aperçu</p>
          <div className="rounded-sm p-4 flex items-center justify-between" style={{ backgroundColor: primary }}>
            <span className="text-sm font-medium text-white opacity-90">Votre cabinet</span>
            <span className="rounded-sm px-3 py-1 text-xs font-medium text-white" style={{ backgroundColor: accent }}>Action</span>
          </div>
        </div>
        <StepActions submitLabel="Continuer" onBack={onBack} isPending={isPending} />
      </form>
    </StepShell>
  );
}

const ROLES = [
  { value: "avocat",     label: "Avocat·e" },
  { value: "secretaire", label: "Secrétaire" },
  { value: "admin",      label: "Administrateur·ice" },
] as const;

function Step3({ initial, onSubmit, onBack, isPending }: { initial?: Invite[]; onSubmit: (d: Invite[]) => void; onBack: () => void; isPending: boolean }) {
  const [invites, setInvites] = useState<Invite[]>(initial ?? [{ email: "", role: "avocat" }]);
  function addRow() { setInvites((prev) => [...prev, { email: "", role: "avocat" }]); }
  function removeRow(i: number) { setInvites((prev) => prev.filter((_, idx) => idx !== i)); }
  function updateRow(i: number, field: keyof Invite, value: string) { setInvites((prev) => prev.map((row, idx) => idx === i ? { ...row, [field]: value } : row)); }
  function handleSubmit(e: React.FormEvent) { e.preventDefault(); onSubmit(invites.filter((r) => r.email.trim()) as Invite[]); }

  return (
    <StepShell step={3} title="Inviter votre équipe" subtitle="Ajoutez vos collaborateurs. Ils recevront un email de connexion." optional>
      <form onSubmit={handleSubmit} className="space-y-4">
        {invites.map((row, i) => (
          <div key={i} className="flex gap-3 items-start">
            <input type="email" placeholder="avocat@cabinet.be" value={row.email} onChange={(e) => updateRow(i, "email", e.target.value)}
              className="flex-1 rounded-sm border px-3.5 py-2.5 text-sm outline-none"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--foreground)" }} />
            <select value={row.role} onChange={(e) => updateRow(i, "role", e.target.value)}
              className="rounded-sm border px-3 py-2.5 text-sm outline-none"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--foreground)" }}>
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            {invites.length > 1 && <button type="button" onClick={() => removeRow(i)} className="py-2.5 px-2 text-sm" style={{ color: "var(--text-muted)" }}>×</button>}
          </div>
        ))}
        {invites.length < 10 && <button type="button" onClick={addRow} className="text-sm" style={{ color: "var(--accent)" }}>+ Ajouter un collaborateur</button>}
        <StepActions submitLabel="Continuer" skipLabel="Passer cette étape" onSkip={() => onSubmit([])} onBack={onBack} isPending={isPending} />
      </form>
    </StepShell>
  );
}

function Step4({ initial, onSubmit, onBack, isPending }: { initial?: Client[]; onSubmit: (d: Client[]) => void; onBack: () => void; isPending: boolean }) {
  const [clients, setClients] = useState<Client[]>(initial ?? [{ name: "", email: "" }]);
  const [csvMode, setCsvMode] = useState(false);
  const [csvText, setCsvText] = useState("");

  function addRow() { setClients((prev) => [...prev, { name: "", email: "" }]); }
  function removeRow(i: number) { setClients((prev) => prev.filter((_, idx) => idx !== i)); }
  function updateRow(i: number, field: keyof Client, value: string) { setClients((prev) => prev.map((row, idx) => idx === i ? { ...row, [field]: value } : row)); }
  function parseCsv(text: string): Client[] {
    return text.split("\n").map((l) => l.trim()).filter(Boolean)
      .map((l) => { const [name, email] = l.split(",").map((s) => s.trim()); return { name: name || "", email: email || "" }; })
      .filter((c) => c.name && c.email);
  }
  function handleSubmit(e: React.FormEvent) { e.preventDefault(); onSubmit(csvMode ? parseCsv(csvText) : clients.filter((c) => c.name && c.email)); }

  return (
    <StepShell step={4} title="Importer vos premiers clients" subtitle="Créez les comptes de vos clients existants. Ils recevront un email d'accès." optional>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex gap-3">
          {(["Formulaire", "Import CSV"] as const).map((label, i) => (
            <button key={label} type="button" onClick={() => setCsvMode(i === 1)}
              className="text-sm px-3 py-1.5 rounded-sm border transition-colors"
              style={{ backgroundColor: csvMode === (i === 1) ? "var(--foreground)" : "transparent", borderColor: "var(--border)", color: csvMode === (i === 1) ? "#fff" : "var(--text-secondary)" }}>
              {label}
            </button>
          ))}
        </div>
        {csvMode ? (
          <div className="space-y-2">
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Format : <code>Nom Prénom, email@exemple.com</code></p>
            <textarea rows={8} value={csvText} onChange={(e) => setCsvText(e.target.value)}
              className="w-full rounded-sm border px-3.5 py-2.5 text-sm font-mono outline-none resize-none"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--foreground)" }} />
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((row, i) => (
              <div key={i} className="flex gap-3 items-start">
                <input type="text" placeholder="Nom complet" value={row.name} onChange={(e) => updateRow(i, "name", e.target.value)}
                  className="flex-1 rounded-sm border px-3.5 py-2.5 text-sm outline-none"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--foreground)" }} />
                <input type="email" placeholder="Email" value={row.email} onChange={(e) => updateRow(i, "email", e.target.value)}
                  className="flex-1 rounded-sm border px-3.5 py-2.5 text-sm outline-none"
                  style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--foreground)" }} />
                {clients.length > 1 && <button type="button" onClick={() => removeRow(i)} className="py-2.5 px-2 text-sm" style={{ color: "var(--text-muted)" }}>×</button>}
              </div>
            ))}
            {clients.length < 20 && <button type="button" onClick={addRow} className="text-sm" style={{ color: "var(--accent)" }}>+ Ajouter un client</button>}
          </div>
        )}
        <StepActions submitLabel="Continuer" skipLabel="Passer cette étape" onSkip={() => onSubmit([])} onBack={onBack} isPending={isPending} />
      </form>
    </StepShell>
  );
}

type Plan = {
  id:        string;
  name:      string;
  monthly:   number;
  yearly:    number;
  features:  string[];
  highlight?: boolean;
};

const PLANS: Plan[] = [
  { id: "solo",    name: "Solo",    monthly: 79,  yearly: 63,  features: ["1 avocat", "10 dossiers actifs", "Portail client", "Messagerie sécurisée"] },
  { id: "cabinet", name: "Cabinet", monthly: 199, yearly: 159, features: ["Jusqu'à 5 avocats", "Dossiers illimités", "Signature électronique", "Formulaires intake"], highlight: true },
  { id: "premium", name: "Premium", monthly: 399, yearly: 319, features: ["Avocats illimités", "IA résumés dossiers", "Domaine personnalisé", "Support prioritaire"] },
];

function Step5({
  orgId,
  tenant: _tenant,
  onTrialSubmit,
  onStripeCheckout,
  onBack,
  isPending,
}: {
  orgId:             string | null;
  tenant:            string;
  onTrialSubmit:     () => void;
  onStripeCheckout:  (planId: string, billing: "monthly" | "yearly") => void;
  onBack:            () => void;
  isPending:         boolean;
}) {
  const [selectedPlan, setSelectedPlan] = useState<string>("cabinet");
  const [billing,      setBilling]      = useState<"monthly" | "yearly">("monthly");

  return (
    <StepShell step={5} title="Choisissez votre formule" subtitle="Essai gratuit de 14 jours — aucun paiement avant la fin de l'essai.">
      <div className="space-y-6">

        {/* Toggle mensuel / annuel */}
        <div className="flex items-center justify-center gap-1 rounded-sm border p-1 w-fit mx-auto" style={{ borderColor: "var(--border)", backgroundColor: "var(--surface-alt)" }}>
          {(["monthly", "yearly"] as const).map((b) => (
            <button key={b} type="button" onClick={() => setBilling(b)}
              className="px-4 py-1.5 rounded-sm text-sm font-medium transition-colors"
              style={{
                backgroundColor: billing === b ? "var(--foreground)" : "transparent",
                color:           billing === b ? "#fff" : "var(--text-secondary)",
              }}>
              {b === "monthly" ? "Mensuel" : "Annuel"}{b === "yearly" && <span className="ml-1.5 text-xs font-medium" style={{ color: billing === "yearly" ? "#86efac" : "var(--accent)" }}>−20%</span>}
            </button>
          ))}
        </div>

        {/* Cartes plans */}
        <div className="grid gap-3">
          {PLANS.map((plan) => {
            const price = billing === "monthly" ? plan.monthly : plan.yearly;
            const isSelected = selectedPlan === plan.id;
            return (
              <button key={plan.id} type="button" onClick={() => setSelectedPlan(plan.id)}
                className="w-full text-left rounded-sm border p-5 transition-all"
                style={{
                  borderColor:     isSelected ? "var(--foreground)" : "var(--border)",
                  backgroundColor: plan.highlight && !isSelected ? "var(--surface-alt)" : "var(--surface)",
                  boxShadow:       isSelected ? "0 0 0 1px var(--foreground)" : "none",
                }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border-2 flex items-center justify-center" style={{ borderColor: isSelected ? "var(--foreground)" : "var(--border)" }}>
                      {isSelected && <div className="h-2 w-2 rounded-full" style={{ backgroundColor: "var(--foreground)" }} />}
                    </div>
                    <span className="font-medium" style={{ color: "var(--foreground)" }}>{plan.name}</span>
                    {plan.highlight && <span className="text-xs px-2 py-0.5 rounded-sm font-medium" style={{ backgroundColor: "var(--accent)", color: "#fff" }}>Recommandé</span>}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{price} €/mois</span>
                    {billing === "yearly" && <p className="text-xs" style={{ color: "var(--text-muted)" }}>facturé {price * 12} €/an</p>}
                  </div>
                </div>
                <ul className="space-y-1 ml-7">
                  {plan.features.map((f) => <li key={f} className="text-sm" style={{ color: "var(--text-secondary)" }}>{f}</li>)}
                </ul>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-2">
          <button type="button"
            onClick={() => onStripeCheckout(selectedPlan, billing)}
            disabled={isPending || !orgId}
            className="w-full py-3 px-4 rounded-sm text-sm font-medium transition-colors disabled:opacity-60"
            style={{ backgroundColor: "var(--accent)", color: "#ffffff" }}>
            {isPending ? "Redirection..." : "Commencer l'essai gratuit — Paiement sécurisé"}
          </button>
          <button type="button" onClick={onTrialSubmit} disabled={isPending}
            className="w-full py-2.5 px-4 rounded-sm text-sm transition-colors disabled:opacity-60"
            style={{ color: "var(--text-muted)" }}>
            Commencer sans CB → payer plus tard
          </button>
          <button type="button" onClick={onBack} disabled={isPending} className="text-sm text-center" style={{ color: "var(--text-muted)" }}>Retour</button>
        </div>
      </div>
    </StepShell>
  );
}

function StepShell({ step, title, subtitle, optional, children }: { step: number; title: string; subtitle: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Étape {step} sur {TOTAL_STEPS}{optional ? " — optionnel" : ""}</p>
        <h1 className="text-2xl font-heading font-medium tracking-tight" style={{ color: "var(--foreground)" }}>{title}</h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{subtitle}</p>
      </div>
      <div className="rounded-sm border px-8 py-8" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>{children}</div>
    </div>
  );
}

function FormField({ id, label, ...props }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium" style={{ color: "var(--foreground)" }}>{label}</label>
      <input id={id} {...props} className="w-full rounded-sm border px-3.5 py-2.5 text-sm outline-none transition-colors"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)", color: "var(--foreground)" }}
        onFocus={(e) => (e.target.style.borderColor = "var(--foreground)")}
        onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
    </div>
  );
}

function StepActions({ submitLabel, skipLabel, onSkip, onBack, isPending }: { submitLabel: string; skipLabel?: string; onSkip?: () => void; onBack?: () => void; isPending: boolean }) {
  return (
    <div className="flex flex-col gap-3 pt-2">
      <button type="submit" disabled={isPending} className="w-full py-3 px-4 rounded-sm text-sm font-medium transition-colors disabled:opacity-60"
        style={{ backgroundColor: "var(--foreground)", color: "#ffffff" }}>
        {isPending ? "Enregistrement..." : submitLabel}
      </button>
      <div className="flex justify-between items-center">
        {onBack ? <button type="button" onClick={onBack} disabled={isPending} className="text-sm" style={{ color: "var(--text-muted)" }}>Retour</button> : <div />}
        {skipLabel && onSkip && <button type="button" onClick={onSkip} disabled={isPending} className="text-sm" style={{ color: "var(--text-muted)" }}>{skipLabel}</button>}
      </div>
    </div>
  );
}