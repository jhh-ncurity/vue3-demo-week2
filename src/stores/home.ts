import { defineStore } from 'pinia'

export const useHomeStore = defineStore('home', {
  state: () => ({
    username: "Vue3!"
  }),
  actions: {
    changeUsername() {
      this.username = "Vuetify3!";
    }
  }
})
