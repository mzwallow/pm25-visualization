<template>
  <v-container class="page">
      <v-card class="card">
          <v-card-title>ข้อ 4</v-card-title>
      </v-card>
      <v-card class="card">
          <v-card-title>ข้อ 4</v-card-title>
      </v-card>
      <v-card class="card">
          <v-card-title>ข้อ 4</v-card-title>
      </v-card>
  </v-container>
</template>

<script>
export default {
    data: () => ({

	}),
}
</script>

<style scoped>
.page{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px
}
.card{
    padding: 0.5rem;
    width: 1000px;
    height: 500px;
}

</style>