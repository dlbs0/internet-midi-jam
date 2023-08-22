<template>
  <div>
    <v-btn
      prepend-icon="mdi-account-plus"
      :color="remoteId ? '' : 'primary'"
      :disabled="props.disabled"
    >
      Create Session

      <v-dialog v-model="dialog" activator="parent" max-width="500px">
        <v-card>
          <v-card-title>Invite to Session</v-card-title>
          <v-card-subtitle>
            Share with others to invite them to your session
          </v-card-subtitle>
          <v-card-text>
            <v-text-field
              v-model="myId"
              label="Session Code"
              :append-inner-icon="
                codeIsSupported
                  ? codeCopied
                    ? 'mdi-clipboard-check-multiple'
                    : 'mdi-content-copy'
                  : ''
              "
              @click:append-inner="copyCode()"
              readonly
              hide-details="auto"
            >
            </v-text-field>
            <div class="or">
              <v-divider></v-divider>
              Or
              <v-divider></v-divider>
            </div>

            <v-text-field
              v-model="fullShareUrl"
              label="Copy link"
              :append-inner-icon="
                fullUrlIsSupported
                  ? fullUrlCopied
                    ? 'mdi-clipboard-check-multiple'
                    : 'mdi-content-copy'
                  : ''
              "
              @click:append-inner="copyFullUrl()"
              readonly
              hide-details="auto"
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
import { computed, ref } from "vue";
import { myId } from "@/composables/peer";
import { useClipboard } from "@vueuse/core";
import router from "@/router";
const props = defineProps({ disabled: Boolean });

const remoteId = router.currentRoute.value.query.remoteId as string;

const fullShareUrl = computed(
  () => window.location.origin + "?remoteId=" + myId.value
);

const {
  copy: copyCode,
  copied: codeCopied,
  isSupported: codeIsSupported,
} = useClipboard({ source: myId });

const {
  copy: copyFullUrl,
  copied: fullUrlCopied,
  isSupported: fullUrlIsSupported,
} = useClipboard({ source: fullShareUrl });

const dialog = ref(false);
</script>

<style scoped>
.or {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px;
}
</style>
