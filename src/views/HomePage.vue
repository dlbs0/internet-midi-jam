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
  <v-select
    :items="midiInputs"
    v-model="selectedMidiInput"
    label="Select MIDI Input"
  ></v-select>
  <v-select
    :items="midiOutputs"
    v-model="selectedMidiOutput"
    label="Select MIDI Output"
  ></v-select>
  <v-select
    :items="gmTones"
    v-model="selectedMidiProgram"
    label="Select instrument"
  ></v-select>
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

onMounted(() => {
  startMidi();
  setupPeering();
});
onUnmounted(() => {
  console.log("unmounting!");
  cleanupConnections();
});
</script>
