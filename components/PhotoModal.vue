<template>
    <div class="modal-mask" @click="onClick">
      <img class="modal-container--my photo-modal" :src="image" alt="" />
    </div>
</template>

<script>
export default {
  props: ['name', 'image', 'isShow'],
  methods: {
    onClick() {
      this.$emit('close')
    },
  },
}
</script>

<style>
.photo-modal {
  max-width: 80%;
  max-height: 85%;
  display: inline-block;
}
</style>