<template>
  <v-container class="page">
      <v-card class="card">
          <v-card-title>ข้อ 4</v-card-title>
          <div class="card-content">
            <v-btn @click="get4a"> Tesxst </v-btn>
          </div>
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


    methods: {
        get4a(){
            console.log('kuy')
        },
        get4b(){

        },
        get4c(){

        },
        get4d(){

        },
    },
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