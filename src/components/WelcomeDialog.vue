<template>
  <div class="pageWrapper">
    <div class="welcomeParent" v-auto-animate>
      <div class="welcomeChild">
        <v-text-field
          label="What's your name?"
          variant="outlined"
          v-model="myNickname"
        ></v-text-field>
      </div>

      <div class="welcomeChild" v-if="hasGivenName">
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
      </div>
      <div class="welcomeChild" v-if="hasGivenName">
        <JoinSessionDialog @join="joinSession" :disabled="!hasGivenName" />
        <InviteToSessionDialog :disabled="!hasGivenName" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.pageWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.welcomeParent {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 80%;
  align-items: center;
  justify-content: center;
}
.welcomeChild {
  margin: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  width: 100%;
}
</style>

<script setup lang="ts">
import JoinSessionDialog from "@/components/JoinSessionDialog.vue";
import InviteToSessionDialog from "@/components/InviteToSessionDialog.vue";
import { joinSession, myNickname } from "@/composables/peer";
import {
  selectedMidiInput,
  selectedMidiOutput,
  midiInputs,
  midiOutputs,
} from "@/composables/midi";

import { computed } from "vue";

const hasGivenName = computed(
  () => myNickname.value !== "" && myNickname.value.length > 0
);
</script>
