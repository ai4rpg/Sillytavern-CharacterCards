<template>
  <div class="protagonist-panel">
    <div class="section-head">魔女知识</div>
    <div v-if="!_.isEmpty(store.data.protagonist.witchLoreKnowledge)" class="lore-list">
      <div v-for="(knowledge, topic) in store.data.protagonist.witchLoreKnowledge" :key="topic" class="lore-item">
        <span class="lore-topic">【{{ topic }}】</span>
        <span class="lore-content">{{ knowledge }}</span>
      </div>
    </div>
    <div v-else class="empty-state">尚未掌握魔女相关知识</div>

    <div class="section-head">已知魔女</div>
    <div v-if="!_.isEmpty(store.data.protagonist.knownWitches)" class="witch-grid">
      <div v-for="(witch, name) in store.data.protagonist.knownWitches" :key="name" class="witch-card">
        <div class="witch-name">{{ name }}</div>
        <div class="witch-ability">能力: {{ witch.abilityType }}</div>
        <div v-if="witch.discoveredAt" class="witch-discovered">发现于: {{ witch.discoveredAt }}</div>
      </div>
    </div>
    <div v-else class="empty-state">尚未发现任何魔女</div>

    <div class="section-head">当前状态</div>
    <div class="status-box">
      <div class="status-row">
        <span class="status-label">当前身体:</span>
        <span class="status-value">{{ store.data.protagonist.currentBody }}</span>
      </div>
      <div class="status-row">
        <span class="status-label">复制能力来源:</span>
        <span class="status-value">
          {{ store.data.protagonist.currentCopiedAbility.sourceWitch || '无' }}
        </span>
      </div>
      <div class="status-row">
        <span class="status-label">复制的能力:</span>
        <span class="status-value">
          {{ store.data.protagonist.currentCopiedAbility.abilityName || '无' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useDataStore } from '../store';

const store = useDataStore();
</script>

<style lang="scss" scoped>
.protagonist-panel {
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

.lore-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.lore-item {
  border: 1.5px solid var(--c-granite);
  border-radius: var(--radius-md);
  padding: 10px;
  background: #fff;
  font-size: 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.lore-item:hover {
  transform: translateX(2px);
  box-shadow: 3px 3px 10px rgba(60, 73, 63, 0.1);
}

.lore-topic {
  color: var(--c-granite);
  font-weight: bold;
  font-size: 0.82rem;
  font-family: var(--font-round);
}

.lore-content {
  color: var(--c-grey-olive);
  line-height: 1.5;
}

.witch-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.witch-card {
  border: 1.5px solid var(--c-granite);
  border-radius: var(--radius-md);
  padding: 10px;
  background: #fff;
  box-shadow: 3px 3px 8px rgba(60, 73, 63, 0.08);
  display: flex;
  flex-direction: column;
  gap: 5px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.witch-card:hover {
  transform: translateY(-3px);
  box-shadow: 4px 4px 12px rgba(60, 73, 63, 0.15);
}

.witch-name {
  background: var(--c-granite);
  color: var(--c-celadon);
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: bold;
  font-family: var(--font-round);
  margin-bottom: 2px;
}

.witch-ability {
  font-size: 0.8rem;
  color: var(--c-granite);
}

.witch-discovered {
  font-size: 0.75rem;
  color: var(--c-grey-olive);
  font-style: italic;
}

.status-box {
  border: 1.5px solid var(--c-granite);
  border-radius: var(--radius-md);
  padding: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: box-shadow 0.2s ease;
}

.status-box:hover {
  box-shadow: 3px 3px 10px rgba(60, 73, 63, 0.1);
}

.status-row {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
}

.status-label {
  color: var(--c-grey-olive);
  min-width: 130px;
  font-weight: bold;
  font-family: var(--font-round);
}

.status-value {
  color: var(--c-granite);
  font-weight: bold;
}

.empty-state {
  text-align: center;
  color: var(--c-grey-olive);
  padding: 20px;
  font-style: italic;
  font-size: 0.85rem;
  border: 1px dashed var(--c-grey-olive);
  border-radius: var(--radius-md);
  background: var(--c-mint-cream);
}

@media (max-width: 600px) {
  .witch-grid {
    grid-template-columns: 1fr;
  }
}
</style>