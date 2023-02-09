import { Peer } from "peerjs";
import { ref } from "vue";

const peer = new Peer();
const myId = ref("");
const isReady = ref(false);
const isConnected = ref(false);

peer.on("open", (id) => {
  console.log("id:", id);
  myId.value = id;
  isReady.value = true;
});

peer.on("connection", (conn) => {
  conn.on("data", (data) => {
    // Will print 'hi!'
    console.log(data);
  });
  conn.on("open", () => {
    conn.send("hello!");
    console.log("open");
  });
  conn.on("error", (err) => {
    console.log("error:", err);
  });
});

function joinSession(id: string) {
  const conn = peer.connect(id);
  conn.on("open", () => {
    isConnected.value = true;
    conn.send("hi!");
    setInterval(() => {
      conn.send("hello world");
    }, 1000);
  });
}

export { peer, myId, isReady, isConnected, joinSession };
