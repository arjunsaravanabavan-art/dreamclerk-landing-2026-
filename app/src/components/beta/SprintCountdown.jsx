// ─── SprintCountdown — live "sprint ends in Dd HH:MM" pill ─────────────────
//
// Per D4: the sprint clock is timezone-aware. The user's `user.timezone`
// is the source of truth — the sprint ends at 11:59 PM on day 5 *in that
// timezone*, not in UTC and not in IST. This component ticks every 60s
// (a hard once-a-minute recompute is enough — the underlying clock is
// already second-precise) and renders a compact pill.
//
// It does not start a clock that runs in the background when the tab is
// hidden — `useEffect` + a `setInterval` is enough and `requestAnimationFrame`
// would just waste battery. If the user switches tabs and comes back, the
// next tick (within 60s) catches up.
//
// Edge case: if the sprint hasn't started yet (sprintStartedAt is null),
// we render nothing rather than "—" so the dashboard header stays clean.

import { useEffect, useState } from "react";
import { msUntilSprintEnd, formatRemaining, dayIndexOf } from "../../lib/betaState.js";

export default function SprintCountdown({ session }) {
  const startedAt = session?.sprintStartedAt;
  const userTz = session?.user?.timezone || "UTC";
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!startedAt) return undefined;
    // Tick once a minute. The 60s interval keeps the cost negligible
    // (one re-render per minute) while still feeling live. We align to
    // wall-clock seconds so a fresh user load shows :00 or :30 first.
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, [startedAt]);

  if (!startedAt) return null;

  const remaining = msUntilSprintEnd({ sprintStartedAt: startedAt }, now);
  const dayIdx = dayIndexOf({ sprintStartedAt: startedAt }, now);
  // Cap at 5 for display (the underlying index is already clamped).
  const day = Math.min(5, Math.max(1, dayIdx));
  const urgent = remaining != null && remaining < 24 * 60 * 60 * 1000; // last day
  const ended = remaining === 0;

  return (
    <div
      className={`beta-sprint-countdown ${urgent ? "is-urgent" : ""} ${ended ? "is-ended" : ""}`}
      aria-live="polite"
      title={`your local timezone: ${userTz}`}
    >
      <span className="beta-sprint-countdown-day">day {day}/5</span>
      <span className="beta-sprint-countdown-sep" aria-hidden="true">·</span>
      <span className="beta-sprint-countdown-rem">
        {ended ? "sprint ended" : `ends in ${formatRemaining(remaining)}`}
      </span>
    </div>
  );
}
