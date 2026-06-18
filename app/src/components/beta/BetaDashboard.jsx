// ─── BetaDashboard — sprint board + manager presence + day counter ────────
//
// Per BETA.md §3 Day 1-5: the user logs in daily and sees the sprint board,
// the manager's presence (timezone-aware), and the current day. This is
// the home screen for the entire 5-day sprint.
//
// Layout (desktop, IDE-style):
//   ┌──────────┬────────────────────────────┬──────────────────┐
//   │ tree     │ sprint board (4 tasks)     │ manager chat     │
//   │ orbit/   │ status bar · tasks list    │ (anjali)         │
//   │  ▸ tasks │                            │                  │
//   │  ▸ chat  │ [01] drift · approved      │ 09:00 anjali …   │
//   │  ▸ me    │ [02] bert   · in progress  │ 12:30 you    …   │
//   │          │ …                          │                  │
//   └──────────┴────────────────────────────┴──────────────────┘
//
// On mobile: stack vertically (chat below board, tree hidden).
//
// Manager chat is read-only in beta — the user can't send messages except
// in the 1:1 window. v0.2 unlocks free-form chat.

import { useEffect, useState } from "react";
import SectionLabel from "../SectionLabel.jsx";
import { BETA } from "../../lib/betaData.js";
import { dayIndexOf, msUntilSprintEnd, formatRemaining, localTimeIn } from "../../lib/betaState.js";
import BetaTaskWorkspace from "./BetaTaskWorkspace.jsx";
import BetaManagerChat from "./BetaManagerChat.jsx";
import SprintCountdown from "./SprintCountdown.jsx";

const STATUS_LABEL = {
  todo: "○ todo",
  in_progress: "◐ in progress",
  submitted: "◐ submitted",
  approved: "● approved",
  rejected: "● rejected",
};

export default function BetaDashboard({ sessionState }) {
  const { session } = sessionState;
  const [openTaskId, setOpenTaskId] = useState(session.currentTaskId);
  const [, setTick] = useState(0); // forces re-render every second

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // If a task is open, show the workspace instead of the board.
  if (openTaskId) {
    return (
      <BetaTaskWorkspace
        sessionState={sessionState}
        taskId={openTaskId}
        onClose={() => setOpenTaskId(null)}
      />
    );
  }

  const day = dayIndexOf(session);
  const remaining = msUntilSprintEnd(session);
  const localTime = localTimeIn(session.user.timezone);

  return (
    <main className="beta-shell">
      <div className="beta-shell-head">
        <SectionLabel status="active">orbit labs · sprint day {day} of 5 · {session.user.timezone}</SectionLabel>
        <SprintCountdown session={session} />
      </div>

      <BetaStatusBar
        day={day}
        remaining={remaining}
        localTime={localTime}
        userTimezone={session.user.timezone}
        approvedCount={Object.values(session.taskStates).filter((s) => s.status === "approved").length}
        totalCount={BETA.tasks.length}
      />

      <div className="beta-dash">
        <BetaFileTree
          session={session}
          approvedCount={Object.values(session.taskStates).filter((s) => s.status === "approved").length}
          totalCount={BETA.tasks.length}
        />
        <BetaSprintBoard
          sessionState={sessionState}
          onOpenTask={(id) => setOpenTaskId(id)}
        />
        <BetaManagerChat sessionState={sessionState} />
      </div>

      <BetaStatusBar
        day={day}
        remaining={remaining}
        localTime={localTime}
        userTimezone={session.user.timezone}
        approvedCount={Object.values(session.taskStates).filter((s) => s.status === "approved").length}
        totalCount={BETA.tasks.length}
        variant="footer"
      />
    </main>
  );
}

// ─── Status bar (day, countdown, local time, manager presence) ────────────
function BetaStatusBar({ day, remaining, localTime, userTimezone, approvedCount, totalCount, variant }) {
  // Manager presence heuristic: 9-18 local = present, else away.
  // In v0.2 this is computed from the user's actual cohort timezone + Anjali's calendar.
  const hour = Number(localTime.split(":")[0]) || 0;
  const isWorkHours = hour >= 9 && hour < 18;
  const presence = isWorkHours ? "active" : "idle";
  const dotClass = isWorkHours ? "" : "is-away";

  return (
    <div className={`beta-ws-statusbar ${variant === "footer" ? "beta-ws-statusbar--footer" : ""}`}>
      <div className="beta-ws-statusbar-left">
        <span><span className={`beta-dot ${dotClass}`}></span>anjali · {presence}</span>
        <span>day {day} / 5</span>
        <span>progress · {approvedCount || 0} / {totalCount}</span>
      </div>
      <div className="beta-ws-statusbar-right">
        <span>{userTimezone.split("/").pop()} · {localTime}</span>
        <span>sprint ends in {formatRemaining(remaining)}</span>
      </div>
    </div>
  );
}

// ─── File tree (IDE-style sidebar) ────────────────────────────────────────
function BetaFileTree({ session, approvedCount, totalCount }) {
  return (
    <aside className="beta-dash__tree" aria-label="project files">
      <h4 className="beta-tree-title">orbit-labs/</h4>
      <div className="beta-tree-folder beta-tree-row">
        <span className="beta-tree-ic">▾</span>
        <span>intern-sprint</span>
      </div>
      <div className="beta-tree-indent" />
      <div className="beta-tree-folder beta-tree-row">
        <span className="beta-tree-ic">▾</span>
        <span>tasks</span>
      </div>
      <div className="beta-tree-indent" />
      {BETA.tasks.map((t) => {
        const s = session.taskStates[t.id];
        return (
          <div key={t.id} className={`beta-tree-row beta-tree-row--${s.status}`}>
            <span className="beta-tree-ic">·</span>
            <span>{t.id}.md</span>
            <span style={{ marginLeft: "auto", opacity: 0.6 }}>{STATUS_LABEL[s.status]?.split(" ")[0] || "○"}</span>
          </div>
        );
      })}
      <div className="beta-tree-indent" />
      <div className="beta-tree-folder beta-tree-row">
        <span className="beta-tree-ic">▸</span>
        <span>chat</span>
      </div>
      <div className="beta-tree-folder beta-tree-row">
        <span className="beta-tree-ic">▸</span>
        <span>me.md</span>
      </div>
    </aside>
  );
}

// ─── Sprint board (4 tasks, click to open) ─────────────────────────────────
function BetaSprintBoard({ sessionState, onOpenTask }) {
  const { session } = sessionState;
  const tasks = BETA.tasks;
  const states = session.taskStates;
  const approvedCount = Object.values(states).filter((s) => s.status === "approved").length;

  return (
    <div className="beta-dash__main beta-board">
      <div className="beta-board-h">
        <h2 className="beta-h2">sprint board</h2>
        <span className="beta-board-progress" aria-hidden="true">
          <span className="beta-board-progress-bar" style={{ width: `${(approvedCount / tasks.length) * 100}%` }} />
        </span>
        <span className="beta-board-progress-v beta-mono">{approvedCount} / {tasks.length}</span>
      </div>

      <ul className="beta-tasks">
        {tasks.map((t) => {
          const state = states[t.id];
          const status = state.status;
          return (
            <li key={t.id} className={`beta-task beta-task--${status}`}>
              <button
                className="beta-task-btn"
                onClick={() => onOpenTask(t.id)}
                aria-label={`open task ${t.n}: ${t.title}`}
              >
                <span className="beta-task-n beta-mono">[{t.n}]</span>
                <span className="beta-task-t">{t.title}</span>
                <span className="beta-task-xp beta-mono">+{t.xp} XP</span>
                <span className={`beta-task-status beta-task-status--${status}`}>
                  {STATUS_LABEL[status]}
                </span>
              </button>
              {status === "rejected" && (
                <div className="beta-task-note">
                  <span className="beta-task-note-h">vikram · review #{state.rejectionCount}</span>
                  <span className="beta-task-note-t">{state.reviewerNote}</span>
                  {state.lastReview?.axes && (
                    <span className="beta-task-note-axes beta-mono">
                      {Object.entries(state.lastReview.axes).map(([k, v]) => `${k} ${v.score}/${v.max}`).join(" · ")}
                    </span>
                  )}
                  <span className="beta-task-note-meta">click to revise</span>
                </div>
              )}
              {status === "approved" && (
                <div className="beta-task-note beta-task-note--ok">
                  <span className="beta-task-note-h">vikram · approved</span>
                  <span className="beta-task-note-t">{state.reviewerNote}</span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
