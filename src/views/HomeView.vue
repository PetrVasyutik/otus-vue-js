<template>
  <main>
    <section class="section">
      <h2 class="section__title">Урок 3 - шаблоны</h2>
      <div class="section__body">
        <table>
          <thead>
            <tr>
              <td>№</td>
              <td>Имя</td>
              <td>Возраст</td>
              <td>Пол</td>
              <td>Город</td>
            </tr>
          </thead>
          <tbody v-show="isListVisible">
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td><span v-if="user.age > 18">{{ user.age }}</span></td>
              <td>{{ user.gender }}</td>
              <td>{{ user.city }}</td>
            </tr>
          </tbody>
        </table>
        <div class="button-container">
          <button type="button" @click="toggleList">
            {{ isListVisible ? 'Скрыть список' : 'Открыть список' }}
          </button>
        </div>
      </div>
    </section>
    <section class="section">
      <h2 class="section__title">Уроки 4, 5 - компоненты, props, формы и события</h2>
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
      </div>
    </section>
  </main>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import ProductsList from '@/components/ProductsList.vue';
import { useProducts } from '@/composables/useProducts';

const hoverBgColor = ref('#f5f5f5');
const hoverTextColor = ref('green');
const isListVisible = ref(true);

const users = [
  {
    id: 1,
    name: 'Алексей',
    age: 43,
    gender: 'мужской',
    city: 'Москва',
  },
  {
    id: 2,
    name: 'Татьяна',
    age: 54,
    gender: 'женский',
    city: 'Обнинск',
  },
  {
    id: 3,
    name: 'Мария',
    age: 27,
    gender: 'женский',
    city: 'Томск',
  },
  {
    id: 4,
    name: 'Степан',
    age: 16,
    gender: 'мужской',
    city: 'Владивосток',
  },
  {
    id: 5,
    name: 'Виктория',
    age: 33,
    gender: 'женский',
    city: 'Тюмень',
  },
  {
    id: 6,
    name: 'Кирилл',
    age: 63,
    gender: 'мужской',
    city: 'Астрахань',
  },
  {
    id: 7,
    name: 'Игорь',
    age: 22,
    gender: 'мужской',
    city: 'Клин',
  },
  {
    id: 8,
    name: 'Анна',
    age: 12,
    gender: 'женский',
    city: 'Светлогорск',
  },
];

const toggleList = () => {
  isListVisible.value = !isListVisible.value;
}

// Используем composable для загрузки продуктов
// Логика вынесена из компонента для лучшей организации кода
const { products, productsState, fetchProducts } = useProducts()

// Загружаем продукты при монтировании компонента
onMounted(() => {
  fetchProducts()
})
</script>
<style scoped lang="css">
.section {
  padding: 20px 20px;
  margin-bottom: 40px;
}

table {
  width: 500px;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

thead td {
  background-color: #f5f5f5;
  font-weight: 700;
}

tbody tr:hover {
  background-color: v-bind('hoverBgColor');
  color: v-bind('hoverTextColor');
}

.button-container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 20px;
}

.error p {
  font-size: 16px;
  font-weight: 700;
  color: red;
  text-align: center;
  margin: 20px 0;
}

.error__btn {
  background-color: rgb(255, 255, 233);
  color: black;
  border: 1px solid rgb(222, 222, 222);
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s ease;
}
.error__btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 14px 0 rgba(222, 222, 222, 0.5);
}
</style>
