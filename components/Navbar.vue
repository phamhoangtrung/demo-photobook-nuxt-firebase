<template>
  <div class="nav-bg navbar-light bg-light">
    <nav class="container navbar justify-content-between">
      <nuxt-link to='/'>
        <logo/>
      </nuxt-link>
    </nav>
  </div>
</template>
<script>
import Logo from './Logo.vue'
export default {
  components: { Logo },
}
</script>
<style>
.nav-bg {
  box-shadow: 1px 1px 5px #aaa;
  margin-bottom: 8px;
}
</style>
