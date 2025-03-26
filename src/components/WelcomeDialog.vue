<template>
  <div class="pageWrapper">
    <div class="welcomeParent" v-auto-animate>
      <h1>Welcome to Internet MIDI Jam</h1>
      <p
        >IMJ lets you jam with a friend over the internet, using your MIDI
        instruments. <br />Simply connect your MIDI keyboard to your computer,
        send your friend an invite, and start jamming!
        <br />
        This site endeavours to provide the lowest possible latency, by only
        sending MIDI packets instead of audio, and sending them directly (in
        most cases) to your friend's computer, rather than through a server. </p
      ><br />
      <h3>Having problems?</h3>
      <p
        >Get in touch, and create an issue
        <a href="https://github.com/dlbs0/internet-midi-jam/issues">here</a> to
        let me know what's going on. Please note this site is still in beta, and
        your feedback helps make it better. Some browsers don't support Web
        MIDI, try using Chrome.</p
      ><br />
      <br />
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
