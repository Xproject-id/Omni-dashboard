<template>
  <div class="stat-card" :class="[`stat-card--${variant}`]">
    <div class="stat-card-inner">
      <div class="stat-header">
        <div class="stat-icon-wrap" :style="{ background: iconBg, color: iconColor }">
          <slot name="icon" />
        </div>
        <span v-if="change !== undefined" class="stat-change" :class="change >= 0 ? 'positive' : 'negative'">
          <svg v-if="change >= 0" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
          <svg v-else width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
          {{ Math.abs(change) }}%
        </span>
      </div>
      <div class="stat-body">
        <div class="stat-label">{{ label }}</div>
        <div class="stat-value">{{ formattedValue }}</div>
      </div>
      <div v-if="subtext" class="stat-subtext">{{ subtext }}</div>
    </div>
    <div class="stat-decoration"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  label: string
  value: number | string
  prefix?: string
  suffix?: string
  change?: number
  subtext?: string
  iconBg?: string
  iconColor?: string
  variant?: 'blue' | 'green' | 'orange' | 'red' | 'default'
  format?: 'currency' | 'number' | 'plain'
}>()

const formattedValue = computed(() => {
  const prefix = props.prefix ?? ''
  const suffix = props.suffix ?? ''
  const fmt = props.format ?? 'plain'
  const val = props.value

  if (typeof val === 'string') return `${prefix}${val}${suffix}`

  if (fmt === 'currency') {
    return `${prefix}${new Intl.NumberFormat('id-ID').format(val)}${suffix}`
  }
  if (fmt === 'number') {
    return `${prefix}${new Intl.NumberFormat('id-ID').format(val)}${suffix}`
  }
  return `${prefix}${val}${suffix}`
})
</script>

<style scoped>
.stat-card {
  position: relative;
  background: var(--color-white);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  box-shadow: var(--shadow-card);
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.stat-card-inner {
  padding: 22px 22px 18px;
  position: relative;
  z-index: 1;
}

.stat-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stat-icon-wrap {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.stat-value {
  font-size: 26px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.1;
  letter-spacing: -0.5px;
  animation: countUp 0.5s ease;
}

.stat-subtext {
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.stat-change {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
}

.stat-change.positive {
  background: var(--color-success-bg);
  color: var(--color-success);
}
.stat-change.negative {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

/* === Decorative blob === */
.stat-decoration {
  position: absolute;
  bottom: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.05;
  background: var(--color-primary);
  z-index: 0;
  transition: transform var(--transition-slow);
}

.stat-card:hover .stat-decoration {
  transform: scale(1.2);
}

/* === Variant Decorations === */
.stat-card--blue .stat-decoration { background: var(--color-primary); opacity: 0.07; }
.stat-card--green .stat-decoration { background: var(--color-success); opacity: 0.07; }
.stat-card--orange .stat-decoration { background: var(--color-warning); opacity: 0.07; }
.stat-card--red .stat-decoration { background: var(--color-danger); opacity: 0.07; }
</style>
