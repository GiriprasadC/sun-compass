import { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDbData, updateStats, updateServices, updateContactInfo, updateSocialLinks, deleteEnquiry, updateHero, updateAbout, uploadImage, type DbData } from "@/lib/db";
import { Container } from "@/components/ui/Container";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  GraduationCap,
  Award,
  Share2,
  Trash2,
  Plus,
  Save,
  Loader2,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  X,
  Info,
  Upload
} from "lucide-react";

function resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<{ base64Data: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get 2d context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        const mimeType = "image/jpeg";
        const dataUrl = canvas.toDataURL(mimeType, 0.85);
        const base64Data = dataUrl.split(",")[1];
        resolve({ base64Data, mimeType });
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

const AVAILABLE_ICONS = [
  { name: "GraduationCap", label: "Graduation Cap" },
  { name: "Award", label: "Award / Ribbon" },
  { name: "Users", label: "Users / Scholars" },
  { name: "BookOpen", label: "Book Open" },
  { name: "BookOpenCheck", label: "Book with Checkmark" },
  { name: "BrainCircuit", label: "Brain Circuit" },
  { name: "Landmark", label: "Landmark / Pillar" },
];

function AdminPage() {
  const queryClient = useQueryClient();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "enquiries" | "services" | "stats" | "contact" | "heroAbout">("dashboard");

  // Fetch db data
  const { data: dbData, isLoading } = useQuery({
    queryKey: ["dbData"],
    queryFn: () => getDbData(),
  });

  // Check auth on load
  useEffect(() => {
    const auth = localStorage.getItem("sun_admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "admin123") {
      localStorage.setItem("sun_admin_auth", "true");
      setIsAuthenticated(true);
      toast.success("Welcome, Admin!");
    } else {
      toast.error("Incorrect passcode. Try 'admin123'");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sun_admin_auth");
    setIsAuthenticated(false);
    toast.info("Logged out successfully");
  };

  // Mutations
  const statsMutation = useMutation({
    mutationFn: (stats: DbData["stats"]) => updateStats({ data: stats }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dbData"] });
      toast.success("Statistics updated successfully");
    },
    onError: () => toast.error("Failed to update statistics"),
  });

  const servicesMutation = useMutation({
    mutationFn: (services: DbData["services"]) => updateServices({ data: services }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dbData"] });
      toast.success("Services updated successfully");
    },
    onError: () => toast.error("Failed to update services"),
  });

  const contactMutation = useMutation({
    mutationFn: (info: DbData["contactInfo"]) => updateContactInfo({ data: info }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dbData"] });
      toast.success("Contact information updated");
    },
    onError: () => toast.error("Failed to update contact info"),
  });

  const socialMutation = useMutation({
    mutationFn: (links: DbData["socialLinks"]) => updateSocialLinks({ data: links }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dbData"] });
      toast.success("Social media links updated");
    },
    onError: () => toast.error("Failed to update social links"),
  });

  const deleteEnquiryMutation = useMutation({
    mutationFn: (id: string) => deleteEnquiry({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dbData"] });
      toast.success("Enquiry deleted successfully");
    },
    onError: () => toast.error("Failed to delete enquiry"),
  });

  const heroMutation = useMutation({
    mutationFn: (hero: DbData["hero"]) => updateHero({ data: hero }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dbData"] });
      toast.success("Hero section updated successfully");
    },
    onError: () => toast.error("Failed to update Hero section"),
  });

  const aboutMutation = useMutation({
    mutationFn: (about: DbData["about"]) => updateAbout({ data: about }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dbData"] });
      toast.success("About section updated successfully");
    },
    onError: () => toast.error("Failed to update About section"),
  });

  // Services State management (local edit states)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [localServices, setLocalServices] = useState<any[]>([]);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  // Hero & About State management (local edit arrays)
  const [aboutCredentials, setAboutCredentials] = useState<string[]>([]);
  const [aboutAffiliations, setAboutAffiliations] = useState<string[]>([]);
  const [aboutBulletPoints, setAboutBulletPoints] = useState<string[]>([]);
  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [aboutImageUrl, setAboutImageUrl] = useState("");
  const [isHeroUploading, setIsHeroUploading] = useState(false);
  const [isAboutUploading, setIsAboutUploading] = useState(false);

  // Sync server data to local edit forms
  useEffect(() => {
    if (dbData?.services) {
      setLocalServices(dbData.services);
    }
    if (dbData?.hero) {
      setHeroImageUrl(dbData.hero.imageUrl || "");
    }
    if (dbData?.about) {
      setAboutCredentials(dbData.about.credentials || []);
      setAboutAffiliations(dbData.about.affiliations || []);
      setAboutBulletPoints(dbData.about.bulletPoints || []);
      setAboutImageUrl(dbData.about.imageUrl || "");
    }
  }, [dbData]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Auth lock screen
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-3xl border border-border bg-white p-8 shadow-elevated"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-tint text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="mt-6 text-center font-display text-2xl font-bold text-foreground">
            Admin Panel Access
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Please enter your administrator passcode to configure website modules.
          </p>
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label htmlFor="passcode" className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Passcode
              </label>
              <input
                id="passcode"
                type="password"
                placeholder="Enter admin passcode"
                className="mt-1.5 w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-hover shadow-soft"
            >
              Unlock Dashboard
              <ChevronRight className="ml-1 h-4 w-4" />
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Loaded database structure
  const stats = dbData?.stats || [];
  const enquiries = dbData?.enquiries || [];
  const contactInfo = dbData?.contactInfo || { directorName: "", directorSub: "", address: "", phone: "", email: "", officeHours: "" };
  const socialLinks = dbData?.socialLinks || { facebook: "", linkedin: "", instagram: "", youtube: "" };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Admin Console</h1>
            <p className="text-sm text-muted-foreground">
              Configure services, stats, contact listings, and check submitted enquiries.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="self-start rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:bg-slate-50 hover:text-foreground"
          >
            Logout
          </button>
        </div>

        {/* Tab Selection */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-px">
          {[
            { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
            { id: "enquiries", label: `Enquiries (${enquiries.length})`, Icon: MessageSquare },
            { id: "services", label: "Manage Services", Icon: GraduationCap },
            { id: "stats", label: "Stats (Why Choose Us)", Icon: Award },
            { id: "contact", label: "Contact & Socials", Icon: Share2 },
            { id: "heroAbout", label: "Hero & About", Icon: Info },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Panes */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* DASHBOARD TAB */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Info Row */}
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Services Active
                      </div>
                      <div className="mt-2 text-3xl font-bold text-foreground">
                        {localServices.length}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Homepage Stats
                      </div>
                      <div className="mt-2 text-3xl font-bold text-foreground">
                        {stats.length}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-white p-6 shadow-soft">
                      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Submitted Enquiries
                      </div>
                      <div className="mt-2 text-3xl font-bold text-foreground">
                        {enquiries.length}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-border bg-white p-6 shadow-soft bg-primary-tint/20">
                      <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                        System Status
                      </div>
                      <div className="mt-2 flex items-center gap-1.5 text-lg font-bold text-primary">
                        <CheckCircle className="h-5 w-5" />
                        Online & Running
                      </div>
                    </div>
                  </div>

                  {/* Recent Enquiries Quick View */}
                  <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Recent Enquiries
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Latest submissions from the contact form.
                    </p>
                    {enquiries.length === 0 ? (
                      <div className="mt-6 py-12 text-center text-sm text-muted-foreground">
                        No submissions received yet.
                      </div>
                    ) : (
                      <div className="mt-6 space-y-4">
                        {enquiries.slice(0, 3).map((e) => (
                          <div
                            key={e.id}
                            className="flex flex-col justify-between gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-start"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{e.name}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {new Date(e.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Phone className="h-3.5 w-3.5" />
                                  {e.phone}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3.5 w-3.5" />
                                  {e.email}
                                </span>
                              </div>
                              <p className="mt-2 text-sm text-foreground/80 leading-relaxed">
                                {e.message}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteEnquiryMutation.mutate(e.id)}
                              disabled={deleteEnquiryMutation.isPending}
                              className="self-end rounded-lg p-2 text-muted-foreground hover:bg-destructive-foreground hover:text-destructive sm:self-start"
                              title="Delete enquiry"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        ))}
                        {enquiries.length > 3 && (
                          <button
                            onClick={() => setActiveTab("enquiries")}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                          >
                            View all enquiries ({enquiries.length})
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ENQUIRIES TAB */}
              {activeTab === "enquiries" && (
                <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Enquiry Inbox
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Review and clean up messages sent by website visitors.
                  </p>

                  {enquiries.length === 0 ? (
                    <div className="py-20 text-center text-sm text-muted-foreground">
                      No message submissions in the database.
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      {enquiries.map((e) => (
                        <div
                          key={e.id}
                          className="flex flex-col justify-between gap-4 rounded-xl border border-border p-5 transition-colors hover:bg-slate-50/50 sm:flex-row sm:items-start"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground">{e.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(e.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                              <a href={`tel:${e.phone}`} className="flex items-center gap-1 hover:text-primary">
                                <Phone className="h-3.5 w-3.5" />
                                {e.phone}
                              </a>
                              <a href={`mailto:${e.email}`} className="flex items-center gap-1 hover:text-primary">
                                <Mail className="h-3.5 w-3.5" />
                                {e.email}
                              </a>
                            </div>
                            <p className="mt-3 text-sm leading-relaxed text-foreground/80">
                              {e.message}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this enquiry?")) {
                                deleteEnquiryMutation.mutate(e.id);
                              }
                            }}
                            className="self-end rounded-lg p-2 text-muted-foreground hover:bg-destructive-foreground hover:text-destructive sm:self-start"
                            title="Delete enquiry"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* SERVICES TAB */}
              {activeTab === "services" && (
                <div className="grid gap-6 lg:grid-cols-3">
                  {/* List of services */}
                  <div className="space-y-4 lg:col-span-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-foreground">Services</h3>
                      <button
                        onClick={() => {
                          const newService = {
                            id: Math.random().toString(36).substring(2, 9),
                            icon: "GraduationCap",
                            title: "New Academic Programme",
                            summary: "Short description of the new programme.",
                            items: ["Curriculum item 1"],
                            methodology: [],
                            duration: "",
                            venue: "",
                            timing: ""
                          };
                          const updated = [...localServices, newService];
                          setLocalServices(updated);
                          setSelectedService(newService);
                        }}
                        className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-soft"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Service
                      </button>
                    </div>

                    <div className="space-y-2">
                      {localServices.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedService(s)}
                          className={`w-full rounded-xl border p-4 text-left transition-all ${
                            selectedService?.id === s.id
                              ? "border-primary bg-primary-tint/30 shadow-soft"
                              : "border-border bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="font-semibold text-foreground">{s.title}</div>
                          <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {s.summary}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Editing form panel */}
                  <div className="lg:col-span-2">
                    {selectedService ? (
                      <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                        <div className="flex items-center justify-between border-b border-border pb-4">
                          <h4 className="font-display text-lg font-bold text-foreground">
                            Edit Service: {selectedService.title}
                          </h4>
                          <button
                            onClick={() => {
                              if (confirm("Are you sure you want to delete this service?")) {
                                const updated = localServices.filter((s) => s.id !== selectedService.id);
                                setLocalServices(updated);
                                setSelectedService(null);
                                servicesMutation.mutate(updated);
                              }
                            }}
                            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive-foreground"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>

                        <div className="mt-6 space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Icon Style
                              </label>
                              <select
                                className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                                value={selectedService.icon}
                                onChange={(e) => {
                                  const updatedVal = { ...selectedService, icon: e.target.value };
                                  setSelectedService(updatedVal);
                                  setLocalServices(localServices.map((s) => (s.id === selectedService.id ? updatedVal : s)));
                                }}
                              >
                                {AVAILABLE_ICONS.map((i) => (
                                  <option key={i.name} value={i.name}>
                                    {i.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Programme Name
                              </label>
                              <input
                                type="text"
                                className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                                value={selectedService.title}
                                onChange={(e) => {
                                  const updatedVal = { ...selectedService, title: e.target.value };
                                  setSelectedService(updatedVal);
                                  setLocalServices(localServices.map((s) => (s.id === selectedService.id ? updatedVal : s)));
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Summary Description
                            </label>
                            <textarea
                              rows={3}
                              className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-y"
                              value={selectedService.summary}
                              onChange={(e) => {
                                const updatedVal = { ...selectedService, summary: e.target.value };
                                setSelectedService(updatedVal);
                                setLocalServices(localServices.map((s) => (s.id === selectedService.id ? updatedVal : s)));
                              }}
                            />
                          </div>

                          <div className="grid gap-4 sm:grid-cols-3">
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Duration (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 1-3 Days"
                                className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                                value={selectedService.duration || ""}
                                onChange={(e) => {
                                  const updatedVal = { ...selectedService, duration: e.target.value };
                                  setSelectedService(updatedVal);
                                  setLocalServices(localServices.map((s) => (s.id === selectedService.id ? updatedVal : s)));
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Venue (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Host Institution"
                                className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                                value={selectedService.venue || ""}
                                onChange={(e) => {
                                  const updatedVal = { ...selectedService, venue: e.target.value };
                                  setSelectedService(updatedVal);
                                  setLocalServices(localServices.map((s) => (s.id === selectedService.id ? updatedVal : s)));
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Timing (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 9:00 AM - 4:00 PM"
                                className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                                value={selectedService.timing || ""}
                                onChange={(e) => {
                                  const updatedVal = { ...selectedService, timing: e.target.value };
                                  setSelectedService(updatedVal);
                                  setLocalServices(localServices.map((s) => (s.id === selectedService.id ? updatedVal : s)));
                                }}
                              />
                            </div>
                          </div>

                          {/* Bullet points items list */}
                          <div className="space-y-2 border-t border-border pt-4">
                            <div className="flex items-center justify-between">
                              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Curriculum / Core Subjects
                              </label>
                              <button
                                onClick={() => {
                                  const updatedItems = [...(selectedService.items || []), ""];
                                  const updatedVal = { ...selectedService, items: updatedItems };
                                  setSelectedService(updatedVal);
                                  setLocalServices(localServices.map((s) => (s.id === selectedService.id ? updatedVal : s)));
                                }}
                                className="inline-flex items-center gap-0.5 text-xs text-primary hover:underline"
                              >
                                <Plus className="h-3 w-3" />
                                Add Item
                              </button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              {(selectedService.items || []).map((item: string, idx: number) => (
                                <div key={idx} className="flex gap-2">
                                  <input
                                    type="text"
                                    className="w-full rounded-xl border border-border px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                                    value={item}
                                    onChange={(e) => {
                                      const newItems = [...selectedService.items];
                                      newItems[idx] = e.target.value;
                                      const updatedVal = { ...selectedService, items: newItems };
                                      setSelectedService(updatedVal);
                                      setLocalServices(localServices.map((s) => (s.id === selectedService.id ? updatedVal : s)));
                                    }}
                                  />
                                  <button
                                    onClick={() => {
                                      const newItems = selectedService.items.filter((_: any, i: number) => i !== idx);
                                      const updatedVal = { ...selectedService, items: newItems };
                                      setSelectedService(updatedVal);
                                      setLocalServices(localServices.map((s) => (s.id === selectedService.id ? updatedVal : s)));
                                    }}
                                    className="rounded-lg p-2 text-muted-foreground hover:bg-slate-100 hover:text-destructive"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Methodologies */}
                          <div className="space-y-2 border-t border-border pt-4">
                            <div className="flex items-center justify-between">
                              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Methodology (Optional)
                              </label>
                              <button
                                onClick={() => {
                                  const updatedM = [...(selectedService.methodology || []), ""];
                                  const updatedVal = { ...selectedService, methodology: updatedM };
                                  setSelectedService(updatedVal);
                                  setLocalServices(localServices.map((s) => (s.id === selectedService.id ? updatedVal : s)));
                                }}
                                className="inline-flex items-center gap-0.5 text-xs text-primary hover:underline"
                              >
                                <Plus className="h-3 w-3" />
                                Add Item
                              </button>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                              {(selectedService.methodology || []).map((m: string, idx: number) => (
                                <div key={idx} className="flex gap-2">
                                  <input
                                    type="text"
                                    className="w-full rounded-xl border border-border px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                                    value={m}
                                    onChange={(e) => {
                                      const newM = [...selectedService.methodology];
                                      newM[idx] = e.target.value;
                                      const updatedVal = { ...selectedService, methodology: newM };
                                      setSelectedService(updatedVal);
                                      setLocalServices(localServices.map((s) => (s.id === selectedService.id ? updatedVal : s)));
                                    }}
                                  />
                                  <button
                                    onClick={() => {
                                      const newM = selectedService.methodology.filter((_: any, i: number) => i !== idx);
                                      const updatedVal = { ...selectedService, methodology: newM };
                                      setSelectedService(updatedVal);
                                      setLocalServices(localServices.map((s) => (s.id === selectedService.id ? updatedVal : s)));
                                    }}
                                    className="rounded-lg p-2 text-muted-foreground hover:bg-slate-100 hover:text-destructive"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border pt-4">
                            <button
                              onClick={() => servicesMutation.mutate(localServices)}
                              disabled={servicesMutation.isPending}
                              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-soft"
                            >
                              {servicesMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="h-4 w-4" />
                              )}
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-white p-10 text-center">
                        <GraduationCap className="h-12 w-12 text-muted-foreground/50" />
                        <h4 className="mt-4 font-semibold text-foreground">No Service Selected</h4>
                        <p className="mt-1 text-sm text-muted-foreground max-w-xs">
                          Click on a service card from the left panel to edit its curriculum, details, and labels.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STATS TAB */}
              {activeTab === "stats" && (
                <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    Configure Stats (Why Choose Us)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Modify the numeric statistics counters displayed on the homepage.
                  </p>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((s: any, idx: number) => (
                      <div key={idx} className="rounded-2xl border border-border p-4 shadow-sm bg-slate-50/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-primary">Stat Card #{idx + 1}</span>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Icon
                          </label>
                          <select
                            className="mt-1 w-full rounded-lg border border-border bg-white px-2 py-1.5 text-xs text-foreground outline-none"
                            value={s.icon}
                            onChange={(e) => {
                              const updatedStats = [...stats];
                              updatedStats[idx] = { ...s, icon: e.target.value };
                              statsMutation.mutate(updatedStats);
                            }}
                          >
                            {AVAILABLE_ICONS.map((i) => (
                              <option key={i.name} value={i.name}>
                                {i.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Label
                          </label>
                          <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-xs text-foreground outline-none"
                            value={s.label}
                            onChange={(e) => {
                              const updatedStats = [...stats];
                              updatedStats[idx] = { ...s, label: e.target.value };
                              statsMutation.mutate(updatedStats);
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Value
                            </label>
                            <input
                              type="number"
                              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-xs text-foreground outline-none"
                              value={s.value}
                              onChange={(e) => {
                                const updatedStats = [...stats];
                                updatedStats[idx] = { ...s, value: parseInt(e.target.value) || 0 };
                                statsMutation.mutate(updatedStats);
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                              Suffix
                            </label>
                            <input
                              type="text"
                              className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-xs text-foreground outline-none"
                              value={s.suffix}
                              onChange={(e) => {
                                const updatedStats = [...stats];
                                updatedStats[idx] = { ...s, suffix: e.target.value };
                                statsMutation.mutate(updatedStats);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CONTACT & SOCIALS TAB */}
              {activeTab === "contact" && (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Contact form */}
                  <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Contact Information
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Edit details displayed on contact forms, navigation, and the footer.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const data = {
                          directorName: formData.get("directorName") as string,
                          directorSub: formData.get("directorSub") as string,
                          address: formData.get("address") as string,
                          phone: formData.get("phone") as string,
                          email: formData.get("email") as string,
                          officeHours: formData.get("officeHours") as string,
                          mapEmbedUrl: formData.get("mapEmbedUrl") as string || "",
                        };
                        contactMutation.mutate(data);
                      }}
                      className="mt-6 space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Director Name
                        </label>
                        <input
                          type="text"
                          name="directorName"
                          defaultValue={contactInfo.directorName}
                          className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Director Designation / Subtitle
                        </label>
                        <input
                          type="text"
                          name="directorSub"
                          defaultValue={contactInfo.directorSub}
                          className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Office Address
                        </label>
                        <textarea
                          rows={3}
                          name="address"
                          defaultValue={contactInfo.address}
                          className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-y"
                        />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Office Phone
                          </label>
                          <input
                            type="text"
                            name="phone"
                            defaultValue={contactInfo.phone}
                            className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Office Email
                          </label>
                          <input
                            type="email"
                            name="email"
                            defaultValue={contactInfo.email}
                            className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Office Hours
                        </label>
                        <input
                          type="text"
                          name="officeHours"
                          defaultValue={contactInfo.officeHours}
                          className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Custom Google Maps Embed URL (Optional)
                        </label>
                        <input
                          type="url"
                          placeholder="https://www.google.com/maps/embed?..."
                          name="mapEmbedUrl"
                          defaultValue={contactInfo.mapEmbedUrl}
                          className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={contactMutation.isPending}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-soft"
                      >
                        {contactMutation.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Save className="h-3.5 w-3.5" />
                        )}
                        Save Details
                      </button>
                    </form>
                  </div>

                  {/* Social media links form */}
                  <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      Social Media Channels
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Edit URLs for follow links at the bottom of the page.
                    </p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const data = {
                          facebook: formData.get("facebook") as string,
                          linkedin: formData.get("linkedin") as string,
                          instagram: formData.get("instagram") as string,
                          youtube: formData.get("youtube") as string,
                        };
                        socialMutation.mutate(data);
                      }}
                      className="mt-6 space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Facebook Profile Link
                        </label>
                        <input
                          type="url"
                          placeholder="https://facebook.com/..."
                          name="facebook"
                          defaultValue={socialLinks.facebook}
                          className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          LinkedIn Page Link
                        </label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/..."
                          name="linkedin"
                          defaultValue={socialLinks.linkedin}
                          className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Instagram Profile Link
                        </label>
                        <input
                          type="url"
                          placeholder="https://instagram.com/..."
                          name="instagram"
                          defaultValue={socialLinks.instagram}
                          className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          YouTube Channel Link
                        </label>
                        <input
                          type="url"
                          placeholder="https://youtube.com/c/..."
                          name="youtube"
                          defaultValue={socialLinks.youtube}
                          className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={socialMutation.isPending}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-soft"
                      >
                        {socialMutation.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Save className="h-3.5 w-3.5" />
                        )}
                        Save Social Links
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* HERO & ABOUT TAB */}
              {activeTab === "heroAbout" && (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Hero Settings */}
                  <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                    <h3 className="font-display text-lg font-bold text-foreground">Hero Section</h3>
                    <p className="text-xs text-muted-foreground">Customize titles, badge texts, and experience metrics in the Hero section.</p>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const data = {
                          badge: formData.get("badge") as string,
                          title: formData.get("title") as string,
                          subtitle: formData.get("subtitle") as string,
                          experienceText: formData.get("experienceText") as string,
                          experienceSub: formData.get("experienceSub") as string,
                          imageUrl: heroImageUrl,
                        };
                        heroMutation.mutate(data);
                      }}
                      className="mt-6 space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Badge Text</label>
                        <input type="text" name="badge" defaultValue={dbData?.hero?.badge} className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Headline Title</label>
                        <input type="text" name="title" defaultValue={dbData?.hero?.title} className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description Subtitle</label>
                        <textarea rows={4} name="subtitle" defaultValue={dbData?.hero?.subtitle} className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-y" />
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stats Card Value</label>
                          <input type="text" name="experienceText" defaultValue={dbData?.hero?.experienceText} className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stats Card Description</label>
                          <input type="text" name="experienceSub" defaultValue={dbData?.hero?.experienceSub} className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Hero Image</label>
                        <div className="flex gap-2 mt-1.5">
                          <input
                            type="text"
                            placeholder="Default local asset used if empty"
                            value={heroImageUrl}
                            onChange={(e) => setHeroImageUrl(e.target.value)}
                            className="w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                          />
                          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-border bg-slate-50 px-4 py-2 hover:bg-slate-100 transition-colors">
                            {isHeroUploading ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : (
                              <Upload className="h-4 w-4 text-muted-foreground" />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsHeroUploading(true);

                                resizeImage(file, 1200, 1200)
                                  .then(async ({ base64Data, mimeType }) => {
                                    try {
                                      const res = await uploadImage({
                                        data: {
                                          filename: file.name,
                                          mimeType,
                                          base64Data,
                                        }
                                      });
                                      if (res.success && res.url) {
                                        setHeroImageUrl(res.url);
                                        toast.success("Hero image uploaded successfully");
                                      } else {
                                        toast.error(res.error || "Failed to upload image");
                                      }
                                    } catch (err) {
                                      toast.error("Error uploading image");
                                    } finally {
                                      setIsHeroUploading(false);
                                    }
                                  })
                                  .catch((err) => {
                                    toast.error("Failed to process image: " + err.message);
                                    setIsHeroUploading(false);
                                  });
                              }}
                            />
                          </label>
                        </div>
                        {heroImageUrl && (
                          <div className="mt-2 relative h-20 w-32 rounded-xl overflow-hidden border border-border">
                            <img src={heroImageUrl} className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setHeroImageUrl("")}
                              className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>
                      <button type="submit" disabled={heroMutation.isPending} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-soft">
                        {heroMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        Save Hero Section
                      </button>
                    </form>
                  </div>

                  {/* About Settings */}
                  <div className="rounded-3xl border border-border bg-white p-6 shadow-soft">
                    <h3 className="font-display text-lg font-bold text-foreground">Director's Biography (About Section)</h3>
                    <p className="text-xs text-muted-foreground">Modify credentials, titles, bio paragraphs, and working partnerships.</p>
                    <div className="mt-6 space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Director Name</label>
                        <input type="text" id="about-name" defaultValue={dbData?.about?.name} className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Designation Subtitle</label>
                        <input type="text" id="about-designation" defaultValue={dbData?.about?.designation} className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Biography Paragraph</label>
                        <textarea rows={4} id="about-bio" defaultValue={dbData?.about?.bio} className="mt-1.5 w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-y" />
                      </div>
                      
                      {/* Dynamic Credentials list */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Credentials Tags (e.g. Ph.D)</label>
                          <button onClick={() => {
                            const newCreds = [...aboutCredentials, ""];
                            setAboutCredentials(newCreds);
                          }} className="text-xs text-primary hover:underline flex items-center gap-0.5"><Plus className="h-3 w-3" /> Add</button>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-border p-2 rounded-xl">
                          {aboutCredentials.map((c, idx) => (
                            <div key={idx} className="flex items-center gap-1 bg-slate-50 border border-border rounded-lg px-2 py-1 text-xs">
                              <input type="text" value={c} onChange={(e) => {
                                const newCreds = [...aboutCredentials];
                                newCreds[idx] = e.target.value;
                                setAboutCredentials(newCreds);
                              }} className="w-16 bg-transparent border-0 outline-none font-semibold text-foreground text-center" />
                              <button onClick={() => {
                                setAboutCredentials(aboutCredentials.filter((_, i) => i !== idx));
                              }} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic Affiliations list */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Affiliated Organizations (Worked with)</label>
                          <button onClick={() => {
                            const newAff = [...aboutAffiliations, ""];
                            setAboutAffiliations(newAff);
                          }} className="text-xs text-primary hover:underline flex items-center gap-0.5"><Plus className="h-3 w-3" /> Add</button>
                        </div>
                        <div className="mt-1.5 flex flex-wrap gap-2 max-h-32 overflow-y-auto border border-border p-2 rounded-xl">
                          {aboutAffiliations.map((a, idx) => (
                            <div key={idx} className="flex items-center gap-1 bg-slate-50 border border-border rounded-lg px-2 py-1 text-xs">
                              <input type="text" value={a} onChange={(e) => {
                                const newAff = [...aboutAffiliations];
                                newAff[idx] = e.target.value;
                                setAboutAffiliations(newAff);
                              }} className="w-32 bg-transparent border-0 outline-none font-semibold text-foreground text-center" />
                              <button onClick={() => {
                                setAboutAffiliations(aboutAffiliations.filter((_, i) => i !== idx));
                              }} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Highlights Bullet points */}
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Highlights Bullet Points</label>
                          <button onClick={() => {
                            const newPoints = [...aboutBulletPoints, ""];
                            setAboutBulletPoints(newPoints);
                          }} className="text-xs text-primary hover:underline flex items-center gap-0.5"><Plus className="h-3 w-3" /> Add</button>
                        </div>
                        <div className="mt-1.5 space-y-2 max-h-40 overflow-y-auto">
                          {aboutBulletPoints.map((bp, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input type="text" value={bp} onChange={(e) => {
                                const newPoints = [...aboutBulletPoints];
                                newPoints[idx] = e.target.value;
                                setAboutBulletPoints(newPoints);
                              }} className="w-full rounded-xl border border-border px-3 py-2 text-xs text-foreground outline-none focus:border-primary" />
                              <button onClick={() => {
                                setAboutBulletPoints(aboutBulletPoints.filter((_, i) => i !== idx));
                              }} className="rounded-lg p-2 text-muted-foreground hover:bg-slate-100 hover:text-destructive"><X className="h-4 w-4" /></button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Biography Image</label>
                        <div className="flex gap-2 mt-1.5">
                          <input
                            type="text"
                            placeholder="Default local asset used if empty"
                            value={aboutImageUrl}
                            onChange={(e) => setAboutImageUrl(e.target.value)}
                            className="w-full rounded-xl border border-border px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                          />
                          <label className="flex cursor-pointer items-center justify-center rounded-xl border border-border bg-slate-50 px-4 py-2 hover:bg-slate-100 transition-colors">
                            {isAboutUploading ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : (
                              <Upload className="h-4 w-4 text-muted-foreground" />
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsAboutUploading(true);

                                resizeImage(file, 1200, 1200)
                                  .then(async ({ base64Data, mimeType }) => {
                                    try {
                                      const res = await uploadImage({
                                        data: {
                                          filename: file.name,
                                          mimeType,
                                          base64Data,
                                        }
                                      });
                                      if (res.success && res.url) {
                                        setAboutImageUrl(res.url);
                                        toast.success("Biography image uploaded successfully");
                                      } else {
                                        toast.error(res.error || "Failed to upload image");
                                      }
                                    } catch (err) {
                                      toast.error("Error uploading image");
                                    } finally {
                                      setIsAboutUploading(false);
                                    }
                                  })
                                  .catch((err) => {
                                    toast.error("Failed to process image: " + err.message);
                                    setIsAboutUploading(false);
                                  });
                              }}
                            />
                          </label>
                        </div>
                        {aboutImageUrl && (
                          <div className="mt-2 relative h-20 w-32 rounded-xl overflow-hidden border border-border">
                            <img src={aboutImageUrl} className="h-full w-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setAboutImageUrl("")}
                              className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          const name = (document.getElementById("about-name") as HTMLInputElement).value;
                          const designation = (document.getElementById("about-designation") as HTMLInputElement).value;
                          const bio = (document.getElementById("about-bio") as HTMLTextAreaElement).value;
                          
                          aboutMutation.mutate({
                            name,
                            designation,
                            bio,
                            credentials: aboutCredentials.filter(Boolean),
                            affiliations: aboutAffiliations.filter(Boolean),
                            bulletPoints: aboutBulletPoints.filter(Boolean),
                            imageUrl: aboutImageUrl,
                          });
                        }}
                        disabled={aboutMutation.isPending}
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-hover shadow-soft"
                      >
                        {aboutMutation.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                        Save About Section
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}
