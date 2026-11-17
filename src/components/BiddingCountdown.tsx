import React, { useEffect, useState } from 'react';
import { Gavel, CalendarClock } from 'lucide-react';
import { SEASON2_BIDDING_AT } from '../data/season2';

const pad = (n: number) => String(n).padStart(2, '0');

const Unit: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="min-w-[3.6rem] sm:min-w-[5rem] px-2 py-2 sm:py-3 rounded-xl bg-[#04101f] border border-amber-400/30 text-3xl sm:text-5xl font-black text-amber-300 tabular-nums text-center shadow-[0_0_24px_rgba(251,191,36,0.15)]">
      {value}
    </div>
    <span className="mt-1.5 text-[10px] sm:text-xs font-bold tracking-[0.25em] text-slate-400 uppercase">{label}</span>
  </div>
);

/** Countdown to the captains' bidding. Shows "date coming soon" until SEASON2_BIDDING_AT is set. */
export const BiddingCountdown: React.FC = () => {
  const target = SEASON2_BIDDING_AT ? Date.parse(SEASON2_BIDDING_AT) : null;
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!target) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const left = target ? Math.max(0, target - now) : null;
  const live = target !== null && left === 0;
  const s = left !== null ? Math.floor(left / 1000) : 0;
  const parts = left !== null
    ? [String(Math.floor(s / 86400)), pad(Math.floor(s / 3600) % 24), pad(Math.floor(s / 60) % 60), pad(s % 60)]
    : ['--', '--', '--', '--'];

  return (
    <div className="mt-8 relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-b from-[#0d1626] to-[#070d18] p-5 sm:p-7 text-center">
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[70%] h-40 rounded-full bg-amber-400/10 blur-3xl" aria-hidden />
      <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase bg-amber-400/10 text-amber-300 border border-amber-400/30">
        <Gavel className="w-3.5 h-3.5" /> Captains' bidding
      </span>
      <h3 className="relative mt-3 text-2xl sm:text-4xl font-black text-white">
        {live ? 'BIDDING IS LIVE' : 'BIDDING STARTS IN'}
      </h3>

      {!live && (
        <div className="relative mt-5 flex justify-center gap-2 sm:gap-4" aria-live="polite">
          <Unit value={parts[0]} label="Days" />
          <Unit value={parts[1]} label="Hours" />
          <Unit value={parts[2]} label="Mins" />
          <Unit value={parts[3]} label="Secs" />
        </div>
      )}

      <p className="relative mt-5 text-sm text-slate-300 flex items-center justify-center gap-1.5">
        <CalendarClock className="w-4 h-4 text-amber-300 flex-none" />
        {target
          ? new Date(target).toLocaleString(undefined, {
              weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', timeZoneName: 'short',
            })
          : 'Date coming soon. Keep an eye on the Discord.'}
      </p>
    </div>
  );
};
