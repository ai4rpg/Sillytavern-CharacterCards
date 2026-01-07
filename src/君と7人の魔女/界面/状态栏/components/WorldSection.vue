<template>
  <div class="world-section">
    <div class="meta-row">
      <span>DATE: {{ data.world.currentDate || '未知' }}</span>
      <span>TIME: {{ data.world.currentTime || '未知' }}</span>
      <span>LOC: {{ data.world.currentLocation || '未知' }}</span>
    </div>
    <div v-if="!_.isEmpty(data.presentCharacters)" class="character-list">
      <div v-for="(char, id) in data.presentCharacters" :key="id" class="character-badge">
        <span class="character-name">{{ char.name }}</span>
        <span class="character-outfit">{{ char.outfit }}</span>
        <span class="character-state">{{ char.state }}</span>
        <span v-if="char.thought" class="character-thought">"{{ char.thought }}"</span>
      </div>
    </div>
    <div v-else class="empty-state">当前场景无角色</div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import type { Schema } from '../../../schema';
import { useDataStore } from '../store';

const store = useDataStore();
const data = computed(() => store.data as unknown as Schema);
</script>

<style lang="scss" scoped>
.world-section {
  border-bottom: 3px solid var(--c-granite);
  padding: 14px 16px;
  background-color: var(--c-mint-cream);
}

.meta-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
  font-size: 0.9rem;
  font-family: var(--font-round);
  border-bottom: 1.5px dashed var(--c-grey-olive);
  padding-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.character-list {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.character-badge {
  background: #fff;
  border: 1.5px solid var(--c-granite);
  border-radius: var(--radius-md);
  padding: 8px 10px;
  min-width: 150px;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.character-badge:hover {
  transform: translateY(-2px);
  box-shadow: 3px 3px 8px rgba(60, 73, 63, 0.15);
}

.character-badge::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--c-celadon);
  border-radius: var(--radius-md) 0 0 var(--radius-md);
}

.character-name {
  display: block;
  font-weight: bold;
  margin-bottom: 2px;
  padding-left: 8px;
  font-size: 0.85rem;
  font-family: var(--font-round);
}

.character-outfit {
  display: block;
  font-size: 0.75rem;
  color: var(--c-granite);
  padding-left: 8px;
}

.character-state {
  display: block;
  font-size: 0.75rem;
  color: var(--c-grey-olive);
  padding-left: 8px;
}

.character-thought {
  display: block;
  font-size: 0.7rem;
  color: var(--c-grey-olive);
  font-style: italic;
  padding-left: 8px;
  margin-top: 2px;
}

.empty-state {
  text-align: center;
  color: var(--c-grey-olive);
  padding: 12px;
  font-style: italic;
  font-size: 0.85rem;
}

@media (max-width: 600px) {
  .meta-row {
    flex-direction: column;
    gap: 5px;
  }

  .character-list {
    flex-direction: column;
  }

  .character-badge {
    min-width: auto;
  }
}
</style>
