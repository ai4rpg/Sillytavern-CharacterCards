<template>
  <div v-if="selectedWitch && witchData" class="witch-panel">
    <div class="section-head">能力状态</div>
    <div class="ability-box">
      <div class="ability-row">
        <span class="ability-label">能力名称:</span>
        <span class="ability-value">{{ witchData.abilityStatus.abilityName || '未知' }}</span>
      </div>
      <div class="ability-row">
        <span class="ability-label">激活状态:</span>
        <span class="ability-value" :class="{ active: witchData.abilityStatus.isActive }">
          {{ witchData.abilityStatus.isActive ? '✓ 已激活' : '✗ 未激活' }}
        </span>
      </div>
      <div v-if="witchData.abilityStatus.controlledState.swappedWith" class="ability-row">
        <span class="ability-label">交换对象:</span>
        <span class="ability-value">{{ witchData.abilityStatus.controlledState.swappedWith }}</span>
      </div>
      <div v-if="witchData.abilityStatus.controlledState.memoryLoss" class="ability-row">
        <span class="ability-label">记忆丧失:</span>
        <span class="ability-value">{{ witchData.abilityStatus.controlledState.memoryLoss }}</span>
      </div>
    </div>

    <div class="section-head">重要记忆</div>
    <div v-if="!_.isEmpty(witchData.importantMemory)" class="memory-list">
      <div v-for="(memory, eventName) in witchData.importantMemory" :key="eventName" class="memory-item">
        <div class="memory-header">
          <span class="memory-event">{{ eventName }}</span>
        </div>
        <div v-if="typeof memory === 'string'" class="memory-desc">
          {{ memory }}
        </div>
        <div v-else class="memory-details">
          <div class="memory-desc">{{ memory.description }}</div>
          <div v-if="memory.when || memory.where" class="memory-meta">
            <span v-if="memory.when" class="meta-item">📅 {{ memory.when }}</span>
            <span v-if="memory.where" class="meta-item">📍 {{ memory.where }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">暂无重要记忆</div>
  </div>
  <div v-else class="no-witch-selected">请先选择一位魔女查看详情</div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const props = defineProps<{
  selectedWitch: string | null;
}>();

const store = useDataStore();

const witchData = computed(() => {
  if (!props.selectedWitch) return null;
  return store.data.witchRegistry[props.selectedWitch];
});
</script>

<style lang="scss" scoped>
.witch-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-head {
  font-size: 1rem;
  font-family: var(--font-round);
  color: var(--c-granite);
  border-bottom: 3px solid var(--c-celadon);
  border-radius: var(--radius-sm);
  display: inline-block;
  margin-bottom: 10px;
  padding: 4px 8px;
  font-weight: bold;
  background: linear-gradient(to right, var(--c-celadon), transparent);
  background-size: 100% 3px;
  background-position: bottom;
  background-repeat: no-repeat;
}

.ability-box {
  border: 1.5px solid var(--c-granite);
  border-radius: var(--radius-md);
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: box-shadow 0.2s ease;
}

.ability-box:hover {
  box-shadow: 3px 3px 10px rgba(60, 73, 63, 0.1);
}

.ability-row {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
}

.ability-label {
  color: var(--c-grey-olive);
  min-width: 90px;
  font-weight: bold;
  font-family: var(--font-round);
}

.ability-value {
  color: var(--c-granite);

  &.active {
    color: #2ecc71;
    font-weight: bold;
  }
}

.memory-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.memory-item {
  border: 1.5px solid var(--c-granite);
  border-radius: var(--radius-md);
  padding: 10px;
  background: #fff;
  box-shadow: 3px 3px 8px rgba(60, 73, 63, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.memory-item:hover {
  transform: translateX(2px);
  box-shadow: 4px 4px 12px rgba(60, 73, 63, 0.12);
}

.memory-header {
  margin-bottom: 8px;
}

.memory-event {
  background: var(--c-granite);
  color: var(--c-celadon);
  display: inline-block;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: bold;
  font-family: var(--font-round);
}

.memory-desc {
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 4px;
}

.memory-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.memory-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 0.75rem;
  color: var(--c-grey-olive);
  background: var(--c-mint-cream);
  padding: 3px 8px;
  border: 1px solid var(--c-grey-olive);
  border-radius: var(--radius-sm);
}

.empty-state,
.no-witch-selected {
  text-align: center;
  color: var(--c-grey-olive);
  padding: 20px;
  font-style: italic;
  font-size: 0.85rem;
}
</style>
