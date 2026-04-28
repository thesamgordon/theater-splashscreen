import OBSWebSocket from 'obs-websocket-js';

export const obs = new OBSWebSocket();

export async function getObsConnection() {
  if (!obs.identified) {
    try {
      await obs.connect('ws://127.0.0.1:4455', 'UQ5K8nj8dGlT0DxE');
    } catch (error) {
      console.error("OBS Connection Failed. Ensure OBS is running: ", error);
    }
  }
  return obs;
}