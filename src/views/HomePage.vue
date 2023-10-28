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
  <div v-if="isConnected">
    <v-container fluid>
      <MidiControl />
      <ConnectionDiagram />
    </v-container>
  </div>
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
import {
  midiInputs,
  midiOutputs,
  selectedMidiInput,
  selectedMidiOutput,
  startMidi,
  selectedMidiProgram,
} from "@/composables/midi";
import { onMounted } from "vue";
import { onUnmounted } from "vue";
import { gmTones } from "@/composables/classes";
import MidiControl from "@/components/MidiControl.vue";

onMounted(() => {
  startMidi();
  setupPeering();
});
onUnmounted(() => {
  console.log("unmounting!");
  cleanupConnections();
});
</script>
