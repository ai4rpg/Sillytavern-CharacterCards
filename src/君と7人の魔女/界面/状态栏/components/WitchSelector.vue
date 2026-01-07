<template>
  <div class="witch-carousel">
    <div class="carousel-container">
      <!-- 左箭头 -->
      <button class="arrow-btn arrow-left" @click="previousWitch" :disabled="totalWitches === 0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      <!-- 魔女卡片容器 -->
      <div class="card-wrapper">
        <Transition :name="transitionName" mode="out-in">
          <div v-if="currentWitch" :key="currentWitch.value" class="witch-card" :class="`theme-${currentWitch.value}`">
            <div class="card-glow"></div>
            <div class="card-content">
              <div class="witch-icon">✦</div>
              <h3 class="witch-name">{{ currentWitch.label }}</h3>
              <div class="witch-subtitle">{{ getWitchSubtitle(currentWitch.value) }}</div>
              <div class="card-decoration">
                <span class="deco-line"></span>
                <span class="deco-dot"></span>
                <span class="deco-line"></span>
              </div>
            </div>
          </div>
          <div v-else class="witch-card theme-default">
            <div class="card-content empty">
              <div class="empty-icon">?</div>
              <h3 class="empty-text">未选择魔女</h3>
              <p class="empty-hint">请选择一位魔女</p>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 右箭头 -->
      <button class="arrow-btn arrow-right" @click="nextWitch" :disabled="totalWitches === 0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </div>

    <!-- 指示器点 -->
    <div class="carousel-indicators" v-if="totalWitches > 0">
      <button
        v-for="(witch, index) in availableWitches"
        :key="witch.value"
        class="indicator-dot"
        :class="{ active: index === currentIndex }"
        @click="goToWitch(index)"
        :title="witch.label"
      ></button>
    </div>
  </div>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import type { Schema } from '../../../schema';
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

const WITCH_SUBTITLES: Record<string, string> = {
  UraraShiraishi: '第一の魔女',
  NeneOdagiri: '第二の魔女',
  MeikoOtsuka: '第三の魔女',
  MariaSarushima: '第四の魔女',
  NoaTakigawa: '第五の魔女',
  MikotoAsuka: '第六の魔女',
  RikaSaionji: '第七の魔女',
};

const store = useDataStore();
const selectedWitch = defineModel<string | null>({ required: true });

const availableWitches = computed(() => {
  const data = store.data as unknown as Schema;
  return Object.keys(data.witchRegistry)
    .filter(key => {
      const witch = data.witchRegistry[key as keyof typeof data.witchRegistry];
      return witch !== undefined;
    })
    .map(key => ({
      value: key,
      label: WITCH_NAME_MAP[key] || key,
    }));
});

const totalWitches = computed(() => availableWitches.value.length);

const currentIndex = ref(0);
const transitionName = ref<'slide-left' | 'slide-right'>('slide-right');

// 当前显示的魔女
const currentWitch = computed(() => {
  if (totalWitches.value === 0) return null;
  return availableWitches.value[currentIndex.value];
});

// 获取魔女副标题
function getWitchSubtitle(witchKey: string): string {
  return WITCH_SUBTITLES[witchKey] || '';
}

// 上一个魔女
function previousWitch() {
  if (totalWitches.value === 0) return;
  transitionName.value = 'slide-right';
  currentIndex.value = (currentIndex.value - 1 + totalWitches.value) % totalWitches.value;
  updateSelectedWitch();
}

// 下一个魔女
function nextWitch() {
  if (totalWitches.value === 0) return;
  transitionName.value = 'slide-left';
  currentIndex.value = (currentIndex.value + 1) % totalWitches.value;
  updateSelectedWitch();
}

// 跳转到指定魔女
function goToWitch(index: number) {
  if (index === currentIndex.value) return;
  transitionName.value = index > currentIndex.value ? 'slide-left' : 'slide-right';
  currentIndex.value = index;
  updateSelectedWitch();
}

// 更新选中的魔女
function updateSelectedWitch() {
  if (currentWitch.value) {
    selectedWitch.value = currentWitch.value.value;
  }
}

// 初始化：根据 selectedWitch 设置当前索引
watch(
  () => selectedWitch.value,
  newValue => {
    if (newValue) {
      const index = availableWitches.value.findIndex(w => w.value === newValue);
      if (index !== -1 && index !== currentIndex.value) {
        currentIndex.value = index;
      }
    }
  },
  { immediate: true },
);

// 卡片入场动画
onMounted(() => {
  const card = document.querySelector('.witch-card');
  if (card) {
    gsap.from(card, {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
    });
  }
});
</script>

<style lang="scss" scoped>
.witch-carousel {
  padding: 12px 16px;
  background: transparent;
  border-bottom: 2px dashed var(--c-granite);
}

.carousel-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.arrow-btn {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border: 2px solid var(--c-granite);
  border-radius: 50%;
  background: white;
  color: var(--c-granite);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover:not(:disabled) {
    background: var(--c-celadon);
    border-color: var(--c-celadon);
    color: white;
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.card-wrapper {
  flex: 1;
  position: relative;
  min-height: 180px;
  perspective: 1000px;
}

.witch-card {
  position: relative;
  width: 100%;
  min-height: 180px;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 12px 32px rgba(0, 0, 0, 0.16),
      0 0 0 1px rgba(255, 255, 255, 0.7) inset;
  }
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, var(--c-celadon) 0%, transparent 70%);
  opacity: 0.15;
  animation: rotate-glow 20s linear infinite;
}

@keyframes rotate-glow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.card-content {
  position: relative;
  padding: 32px 24px;
  background: linear-gradient(135deg, var(--c-mint-cream) 0%, rgba(255, 255, 255, 0.9) 100%);
  text-align: center;
  z-index: 1;

  &.empty {
    padding: 40px 24px;
  }
}

.witch-icon {
  font-size: 2.5rem;
  color: var(--c-celadon);
  margin-bottom: 12px;
  animation: pulse-icon 2s ease-in-out infinite;
  text-shadow:
    0 0 20px var(--c-celadon),
    0 0 40px var(--c-celadon);
}

@keyframes pulse-icon {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.witch-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--c-granite);
  font-family: var(--font-round);
  margin-bottom: 8px;
  letter-spacing: 0.02em;
}

.witch-subtitle {
  font-size: 0.85rem;
  color: var(--c-grey-olive);
  font-family: var(--font-archive);
  margin-bottom: 16px;
  font-style: italic;
}

.card-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.deco-line {
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, var(--c-celadon) 50%, transparent 100%);
}

.deco-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-celadon);
  box-shadow: 0 0 10px var(--c-celadon);
}

.empty-icon {
  font-size: 3rem;
  color: var(--c-grey-olive);
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-text {
  font-size: 1.2rem;
  color: var(--c-grey-olive);
  font-family: var(--font-round);
  margin-bottom: 8px;
}

.empty-hint {
  font-size: 0.85rem;
  color: var(--c-grey-olive);
  font-family: var(--font-archive);
  opacity: 0.7;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid var(--c-granite);
  background: transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;

  &:hover {
    transform: scale(1.3);
    border-color: var(--c-celadon);
  }

  &.active {
    background: var(--c-celadon);
    border-color: var(--c-celadon);
    transform: scale(1.2);
    box-shadow: 0 0 8px var(--c-celadon);
  }
}

/* 左滑动画 */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-enter-from {
  transform: translateX(100%) rotateY(-15deg);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-100%) rotateY(15deg);
  opacity: 0;
}

/* 右滑动画 */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-right-enter-from {
  transform: translateX(-100%) rotateY(15deg);
  opacity: 0;
}

.slide-right-leave-to {
  transform: translateX(100%) rotateY(-15deg);
  opacity: 0;
}
</style>
