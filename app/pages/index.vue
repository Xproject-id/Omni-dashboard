<template>
  <div class="dashboard-page">

    <!-- KPI Stats Row -->
    <div class="grid grid-cols-4" style="margin-bottom: 24px;">
      <StatCard
        label="Total Pendapatan"
        :value="totalRevenue"
        prefix="Rp "
        format="currency"
        :change="12"
        subtext="Semua platform"
        icon-bg="#EFF6FF"
        icon-color="#2563EB"
        variant="blue"
      >
        <template #icon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </template>
      </StatCard>

      <StatCard
        label="Total Terjual"
        :value="totalSold"
        suffix=" pcs"
        format="number"
        :change="8"
        subtext="Semua platform"
        icon-bg="#ECFDF5"
        icon-color="#10B981"
        variant="green"
      >
        <template #icon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
          </svg>
        </template>
      </StatCard>

      <StatCard
        label="Jumlah Produk"
        :value="totalProducts"
        suffix=" produk"
        format="number"
        subtext="Di semua kategori"
        icon-bg="#FFFBEB"
        icon-color="#F59E0B"
        variant="orange"
      >
        <template #icon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </template>
      </StatCard>

      <StatCard
        label="Stok Menipis"
        :value="lowStockCount"
        suffix=" produk"
        format="number"
        :change="-3"
        subtext="Stok di bawah 10"
        icon-bg="#FEF2F2"
        icon-color="#EF4444"
        variant="red"
      >
        <template #icon>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </template>
      </StatCard>
    </div>

    <!-- ═══════════════════════════════════════════════
         PLATFORM COMPARISON SECTION
    ═══════════════════════════════════════════════ -->
    <div class="section-label-row" style="margin-bottom: 16px;">
      <h2 class="section-label">Perbandingan Platform</h2>
      <p class="section-desc">Analisis penjualan dari setiap marketplace</p>
    </div>

    <!-- Platform KPI Cards -->
    <div class="platform-kpi-row" style="margin-bottom: 20px;">
      <div
        v-for="pl in platformStats"
        :key="pl.name"
        class="platform-kpi-card"
        :style="{ '--pl-color': pl.color, '--pl-color-light': pl.color + '18' }"
      >
        <div class="platform-kpi-header">
          <div class="platform-kpi-icon" :style="{ background: pl.color + '15', border: '1.5px solid ' + pl.color + '30' }">
            <span class="platform-dot" :style="{ background: pl.color }"></span>
          </div>
          <span class="platform-kpi-name">{{ pl.name }}</span>
          <span class="platform-rank" :style="{ background: pl.color + '15', color: pl.color }">#{{ pl.rank }}</span>
        </div>
        <div class="platform-kpi-revenue">Rp {{ formatNum(pl.revenue) }}</div>
        <div class="platform-kpi-meta">
          <span>{{ pl.transactions }} transaksi</span>
          <span class="platform-kpi-sep">·</span>
          <span>{{ pl.qty }} pcs</span>
        </div>
        <div class="platform-kpi-bar-wrap">
          <div class="platform-kpi-bar-track">
            <div
              class="platform-kpi-bar-fill"
              :style="{ width: pl.percentage + '%', background: pl.color }"
            ></div>
          </div>
          <span class="platform-kpi-pct" :style="{ color: pl.color }">{{ pl.percentage }}%</span>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-row" style="margin-bottom: 24px;">

      <!-- Doughnut Chart — Platform Revenue Share -->
      <div class="card chart-donut-card">
        <div class="card-title-row">
          <div>
            <h2 class="card-title" style="margin-bottom: 2px;">Distribusi Pendapatan</h2>
            <p class="text-sm text-muted">Porsi revenue tiap platform</p>
          </div>
        </div>
        <div v-if="loadingChart" class="skeleton" style="height: 220px; border-radius: 12px; margin-top: 16px;"></div>
        <div v-else class="donut-chart-wrap">
          <div class="donut-canvas-wrap">
            <Doughnut :data="donutChartData" :options="donutChartOptions" />
            <div class="donut-center-label">
              <p class="donut-center-val">Rp {{ formatShort(totalRevenue) }}</p>
              <p class="donut-center-sub">Total</p>
            </div>
          </div>
          <div class="donut-legend">
            <div v-for="pl in platformStats" :key="pl.name" class="donut-legend-item">
              <span class="donut-legend-dot" :style="{ background: pl.color }"></span>
              <div class="donut-legend-info">
                <p class="donut-legend-name">{{ pl.name }}</p>
                <p class="donut-legend-val">Rp {{ formatNum(pl.revenue) }}</p>
              </div>
              <span class="donut-legend-pct" :style="{ color: pl.color }">{{ pl.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bar Chart — Revenue per Platform per Day -->
      <div class="card chart-bar-card">
        <div class="card-title-row">
          <div>
            <h2 class="card-title" style="margin-bottom: 2px;">Tren Penjualan Harian</h2>
            <p class="text-sm text-muted">Pendapatan 7 hari terakhir per platform</p>
          </div>
          <div class="chart-legend">
            <span v-for="pl in platforms" :key="pl.name" class="legend-item">
              <span class="platform-dot" :style="{ background: pl.color }"></span>
              {{ pl.name }}
            </span>
          </div>
        </div>
        <div v-if="loadingChart" class="skeleton" style="height: 230px; border-radius: 12px; margin-top: 16px;"></div>
        <div v-else class="bar-chart-wrap">
          <Bar :data="barChartData" :options="barChartOptions" />
        </div>
      </div>

      <!-- Horizontal Bar — Units Sold per Platform -->
      <div class="card chart-units-card">
        <div class="card-title-row">
          <div>
            <h2 class="card-title" style="margin-bottom: 2px;">Unit Terjual</h2>
            <p class="text-sm text-muted">Jumlah item per platform</p>
          </div>
        </div>
        <div v-if="loadingChart" class="skeleton" style="height: 180px; border-radius: 12px; margin-top: 16px;"></div>
        <div v-else class="units-chart-body">
          <div v-for="pl in platformStats" :key="pl.name" class="units-row">
            <div class="units-row-label">
              <span class="platform-dot" :style="{ background: pl.color }"></span>
              <span class="text-sm font-medium">{{ pl.name }}</span>
            </div>
            <div class="units-row-bar-wrap">
              <div class="units-bar-track">
                <div
                  class="units-bar-fill"
                  :style="{
                    width: pl.qty > 0 ? (pl.qty / maxQty * 100) + '%' : '4px',
                    background: pl.color
                  }"
                ></div>
              </div>
              <span class="units-row-val font-semibold" :style="{ color: pl.color }">{{ pl.qty.toLocaleString('id-ID') }}</span>
            </div>
          </div>

          <!-- Highlight Card -->
          <div class="top-platform-highlight" v-if="topPlatform" :style="{ background: topPlatform.color + '10', border: '1px solid ' + topPlatform.color + '30' }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" :style="{ color: topPlatform.color }">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <div>
              <p class="text-sm font-semibold" :style="{ color: topPlatform.color }">{{ topPlatform.name }} — Platform Terlaris</p>
              <p class="text-xs text-muted">{{ topPlatform.qty }} unit · Rp {{ formatNum(topPlatform.revenue) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════
         BOTTOM ROW
    ═══════════════════════════════════════════════ -->
    <div class="dashboard-grid-bottom">
      <!-- Recent Sales -->
      <div class="card">
        <div class="flex items-center justify-between" style="margin-bottom: 16px;">
          <h2 class="card-title" style="margin-bottom: 0;">Penjualan Terbaru</h2>
          <NuxtLink to="/sales" class="btn btn-secondary btn-sm">Lihat Semua</NuxtLink>
        </div>
        <div v-if="loadingTable" class="flex flex-col gap-3">
          <div v-for="i in 5" :key="i" class="skeleton" style="height: 48px; border-radius: 8px;"></div>
        </div>
        <div v-else-if="recentSales.length === 0" class="empty-state">
          <div class="empty-state-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <p class="text-sm text-muted">Belum ada data penjualan</p>
        </div>
        <div v-else class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Platform</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sale in recentSales" :key="sale.id">
                <td>
                  <span class="font-medium" style="color: var(--color-text-primary);">{{ sale.products?.name ?? '-' }}</span>
                  <br><span class="text-xs text-muted">{{ sale.products?.sku ?? '' }}</span>
                </td>
                <td>
                  <span class="badge" :style="getPlatformStyle(sale.platforms?.name)">
                    {{ sale.platforms?.name ?? '-' }}
                  </span>
                </td>
                <td class="font-medium">{{ sale.quantity }}</td>
                <td class="font-semibold" style="color: var(--color-primary);">Rp {{ formatNum(sale.total_price) }}</td>
                <td class="text-muted text-sm">{{ formatDate(sale.sale_date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Low Stock Alert -->
      <div class="card">
        <div class="flex items-center justify-between" style="margin-bottom: 16px;">
          <h2 class="card-title" style="margin-bottom: 0;">Peringatan Stok</h2>
          <NuxtLink to="/inventory" class="btn btn-secondary btn-sm">Kelola Stok</NuxtLink>
        </div>
        <div v-if="loadingTable" class="flex flex-col gap-3">
          <div v-for="i in 4" :key="i" class="skeleton" style="height: 56px; border-radius: 8px;"></div>
        </div>
        <div v-else-if="lowStockProducts.length === 0" class="empty-state">
          <div class="empty-state-icon" style="background: var(--color-success-bg); color: var(--color-success);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p class="text-sm" style="color: var(--color-success); font-weight: 500;">Semua stok aman!</p>
        </div>
        <div v-else class="low-stock-list">
          <div v-for="product in lowStockProducts" :key="product.id" class="low-stock-item">
            <div class="low-stock-info">
              <p class="font-medium text-sm" style="color: var(--color-text-primary);">{{ product.name }}</p>
              <p class="text-xs text-muted">{{ product.sku }}</p>
            </div>
            <span class="badge" :class="product.stock === 0 ? 'badge-danger' : 'badge-warning'">
              {{ product.stock === 0 ? 'Habis' : `${product.stock} pcs` }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Bar, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

useHead({ title: 'Dashboard | Omni Dashboard' })

const supabase = useSupabaseClient()

// ── State ──────────────────────────────────────────────
const loadingChart = ref(true)
const loadingTable = ref(true)
const recentSales = ref<any[]>([])
const allProducts = ref<any[]>([])
const allSales = ref<any[]>([])

// ── Platforms Config ───────────────────────────────────
const platforms = [
  { name: 'Tokopedia', color: '#42B549' },
  { name: 'Shopee', color: '#EE4D2D' },
  { name: 'TikTok Shop', color: '#1D1D1D' },
]

// ── Computed KPIs ──────────────────────────────────────
const totalRevenue = computed(() =>
  allSales.value.reduce((s, x) => s + Number(x.total_price), 0)
)
const totalSold = computed(() =>
  allSales.value.reduce((s, x) => s + Number(x.quantity), 0)
)
const totalProducts = computed(() => allProducts.value.length)
const lowStockCount = computed(() => allProducts.value.filter(p => p.stock < 10).length)
const lowStockProducts = computed(() => allProducts.value.filter(p => p.stock < 10).slice(0, 6))

// ── Platform Stats ─────────────────────────────────────
const platformStats = computed(() => {
  const totalRev = totalRevenue.value || 1
  const stats = platforms.map(pl => {
    const sales = allSales.value.filter(s => s.platforms?.name === pl.name)
    const revenue = sales.reduce((s, x) => s + Number(x.total_price), 0)
    const qty = sales.reduce((s, x) => s + Number(x.quantity), 0)
    return {
      name: pl.name,
      color: pl.color,
      revenue,
      transactions: sales.length,
      qty,
      percentage: Math.round((revenue / totalRev) * 100),
      rank: 0,
    }
  })
  // Assign rank by revenue
  const sorted = [...stats].sort((a, b) => b.revenue - a.revenue)
  sorted.forEach((s, i) => { s.rank = i + 1 })
  return stats
})

const maxQty = computed(() => Math.max(...platformStats.value.map(p => p.qty), 1))
const topPlatform = computed(() =>
  [...platformStats.value].sort((a, b) => b.qty - a.qty)[0] ?? null
)

// ── Doughnut Chart ─────────────────────────────────────
const donutChartData = computed(() => ({
  labels: platforms.map(p => p.name),
  datasets: [{
    data: platformStats.value.map(p => p.revenue || 0),
    backgroundColor: platforms.map(p => p.color),
    borderColor: '#ffffff',
    borderWidth: 3,
    hoverOffset: 8,
  }],
}))

const donutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'white',
      titleColor: '#0F172A',
      bodyColor: '#475569',
      borderColor: '#E2E8F7',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (ctx: any) => ` ${ctx.label}: Rp ${new Intl.NumberFormat('id-ID').format(ctx.parsed)}`,
      },
    },
  },
}

// ── Bar Chart ──────────────────────────────────────────
const chartLabels = computed(() => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })
  })
})

const barChartData = computed(() => ({
  labels: chartLabels.value,
  datasets: platforms.map(pl => {
    const data = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const dateStr = d.toISOString().split('T')[0]
      return allSales.value
        .filter(s => s.platforms?.name === pl.name && s.sale_date?.startsWith(dateStr))
        .reduce((sum, s) => sum + Number(s.total_price), 0)
    })
    return {
      label: pl.name,
      data,
      backgroundColor: pl.color + 'CC',
      borderColor: pl.color,
      borderWidth: 1.5,
      borderRadius: 6,
      borderSkipped: false,
    }
  }),
}))

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'white',
      titleColor: '#0F172A',
      bodyColor: '#475569',
      borderColor: '#E2E8F7',
      borderWidth: 1,
      padding: 12,
      callbacks: {
        label: (ctx: any) =>
          ` ${ctx.dataset.label}: Rp ${new Intl.NumberFormat('id-ID').format(ctx.parsed.y)}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#94A3B8', font: { size: 11, family: 'Inter' } },
      stacked: false,
    },
    y: {
      grid: { color: '#F0F4FF', lineWidth: 1 },
      ticks: {
        color: '#94A3B8',
        font: { size: 11, family: 'Inter' },
        callback: (val: number) =>
          val >= 1000000
            ? 'Rp ' + (val / 1000000).toFixed(1) + 'jt'
            : 'Rp ' + new Intl.NumberFormat('id-ID').format(val),
      },
      border: { dash: [4, 4] },
    },
  },
}

// ── Fetch Data ─────────────────────────────────────────
async function fetchData() {
  loadingTable.value = true
  loadingChart.value = true

  const [{ data: sales }, { data: products }, { data: recent }] = await Promise.all([
    supabase.from('sales').select('*, products(name, sku), platforms(name)'),
    supabase.from('products').select('*').order('stock', { ascending: true }),
    supabase
      .from('sales')
      .select('*, products(name, sku), platforms(name)')
      .order('sale_date', { ascending: false })
      .limit(8),
  ])

  allSales.value = sales ?? []
  allProducts.value = products ?? []
  recentSales.value = recent ?? []

  loadingTable.value = false
  loadingChart.value = false
}

onMounted(fetchData)

// ── Helpers ────────────────────────────────────────────
function formatNum(val: number) {
  return new Intl.NumberFormat('id-ID').format(val ?? 0)
}

function formatShort(val: number) {
  if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1) + 'M'
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'jt'
  if (val >= 1_000) return (val / 1_000).toFixed(0) + 'rb'
  return String(val)
}

function formatDate(d: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const platformColorMap: Record<string, string> = {
  Tokopedia: '#42B549',
  Shopee: '#EE4D2D',
  'TikTok Shop': '#1D1D1D',
}

function getPlatformStyle(name?: string) {
  const c = platformColorMap[name ?? ''] ?? '#2563EB'
  return { background: c + '18', color: c }
}
</script>

<style scoped>
.dashboard-page {
  animation: slideInLeft 0.35s ease;
}

/* === Section Label === */
.section-label-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.section-label {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.section-desc {
  font-size: 13px;
  color: var(--color-text-muted);
}

/* === Platform KPI Cards Row === */
.platform-kpi-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.platform-kpi-card {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-card);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  position: relative;
  overflow: hidden;
}

.platform-kpi-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--pl-color);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.platform-kpi-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.platform-kpi-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
}

.platform-kpi-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.platform-kpi-name {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  flex: 1;
}

.platform-rank {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
}

.platform-kpi-revenue {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.5px;
  line-height: 1;
  margin-bottom: 6px;
  animation: countUp 0.5s ease;
}

.platform-kpi-meta {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-bottom: 14px;
  display: flex;
  gap: 6px;
}

.platform-kpi-sep { color: var(--color-border); }

.platform-kpi-bar-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.platform-kpi-bar-track {
  flex: 1;
  height: 5px;
  background: var(--color-bg-secondary);
  border-radius: 999px;
  overflow: hidden;
}

.platform-kpi-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.platform-kpi-pct {
  font-size: 12px;
  font-weight: 700;
  min-width: 36px;
  text-align: right;
}

/* === Charts Row === */
.charts-row {
  display: grid;
  grid-template-columns: 300px 1fr 260px;
  gap: 20px;
}

.card-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

/* Doughnut Chart */
.donut-chart-wrap {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
}

.donut-canvas-wrap {
  position: relative;
  height: 180px;
}

.donut-center-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
}

.donut-center-val {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.3px;
}

.donut-center-sub {
  font-size: 11px;
  color: var(--color-text-muted);
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.donut-legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.donut-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.donut-legend-info {
  flex: 1;
  min-width: 0;
}

.donut-legend-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.donut-legend-val {
  font-size: 11px;
  color: var(--color-text-muted);
}

.donut-legend-pct {
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

/* Bar Chart */
.bar-chart-wrap {
  height: 230px;
  margin-top: 16px;
}

.chart-legend {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

/* Units Sold Chart */
.units-chart-body {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.units-row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.units-row-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.units-row-bar-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
}

.units-bar-track {
  flex: 1;
  height: 8px;
  background: var(--color-bg-secondary);
  border-radius: 999px;
  overflow: hidden;
}

.units-bar-fill {
  height: 100%;
  border-radius: 999px;
  min-width: 4px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.units-row-val {
  font-size: 13px;
  min-width: 40px;
  text-align: right;
}

.top-platform-highlight {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  border-radius: var(--radius-md);
  margin-top: 8px;
}

/* === Bottom Grid === */
.dashboard-grid-bottom {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 20px;
}

/* Low Stock */
.low-stock-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.low-stock-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 10px;
  background: var(--color-bg);
  border: 1px solid var(--color-border-light);
  transition: background var(--transition-fast);
}

.low-stock-item:hover { background: var(--color-surface-hover); }

/* === Responsive === */
@media (max-width: 1200px) {
  .charts-row {
    grid-template-columns: 1fr 1fr;
  }
  .chart-units-card {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .platform-kpi-row {
    grid-template-columns: 1fr;
  }
  .charts-row {
    grid-template-columns: 1fr;
  }
  .dashboard-grid-bottom {
    grid-template-columns: 1fr;
  }
}
</style>
