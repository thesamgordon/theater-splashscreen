"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./page.module.scss";

const Digit = ({ value, id }: { value: string; id: string }) => (
  <div className={styles.digitWrapper}>
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={`${id}-${value}`}
        initial={{ y: "20%", opacity: 0, filter: "blur(20px)" }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        exit={{ y: "-20%", opacity: 0, filter: "blur(20px)" }}
        transition={{ duration: 0.4, ease: [0.66, 0, 0.34, 1] }}
        className={styles.digit}
      >
        {value}
      </motion.span>
    </AnimatePresence>
  </div>
);

export default function LobbyDisplay() {
  const [data, setData] = useState({
    view: "splash",
    timerActive: false,
    text: "THE SHOW WILL BEGIN SHORTLY",
  });
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const poll = setInterval(async () => {
      try {
        const res = await fetch("/api/state");
        const json = await res.json();
        setData(json);
        setSeconds(json.seconds);
      } catch (error) {
        console.error(error);
      }
    }, 200);
    return () => clearInterval(poll);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (data.timerActive && seconds >= 0) {
      timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [data.timerActive, seconds]);

  return (
    <div className={styles.container}>
      <AnimatePresence mode="wait">
        {data.view === "splash" ? (
          <motion.div
            key="splash"
            className={styles.screen}
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1.2 }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.h1 className={styles.title}>The Addams Family</motion.h1>
              <motion.p
                key={data.text + "-subtitle"}
                initial={{ y: "20%", opacity: 0, filter: "blur(20px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ y: "-20%", opacity: 0, filter: "blur(20px)" }}
                transition={{ duration: 0.4, ease: [0.66, 0, 0.34, 1] }}
                className={styles.subtitle}
              >
                {data.text}
              </motion.p>
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="intermission"
            className={styles.screen}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnimatePresence mode="wait">
              {seconds >= 0 ? (
                <motion.div
                  key="intermission"
                  className={styles.screen}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 1.2 }}
                >
                  <h2 className={styles.label}>INTERMISSION</h2>
                  <div className={styles.clock}>
                    <div className={styles.minutesArea}>
                      {Math.floor(seconds / 60)
                        .toString()
                        .padStart(2, "0")
                        .split("")
                        .map((char, i) => (
                          <Digit
                            key={`min-${i}`}
                            id={`min-${i}`}
                            value={char}
                          />
                        ))}
                    </div>

                    <div className={styles.separator}>:</div>

                    <div className={styles.secondsArea}>
                      {(seconds % 60)
                        .toString()
                        .padStart(2, "0")
                        .split("")
                        .map((char, i) => (
                          <Digit
                            key={`sec-${i}`}
                            id={`sec-${i}`}
                            value={char}
                          />
                        ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="intermission-ended"
                  className={styles.screen}
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ duration: 1.2 }}
                >
                  <h2 className={styles.label}>PLEASE TAKE YOUR SEATS</h2>
                  <div className={styles.startingSoon}>STARTING SOON</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
