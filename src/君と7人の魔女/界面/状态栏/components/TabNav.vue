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
  background-color: var(--c-grey-olive);
  border-bottom: 3px solid var(--c-granite);
}

.tab-button {
  flex: 1;
  padding: 10px 12px;
  border: none;
  background: transparent;
  color: var(--c-mint-cream);
  font-size: 0.92rem;
  font-weight: bold;
  font-family: var(--font-round);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-transform: uppercase;
  border-right: 1.5px solid var(--c-granite);
  position: relative;
}

.tab-button:last-child {
  border-right: none;
}

.tab-button:hover {
  background-color: var(--c-ash-grey);
  color: var(--c-granite);
  transform: translateY(-2px);
}

.tab-button.active {
  background-color: var(--c-mint-cream);
  color: var(--c-granite);
  transform: translateY(2px);
  padding-bottom: 12px;
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
