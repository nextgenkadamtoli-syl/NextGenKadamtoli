"use client";
import { useEffect, useState } from "react";
export default function PWA() {
  const [evt, setEvt] = useState(null);
  const [iosHint, setIosHint] = useState(false);
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
    if (standalone) return;
    const onPrompt = (e) => { e.preventDefault(); setEvt(e); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setEvt(null));
    if (/iphone|ipad/i.test(navigator.userAgent)) setIosHint(true);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);
  const install = async () => { evt.prompt(); await evt.userChoice; setEvt(null); };
  if (evt) return (
    <div className="pwa">
      <button onClick={install}>📲 ফোনে অ্যাপ হিসেবে ইন্সটল করুন</button>
    </div>
  );
  if (iosHint) return (
    <p className="pwa">
      iPhone-এ ইন্সটল করতে Safari-র Share বাটনে চেপে "Add to Home Screen" বেছে নিন।
    </p>
  );
  return null;
}
