<template>
  <v-avatar color="surface-variant" size="64">{{ remoteNickname }}</v-avatar>
  <v-list-item
    class="text-white"
    title="Marcus Obrien"
    subtitle="Network Engineer"
  ></v-list-item>
</template>

<script setup lang="ts">
import { remoteNickname } from "@/composables/peer";
</script>
