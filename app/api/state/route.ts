import { NextResponse } from "next/server";

let endTimestamp: number | null = null;
let currentView = "splash";
let text = "THE SHOW WILL BEGIN SHORTLY";

export async function GET() {
  let remaining = 0;

  if (endTimestamp) {
    remaining = Math.max(-1, Math.round((endTimestamp - Date.now()) / 1000));
  }

  return NextResponse.json({
    view: currentView,
    seconds: remaining,
    text,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  if (body.action === "set" || body.view === "intermission") {
    let secs = body.value || 900;
    if (body.value === 0) {
      secs = 0;
    }

    endTimestamp = Date.now() + secs * 1000;
    currentView = "intermission";
  } else if (body.action === "adjust") {
    if (endTimestamp) endTimestamp += body.value * 1000;
  } else if (body.action === "text" && body.value) {
    text = body.value;
  } else {
    currentView = body.view;
    if (body.view === "splash") endTimestamp = null;
  }

  return NextResponse.json({ view: currentView, seconds: 0, text });
}
