<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-md-12 col-lg-6 center">
        <img :src="item.imgUrl" class="photo-detail" />
      </div>
      <div class="col-12 col-md-12 col-lg-6">
        <h1 class="photo-detail__photo-name">{{ item.name }}</h1>
        <h5 class="photo-detail__photo-desc">
          Description: <span>{{ item.desc }}</span>
        </h5>
        <p class="photo-detail__photo-create-time">
          Created at: {{ item.createDate }}
        </p>
        <p class="photo-detail__photo-update-time">
          Updated at: {{ item.updateDate }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ params, store }) {
    const id = params.id
    const item = store.getters.getItem(id)
    // When calling /abc the slug will be "abc"
    return { item }
  },
}
</script>

<style>
.photo-detail {
  max-width: 100%;
  max-height: 500px;
}
.center{
    display: flex;
    justify-content: center;
    align-items: center;
}
.photo-detail__photo-name {
  border-bottom: 1px solid #ccc;
}
.photo-detail__photo-desc {
}
.photo-detail__photo-desc > span {
  font-weight: 200;
  font-size: 1.2rem;
  font-style: italic;
}
</style>.