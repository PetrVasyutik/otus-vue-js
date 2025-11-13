<template>
  <main>
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
        <tr
          v-for="user in users"
          :key="user.id"
        >
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
  </main>
</template>
<script setup>
import { ref } from 'vue';

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
</script>
<style scoped lang="css">
table {
  width: 500px;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
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
</style>

