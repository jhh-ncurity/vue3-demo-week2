<script setup lang="ts">
import { ref } from 'vue';
import { RouterView } from 'vue-router'

const drawer = ref(true);

const handleDotBtn = () => {
  window.alert("이 버튼은 아무 기능이 없어도 됩니다. (이 얼럿도 안 띄워도 됨)");
}
</script>

<template>
  <v-app>
    <v-app-bar color="primary" elevation="0">
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" density="comfortable"></v-app-bar-nav-icon>
      <v-toolbar-title>Ncurion IDS</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn variant="text" icon="mdi-dots-vertical" density="comfortable" @click="handleDotBtn"></v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer">
      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-home" title="홈" :to="{ name: 'home' }" />
        <v-list-item prepend-icon="mdi-ip" title="접근 제어" :to="{ name: 'ip' }" />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
