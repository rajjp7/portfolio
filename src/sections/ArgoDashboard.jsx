import React, { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, LineChart, MessageSquare, Database, Search, Bot, User, AlertTriangle, X,
  Thermometer, Droplets, Battery, Orbit, TrendingUp, Bell, Wind, Waves, Globe
} from "lucide-react";
import {
  AreaChart, Area, Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Line,
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { clsx } from "clsx";
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// =================================================================================================
// --- MOCK DATA & CONFIGURATION ---
// =================================================================================================
const floatLocations = [
  { id: 1, lat: -20.2, lng: 70.3, name: "Float #WMO49032", status: "Active", battery: 92, cycle: 142, profileData: [{d:0,t:25,s:35},{d:500,t:12,s:34},{d:1000,t:6,s:34.5},{d:2000,t:4,s:34.7}] },
  { id: 2, lat: 5.6, lng: 85.1, name: "Float #WMO23981", status: "Inactive", battery: 12, cycle: 250, profileData: [{d:0,t:28,s:34},{d:500,t:15,s:34.2},{d:1000,t:8,s:34.6},{d:2000,t:4.2,s:34.8}] },
  { id: 3, lat: -10.5, lng: 65.4, name: "Float #WMO78234", status: "Active", battery: 78, cycle: 89, profileData: [{d:0,t:26,s:35.2},{d:500,t:14,s:34.1},{d:1000,t:7,s:34.5},{d:2000,t:4.1,s:34.7}] },
  { id: 4, lat: 15.1, lng: 68.9, name: "Float #WMO12983", status: "Drifting", battery: 55, cycle: 112, profileData: [{d:0,t:29,s:34.8},{d:500,t:16,s:34.3},{d:1000,t:9,s:34.5},{d:2000,t:4.3,s:34.7}] },
];
const riskRegions = [
    { name: 'Bay of Bengal', lat: 15.0, lng: 88.0, riskLevel: 'Critical', sstAnomaly: 2.1, ohc: 180, salinityDeviation: -0.8, prognosis: 'Extremely high ocean heat content and SST anomalies create a volatile environment ripe for rapid cyclonic intensification. Immediate monitoring is advised.', history: Array.from({length:10}, (_,i) => ({d:i,v:70+i*2+Math.random()*5})) },
    { name: 'Gulf of Mexico', lat: 25.0, lng: -90.0, riskLevel: 'High', sstAnomaly: 1.6, ohc: 155, salinityDeviation: -0.5, prognosis: 'Conditions are highly favorable for tropical storm development. The Loop Current shows signs of strengthening, which could fuel any forming systems.', history: Array.from({length:10}, (_,i) => ({d:i,v:55+i*1.5+Math.random()*4})) },
    { name: 'Coral Sea', lat: -15.0, lng: 150.0, riskLevel: 'Moderate', sstAnomaly: 0.9, ohc: 120, salinityDeviation: 0.3, prognosis: 'Elevated temperatures suggest a medium-term risk of marine heatwaves, potentially leading to coral bleaching events. Cyclonic risk is currently low but increasing.', history: Array.from({length:10}, (_,i) => ({d:i,v:40+i*0.5+Math.random()*3})) },
];
const monthlyComparisonData = [
  { month: "Mar", temp: 29, salinity: 35.0, lastYearTemp: 28.5 },
  { month: "Apr", temp: 28.5, salinity: 34.9, lastYearTemp: 28.2 },
  { month: "May", temp: 27.5, salinity: 34.6, lastYearTemp: 27.8 },
  { month: "Jun", temp: 26.8, salinity: 34.2, lastYearTemp: 26.5 },
  { month: "Jul", temp: 26.2, salinity: 34.1, lastYearTemp: 26.0 },
  { month: "Aug", temp: 26.5, salinity: 34.3, lastYearTemp: 26.3 },
];
const seasonalAnomalyData = [
    { name: 'High Temp Anomaly', value: 400, color: '#ef4444' },
    { name: 'Normal Range', value: 300, color: '#64748b' },
    { name: 'Low Temp Anomaly', value: 150, color: '#3b82f6' },
];
const notifications = [
    { id: 1, icon: Wind, text: "New cyclone 'Aria' forming in Bay of Bengal.", time: "5m ago", color: "red" },
    { id: 2, icon: Thermometer, text: "Marine heatwave detected near Coral Sea.", time: "2h ago", color: "amber" },
    { id: 3, icon: Waves, text: "Anomalous current shift in North Atlantic.", time: "8h ago", color: "blue" },
];

// =================================================================================================
// --- CUSTOM LEAFLET ICONS ---
// =================================================================================================
const activeIcon = new L.Icon({ iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZHRoPSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwNmI2ZDQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSI3Ij48L2NpcmNsZT48Y2lyY2xlIGN4PSIxMiIgY3k9IjEwIiByPSIzIj48L2NpcmNsZT48L2c+PC9zdmc+", iconSize: [24, 24], iconAnchor: [12, 24], popupAnchor: [0, -24], });
const inactiveIcon = new L.Icon({ iconUrl: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2NDcyYTQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJNMjAgMTBhOCA4IDAgMSAwLTE2IDAgOCA4IDAgMCAwIDE2IDB6Ij48L3BhdGg+PGxpbmUgeDE9IjUiIHkxPSI1IiB4Mj0iMTkiIHkyPSIxOSI+PC9saW5lPjwvc3ZnPg==", iconSize: [24, 24], iconAnchor: [12, 24], popupAnchor: [0, -24], });

// =================================================================================================
// --- REUSABLE UI COMPONENTS ---
// =================================================================================================

const DashboardPanel = ({ children, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
    className={clsx("border border-white/10 bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/30", className)}
  >{children}</motion.div>
);

const SkeletonPanel = ({ type = 'default' }) => {
    if (type === 'compare') {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <DashboardPanel className="p-6 lg:col-span-3 animate-pulse"><div className="h-80 bg-slate-800/50 rounded-lg"></div></DashboardPanel>
                <DashboardPanel className="p-6 lg:col-span-2 animate-pulse"><div className="h-80 bg-slate-800/50 rounded-lg"></div></DashboardPanel>
            </div>
        );
    }
    return (
        <DashboardPanel className="p-6 animate-pulse">
            <div className="h-8 bg-slate-800/50 rounded w-3/4 mb-6"></div>
            <div className="h-[calc(100vh-250px)] bg-slate-800/50 rounded w-full"></div>
        </DashboardPanel>
    );
};

const StatCard = ({ icon: Icon, title, value, unit, delay, colorClass = "text-cyan-400" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: delay * 0.1 }}
        className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/80 transition-transform duration-200 hover:scale-105 hover:bg-slate-800"
    >
        <div className="flex items-center text-slate-400 text-sm font-medium">
            <Icon className={`mr-2 ${colorClass}`} size={16} />
            <span>{title}</span>
        </div>
        <p className="text-2xl font-semibold text-slate-200 mt-2">
            {value} <span className="text-lg text-slate-400">{unit}</span>
        </p>
    </motion.div>
);

// =================================================================================================
// --- DETAIL MODAL COMPONENT ---
// =================================================================================================
const DetailModal = ({ spot, onClose }) => {
    if (!spot) return null;

    const renderContent = () => {
        if (spot.type === 'risk') {
            return (
                <>
                    <div className="p-6 border-b border-slate-700">
                        <h3 className="text-xl font-bold text-white">{spot.name}</h3>
                        <p className={clsx("font-semibold", 
                            spot.riskLevel === 'Critical' && 'text-red-400',
                            spot.riskLevel === 'High' && 'text-amber-400',
                            spot.riskLevel === 'Moderate' && 'text-yellow-400'
                        )}>{spot.riskLevel} Risk Zone</p>
                    </div>
                    <div className="p-6 grid grid-cols-3 gap-4">
                        <StatCard icon={Thermometer} title="SST Anomaly" value={`+${spot.sstAnomaly}`} unit="°C" delay={1} colorClass="text-red-400" />
                        <StatCard icon={TrendingUp} title="Ocean Heat" value={spot.ohc} unit="kJ/cm²" delay={2} colorClass="text-amber-400" />
                        <StatCard icon={Droplets} title="Salinity Dev." value={spot.salinityDeviation} unit="PSU" delay={3} colorClass="text-blue-400" />
                    </div>
                    <div className="px-6 pb-6">
                        <h4 className="font-semibold text-slate-300 mb-2">AI Prognosis</h4>
                        <p className="text-sm text-slate-400">{spot.prognosis}</p>
                    </div>
                    <div className="px-6 pb-6 h-48">
                        <h4 className="font-semibold text-slate-300 mb-2">10-Day Risk Trend</h4>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={spot.history} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <defs><linearGradient id="riskColor" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient></defs>
                                <Tooltip contentStyle={{ backgroundColor: "rgba(30, 41, 59, 0.8)", borderColor: "#475569" }} />
                                <YAxis stroke="#94a3b8" domain={[0,100]} />
                                <XAxis dataKey="d" stroke="#94a3b8" />
                                <Area type="monotone" dataKey="v" stroke="#ef4444" fill="url(#riskColor)" strokeWidth={2} name="Risk Index" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </>
            );
        }
        if (spot.type === 'float') {
            return (
                 <>
                    <div className="p-6 border-b border-slate-700">
                        <h3 className="text-xl font-bold text-white">{spot.name}</h3>
                        <p className={clsx("font-semibold", spot.status === 'Active' ? 'text-green-400' : 'text-slate-500')}>{spot.status}</p>
                    </div>
                    <div className="p-6 grid grid-cols-2 gap-4">
                        <StatCard icon={Battery} title="Battery" value={spot.battery} unit="%" delay={1} colorClass="text-green-400" />
                        <StatCard icon={Orbit} title="Cycle Number" value={spot.cycle} unit="" delay={2} colorClass="text-cyan-400" />
                    </div>
                    <div className="px-6 pb-6 h-64">
                         <h4 className="font-semibold text-slate-300 mb-2">Last Transmitted Profile</h4>
                         <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={spot.profileData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                                 <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                                 <XAxis dataKey="d" type="number" reversed={true} label={{ value: 'Depth (m)', position: 'insideBottom', dy: 10, fill: "#94a3b8" }} stroke="#94a3b8" />
                                 <YAxis yAxisId="left" stroke="#06b6d4" />
                                 <YAxis yAxisId="right" orientation="right" stroke="#facc15" />
                                 <Tooltip contentStyle={{ backgroundColor: "rgba(30, 41, 59, 0.8)", borderColor: "#475569" }}/>
                                 <Line yAxisId="left" type="monotone" dataKey="t" stroke="#06b6d4" name="Temp" dot={false} strokeWidth={2}/>
                                 <Line yAxisId="right" type="monotone" dataKey="s" stroke="#facc15" name="Salinity" dot={false} strokeWidth={2}/>
                             </LineChart>
                         </ResponsiveContainer>
                    </div>
                </>
            )
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-2xl bg-slate-900/80 border border-slate-700 rounded-2xl shadow-2xl relative"
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors z-10">
                    <X size={24} />
                </button>
                {renderContent()}
            </motion.div>
        </div>
    );
};


// =================================================================================================
// --- VIEW COMPONENTS (TAB SCREENS) ---
// =================================================================================================

const ChatView = ({ onTabChange }) => {
  const [messages, setMessages] = useState([ { role: "assistant", content: "Hello! How can I help you explore the ARGO dataset today? 🌊" } ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setTimeout(() => { 
        setMessages((prev) => [ ...prev, { 
            role: "assistant", 
            content: "Certainly! I've pulled up the requested comparison data.",
            action: { label: "View Comparisons", tab: "compare" }
        }]); 
    }, 1200);
  };

  return (
    <DashboardPanel className="p-6 flex flex-col h-[calc(100vh-100px)]">
      <h2 className="text-xl font-bold mb-4 text-slate-200 tracking-wide">Conversational AI</h2>
      <div className="flex-1 overflow-y-auto space-y-4 pr-3">
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={clsx("flex items-start gap-3", m.role === "user" && "justify-end")}>
              {m.role === "assistant" && <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center flex-shrink-0"><Bot className="w-5 h-5 text-cyan-400" /></div>}
              <div className={clsx("p-3 rounded-xl max-w-lg", m.role === "user" ? "rounded-br-none bg-cyan-600/80" : "rounded-bl-none bg-slate-800/70" )}>
                  <p className="text-slate-200">{m.content}</p>
                  {m.action && (
                      <button onClick={() => onTabChange(m.action.tab)} className="mt-2 text-sm bg-cyan-600/50 hover:bg-cyan-600 text-white font-semibold py-1 px-3 rounded-md transition">
                          {m.action.label}
                      </button>
                  )}
              </div>
              {m.role === "user" && <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-slate-300" /></div>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex mt-6 gap-3">
        <textarea placeholder="e.g., Show me a year-over-year comparison for the Indian Ocean..." value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
          className="flex-1 resize-none rounded-lg bg-slate-800/70 border border-slate-700 text-white px-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition" />
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={sendMessage}
          className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg shadow-cyan-500/20"> Send </motion.button>
      </div>
    </DashboardPanel>
  );
};

const PredictionView = ({ onSpotSelect }) => {
    const riskColors = { 'Critical': '#ef4444', 'High': '#f59e0b', 'Moderate': '#eab308' };
    const [liveSST, setLiveSST] = useState(2.1);
    const [liveOHC, setLiveOHC] = useState(180);

    useEffect(() => {
        const interval = setInterval(() => {
            setLiveSST(prev => parseFloat((prev + (Math.random() - 0.5) * 0.1).toFixed(1)));
            setLiveOHC(prev => parseInt(prev + (Math.random() - 0.5) * 2));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardPanel className="p-6">
            <h2 className="text-xl font-bold text-slate-200 tracking-wide mb-4">Real-Time Disaster Prediction</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
                <div className="lg:col-span-2 h-full rounded-lg overflow-hidden border border-slate-800">
                    <MapContainer center={[10, 45]} zoom={3} scrollWheelZoom={true} className="h-full bg-slate-900">
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
                        {riskRegions.map((region) => (
                            <CircleMarker key={region.name} center={[region.lat, region.lng]}
                                pathOptions={{ color: riskColors[region.riskLevel], fillColor: riskColors[region.riskLevel], fillOpacity: 0.7 }}
                                radius={12} eventHandlers={{ click: () => onSpotSelect({ type: 'risk', ...region }) }}>
                                <Popup>Click for detailed prognosis of {region.name}</Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="p-4 rounded-lg bg-red-900/30 border border-red-500/50 text-center">
                        <h3 className="font-semibold text-red-400">CRITICAL ALERT</h3>
                        <p className="text-slate-300 mt-1 text-sm">Conditions favorable for imminent cyclogenesis in the Bay of Bengal.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <StatCard icon={Thermometer} title="Live SST Anomaly" value={`+${liveSST}`} unit="°C" delay={1} colorClass="text-red-400" />
                        <StatCard icon={TrendingUp} title="Live Ocean Heat" value={liveOHC} unit="kJ/cm²" delay={2} colorClass="text-amber-400" />
                    </div>
                    <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 flex-1">
                        <h4 className="font-semibold text-slate-300 mb-2">Live AI Analysis</h4>
                        <p className="text-sm text-slate-400">
                            Dynamic heat flux models show a &95% probability of tropical cyclone formation within 48 hours. Floats in the region confirm a rapidly deepening warm water layer.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardPanel>
    )
}

const MapView = ({ onSpotSelect }) => (
  <DashboardPanel>
    <div className="p-6"><h2 className="text-xl font-bold text-slate-200 tracking-wide">Global ARGO Float Array</h2></div>
    <div className="h-[calc(100vh-150px)] rounded-b-2xl overflow-hidden">
      <MapContainer center={[10, 75]} zoom={3} scrollWheelZoom={true} className="h-full bg-slate-900">
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
        {floatLocations.map((f) => (
          <Marker key={f.id} position={[f.lat, f.lng]} icon={f.status === "Active" ? activeIcon : inactiveIcon}
            eventHandlers={{ click: () => onSpotSelect({ type: 'float', ...f }) }}>
             <Popup>Click to see details for {f.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  </DashboardPanel>
);

const CompareView = () => (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div variants={{hidden:{opacity:0, y:20}, visible:{opacity:1, y:0}}} className="lg:col-span-3">
             <DashboardPanel className="p-6 h-full">
                <h3 className="text-lg font-semibold text-slate-200 tracking-wide">Year-Over-Year Temperature</h3>
                <p className="text-sm text-slate-400 mb-4">Comparing current sea surface temperatures against the previous year's baseline.</p>
                <ResponsiveContainer width="100%" height={300}>
                     <AreaChart data={monthlyComparisonData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs><linearGradient id="cTY" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient><linearGradient id="cLY" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#64748b" stopOpacity={0.5}/><stop offset="95%" stopColor="#64748b" stopOpacity={0}/></linearGradient></defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                        <XAxis dataKey="month" stroke="#94a3b8" /> <YAxis stroke="#94a3b8" />
                        <Tooltip contentStyle={{ backgroundColor: "rgba(30, 41, 59, 0.8)", borderColor: "#475569" }} /> <Legend />
                        <Area type="monotone" dataKey="temp" stroke="#06b6d4" fill="url(#cTY)" name="This Year" />
                        <Area type="monotone" dataKey="lastYearTemp" stroke="#64748b" fill="url(#cLY)" name="Last Year" />
                    </AreaChart>
                </ResponsiveContainer>
            </DashboardPanel>
        </motion.div>
        <motion.div variants={{hidden:{opacity:0, y:20}, visible:{opacity:1, y:0}}} className="lg:col-span-2">
            <DashboardPanel className="p-6 h-full">
                <h3 className="text-lg font-semibold text-slate-200 tracking-wide">Seasonal Anomaly</h3>
                <p className="text-sm text-slate-400 mb-4">Distribution of months with above or below average temperatures.</p>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={seasonalAnomalyData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={5} labelLine={false}>
                            {seasonalAnomalyData.map((entry) => <Cell key={entry.name} fill={entry.color} stroke={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "rgba(30, 41, 59, 0.8)", borderColor: "#475569" }}/>
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </DashboardPanel>
        </motion.div>
    </motion.div>
);

const GlobeView = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        if (!mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);
        camera.position.z = 2.5;

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.enablePan = false;
        controls.minDistance = 1.5;
        controls.maxDistance = 5;

        const textureLoader = new THREE.TextureLoader();

        // Earth
        const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
        const earthMaterial = new THREE.MeshStandardMaterial({
            map: textureLoader.load('https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/world.topo.bathy.200412.3x5400x2700.jpg'),
        });
        const earth = new THREE.Mesh(earthGeometry, earthMaterial);
        scene.add(earth);
        
        // Atmosphere
        const atmosphereGeometry = new THREE.SphereGeometry(1, 64, 64);
        const atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vertexNormal;
                void main() {
                    vertexNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 vertexNormal;
                void main() {
                    float intensity = pow(0.6 - dot(vertexNormal, vec3(0,0,1.0)), 2.0);
                    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
                }
            `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        atmosphere.scale.set(1.1, 1.1, 1.1);
        scene.add(atmosphere);

        // Floats
        const floatMaterial = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
        floatLocations.forEach(loc => {
            const phi = (90 - loc.lat) * (Math.PI / 180);
            const theta = (loc.lng + 180) * (Math.PI / 180);
            const x = -(Math.sin(phi) * Math.cos(theta));
            const y = Math.cos(phi);
            const z = Math.sin(phi) * Math.sin(theta);
            
            const floatGeometry = new THREE.SphereGeometry(0.01, 16, 16);
            const float = new THREE.Mesh(floatGeometry, floatMaterial);
            float.position.set(x, y, z);
            earth.add(float);
        });
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(5, 3, 5);
        scene.add(pointLight);

        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            earth.rotation.y += 0.0005;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            mountRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <DashboardPanel className="p-1 h-[calc(100vh-100px)] overflow-hidden">
            <div ref={mountRef} className="w-full h-full rounded-2xl"></div>
             <div className="absolute top-6 left-6">
                <h2 className="text-xl font-bold text-slate-200 tracking-wide">3D Global Float View</h2>
            </div>
        </DashboardPanel>
    );
};


// =================================================================================================
// --- MAIN DASHBOARD COMPONENT ---
// =================================================================================================
export default function ArgoDashboard() {
  const [activeTab, setActiveTab] = useState("globe");
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const navItems = [
    { id: "globe", label: "3D Globe", icon: Globe },
    { id: "prediction", label: "Prediction", icon: AlertTriangle },
    { id: "map", label: "2D Map", icon: MapPin }, 
    { id: "compare", label: "Comparisons", icon: Database },
    { id: "chat", label: "Chat AI", icon: MessageSquare },
  ];
  
  const changeTab = (tab) => {
    if (tab === activeTab) return;
    setLoading(true);
    setActiveTab(tab);
    setTimeout(() => setLoading(false), 600);
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notificationRef]);

  const renderContent = () => {
    if (loading) return <SkeletonPanel type={activeTab === 'compare' ? 'compare' : 'default'} />;
    switch (activeTab) {
      case "globe": return <GlobeView />;
      case "prediction": return <PredictionView onSpotSelect={setSelectedSpot} />;
      case "map": return <MapView onSpotSelect={setSelectedSpot} />;
      case "compare": return <CompareView />;
      case "chat": default: return <ChatView onTabChange={changeTab} />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-slate-950 via-[#101d30] to-cyan-950 text-slate-300 font-sans">
        <aside className="w-64 border-r border-white/10 bg-slate-950/60 backdrop-blur-xl p-4 flex flex-col flex-shrink-0">
            <h1 className="text-2xl font-bold mb-8 text-white tracking-wider"><span className="text-cyan-400">Argo</span> AI</h1>
            <nav className="space-y-2">
                {navItems.map((item) => (
                    <button key={item.id} onClick={() => changeTab(item.id)}
                        className={clsx("flex items-center w-full px-4 py-2.5 rounded-lg text-left transition-all duration-200", activeTab === item.id ? "bg-cyan-500/20 text-cyan-300 font-semibold" : "hover:bg-slate-800/50 text-slate-400" )}>
                        <item.icon className={clsx("mr-3 h-5 w-5", activeTab === item.id && (item.id === 'prediction' ? 'text-red-400' : 'text-cyan-300'))} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>

        <main className="flex-1 p-6 space-y-6 overflow-y-auto relative">
            <header className="flex justify-between items-center">
                <div className="relative w-1/3 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input placeholder="Search datasets, floats, regions..." className="w-full rounded-lg bg-slate-800/70 border border-slate-700/60 text-white pl-10 pr-4 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"/>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-green-400"><div className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></div><span className="text-sm font-semibold">Live</span></div>
                    <div className="relative" ref={notificationRef}>
                        <button onClick={() => setShowNotifications(!showNotifications)} className="text-slate-400 hover:text-white transition relative"><Bell size={20} /><span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span></button>
                        <AnimatePresence>
                        {showNotifications && (
                            <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}
                                className="absolute top-full right-0 mt-3 w-80 bg-slate-800/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-2xl z-20">
                                <div className="p-3 border-b border-slate-700"><h4 className="font-semibold text-white">Notifications</h4></div>
                                <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
                                    {notifications.map(n => (
                                        <div key={n.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-slate-700/50">
                                            <n.icon size={32} className={clsx("mt-1 flex-shrink-0", n.color === 'red' && 'text-red-400', n.color === 'amber' && 'text-amber-400', n.color === 'blue' && 'text-blue-400')} />
                                            <div><p className="text-sm text-slate-200">{n.text}</p><p className="text-xs text-slate-500">{n.time}</p></div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-400 hidden lg:block">Dr. Evelyn Reed</span>
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 ring-2 ring-offset-2 ring-offset-slate-900 ring-cyan-400 flex-shrink-0" />
                    </div>
                </div>
            </header>

            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>

            <AnimatePresence>
                {selectedSpot && <DetailModal spot={selectedSpot} onClose={() => setSelectedSpot(null)} />}
            </AnimatePresence>
      </main>
    </div>
  );
}

