"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  phoneE164: string;
  defaultMessage?: string;
};

export default function WhatsAppChatWidget({
  phoneE164,
  defaultMessage = "Hi Leadzap team! I'd like to learn more about your services.",
}: Props) {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState(defaultMessage);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const waUrl = useMemo(
    () => `https://wa.me/${phoneE164}?text=${encodeURIComponent(msg)}`,
    [phoneE164, msg]
  );

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* 弹窗区域 */}
      {open && (
        <div className="mb-4 w-[340px] rounded-2xl shadow-2xl border border-white/10 bg-black/90 backdrop-blur-md overflow-hidden animate-in slide-in-from-bottom-5">
          
          {/* Header: 品牌色背景 */}
          <div className="px-5 py-4 bg-accent text-accent-foreground flex justify-between items-start">
            <div className="flex gap-3 items-center">
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                <span className="text-accent text-lg font-bold">⚡</span>
              </div>
              <div>
                <div className="text-base font-bold tracking-wide">Leadzap Support</div>
                <div className="text-xs opacity-80 mt-0.5 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent-foreground animate-pulse"></span>
                  Typically replies fast
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="h-8 w-8 grid place-items-center rounded-full hover:bg-black/10 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="p-5 bg-card/50">
            <div className="mb-4 text-[13px] text-foreground bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3 inline-block leading-relaxed border border-white/5">
              Hi there! 👋 How can we help you scale your business today? ⚡
            </div>

            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              aria-label="Your message"
              rows={3}
              className="w-full bg-black/50 border border-white/10 text-foreground rounded-xl px-3 py-2 text-[13px] focus:ring-2 focus:ring-accent outline-none transition-all resize-none"
            />

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-accent text-accent-foreground py-3 text-[13px] font-bold hover:bg-accent/90 transition-all shadow-glow"
            >
              Continue on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* 悬浮按钮：使用 Leadzap 主题色 */}
      <div className="relative">
        {!open && (
          <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-30"></div>
        )}
        
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-card hover:scale-105 transition-all z-10`}
        >
          {open ? (
            <span className="text-xl">✕</span>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.549 4.142 1.594 5.945L.057 23.46l6.198-1.625a11.77 11.77 0 005.795 1.474h.004c6.555 0 11.89-5.335 11.894-11.893a11.78 11.78 0 00-3.488-8.354" />
            </svg>
          )}
        </button>
      </div>
    </div>,
    document.body
  );
}