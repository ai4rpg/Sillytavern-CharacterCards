<template>
  <div v-if="selectedWitch && witchData" class="witch-stats">
    <div class="stat-row">
      <span class="stat-label">亲密度</span>
      <div class="stat-track">
        <div class="stat-fill intimacy" :style="{ width: intimacyPercent + '%' }"></div>
      </div>
      <div
        class="stat-value-group"
        :class="{ unlocked: intimacyUnlocked[selectedWitch] }"
        @click="intimacyUnlocked[selectedWitch] = true"
      >
        <button
          class="stat-button minus"
          :disabled="!intimacyUnlocked[selectedWitch] || witchData.intimacy <= 0"
          type="button"
          @click.stop="adjustIntimacy(-1)"
        >
          -
        </button>
        <span class="stat-value">{{ witchData.intimacy }}/{{ maxIntimacy }}</span>
        <button
          class="stat-button plus"
          :disabled="!intimacyUnlocked[selectedWitch] || witchData.intimacy >= maxIntimacy"
          type="button"
          @click.stop="adjustIntimacy(1)"
        >
          +
        </button>
      </div>
    </div>

    <div class="stat-row">
      <span class="stat-label">信赖度</span>
      <div class="stat-track">
        <div class="stat-fill trust" :style="{ width: witchData.trust + '%' }"></div>
      </div>
      <div
        class="stat-value-group"
        :class="{ unlocked: trustUnlocked[selectedWitch] }"
        @click="trustUnlocked[selectedWitch] = true"
      >
        <button
          class="stat-button minus"
          :disabled="!trustUnlocked[selectedWitch] || witchData.trust <= 0"
          type="button"
          @click.stop="adjustTrust(-1)"
        >
          -
        </button>
        <span class="stat-value">{{ witchData.trust }}/100</span>
        <button
          class="stat-button plus"
          :disabled="!trustUnlocked[selectedWitch] || witchData.trust >= 100"
          type="button"
          @click.stop="adjustTrust(1)"
        >
          +
        </button>
      </div>
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
      <div
        class="info-item virgin-item"
        :class="{ unlocked: virginUnlocked[selectedWitch] }"
        @click="virginUnlocked[selectedWitch] = true"
      >
        <span class="info-label">处女:</span>
        <span class="info-value">{{ witchData.isVirgin ? '是' : '否' }}</span>
      </div>
    </div>
  </div>
  <div v-else class="no-witch-selected">请先选择一位魔女</div>
</template>

<script setup lang="ts">
import type { Schema } from '../../../schema';
import { useDataStore } from '../store';

const props = defineProps<{
  selectedWitch: string | null;
}>();

const store = useDataStore();

const intimacyUnlocked = ref<Record<string, boolean>>({});
const trustUnlocked = ref<Record<string, boolean>>({});
const virginUnlocked = ref<Record<string, boolean>>({});

const witchData = computed(() => {
  if (!props.selectedWitch) return null;
  const data = store.data as unknown as Schema;
  return data.witchRegistry[props.selectedWitch as keyof typeof data.witchRegistry];
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

function adjustIntimacy(delta: number) {
  if (!props.selectedWitch || !witchData.value) return;
  const data = store.data as unknown as Schema;
  const witch = data.witchRegistry[props.selectedWitch as keyof typeof data.witchRegistry];
  if (!witch) return;
  witch.intimacy = _.clamp(witch.intimacy + delta, 0, maxIntimacy.value);
}

function adjustTrust(delta: number) {
  if (!props.selectedWitch || !witchData.value) return;
  const data = store.data as unknown as Schema;
  const witch = data.witchRegistry[props.selectedWitch as keyof typeof data.witchRegistry];
  if (!witch) return;
  witch.trust = _.clamp(witch.trust + delta, 0, 100);
}
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
  gap: 8px;
}

.stat-label {
  font-weight: bold;
  font-size: 0.85rem;
  min-width: 64px;
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

.stat-value-group {
  display: flex;
  align-items: center;
  gap: 6px;
  filter: blur(4px);
  transition: filter 0.3s ease;
  cursor: pointer;
  user-select: none;
}

.stat-value-group.unlocked {
  filter: blur(0);
  cursor: default;
}

.stat-value {
  font-weight: bold;
  font-size: 0.85rem;
  min-width: 60px;
  text-align: center;
}

.stat-button {
  width: 24px;
  height: 22px;
  padding: 0;
  border: 1.5px solid var(--c-granite);
  background: var(--c-mint-cream);
  color: var(--c-granite);
  font-family: inherit;
  font-weight: bold;
  line-height: 1;
  cursor: pointer;
  box-shadow: 2px 2px 0px rgba(60, 73, 63, 0.16);
  transition: all 0.15s ease;
  pointer-events: none;
}

.stat-value-group.unlocked .stat-button {
  pointer-events: auto;
}

.stat-button:active:not(:disabled) {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0px rgba(60, 73, 63, 0.16);
}

.stat-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.stat-button:focus-visible {
  outline: 2px dashed var(--c-granite);
  outline-offset: 2px;
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

.virgin-item {
  filter: blur(4px);
  transition: filter 0.3s ease;
  cursor: pointer;
  user-select: none;
}

.virgin-item.unlocked {
  filter: blur(0);
  cursor: default;
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
