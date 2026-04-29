import Link from "next/link";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>MHS Lobby Controller</h1>
      <Link href="/dashboard" className={styles.subtitle}>
        Dashboard
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={styles.externalLinkIcon}
        >
          <path d="M7 7h10v10"></path>
          <path d="M7 17 17 7"></path>
        </svg>
      </Link>
      <p className={styles.description}>
        Configure the current show name, splash text, colors, and intermission
        timer from the dashboard. The dashboard also shows the current view and
        timer status. Changes made in the dashboard will be reflected on the
        display in real time.
      </p>
      <Link href="/display" className={styles.subtitle}>
        Display
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={styles.externalLinkIcon}
        >
          <path d="M7 7h10v10"></path>
          <path d="M7 17 17 7"></path>
        </svg>
      </Link>
      <p className={styles.description}>
        Use this endpoint for the display that will be shown in the lobby. This
        should likely be used as the source in OBS.
      </p>
      <div className={styles.footer}>
        <p>
          Made by{" "}
          <a
            href="https://thesamgordon.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sam Gordon
          </a>
          . Source code available on{" "}
          <a
            href="https://github.com/thesamgordon/theater-splashscreen"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    </div>
  );
}
