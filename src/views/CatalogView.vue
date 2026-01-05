<template>
  <h1>Каталог товаров</h1>
  <!-- WebSocket статус -->
  <div class="ws-status" :class="{ 'ws-status--connected': wsConnected }">
    <span v-if="wsConnected">🟢 Real-time обновления активны</span>
    <span v-else>🔴 Real-time обновления неактивны</span>
  </div>
  <!-- Уведомления -->
  <div v-if="notifications.length > 0" class="notifications">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification"
      :class="`notification--${notification.type}`"
    >
      <span>{{ notification.message }}</span>
      <button @click="removeNotification(notification.id)" class="notification__close">×</button>
    </div>
  </div>
  <section class="section">
      <div class="section__body">
        <div v-if="productsState.loading" class="loading">
          <p>Загружаем товары...</p>
        </div>
        <div v-else-if="productsState.error" class="error">
          <p>Ошибка: {{ productsState.error }}</p>
          <button @click="fetchProducts" class="error__btn">Попробовать снова</button>
        </div>
        <div v-else class="section__products">
          <products-list :products="products" />
        </div>
      <section class="section">
        <div class="order-form">
          <order-form />
        </div>
      </section>
      <section class="section">
        <div class="new-product-form">
          <new-product-form :products="products" />
        </div>
      </section>
      </div>
    </section>
</template>
<script setup>
import { onMounted, onUnmounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import ProductsList from '@/components/ProductsList.vue';
import { useAppStore } from '@/stores/appStore';
import { useWebSocket } from '@/composables/useWebSocket';

const store = useAppStore()

const { products, productsState, wsConnected, notifications } = storeToRefs(store)
const { fetchProducts, updateProductPrice, removeNotification } = store

// WebSocket подключение
const { connect, disconnect, connected } = useWebSocket('ws://mock')

// Синхронизируем статус WebSocket с store
watch(connected, (isConnected) => {
  wsConnected.value = isConnected
}, { immediate: true })

onMounted(() => {
  // Загружаем товары
  fetchProducts()

  // Подключаемся к WebSocket (с небольшой задержкой, чтобы не мешать загрузке)
  setTimeout(() => {
    connect({
      onPriceUpdate: (data) => {
        // Обновляем цену товара
        if (data.productId && data.newPrice) {
          updateProductPrice(data.productId, data.newPrice)
        }
      },
      onProductUpdate: (data) => {
        // При появлении нового товара перезагружаем список
        fetchProducts()
      },
      onNotification: (data) => {
        // Добавляем уведомление в store
        store.addNotification({
          type: data.type || 'notification',
          message: data.message || data.title || 'Новое уведомление',
          timestamp: data.timestamp,
        })
      },
    })
  }, 500)
})

onUnmounted(() => {
  // Отключаемся от WebSocket при размонтировании
  disconnect()
})
</script>
<style scoped>
.ws-status {
  padding: 10px;
  margin: 10px 0;
  text-align: center;
  background-color: #f0f0f0;
  border-radius: 5px;
  font-size: 14px;
}

.ws-status--connected {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.notifications {
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification {
  padding: 12px 15px;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideIn 0.3s ease-out;
}

.notification--price_update {
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
}

.notification--notification {
  background-color: #d1ecf1;
  border-left: 4px solid #17a2b8;
}

.notification--new_product {
  background-color: #d4edda;
  border-left: 4px solid #28a745;
}

.notification__close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #666;
  padding: 0 5px;
  line-height: 1;
}

.notification__close:hover {
  color: #000;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
