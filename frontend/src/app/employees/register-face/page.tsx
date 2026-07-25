"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useEmployees } from "@/hooks/useData";
import { FACE_SAMPLES_REQUIRED } from "@/constants";
import {
  Camera,
  CameraOff,
  ScanFace,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function RegisterFacePage() {
  const { allEmployees } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [samplesCaptured, setSamplesCaptured] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch {
      setError("Unable to access camera. Please ensure camera permissions are granted.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const captureSample = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    ctx.drawImage(videoRef.current, 0, 0);
    setSamplesCaptured((prev) => {
      const next = prev + 1;
      if (next >= FACE_SAMPLES_REQUIRED) {
        setTimeout(() => {
          setSuccess(true);
          setIsCapturing(false);
          stopCamera();
        }, 500);
      }
      return next;
    });
  }, [stopCamera]);

  const startCapture = () => {
    if (!selectedEmployee) {
      setError("Please select an employee first.");
      return;
    }
    if (!isStreaming) {
      setError("Please start the camera first.");
      return;
    }
    setError("");
    setIsCapturing(true);
    setSamplesCaptured(0);
    setSuccess(false);

    let count = 0;
    const interval = setInterval(() => {
      captureSample();
      count++;
      if (count >= FACE_SAMPLES_REQUIRED) {
        clearInterval(interval);
      }
    }, 400);
  };

  const resetCapture = () => {
    setSamplesCaptured(0);
    setSuccess(false);
    setError("");
    setIsCapturing(false);
  };

  const progress = (samplesCaptured / FACE_SAMPLES_REQUIRED) * 100;
  const selectedEmp = allEmployees.find((e) => e.employee_id === selectedEmployee);

  return (
    <AppLayout>
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.div variants={item}>
          <PageHeader title="Register Face" description="Capture face data for employee recognition" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={item} className="lg:col-span-2">
            <Card className="relative overflow-hidden">
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/95 backdrop-blur-sm"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  >
                    <CheckCircle2 className="h-20 w-20 text-success mb-4" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Face Registered!</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {samplesCaptured} face samples captured for {selectedEmp?.name}
                  </p>
                  <div className="flex gap-3">
                    <Button variant="accent" onClick={resetCapture}>Register Another</Button>
                  </div>
                </motion.div>
              )}

              <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isStreaming && !success && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <CameraOff className="h-16 w-16 text-muted mb-4" />
                    <p className="text-muted-foreground">Camera not active</p>
                    <p className="text-xs text-muted mt-1">Click the button below to start</p>
                  </div>
                )}

                {isStreaming && !success && (
                  <>
                    <div className="absolute inset-4 border-2 border-accent/30 rounded-xl pointer-events-none" />
                    <div className="absolute inset-4 pointer-events-none overflow-hidden rounded-xl">
                      <div className="scan-line" />
                    </div>

                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                      <span className="text-xs text-foreground font-medium">LIVE</span>
                    </div>

                    {isCapturing && (
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1.5">
                        <span className="text-xs text-accent font-medium">
                          Sample {samplesCaptured}/{FACE_SAMPLES_REQUIRED}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item} className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-foreground mb-4">Employee</h3>
              <select
                value={selectedEmployee}
                onChange={(e) => { setSelectedEmployee(e.target.value); setError(""); }}
                className="w-full h-10 rounded-lg bg-card border border-card-border px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
              >
                <option value="">Select employee</option>
                {allEmployees.map((emp) => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.employee_id} - {emp.name}
                  </option>
                ))}
              </select>
              {selectedEmp && (
                <div className="mt-3 p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <p className="text-sm font-medium text-foreground">{selectedEmp.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedEmp.employee_id} | {selectedEmp.email}</p>
                </div>
              )}
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-foreground mb-4">Progress</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Face Samples</span>
                  <span className="text-foreground font-medium">{samplesCaptured}/{FACE_SAMPLES_REQUIRED}</span>
                </div>
                <div className="h-3 bg-card-border rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {progress < 100 ? "Capturing face data..." : "All samples collected!"}
                </p>
              </div>
            </Card>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            <div className="space-y-3">
              {!isStreaming ? (
                <Button variant="accent" className="w-full" onClick={startCamera}>
                  <Camera className="h-4 w-4" /> Start Camera
                </Button>
              ) : (
                <Button variant="outline" className="w-full" onClick={stopCamera}>
                  <CameraOff className="h-4 w-4" /> Stop Camera
                </Button>
              )}

              <Button
                variant="accent"
                className="w-full"
                onClick={startCapture}
                disabled={!isStreaming || !selectedEmployee || isCapturing}
                loading={isCapturing}
              >
                <ScanFace className="h-4 w-4" /> Capture Face Samples
              </Button>

              {samplesCaptured > 0 && !success && (
                <Button variant="ghost" className="w-full" onClick={resetCapture}>
                  <RefreshCw className="h-4 w-4" /> Reset
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
