<template>
  <div class="app-layout">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <!-- Logo -->
      <div class="sidebar-logo">
        <div class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <div class="logo-text">
          <span class="logo-name">Omni</span>
          <span class="logo-sub">Dashboard</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <p class="nav-section-label">Menu Utama</p>
        <NuxtLink to="/" class="nav-item" exact-active-class="nav-item-active">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
          </span>
          <span>Dashboard</span>
        </NuxtLink>
        <NuxtLink to="/inventory" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </span>
          <span>Inventaris</span>
        </NuxtLink>
        <NuxtLink to="/sales" class="nav-item" active-class="nav-item-active">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </span>
          <span>Penjualan</span>
        </NuxtLink>

        <p class="nav-section-label" style="margin-top: 16px;">Platform</p>
        <div class="platform-list">
          <div class="platform-item">
            <span class="platform-dot" style="background: var(--color-tokopedia);"></span>
            <span>Tokopedia</span>
          </div>
          <div class="platform-item">
            <span class="platform-dot" style="background: var(--color-shopee);"></span>
            <span>Shopee</span>
          </div>
          <div class="platform-item">
            <span class="platform-dot" style="background: #333;"></span>
            <span>TikTok Shop</span>
          </div>
        </div>
      </nav>

      <!-- Sidebar Footer -->
      <div class="sidebar-footer">
        <div class="sidebar-footer-info">
          <div class="footer-avatar">{{ userInitial }}</div>
          <div class="footer-user-text">
            <p class="footer-name">{{ userDisplayName }}</p>
            <p class="footer-role">{{ user?.email ?? 'Admin' }}</p>
          </div>
        </div>
        <button class="logout-btn" @click="handleLogout" title="Keluar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>

    <!-- Mobile Overlay -->
    <div v-if="sidebarOpen" class="mobile-overlay" @click="sidebarOpen = false"></div>

    <!-- Main Content Area -->
    <div class="main-wrapper">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-left">
          <button class="btn-hamburger" @click="sidebarOpen = !sidebarOpen">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div class="header-title-wrap">
            <h1 class="header-page-title">{{ currentPageTitle }}</h1>
            <p class="header-date">{{ currentDate }}</p>
          </div>
        </div>
        <div class="header-right">
          <div class="header-status-badge">
            <span class="live-dot"></span>
            <span>Live</span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const sidebarOpen = ref(false)

const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/inventory': 'Inventaris',
  '/sales': 'Penjualan',
}

const currentPageTitle = computed(() => pageTitles[route.path] || 'Dashboard')

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

const userDisplayName = computed(() => {
  const meta = user.value?.user_metadata
  return meta?.full_name || meta?.name || 'Admin'
})

const userInitial = computed(() => {
  return userDisplayName.value.charAt(0).toUpperCase()
})

async function handleLogout() {
  await supabase.auth.signOut()
  router.push('/login')
}
</script>

<style scoped>
/* === App Layout Shell === */
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
}

/* === Sidebar === */
.sidebar {
  width: var(--sidebar-width);
  min-width: var(--sidebar-width);
  background: var(--gradient-sidebar);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  box-shadow: var(--shadow-sidebar);
  transition: transform var(--transition-slow);
}

/* === Logo === */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-icon {
  width: 38px;
  height: 38px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  backdrop-filter: blur(8px);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-name {
  font-size: 17px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.3px;
}

.logo-sub {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  font-weight: 400;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

/* === Navigation === */
.sidebar-nav {
  flex: 1;
  padding: 20px 12px;
  overflow-y: auto;
}

.nav-section-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.4);
  padding: 0 8px;
  margin-bottom: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 500;
  transition: all var(--transition-fast);
  margin-bottom: 2px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item-active {
  background: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.nav-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.nav-item-active .nav-icon {
  background: rgba(255, 255, 255, 0.2);
}

/* === Platform List === */
.platform-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
}

.platform-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 12px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 13px;
  font-weight: 400;
}

.platform-item .platform-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* === Sidebar Footer === */
.sidebar-footer {
  padding: 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar-footer-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.footer-avatar {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
}

.footer-user-text {
  min-width: 0;
}

.footer-name {
  font-size: 13px;
  font-weight: 600;
  color: white;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.footer-role {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.25);
  border-color: rgba(239, 68, 68, 0.4);
  color: #FCA5A5;
}

/* === Main Wrapper === */
.main-wrapper {
  flex: 1;
  margin-left: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 0;
  transition: margin-left var(--transition-slow);
}

/* === Top Header === */
.top-header {
  position: sticky;
  top: 0;
  z-index: 30;
  height: var(--header-height);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.btn-hamburger {
  display: none;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  padding: 6px;
  border-radius: 8px;
  transition: background var(--transition-fast);
}

.btn-hamburger:hover {
  background: var(--color-bg);
}

.header-page-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.header-date {
  font-size: 12px;
  color: var(--color-text-muted);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  background: var(--color-success-bg);
  border: 1px solid #D1FAE5;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-success);
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-success);
  animation: pulse-dot 2s infinite;
}

/* === Main Content === */
.main-content {
  flex: 1;
  padding: 28px 32px;
  overflow-x: hidden;
}

/* === Mobile Overlay === */
.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
}

/* === Responsive === */
@media (max-width: 900px) {
  .sidebar {
    transform: translateX(-100%);
  }
  .sidebar.sidebar-open {
    transform: translateX(0);
  }
  .mobile-overlay {
    display: block;
  }
  .main-wrapper {
    margin-left: 0;
  }
  .btn-hamburger {
    display: flex;
  }
  .main-content {
    padding: 20px 16px;
  }
  .top-header {
    padding: 0 16px;
  }
}
</style>
