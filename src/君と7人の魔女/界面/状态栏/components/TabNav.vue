<template>
  <nav class="tabs">
    <button
      v-for="tab in props.tabs"
      :key="tab.id"
      class="tab-button"
      :class="{ active: model === tab.id }"
      :aria-expanded="model === tab.id"
      @click="toggleTab(tab.id)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{
  tabs: { id: string; label: string }[];
}>();

const model = defineModel<string | null>({ required: true });

function toggleTab(id: string) {
  model.value = model.value === id ? null : id;
}
</script>

<style lang="scss" scoped>
.tabs {
  display: flex;
  background-color: transparent;
  margin: 0;
  padding: 0;
  gap: 8px;
}

.tab-button {
  flex: 1;
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: var(--c-grey-olive);
  font-size: 0.92rem;
  font-weight: bold;
  font-family: var(--font-round);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  position: relative;
}

.tab-button:hover {
  background-color: rgba(60, 73, 63, 0.05);
  opacity: 1;
}

.tab-button.active {
  background-color: transparent;
  color: var(--c-granite);
  opacity: 1;
  font-weight: 900;
}

.tab-button.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
  height: 3px;
  background: var(--c-celadon);
  border-radius: 0 0 var(--radius-sm) var(--radius-sm);
}
</style>
