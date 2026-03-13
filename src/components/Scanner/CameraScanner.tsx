"use client";

import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Icons } from "@/components/Icons";

interface CameraScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export function CameraScanner({ onScan, onClose }: CameraScannerProps) {
  const html5QrCode = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const scannerId = "reader";
    html5QrCode.current = new Html5Qrcode(scannerId);
    
    const config = { 
      fps: 20, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0 
    };

    html5QrCode.current.start(
      { facingMode: "environment" }, 
      config, 
      (decodedText) => {
        onScan(decodedText);
      },
      () => {} // Ignore errors to keep it clean
    ).catch(err => {
      console.error("Failed to start scanner", err);
    });

    return () => {
      if (html5QrCode.current && html5QrCode.current.isScanning) {
        html5QrCode.current.stop()
          .then(() => html5QrCode.current?.clear())
          .catch(console.error);
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-[400px] aspect-square overflow-hidden rounded-[40px] bg-black shadow-2xl ring-1 ring-white/20">
        
        {/* The Video Feed */}
        <div id="reader" className="h-full w-full overflow-hidden" />

        {/* Custom Premium UI Overlay */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center bg-black/10">
          
          {/* Scanning Square */}
          <div className="relative h-[250px] w-[250px]">
            {/* Corners with Glow */}
            <div className="absolute -left-1 -top-1 h-8 w-8 border-l-[5px] border-t-[5px] border-secondary rounded-tl-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <div className="absolute -right-1 -top-1 h-8 w-8 border-r-[5px] border-t-[5px] border-secondary rounded-tr-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-[5px] border-l-[5px] border-secondary rounded-bl-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            <div className="absolute -bottom-1 -right-1 h-8 w-8 border-b-[5px] border-r-[5px] border-secondary rounded-br-2xl shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
            
            {/* Animated Laser - Thin & Neon */}
            <div className="absolute left-0 top-0 h-[3px] w-full animate-[scan_2.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-secondary to-transparent shadow-[0_0_20px_rgba(59,130,246,1)] opacity-80" />
          </div>

          {/* Minimalist Hint */}
          <div className="absolute bottom-10 px-6">
            <div className="rounded-full bg-black/40 px-4 py-1.5 text-[11px] font-bold tracking-widest text-white/70 backdrop-blur-md uppercase">
              Align Barcode in the Center
            </div>
          </div>
        </div>

        {/* Floating Glassmorphism Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-xl transition-all hover:bg-white/30 active:scale-90 border border-white/20 shadow-lg"
        >
          <Icons.Plus size={26} className="rotate-45" />
        </button>

        <style jsx global>{`
          @keyframes scan {
            0% { top: 5%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 95%; opacity: 0; }
          }
          #reader video { 
            width: 100% !important; 
            height: 100% !important; 
            object-fit: cover !important; 
          }
          /* Hide all default library elements just in case */
          #reader__dashboard_section, #reader__status_span, #reader__header { 
            display: none !important; 
          }
        `}</style>
      </div>
    </div>
  );
}
