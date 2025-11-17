<template>
  <article class="product-card">
    <div class="product-card__image">
      <img :src="props.product.image" :alt="props.product.title" width="120" height="100" />
    </div>
    <div class="product-card__info">
      <h4>{{ props.product.title }}</h4>
      <p class="product-card__category">{{ props.product.category }}</p>
      <p class="product-card__price">${{ props.product.price }}</p>
      <div class="product-card__rating">
        ⭐ {{ props.product.rating.rate }} ({{ props.product.rating.count }} оценок)
      </div>

    </div>
    <button class="product-card__btn">Добавить в корзину</button>
  </article>
</template>
<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>
<style scoped lang="css">
.product-card {
  width: 220px;
  height: auto;
  background-color: rgb(255, 255, 233);
  padding: 25px 15px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-grow: 1;
}
.product-card__image {
  width: 100%;
  height: 130px;
  object-fit: cover;
  text-align: center;
}

.product-card__info {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

.product-card__btn {
  margin-top: auto;
  background-color: rgb(245, 245, 245);
  color: black;
  border: 1px solid rgb(222, 222, 222);
  padding: 10px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  transition: all 0.3s ease;
}
.product-card__btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 14px 0 rgba(222, 222, 222, 0.5);
}
</style>
