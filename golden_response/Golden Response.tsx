/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║       CropGuard AI — Crop Health Monitoring & Disease Detection      ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  Stack   : React 18 · TypeScript · Tailwind CSS · Recharts          ║
 * ║  Models  : EfficientNet / ResNet / CNN  (backend ML inference)       ║
 * ║  File    : CropGuardDashboard.tsx  (single-file, copy-paste ready)  ║
 * ╠══════════════════════════════════════════════════════════════════════╣
 * ║  SETUP                                                               ║
 * ║  1. npm install recharts lucide-react                                ║
 * ║  2. npm install -D tailwindcss @tailwindcss/vite (or postcss)        ║
 * ║  3. Add `"use client"` at top for Next.js App Router                 ║
 * ║  4. Import and drop <CropGuardDashboard /> anywhere in your app      ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

"use client";

import React, { useState, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Leaf,
  LayoutDashboard,
  Upload,
  History,
  Bell,
  MapPin,
  Lightbulb,
  CloudRain,
  FileText,
  Camera,
  AlertTriangle,
  ShieldCheck,
  Virus,
  Brain,
  Pill,
  FlaskConical,
  Droplets,
  Activity,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Cloud,
  Settings,
  BarChart3,
  Microscope,
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type Severity = "critical" | "moderate" | "healthy";
type Trend = "up" | "down" | "neutral";

interface IMetricCard {
  label: string;
  value: string;
  change: string;
  trend: Trend;
  color: string;
  icon: React.ReactNode;
}

interface IDiseaseItem {
  name: string;
  crop: string;
  confidence: number;
  severity: Severity;
}

interface IHistoryRow {
  crop: string;
  field: string;
  result: Severity;
  confidence: number;
  time: string;
}

interface IWeatherDay {
  day: string;
  emoji: string;
  temp: string;
  riskLevel: number; // 0–100
  riskColor: string;
}

interface ITrendPoint {
  day: string;
  score: number;
}

interface IRecommendationCard {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  items: string[];
}

interface ISidebarSection {
  label: string;
  items: { icon: React.ReactNode; label: string; active?: boolean; badge?: number }[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOCK DATA  (replace with real API calls)
// ═══════════════════════════════════════════════════════════════════════════════

const METRICS: IMetricCard[] = [
  {
    label: "Total Crops Monitored",
    value: "1,284",
    change: "+48 this week",
    trend: "up",
    color: "text-emerald-600",
    icon: <Leaf size={16} />,
  },
  {
    label: "Healthy Crops",
    value: "934",
    change: "72.7% of total",
    trend: "up",
    color: "text-green-600",
    icon: <ShieldCheck size={16} />,
  },
  {
    label: "Disease Detected",
    value: "312",
    change: "24.3% of total",
    trend: "down",
    color: "text-red-500",
    icon: <Virus size={16} />,
  },
  {
    label: "AI Accuracy",
    value: "96.4%",
    change: "EfficientNet model",
    trend: "neutral",
    color: "text-blue-500",
    icon: <Brain size={16} />,
  },
];

const DISEASE_DATA: IDiseaseItem[] = [
  { name: "Late Blight",        crop: "Tomato · 3 fields",    confidence: 87, severity: "critical" },
  { name: "Powdery Mildew",     crop: "Wheat · 2 fields",     confidence: 62, severity: "moderate" },
  { name: "Leaf Rust",          crop: "Rice · 1 field",       confidence: 58, severity: "moderate" },
  { name: "Healthy (Verified)", crop: "Maize · all fields",   confidence: 95, severity: "healthy"  },
];

const HISTORY_ROWS: IHistoryRow[] = [
  { crop: "Tomato", field: "Field B", result: "critical", confidence: 87, time: "2m ago" },
  { crop: "Wheat",  field: "Field D", result: "moderate", confidence: 62, time: "1h ago" },
  { crop: "Rice",   field: "Field A", result: "healthy",  confidence: 95, time: "3h ago" },
  { crop: "Maize",  field: "Field C", result: "healthy",  confidence: 91, time: "6h ago" },
  { crop: "Potato", field: "Field E", result: "moderate", confidence: 74, time: "1d ago" },
];

const TREND_DATA: ITrendPoint[] = [
  { day: "Mon", score: 68 },
  { day: "Tue", score: 72 },
  { day: "Wed", score: 69 },
  { day: "Thu", score: 75 },
  { day: "Fri", score: 71 },
  { day: "Sat", score: 78 },
  { day: "Sun", score: 74 },
];

const DONUT_DATA = [
  { name: "Healthy",  value: 934, color: "#16a34a" },
  { name: "Mild",     value: 234, color: "#d97706" },
  { name: "Critical", value: 116, color: "#ef4444" },
];

const WEATHER: IWeatherDay[] = [
  { day: "Mon", emoji: "☁️",  temp: "28°C", riskLevel: 70, riskColor: "#3b82f6" },
  { day: "Tue", emoji: "🌧️", temp: "24°C", riskLevel: 90, riskColor: "#ef4444" },
  { day: "Wed", emoji: "⛅",  temp: "31°C", riskLevel: 50, riskColor: "#d97706" },
  { day: "Thu", emoji: "☀️",  temp: "35°C", riskLevel: 20, riskColor: "#16a34a" },
  { day: "Fri", emoji: "☀️",  temp: "34°C", riskLevel: 15, riskColor: "#16a34a" },
];

const GAUGE_DATA = [
  { value: 74, color: "#16a34a" },
  { value: 26, color: "#f3f4f6" },
];

const RECOMMENDATION_CARDS: IRecommendationCard[] = [
  {
    title: "Disease Treatment",
    icon: <Pill size={18} className="text-red-500" />,
    iconBg: "bg-red-50",
    items: [
      "Apply Mancozeb 75% WP (2.5 g/L) spray for Late Blight",
      "Remove and destroy infected foliage immediately",
      "Use copper-based fungicide every 7 days",
      "Avoid overhead irrigation to limit spread",
    ],
  },
  {
    title: "Fertilizer Guidance",
    icon: <FlaskConical size={18} className="text-green-600" />,
    iconBg: "bg-green-50",
    items: [
      "Apply NPK 19:19:19 @ 150 kg/ha for Tomato",
      "Foliar spray of Boron 0.2% to strengthen immunity",
      "Micronutrient mix (Zn, Fe, Mn) post-disease control",
      "Avoid high-nitrogen fertilizers during infection",
    ],
  },
  {
    title: "Irrigation & Prevention",
    icon: <Droplets size={18} className="text-blue-500" />,
    iconBg: "bg-blue-50",
    items: [
      "Switch to drip irrigation to reduce leaf wetness",
      "Water early morning, allow foliage to dry by noon",
      "Maintain 60–70% soil moisture for Tomato fields",
      "Rotate crops next season to break disease cycle",
    ],
  },
];

const SIDEBAR_SECTIONS: ISidebarSection[] = [
  {
    label: "Overview",
    items: [
      { icon: <LayoutDashboard size={16} />, label: "Dashboard",          active: true  },
      { icon: <Upload size={16} />,          label: "Upload Crop Image",   active: false },
      { icon: <History size={16} />,         label: "Upload History",      active: false },
    ],
  },
  {
    label: "Monitoring",
    items: [
      { icon: <Leaf size={16} />,    label: "Crop Monitor", active: false              },
      { icon: <Bell size={16} />,    label: "Alerts",       active: false, badge: 3   },
      { icon: <MapPin size={16} />,  label: "Field Map",    active: false              },
    ],
  },
  {
    label: "Insights",
    items: [
      { icon: <Lightbulb size={16} />, label: "Recommendations",  active: false },
      { icon: <CloudRain size={16} />, label: "Weather Advisory",  active: false },
      { icon: <FileText size={16} />,  label: "Reports",           active: false },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SHARED HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

/** Coloured pill badge for disease severity */
const SeverityPill: React.FC<{ severity: Severity }> = ({ severity }) => {
  const map: Record<Severity, { cls: string; label: string }> = {
    critical: { cls: "bg-red-50   text-red-600   border border-red-200",   label: "Critical" },
    moderate: { cls: "bg-amber-50 text-amber-600 border border-amber-200", label: "Moderate" },
    healthy:  { cls: "bg-green-50 text-green-700 border border-green-200", label: "Healthy"  },
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[severity].cls}`}>
      {map[severity].label}
    </span>
  );
};

/** Animated confidence progress bar */
const ConfidenceBar: React.FC<{ value: number; severity: Severity }> = ({ value, severity }) => {
  const barColor: Record<Severity, string>  = { critical: "bg-red-500",   moderate: "bg-amber-500", healthy: "bg-green-500"  };
  const textColor: Record<Severity, string> = { critical: "text-red-600", moderate: "text-amber-600", healthy: "text-green-600" };
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">Confidence Score</span>
        <span className={`font-medium ${textColor[severity]}`}>{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${barColor[severity]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

/** Reusable panel wrapper */
const Panel: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({
  title, icon, children, className = "",
}) => (
  <div className={`bg-white border border-gray-100 rounded-2xl p-4 ${className}`}>
    <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 mb-3">
      <span className="text-gray-400">{icon}</span>
      {title}
    </h3>
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// TOPBAR
// ═══════════════════════════════════════════════════════════════════════════════

const Topbar: React.FC = () => {
  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={14} />, active: true  },
    { label: "Diagnose",  icon: <Microscope size={14} />,      active: false },
    { label: "Analytics", icon: <BarChart3 size={14} />,       active: false },
    { label: "Settings",  icon: <Settings size={14} />,        active: false },
  ];

  return (
    <header className="bg-white border-b border-gray-100 px-5 h-14 flex items-center justify-between flex-shrink-0 z-10">
      {/* ── Logo ── */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
          <Leaf size={15} color="white" />
        </div>
        <span className="font-semibold text-gray-900 text-[15px] tracking-tight">
          CropGuard AI
        </span>
      </div>

      {/* ── Nav ── */}
      <nav className="flex items-center gap-1" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              item.active
                ? "bg-green-50 text-green-700"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>

      {/* ── User pill ── */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5">
        <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center">
          <span className="text-[10px] font-semibold text-white">RS</span>
        </div>
        <span className="text-sm text-gray-600">Rajiv Singh</span>
      </div>
    </header>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════════

const Sidebar: React.FC = () => (
  <aside className="w-52 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col py-3 px-2 gap-1">
    {SIDEBAR_SECTIONS.map((section) => (
      <div key={section.label}>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 px-2 py-1.5 mt-2 first:mt-0">
          {section.label}
        </p>
        {section.items.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-colors ${
              item.active
                ? "bg-green-50 text-green-700"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <span className={item.active ? "text-green-600" : "text-gray-400"}>
              {item.icon}
            </span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge !== undefined && (
              <span className="bg-red-50 text-red-500 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    ))}
  </aside>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ALERT STRIP
// ═══════════════════════════════════════════════════════════════════════════════

const AlertStrip: React.FC = () => (
  <div
    role="alert"
    className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3"
  >
    <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
    <p className="text-sm text-gray-800">
      <span className="font-semibold text-red-600">Critical alert: </span>
      Late Blight detected in Field B (Tomato) with 87% confidence. Immediate treatment recommended.
    </p>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// METRIC CARDS ROW
// ═══════════════════════════════════════════════════════════════════════════════

const MetricCards: React.FC = () => (
  <div className="grid grid-cols-4 gap-3">
    {METRICS.map((m) => (
      <div
        key={m.label}
        className="bg-white border border-gray-100 rounded-2xl px-4 py-3.5 flex flex-col gap-1"
      >
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className={m.color}>{m.icon}</span>
          {m.label}
        </div>
        <div className={`text-2xl font-semibold ${m.color}`}>{m.value}</div>
        <div
          className={`text-xs flex items-center gap-1 ${
            m.trend === "up"   ? "text-green-600" :
            m.trend === "down" ? "text-red-500"   : "text-gray-400"
          }`}
        >
          {m.trend === "up"   && <TrendingUp size={11} />}
          {m.trend === "down" && <TrendingDown size={11} />}
          {m.change}
        </div>
      </div>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// UPLOAD & DIAGNOSE PANEL
// ═══════════════════════════════════════════════════════════════════════════════

const UploadPanel: React.FC = () => {
  const [dragging, setDragging] = useState(false);

  const handleDragOver  = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragging(true);  }, []);
  const handleDragLeave = useCallback(() => setDragging(false), []);
  const handleDrop      = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      // TODO: POST file to /api/v1/predict  →  { disease, confidence, treatment }
      console.log("Dropped:", file.name);
    }
  }, []);

  return (
    <Panel title="Upload & Diagnose" icon={<Upload size={15} />}>
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Upload crop image for AI disease detection"
        className={`border-2 border-dashed rounded-xl p-7 text-center cursor-pointer transition-colors ${
          dragging
            ? "border-green-400 bg-green-50"
            : "border-gray-200 hover:border-green-300 hover:bg-green-50/40"
        }`}
      >
        <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2.5">
          <Camera size={22} className="text-green-600" />
        </div>
        <p className="text-sm font-medium text-gray-800">Drop crop or leaf image here</p>
        <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WEBP — max 10 MB</p>
        <button className="mt-3 inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
          <Upload size={13} />
          Choose Image
        </button>
      </div>

      {/* Latest detection result */}
      <div className="border border-gray-100 rounded-xl overflow-hidden mt-3">
        {/* Leaf thumbnail — replace <div> with <img src={...} alt="..." /> in production */}
        <div className="relative h-32 bg-gradient-to-br from-[#2d5016] via-[#4a7c1f] to-[#8fc943] flex items-center justify-center">
          <svg width="80" height="80" viewBox="0 0 90 90" fill="none" opacity={0.7} aria-hidden="true">
            <ellipse cx="45" cy="45" rx="32" ry="40" fill="#4a7c1f" opacity={0.7} />
            <ellipse cx="52" cy="30" rx="18" ry="14" fill="#6aab2e" opacity={0.5} />
            <circle  cx="38" cy="55" r="8"            fill="#8B0000" opacity={0.6} />
            <circle  cx="55" cy="48" r="5"            fill="#8B0000" opacity={0.5} />
            <line x1="45" y1="10" x2="45" y2="78" stroke="#2d5016" strokeWidth={2}   />
            <line x1="45" y1="35" x2="20" y2="25" stroke="#2d5016" strokeWidth={1.5} />
            <line x1="45" y1="50" x2="68" y2="42" stroke="#2d5016" strokeWidth={1.5} />
          </svg>
          <span className="absolute top-2 right-2 flex items-center gap-1 bg-red-500/90 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
            <AlertTriangle size={10} />
            Disease Detected
          </span>
        </div>

        <div className="p-3">
          <p className="text-[13px] font-semibold text-gray-900">
            Late Blight{" "}
            <span className="text-gray-400 font-normal">(Phytophthora infestans)</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Crop: Tomato · Field B · Row 14</p>
          <ConfidenceBar value={87} severity="critical" />
        </div>
      </div>
    </Panel>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DISEASE SUMMARY PANEL  (doughnut + list)
// ═══════════════════════════════════════════════════════════════════════════════

const DiseaseSummaryPanel: React.FC = () => {
  const totalCrops = DONUT_DATA.reduce((sum, d) => sum + d.value, 0);

  const dotColor: Record<Severity, string> = {
    critical: "#ef4444",
    moderate: "#d97706",
    healthy:  "#16a34a",
  };
  const pctColor: Record<Severity, string> = {
    critical: "text-red-500",
    moderate: "text-amber-600",
    healthy:  "text-green-600",
  };

  return (
    <Panel title="Disease Detection Summary" icon={<BarChart3 size={15} />}>
      {/* Doughnut + legend */}
      <div className="flex items-center gap-4 mb-3">
        <PieChart width={120} height={120}>
          <Pie
            data={DONUT_DATA}
            cx={55} cy={55}
            innerRadius={38} outerRadius={55}
            dataKey="value"
            strokeWidth={0}
          >
            {DONUT_DATA.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>

        <div className="flex flex-col gap-1.5 text-xs">
          {DONUT_DATA.map((d) => (
            <span key={d.name} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: d.color }} />
              <span className="text-gray-600">{d.name}</span>
              <span className="font-medium text-gray-800 ml-auto pl-3">
                {Math.round((d.value / totalCrops) * 100)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Disease rows */}
      <div className="flex flex-col gap-1.5">
        {DISEASE_DATA.map((d) => (
          <div
            key={d.name}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: dotColor[d.severity] }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-gray-800 truncate">{d.name}</p>
              <p className="text-[11px] text-gray-400">{d.crop}</p>
            </div>
            <span className={`text-xs font-semibold ${pctColor[d.severity]}`}>
              {d.confidence}%
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// TREND CHART  (7-day health score)
// ═══════════════════════════════════════════════════════════════════════════════

const TrendChart: React.FC = () => (
  <Panel title="Health Trend — Last 7 Days" icon={<Activity size={15} />}>
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={TREND_DATA} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[50, 100]}
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "0.5px solid #e5e7eb",
            borderRadius: 10,
            fontSize: 12,
          }}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#16a34a"
          strokeWidth={2}
          dot={{ r: 3.5, fill: "#16a34a", strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </Panel>
);

// ═══════════════════════════════════════════════════════════════════════════════
// UPLOAD HISTORY TABLE
// ═══════════════════════════════════════════════════════════════════════════════

const HistoryTable: React.FC = () => (
  <Panel title="Recent Upload History" icon={<History size={15} />}>
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100">
          {["Crop", "Field", "Result", "Conf.", "Time"].map((h) => (
            <th key={h} className="text-left text-[11px] font-medium text-gray-400 pb-2 pr-3">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {HISTORY_ROWS.map((row, i) => (
          <tr
            key={i}
            className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors"
          >
            <td className="py-2 pr-3 text-[13px] font-medium text-gray-800">{row.crop}</td>
            <td className="py-2 pr-3 text-[13px] text-gray-500">{row.field}</td>
            <td className="py-2 pr-3"><SeverityPill severity={row.result} /></td>
            <td className="py-2 pr-3 text-[13px] text-gray-600">{row.confidence}%</td>
            <td className="py-2 text-[11px] text-gray-400 whitespace-nowrap">{row.time}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </Panel>
);

// ═══════════════════════════════════════════════════════════════════════════════
// AI RECOMMENDATIONS  (treatment · fertilizer · irrigation)
// ═══════════════════════════════════════════════════════════════════════════════

const Recommendations: React.FC = () => (
  <Panel title="AI Treatment & Recommendations" icon={<Lightbulb size={15} />}>
    <div className="grid grid-cols-3 gap-3">
      {RECOMMENDATION_CARDS.map((card) => (
        <div key={card.title} className="border border-gray-100 rounded-xl p-3.5">
          <div className={`w-9 h-9 ${card.iconBg} rounded-lg flex items-center justify-center mb-2.5`}>
            {card.icon}
          </div>
          <p className="text-[13px] font-semibold text-gray-800 mb-2">{card.title}</p>
          <ul className="flex flex-col gap-1.5">
            {card.items.map((item) => (
              <li key={item} className="flex items-start gap-1.5 text-[12px] text-gray-500 leading-snug">
                <ChevronRight size={11} className="text-green-500 mt-0.5 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <div className="mt-3 flex justify-center">
      <button className="inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-5 py-2 rounded-lg transition-colors">
        <FileText size={13} />
        Generate Full Treatment Report
      </button>
    </div>
  </Panel>
);

// ═══════════════════════════════════════════════════════════════════════════════
// WEATHER ADVISORY
// ═══════════════════════════════════════════════════════════════════════════════

const WeatherAdvisory: React.FC = () => (
  <Panel title="Weather Advisory" icon={<Cloud size={15} />}>
    <div className="flex flex-col gap-2">
      {WEATHER.map((w) => (
        <div key={w.day} className="flex items-center gap-3">
          <span className="text-[12px] text-gray-400 w-8">{w.day}</span>
          <span className="text-base">{w.emoji}</span>
          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${w.riskLevel}%`, background: w.riskColor }}
            />
          </div>
          <span className="text-[12px] text-gray-700 w-10 text-right">{w.temp}</span>
        </div>
      ))}
    </div>

    <div className="mt-3 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 flex items-start gap-2">
      <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
      <p className="text-[12px] text-amber-700">
        High rainfall on Tuesday — spray fungicides before Monday evening
      </p>
    </div>
  </Panel>
);

// ═══════════════════════════════════════════════════════════════════════════════
// FIELD HEALTH GAUGE
// ═══════════════════════════════════════════════════════════════════════════════

const HealthGauge: React.FC = () => {
  const HEALTH_SCORE = 74;

  const miniStats = [
    { val: "72.7%", label: "Healthy",       color: "text-green-600" },
    { val: "9.1%",  label: "Critical",      color: "text-red-500"   },
    { val: "5",     label: "Crops tracked", color: "text-gray-800"  },
    { val: "3",     label: "Active alerts", color: "text-gray-800"  },
  ];

  return (
    <Panel title="Field Health Score" icon={<Activity size={15} />}>
      {/* Half-doughnut gauge */}
      <div className="flex flex-col items-center gap-1">
        <div className="relative" style={{ width: 120, height: 80 }}>
          <PieChart width={120} height={120}>
            <Pie
              data={GAUGE_DATA}
              cx={55} cy={55}
              startAngle={180} endAngle={0}
              innerRadius={38} outerRadius={55}
              dataKey="value"
              strokeWidth={0}
            >
              {GAUGE_DATA.map((entry, i) => (
                <Cell key={i} fill={i === 1 ? "#f3f4f6" : entry.color} />
              ))}
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <span className="text-2xl font-semibold text-green-600">{HEALTH_SCORE}</span>
            <span className="text-[11px] text-gray-400">/100</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">Overall Field Health</p>
      </div>

      {/* Mini stat grid */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {miniStats.map((s) => (
          <div key={s.label} className="bg-gray-50 rounded-xl p-2.5 text-center">
            <p className={`text-base font-semibold ${s.color}`}>{s.val}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — CropGuardDashboard
// ═══════════════════════════════════════════════════════════════════════════════

const CropGuardDashboard: React.FC = () => (
  <div className="flex flex-col h-screen bg-gray-50 font-sans overflow-hidden">
    <Topbar />

    <div className="flex flex-1 overflow-hidden">
      <Sidebar />

      {/* ── Scrollable main content ── */}
      <main className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">

        {/* Page header */}
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Crop Health Dashboard</h1>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Real-time AI-powered monitoring for your fields — Last updated 2 min ago
          </p>
        </div>

        {/* Row 0 — Alert */}
        <AlertStrip />

        {/* Row 1 — KPI metrics */}
        <MetricCards />

        {/* Row 2 — Upload · Disease summary */}
        <div className="grid grid-cols-2 gap-4">
          <UploadPanel />
          <DiseaseSummaryPanel />
        </div>

        {/* Row 3 — Trend chart · History table */}
        <div className="grid grid-cols-2 gap-4">
          <TrendChart />
          <HistoryTable />
        </div>

        {/* Row 4 — Recommendations (full width) */}
        <Recommendations />

        {/* Row 5 — Weather · Health gauge */}
        <div className="grid grid-cols-2 gap-4">
          <WeatherAdvisory />
          <HealthGauge />
        </div>

      </main>
    </div>
  </div>
);

export default CropGuardDashboard;
