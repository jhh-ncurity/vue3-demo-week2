<script setup lang="ts">
import { onMounted, ref } from 'vue';

type Ip = {
  id: number;
  address: string;
  type: string;
  active: boolean;
  created: string;
}

const ips = ref<Ip[]>([]);
const isLoading = ref(true);

async function getIps() {
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1200));
  ips.value = await fetch("http://192.168.71.210/api/ip").then(res => res.json());
  isLoading.value = false;
}

onMounted(async () => {
  await getIps();
});

const headers = [
  { title: "#", value: "id" },
  { title: "주소", value: "address" },
  { title: "타입", value: "type" },
  { title: "상태", value: "active" },
  { title: "생성시각", value: "created" },
  { title: "Actions", value: "actions" },
]

const current = ref<number | null>(null);
const isDelDlgOpen = ref(false);

function openDelDlg(itemId: number) {
  current.value = itemId;
  isDelDlgOpen.value = true;
}

async function delIpAndClose(itemId: number) {
  await fetch(`http://192.168.71.210/api/ip/${itemId}`, { method: "DELETE" });
  isDelDlgOpen.value = false;
  await getIps();
}

const isAddDlgOpen = ref(false);
const isValid = ref<boolean | null>(null);
const newIp = ref("");

function isIPv4(value: string) {
  const ipv4regex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/
  if (!ipv4regex.test(value)) {
    return "IPv4만 입력 가능합니다"
  }
  return true;
}

async function addIpAndCloseDlg() {
  await fetch("http://192.168.71.210/api/ip", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: newIp.value.trim(),
      type: "IPv4",
      active: true,
      created: new Date().toISOString(),
    })
  })
  isAddDlgOpen.value = false;
  await getIps();
}
</script>

<template>
  <v-container fluid>
    <v-row dense align="center">
      <v-col cols="auto">
        <v-icon icon="mdi-ip" start />
      </v-col>
      <v-col cols="auto">
        접근 제어
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn prepend-icon="mdi-plus" color="primary" variant="flat" rounded @click="isAddDlgOpen = true">추가하기</v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col cols="12">
        <v-card density="compact" variant="outlined">
          <v-data-table density="compact" :items="ips" :loading="isLoading" :headers="headers">
            <template v-slot:item.active="{ value }">
              <span class="d-flex align-center">
                <v-icon start icon="mdi-circle" size="x-small" :color="value ? 'green' : 'red'" />
                {{ value ? '활성' : '비활성' }}
              </span>
            </template>
            <template v-slot:item.created="{ value }">
              {{ new Date(value).toLocaleString() }}
            </template>
            <template v-slot:item.actions="{ value, item }">
              <v-btn icon="mdi-delete" density="compact" variant="text" color="error" @click="openDelDlg(item.id)" />
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="isDelDlgOpen" max-width="500px">
      <v-card prepend-icon="mdi-alert">
        <template v-slot:title>
          IP 삭제
        </template>
        <v-card-text>
          {{ current }}번 아이피({{ ips.filter(ip => ip.id === current)[0].address }})을 삭제하시겠습니까?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" prepend-icon="mdi-close" @click="isDelDlgOpen = false">취소</v-btn>
          <v-btn variant="flat" prepend-icon="mdi-delete" color="error" @click="delIpAndClose(current!)">삭제</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isAddDlgOpen" max-width="500px">
      <v-card prepend-icon="mdi-ip">
        <template v-slot:title>
          IP 추가등록
        </template>
        <v-card-text>
          <v-form v-model="isValid">
            <v-text-field v-model="newIp" label="IPv4" variant="outlined" density="compact" :rules="[isIPv4]" />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" prepend-icon="mdi-close" @click="isAddDlgOpen = false">취소</v-btn>
          <v-btn variant="flat" prepend-icon="mdi-plus" color="primary" :disabled="!isValid"
            @click="addIpAndCloseDlg()">추가</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
