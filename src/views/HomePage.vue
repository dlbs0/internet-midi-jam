<template>
  <v-system-bar>
    Your id: {{ myId }}
    <v-spacer></v-spacer>
    <span v-if="!isReady">Connecting...</span>
    <v-spacer></v-spacer>
    <ConnectionStatusIndicator />
  </v-system-bar>
  <!-- <v-toolbar border title="Application"></v-toolbar> -->
  <!-- <v-app-bar :elevation="2">Internet MIDI Jam</v-app-bar> -->
  <WelcomeDialog v-if="!isConnected" />
  <ConnectionDiagram v-if="isConnected" />
</template>

<script setup lang="ts">
import ConnectionDiagram from "@/components/ConnectionDiagram.vue";
import WelcomeDialog from "@/components/WelcomeDialog.vue";
import ConnectionStatusIndicator from "@/components/ConnectionStatusIndicator.vue";
import {
  myId,
  isReady,
  isConnected,
  setupPeering,
  cleanupConnections,
} from "@/composables/peer";
import { onMounted } from "vue";
import { onUnmounted } from "vue";

// joinSession("another-peers-id");
onMounted(() => {
  setupPeering();
});
onUnmounted(() => {
  console.log("unmounting");
  cleanupConnections();
});
</script>
