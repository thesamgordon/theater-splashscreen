"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.scss";
import { getDefaultConfiguration, getDefaultState } from "@/lib/types/data";

export default function Dashboard() {
  const [customTime, setCustomTime] = useState(15);
  const [serverState, setServerState] = useState(getDefaultState());

  const [configuration, setConfiguration] = useState(getDefaultConfiguration());
  const [inputFocus, setInputFocus] = useState(false);

  const [textInput, setTextInput] = useState("");
  const [hasSetConfig, setHasSetConfig] = useState(false);

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch("/api/state");
        const json = await res.json();
        setServerState(json);

        if (json.config && !inputFocus) {
          setConfiguration(json.config);

          if (!hasSetConfig) {
            setTextInput(json.config.splash);
            setHasSetConfig(true);
          }
        }
      } catch (e) {}
    }, 500);
    return () => clearInterval(poll);
  }, [inputFocus, hasSetConfig]);

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
      <div className={styles.statusBar}>
        <div className={styles.top}>
          <div className={styles.statusItem}>
            <span>CURRENT VIEW</span>
            <strong
              className={
                serverState.view === "intermission" ? styles.activeText : ""
              }
            >
              {serverState.view.toUpperCase()}
            </strong>
          </div>
          {serverState.view === "intermission" && (
            <div className={`${styles.statusItem} ${styles.timer}`}>
              <span>LOBBY CLOCK</span>
              <strong className={styles.clockText}>
                {formatTime(serverState.seconds)}
              </strong>
            </div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Scene Control</h3>
        <div className={styles.grid}>
          <button
            className={`${styles.btn} ${styles.warn} ${serverState.view == "splash" ? styles.disabled : ""}`}
            onClick={() => updateState({ view: "splash", timerActive: false })}
          >
            ACTIVATE SPLASH
          </button>
          <button
            className={`${styles.btn} ${styles.warn} ${serverState.view == "live" ? styles.disabled : ""}`}
            onClick={() =>
              updateState({
                view: "live",
              })
            }
          >
            GO LIVE
          </button>
          <button
            className={`${styles.btn} ${styles.warn} ${serverState.view == "intermission" ? styles.disabled : ""}`}
            onClick={() =>
              updateState({
                view: "intermission",
                timerActive: true,
                action: "set",
                value: configuration.intermissionLength * 60,
              })
            }
          >
            START INTERMISSION
          </button>
          <button
            className={`${styles.btn} ${styles.warn} ${serverState.view != "intermission" ? styles.disabled : ""}`}
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
        </div>
        <div className={styles.input}>
          <input
            type="text"
            placeholder="Custom lobby text"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setConfiguration({
                  ...configuration,
                  splash: textInput,
                });
                updateState({
                  action: "updateConfig",
                  value: { splash: textInput },
                });

                setInputFocus(false);
                (e.target as HTMLInputElement).blur();
              }
            }}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <div>
            <button
              className={`${styles.btn} ${styles.submitBtn}`}
              onClick={() => {
                setConfiguration({
                  ...configuration,
                  splash: textInput,
                });
                updateState({
                  action: "updateConfig",
                  value: { splash: textInput },
                });
              }}
            >
              SET SPLASH
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Timer Control</h3>
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

          <div className={styles.input}>
            <input
              type="number"
              placeholder="15"
              value={customTime}
              onChange={(e) => setCustomTime(parseInt(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  updateState({ action: "set", value: customTime * 60 });

                  setInputFocus(false);
                  (e.target as HTMLInputElement).blur();
                }
              }}
            />
            <div>
              <button
                className={`${styles.btn} ${styles.submitBtn}`}
                onClick={() => {
                  updateState({ action: "set", value: customTime * 60 });
                }}
              >
                SET TIME
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3>Show Configuration</h3>
        <div className={styles.flex}>
          <div className={styles.configItem}>
            <label>Show Name</label>
            <input
              type="text"
              value={configuration.showName}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              onChange={(e) => {
                setConfiguration({
                  ...configuration,
                  showName: e.target.value,
                });
                updateState({
                  action: "updateConfig",
                  value: { showName: e.target.value },
                });
              }}
            />
          </div>
          <div className={styles.configItem}>
            <label>Intermission Length (minutes)</label>
            <input
              type="number"
              value={configuration.intermissionLength}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              onChange={(e) => {
                setConfiguration({
                  ...configuration,
                  intermissionLength: parseInt(e.target.value),
                });
                updateState({
                  action: "updateConfig",
                  value: { intermissionLength: parseInt(e.target.value) },
                });
              }}
            />
          </div>
          <div className={styles.configItem}>
            <label>Primary Color</label>
            <input
              type="color"
              value={configuration.primaryColor}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              className={styles.colorInput}
              onChange={(e) => {
                setConfiguration({
                  ...configuration,
                  primaryColor: e.target.value,
                });
                updateState({
                  action: "updateConfig",
                  value: { primaryColor: e.target.value },
                });
              }}
            />
          </div>
          <div className={styles.configItem}>
            <label>Secondary Color</label>
            <input
              type="color"
              value={configuration.secondaryColor}
              onFocus={() => setInputFocus(true)}
              onBlur={() => setInputFocus(false)}
              className={styles.colorInput}
              onChange={(e) => {
                setConfiguration({
                  ...configuration,
                  secondaryColor: e.target.value,
                });
                updateState({
                  action: "updateConfig",
                  value: { secondaryColor: e.target.value },
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
