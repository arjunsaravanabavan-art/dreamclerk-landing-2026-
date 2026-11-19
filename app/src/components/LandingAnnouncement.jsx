import { useCallback, useEffect, useState } from "react";
import { supabase, isConfigured } from "../lib/supabase.js";

const FALLBACK = {
  enabled: true,
  message: "Sorry for the inconvenience — we’re making DreamClerk even better. Thanks for being here!",
  interval_seconds: 60,
};

function PlaneBanner({ message, onClose, preview = false }) {
  return (
    <div className={`dc-flight ${preview ? "dc-flight--preview" : ""}`} role="status" aria-live="polite">
      <div className="dc-flight__trail">
        <div className="dc-flight__ribbon">
          <span className="dc-flight__eyebrow">A NOTE FROM DREAMCLERK</span>
          <span className="dc-flight__message">{message}</span>
        </div>
        <span className="dc-flight__plane" aria-hidden="true">
          <svg viewBox="0 0 72 52" width="72" height="52" fill="none">
            <path d="M5 25.5 65 4 47 47 34 31 5 25.5Z" fill="#ff762e" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="m34 31 31-27M34 31l-2 17 15-16" stroke="#171717" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="m5 25.5 29 5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </span>
      </div>
      <button className="dc-flight__close" type="button" onClick={onClose} aria-label="Dismiss announcement">×</button>
    </div>
  );
}

export default function LandingAnnouncement() {
  const [settings, setSettings] = useState(FALLBACK);
  const [visible, setVisible] = useState(false);
  const [flightKey, setFlightKey] = useState(0);

  const load = useCallback(async () => {
    if (!isConfigured || !supabase) return;
    const { data, error } = await supabase
      .from("landing_announcements")
      .select("enabled,message,interval_seconds")
      .eq("id", 1)
      .maybeSingle();
    if (!error && data) setSettings(data);
  }, []);

  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    if (!settings.enabled) { setVisible(false); return; }
    const launch = () => {
      setFlightKey((value) => value + 1);
      setVisible(true);
    };
    const first = window.setTimeout(launch, 1800);
    const poll = window.setInterval(() => { void load(); }, 30000);
    return () => { window.clearTimeout(first); window.clearInterval(poll); };
  }, [settings.enabled, settings.interval_seconds, load]);

  useEffect(() => {
    if (!visible) return;
    const hide = window.setTimeout(() => setVisible(false), 15500);
    return () => window.clearTimeout(hide);
  }, [visible, flightKey]);

  useEffect(() => {
    if (!settings.enabled) return;
    const interval = window.setInterval(() => {
      setFlightKey((value) => value + 1);
      setVisible(true);
    }, Math.max(30, Number(settings.interval_seconds) || 60) * 1000);
    return () => window.clearInterval(interval);
  }, [settings.enabled, settings.interval_seconds]);

  if (!visible || !settings.enabled) return null;
  return (
    <>
      <PlaneBanner key={flightKey} message={settings.message || FALLBACK.message} onClose={() => setVisible(false)} />
      <style>{FLIGHT_CSS}</style>
    </>
  );
}

const FLIGHT_CSS = `
.dc-flight{position:fixed;z-index:65;top:clamp(76px,13vh,140px);left:0;width:100%;height:112px;pointer-events:none;overflow:visible}
.dc-flight__trail{position:absolute;top:0;left:0;display:flex;align-items:center;gap:0;width:max-content;animation:dc-plane-cross 14s cubic-bezier(.42,0,.58,1) both;filter:drop-shadow(0 12px 18px rgba(0,0,0,.18))}
.dc-flight__ribbon{position:relative;display:flex;flex-direction:column;justify-content:center;gap:5px;min-width:min(520px,70vw);max-width:min(620px,74vw);min-height:76px;padding:13px 30px 13px 24px;background:#171717;color:#fff;border:2px solid #ff762e;border-right:0;border-radius:7px 0 0 7px;transform:skewX(-5deg)}
.dc-flight__ribbon:after{content:"";position:absolute;right:-16px;top:0;border-top:38px solid transparent;border-bottom:38px solid transparent;border-left:16px solid #ff762e}
.dc-flight__eyebrow{font:700 9px/1.2 ui-monospace,monospace;letter-spacing:.18em;color:#ff9a61}
.dc-flight__message{font:650 clamp(12px,1.45vw,16px)/1.35 ui-sans-serif,system-ui,sans-serif;letter-spacing:-.015em;white-space:normal}
.dc-flight__plane{position:relative;z-index:1;margin-left:5px;transform:rotate(-7deg)}
.dc-flight__close{position:absolute;right:18px;top:5px;pointer-events:auto;width:30px;height:30px;border-radius:50%;background:#171717;color:white;border:1px solid #ff762e;font-size:22px;line-height:1;cursor:pointer}
@keyframes dc-plane-cross{0%{transform:translate3d(110vw,0,0) rotate(-2deg)}12%{transform:translate3d(72vw,-8px,0) rotate(1deg)}85%{transform:translate3d(-65vw,6px,0) rotate(-1deg)}100%{transform:translate3d(-125vw,0,0) rotate(0)}}
@media(max-width:640px){.dc-flight{top:90px;height:100px}.dc-flight__ribbon{min-width:70vw;max-width:74vw;padding:11px 18px 11px 14px;min-height:68px}.dc-flight__plane svg{width:54px;height:40px}.dc-flight__close{right:8px;top:0}}
@media(prefers-reduced-motion:reduce){.dc-flight__trail{animation:none;left:8px;transform:none}.dc-flight__ribbon{min-width:65vw}}
`;
