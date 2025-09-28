'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Camera, UploadCloud, Play, Pause, Github } from 'lucide-react';

interface DetectionBox {
  id: number;
  label: string;
  confidence: number;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const SAMPLE_BOXES: DetectionBox[] = [
  { id: 1, label: 'Person', confidence: 0.98, color: '#2563eb', x: 18, y: 12, width: 42, height: 76 },
  { id: 2, label: 'Laptop', confidence: 0.92, color: '#16a34a', x: 45, y: 48, width: 40, height: 28 },
  { id: 3, label: 'Coffee', confidence: 0.74, color: '#f97316', x: 68, y: 60, width: 18, height: 22 },
];

export default function ObjectDetectionPage() {
  const [boxes, setBoxes] = useState<DetectionBox[]>(SAMPLE_BOXES);
  const [streaming, setStreaming] = useState(false);
  const [threshold, setThreshold] = useState(60);

  const filteredBoxes = useMemo(
    () => boxes.filter((box) => box.confidence * 100 >= threshold),
    [boxes, threshold]
  );

  const toggleStream = () => setStreaming((prev) => !prev);

  const loadSample = () => {
    setBoxes(SAMPLE_BOXES.map((box) => ({ ...box })));
  };

  const clearBoxes = () => setBoxes([]);

  return (
    <div className="container mx-auto max-w-6xl space-y-8 px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-leiden">Object Detection Lab</h1>
        <p className="text-muted-foreground">
          Prototype YOLOv12 running in the browser. Capture frames, tune thresholds, and visualise detections with a
          responsive overlay. Integration is wired for the <Badge variant="outline">YOLOv12</Badge> pipeline from{' '}
          <a
            href="https://github.com/sunsmarterjie/yolov12"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-leiden underline-offset-4 hover:underline"
          >
            sunsmarterjie/yolov12
          </a>{' '}
          — backend hooks will connect once the WASM/WebGPU build lands.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="flex h-[520px] flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-leiden">Live canvas</CardTitle>
              <p className="text-sm text-muted-foreground">
                Use the buttons below to simulate camera capture or upload media. Bounding boxes update as detections
                stream in.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadSample}>
                <UploadCloud className="mr-2 h-4 w-4" /> Load sample
              </Button>
              <Button variant="outline" size="sm" onClick={clearBoxes}>
                Clear
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col gap-4">
            <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-xl border bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 p-4">
              <video
                className="hidden h-full w-full rounded-lg object-cover"
                muted
                autoPlay
                playsInline
                aria-hidden
              />
              <div className="absolute inset-0 flex items-center justify-center text-sm text-white/70">
                {filteredBoxes.length === 0 ? (
                  <span>No detections above threshold yet. Load a sample or start streaming.</span>
                ) : null}
              </div>

              {filteredBoxes.map((box) => (
                <div
                  key={box.id}
                  className="absolute rounded border-2 bg-black/20 backdrop-blur-[1px]"
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                    borderColor: box.color,
                  }}
                >
                  <div
                    className="absolute left-0 top-0 translate-y-[-100%] rounded-t border-x border-t px-2 py-0.5 text-xs font-semibold text-white"
                    style={{ backgroundColor: box.color, borderColor: box.color }}
                  >
                    {box.label}{' '}
                    <span className="font-mono text-[11px] opacity-80">{Math.round(box.confidence * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button onClick={toggleStream} className="bg-leiden text-white hover:bg-leiden/90">
                  {streaming ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {streaming ? 'Pause stream' : 'Start stream'}
                </Button>
                <Button variant="outline">
                  <Camera className="mr-2 h-4 w-4" /> Use camera
                </Button>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  <span>Confidence threshold</span>
                  <span>{threshold}%</span>
                </div>
                <Slider value={[threshold]} onValueChange={(value) => setThreshold(value[0])} min={30} max={95} step={5} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-leiden">Pipeline checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                • Compile the <code className="rounded bg-muted px-1 py-0.5">yolov12n</code> weights to ONNX, then to
                WebGPU/WebAssembly using <code className="rounded bg-muted px-1 py-0.5">onnxruntime-web</code> or
                <code className="rounded bg-muted px-1 py-0.5">webgpu-torch</code>.
              </p>
              <p>
                • Warm up the model with a dummy tensor and reuse the same inference session to minimise allocation
                overhead between frames.
              </p>
              <p>
                • Run post-processing (sigmoid + non-max suppression) on a worker thread to keep the UI responsive.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-leiden">Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Button
                asChild
                variant="outline"
                className="w-full justify-start border-dashed border-leiden text-leiden hover:bg-leiden/10"
              >
                <a href="https://github.com/sunsmarterjie/yolov12" target="_blank" rel="noopener noreferrer">
                  <Github className="mr-2 h-4 w-4" /> Explore YOLOv12 repository
                </a>
              </Button>
              <p>
                Looking to test on-device? Pair WebGPU execution with the{' '}
                <a
                  href="https://github.com/webmachinelearning/webnn"
                  className="font-medium text-leiden underline-offset-4 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WebNN API
                </a>{' '}for experimental acceleration.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
