
<script>
export default {
    name: 'loading'
}
</script>

<template>
  <div class="loading elevation-3">
    <h6 class="mb-6">INHALTE WERDEN GELADEN</h6>
    <v-progress-circular
      :size="50"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 100;
  transform: translateX(-50%) translateY(-50%);
  width: 200px;
  height: 150px;
  padding: 1rem;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
