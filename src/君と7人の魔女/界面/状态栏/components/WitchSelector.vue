<template>
  <div class="witch-selector">
    <label class="selector-label">SELECT WITCH:</label>
    <select v-model="selectedWitch" class="witch-dropdown">
      <option :value="null">-- 选择魔女 --</option>
      <option
        v-for="witch in availableWitches"
        :key="witch.value"
        :value="witch.value"
      >
        {{ witch.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const WITCH_NAME_MAP: Record<string, string> = {
  UraraShiraishi: '白石丽',
  NeneOdagiri: '小田切宁宁',
  MeikoOtsuka: '大冢芽子',
  MariaSarushima: '猿岛玛利亚',
  NoaTakigawa: '泷川诺亚',
  MikotoAsuka: '飞鸟美琴',
  RikaSaionji: '西园寺理香',
};

const store = useDataStore();
const selectedWitch = defineModel<string | null>({ required: true });

const availableWitches = computed(() => {
  return Object.keys(store.data.witchRegistry)
    .filter(key => store.data.witchRegistry[key] !== undefined)
    .map(key => ({
      value: key,
      label: WITCH_NAME_MAP[key] || key,
    }));
});
</script>

<style lang="scss" scoped>
.witch-selector {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 2px dashed var(--c-granite);
}

.selector-label {
  font-weight: bold;
  font-size: 0.85rem;
  color: var(--c-granite);
  font-family: var(--font-round);
}

.witch-dropdown {
  flex: 1;
  padding: 6px 12px;
  border: 1.5px solid var(--c-granite);
  border-radius: var(--radius-md);
  background: var(--c-mint-cream);
  color: var(--c-granite);
  font-family: var(--font-archive);
  font-size: 0.85rem;
  cursor: pointer;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.witch-dropdown:hover {
  border-color: var(--c-celadon);
  background: #fff;
}

.witch-dropdown:focus {
  border-color: var(--c-celadon);
  box-shadow: 0 0 0 3px rgba(162, 227, 196, 0.2);
}
</style>