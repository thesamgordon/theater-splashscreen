import OBSWebSocket from 'obs-websocket-js';

export const obs = new OBSWebSocket();

const obsPassword = process.env.OBS_PASSWORD;

if (!obsPassword) {
  console.warn("OBS_PASSWORD is not set. Please create a .env file with OBS_PASSWORD=yourpassword");
  process.exit(1);
}

export async function getObsConnection() {

  if (!obs.identified) {
    try {
      await obs.connect('ws://127.0.0.1:4455', obsPassword);
    } catch (error) {
      console.error("OBS Connection Failed. Ensure OBS is running: ", error);
    }
  }
  return obs;
}