"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { PageLoader } from "@/components/shared/Spinner";
import { useSettings, useSystemHealth } from "@/hooks/useData";
import { getStatusColor } from "@/lib/utils";
import {
  Settings,
  Sliders,
  Camera,
  Palette,
  Info,
  Server,
  Cpu,
  MemoryStick,
  HardDrive,
  Save,
  CheckCircle2,
  RefreshCw,
  BrainCircuit,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function SettingsPage() {
  const { settings, loading, updateSettings } = useSettings();
  const { health, loading: healthLoading } = useSystemHealth();
  const [threshold, setThreshold] = useState(60);
  const [cameraIndex, setCameraIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) {
      setThreshold(Math.round(settings.recognition_threshold * 100));
      setCameraIndex(settings.camera_index);
    }
  }, [settings]);

  const handleSave = async () => {
    await updateSettings({
      recognition_threshold: threshold / 100,
      camera_index: cameraIndex,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <PageHeader title="Settings" description="Configure your VisionAttend AI system" />
        </motion.div>

        {loading ? (
          <PageLoader />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={item} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sliders className="h-5 w-5 text-accent" />
                    Recognition Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm text-foreground font-medium">Recognition Threshold</label>
                      <span className="text-sm text-accent font-bold">{threshold}%</span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={100}
                      value={threshold}
                      onChange={(e) => setThreshold(Number(e.target.value))}
                      className="w-full h-2 bg-card-border rounded-full appearance-none cursor-pointer accent-accent"
                    />
                    <div className="flex justify-between text-xs text-muted">
                      <span>30% (More detections)</span>
                      <span>100% (Strict matching)</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Higher values require more confident matches but may miss some faces.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-accent" />
                    Camera Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-foreground font-medium">Camera Source</label>
                    <select
                      value={cameraIndex}
                      onChange={(e) => setCameraIndex(Number(e.target.value))}
                      className="w-full h-10 rounded-lg bg-card border border-card-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                    >
                      <option value={0}>Default Camera (0)</option>
                      <option value={1}>External Camera (1)</option>
                      <option value={2}>USB Camera (2)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-accent" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/3 border border-card-border/50">
                    <div>
                      <p className="text-sm font-medium text-foreground">Dark Theme</p>
                      <p className="text-xs text-muted-foreground">Always enabled for VisionAttend AI</p>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Palette className="h-5 w-5 text-accent" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center gap-3">
                <Button variant="accent" onClick={handleSave}>
                  {saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  {saved ? "Saved!" : "Save Settings"}
                </Button>
              </div>
            </motion.div>

            <motion.div variants={item} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-accent" />
                    System Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-card-border/50">
                      <span className="text-sm text-muted-foreground">System Name</span>
                      <span className="text-sm text-foreground font-medium">VisionAttend AI</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-card-border/50">
                      <span className="text-sm text-muted-foreground">Version</span>
                      <span className="text-sm text-foreground font-medium">v1.0.0</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-card-border/50">
                      <span className="text-sm text-muted-foreground">AI Model</span>
                      <span className="text-sm text-foreground font-medium">FaceNet v1.0</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Framework</span>
                      <span className="text-sm text-foreground font-medium">FastAPI + React</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5 text-accent" />
                    Backend Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {healthLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => <div key={i} className="h-8 bg-card animate-pulse rounded" />)}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-card-border/50">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Server className="h-3.5 w-3.5" /> Backend
                        </span>
                        <span className={`text-sm font-medium ${getStatusColor(health?.backend_status ?? "offline")}`}>
                          {health?.backend_status === "online" ? "Connected" : "Disconnected"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-card-border/50">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <BrainCircuit className="h-3.5 w-3.5" /> AI Model
                        </span>
                        <span className={`text-sm font-medium ${getStatusColor(health?.model_status ?? "error")}`}>
                          {health?.model_status === "loaded" ? "Loaded" : health?.model_status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-card-border/50">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Cpu className="h-3.5 w-3.5" /> CPU Usage
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-card-border rounded-full overflow-hidden">
                            <div className="h-full bg-accent rounded-full" style={{ width: `${health?.cpu_usage ?? 0}%` }} />
                          </div>
                          <span className="text-sm text-foreground font-medium">{health?.cpu_usage}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-card-border/50">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <MemoryStick className="h-3.5 w-3.5" /> Memory
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-card-border rounded-full overflow-hidden">
                            <div className="h-full bg-info rounded-full" style={{ width: `${health?.memory_usage ?? 0}%` }} />
                          </div>
                          <span className="text-sm text-foreground font-medium">{health?.memory_usage}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <HardDrive className="h-3.5 w-3.5" /> Version
                        </span>
                        <span className="text-sm text-foreground font-medium">v{health?.version}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}
