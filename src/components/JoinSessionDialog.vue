<template>
  <div>
    <v-btn
      prepend-icon="mdi-login-variant"
      color="primary"
      :disabled="props.disabled"
    >
      Join Session

      <v-dialog v-model="dialog" activator="parent" max-width="500px">
        <v-card>
          <v-card-title>Join Session</v-card-title>
          <v-card-text>
            <v-text-field
              clearable
              v-model="sessionId"
              label="Paste Session Code"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="dialog = false">Cancel</v-btn>
            <v-btn
              :loading="tryingToJoin && !isConnected"
              :disabled="sessionId == ''"
              color="primary"
              @click="
                tryingToJoin = true;
                joinSession(sessionId);
              "
              >Join</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { isConnected, joinSession } from "@/composables/peer";
const props = defineProps({ disabled: Boolean });

const sessionId = ref("");
const tryingToJoin = ref(false);

const dialog = ref(false);
</script>
