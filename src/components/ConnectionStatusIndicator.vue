<template>
  <v-icon v-if="isConnected" icon="mdi-arrow-up" class="ms-2" />
  <div class="msNumber" v-if="isConnected">{{ pingTimeToPeer }}ms </div>
  <v-icon v-if="isConnected" icon="mdi-arrow-down" class="ms-2" />
  <div class="msNumber" v-if="isConnected">{{ pingTimeFromPeer }}mss </div>
  <v-icon
    v-if="signalLevel == 4"
    icon="mdi-signal-cellular-3"
    class="ms-2 text-green"
  >
  </v-icon>
  <v-icon
    v-if="signalLevel == 3"
    icon="mdi-signal-cellular-2"
    class="ms-2 text-orange"
  >
  </v-icon>
  <v-icon
    v-if="signalLevel == 2"
    icon="mdi-signal-cellular-1"
    class="ms-2 text-red"
  >
  </v-icon>
  <v-icon
    v-if="signalLevel == 1"
    icon="mdi-signal-cellular-outline"
    class="ms-2 text-red"
  >
  </v-icon>
</template>
<script setup lang="ts">
import {
  isConnected,
  pingTimeToPeer,
  pingTimeFromPeer,
} from "@/composables/peer";
import { computed } from "vue";

const signalLevel = computed(() => {
  if (!isConnected) return 0;
  if (pingTimeToPeer.value > 500) return 1;
  if (pingTimeToPeer.value > 200) return 2;
  if (pingTimeToPeer.value > 75) return 3;
  if (pingTimeToPeer.value > 20) return 4;
  return 4;
});
</script>

<style scoped>
.msNumber {
  align-self: end;
}
</style>
