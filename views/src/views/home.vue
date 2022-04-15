<template>
  <v-container class="page">
      <v-card class="card">
          <v-card-title>ข้อ 4 - a</v-card-title>
          <div class="card-content">
            <v-btn @click="get4a"> GET ANSWER </v-btn>
          </div>
      </v-card>
      <v-card class="card">
          <v-card-title>ข้อ 4 - b</v-card-title>
          <div class="card-content">
            <v-btn @click="get4b"> GET ANSWER </v-btn>
          </div>
      </v-card>
      <v-card class="card">
          <v-card-title>ข้อ 4 - c</v-card-title>
          <div class="card-content">
            <v-btn @click="get4c" > GET ANSWER </v-btn>
            <v-text-field v-model="country"></v-text-field>
          </div>
      </v-card>
      <v-card class="card">
          <v-card-title>ข้อ 4 - d</v-card-title>
          <div class="card-content">
            <v-btn @click="get4d"> GET ANSWER </v-btn>
            <v-text-field v-model="year"></v-text-field>
          </div>
      </v-card>
      <v-card class="card">
        <v-card-title>MAP</v-card-title>
        <WebMap msg="96cf806c32874026bef5f586315f098c" />
      </v-card>
  </v-container>
</template>

<script>
import WebMap from '../components/WebMap.vue';

export default {
    components: {
        WebMap
    },

    data: () => ({
        country: '',
        year: 2000,
	}),

    methods: {
        get4a(){
            this.$store.dispatch('get4a')
        },
        get4b(){
            this.$store.dispatch('get4b')
        },
        get4c(){
            this.$store.dispatch('get4c', {country: this.country})
            },
        get4d(){
            this.$store.dispatch('get4d', {year: this.year})
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