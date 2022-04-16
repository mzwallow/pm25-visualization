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
        <v-card-title>ข้อ 5a</v-card-title>
        <WebMap msg="96cf806c32874026bef5f586315f098c" :info="data1" name="5a" />
      </v-card>
      <v-card class="card">
          <v-card-title>ข้อ 5b</v-card-title>
        <WebMap msg="96cf806c32874026bef5f586315f098c" :info="data2" name="5b"  />
      </v-card> 
      <v-card class="card"> 
          <v-card-title>ข้อ 5c</v-card-title>
        <WebMap msg="96cf806c32874026bef5f586315f098c" :info="data3" name="5c"  />
      </v-card> 
      <v-card class="card"> 
          <v-card-title>ข้อ 5d</v-card-title>
        <WebMap msg="96cf806c32874026bef5f586315f098c" :info="data4" name="5d"  />
      </v-card> 
      <v-card class="card"> 
          <v-card-title>ข้อ 5e</v-card-title>
        <WebMap msg="96cf806c32874026bef5f586315f098c" :info="data5" name="5e"  />
      </v-card> 
      <v-card class="card"> 
          <v-card-title>ข้อ 5f</v-card-title>
        <WebMap msg="96cf806c32874026bef5f586315f098c" :info="data6" name="5f"  />
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
        country: 'Italy',
        year: 2000,
	}),

    created(){
        this.get5a()
        this.get5b()
        this.get5c()
        this.get5d() 
        this.get5e()
        this.get5f()
    },

    computed: {
        data1(){
            return this.$store.getters.data5a
        },
        data2(){
            return this.$store.getters.data5b
        },
        data3(){
            return this.$store.getters.data5c
        },
        data4(){
            return this.$store.getters.data5d
        },
        data5(){
            return this.$store.getters.data5e
        },
        data6(){
            return this.$store.getters.data5f
        }
    },

    methods: {
        // 4a -> OnClick
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

        // Start Call 
        get5a(){
            this.$store.dispatch('get5a', {year: 2016})
        },
        get5b(){
            this.$store.dispatch('get5b')
        },
        get5c(){
            this.$store.dispatch('get5c')
            },
        get5d(){
            this.$store.dispatch('get5d')
        },
        get5e(){
            this.$store.dispatch('get5e')
        },
        get5f(){
            this.$store.dispatch('get5f', {year: 2016})
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