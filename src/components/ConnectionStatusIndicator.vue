<template>
  <div class="msNumber" v-if="isConnected">{{ pingTimeFromPeer }}ms </div>
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
  ></v-icon>
  <v-icon v-if="signalLevel == 0" icon="mdi:signal-off" class="ms-2 text-red">
  </v-icon>
</template>
<script setup lang="ts">
import { isConnected, pingTimeFromPeer } from "@/composables/peer";
import { computed } from "vue";

const signalLevel = computed(() => {
  if (!isConnected) return 0;
  if (pingTimeFromPeer.value > 500) return 1;
  if (pingTimeFromPeer.value > 200) return 2;
  if (pingTimeFromPeer.value > 75) return 3;
  if (pingTimeFromPeer.value > 20) return 4;
  return 4;
});
</script>

<style scoped>
.msNumber {
  align-self: end;
}
</style>
