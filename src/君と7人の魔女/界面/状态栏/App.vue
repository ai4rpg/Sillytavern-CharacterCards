<template>
  <div class="card" :class="`theme-${selectedWitch || 'default'}`">
    <WorldSection />

    <WitchSelector v-model="selectedWitch" />

    <WitchStats :selected-witch="selectedWitch" />

    <TabNav v-model="active_tab" :tabs="tabs" />

    <div v-if="active_tab" class="content-area">
      <div v-if="active_tab === 'witch'" class="tab-pane active">
        <WitchPanel :selected-witch="selectedWitch" />
      </div>
      <div v-else-if="active_tab === 'protagonist'" class="tab-pane active">
        <ProtagonistPanel />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import WitchSelector from './components/WitchSelector.vue';
import WitchStats from './components/WitchStats.vue';
import WitchPanel from './components/WitchPanel.vue';
import ProtagonistPanel from './components/ProtagonistPanel.vue';
import TabNav from './components/TabNav.vue';
import WorldSection from './components/WorldSection.vue';

const tabs = [
  { id: 'witch', label: '魔女详情' },
  { id: 'protagonist', label: '主角信息' },
];

const selectedWitch = useLocalStorage<string | null>('status_bar:selected_witch', null);
const active_tab = useLocalStorage<string | null>('status_bar:active_tab', null);
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  max-width: 720px;
  background-color: var(--c-mint-cream);
  border: 3px solid var(--c-granite);
  border-radius: var(--radius-xl);
  box-shadow: 8px 8px 24px rgba(60, 73, 63, 0.12);
  display: flex;
  flex-direction: column;
  font-family: var(--font-archive);
  color: var(--c-granite);
  font-size: 13px;
  line-height: 1.35;
  margin: 0 auto;
  overflow: hidden;
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 10px 10px 30px rgba(60, 73, 63, 0.16);
  }
}

.content-area {
  padding: 16px;
  min-height: 0;
}

.tab-pane {
  display: none;
  animation: fadeEffect 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-pane.active {
  display: block;
}

@keyframes fadeEffect {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
