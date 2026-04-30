import { NextResponse } from "next/server";

let endTimestamp: number | null = null;
let currentView = "splash";
let text = "THE SHOW WILL BEGIN SHORTLY";
import { getObsConnection } from "@/lib/obs";
import path from "path";
import fs from "fs";
import { getDefaultConfiguration } from "@/lib/types/data";

const CONFIG_PATH = path.join(process.cwd(), "config.json");
const CHIME_SECONDS = [0, 2 * 60, 5 * 60];

let showConfig = getDefaultConfiguration();

if (fs.existsSync(CONFIG_PATH)) {
  showConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
}

export async function GET() {
  let remaining = 0;

  if (endTimestamp) {
    remaining = Math.max(-1, Math.round((endTimestamp - Date.now()) / 1000));
  }

  const shouldChime =
    CHIME_SECONDS.includes(remaining) &&
    currentView === "intermission";

  const responseData = {
    view: currentView,
    seconds: remaining,
    text,
    config: showConfig,
    shouldChime: shouldChime,
  };

  return NextResponse.json(responseData);
}

export async function POST(req: Request) {
  const body = await req.json();
  const obs = await getObsConnection();

  if (body.action === "updateConfig") {
    showConfig = { ...showConfig, ...body.value };
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(showConfig, null, 2));
    return NextResponse.json({ success: true });
  } else if (body.action === "set" || body.view === "intermission") {
    let secs = body.value || showConfig.intermissionLength * 60;
    if (body.value === 0) {
      secs = 0;
    }

    endTimestamp = Date.now() + secs * 1000;
    currentView = "intermission";

    if (obs.identified) {
      await obs.call("SetCurrentProgramScene", { sceneName: "Browser View" });
    }
  } else if (body.view === "live") {
    if (obs.identified) {
      await obs.call("SetCurrentProgramScene", { sceneName: "Feed" });
    }

    currentView = "live";
  } else if (body.action === "adjust") {
    if (endTimestamp) {
      endTimestamp = Math.max(endTimestamp, Date.now()) + body.value * 1000;
    }
  } else if (body.action === "text") {
    if (typeof body.value === "string") {
      text = body.value;
    } else {
      text = "";
    }
  } else {
    if (obs.identified) {
      await obs.call("SetCurrentProgramScene", { sceneName: "Browser View" });
    }

    currentView = body.view;
    if (body.view === "splash") endTimestamp = null;
  }

  return NextResponse.json({
    view: currentView,
    seconds: 0,
    text,
    shouldChime: false,
  });
}
