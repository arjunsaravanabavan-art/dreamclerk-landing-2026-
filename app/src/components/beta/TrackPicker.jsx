// ─── TrackPicker — choose your track post-email, pre-onboarding ───────────
//
// Per the multi-track plan, the user lands on /beta, gives an email, and
// then immediately picks a track. Track selection comes BEFORE the
// 3-step onboarding form because the onboarding copy will become
// track-aware (e.g. backend track onboarding asks for backend tech
// preferences, not ML model familiarity).
//
// The four cards are rendered from the BETA.TRACKS export. The picker
// honours the URL: if the user lands on /beta/aiml-intern directly, we
// pre-highlight that track. If they came through a "apply to backend"
// link from /tracks, the card they clicked is pre-highlighted.
//
// Once a track is picked, we patch session.trackId, then route them
// to the next step (onboarding) via the parent BetaPage's state machine.

import { useEffect, useMemo, useState } from "react";
import { BETA, TRACKS as FALLBACK_TRACKS, getTrack } from "../../lib/betaData.js";
import SectionLabel from "../SectionLabel.jsx";
import { RouterLink } from "../../lib/router.jsx";

export default function TrackPicker({ sessionState, initialTrackId, onPicked }) {
  const { session, patch } = sessionState;
  const [hoveredId, setHoveredId] = useState(null);

  // TRACKS is exported from betaData; we also accept the legacy BETA
  // shape (object keyed by id) for backward-compat with the old build.
  const tracks = useMemo(() => {
    if (Array.isArray(BETA?.TRACKS)) return BETA.TRACKS;
    if (BETA?.TRACKS && typeof BETA.TRACKS === "object") return Object.values(BETA.TRACKS);
    if (Array.isArray(FALLBACK_TRACKS)) return FALLBACK_TRACKS;
    return [];
  }, []);

  // If we already have a trackId (user re-entered from /beta/<id>), don't
  // show the picker — route them straight to the next step.
  useEffect(() => {
    if (session.trackId && !initialTrackId) {
      onPicked?.(session.trackId);
    }
    // We only auto-skip on mount, not on subsequent trackId changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (id) => {
    if (!id) return;
    const track = getTrack ? getTrack(id) : tracks.find((t) => t.id === id);
    if (!track) return;
    patch({ trackId: track.id, company: track.company?.id, cohort: track.cohort });
    onPicked?.(track.id);
  };

  return (
    <main className="beta-shell">
      <SectionLabel status="active">open beta · orbit labs · cohort 1</SectionLabel>

      <div className="beta-card">
        <h1 className="beta-h1">pick your track.</h1>
        <p className="beta-p">
          four roles, four sprints. all of them end with a public verified
          work record on your linkedin. pick the one that matches what you
          actually want to get better at — there's no "easy" option, and
          you can re-run for free if you fail (per D5).
        </p>

        <ul className="beta-track-grid" role="radiogroup" aria-label="pick your track">
          {tracks.map((t) => {
            const isHighlighted = initialTrackId === t.id;
            const isHovered = hoveredId === t.id;
            const durationDays = t.role?.durationDays ?? 5;
            const company = t.company?.name || t.company?.id || "dreamclerk";
            const shortCode = t.n || String(t.id).slice(0, 3).toUpperCase();
            return (
              <li key={t.id} className="beta-track-cell" role="presentation">
                <button
                  type="button"
                  role="radio"
                  aria-checked={isHighlighted}
                  className={`beta-track-card ${isHighlighted ? "is-highlighted" : ""}`}
                  onClick={() => pick(t.id)}
                  onMouseEnter={() => setHoveredId(t.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onFocus={() => setHoveredId(t.id)}
                  onBlur={() => setHoveredId(null)}
                >
                  <header className="beta-track-card-h">
                    <span className="beta-track-card-id">{shortCode}</span>
                    <span className="beta-track-card-time">{durationDays} days</span>
                  </header>
                  <h2 className="beta-track-card-title">{t.shortTitle || t.title}</h2>
                  <p className="beta-track-card-subtitle">{t.title}</p>
                  <p className="beta-track-card-blurb">
                    at <strong>{company}</strong>. {t.tasks?.length || 0} tasks, {durationDays} days, your local timezone.
                  </p>
                  <ol className="beta-track-tasks" aria-label={`${t.tasks?.length || 0} tasks`}>
                    {(t.tasks || []).slice(0, 4).map((task, i) => (
                      <li key={task.id} className="beta-track-task">
                        <span className="beta-track-task-i">{String(i + 1).padStart(2, "0")}</span>
                        <span className="beta-track-task-t">{task.title}</span>
                      </li>
                    ))}
                  </ol>
                  <footer className="beta-track-card-f">
                    <span className="beta-track-card-cue">
                      {isHighlighted ? "your URL · click to confirm" : isHovered ? "click to start" : ""}
                    </span>
                    <span className="beta-track-card-arrow" aria-hidden="true">→</span>
                  </footer>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="beta-row beta-row--end beta-row--mt">
          <RouterLink to="/" className="beta-btn beta-btn--ghost">← back to home</RouterLink>
        </div>
      </div>
    </main>
  );
}
