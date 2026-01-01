<template>
  <div v-if="selectedWitch && witchData" class="witch-stats">
    <div class="stat-row">
      <span class="stat-label">亲密度</span>
      <div class="stat-track">
        <div class="stat-fill intimacy" :style="{ width: intimacyPercent + '%' }"></div>
      </div>
      <span class="stat-value">{{ witchData.intimacy }}/{{ maxIntimacy }}</span>
    </div>
    
    <div class="stat-row">
      <span class="stat-label">信赖度</span>
      <div class="stat-track">
        <div class="stat-fill trust" :style="{ width: witchData.trust + '%' }"></div>
      </div>
      <span class="stat-value">{{ witchData.trust }}/100</span>
    </div>

    <div class="stat-info">
      <div v-if="witchData.confessionResult !== 'not_confessed'" class="info-item">
        <span class="info-label">告白状态:</span>
        <span class="info-value">{{ confessionLabel }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">亲吻次数:</span>
        <span class="info-value">{{ witchData.kissCount }}次</span>
      </div>
      <div class="info-item">
        <span class="info-label">处女:</span>
        <span class="info-value">{{ witchData.isVirgin ? '是' : '否' }}</span>
      </div>
    </div>
  </div>
  <div v-else class="no-witch-selected">
    请先选择一位魔女
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from '../store';

const props = defineProps<{
  selectedWitch: string | null;
}>();

const store = useDataStore();

const witchData = computed(() => {
  if (!props.selectedWitch) return null;
  return store.data.witchRegistry[props.selectedWitch];
});

const maxIntimacy = computed(() => {
  if (!witchData.value) return 100;
  return witchData.value.confessionResult === 'accepted' ? 200 : 100;
});

const intimacyPercent = computed(() => {
  if (!witchData.value) return 0;
  return (witchData.value.intimacy / maxIntimacy.value) * 100;
});

const confessionLabel = computed(() => {
  if (!witchData.value) return '未知';
  const labels: Record<string, string> = {
    not_confessed: '未告白',
    waiting_response: '等待回应',
    accepted: '已接受',
    rejected: '已拒绝',
    pending: '待定',
  };
  return labels[witchData.value.confessionResult] || witchData.value.confessionResult;
});
</script>

<style lang="scss" scoped>
.witch-stats {
  padding: 14px 16px;
  background: #fff;
  border-bottom: 2px solid var(--c-granite);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-label {
  font-weight: bold;
  font-size: 0.85rem;
  min-width: 140px;
  font-family: var(--font-round);
}

.stat-track {
  flex: 1;
  height: 14px;
  border: 1.5px solid var(--c-granite);
  border-radius: var(--radius-lg);
  background: var(--c-mint-cream);
  position: relative;
  overflow: hidden;
}

.stat-fill {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: var(--radius-lg);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.intimacy {
    background: linear-gradient(90deg, #ff9999, #ff6b6b);
  }
  
  &.trust {
    background: var(--c-celadon);
  }
}

.stat-value {
  font-weight: bold;
  font-size: 0.85rem;
  min-width: 60px;
  text-align: right;
}

.stat-info {
  display: flex;
  gap: 16px;
  padding-top: 8px;
  border-top: 1px dashed var(--c-grey-olive);
  flex-wrap: wrap;
}

.info-item {
  font-size: 0.8rem;
}

.info-label {
  color: var(--c-grey-olive);
  margin-right: 4px;
}

.info-value {
  font-weight: bold;
  color: var(--c-granite);
}

.no-witch-selected {
  padding: 16px;
  text-align: center;
  background: #fff;
  border-bottom: 2px solid var(--c-granite);
  color: var(--c-grey-olive);
  font-style: italic;
  font-size: 0.85rem;
}

@media (max-width: 600px) {
  .stat-label {
    min-width: 100px;
    font-size: 0.75rem;
  }
  
  .stat-info {
    flex-direction: column;
    gap: 4px;
  }
}
</style>