<template>
  <main>
    <section class="section">
    </section>
  </main>
</template>
<script setup>

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
