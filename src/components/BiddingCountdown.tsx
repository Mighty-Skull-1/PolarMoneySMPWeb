import React, { useEffect, useState } from 'react';
import { Gavel, CalendarClock, Rocket } from 'lucide-react';
import { SEASON2_BIDDING_AT, SEASON2_START_AT, SEASON2_START_TIME_KNOWN } from '../data/season2';

const pad = (n: number) => String(n).padStart(2, '0');

const Unit: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="min-w-[3.6rem] sm:min-w-[5rem] px-2 py-2 sm:py-3 rounded-xl bg-[#04101f] border border-amber-400/30 text-3xl sm:text-5xl font-black text-amber-300 tabular-nums text-center shadow-[0_0_24px_rgba(251,191,36,0.15)]">
      {value}
    </div>
    <span className="mt-1.5 text-[10px] sm:text-xs font-bold tracking-[0.25em] text-slate-400 uppercase">{label}</span>
  </div>
);

const fmt = (ms: number, withTime: boolean) =>
  new Date(ms).toLocaleString(undefined, withTime
    ? { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', timeZoneName: 'short' }
    : { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/London' });

/** e.g. "Friday, November 27 · 2:00 PM EST" and "7:00 PM UK · 8:00 PM CET". */
const usAndUk = (ms: number) => {
  const d = new Date(ms);
  const day = d.toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric' });
  const t = (tz: string) => d.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' });
  return { us: `${day} · ${t('America/New_York')} EST`, uk: `${t('Europe/London')} UK · ${t('Europe/Berlin')} CET` };
};

type Event = { key: 'bid' | 'start'; at: number | null; withTime: boolean };

/**
 * Season 2 countdown. Counts down to the captains' bidding once its date is set,
 * then to the server start. Until the bidding has a date, it counts down to the start.
 */
export const BiddingCountdown: React.FC = () => {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const bid: Event = { key: 'bid', at: SEASON2_BIDDING_AT ? Date.parse(SEASON2_BIDDING_AT) : null, withTime: true };
  const start: Event = { key: 'start', at: SEASON2_START_AT ? Date.parse(SEASON2_START_AT) : null, withTime: SEASON2_START_TIME_KNOWN };

  // Count down to the bidding while it's still ahead, otherwise to the server start.
  const main = bid.at !== null && bid.at > now ? bid : start.at !== null ? start : bid;
  const other = main.key === 'bid' ? start : bid;

  const left = main.at !== null ? Math.max(0, main.at - now) : null;
  const live = main.at !== null && left === 0;
  const s = left !== null ? Math.floor(left / 1000) : 0;
  const parts = left !== null
    ? [String(Math.floor(s / 86400)), pad(Math.floor(s / 3600) % 24), pad(Math.floor(s / 60) % 60), pad(s % 60)]
    : ['--', '--', '--', '--'];

  const isBid = main.key === 'bid';
  const title = isBid
    ? (live ? 'BIDDING IS LIVE' : 'BIDDING STARTS IN')
    : (live ? 'SEASON 2 IS LIVE' : 'SEASON 2 STARTS IN');
  const zones = main.key === 'bid' && main.at !== null ? usAndUk(main.at) : null;
  const when = zones ? zones.us : main.at === null
    ? 'Date coming soon. Keep an eye on the Discord.'
    : fmt(main.at, main.withTime) + (main.withTime ? '' : ' · start time TBA');

  const otherLine = other.key === 'bid'
    ? (other.at === null ? "Captains' bidding: date coming soon" : other.at > now ? `Captains' bidding: ${usAndUk(other.at).us}` : null)
    : (other.at === null ? null : `Season 2 starts: ${fmt(other.at, other.withTime)}${other.withTime ? '' : ' (time TBA)'}`);

  return (
    <div className="mt-8 relative overflow-hidden rounded-2xl border border-amber-400/30 bg-gradient-to-b from-[#0d1626] to-[#070d18] p-5 sm:p-7 text-center">
      <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[70%] h-40 rounded-full bg-amber-400/10 blur-3xl" aria-hidden />
      <span className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase bg-amber-400/10 text-amber-300 border border-amber-400/30">
        {isBid ? <Gavel className="w-3.5 h-3.5" /> : <Rocket className="w-3.5 h-3.5" />} {isBid ? "Captains' bidding" : 'Server launch'}
      </span>
      <h3 className="relative mt-3 text-2xl sm:text-4xl font-black text-white">{title}</h3>

      {!live && (
        <div className="relative mt-5 flex justify-center gap-2 sm:gap-4" aria-live="polite">
          <Unit value={parts[0]} label="Days" />
          <Unit value={parts[1]} label="Hours" />
          <Unit value={parts[2]} label="Mins" />
          <Unit value={parts[3]} label="Secs" />
        </div>
      )}

      <p className="relative mt-5 text-sm text-slate-200 font-semibold flex items-center justify-center gap-1.5">
        <CalendarClock className="w-4 h-4 text-amber-300 flex-none" /> {when}
      </p>
      {zones && <p className="relative mt-1 text-sm text-slate-300">{zones.uk}</p>}
      {otherLine && (
        <p className="relative mt-2 text-xs sm:text-sm text-slate-400 flex items-center justify-center gap-1.5">
          {other.key === 'bid' ? <Gavel className="w-3.5 h-3.5 flex-none" /> : <Rocket className="w-3.5 h-3.5 flex-none" />} {otherLine}
        </p>
      )}
    </div>
  );
};
