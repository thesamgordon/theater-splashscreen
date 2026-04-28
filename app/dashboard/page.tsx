"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";

export default function Dashboard() {
  const [customTime, setCustomTime] = useState(15);
  const [serverState, setServerState] = useState({
    view: "splash",
    seconds: 0,
    text: "THE SHOW WILL BEGIN SHORTLY",
  });

  const [textInput, setTextInput] = useState("THE SHOW WILL BEGIN SHORTLY");

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch("/api/state");
        const json = await res.json();
        setServerState(json);
      } catch (e) {}
    }, 200);
    return () => clearInterval(poll);
  }, []);

  const updateState = (payload: object) => {
    fetch("/api/state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  };

  const formatTime = (s: number) => {
    const displaySecs = Math.max(0, s);
    const m = Math.floor(displaySecs / 60)
      .toString()
      .padStart(2, "0");
    const sec = (displaySecs % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>Lobby Control</nav>

      <div className={styles.statusBar}>
        <div className={styles.top}>
          <div className={styles.statusItem}>
            <span>VIEW: </span>
            <strong
              className={
                serverState.view === "intermission" ? styles.activeText : ""
              }
            >
              {serverState.view.toUpperCase()}
            </strong>
          </div>
          {serverState.view === "intermission" && (
            <div className={styles.statusItem}>
              <span>LOBBY CLOCK: </span>
              <strong className={styles.clockText}>
                {formatTime(serverState.seconds)}
              </strong>
            </div>
          )}
        </div>

        {serverState.text && serverState.view == "splash" && (
          <div className={styles.statusItem}>
            <span>LOBBY TEXT: </span>
            <strong>{serverState.text}</strong>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h3>SCENE CONTROL</h3>
        <div className={styles.grid}>
          <button
            className={styles.btn}
            onClick={() => updateState({ view: "splash", timerActive: false })}
          >
            ACTIVATE SPLASH
          </button>
          {serverState.view !== "intermission" && (
            <button
              className={`${styles.btn} ${styles.warn}`}
              onClick={() =>
                updateState({
                  view: "intermission",
                  timerActive: true,
                  action: "set",
                  value: 900,
                })
              }
            >
              START INTERMISSION
            </button>
          )}
          {serverState.view === "intermission" && (
            <button
              className={`${styles.btn} ${styles.warn}`}
              onClick={() =>
                updateState({
                  view: "intermission",
                  timerActive: false,
                  action: "set",
                  value: 0,
                })
              }
            >
              END INTERMISSION
            </button>
          )}
        </div>
        <div className={styles.input}>
          <input
            type="text"
            placeholder="Custom lobby text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <div className={styles.submitBtn}>
            <button
              className={styles.btn}
              onClick={() => {
                updateState({ action: "text", value: textInput });
              }}
            >
              UPDATE TEXT
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>TIMER CONTROL</h3>
        <div className={styles.timerControls}>
          <div className={styles.adjustButtons}>
            <button
              className={styles.btn}
              onClick={() => updateState({ action: "adjust", value: 60 })}
            >
              +1 MIN
            </button>
            <button
              className={styles.btn}
              onClick={() => updateState({ action: "adjust", value: -60 })}
            >
              -1 MIN
            </button>
          </div>

          <div className={styles.customSet}>
            <input
              type="number"
              value={customTime}
              onChange={(e) => setCustomTime(parseInt(e.target.value))}
            />
            <button
              className={styles.btn}
              onClick={() =>
                updateState({ action: "set", value: customTime * 60 })
              }
            >
              SET MINUTES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
