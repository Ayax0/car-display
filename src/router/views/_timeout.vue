<script>
export default {
    name: 'timeout'
}
</script>

<template>
  <div class="not-found">
    <h1>Seite konnte nicht geladen werden</h1>
    <p>Die angefragte Seite ist leider nicht erreichbar</p>
    <v-btn tile outlined color="error" class="mt-12" @click="$router.go(-1)"
      >zurück</v-btn
    >
  </div>
</template>

<style lang="scss" scoped>
.not-found {
  height: 80vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
