"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useAttendanceLogs, useSystemHealth } from "@/hooks/useData";
import { getStatusColor, getConfidenceColor, formatTime } from "@/lib/utils";
import type { RecognitionResult } from "@/types";
import {
  Camera,
  CameraOff,
  Eye,
  Scan,
  UserCheck,
  Clock,
  Wifi,
  WifiOff,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function LiveAttendancePage() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastRecognition, setLastRecognition] = useState<RecognitionResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { logs, loading: logsLoading } = useAttendanceLogs();
  const { health } = useSystemHealth();

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch {
      // Camera access denied or unavailable
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
    setIsScanning(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const simulateRecognition = () => {
    if (!isStreaming) return;
    setIsScanning(true);

    setTimeout(() => {
      const mockResult: RecognitionResult = {
        employee_id: "EMP001",
        employee_name: "Alex Johnson",
        confidence: 0.96,
        status: "recognized",
        timestamp: new Date().toISOString(),
      };
      setLastRecognition(mockResult);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <PageHeader
            title="Live Attendance"
            description="Real-time face recognition and attendance tracking"
            action={
              <div className="flex items-center gap-2">
                {health?.backend_status === "online" ? (
                  <span className="flex items-center gap-2 text-sm text-success">
                    <Wifi className="h-4 w-4" /> Backend Connected
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-sm text-destructive">
                    <WifiOff className="h-4 w-4" /> Backend Offline
                  </span>
                )}
              </div>
            }
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="relative overflow-hidden p-0">
              <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />

                {!isStreaming && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative mb-6">
                      <div className="h-24 w-24 rounded-full border-2 border-dashed border-accent/30 flex items-center justify-center">
                        <Eye className="h-10 w-10 text-muted" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">AI Vision System</h3>
                    <p className="text-sm text-muted-foreground mb-6">Start the camera to begin face recognition</p>
                    <Button variant="accent" onClick={startCamera}>
                      <Camera className="h-4 w-4" /> Activate Camera
                    </Button>
                  </div>
                )}

                {isStreaming && (
                  <>
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                      <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent" />
                      <div className="absolute top-0 bottom-0 right-0 w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent" />
                    </div>

                    {isScanning && <div className="scan-line" />}

                    <div className="absolute top-4 left-4 flex items-center gap-3">
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-2">
                        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        <span className="text-xs text-foreground font-medium">LIVE</span>
                      </div>
                      {isScanning && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 bg-accent/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-accent/30"
                        >
                          <Scan className="h-3.5 w-3.5 text-accent animate-spin" />
                          <span className="text-xs text-accent font-medium">Scanning...</span>
                        </motion.div>
                      )}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Camera className="h-3 w-3" /> 1280x720</span>
                          <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> Face Detection: ON</span>
                        </div>
                        <Button variant="accent" size="sm" onClick={simulateRecognition} disabled={isScanning}>
                          <Scan className="h-3.5 w-3.5" /> Detect Face
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {isStreaming && (
                <div className="p-4 flex items-center justify-between border-t border-card-border">
                  <p className="text-sm text-muted-foreground">Face Recognition Attendance System</p>
                  <Button variant="outline" size="sm" onClick={stopCamera}>
                    <CameraOff className="h-3.5 w-3.5" /> Stop Camera
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div variants={item} className="space-y-6">
            <AnimatePresence mode="wait">
              {lastRecognition ? (
                <motion.div
                  key="recognition"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Card glow className="border-accent/30">
                    <div className="text-center mb-4">
                      <div className="relative inline-block mb-3">
                        <div className="h-20 w-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                          <UserCheck className="h-10 w-10 text-accent" />
                        </div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-success flex items-center justify-center"
                        >
                          <CheckCircle2 className="h-4 w-4 text-white" />
                        </motion.div>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">{lastRecognition.employee_name}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{lastRecognition.employee_id}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-card-border/50">
                        <span className="text-sm text-muted-foreground">Confidence</span>
                        <span className={`text-sm font-bold ${getConfidenceColor(lastRecognition.confidence)}`}>
                          {(lastRecognition.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-card-border/50">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor("present")}`}>
                          Checked In
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Time</span>
                        <span className="text-sm text-foreground font-medium">
                          {new Date(lastRecognition.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div key="placeholder" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <Card className="flex flex-col items-center justify-center py-12">
                    <div className="h-16 w-16 rounded-full bg-card-border/50 flex items-center justify-center mb-4">
                      <Scan className="h-8 w-8 text-muted" />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      No recognition yet.<br />Start the camera and detect a face.
                    </p>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <Card>
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-accent" />
                Live Logs
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {logsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-card animate-pulse rounded-lg" />)}
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-2.5 rounded-lg bg-white/3 border border-card-border/50"
                    >
                      <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                        <UserCheck className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{log.employee_name}</p>
                        <p className="text-[10px] text-muted-foreground">{log.employee_id}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-xs font-medium ${getConfidenceColor(log.confidence)}`}>
                          {(log.confidence * 100).toFixed(0)}%
                        </p>
                        <p className="text-[10px] text-muted">{formatTime(log.timestamp)}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
