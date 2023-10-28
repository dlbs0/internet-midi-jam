import router from "@/router";
import { useStorage } from "@vueuse/core";
import { DataConnection, Peer } from "peerjs";
import { ref } from "vue";
import { PeerMidiEvent, sendToMidiOutput } from "./midi";

let peer: Peer;
const myId = ref("");
const myNickname = useStorage("user-nick-name", "");
const remoteId = ref("");
const remoteNickname = ref("");
let remoteConnection: DataConnection | undefined;
const isReady = ref(false);
const isConnected = ref(false);
const pingTimeFromPeer = ref(0); //in ms

let heartbeatInterval: NodeJS.Timeout;

function initialisePeer() {
  if (!remoteConnection) return;
  remoteConnection?.on("data", (data: any) => {
    console.log("got data", data);
    if (typeof data === "string") {
      // do things with string data here
    } else if (typeof data === "object" && data !== null && "type" in data) {
      switch (data.type) {
        case "nickname":
          if (data.nickname) remoteNickname.value = data.nickname;
          break;
        case "ping":
          remoteConnection?.send({
            type: "pong",
            startTime: data?.time,
            halfwayTime: Date.now(),
          });
          break;
        case "pong":
          pingTimeFromPeer.value = (Date.now() - data?.startTime) / 2;
          break;
        case "midi":
          console.log("got midi", data);
          sendToMidiOutput(data.data);
          break;
      }
    }
  });
  remoteConnection.on("open", () => {
    if (!remoteConnection) return;
    remoteConnection.send("join accepted");
    console.log("sent 'join accepted' to remote");
    remoteId.value = remoteConnection.peer;
    isConnected.value = true;
    setupHeartbeats(remoteConnection);
    sendNickname(myNickname.value, remoteConnection);
  });
  remoteConnection?.on("error", (err) => {
    console.log("error:", err);
  });
}

function sendToPeer(type: string, data: PeerMidiEvent) {
  if (!remoteConnection) return;
  remoteConnection.send({ type, data });
}

function setupPeering() {
  const debugMode = router.currentRoute.value.query.debugMode;
  const myIdParam = router.currentRoute.value.query.myId;
  console.log("myIdParam:", myIdParam);
  if (debugMode && myIdParam) {
    //for debugging, it's helpful to be able to control our id, rather than getting one randonmly
    peer = new Peer(myIdParam.toString());
  } else {
    peer = new Peer();
  }
  peer.on("open", (id) => {
    console.log("My peer id:", id);
    myId.value = id;
    isReady.value = true;

    const debugRemoteId = router.currentRoute.value.query.debugRemoteId;
    //for debugging, it's helpful to have two instances connect to each other
    if (debugMode === "true" && debugRemoteId) {
      setTimeout(() => {
        joinSession(debugRemoteId.toString());
      }, 300);
    }
  });

  peer.on("connection", (conn) => {
    //the remote device triggers this
    console.log("Got join request from remote device, id:", conn.peer);
    remoteConnection = conn;
    initialisePeer();
  });
}

function joinSession(id: string) {
  console.log("joining session", id);
  // we trigger this from this device
  const conn = peer.connect(id);
  remoteConnection = conn;
  initialisePeer();
}

function sendNickname(
  nickname: string,
  remoteDevice: DataConnection | undefined
) {
  remoteDevice?.send({ type: "nickname", nickname });
}

function setupHeartbeats(remoteDevice: DataConnection | undefined) {
  remoteDevice?.send("heartbeat");
  heartbeatInterval = setInterval(() => {
    remoteDevice?.send("heartbeat");
    remoteDevice?.send({ type: "ping", time: Date.now() });
  }, 2000);
}

export function cleanupConnections() {
  console.log("cleaning up connections!");
  peer.destroy();
  clearInterval(heartbeatInterval);
}

export {
  peer,
  myId,
  isReady,
  isConnected,
  pingTimeToPeer,
  pingTimeFromPeer,
  myNickname,
  remoteNickname,
  joinSession,
  sendToPeer,
  setupPeering,
};
