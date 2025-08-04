// stores/tiktokShop.js
export const useTikTokShopStore = defineStore('tiktokShop', () => {
  // State
  const isConnected = ref(false)
  const syncRecords = ref([])
  const categories = ref([])
  const brands = ref([])
  const connectionStatus = ref({
    connected: false,
    shopId: null,
    lastChecked: null
  })
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const syncedProducts = computed(() =>
    syncRecords.value.filter(record => record.sync_status === 'synced')
  )

  const failedProducts = computed(() =>
    syncRecords.value.filter(record => record.sync_status === 'failed')
  )

  const pendingProducts = computed(() =>
    syncRecords.value.filter(record => record.sync_status === 'pending')
  )

  const syncStats = computed(() => ({
    total: syncRecords.value.length,
    synced: syncedProducts.value.length,
    failed: failedProducts.value.length,
    pending: pendingProducts.value.length
  }))

  // Actions
  const setLoading = (value) => {
    loading.value = value
  }

  const setError = (message) => {
    error.value = message
  }

  const clearError = () => {
    error.value = null
  }

  // Get TikTok Shop authorization URL
  const getAuthUrl = async () => {
    try {
      setLoading(true)
      clearError()

      const response = await $apiCore('/seller/tiktok/auth/url', {
        method: 'GET',
      })

      return response.data.auth_url
    } catch (err) {
      console.error('Failed to get auth URL:', err)
      setError('Failed to get authorization URL')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Test TikTok Shop connection
  const testConnection = async () => {
    try {
      clearError()

      const response = await $apiCore('/seller/tiktok/test-connection', {
        method: 'GET',
      })

      connectionStatus.value = {
        message: "Connection successful",
        connected: response.data.connected,
        lastChecked: new Date().toISOString()
      }

      isConnected.value = response.data.connected
      return response.data
    } catch (err) {
      console.error('Connection test failed:', err)
      connectionStatus.value = {
        message: "Connection failed",
        connected: false,
        lastChecked: new Date().toISOString()
      }
      isConnected.value = false

      // Don't throw error for connection test failures
      return { connected: false }
    }
  }

  // Sync products to TikTok Shop
  const syncProducts = async (request) => {
    try {
      setLoading(true)
      clearError()

      const response = await api.post('/seller/tiktok/products/sync', request)

      // Refresh sync status after sync
      await fetchSyncStatus()

      return response.data
    } catch (err) {
      console.error('Product sync failed:', err)
      setError('Failed to sync products')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch sync status for merchant
  const fetchSyncStatus = async () => {
    try {
      clearError()

      const response = await $apiCore('/seller/tiktok/products/status', {
        method: 'GET',
      })
      syncRecords.value = response.data.products || []

      return response.data
    } catch (err) {
      console.error('Failed to fetch sync status:', err)
      setError('Failed to fetch sync status')
      syncRecords.value = []
      throw err
    }
  }

  // Remove product from TikTok Shop
  const removeFromTikTokShop = async (productId) => {
    try {
      setLoading(true)
      clearError()

      await api.delete(`/seller/tiktok/products/${productId}/tiktok`)

      // Refresh sync status
      await fetchSyncStatus()

      return true
    } catch (err) {
      console.error('Failed to remove product:', err)
      setError('Failed to remove product from TikTok Shop')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update product inventory
  const updateInventory = async (productId, quantity) => {
    try {
      setLoading(true)
      clearError()

      await api.put(`/seller/tiktok/products/${productId}/inventory`, {
        quantity: quantity
      })

      return true
    } catch (err) {
      console.error('Failed to update inventory:', err)
      setError('Failed to update inventory')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Fetch TikTok Shop categories
  const fetchCategories = async () => {
    try {
      clearError()

      const { data: categoriesData } = await useApiCore('/seller/tiktok/categories')
      categories.value = categoriesData.data.categories || []

      return response.data
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      setError('Failed to fetch categories')
      categories.value = []
      throw err
    }
  }

  // Fetch TikTok Shop brands
  const fetchBrands = async (categoryId = '') => {
    try {
      clearError()

      const params = categoryId ? `?category_id=${categoryId}` : ''
      const response = await api.get(`/seller/tiktok/brands${params}`)
      brands.value = response.data.brands || []

      return response.data
    } catch (err) {
      console.error('Failed to fetch brands:', err)
      setError('Failed to fetch brands')
      brands.value = []
      throw err
    }
  }

  // Batch operations
  const batchSync = async (productIds, batchSize = 5) => {
    const results = []
    const batches = []

    // Split into batches
    for (let i = 0; i < productIds.length; i += batchSize) {
      batches.push(productIds.slice(i, i + batchSize))
    }

    for (const batch of batches) {
      try {
        const result = await syncProducts({
          product_ids: batch
        })
        results.push(result)

        // Small delay between batches to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (err) {
        console.error('Batch sync failed:', err)
        results.push({ success: [], failed: batch.map(id => ({ product_id: id, message: err.message })) })
      }
    }

    return results.reduce((acc, result) => ({
      success: [...acc.success, ...result.success],
      failed: [...acc.failed, ...result.failed]
    }), { success: [], failed: [] })
  }

  // Get sync record by product ID
  const getSyncRecord = (productId) => {
    return syncRecords.value.find(record => record.local_product_id === productId)
  }

  // Get products by sync status
  const getProductsByStatus = (status) => {
    return syncRecords.value.filter(record => record.sync_status === status)
  }

  // Check if product is synced
  const isProductSynced = (productId) => {
    const record = getSyncRecord(productId)
    return record && record.sync_status === 'synced'
  }

  // Get last sync time for merchant
  const getLastSyncTime = () => {
    if (syncRecords.value.length === 0) return null

    const sortedRecords = syncRecords.value
      .filter(record => record.last_sync_at)
      .sort((a, b) => new Date(b.last_sync_at) - new Date(a.last_sync_at))

    return sortedRecords.length > 0 ? sortedRecords[0].last_sync_at : null
  }

  // Reset store state
  const reset = () => {
    isConnected.value = false
    syncRecords.value = []
    categories.value = []
    brands.value = []
    connectionStatus.value = {
      connected: false,
      shopId: null,
      lastChecked: null
    }
    loading.value = false
    error.value = null
  }

  // Auto-refresh sync status
  let autoRefreshInterval = null

  const startAutoRefresh = (intervalMs = 30000) => {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval)
    }

    autoRefreshInterval = setInterval(async () => {
      if (isConnected.value) {
        try {
          await fetchSyncStatus()
        } catch (err) {
          console.error('Auto-refresh failed:', err)
        }
      }
    }, intervalMs)
  }

  const stopAutoRefresh = () => {
    if (autoRefreshInterval) {
      clearInterval(autoRefreshInterval)
      autoRefreshInterval = null
    }
  }

  return {
    // State
    isConnected,
    syncRecords,
    categories,
    brands,
    connectionStatus,
    loading,
    error,

    // Getters
    syncedProducts,
    failedProducts,
    pendingProducts,
    syncStats,

    // Actions
    getAuthUrl,
    testConnection,
    syncProducts,
    fetchSyncStatus,
    removeFromTikTokShop,
    updateInventory,
    fetchCategories,
    fetchBrands,
    batchSync,
    getSyncRecord,
    getProductsByStatus,
    isProductSynced,
    getLastSyncTime,
    reset,
    startAutoRefresh,
    stopAutoRefresh,
    setLoading,
    setError,
    clearError
  }
})
