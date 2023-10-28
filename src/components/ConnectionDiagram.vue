<template>
  <v-row>
    <v-col v-for="slider in sliders" :key="slider.name" cols="3" sm="2" md="1">
      <div class="fader">
        <v-slider
          direction="vertical"
          :min="0"
          :max="127"
          :step="1"
          prepend-icon="mdi-volume-high"
        ></v-slider>
        <v-avatar color="surface-variant" size="64">{{ slider.name }}</v-avatar>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { myNickname, remoteNickname } from "@/composables/peer";
import { computed } from "vue";

const sliders = computed(() => {
  const arr = [
    { name: myNickname.value, value: 127 },
    { name: remoteNickname.value, value: 64 },
  ];
  return arr;
});
</script>

<style scoped>
.fader {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgb(224, 219, 219);
  border-radius: 1rem;
  /* width: min-content; */
}
</style>
