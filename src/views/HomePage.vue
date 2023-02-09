<template>
  <v-system-bar>
    Your id: {{ myId }}
    <v-spacer></v-spacer>
    <span v-if="!isReady">Connecting...</span>
    <v-spacer></v-spacer>
    <v-icon v-if="isConnected" icon="mdi-signal" class="ms-2"></v-icon>
  </v-system-bar>
  <!-- <v-toolbar border title="Application"></v-toolbar> -->
  <v-app-bar :elevation="2"></v-app-bar>
  <v-container>
    <JoinSessionDialog @join="joinSession" />
    <InviteToSessionDialog />
  </v-container>
</template>

<script setup lang="ts">
import JoinSessionDialog from "@/components/JoinSessionDialog.vue";
import InviteToSessionDialog from "@/components/InviteToSessionDialog.vue";
import { myId, isReady, isConnected, joinSession } from "@/composables/peer";

// joinSession("another-peers-id");
</script>
