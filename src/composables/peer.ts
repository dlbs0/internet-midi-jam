import router from "@/router";
import { useStorage, useUrlSearchParams } from "@vueuse/core";
import { useRouteParams, useRouteQuery } from "@vueuse/router";
import { DataConnection, Peer } from "peerjs";
import { Ref, ref } from "vue";

let peer: Peer;
const myId = ref("");
const myNickname = useStorage("user-nick-name", "");
const remoteId = ref("");
const remoteNickname = ref("");
let remoteConnection: DataConnection | undefined;
const isReady = ref(false);
const isConnected = ref(false);

let heartbeatInterval: NodeJS.Timeout;

function initialisePeer() {
  if (!remoteConnection) return;
  remoteConnection?.on("data", (data) => {
    console.log("got data", data);
    if (typeof data === "string") {
      // do things with string data here
    } else if (typeof data === "object" && data !== null && "type" in data) {
      switch (data.type) {
        case "nickname":
          // eslint-disable-next-line no-case-declarations
          const packet = data as { type: "nickname"; nickname: string };
          if (packet.nickname) remoteNickname.value = packet?.nickname;
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

export function setupPeering() {
  peer = new Peer();
  peer.on("open", (id) => {
    console.log("My peer id:", id);
    myId.value = id;
    isReady.value = true;

    const debugMode = router.currentRoute.value.query.debugMode;
    console.log("debugMode:", debugMode);
    const debugRemoteId = router.currentRoute.value.query.debugRemoteId;
    console.log("debugRemoteId:", debugRemoteId);
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
  // conn.on("open", () => {
  //   isConnected.value = true;
  //   remoteId.value = conn.peer;
  //   connectionId.value = conn.connectionId;
  //   setupHeartbeats(conn);
  // });
  // conn.on("data", (data) => {
  //   console.log("got data", data);
  // });
  // conn.on("error", (err) => {
  //   console.log("error:", err);
  // });
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
  }, 1000);
}

export function cleanupConnections() {
  console.log("cleaning up connections");
  peer.destroy();
  clearInterval(heartbeatInterval);
}

export {
  peer,
  myId,
  isReady,
  isConnected,
  myNickname,
  remoteNickname,
  joinSession,
};
