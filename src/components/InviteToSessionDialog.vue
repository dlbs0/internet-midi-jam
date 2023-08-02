<template>
  <div>
    <v-btn
      prepend-icon="mdi-account-plus"
      color="primary"
      :disabled="props.disabled"
    >
      Start Session

      <v-dialog v-model="dialog" activator="parent" max-width="500px">
        <v-card>
          <v-card-title>Invite to Session</v-card-title>
          <v-card-subtitle
            >Share this code with others to invite them to your
            session</v-card-subtitle
          >
          <v-card-text>
            <v-text-field
              v-model="myId"
              label="Session Code"
              append-inner-icon="mdi-content-copy"
              @click:append-inner="copy()"
              :disabled="!isSupported"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="dialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { myId } from "@/composables/peer";
import { useClipboard } from "@vueuse/core";
const props = defineProps({ disabled: Boolean });

const { text, copy, copied, isSupported } = useClipboard({ source: myId });

const dialog = ref(false);
</script>
