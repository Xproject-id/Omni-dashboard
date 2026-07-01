<template>
  <div class="sales-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Penjualan</h1>
        <p class="page-subtitle">Catat dan pantau semua transaksi penjualan</p>
      </div>
      <button class="btn btn-primary" @click="modalOpen = true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Catat Penjualan
      </button>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-3" style="margin-bottom: 24px;">
      <div class="card summary-mini-card">
        <p class="text-xs text-muted" style="text-transform: uppercase; letter-spacing: 0.5px;">Total Transaksi</p>
        <p class="summary-value">{{ sales.length }}</p>
        <p class="text-xs text-muted">Semua platform</p>
      </div>
      <div class="card summary-mini-card">
        <p class="text-xs text-muted" style="text-transform: uppercase; letter-spacing: 0.5px;">Total Terjual</p>
        <p class="summary-value">{{ totalQty.toLocaleString('id-ID') }} <span style="font-size: 14px; font-weight: 400; color: var(--color-muted);">pcs</span></p>
        <p class="text-xs text-muted">Semua produk</p>
      </div>
      <div class="card summary-mini-card">
        <p class="text-xs text-muted" style="text-transform: uppercase; letter-spacing: 0.5px;">Total Pendapatan</p>
        <p class="summary-value" style="font-size: 20px;">Rp {{ formatNum(totalRevenue) }}</p>
        <p class="text-xs text-muted">Semua platform</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="card" style="margin-bottom: 20px; padding: 14px 20px;">
      <div class="flex items-center gap-3">
        <div class="search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input v-model="search" type="text" placeholder="Cari produk..." class="search-input" />
        </div>
        <select v-model="filterPlatform" class="form-select" style="width: auto;">
          <option value="all">Semua Platform</option>
          <option v-for="pl in platforms" :key="pl.id" :value="pl.id">{{ pl.name }}</option>
        </select>
        <input v-model="filterDate" type="date" class="form-input" style="width: auto;" />
      </div>
    </div>

    <!-- Sales Table -->
    <div class="card">
      <div v-if="loading" class="flex flex-col gap-3">
        <div v-for="i in 6" :key="i" class="skeleton" style="height: 52px; border-radius: 8px;"></div>
      </div>

      <div v-else-if="filteredSales.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <p class="text-sm text-muted">Belum ada data penjualan</p>
        <button class="btn btn-primary btn-sm" @click="modalOpen = true">Catat Penjualan</button>
      </div>

      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Produk</th>
              <th>Platform</th>
              <th>Qty</th>
              <th>Harga Satuan</th>
              <th>Total</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(sale, i) in filteredSales" :key="sale.id">
              <td class="text-muted text-xs">{{ i + 1 }}</td>
              <td>
                <p class="font-medium" style="color: var(--color-text-primary);">{{ sale.products?.name ?? '-' }}</p>
                <p class="text-xs text-muted">{{ sale.products?.sku ?? '' }}</p>
              </td>
              <td>
                <span class="platform-tag" :style="getPlatformStyle(sale.platforms?.name)">
                  <span class="platform-dot" :style="{ background: getPlatformColor(sale.platforms?.name) }"></span>
                  {{ sale.platforms?.name ?? '-' }}
                </span>
              </td>
              <td class="font-semibold">{{ sale.quantity }}</td>
              <td class="text-secondary">Rp {{ formatNum(sale.total_price / sale.quantity) }}</td>
              <td>
                <span class="font-bold" style="color: var(--color-primary);">Rp {{ formatNum(sale.total_price) }}</span>
              </td>
              <td class="text-muted text-sm">{{ formatDate(sale.sale_date) }}</td>
              <td>
                <button class="btn btn-danger btn-sm btn-icon" @click="confirmDelete(sale)" title="Hapus">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Sale Modal -->
    <Teleport to="body">
      <div v-if="modalOpen" class="modal-overlay" @click.self="modalOpen = false">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">Catat Penjualan Baru</h3>
            <button class="btn btn-secondary btn-sm btn-icon" @click="modalOpen = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Produk *</label>
              <select v-model="form.product_id" class="form-select" @change="onProductSelect">
                <option value="">-- Pilih Produk --</option>
                <option v-for="p in products" :key="p.id" :value="p.id">
                  {{ p.name }} (Stok: {{ p.stock }})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Platform *</label>
              <div class="platform-selector">
                <button
                  v-for="pl in platforms"
                  :key="pl.id"
                  class="platform-btn"
                  :class="{ 'platform-btn-active': form.platform_id === pl.id }"
                  :style="form.platform_id === pl.id ? { borderColor: getPlatformColor(pl.name), background: getPlatformColor(pl.name) + '12' } : {}"
                  @click="form.platform_id = pl.id"
                  type="button"
                >
                  <span class="platform-dot" :style="{ background: getPlatformColor(pl.name) }"></span>
                  {{ pl.name }}
                </button>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="form-group flex-1">
                <label class="form-label">Jumlah (Qty) *</label>
                <input v-model.number="form.quantity" type="number" class="form-input" placeholder="1" min="1" @input="calcTotal" />
                <p v-if="selectedProduct" class="text-xs text-muted" style="margin-top: 4px;">
                  Stok tersedia: {{ selectedProduct.stock }}
                </p>
              </div>
              <div class="form-group flex-1">
                <label class="form-label">Harga Jual (Rp) *</label>
                <input v-model.number="form.price_per_item" type="number" class="form-input" placeholder="89000" min="0" @input="calcTotal" />
              </div>
            </div>
            <div class="total-preview" v-if="form.quantity && form.price_per_item">
              <span class="text-sm text-muted">Total Pendapatan:</span>
              <span class="total-value">Rp {{ formatNum(form.quantity * form.price_per_item) }}</span>
            </div>
            <div class="form-group">
              <label class="form-label">Tanggal Penjualan</label>
              <input v-model="form.sale_date" type="datetime-local" class="form-input" />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="modalOpen = false">Batal</button>
            <button class="btn btn-primary" :disabled="saving" @click="saveSale">
              <svg v-if="saving" class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              {{ saving ? 'Menyimpan...' : 'Catat Penjualan' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirm -->
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal" style="max-width: 380px;">
          <div class="modal-header">
            <h3 class="modal-title">Hapus Penjualan?</h3>
          </div>
          <div class="modal-body">
            <p class="text-sm" style="color: var(--color-text-secondary);">
              Data penjualan ini akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="deleteTarget = null">Batal</button>
            <button class="btn btn-danger" :disabled="deleting" @click="deleteSale">
              {{ deleting ? 'Menghapus...' : 'Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Toast -->
    <div class="toast-container">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="`toast-${t.type}`">
        {{ t.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

useHead({ title: 'Penjualan | Omni Dashboard' })

const supabase = useSupabaseClient()

// ── State ──────────────────────────────────────────────
const sales = ref<any[]>([])
const products = ref<any[]>([])
const platforms = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const filterPlatform = ref('all')
const filterDate = ref('')
const modalOpen = ref(false)
const saving = ref(false)
const deleteTarget = ref<any>(null)
const deleting = ref(false)
const toasts = ref<{ id: number; message: string; type: string }[]>([])

const selectedProduct = computed(() =>
  products.value.find(p => p.id === form.value.product_id) ?? null
)

const now = new Date()
const formattedNow = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

const form = ref({
  product_id: '',
  platform_id: null as number | null,
  quantity: 1,
  price_per_item: 0,
  total_price: 0,
  sale_date: formattedNow,
})

// ── Computed ───────────────────────────────────────────
const filteredSales = computed(() => {
  return sales.value.filter(s => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || (s.products?.name ?? '').toLowerCase().includes(q)
    const matchPlatform = filterPlatform.value === 'all' || s.platform_id === Number(filterPlatform.value)
    const matchDate = !filterDate.value || (s.sale_date ?? '').startsWith(filterDate.value)
    return matchSearch && matchPlatform && matchDate
  })
})

const totalRevenue = computed(() => filteredSales.value.reduce((s, x) => s + Number(x.total_price), 0))
const totalQty = computed(() => filteredSales.value.reduce((s, x) => s + Number(x.quantity), 0))

// ── Fetch ──────────────────────────────────────────────
async function fetchAll() {
  loading.value = true
  const [{ data: s }, { data: p }, { data: pl }] = await Promise.all([
    supabase.from('sales').select('*, products(name, sku), platforms(name)').order('sale_date', { ascending: false }),
    supabase.from('products').select('*').order('name'),
    supabase.from('platforms').select('*'),
  ])
  sales.value = s ?? []
  products.value = p ?? []
  platforms.value = pl ?? []
  loading.value = false
}

onMounted(fetchAll)

// ── Form ───────────────────────────────────────────────
function onProductSelect() {
  const p = selectedProduct.value
  if (p) form.value.price_per_item = Number(p.price)
  calcTotal()
}

function calcTotal() {
  form.value.total_price = form.value.quantity * form.value.price_per_item
}

async function saveSale() {
  if (!form.value.product_id) return showToast('Pilih produk terlebih dahulu!', 'error')
  if (!form.value.platform_id) return showToast('Pilih platform terlebih dahulu!', 'error')
  if (!form.value.quantity || form.value.quantity < 1) return showToast('Jumlah minimal 1!', 'error')
  if (!form.value.price_per_item || form.value.price_per_item <= 0) return showToast('Harga jual harus diisi!', 'error')

  const sp = selectedProduct.value
  if (sp && form.value.quantity > sp.stock) {
    return showToast(`Stok tidak cukup! Tersedia: ${sp.stock} pcs`, 'error')
  }

  saving.value = true
  const total = form.value.quantity * form.value.price_per_item

  const { error: saleError } = await supabase.from('sales').insert({
    product_id: form.value.product_id,
    platform_id: form.value.platform_id,
    quantity: form.value.quantity,
    total_price: total,
    sale_date: new Date(form.value.sale_date).toISOString(),
  })

  if (saleError) { saving.value = false; return showToast('Gagal menyimpan: ' + saleError.message, 'error') }

  // Deduct stock
  if (sp) {
    await supabase.from('products').update({ stock: sp.stock - form.value.quantity }).eq('id', form.value.product_id)
  }

  saving.value = false
  modalOpen.value = false
  showToast('Penjualan berhasil dicatat!', 'success')
  fetchAll()
  form.value = { product_id: '', platform_id: null, quantity: 1, price_per_item: 0, total_price: 0, sale_date: formattedNow }
}

// ── Delete ─────────────────────────────────────────────
function confirmDelete(sale: any) { deleteTarget.value = sale }

async function deleteSale() {
  deleting.value = true
  const { error } = await supabase.from('sales').delete().eq('id', deleteTarget.value.id)
  if (error) { deleting.value = false; return showToast('Gagal menghapus!', 'error') }
  showToast('Data penjualan dihapus!', 'success')
  deleting.value = false
  deleteTarget.value = null
  fetchAll()
}

// ── Helpers ────────────────────────────────────────────
function formatNum(val: number) { return new Intl.NumberFormat('id-ID').format(val ?? 0) }
function formatDate(d: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const platformColorMap: Record<string, string> = { Tokopedia: '#42B549', Shopee: '#EE4D2D', 'TikTok Shop': '#333' }
function getPlatformColor(name?: string) { return platformColorMap[name ?? ''] ?? '#2563EB' }
function getPlatformStyle(name?: string) {
  const c = getPlatformColor(name)
  return { background: c + '18', color: c }
}

let toastId = 0
function showToast(message: string, type: 'success' | 'error' | 'info') {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3500)
}
</script>

<style scoped>
.sales-page { animation: slideInLeft 0.35s ease; }

.summary-mini-card {
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}
.summary-mini-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.summary-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--color-text-primary);
  letter-spacing: -0.8px;
  margin: 6px 0 4px;
  line-height: 1;
  animation: countUp 0.5s ease;
}

.search-box {
  flex: 1;
  max-width: 320px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-muted);
  transition: border-color var(--transition-fast);
}
.search-box:focus-within { border-color: var(--color-primary); color: var(--color-primary); }

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-sm);
  padding: 9px 0;
  color: var(--color-text-primary);
  font-family: var(--font-family);
}

.platform-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.platform-selector {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.platform-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-white);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.platform-btn:hover {
  border-color: var(--color-primary-200);
  background: var(--color-primary-50);
}

.total-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--gradient-primary-soft);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-primary-200);
}

.total-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.spin-icon { animation: spin 1s linear infinite; }
</style>
