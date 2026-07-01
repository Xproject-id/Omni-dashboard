<template>
  <div class="inventory-page">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Inventaris</h1>
        <p class="page-subtitle">Kelola produk dan stok untuk semua platform</p>
      </div>
      <button class="btn btn-primary" @click="openModal('add')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Tambah Produk
      </button>
    </div>

    <!-- Filters & Search -->
    <div class="card" style="margin-bottom: 20px; padding: 16px 20px;">
      <div class="flex items-center gap-3">
        <div class="search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input v-model="search" type="text" placeholder="Cari produk, SKU..." class="search-input" />
        </div>
        <select v-model="filterStock" class="form-select" style="width: auto;">
          <option value="all">Semua Stok</option>
          <option value="low">Stok Menipis (&lt;10)</option>
          <option value="out">Habis (0)</option>
          <option value="ok">Stok Aman</option>
        </select>
      </div>
    </div>

    <!-- Products Table -->
    <div class="card">
      <div v-if="loading" class="flex flex-col gap-3">
        <div v-for="i in 5" :key="i" class="skeleton" style="height: 56px; border-radius: 8px;"></div>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          </svg>
        </div>
        <p class="text-sm text-muted">Tidak ada produk ditemukan</p>
        <button class="btn btn-primary btn-sm" @click="openModal('add')">Tambah Produk</button>
      </div>

      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nama Produk</th>
              <th>SKU</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Status</th>
              <th>Dibuat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="product-name-cell">
                  <div class="product-avatar">{{ product.name.charAt(0) }}</div>
                  <span class="font-medium" style="color: var(--color-text-primary);">{{ product.name }}</span>
                </div>
              </td>
              <td>
                <code class="sku-code">{{ product.sku ?? '-' }}</code>
              </td>
              <td class="font-semibold" style="color: var(--color-text-primary);">
                Rp {{ formatNum(product.price) }}
              </td>
              <td>
                <div class="stock-cell">
                  <span class="font-bold" :class="stockClass(product.stock)">{{ product.stock }}</span>
                  <span class="text-muted text-xs">pcs</span>
                </div>
              </td>
              <td>
                <span class="badge" :class="stockBadgeClass(product.stock)">
                  {{ stockLabel(product.stock) }}
                </span>
              </td>
              <td class="text-muted text-sm">{{ formatDate(product.created_at) }}</td>
              <td>
                <div class="flex gap-2">
                  <button class="btn btn-secondary btn-sm btn-icon" title="Edit" @click="openModal('edit', product)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="btn btn-danger btn-sm btn-icon" title="Hapus" @click="confirmDelete(product)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination info -->
      <div v-if="filteredProducts.length > 0" class="table-footer">
        <p class="text-sm text-muted">Menampilkan {{ filteredProducts.length }} dari {{ products.length }} produk</p>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <Teleport to="body">
      <div v-if="modalOpen" class="modal-overlay" @click.self="modalOpen = false">
        <div class="modal">
          <div class="modal-header">
            <h3 class="modal-title">{{ modalMode === 'add' ? 'Tambah Produk' : 'Edit Produk' }}</h3>
            <button class="btn btn-secondary btn-sm btn-icon" @click="modalOpen = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Nama Produk *</label>
              <input v-model="form.name" type="text" class="form-input" placeholder="e.g. Kaos Polos Hitam" />
            </div>
            <div class="form-group">
              <label class="form-label">SKU</label>
              <input v-model="form.sku" type="text" class="form-input" placeholder="e.g. KPH-001" />
            </div>
            <div class="flex gap-4">
              <div class="form-group flex-1">
                <label class="form-label">Harga (Rp) *</label>
                <input v-model.number="form.price" type="number" class="form-input" placeholder="89000" min="0" />
              </div>
              <div class="form-group flex-1">
                <label class="form-label">Stok *</label>
                <input v-model.number="form.stock" type="number" class="form-input" placeholder="100" min="0" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="modalOpen = false">Batal</button>
            <button class="btn btn-primary" :disabled="saving" @click="saveProduct">
              <svg v-if="saving" class="spin-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              {{ saving ? 'Menyimpan...' : (modalMode === 'add' ? 'Simpan' : 'Perbarui') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirm -->
      <div v-if="deleteTarget" class="modal-overlay" @click.self="deleteTarget = null">
        <div class="modal" style="max-width: 380px;">
          <div class="modal-header">
            <h3 class="modal-title">Hapus Produk?</h3>
          </div>
          <div class="modal-body">
            <p class="text-sm" style="color: var(--color-text-secondary);">
              Anda akan menghapus produk <strong>{{ deleteTarget.name }}</strong>. Semua data penjualan terkait juga akan terhapus. Tindakan ini tidak bisa dibatalkan.
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="deleteTarget = null">Batal</button>
            <button class="btn btn-danger" :disabled="deleting" @click="deleteProduct">
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

useHead({ title: 'Inventaris | Omni Dashboard' })

const supabase = useSupabaseClient()

// ── State ──────────────────────────────────────────────
const products = ref<any[]>([])
const loading = ref(true)
const search = ref('')
const filterStock = ref('all')
const modalOpen = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const saving = ref(false)
const deleteTarget = ref<any>(null)
const deleting = ref(false)
const toasts = ref<{ id: number; message: string; type: string }[]>([])

const form = ref({ id: '', name: '', sku: '', price: 0, stock: 0 })

// ── Filtered ───────────────────────────────────────────
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const q = search.value.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || (p.sku ?? '').toLowerCase().includes(q)
    let matchStock = true
    if (filterStock.value === 'low') matchStock = p.stock < 10 && p.stock > 0
    if (filterStock.value === 'out') matchStock = p.stock === 0
    if (filterStock.value === 'ok') matchStock = p.stock >= 10
    return matchSearch && matchStock
  })
})

// ── Fetch ──────────────────────────────────────────────
async function fetchProducts() {
  loading.value = true
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  products.value = data ?? []
  loading.value = false
}

onMounted(fetchProducts)

// ── Modal ──────────────────────────────────────────────
function openModal(mode: 'add' | 'edit', product?: any) {
  modalMode.value = mode
  if (mode === 'add') {
    form.value = { id: '', name: '', sku: '', price: 0, stock: 0 }
  } else {
    form.value = { id: product.id, name: product.name, sku: product.sku ?? '', price: product.price, stock: product.stock }
  }
  modalOpen.value = true
}

async function saveProduct() {
  if (!form.value.name || !form.value.price) return showToast('Nama dan harga wajib diisi!', 'error')
  saving.value = true

  const payload = { name: form.value.name, sku: form.value.sku || null, price: form.value.price, stock: form.value.stock }

  if (modalMode.value === 'add') {
    const { error } = await supabase.from('products').insert(payload)
    if (error) { saving.value = false; return showToast('Gagal menyimpan produk: ' + error.message, 'error') }
    showToast('Produk berhasil ditambahkan!', 'success')
  } else {
    const { error } = await supabase.from('products').update(payload).eq('id', form.value.id)
    if (error) { saving.value = false; return showToast('Gagal memperbarui produk: ' + error.message, 'error') }
    showToast('Produk berhasil diperbarui!', 'success')
  }
  saving.value = false
  modalOpen.value = false
  fetchProducts()
}

// ── Delete ─────────────────────────────────────────────
function confirmDelete(product: any) { deleteTarget.value = product }

async function deleteProduct() {
  deleting.value = true
  const { error } = await supabase.from('products').delete().eq('id', deleteTarget.value.id)
  if (error) { deleting.value = false; return showToast('Gagal menghapus: ' + error.message, 'error') }
  showToast('Produk dihapus!', 'success')
  deleting.value = false
  deleteTarget.value = null
  fetchProducts()
}

// ── Helpers ────────────────────────────────────────────
function formatNum(val: number) { return new Intl.NumberFormat('id-ID').format(val ?? 0) }
function formatDate(d: string) {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

function stockClass(stock: number) {
  if (stock === 0) return 'text-danger'
  if (stock < 10) return 'text-warning'
  return 'text-success'
}

function stockBadgeClass(stock: number) {
  if (stock === 0) return 'badge-danger'
  if (stock < 10) return 'badge-warning'
  return 'badge-success'
}

function stockLabel(stock: number) {
  if (stock === 0) return 'Habis'
  if (stock < 10) return 'Menipis'
  return 'Aman'
}

let toastId = 0
function showToast(message: string, type: 'success' | 'error' | 'info') {
  const id = ++toastId
  toasts.value.push({ id, message, type })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 3000)
}
</script>

<style scoped>
.inventory-page { animation: slideInLeft 0.35s ease; }

.search-box {
  flex: 1;
  max-width: 360px;
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

.search-box:focus-within {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

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

.search-input::placeholder { color: var(--color-muted); }

.product-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-avatar {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--gradient-primary-soft);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.sku-code {
  background: var(--color-bg);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  color: var(--color-text-secondary);
  font-family: 'Courier New', monospace;
  border: 1px solid var(--color-border);
}

.stock-cell {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.table-footer {
  padding: 14px 16px;
  border-top: 1px solid var(--color-border-light);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spin-icon {
  animation: spin 1s linear infinite;
}
</style>
