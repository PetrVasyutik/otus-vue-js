<template>
  <article class="preview-product-card">
    <div class="preview-product-card__image">
      <img :src="props.product.image" :alt="props.product.title" width="120" height="100" />
    </div>
    <div class="preview-product-card__info">
      <h4>{{ props.product.title }}</h4>
      <p class="preview-product-card__category">{{ props.product.category }}</p>
      <p class="preview-product-card__price">${{ props.product.price }}</p>
      <div class="preview-product-card__rating">
        ⭐ {{ props.product.rating.rate }} ({{ props.product.rating.count }} оценок)
      </div>

    </div>
    <button class="preview-product-card__btn" @click="handleDetailsClick">Подробнее</button>
  </article>
</template>
<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
});

const router = useRouter();

const handleDetailsClick = () => {
  router.push({ name: 'Product', params: { id: props.product.id } });
};
</script>
<style scoped lang="css">
.preview-product-card {
  width: 270px;
  height: auto;
  background-color: rgb(255, 255, 233);
  padding: 25px 15px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.preview-product-card__image {
  width: 100%;
  height: 130px;
  object-fit: cover;
  text-align: center;
}

.preview-product-card__info {
  width: 100%;
  height: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

.preview-product-card__btn {
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
.preview-product-card__btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 14px 0 rgba(222, 222, 222, 0.5);
}
</style>
