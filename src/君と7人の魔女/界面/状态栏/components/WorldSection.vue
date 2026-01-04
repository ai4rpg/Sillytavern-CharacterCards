<template>
  <div class="world-section">
    <div class="meta-row">
      <span>DATE: {{ store.data.world.currentDate || '未知' }}</span>
      <span>TIME: {{ store.data.world.currentTime || '未知' }}</span>
      <span>LOC: {{ store.data.world.currentLocation || '未知' }}</span>
    </div>
    <div v-if="!_.isEmpty(store.data.presentCharacters)" class="character-list">
      <div v-for="(char, name) in store.data.presentCharacters" :key="name" class="character-badge">
        <span class="character-name">{{ getDisplayName(name as string) }}</span>
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
import { useDataStore } from '../store';

const store = useDataStore();

function getDisplayName(name: string): string {
  // 如果键名是 protagonist，则替换为玩家名称
  if (name.toLowerCase() === 'protagonist') {
    return SillyTavern.name1 || '{{user}}';
  }

  // 角色名映射表：英文 -> 中文
  const nameMap: Record<string, string> = {
    // 七位魔女
    UraraShiraishi: '白石丽',
    NeneOdagiri: '小田切宁宁',
    MeikoOtsuka: '大冢芽子',
    MariaSarushima: '猿岛玛利亚',
    NoaTakigawa: '泷川诺亚',
    MikotoAsuka: '飞鸟美琴',
    RikaSaionji: '西园寺理香',
    // 其他登场人物
    RinSasaki: '佐佐木凛',
    ToranosukeMiyamura: '宫村虎之介',
    LeonaMiyamura: '宫村礼绪奈',
    MiyabiItou: '伊藤雅',
    HarumaYamazaki: '山崎春马',
  };

  // 尝试精确匹配
  if (nameMap[name]) {
    return nameMap[name];
  }

  // 尝试不区分大小写匹配
  const lowerName = name.toLowerCase();
  const matchedKey = Object.keys(nameMap).find(key => key.toLowerCase() === lowerName);
  if (matchedKey) {
    return nameMap[matchedKey];
  }

  // 如果没有匹配到，返回原名
  return name;
}
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
