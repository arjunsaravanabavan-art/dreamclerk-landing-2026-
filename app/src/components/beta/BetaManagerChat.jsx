// ─── BetaManagerChat — scripted chat with Anjali ──────────────────────────
//
// Per BETA.md §6: the chat is scripted (deterministic), not LLM-driven.
// The "conversation" is the user's chat history with the manager + tech lead,
// populated as they trigger events (day start, task submit, 1:1 window).
//
// For the Day-3 1:1 window, we open a structured 3-question script. The user
// answers in plain text; nothing is sent anywhere in beta (it lives in
// localStorage with the rest of the session).
//
// In v0.2 the chat unlocks free-form messages and an LLM responds.

import { useState, useRef, useEffect } from "react";
import { BETA } from "../../lib/betaData.js";
import { localTimeIn } from "../../lib/betaState.js";

export default function BetaManagerChat({ sessionState }) {
  const { session, patch } = sessionState;
  const [oneOnOneOpen, setOneOnOneOpen] = useState(false);
  // Transcript collapse: long sprints produce a long thread. We keep the
  // last 4 messages always visible (with the live scroll). A toggle below
  // expands to the full transcript, which is otherwise hidden by a fade.
  const [showFullTranscript, setShowFullTranscript] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session.chat.length]);

  const day = (() => {
    if (!session.sprintStartedAt) return 0;
    const diff = Date.now() - new Date(session.sprintStartedAt).getTime();
    return Math.floor(diff / (24 * 60 * 60 * 1000)) + 1;
  })();

  const showOneOnOne = day === 3 && !session.oneOnOne.completed;

  const finishOneOnOne = (answers) => {
    patch({
      oneOnOne: { completed: true, answers },
      chat: [
        ...session.chat,
        { speaker: "manager", text: BETA.scriptedMessages["day5-sprint-end"](), at: new Date().toISOString() },
      ],
    });
    setOneOnOneOpen(false);
  };

  // Decide which messages to show. Default: last 4 (the recent context).
  // If showFullTranscript is on: all of them. If the thread is shorter
  // than the recent window anyway, just show everything.
  const RECENT_WINDOW = 4;
  const allMessages = session.chat || [];
  const hasLongThread = allMessages.length > RECENT_WINDOW;
  const visible = !hasLongThread || showFullTranscript
    ? allMessages
    : allMessages.slice(-RECENT_WINDOW);
  const hiddenCount = allMessages.length - visible.length;

  return (
    <aside className="beta-chat">
      <div className="beta-chat-h">
        <h3 className="beta-h3">anjali · manager</h3>
        <span className="beta-chat-meta mono">{BETA.personas.manager.timezone.split("/").pop()}</span>
      </div>

      <div className="beta-chat-thread" ref={scrollRef}>
        {allMessages.length === 0 ? (
          <p className="beta-chat-empty">no messages yet. anjali will check in at 9 AM local.</p>
        ) : (
          <>
            {hasLongThread && !showFullTranscript && hiddenCount > 0 ? (
              <button
                type="button"
                className="beta-chat-transcript-toggle"
                onClick={() => setShowFullTranscript(true)}
                aria-label={`show ${hiddenCount} earlier message${hiddenCount === 1 ? "" : "s"}`}
              >
                · show {hiddenCount} earlier message{hiddenCount === 1 ? "" : "s"} ·{" "}
                <span className="beta-chat-transcript-time">
                  {allMessages[0]?.at ? new Date(allMessages[0].at).toLocaleString() : ""}
                </span>
              </button>
            ) : null}
            {visible.map((m, i) => (
              <BetaMessage
                key={`${allMessages.length - visible.length + i}-${m.at || i}`}
                message={m}
                userTimezone={session.user.timezone}
              />
            ))}
            {hasLongThread && showFullTranscript ? (
              <button
                type="button"
                className="beta-chat-transcript-toggle"
                onClick={() => setShowFullTranscript(false)}
                aria-label="collapse to recent messages"
              >
                · collapse to last {RECENT_WINDOW} ·
              </button>
            ) : null}
          </>
        )}
      </div>

      {showOneOnOne && !oneOnOneOpen && (
        <button className="beta-btn beta-btn--primary" onClick={() => setOneOnOneOpen(true)}>
          book 1:1 with anjali →
        </button>
      )}

      {oneOnOneOpen && (
        <BetaOneOnOne
          onComplete={finishOneOnOne}
          onCancel={() => setOneOnOneOpen(false)}
          sessionState={sessionState}
        />
      )}

      {!oneOnOneOpen && (
        <p className="beta-chat-foot beta-p beta-p--small">
          beta: chat is read-only. v0.2 unlocks free-form messages.
        </p>
      )}
    </aside>
  );
}

function BetaMessage({ message, userTimezone }) {
  const { speaker, text, at } = message;
  const isYou = speaker === "user";
  const isTech = speaker === "techLead";
  const speakerName = isYou ? "you" : isTech ? BETA.personas.techLead.name.split(" ")[0] : BETA.personas.manager.name.split(" ")[0];
  const time = at ? localTimeIn(userTimezone, new Date(at)) : "";

  return (
    <div className={`beta-msg beta-msg--${speaker}`}>
      <div className="beta-msg-h">
        <span className="beta-msg-name">{speakerName}</span>
        <span className="beta-msg-time mono">{time}</span>
      </div>
      <div className="beta-msg-body">{text}</div>
    </div>
  );
}

function BetaOneOnOne({ onComplete, onCancel, sessionState }) {
  const { session } = sessionState;
  const script = BETA.oneOnOneScript;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [input, setInput] = useState("");
  const current = script[step];

  const submitAnswer = () => {
    if (!current.key) return;
    setAnswers({ ...answers, [current.key]: input });
    setInput("");
    if (step < script.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  if (!current) return null;

  return (
    <div className="beta-oneonone">
      <h4 className="beta-h4">1:1 · day 3 · ~3 min</h4>
      <div className="beta-oneonone-thread">
        {script.slice(0, step).map((s, i) => {
          if (s.speaker === "manager") {
            return (
              <div key={i} className="beta-msg beta-msg--manager">
                <div className="beta-msg-body">{s.text}</div>
              </div>
            );
          }
          if (s.speaker === "user" && s.key) {
            return (
              <div key={i} className="beta-msg beta-msg--user">
                <div className="beta-msg-body">{answers[s.key] || "—"}</div>
              </div>
            );
          }
          return null;
        })}
      </div>
      {current.speaker === "manager" ? (
        <div className="beta-oneonone-ask">
          <div className="beta-msg beta-msg--manager">
            <div className="beta-msg-body">{current.text}</div>
          </div>
          <button className="beta-btn beta-btn--primary" onClick={() => setStep(step + 1)}>
            reply →
          </button>
        </div>
      ) : (
        <div className="beta-oneonone-ask">
          <textarea
            className="beta-input beta-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="type your answer…"
            rows={3}
            autoFocus
          />
          <button
            className="beta-btn beta-btn--primary"
            onClick={submitAnswer}
            disabled={input.trim().length < 3}
          >
            send →
          </button>
        </div>
      )}
      <button className="beta-btn beta-btn--ghost beta-oneonone-cancel" onClick={onCancel}>
        cancel
      </button>
    </div>
  );
}