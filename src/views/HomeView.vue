<script setup lang="ts">
import { useHomeStore } from '@/stores/home';

const homeStore = useHomeStore();
</script>

<template>
  <v-container fluid>
    <v-row dense align="center">
      <v-col cols="auto">Hello {{ homeStore.username }}</v-col>
      <v-col cols="auto"><v-btn color="primary" rounded @click="homeStore.changeUsername">변경</v-btn></v-col>
    </v-row>
  </v-container>
</template>
