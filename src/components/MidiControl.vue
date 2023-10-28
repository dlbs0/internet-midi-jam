<template>
  <v-row>
    <v-col md="6" cols="12">
      <v-select
        :items="midiInputs"
        v-model="selectedMidiInput"
        label="Select MIDI Input"
        hide-details="auto"
      ></v-select> </v-col
    ><v-col md="6" cols="12">
      <v-select
        :items="midiOutputs"
        v-model="selectedMidiOutput"
        label="Select MIDI Output"
        hide-details="auto"
      ></v-select>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-select
        :items="gmTones"
        v-model="selectedMidiProgram"
        label="Select instrument"
        hide-details="auto"
      ></v-select>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import {
  selectedMidiInput,
  selectedMidiOutput,
  midiInputs,
  midiOutputs,
  selectedMidiProgram,
} from "@/composables/midi";
import { gmTones } from "@/composables/classes";
</script>
