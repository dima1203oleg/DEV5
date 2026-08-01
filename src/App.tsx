/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import CatalogTab from "./components/CatalogTab";
import LicenseTab from "./components/LicenseTab";
import ArchitectureTab from "./components/ArchitectureTab";
import GapAnalysisTab from "./components/GapAnalysisTab";
import RoadmapTab from "./components/RoadmapTab";
import VolumesTab from "./components/VolumesTab";
import AdvisorTab from "./components/AdvisorTab";
import OsintWorkbench from "./components/OsintWorkbench";
import PersonProfiler from "./components/PersonProfiler";
import DashboardView from "./components/DashboardView";
import DataIngestionTab from "./components/DataIngestionTab";
import InspectorPanel from "./components/InspectorPanel";
import LiveAnalyticalCenter from "./components/LiveAnalyticalCenter";
import AdminBackOffice from "./components/AdminBackOffice";
import CKANExplorerTab from "./components/CKANExplorerTab";
import AutonomousFactory from "./components/AutonomousFactory";
import MapsTab from "./components/MapsTab";
import InvestigationSandbox from "./components/InvestigationSandbox";
import { MediaForensicsTab } from "./components/MediaForensicsTab";
import AdverseIntelligenceTab from "./components/AdverseIntelligenceTab";
import PredatorControlPlane from "./components/PredatorControlPlane";
import InvestigationWorkspaceTab from "./components/InvestigationWorkspaceTab";
import AuditLogViewer from "./components/AuditLogViewer";
import { VoiceCall } from "./components/VoiceCall";
import { ToastProvider } from "./components/ToastProvider";
import { OSINT_ENTITIES, OsintEntity, getOrCreateEntityForQuery, generateDynamicEntity } from "./osintData";
import { SOLUTIONS } from "./data";
import {
  Layers,
  ShieldCheck, Shield,
  Network,
  Wrench,
  Calendar,
  Bot,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  BookOpen,
  Menu,
  X,
  Search,
  Bell,
  User,
  Terminal,
  Cpu,
  Database,
  Activity,
  Camera,
  Landmark,
  MessageSquare,
  Sparkles,
  Send,
  HelpCircle,
  Maximize2,
  Minimize2,
  Settings,
  ShieldAlert,
  Compass,
  Briefcase,
  Truck,
  Globe,
  TrendingUp,
  Users,
  Map,
  Mic,
  UserCheck, Tablet, LayoutDashboard} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { LiveChatBot } from "./components/LiveChatBot";
import { AuthStatus } from "./components/AuthStatus";
import { FirebaseSyncIndicator } from "./components/FirebaseSyncIndicator";

type TabId =
  | "live-analytical-center"
  | "admin-back-office"
  | "dashboard"
  | "osint"
  | "person-profiler"
  | "adverse"
  | "maps"
  | "catalog"
  | "license"
  | "architecture"
  | "gap"
  | "roadmap"
  | "volumes"
  | "advisor"
  | "sandbox"
  | "media-forensics"
  | "data-ingestion"
  | "autonomous-factory"
  | "predator-control"
  | "investigation-workspace"
  | "audit-log"
  | "ckan-explorer";

export default function App() {
  const [ecosystem, setEcosystem] = useState<"user" | "admin">("user");
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [selectedScenario, setSelectedScenario] = useState<string>("business");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);

  // Interactive rendering and mobile adaptive states
  const [isRealMobile, setIsRealMobile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const isMobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      return window.innerWidth < 768 || isMobileUA;
    }
    return false;
  });
  const [deviceMode, setDeviceMode] = useState<"desktop" | "ipad" | "iphone">(() => {
    if (typeof window !== "undefined") {
      const isMobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (window.innerWidth < 768 || isMobileUA) {
        return "iphone";
      }
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        return "ipad";
      }
    }
    return "desktop";
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [iphoneTime, setIphoneTime] = useState("09:41");
  const [isUserGuideOpen, setIsUserGuideOpen] = useState(false);

  // iPhone physical interactions states
  const [isIphoneLocked, setIsIphoneLocked] = useState(false);
  const [isIphoneMuted, setIsIphoneMuted] = useState(false);
  const [iphoneVolume, setIphoneVolume] = useState(65);
  const [showVolumeHUD, setShowVolumeHUD] = useState(false);
  const [dynamicIslandState, setDynamicIslandState] = useState<
    "normal" | "expanded" | "mute-alert" | "unmute-alert"
  >("normal");
  const [volumeTimer, setVolumeTimer] = useState<any>(null);
  const [lockscreenDate, setLockscreenDate] = useState("Четвер, 16 липня");

  // Dynamic date calculation for Lock Screen
  useEffect(() => {
    const days = [
      "Неділя",
      "Понеділок",
      "Вівторок",
      "Середа",
      "Четвер",
      "П'ятниця",
      "Субота",
    ];
    const months = [
      "січня",
      "лютого",
      "березня",
      "квітня",
      "травня",
      "червня",
      "липня",
      "серпня",
      "вересня",
      "жовтня",
      "листопада",
      "грудня",
    ];
    const now = new Date();
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const dateNum = now.getDate();
    setLockscreenDate(`${dayName}, ${dateNum} ${monthName}`);
  }, []);

  const handleActionButton = () => {
    const nextMuted = !isIphoneMuted;
    setIsIphoneMuted(nextMuted);
    setDynamicIslandState(nextMuted ? "mute-alert" : "unmute-alert");
    setTimeout(() => {
      setDynamicIslandState("normal");
    }, 2000);
  };

  const adjustVolume = (amount: number) => {
    setIphoneVolume((prev) => Math.max(0, Math.min(prev + amount, 100)));
    setShowVolumeHUD(true);
    if (volumeTimer) clearTimeout(volumeTimer);
    const t = setTimeout(() => {
      setShowVolumeHUD(false);
    }, 1800);
    setVolumeTimer(t);
  };

  const toggleIphonePower = () => {
    setIsIphoneLocked((prev) => !prev);
  };

  const handleDynamicIslandClick = () => {
    if (dynamicIslandState === "normal") {
      setDynamicIslandState("expanded");
    } else if (dynamicIslandState === "expanded") {
      setDynamicIslandState("normal");
    }
  };

  // Sync real-time clock for the iOS status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = now.getHours().toString().padStart(2, "0");
      const mins = now.getMinutes().toString().padStart(2, "0");
      setIphoneTime(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Detect real narrow-screen mobile device on load and resize
  useEffect(() => {
    const handleResize = () => {
      const isMobileUA = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isMobileSize = window.innerWidth < 768 || isMobileUA;
      const isTabletSize = !isMobileSize && (window.innerWidth >= 768 && window.innerWidth < 1024);
      
      setIsRealMobile(isMobileSize);
      if (isMobileSize) {
        setDeviceMode("iphone");
        setIsInspectorOpen(false);
        setSidebarCollapsed(true);
      } else if (isTabletSize) {
        setDeviceMode("ipad");
        setSidebarCollapsed(true);
      } else {
        setDeviceMode("desktop");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Inspector contents
  const [entitiesList, setEntitiesList] = useState<OsintEntity[]>(OSINT_ENTITIES);
  const [selectedEntity, setSelectedEntity] = useState<OsintEntity | null>(
    OSINT_ENTITIES[0],
  );
  const [selectedTool, setSelectedTool] = useState<any | null>(SOLUTIONS[0]);
  const [selectedNode, setSelectedNode] = useState<any | null>({
    id: "core_api",
    label: "Core REST API",
    group: "Core",
    details:
      "Основний бекенд-сервіс на базі FastAPI. Забезпечує оркестрацію черг, інтеграцію ШІ-моделей vLLM та інтерфейс до баз даних Qdrant та Neo4j.",
  });

  // Floating AI Assistant state
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "ai",
      text: "Вітаю. Я аналітичний ШІ-асистент NEXUS. Я можу знайти приховані зв'язки, написати висновки про компанії або згенерувати SQL-запити до бази.",
    },
  ]);

  // Spotlight / Command Center State
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState("");

  // Voice Command / Web Speech API states
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = React.useRef<any>(null);

  // Microsoft TTS Engine state (Web Speech Synthesis Integration)
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [selectedTtsVoice, setSelectedTtsVoice] = useState(
    "Microsoft Pavel (UA)",
  );
  const [availableVoices, setAvailableVoices] = useState<any[]>([]);

  // Initialize and load Speech Synthesis voices natively supporting Microsoft cloud-inspired voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speakText = (text: string) => {
    if (!isTtsEnabled) return;
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      console.warn("SpeechSynthesis cancel notice:", e);
    }

    // Clean text: remove code blocks, formatting, long logs
    let cleanText = text
      .replace(/```sql[\s\S]*?```/g, " [Згенеровано SQL запит] ")
      .replace(/```[\s\S]*?```/g, " [Фрагмент коду] ")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/[*#_\[\]()\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (!cleanText) return;

    // Split into readable sentences to avoid browser length bottlenecks
    const sentences = cleanText.match(/[^.!?]+[.!?]*/g) || [cleanText];

    sentences.forEach((sentence) => {
      const sTrimmed = sentence.trim();
      if (!sTrimmed) return;

      const utterance = new SpeechSynthesisUtterance(sTrimmed);
      utterance.lang = "uk-UA";
      utterance.rate = 0.8; // slower, masked pace
      utterance.pitch = 0.1; // deeply lowered pitch for masked voice effect

      // Match selected voice or any Ukrainian Microsoft cloud voice
      const voices = window.speechSynthesis.getVoices();
      let matchedVoice = null;

      if (selectedTtsVoice.includes("Irina")) {
        matchedVoice =
          voices.find(
            (v) => v.lang.startsWith("uk") && v.name.includes("Irina"),
          ) ||
          voices.find(
            (v) => v.lang.startsWith("uk") && v.name.includes("Microsoft"),
          );
      } else if (selectedTtsVoice.includes("Pavel")) {
        matchedVoice =
          voices.find(
            (v) => v.lang.startsWith("uk") && v.name.includes("Pavel"),
          ) ||
          voices.find(
            (v) => v.lang.startsWith("uk") && v.name.includes("Microsoft"),
          );
      } else {
        matchedVoice = voices.find(
          (v) => v.lang.startsWith("uk") && v.name.includes("Microsoft"),
        );
      }

      if (!matchedVoice) {
        // Fallback to general Ukrainian engines (Microsoft, Google, iOS native)
        matchedVoice =
          voices.find((v) => v.lang.startsWith("uk")) ||
          voices.find((v) => v.lang.startsWith("uk-UA")) ||
          voices.find((v) => v.name.toLowerCase().includes("ukrainian"));
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      window.speechSynthesis.speak(utterance);
    });
  };

  const handleVoiceCommand = (transcript: string) => {
    const text = transcript.trim();
    if (!text) return;

    const lower = text.toLowerCase();
    setVoiceFeedback(`Почуто: "${text}"`);

    // Automatic clear of feedback
    setTimeout(() => {
      setVoiceFeedback(null);
    }, 4000);

    // 1. Navigation commands
    if (
      lower.includes("дашборд") ||
      lower.includes("dashboard") ||
      lower.includes("панель")
    ) {
      setActiveTab("dashboard");
      const msg = `Перехід на інтерактивний Дашборд`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (
      lower.includes("мапа") ||
      lower.includes("карта") ||
      lower.includes("maps") ||
      lower.includes("map")
    ) {
      setActiveTab("maps");
      const msg = `Перехід на інтерактивну карту`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (
      lower.includes("пошук") ||
      lower.includes("search") ||
      lower.includes("осінт") ||
      lower.includes("osint")
    ) {
      setActiveTab("osint");
      const msg = `Перехід на пошуковий робочий стіл OSINT`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (
      lower.includes("ядро") ||
      lower.includes("центр") ||
      lower.includes("live") ||
      lower.includes("шi")
    ) {
      setActiveTab("live-analytical-center");
      const msg = `Перехід до живого аналітичного ядра NEXUS`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (
      lower.includes("адмін") ||
      lower.includes("адмінка") ||
      lower.includes("консоль") ||
      lower.includes("admin") ||
      lower.includes("office")
    ) {
      setEcosystem("admin");
      setActiveTab("admin-back-office");
      const msg = `Доступ надано. Перехід у बैक офіс консоль`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (
      lower.includes("пісочниця") ||
      lower.includes("павутина") ||
      lower.includes("sandbox") ||
      lower.includes("investigation")
    ) {
      setActiveTab("sandbox");
      const msg = `Перехід до аналітичної пісочниці Павутина`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (
      lower.includes("граф") ||
      lower.includes("архітектура") ||
      lower.includes("залежності") ||
      lower.includes("architecture")
    ) {
      setActiveTab("architecture");
      const msg = `Відкриття графу залежностей архітектури`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (
      lower.includes("прогалини") ||
      lower.includes("ризики") ||
      lower.includes("gap")
    ) {
      setActiveTab("gap");
      const msg = `Завантаження аналізу прогалин та ризиків комплаєнсу`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (
      lower.includes("дорожня карта") ||
      lower.includes("план") ||
      lower.includes("roadmap")
    ) {
      setActiveTab("roadmap");
      const msg = `Показ дорожньої карти впровадження системи`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (
      lower.includes("томи") ||
      lower.includes("регламенти") ||
      lower.includes("volumes")
    ) {
      setActiveTab("volumes");
      const msg = `Відкриття електронних томів технічного завдання`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (
      lower.includes("архітектор") ||
      lower.includes("радник") ||
      lower.includes("advisor")
    ) {
      setActiveTab("advisor");
      const msg = `Підключення до радника ШІ архітектора`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }

    // 2. Action / Device commands
    if (
      lower.includes("заблокувати") ||
      lower.includes("розблокувати") ||
      lower.includes("lock") ||
      lower.includes("unlock")
    ) {
      toggleIphonePower();
      const msg = `Зміна режиму блокування симулятора`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (
      lower.includes("беззвучний") ||
      lower.includes("звук") ||
      lower.includes("mute") ||
      lower.includes("unmute")
    ) {
      handleActionButton();
      const msg = `Перемикання звукового режиму`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (
      lower.includes("гучніше") ||
      lower.includes("гучність плюс") ||
      lower.includes("volume up")
    ) {
      adjustVolume(10);
      const msg = `Гучність збільшено`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (
      lower.includes("тихіше") ||
      lower.includes("гучність мінус") ||
      lower.includes("volume down")
    ) {
      adjustVolume(-10);
      const msg = `Гучність зменшено`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }
    if (lower.includes("інспектор") || lower.includes("inspector")) {
      setIsInspectorOpen((prev) => !prev);
      const msg = `Перемикання стану панелі інспектора`;
      setVoiceFeedback(msg);
      speakText(msg);
      return;
    }

    // 3. Search queries
    let queryText = text;
    let isExplicitSearch = false;
    if (lower.startsWith("знайди ") || lower.startsWith("пошук ")) {
      queryText = text.substring(6).trim();
      isExplicitSearch = true;
    } else if (lower.startsWith("find ") || lower.startsWith("search ")) {
      queryText = text.substring(5).trim();
      isExplicitSearch = true;
    }

    if (
      isExplicitSearch ||
      lower.includes("коваленко") ||
      lower.includes("спецтехпостач") ||
      lower.includes("фольксваген") ||
      lower.includes("клієнт")
    ) {
      const queryLower = queryText.toLowerCase();
      const matched =
        (window as any).OSINT_ENTITIES ||
        (typeof OSINT_ENTITIES !== "undefined" ? OSINT_ENTITIES : []).find(
          (ent: any) =>
            ent.name.toLowerCase().includes(queryLower) ||
            ent.code.includes(queryLower),
        );

      if (matched) {
        setSelectedEntity(matched);
        setSelectedTool(null);
        setSelectedNode(null);
        setIsInspectorOpen(true);
        setActiveTab("live-analytical-center");
        const msg = `Знайдено об'єкт дослідження: ${matched.name}`;
        setVoiceFeedback(msg);
        speakText(msg);
        return;
      }
    }

    // 4. Default: Chat with NEXUS
    setChatHistory((prev) => [...prev, { sender: "user", text: text }]);
    setIsAiChatOpen(true);

    setTimeout(() => {
      let aiResponse =
        "Голосовий запит опрацьовано ШІ-ядром NEXUS через Web Speech API. Збігів у базі санкцій не знайдено.";

      if (lower.includes("санкції") || lower.includes("рнбо")) {
        aiResponse =
          "ШІ знайшов критичну загрозу: ТОВ 'СпецТехПостач' (код 38294012) знаходиться під санкціями РНБО з 2026 року через обхід експортних обмежень через турецьких контрагентів.";
      } else if (lower.includes("коваленко")) {
        aiResponse =
          "Коваленко Ігор Вікторович є засновником ТОВ 'СпецТехПостач' (51%) та володіє BTC-гаманцем bc1qxy...d831. ШІ оцінює рівень ризику особи як ВИСОКИЙ (82%).";
      } else if (lower.includes("sql")) {
        aiResponse =
          "Ось згенерований SQL для пошуку пов'язаних бенефіціарів:\n\nSELECT * FROM company_founders WHERE risk_level = 'HIGH';";
      } else if (lower.includes("pdf")) {
        aiResponse =
          "Надішліть PDF-файл ТЗ чи митної декларації в чат. Я проведу миттєвий комплаєнс-аналіз згідно з 16 томами.";
      } else if (
        lower.includes("привіт") ||
        lower.includes("вітаю") ||
        lower.includes("hello")
      ) {
        aiResponse =
          "Вітаю! Я уважно слухаю ваші голосові команди. Ви можете сказати 'Перейди на дашборд', 'Покажи карту' або запитати про санкції.";
      }

      setChatHistory((prev) => [...prev, { sender: "ai", text: aiResponse }]);
      speakText(aiResponse);
    }, 800);
  };

  const startVoiceControl = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError(
        "Web Speech API не підтримується у цьому браузері. Будь ласка, використовуйте Google Chrome.",
      );
      setTimeout(() => setVoiceError(null), 5000);
      return;
    }

    if (isVoiceListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsVoiceListening(false);
      setDynamicIslandState("normal");
      return;
    }

    setIsVoiceListening(true);
    setVoiceError(null);
    setVoiceFeedback("Активація мікрофона...");
    setDynamicIslandState("voice-listening");

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = "uk-UA";

    rec.onstart = () => {
      setVoiceFeedback("Слухаю... Назвіть команду");
    };

    rec.onerror = (event: any) => {
      console.warn("Speech recognition notice (non-fatal):", event);
      if (event.error === "no-speech") {
        setVoiceError(
          "Голос не виявлено. Спробуйте ще раз або виберіть симуляцію нижче:",
        );
      } else if (event.error === "not-allowed") {
        setVoiceError(
          "Доступ заблоковано (запуск у пісочниці/фреймі). Виберіть симуляцію:",
        );
      } else {
        setVoiceError(
          `Помилка розпізнавання: ${event.error}. Виберіть симуляцію:`,
        );
      }
      setIsVoiceListening(false);
      setDynamicIslandState("normal");
      setTimeout(() => setVoiceError(null), 15000);
    };

    rec.onend = () => {
      setIsVoiceListening(false);
      setTimeout(() => {
        setDynamicIslandState((prev) =>
          prev === "voice-listening" ? "normal" : prev,
        );
      }, 3000);
    };

    rec.onresult = (event: any) => {
      const resultIndex = event.resultIndex;
      const transcript = event.results[resultIndex][0].transcript;
      setVoiceTranscript(transcript);
      handleVoiceCommand(transcript);
    };

    recognitionRef.current = rec;
    try {
      rec.start();
    } catch (err) {
      console.warn(
        "Could not start speech recognition directly (non-fatal):",
        err,
      );
      setIsVoiceListening(false);
      setDynamicIslandState("normal");
    }
  };

  // Handle key escape and Ctrl/Cmd+K to toggle Spotlight
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent<TabId>;
      if (customEvent.detail) {
        setActiveTab(customEvent.detail);
      }
    };
    window.addEventListener("change-active-tab", handleTabChange);
    return () =>
      window.removeEventListener("change-active-tab", handleTabChange);
  }, []);

  useEffect(() => {
    const handleSystemScan = () => {
      const msg = "🚨 АКТИВОВАНО КІБЕР-АУДИТ ТА СКАНИРУВАННЯ СИСТЕМИ PREDATOR. МОНІТОРИНГ АКТИВНОСТІ РЕЄСТРІВ...";
      setVoiceFeedback(msg);
      setTimeout(() => {
        setVoiceFeedback(null);
      }, 6000);
    };
    window.addEventListener("trigger-system-scan", handleSystemScan);
    return () => window.removeEventListener("trigger-system-scan", handleSystemScan);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsInspectorOpen(false);
        setIsAiChatOpen(false);
        setIsSpotlightOpen(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Spotlight categorized search results
  const spotlightResults = React.useMemo(() => {
    if (ecosystem === "admin") {
      const allNavs = [
        {
          id: "admin-back-office",
          label: "⚙️ Адмінка / ArgoCD Back Office",
          type: "nav",
        },
        { id: "catalog", label: "📦 Каталог готових рішень", type: "nav" },
        {
          id: "license",
          label: "🛡️ Сумісність та активація ліцензій",
          type: "nav",
        },
      ];

      const allActions = [
        {
          id: "toggle-inspector",
          label: isInspectorOpen
            ? "📂 Закрити бічний інспектор"
            : "📂 Відкрити бічний інспектор",
          type: "action",
        },
      ];

      if (!spotlightQuery.trim()) {
        return {
          navigation: allNavs,
          actions: allActions,
          entities: [],
        };
      }

      const query = spotlightQuery.toLowerCase();

      return {
        navigation: allNavs.filter((n) =>
          n.label.toLowerCase().includes(query),
        ),
        actions: allActions.filter((a) =>
          a.label.toLowerCase().includes(query),
        ),
        entities: [],
      };
    } else {
      const allNavs = [
        {
          id: "live-analytical-center",
          label: "🛰️ Живе ШІ-Ядро (Спецпроект NEXUS)",
          type: "nav",
        },
        { id: "dashboard", label: "📊 Інтерактивний Дашборд", type: "nav" },
        { id: "ckan-explorer", label: "🇺🇦 Провідник Data.gov.ua (CKAN)", type: "nav" },
        { id: "osint", label: "🔍 Робочий стіл OSINT пошуку", type: "nav" },
        { id: "person-profiler", label: "👤 Перевірка та Досьє Осіб", type: "nav" },
        {
          id: "architecture",
          label: "🕸️ Граф архітектури та залежностей",
          type: "nav",
        },
        { id: "gap", label: "🛡️ Аналіз прогалин та ризиків", type: "nav" },
        { id: "roadmap", label: "📅 Дорожня карта впровадження", type: "nav" },
        { id: "volumes", label: "📚 Томи ТЗ (Митні регламенти)", type: "nav" },
        { id: "advisor", label: "🤖 ШІ-Архітектор", type: "nav" },
      ];

      const allActions = [
        {
          id: "mute-toggle",
          label: isIphoneMuted
            ? "🔊 Увімкнути звук коментаря (NEXUS uk-UA)"
            : "🔇 Вимкнути звук коментаря",
          type: "action",
        },
        {
          id: "lock-toggle",
          label: isIphoneLocked
            ? "🔓 Розблокувати iPhone 15 Pro"
            : "🔒 Заблокувати iPhone 15 Pro",
          type: "action",
        },
        {
          id: "vol-up",
          label: "🔊 Збільшити гучність симулятора (+10%)",
          type: "action",
        },
        {
          id: "vol-down",
          label: "🔉 Зменшити гучність симулятора (-10%)",
          type: "action",
        },
        {
          id: "toggle-inspector",
          label: isInspectorOpen
            ? "📂 Закрити бічний інспектор"
            : "📂 Відкрити бічний інспектор",
          type: "action",
        },
      ];

      if (!spotlightQuery.trim()) {
        return {
          navigation: allNavs.slice(0, 4),
          actions: allActions.slice(0, 3),
          entities: entitiesList.slice(0, 3).map((e) => ({
            id: e.id,
            label: `👤 ${e.name} [${e.code}]`,
            type: "entity",
            raw: e,
          })),
        };
      }

      const query = spotlightQuery.toLowerCase();

      const matchedEntities = entitiesList
        .filter(
          (e) =>
            e.name.toLowerCase().includes(query) ||
            e.code.includes(query) ||
            (e.description && e.description.toLowerCase().includes(query)),
        )
        .map((e) => ({
          id: e.id,
          label: `👤 ${e.name} [${e.code}]`,
          type: "entity",
          raw: e,
        }));

      if (matchedEntities.length === 0) {
        const dynamicEnt = getOrCreateEntityForQuery(spotlightQuery, entitiesList);
        matchedEntities.unshift({
          id: dynamicEnt.id,
          label: `🔍 Створити/Перевірити запит: "${spotlightQuery}"`,
          type: "entity",
          raw: dynamicEnt,
        });
      }

      return {
        navigation: allNavs.filter((n) =>
          n.label.toLowerCase().includes(query),
        ),
        actions: allActions.filter((a) =>
          a.label.toLowerCase().includes(query),
        ),
        entities: matchedEntities,
      };
    }
  }, [
    ecosystem,
    spotlightQuery,
    isIphoneMuted,
    isIphoneLocked,
    isInspectorOpen,
    entitiesList,
  ]);

  const handleSpotlightSelect = (item: any) => {
    if (item.type === "nav") {
      setActiveTab(item.id);
    } else if (item.type === "action") {
      if (item.id === "mute-toggle") {
        handleActionButton();
      } else if (item.id === "lock-toggle") {
        toggleIphonePower();
      } else if (item.id === "vol-up") {
        adjustVolume(10);
      } else if (item.id === "vol-down") {
        adjustVolume(-10);
      } else if (item.id === "toggle-inspector") {
        setIsInspectorOpen(!isInspectorOpen);
      }
    } else if (item.type === "entity") {
      setEntitiesList((prev) => {
        if (prev.some((e) => e.id === item.raw.id)) return prev;
        return [item.raw, ...prev];
      });
      setSelectedEntity(item.raw);
      setSelectedTool(null);
      setSelectedNode(null);
      if (item.raw.type === "person") {
        setActiveTab("person-profiler");
      } else {
        setActiveTab("osint");
      }
      setIsInspectorOpen(true);
    }
    setIsSpotlightOpen(false);
    setSpotlightQuery("");
  };

  const [headerSearchQuery, setHeaderSearchQuery] = useState("");

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headerSearchQuery.trim()) return;

    const entity = getOrCreateEntityForQuery(headerSearchQuery, entitiesList);

    setEntitiesList((prev) => {
      if (prev.some((item) => item.id === entity.id)) return prev;
      return [entity, ...prev];
    });

    setSelectedEntity(entity);
    setSelectedTool(null);
    setSelectedNode(null);
    if (entity.type === "person") {
      setActiveTab("person-profiler");
    } else {
      setActiveTab("osint");
    }
    setIsInspectorOpen(true);
  };

  const selectEntityById = (id: string) => {
    const found = entitiesList.find((e) => e.id === id) || OSINT_ENTITIES.find((e) => e.id === id);
    if (found) {
      setSelectedEntity(found);
      setSelectedTool(null);
      setSelectedNode(null);
      setIsInspectorOpen(true);
    }
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage;
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatMessage("");

    // Generate responsive analytical answers
    setTimeout(() => {
      let aiResponse =
        "Аналіз завершено. Запит опрацьовано ШІ-моделлю Gemini 3.5 Flash. Збігів у базі санкцій не знайдено.";

      const lower = userMsg.toLowerCase();
      if (lower.includes("санкції") || lower.includes("рнбо")) {
        aiResponse =
          "ШІ знайшов критичну загрозу: ТОВ 'СпецТехПостач' (код 38294012) знаходиться під санкціями РНБО з 2026 року через обхід експортних обмежень через турецьких контрагентів.";
      } else if (lower.includes('ков")') || lower.includes("коваленко")) {
        aiResponse =
          "Коваленко Ігор Вікторович є засновником ТОВ 'СпецТехПостач' (51%) та володіє BTC-гаманцем bc1qxy...d831. ШІ оцінює рівень ризику особи як ВИСОКИЙ (82%).";
      } else if (lower.includes("sql")) {
        aiResponse =
          "Ось згенерований SQL для пошуку пов'язаних бенефіціарів:\n\nSELECT * FROM company_founders WHERE risk_level = 'HIGH';";
      } else if (lower.includes("pdf")) {
        aiResponse =
          "Надішліть PDF-файл ТЗ чи митної декларації в чат. Я проведу миттєвий комплаєнс-аналіз згідно з 16 томами.";
      }

      setChatHistory((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    }, 800);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "live-analytical-center":
        return (
          <LiveAnalyticalCenter
            selectedEntity={selectedEntity}
            onSelectEntityGlobal={(ent) => {
              setSelectedEntity(ent);
              setSelectedTool(null);
              setSelectedNode(null);
            }}
            selectedScenario={selectedScenario}
            onSelectScenario={setSelectedScenario}
          />
        );
      case "admin-back-office": return <AdminBackOffice />;
      case "dashboard":
        return (
          <DashboardView
            onSelectTab={(tabId) => {
              if (tabId === "osint") setActiveTab("live-analytical-center");
              else setActiveTab(tabId as TabId);
            }}
            onSelectEntity={(entId) => {
              selectEntityById(entId);
              setActiveTab("live-analytical-center");
            }}
          />
        );
      case "osint":
        return (
          <OsintWorkbench
            selectedEntity={selectedEntity}
            onSelectEntityForInspector={(ent) => {
              setSelectedEntity(ent);
              setSelectedTool(null);
              setSelectedNode(null);
              setIsInspectorOpen(true);
            }}
          />
        );
      case "person-profiler": return <PersonProfiler />;
      case "adverse": return <PersonProfiler initialTab="adverse" />;
      case "sandbox": return <InvestigationSandbox />;
      case "maps": return <MapsTab onSelectEntityGlobal={(ent) => { setSelectedEntity(ent); setSelectedTool(null); setSelectedNode(null); setActiveTab("live-analytical-center"); }} />;
      case "catalog": return <CatalogTab />;
      case "license": return <LicenseTab />;
      case "architecture": return <ArchitectureTab />;
      case "gap": return <GapAnalysisTab />;
      case "roadmap": return <RoadmapTab />;
      case "volumes": return <VolumesTab />;
      case "advisor": return <AdvisorTab />;
      case "media-forensics": return <MediaForensicsTab />;
      case "data-ingestion": return <DataIngestionTab />;
      case "ckan-explorer": return <CKANExplorerTab />;
      case "autonomous-factory": return <AutonomousFactory />;
      case "predator-control": return <PredatorControlPlane />;
      case "investigation-workspace": return <InvestigationWorkspaceTab />;
      case "audit-log": return <AuditLogViewer />;
      default: return null;
    }
  };

  const renderMobileMainContent = () => {
    return (
      <div
        className="h-full flex flex-col relative bg-slate-950 text-slate-200 font-sans"
        id="mobile-viewport-root"
      >
        {/* Compact iOS / Mobile App Header */}
        <header className="border-b border-slate-800 bg-slate-900 shadow-sm px-3 py-2.5 flex items-center justify-between gap-2 z-40 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-sm">
                N
              </div>
              <span className="text-sm font-bold tracking-wide text-slate-200">
                Nexus
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FirebaseSyncIndicator compact />
            {!isRealMobile && (
              <button
                onClick={() => setDeviceMode("desktop")}
                className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-md text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-slate-200 transition-all"
                title="Режим Десктоп"
              >
                Десктоп
              </button>
            )}
          </div>
        </header>

        {/* Scrollable Mobile Main Area */}
        <main
          className="flex-1 overflow-y-auto p-4 bg-transparent relative custom-scrollbar pb-24"
          id="mobile-scroll-container"
        >
          {/* Mobile Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold">
            <span>Nexus</span>
            <span>/</span>
            <span className="text-blue-400 truncate max-w-[150px]">
              {activeTab === "live-analytical-center"
                ? "Аналітика"
                : activeTab.toUpperCase().replace("-", " ")}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.12 }}
              className="w-full"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* iOS-Style Premium Bottom Navigation Tab Bar for mobile viewports */}
        <nav className="shrink-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 px-4 py-2 pb-5 grid grid-cols-5 gap-1 text-center z-40 shadow-lg">
          {[
            { id: "dashboard", label: "Дашборд", icon: LayoutDashboard },
            { id: "live-analytical-center", label: "Аналітика", icon: Bot },
            { id: "osint", label: "OSINT Пошук", icon: Search },
            { id: "maps", label: "Карта", icon: Map },
            { id: "more", label: "Меню", icon: Menu },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.id === "more" ? mobileMenuOpen : (activeTab === tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "more") {
                    setMobileMenuOpen(true);
                  } else {
                    setActiveTab(tab.id as TabId);
                    setMobileMenuOpen(false);
                  }
                }}
                className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
                  isActive ? "text-blue-400 font-bold scale-105" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Icon className={`w-5 h-5 mb-0.5 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                <span className="text-[10px] tracking-tight block truncate w-full">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Left Sidebar sliding drawer overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="absolute inset-0 bg-black z-50"
              />
              {/* Drawer */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute top-0 left-0 bottom-0 w-[280px] bg-slate-900 border-r border-slate-800 shadow-2xl z-50 flex flex-col overflow-y-auto"
              >
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
                      N
                    </div>
                    <div>
                      <h2 className="text-sm font-bold tracking-wide text-slate-200">
                        Nexus Analytics
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Ecosystem Selector */}
                <div className="p-4 space-y-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Простір Управління
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEcosystem("user");
                        setActiveTab("live-analytical-center");
                        setMobileMenuOpen(false);
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all text-center ${ecosystem === "user" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                    >
                      Користувач
                    </button>
                    <button
                      onClick={() => {
                        setEcosystem("admin");
                        setActiveTab("admin-back-office");
                        setMobileMenuOpen(false);
                      }}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all text-center ${ecosystem === "admin" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                    >
                      Адміністратор
                    </button>
                  </div>
                </div>

                {/* Scenarios / Action tabs list */}
                <div className="p-4 space-y-6">
                  {ecosystem === "user" ? (
                    <>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                          Головне
                        </span>
                        <button onClick={() => {setActiveTab("dashboard"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <LayoutDashboard className="w-4 h-4"/> Дашборд
                        </button>
                        <button onClick={() => {setActiveTab("investigation-workspace"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <Briefcase className="w-4 h-4"/> Мої Розслідування
                        </button>
                        <button onClick={() => {setActiveTab("live-analytical-center"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <Bot className="w-4 h-4"/> ШІ-Аналітика
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                          Інструменти пошуку
                        </span>
                        <button onClick={() => {setActiveTab("ckan-explorer"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <Database className="w-4 h-4"/> Державні Реєстри
                        </button>
                        <button onClick={() => {setActiveTab("osint"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <Search className="w-4 h-4"/> Глобальний Пошук
                        </button>
                        <button onClick={() => {setActiveTab("person-profiler"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <UserCheck className="w-4 h-4"/> Досьє на Осіб
                        </button>
                        <button onClick={() => {setActiveTab("media-forensics"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <Camera className="w-4 h-4"/> Аналіз Медіа
                        </button>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                          Аналіз та Зв'язки
                        </span>
                        <button onClick={() => {setActiveTab("sandbox"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <Network className="w-4 h-4"/> Граф Зв'язків
                        </button>
                        <button onClick={() => {setActiveTab("maps"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <Map className="w-4 h-4"/> Геопросторова Карта
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2 px-1">
                          Адміністрування
                        </span>
                        <button onClick={() => {setActiveTab("admin-back-office"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <Settings className="w-4 h-4"/> Back Office Консоль
                        </button>
                        <button onClick={() => {setActiveTab("predator-control"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <ShieldAlert className="w-4 h-4"/> Панель PREDATOR
                        </button>
                        <button onClick={() => {setActiveTab("data-ingestion"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <Database className="w-4 h-4"/> Завантаження Даних
                        </button>
                        <button onClick={() => {setActiveTab("audit-log"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <ShieldAlert className="w-4 h-4"/> Журнал Аудиту
                        </button>
                        <button onClick={() => {setActiveTab("autonomous-factory"); setMobileMenuOpen(false);}} className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3">
                          <Cpu className="w-4 h-4"/> Автономна Фабрика
                        </button>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2 px-1 mt-4">
                          Архітектура Інфраструктури
                        </span>
                        {[
                          { id: "architecture", label: "Граф залежностей", icon: Network },
                          { id: "gap", label: "Аналіз прогалин", icon: Wrench },
                          { id: "roadmap", label: "Дорожня карта", icon: Calendar },
                          { id: "catalog", label: "Каталог рішень", icon: Layers },
                          { id: "license", label: "Сумісність ліцензій", icon: ShieldAlert },
                          { id: "volumes", label: "Томи ТЗ", icon: Database },
                          { id: "advisor", label: "ШІ-Архітектор", icon: Cpu },
                        ].map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => {
                                id: tab.id;
                                setActiveTab(tab.id as TabId);
                                setMobileMenuOpen(false);
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg flex items-center gap-3"
                            >
                              <Icon className="w-4 h-4" /> {tab.label}
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderIpadLayout = () => {
    return (
      <div
        className="min-h-screen w-full bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none"
        id="ipad-simulator-view"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_100%)] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-[1024px] h-[768px] bg-slate-900/40 backdrop-blur-md rounded-[32px] p-2 shadow-2xl shadow-black/50 border border-slate-800 flex flex-col transform origin-center scale-[0.75] md:scale-[0.85] xl:scale-95 2xl:scale-100 transition-all duration-300"
        >
          {/* Hardware bezel details */}
          <div className="absolute top-1/2 -left-0.5 w-1 h-12 bg-slate-700 rounded-l-md -translate-y-1/2"></div>
          <div className="absolute top-1/2 -right-0.5 w-1 h-12 bg-slate-700 rounded-r-md -translate-y-1/2"></div>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-black border border-slate-800 flex items-center justify-center">
             <div className="w-1 h-1 rounded-full bg-blue-900/40" />
          </div>
          
          <div className="flex-1 rounded-[20px] overflow-hidden bg-slate-950 flex flex-col relative border border-black shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
             {renderDesktopLayout()}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderIphoneLayout = () => {
    if (isRealMobile) {
      return (
        <div
          className="h-[100dvh] w-full bg-slate-950 text-slate-200 flex flex-col relative overflow-hidden select-none"
          id="real-iphone-view"
        >
          {/* iOS Status Bar styled edge-to-edge with safe-area support */}
          <div className="shrink-0 h-[calc(env(safe-area-inset-top,20px)+24px)] bg-slate-950 text-white px-6 flex items-end justify-between text-xs font-semibold z-50 select-none relative pb-1.5">
            <span className="text-slate-200 tracking-tight">{iphoneTime}</span>
            
            {/* Interactive Dynamic Island scaled for real phone */}
            <motion.div
              onClick={handleDynamicIslandClick}
              animate={dynamicIslandState}
              variants={{
                normal: { width: 100, height: 26, borderRadius: 9999, y: 0, x: "-50%" },
                expanded: { width: "90%", height: 70, borderRadius: 24, y: 4, x: "-50%" },
                "mute-alert": { width: 180, height: 32, borderRadius: 9999, y: 4, x: "-50%" },
                "unmute-alert": { width: 160, height: 32, borderRadius: 9999, y: 4, x: "-50%" },
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-black text-white flex items-center justify-center cursor-pointer shadow-lg overflow-hidden z-50 border border-slate-900"
            >
              {dynamicIslandState === "normal" && (
                <div className="flex items-center gap-1.5 justify-center w-full px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#111] border border-slate-900"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-900/30"></div>
                </div>
              )}
              
              {dynamicIslandState === "expanded" && (
                <div className="flex flex-col w-full h-full p-2.5 justify-between text-[10px] leading-snug">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-blue-400 font-bold font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                      NEXUS CORE
                    </div>
                    <span className="text-slate-400 text-[9px] font-mono">CPU: 18%</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5 text-slate-300">
                    <span>ШІ Агент працює</span>
                    <span className="text-emerald-400 font-bold">🟢 125 реєстрів online</span>
                  </div>
                </div>
              )}

              {dynamicIslandState === "mute-alert" && (
                <div className="flex items-center gap-2 px-3 text-[11px] text-rose-400 font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4l5-5v12"></path><path d="M14 9a3 3 0 0 1 3 3"></path></svg>
                  <span>Без звуку</span>
                </div>
              )}

              {dynamicIslandState === "unmute-alert" && (
                <div className="flex items-center gap-2 px-3 text-[11px] text-emerald-400 font-semibold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                  <span>Звук увімкнено</span>
                </div>
              )}
            </motion.div>

            <div className="flex items-center gap-1.5 text-slate-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10h-10V2z"/></svg>
              <span className="text-[9px]">5G</span>
              <div className="w-4 h-2 border border-slate-300 rounded-sm p-0.5 flex items-center relative">
                <div className="h-full w-3 bg-emerald-500 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* SCREEN CONTENT - Edge-to-edge */}
          <div className="flex-1 relative overflow-hidden flex flex-col pb-[env(safe-area-inset-bottom,0px)]">
            
            {/* LOCKSCREEN OVERLAY */}
            <AnimatePresence>
              {isIphoneLocked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-slate-950 z-50 flex flex-col justify-between p-6 text-center select-none"
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,58,138,0.3)_0%,transparent_85%)] pointer-events-none" />

                  <div className="mt-6 flex justify-center">
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow"
                    >
                      <Shield className="w-6 h-6 text-slate-300" />
                    </motion.div>
                  </div>

                  <div className="mt-2 space-y-1">
                    <h1 className="text-5xl font-extralight tracking-tight text-white font-sans">
                      {iphoneTime}
                    </h1>
                    <p className="text-xs font-medium text-slate-300">
                      {lockscreenDate}
                    </p>
                  </div>

                  <div className="my-auto flex flex-col gap-3">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900/85 backdrop-blur-md border border-slate-800/80 p-4 rounded-3xl text-left shadow-lg space-y-2 max-w-sm mx-auto"
                    >
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white">
                            N
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Nexus Cyber-Command
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-500">Зараз</span>
                      </div>
                      <h4 className="text-xs font-bold text-white">🟢 Стан мережі реєстрів стабільний</h4>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        Виявлено 125/125 активних джерел. Глибоке комплаєнс-сканування завершено.
                      </p>
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between px-4">
                    <button className="w-12 h-12 rounded-full bg-slate-900/60 flex items-center justify-center text-white cursor-pointer border-none outline-none">
                      <Sparkles className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => setIsIphoneLocked(false)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-full transition-all tracking-wider shadow-lg shadow-blue-900/30 cursor-pointer animate-bounce border-none outline-none"
                    >
                      🔓 РОЗБЛОКУВАТИ
                    </button>

                    <button className="w-12 h-12 rounded-full bg-slate-900/60 flex items-center justify-center text-white cursor-pointer border-none outline-none">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="w-32 h-1 bg-white/40 rounded-full mx-auto" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* UNLOCKED MAIN WORKSPACE CONTENT */}
            {renderMobileMainContent()}
          </div>

          {/* iOS Home Indicator Bar overlay with extra bottom padding for native safe area */}
          <div className="shrink-0 h-[calc(env(safe-area-inset-bottom,12px)+8px)] bg-slate-950 flex items-center justify-center relative select-none pb-2">
            <div className="w-32 h-1.5 bg-slate-800/80 rounded-full" />
          </div>
        </div>
      );
    }

    return (
      <div
        className="min-h-screen w-full bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none"
        id="iphone-simulator-view"
      >
        {/* Ambient glow behind the iPhone */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_100%)] pointer-events-none" />

        <div className="absolute top-4 text-center z-50">
          <button
            onClick={() => setDeviceMode("desktop")}
            className="px-4 py-2 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-blue-400 text-xs font-bold font-mono tracking-wider rounded-full transition-all cursor-pointer shadow-lg flex items-center gap-2 mx-auto"
          >
            💻 ПОВЕРНУТИСЬ НА ДЕСКТОП
          </button>
        </div>

        {/* Physical iPhone 15 Pro Max Frame - titanium styling & larger dimensions */}
        <div className="relative mx-auto my-auto transition-all duration-500 z-10 w-[430px] h-[932px] bg-slate-950 rounded-[62px] p-[10px] ring-1 ring-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] border-[6px] border-slate-800 flex flex-col overflow-hidden transform scale-75 sm:scale-[0.82] md:scale-[0.9] lg:scale-100 max-h-[96vh] origin-center">
          
          {/* HARDWARE BUTTONS SIMULATION */}
          {/* Left: Action Button */}
          <button
            onClick={handleActionButton}
            className="absolute left-0 top-[150px] w-1.5 h-8 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-blue-600 hover:to-blue-500 rounded-l-md border-y border-l border-slate-900 shadow transition-all cursor-pointer"
            title="Екшн-кнопка (Режим без звуку)"
          />
          {/* Left: Volume Up */}
          <button
            onClick={() => adjustVolume(10)}
            className="absolute left-0 top-[205px] w-1.5 h-14 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-blue-600 hover:to-blue-500 rounded-l-md border-y border-l border-slate-900 shadow transition-all cursor-pointer"
            title="Гучність +"
          />
          {/* Left: Volume Down */}
          <button
            onClick={() => adjustVolume(-10)}
            className="absolute left-0 top-[280px] w-1.5 h-14 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-blue-600 hover:to-blue-500 rounded-l-md border-y border-l border-slate-900 shadow transition-all cursor-pointer"
            title="Гучність -"
          />
          {/* Right: Power Button */}
          <button
            onClick={toggleIphonePower}
            className="absolute right-0 top-[225px] w-1.5 h-24 bg-gradient-to-l from-slate-700 to-slate-800 hover:from-blue-600 hover:to-blue-500 rounded-r-md border-y border-r border-slate-900 shadow transition-all cursor-pointer"
            title="Живлення / Блокування"
          />

          {/* INTERNAL SCREEN CONTAINER */}
          <div className="flex-1 rounded-[54px] overflow-hidden bg-slate-950 flex flex-col relative border border-black shadow-inner">
            
            {/* iOS Status Bar (Interactive Notch / Dynamic Island container) */}
            <div className="shrink-0 h-11 bg-slate-950 text-white px-8 flex items-center justify-between text-xs font-semibold z-50 select-none relative">
              <span className="text-slate-200 tracking-tight">{iphoneTime}</span>
              
              {/* Animated Dynamic Island */}
              <motion.div
                onClick={handleDynamicIslandClick}
                animate={dynamicIslandState}
                variants={{
                  normal: { width: 110, height: 30, borderRadius: 9999, y: 0, x: "-50%" },
                  expanded: { width: 340, height: 74, borderRadius: 28, y: 4, x: "-50%" },
                  "mute-alert": { width: 220, height: 36, borderRadius: 9999, y: 4, x: "-50%" },
                  "unmute-alert": { width: 200, height: 36, borderRadius: 9999, y: 4, x: "-50%" },
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="absolute top-2 left-1/2 -translate-x-1/2 bg-black text-white flex items-center justify-center cursor-pointer shadow-lg overflow-hidden z-50 border border-slate-900"
              >
                {dynamicIslandState === "normal" && (
                  <div className="flex items-center gap-2 justify-center w-full px-2">
                    <div className="w-2 h-2 rounded-full bg-[#111] border border-slate-900"></div>
                    <div className="w-2 h-2 rounded-full bg-blue-900/30"></div>
                  </div>
                )}
                
                {dynamicIslandState === "expanded" && (
                  <div className="flex flex-col w-full h-full p-3 justify-between text-[11px] leading-snug">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-blue-400 font-bold font-mono">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                        NEXUS ANALYTICAL CORE
                      </div>
                      <span className="text-slate-400 text-[10px] font-mono">CPU: 18%</span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-slate-300">
                      <span>ШІ Агент працює</span>
                      <span className="text-emerald-400 font-bold">🟢 125 реєстрів онлайн</span>
                    </div>
                  </div>
                )}

                {dynamicIslandState === "mute-alert" && (
                  <div className="flex items-center gap-2 px-3 text-xs text-rose-400 font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 17H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4l5-5v12"></path><path d="M14 9a3 3 0 0 1 3 3"></path></svg>
                    <span>Без звуку</span>
                  </div>
                )}

                {dynamicIslandState === "unmute-alert" && (
                  <div className="flex items-center gap-2 px-3 text-xs text-emerald-400 font-semibold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                    <span>Звук увімкнено</span>
                  </div>
                )}
              </motion.div>

              <div className="flex items-center gap-1.5 text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10h-10V2z"/></svg>
                <span className="text-[10px]">5G</span>
                <div className="w-5 h-2.5 border border-slate-300 rounded-sm p-0.5 flex items-center relative">
                  <div className="h-full w-4 bg-emerald-500 rounded-2xs" />
                  <div className="absolute -right-0.5 top-0.5 w-0.5 h-1.5 bg-slate-300 rounded-r-2xs" />
                </div>
              </div>
            </div>

            {/* Simulated Side Volume HUD Overlay */}
            <AnimatePresence>
              {showVolumeHUD && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute top-[180px] left-2 bg-slate-900/90 border border-slate-800 rounded-full w-5 h-28 flex flex-col justify-end p-1 z-50 shadow-2xl backdrop-blur-sm"
                >
                  <div
                    className="w-full bg-blue-500 rounded-full transition-all duration-150"
                    style={{ height: `${iphoneVolume}%` }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* SCREEN CONTENT */}
            <div className="flex-1 relative overflow-hidden flex flex-col">
              
              {/* LOCKSCREEN OVERLAY */}
              <AnimatePresence>
                {isIphoneLocked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-slate-950 z-50 flex flex-col justify-between p-8 text-center select-none"
                  >
                    {/* Wallpaper glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,58,138,0.3)_0%,transparent_85%)] pointer-events-none" />

                    {/* Lock Icon */}
                    <div className="mt-8 flex justify-center">
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow"
                      >
                        <Shield className="w-6 h-6 text-slate-300" />
                      </motion.div>
                    </div>

                    {/* Clock & Date */}
                    <div className="mt-4 space-y-1">
                      <motion.h1 className="text-6xl font-extralight tracking-tight text-white font-sans">
                        {iphoneTime}
                      </motion.h1>
                      <p className="text-sm font-medium text-slate-300">
                        {lockscreenDate}
                      </p>
                    </div>

                    {/* Notifications Widget */}
                    <div className="my-auto flex flex-col gap-3">
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900/80 backdrop-blur-md border border-slate-800/80 p-4 rounded-3xl text-left shadow-lg space-y-2 max-w-sm mx-auto"
                      >
                        <div className="flex items-center gap-2 justify-between">
                          <div className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center font-bold text-[10px] text-white">
                              N
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              Nexus Cyber-Command
                            </span>
                          </div>
                          <span className="text-[9px] text-slate-500">Зараз</span>
                        </div>
                        <h4 className="text-xs font-bold text-white">🟢 Стан мережі реєстрів стабільний</h4>
                        <p className="text-[11px] text-slate-400 leading-snug">
                          Виявлено 125/125 активних джерел. Глибоке комплаєнс-сканування завершено без затримок.
                        </p>
                      </motion.div>
                    </div>

                    {/* Bottom Quick Tools */}
                    <div className="flex items-center justify-between px-4">
                      {/* Flashlight button */}
                      <button className="w-12 h-12 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-white transition-all cursor-pointer">
                        <Sparkles className="w-5 h-5" />
                      </button>

                      {/* Unlock button */}
                      <button
                        onClick={() => setIsIphoneLocked(false)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-full transition-all tracking-wider shadow-lg shadow-blue-900/30 cursor-pointer animate-bounce"
                      >
                        🔓 РОЗБЛОКУВАТИ
                      </button>

                      {/* Camera button */}
                      <button className="w-12 h-12 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-white transition-all cursor-pointer">
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>

                    {/* iOS Home Indicator */}
                    <div className="w-32 h-1 bg-white/40 rounded-full mx-auto" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* UNLOCKED MAIN WORKSPACE CONTENT */}
              {renderMobileMainContent()}
            </div>

            {/* iOS Home Indicator Bar overlay */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-800/80 rounded-full z-50 pointer-events-none" />
          </div>
        </div>
      </div>
    );
  };

  const renderDesktopLayout = () => {
    return (
      <div
        className="h-full bg-slate-950 text-slate-200 flex flex-col font-sans selection:bg-blue-500/30"
        id="nexus-hub-app"
      >
        {/* TOP NAVBAR */}
        <header className="shrink-0 h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
                N
              </div>
              <span className="text-sm font-bold tracking-wide text-slate-200 flex items-center gap-2">
                Nexus Analytics
              </span>
            </div>

            {ecosystem === "user" ? (
              <form onSubmit={handleHeaderSearch} className="hidden xl:flex items-center relative ml-4 w-72">
                <Search className="w-4 h-4 absolute left-3 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={headerSearchQuery}
                  onChange={(e) => setHeaderSearchQuery(e.target.value)}
                  placeholder="Миттєвий пошук компанії чи особи..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                />
              </form>
            ) : null}

            <div className="hidden lg:flex items-center gap-1 ml-4 bg-slate-950/50 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setDeviceMode("desktop")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${deviceMode === "desktop" ? "bg-slate-800 text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                title="Режим ПК"
              >
                💻 ПК
              </button>
              <button
                onClick={() => setDeviceMode("ipad")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${deviceMode === "ipad" ? "bg-slate-800 text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                title="Режим Планшет"
              >
                <Tablet className="w-4 h-4" />
                Планшет
              </button>
              <button
                onClick={() => setDeviceMode("iphone")}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${deviceMode === "iphone" ? "bg-slate-800 text-blue-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                title="Режим Телефон"
              >
                📱 Телефон
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {ecosystem === "user" ? (
              <button
                onClick={() => setIsUserGuideOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                <HelpCircle className="w-4 h-4 text-blue-400" />
                <span>💡 Як користуватися?</span>
              </button>
            ) : null}

            {/* Real-time Firestore Connection Indicator */}
            <FirebaseSyncIndicator />

            <div className="hidden md:flex items-center gap-3 pr-3 border-r border-slate-800">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {ecosystem === "user" ? "Стан реєстрів" : "Телеметрія ECIP"}
                </span>
                {ecosystem === "user" ? (
                  <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    🟢 125/125 джерел працюють
                  </span>
                ) : (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    K8S OK | 14ms | 1420 RPS
                  </span>
                )}
              </div>
            </div>

            <AuthStatus />

            {/* Quick Ecosystem Mode Toggle Badge */}
            <button
              onClick={() => {
                if (ecosystem === "user") {
                  setEcosystem("admin");
                  setActiveTab("admin-back-office");
                } else {
                  setEcosystem("user");
                  setActiveTab("dashboard");
                }
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                ecosystem === "user"
                  ? "bg-slate-800 border-slate-700 text-blue-300 hover:bg-slate-700"
                  : "bg-emerald-950/80 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80"
              }`}
              title={ecosystem === "user" ? "Переключити на технічну консоль Адміна" : "Переключити на простий режим Користувача"}
            >
              {ecosystem === "user" ? (
                <>
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span>Режим: Користувач</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Режим: Адмін</span>
                </>
              )}
            </button>
            
            <button className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-800">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"></span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
          </div>
        </header>

        {/* MAIN CONTENT ZONE */}
        <div className="flex-1 flex overflow-hidden relative bg-slate-950">
          {/* LEFT SIDEBAR */}
          <aside
            className={`shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 z-10 ${sidebarCollapsed ? "w-[68px]" : "w-[260px]"}`}
            id="tactical-sidebar"
          >
            {/* Navigation group */}
            <div className="p-3 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
              
              {/* Ecosystem Selector Desktop */}
              {!sidebarCollapsed && (
                <div className="mb-4 space-y-2 pb-4 border-b border-slate-800/60">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block px-1">
                    Простір Управління
                  </span>
                  <div className="flex gap-1.5 p-1 bg-slate-950/50 rounded-lg border border-slate-800/80">
                    <button
                      onClick={() => {
                        setEcosystem("user");
                        setActiveTab("live-analytical-center");
                      }}
                      className={`flex-1 py-1.5 px-1 rounded-md text-[10px] font-medium transition-all flex items-center justify-center gap-1 ${ecosystem === "user" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                    >
                      <User className="w-3.5 h-3.5" /> Користувач
                    </button>
                    <button
                      onClick={() => {
                        setEcosystem("admin");
                        setActiveTab("admin-back-office");
                      }}
                      className={`flex-1 py-1.5 px-1 rounded-md text-[10px] font-medium transition-all flex items-center justify-center gap-1 ${ecosystem === "admin" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                    >
                      <Shield className="w-3.5 h-3.5" /> Адмін
                    </button>
                  </div>
                </div>
              )}
              {sidebarCollapsed && (
                <div className="mb-4 pb-4 border-b border-slate-800/60 flex justify-center">
                   <button
                      onClick={() => {
                        if (ecosystem === "user") {
                          setEcosystem("admin");
                          setActiveTab("admin-back-office");
                        } else {
                          setEcosystem("user");
                          setActiveTab("live-analytical-center");
                        }
                      }}
                      className="w-10 h-10 rounded-lg bg-slate-950/50 border border-slate-800/80 flex items-center justify-center text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      title={ecosystem === "user" ? "Switch to Admin" : "Switch to User"}
                    >
                      {ecosystem === "user" ? <User className="w-5 h-5" /> : <Shield className="w-5 h-5 text-emerald-400" />}
                    </button>
                </div>
              )}

              {ecosystem === "user" ? (
                <>
                  <div className="space-y-6">
                    {/* 📊 ГОЛОВНЕ */}
                    <div className="space-y-1">
                      {!sidebarCollapsed && (
                        <div className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Головне
                        </div>
                      )}
                      
                      <button
                        onClick={() => setActiveTab("dashboard")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "dashboard" ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                      >
                        <LayoutDashboard className={`w-4 h-4 ${activeTab === "dashboard" ? "text-blue-400" : "text-slate-400"}`} />
                        {!sidebarCollapsed && <span>Дашборд</span>}
                      </button>

                      <button
                        onClick={() => setActiveTab("investigation-workspace")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "investigation-workspace" ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                      >
                        <Briefcase className={`w-4 h-4 ${activeTab === "investigation-workspace" ? "text-blue-400" : "text-slate-400"}`} />
                        {!sidebarCollapsed && <span>Мої Розслідування</span>}
                      </button>

                      <button
                        onClick={() => setActiveTab("live-analytical-center")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "live-analytical-center" ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                      >
                        <Bot className={`w-4 h-4 ${activeTab === "live-analytical-center" ? "text-blue-400" : "text-slate-400"}`} />
                        {!sidebarCollapsed && <span>ШІ Аналітика</span>}
                      </button>
                    </div>

                    {/* 🔍 ІНСТРУМЕНТИ OSINT */}
                    <div className="space-y-1">
                      {!sidebarCollapsed && (
                        <div className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Інструменти пошуку
                        </div>
                      )}

                      <button
                        onClick={() => setActiveTab("ckan-explorer")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "ckan-explorer" ? "bg-emerald-500/10 text-emerald-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                      >
                        <Database className={`w-4 h-4 ${activeTab === "ckan-explorer" ? "text-emerald-400" : "text-slate-400"}`} />
                        {!sidebarCollapsed && <span>Державні Реєстри</span>}
                      </button>

                      <button
                        onClick={() => setActiveTab("osint")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "osint" ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                      >
                        <Search className={`w-4 h-4 ${activeTab === "osint" ? "text-blue-400" : "text-slate-400"}`} />
                        {!sidebarCollapsed && <span>Глобальний Пошук</span>}
                      </button>

                      <button
                        onClick={() => setActiveTab("person-profiler")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "person-profiler" || activeTab === "adverse" ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                      >
                        <UserCheck className={`w-4 h-4 ${activeTab === "person-profiler" || activeTab === "adverse" ? "text-blue-400" : "text-slate-400"}`} />
                        {!sidebarCollapsed && <span>Досьє на Осіб</span>}
                      </button>
                      
                      <button
                        onClick={() => setActiveTab("media-forensics")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "media-forensics" ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                      >
                        <Camera className={`w-4 h-4 ${activeTab === "media-forensics" ? "text-blue-400" : "text-slate-400"}`} />
                        {!sidebarCollapsed && <span>Аналіз Медіа</span>}
                      </button>
                    </div>

                    {/* 🛠 АНАЛІЗ ТА ЗВ'ЯЗКИ */}
                    <div className="space-y-1">
                      {!sidebarCollapsed && (
                        <div className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Аналіз та Зв'язки
                        </div>
                      )}

                      <button
                        onClick={() => setActiveTab("sandbox")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "sandbox" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                      >
                        <Network className={`w-4 h-4 ${activeTab === "sandbox" ? "text-indigo-400" : "text-slate-400"}`} />
                        {!sidebarCollapsed && <span>Граф Зв'язків</span>}
                      </button>

                      <button
                        onClick={() => setActiveTab("maps")}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "maps" ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                      >
                        <Map className={`w-4 h-4 ${activeTab === "maps" ? "text-blue-400" : "text-slate-400"}`} />
                        {!sidebarCollapsed && <span>Геопросторова Карта</span>}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1">
                    {!sidebarCollapsed && (
                      <div className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Адміністрування
                      </div>
                    )}
                    <button
                      onClick={() => setActiveTab("admin-back-office")}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "admin-back-office" ? "bg-emerald-500/10 text-emerald-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                    >
                      <Settings className={`w-4 h-4 ${activeTab === "admin-back-office" ? "text-emerald-400" : "text-slate-400"}`} />
                      {!sidebarCollapsed && <span>Консоль управління</span>}
                    </button>
                    
                    <button
                      onClick={() => setActiveTab("predator-control")}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "predator-control" ? "bg-indigo-500/10 text-indigo-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                    >
                      <ShieldAlert className={`w-4 h-4 ${activeTab === "predator-control" ? "text-indigo-400" : "text-slate-400"}`} />
                      {!sidebarCollapsed && <span>Панель PREDATOR</span>}
                    </button>

                    <button
                      onClick={() => setActiveTab("data-ingestion")}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "data-ingestion" ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                    >
                      <Database className={`w-4 h-4 ${activeTab === "data-ingestion" ? "text-blue-400" : "text-slate-400"}`} />
                      {!sidebarCollapsed && <span>Завантаження Даних</span>}
                    </button>
                    <button
                      onClick={() => setActiveTab("audit-log")}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "audit-log" ? "bg-amber-500/10 text-amber-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                    >
                      <ShieldAlert className={`w-4 h-4 ${activeTab === "audit-log" ? "text-amber-400" : "text-slate-400"}`} />
                      {!sidebarCollapsed && <span>Журнал Аудиту</span>}
                    </button>

                    <button
                      onClick={() => setActiveTab("autonomous-factory")}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === "autonomous-factory" ? "bg-purple-500/10 text-purple-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                    >
                      <Cpu className={`w-4 h-4 ${activeTab === "autonomous-factory" ? "text-purple-400" : "text-slate-400"}`} />
                      {!sidebarCollapsed && <span>Автономна Фабрика</span>}
                    </button>
                  </div>

                  <div className="space-y-1 mt-6">
                    {!sidebarCollapsed && (
                      <div className="px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Архітектура Інфраструктури
                      </div>
                    )}
                    {[
                      { id: "architecture", label: "Граф залежностей", icon: Network },
                      { id: "gap", label: "Аналіз прогалин", icon: Wrench },
                      { id: "roadmap", label: "Дорожня карта", icon: Calendar },
                      { id: "catalog", label: "Каталог рішень", icon: Layers },
                      { id: "license", label: "Сумісність ліцензій", icon: ShieldAlert },
                      { id: "volumes", label: "Томи ТЗ", icon: Database },
                      { id: "advisor", label: "ШІ-Архітектор", icon: Cpu },
                    ].map((tab) => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id as TabId);
                            if (tab.id === "architecture") {
                              setSelectedNode({
                                id: "core_api",
                                label: "Core REST API",
                                group: "Core",
                              });
                              setSelectedEntity(null);
                              setSelectedTool(null);
                            }
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${isActive ? "bg-blue-500/10 text-blue-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                          {!sidebarCollapsed && <span>{tab.label}</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              
              {!sidebarCollapsed && (
                <div className="bg-slate-800/30 border border-slate-700/50 p-3 rounded-xl space-y-3 mt-6">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Стан Системи
                  </span>
                  <div className="space-y-2 text-xs text-slate-400">
                    <div className="flex justify-between items-center">
                      <span>Kafka:</span>
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        0 lag
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Qdrant:</span>
                      <span className="text-blue-400 font-medium">98% Match</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Collapsed control */}
            <div className="p-3 border-t border-slate-800">
              <button
                onClick={() => setIsInspectorOpen(!isInspectorOpen)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {!sidebarCollapsed && <LayoutDashboard className="w-4 h-4" />}
                {sidebarCollapsed
                  ? "INSP"
                  : isInspectorOpen
                    ? "Сховати Інспектор"
                    : "Показати Інспектор"}
              </button>
            </div>
          </aside>
          {/* MAIN WORKSPACE (Section 8) */}
          <main
            className="flex-1 overflow-y-auto p-2 bg-slate-950 relative"
            id="workspace-main"
          >
          <div className="max-w-[1800px] mx-auto space-y-6">
            {/* Active Navigation Breadcrumbs */}
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono uppercase tracking-wider mb-2">
              <span>NEXUS</span>
              <span>/</span>
              <span className="text-blue-400 font-bold">
                {ecosystem === "user"
                  ? "КОРИСТУВАЦЬКА ЕКОСИСТЕМА"
                  : "АДМІНІСТРАТИВНА ЕКОСИСТЕМА"}
              </span>
              <span>/</span>
              <span className="text-blue-400 font-bold">
                {activeTab === "live-analytical-center" &&
                  "Живий Аналітичний Центр (ШІ-Ядро)"}
                {activeTab === "admin-back-office" &&
                  "Back Office Консоль (ArgoCD & Grafana)"}
                {activeTab === "dashboard" && "Аналітичний Дашборд"}
                {activeTab === "osint" && "Розширений OSINT Пошук OSINT"}
                {activeTab === "maps" && "Інтерактивна Карта NEXUS"}
                {activeTab === "catalog" && "Каталог рішень"}
                {activeTab === "license" && "Сумісність ліцензій"}
                {activeTab === "architecture" && "Граф залежностей"}
                {activeTab === "gap" && "Аналіз прогалин"}
                {activeTab === "roadmap" && "Дорожня карта"}
                {activeTab === "volumes" && "Томи ТЗ"}
                {activeTab === "advisor" && "ШІ-Архітектор"}
                {activeTab === "media-forensics" && "Аналіз Медіа (Forensics)"}
                {activeTab === "audit-log" && "Журнал Аудиту"}
                {activeTab === "data-ingestion" &&
                  "AI Intelligence Acquisition"}
                {activeTab === "autonomous-factory" &&
                  "Автономна Фабрика Оркестрації"}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {/* Dynamic routing */}
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
          </main>

          {/* RIGHT INSPECTOR PANEL (Section 9) */}
          <AnimatePresence>
            {isInspectorOpen && (
              <motion.aside
                initial={{ opacity: 0, x: 200, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 340 }}
                exit={{ opacity: 0, x: 200, width: 0 }}
                className="shrink-0 h-full overflow-hidden"
                id="right-inspector-panel"
              >
                <InspectorPanel
                  selectedEntity={selectedEntity}
                  selectedTool={selectedTool}
                  selectedNode={selectedNode}
                  onClose={() => setIsInspectorOpen(false)}
                />
              </motion.aside>
            )}
          </AnimatePresence>
        </div>

        {/* 5. FLOATING AI ASSISTANT TERMINAL (Section 17) */}
        {ecosystem === "user" && (
          <div className="fixed bottom-14 right-6 z-50">
            {/* Toggle bubble button */}
            <button
              onClick={() => setIsAiChatOpen(!isAiChatOpen)}
              className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-2xl transition-all cursor-pointer flex items-center justify-center border border-blue-400/20 group"
              title="ШІ-Помічник NEXUS"
            >
              <Bot className="w-5.5 h-5.5 group-hover:rotate-12 transition-transform" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full"></span>
            </button>

            {/* Assistant window */}
            <AnimatePresence>
              {isAiChatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.95 }}
                  className="absolute bottom-14 right-0 w-80 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[380px]"
                >
                  {/* Header */}
                  <div className="p-2 bg-indigo-950/20 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        NEXUS ШІ-Асистент
                      </span>
                    </div>
                    <button
                      onClick={() => setIsAiChatOpen(false)}
                      className="text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Chat messages */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-3 text-xs">
                    {chatHistory.map((msg, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-2xl leading-relaxed max-w-[85%] ${msg.sender === "user" ? "bg-blue-600 text-white ml-auto" : "bg-black/40 backdrop-blur-md shadow-[0_4px_30px_rgba(30,58,138,0.1)] border border-slate-800 text-slate-300"}`}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="p-2 border-t border-slate-800 bg-slate-950/80 flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Запитайте ШІ про санкції чи SQL..."
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendMessage();
                      }}
                      className="flex-1 bg-black/40 backdrop-blur-md shadow-[0_4px_30px_rgba(30,58,138,0.1)] border border-slate-800 rounded-2xl px-2.5 py-2 text-xs focus:outline-none focus:border-slate-800"
                    />
                    <button
                      onClick={startVoiceControl}
                      className={`p-2 rounded-2xl transition-colors cursor-pointer flex items-center justify-center ${isVoiceListening ? "bg-red-500/20 text-red-400 border border-red-500/20 animate-pulse" : "bg-black/40 backdrop-blur-md shadow-[0_4px_30px_rgba(30,58,138,0.1)] border border-slate-800 text-slate-300 hover:text-blue-400"}`}
                      title="Голосовий ввід"
                    >
                      <Mic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-2xl transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* 4. BOTTOM STATUS BAR (Section 10) */}
        {ecosystem === "admin" ? (
          <footer className="border-t border-slate-800 bg-slate-950 px-2 py-1.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-mono uppercase tracking-wider z-40 sticky bottom-0">
            {/* Left indicators */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                NEXUS ENG: ONLINE
              </span>
              <span>API: 12ms</span>
              <span className="text-blue-400 font-bold">
                GPU: NVIDIA A100 (42% VRAM)
              </span>
              <span>CPU: 18%</span>
              <span>RAM: 14.8 GB / 64 GB</span>
            </div>

            {/* Right indices and queues statuses */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-emerald-400">
                INDEXING: ACTIVE (140 files/sec)
              </span>
              <span>БАЗИ: Neo4j, Qdrant, PG</span>
              <span className="text-amber-500 font-bold">
                QUEUES: KAFKA (0 LAG)
              </span>
              <span>LLM: GEMINI 3.5 FLASH</span>
              <span>КЛАСТЕР: CLOUD RUN EUR-W2</span>
            </div>
          </footer>
        ) : (
          <footer className="border-t border-slate-800 bg-slate-950 px-2 py-1.5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 font-mono uppercase tracking-wider z-40 sticky bottom-0">
            {/* Left analytical indicators */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-blue-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                СЕКТОР: АНАЛІТИКА ТА РОЗСЛІДУВАННЯ (ДЕРЖСПЕЦЗВ'ЯЗОК)
              </span>
              <span className="text-slate-300">
                РЕЄСТРИ:{" "}
                <strong className="text-slate-200">СИНХРОНІЗОВАНО</strong>
              </span>
              <span className="text-emerald-400 font-bold">
                КЛАС КАНАЛУ: НАДІЙНИЙ (AES-GCM)
              </span>
              <span className="text-slate-300">
                КАБІНЕТ:{" "}
                <strong className="text-slate-200">ОФІЦЕР-АНАЛІТИК</strong>
              </span>
            </div>

            {/* Right analytical indicators */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-blue-400 font-bold">
                ПРОТОКОЛ: RSA-4096 (ДЕРЖСПЕЦЗВ'ЯЗОК)
              </span>
              <span className="text-slate-300">
                ІНТЕГРАЦІЯ: YOUCONTROL, OPENDATABOT, МИТНИЦЯ, РНБО
              </span>
              <span className="text-blue-400 font-bold">
                ШІ-ЯДРО: NEXUS INTEL v3.5
              </span>
            </div>
          </footer>
        )}

        {/* 6. COMMAND CENTER SPOTLIGHT PANEL (Ctrl+K) */}
        <AnimatePresence>
          {isSpotlightOpen && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-3">
              {/* Backdrop blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSpotlightOpen(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />

              {/* Modal Dialog container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -10 }}
                transition={{ duration: 0.15 }}
                className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px] z-50"
              >
                {/* Search input header */}
                <div className="flex items-center gap-2 px-2 py-1.5 border-b border-slate-800 bg-slate-950/50">
                  <Search className="w-4 h-4 text-blue-400 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Введіть запит для пошуку (напр. 'Дашборд', 'сан', 'Коваленко' чи 'звук')..."
                    value={spotlightQuery}
                    onChange={(e) => setSpotlightQuery(e.target.value)}
                    className="w-full bg-transparent text-white placeholder-slate-500 text-xs focus:outline-none"
                  />
                  <span className="text-xs bg-black/40 backdrop-blur-md shadow-[0_4px_30px_rgba(30,58,138,0.1)] border border-slate-800 text-slate-300 px-2 py-1 rounded font-mono shrink-0">
                    ESC
                  </span>
                </div>

                {/* Categorized results list */}
                <div className="flex-1 overflow-y-auto p-2 space-y-4">
                  {/* Navigation suggestions */}
                  {spotlightResults.navigation.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-bold block">
                        🧭 Навігація та Екосистема
                      </span>
                      <div className="grid grid-cols-1 gap-1">
                        {spotlightResults.navigation.map((n) => (
                          <button
                            key={n.id}
                            onClick={() => handleSpotlightSelect(n)}
                            className="w-full text-left px-2 py-1.5 rounded-2xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-blue-600/20 hover:border-slate-800 border border-transparent transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_2px_10px_rgba(99,102,241,0.15)] flex items-center justify-between cursor-pointer"
                          >
                            <span>{n.label}</span>
                            <span className="text-xs text-blue-500 font-mono">
                              Перейти →
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Simulated Device controls / Actions */}
                  {spotlightResults.actions.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-mono text-amber-400 uppercase tracking-widest font-bold block">
                        ⚡ Команди керування симуляцією
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {spotlightResults.actions.map((a) => (
                          <button
                            key={a.id}
                            onClick={() => handleSpotlightSelect(a)}
                            className="text-left px-2 py-1.5 rounded-2xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-amber-600/20 hover:border-slate-800 border border-transparent bg-black/30 transition-all flex items-center justify-between cursor-pointer"
                          >
                            <span>{a.label}</span>
                            <span className="text-xs text-amber-500 font-mono">
                              Виконати
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Entities / OSINT records */}
                  {spotlightResults.entities.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-mono text-rose-400 uppercase tracking-widest font-bold block">
                        👥 Аналітична база даних OSINT (Компанії / Бенефіціари)
                      </span>
                      <div className="grid grid-cols-1 gap-1">
                        {spotlightResults.entities.map((e) => (
                          <button
                            key={e.id}
                            onClick={() => handleSpotlightSelect(e)}
                            className="w-full text-left px-2 py-1.5 rounded-2xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-rose-600/20 hover:border-slate-800 border border-transparent transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_2px_10px_rgba(244,63,94,0.15)] flex items-center justify-between cursor-pointer"
                          >
                            <span>{e.label}</span>
                            <span className="text-xs bg-rose-500/10 border border-slate-800 px-2 py-1 rounded text-rose-400 font-mono font-bold">
                              {e.raw.risk_level === "CRITICAL"
                                ? "⚠️ КРИТИЧНИЙ"
                                : "🔴 ВИСОКИЙ"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* If nothing matches */}
                  {spotlightResults.navigation.length === 0 &&
                    spotlightResults.actions.length === 0 &&
                    spotlightResults.entities.length === 0 && (
                      <div className="text-center py-8">
                        <AlertTriangle className="w-8 h-8 text-slate-500 mx-auto mb-2 animate-bounce" />
                        <p className="text-xs text-slate-300 font-semibold">
                          Жодного збігу не знайдено для "{spotlightQuery}"
                        </p>
                        <p className="text-xs text-slate-600 mt-1 font-mono">
                          Спробуйте ввести інший пошуковий термін
                        </p>
                      </div>
                    )}
                </div>

                {/* Spotlight footer */}
                <div className="px-2 py-1.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <span>Швидкі дії:</span>
                    <strong className="text-slate-300 font-bold bg-black/40 backdrop-blur-md shadow-[0_4px_30px_rgba(30,58,138,0.1)] border border-slate-800 px-2 py-1 rounded">
                      ↑↓
                    </strong>
                    <span>для вибору,</span>
                    <strong className="text-slate-300 font-bold bg-black/40 backdrop-blur-md shadow-[0_4px_30px_rgba(30,58,138,0.1)] border border-slate-800 px-2 py-1 rounded">
                      Enter
                    </strong>
                    <span>для запуску</span>
                  </span>
                  <span className="text-blue-400 font-bold uppercase tracking-wider">
                    NEXUS COMMAND PANEL v2.5
                  </span>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {deviceMode === "iphone" ? renderIphoneLayout() : deviceMode === "ipad" ? renderIpadLayout() : (
    <div className="h-screen w-full bg-slate-950 overflow-hidden">
      {renderDesktopLayout()}
    </div>
  )}
      </AnimatePresence>

      {/* Floating Voice Control HUD Overlay */}
      <AnimatePresence>
        {isVoiceListening && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 10 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-red-500/30 shadow-2xl rounded-2xl px-2 py-1.5 z-50 flex items-center gap-2 w-[420px] max-w-[90vw] backdrop-blur-md"
          >
            <div className="relative flex h-3.5 w-3.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                🎙️ Голосовий аналізатор NEXUS активний
              </p>
              <p className="text-xs text-slate-200 font-medium truncate mt-0.5 font-sans">
                {voiceFeedback ||
                  "Слухаю голос... Назвіть команду навігації чи пошуку"}
              </p>
            </div>
            <div className="flex gap-0.5 items-center justify-end h-5 w-12 shrink-0">
              <motion.div
                className="w-[3px] bg-red-400 rounded-full animate-pulse"
                style={{ height: 12 }}
              />
              <motion.div
                className="w-[3px] bg-red-400 rounded-full animate-pulse"
                style={{ height: 20 }}
              />
              <motion.div
                className="w-[3px] bg-red-400 rounded-full animate-pulse"
                style={{ height: 8 }}
              />
              <motion.div
                className="w-[3px] bg-red-400 rounded-full animate-pulse"
                style={{ height: 24 }}
              />
              <motion.div
                className="w-[3px] bg-red-400 rounded-full animate-pulse"
                style={{ height: 14 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Voice Control Toast / Feedback Alert */}
      <AnimatePresence>
        {!isVoiceListening && (voiceFeedback || voiceError) && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 10, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 shadow-[0_15px_40px_rgba(0,0,0,0.5)] rounded-2xl p-2 z-50 flex flex-col gap-2 w-[450px] max-w-[90vw] backdrop-blur-md border ${voiceError ? "bg-red-950/95 border-red-500/40 text-red-200 shadow-red-900/10" : "bg-slate-950/95 border-slate-800 text-slate-200 shadow-indigo-900/10"}`}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-xs shrink-0 mt-0.5">
                {voiceError ? "⚠️" : "🎙️"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                  {voiceError
                    ? "Помилка голосового аналізатора"
                    : "Аналітичний голос NEXUS"}
                </p>
                <p className="text-xs font-semibold tracking-wide leading-relaxed mt-0.5">
                  {voiceError || voiceFeedback}
                </p>
              </div>
              <button
                onClick={() => {
                  setVoiceError(null);
                  setVoiceFeedback(null);
                }}
                className="text-slate-500 hover:text-slate-300 transition-colors text-xs p-1 font-bold font-mono"
              >
                ✕
              </button>
            </div>

            {voiceError && (
              <div className="border-t border-red-500/10 pt-2.5 mt-0.5">
                <p className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider mb-2">
                  ⚡ Клікніть, щоб симулювати голосову команду:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    {
                      label: "📊 Перейти на Дашборд",
                      cmd: "перейди на дашборд",
                    },
                    { label: "🗺️ Показати Карту", cmd: "покажи карту" },
                    { label: "🔍 OSINT пошук", cmd: "осінт пошук" },
                    { label: "👤 Знайди Коваленко", cmd: "знайди Коваленко" },
                    { label: "🛡️ Дорожня карта", cmd: "дорожня карта" },
                    { label: "⚠️ Санкції РНБО?", cmd: "які санкції?" },
                  ].map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setVoiceError(null);
                        setVoiceFeedback(`Симульовано команду: "${item.cmd}"`);
                        handleVoiceCommand(item.cmd);
                        setTimeout(() => setVoiceFeedback(null), 3000);
                      }}
                      className="bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-white border border-red-500/20 hover:border-red-500/40 px-2 py-1.5 rounded-2xl text-xs font-semibold text-left transition-all cursor-pointer truncate"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Guide Modal for non-technical users */}
      <AnimatePresence>
        {isUserGuideOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl max-w-2xl w-full p-6 text-slate-100 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold text-xl">
                    💡
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Проста інструкція для користувача</h3>
                    <p className="text-xs text-slate-400">Як швидко перевірити компанію або людину без технічних навичок</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsUserGuideOpen(false)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-5 space-y-5 text-sm">
                <div className="p-4 bg-blue-950/40 border border-blue-800/50 rounded-xl space-y-2">
                  <h4 className="font-bold text-blue-300 flex items-center gap-2">
                    <span>1. Як знайти інформацію про компанію чи особу?</span>
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Введіть назву фірми (наприклад, <strong>"СпецТехПостач"</strong>), код ЄДРПОУ або ПІБ особи у верхньому полі пошуку або у розділі <strong>"Глибокий Пошук"</strong>. Система миттєво перевірить понад 125 відкритих реєстрів.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950/60 border border-emerald-500/30 rounded-xl">
                    <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                      Зелений колір
                    </div>
                    <p className="text-slate-300 text-[11px]">Компанія чи особа чиста, борги та санкції відсутні.</p>
                  </div>

                  <div className="p-3 bg-slate-950/60 border border-amber-500/30 rounded-xl">
                    <div className="text-amber-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                      Жовтий колір
                    </div>
                    <p className="text-slate-300 text-[11px]">Є зауваження: заборгованість чи зміна бенефіціарів.</p>
                  </div>

                  <div className="p-3 bg-slate-950/60 border border-rose-500/30 rounded-xl">
                    <div className="text-rose-400 font-bold text-xs flex items-center gap-1.5 mb-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                      Червоний колір
                    </div>
                    <p className="text-slate-300 text-[11px]">Критичний ризик: санкції РНБО, судови справи або зв'язок з агресором.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-200 flex items-center gap-2">
                    <span>2. Як завантажити документ на перевірку?</span>
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Перейдіть у розділ <strong>"Завантаження Даних"</strong> у лівому меню, виберіть файл Excel або PDF з вашого комп'ютера та натисніть "Перевірити".
                  </p>
                </div>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-200 flex items-center gap-2">
                    <span>3. Потрібен адмінський/технічний вигляд?</span>
                  </h4>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Якщо ви системний адміністратор і бажаєте бачити телеметрію, стан Kubernetes, ArgoCD та логування, натисніть кнопку <strong>"Режим: Користувач"</strong> у правому верхньому кутку для перемикання в <strong>"Режим: Адмін"</strong>.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => setIsUserGuideOpen(false)}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Зрозуміло, розпочати роботу
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <LiveChatBot />
      <VoiceCall />
    </>
  );
}
