<template>
  <v-container class="page">
      <v-card class="card">
          <v-card-title>ข้อ 4 - a</v-card-title>
          <h3 class="ml-4 mb-4">List country and city names whose PM 2.5 values are greater than 50 in 2015.</h3>
          <div class="card-content">
            <v-btn class="ml-3 align-self-center mb-3" @click="get4a"> GET ANSWER </v-btn>
          </div>
      </v-card>
      <v-card class="card">
          <v-card-title>ข้อ 4 - b</v-card-title>
          <h3 class="ml-4 mb-4">Calculate the AVG(PM 2.5) by country (show the results in a decreasing order).</h3>
          <div class="card-content">
            <v-btn class="ml-3 align-self-center mb-3" @click="get4b"> GET ANSWER </v-btn>
          </div>
      </v-card>
      <v-card class="card">
          <v-card-title>ข้อ 4 - c</v-card-title>
          <h3 class="ml-4 mb-4">Given a 'country_input' from the user, show a historical PM 2.5 values by year.</h3>
          <div class="card-content">
            <v-btn class="ml-3 align-self-center mb-3" @click="get4c" > GET ANSWER </v-btn>
            <p class="align-self-center">ใส่ประเทศ : </p>
            <v-text-field class="card-input" v-model="country4c"></v-text-field>
          </div>
      </v-card>
      <v-card class="card">
          <v-card-title>ข้อ 4 - d</v-card-title>
          <h3 class="ml-4 mb-4">Given a 'year_input' and an input of 'color_pm25' level of health concern
from the user, calculate a total of the affected population (in number).</h3>
          <div class="card-content">
            <v-btn class="ml-3 align-self-center mb-3" @click="get4d"> GET ANSWER </v-btn>
            <p class="align-self-center pa-0">ใส่ปี : </p>
            <v-text-field class="card-input" v-model="year4d"></v-text-field>
            <p class="align-self-center pa-0">ใส่ color : </p>
            <v-text-field class="card-input" v-model="color4d"></v-text-field>
          </div>
      </v-card>

      <v-card class="card-map">
        <v-card-title>ข้อ 5 - a</v-card-title>
        <h3 class="ml-4 mb-4">Given a 'year_input' from the user, visualize all the city points of all countries.</h3>
        <div class="card-content">
            <v-btn class="ml-3 align-self-center mb-3" @click="get5a"> GET ANSWER </v-btn>
            <p class="align-self-center pa-0">ใส่ปี : </p>
            <v-text-field class="card-input" v-model="year5a"></v-text-field>
        </div>
        <WebMap msg="96cf806c32874026bef5f586315f098c" :info="data1" name="5a" />
      </v-card>
      <v-card class="card-map">
        <v-card-title>ข้อ 5 - b</v-card-title>
        <h3 class="ml-4 mb-4">Visualize the 50 closest city points to Bangkok.</h3>
        <WebMap msg="96cf806c32874026bef5f586315f098c" :info="data2" name="5b"  />
      </v-card> 
      <v-card class="card-map"> 
        <v-card-title>ข้อ 5 - c</v-card-title>
        <h3 class="ml-4 mb-4">Visualize all the city points of Thailand’s neighboring countries in 2018.</h3>
        <WebMap msg="96cf806c32874026bef5f586315f098c" :info="data3" name="5c"  />
      </v-card> 
      <v-card class="card-map"> 
        <v-card-title>ข้อ 5 - d</v-card-title>
        <h3 class="ml-4 mb-4">Visualize the four points of MBR covering all city points in Thailand in 2009.</h3>
        <WebMap msg="96cf806c32874026bef5f586315f098c" :info="data4" name="5d"  />
      </v-card> 
      <v-card class="card-map"> 
        <v-card-title>ข้อ 5 - e</v-card-title>
        <h3 class="ml-4 mb-4">Visualize all city points of countries having the highest no. of city points in 2011.</h3>
        <WebMap msg="96cf806c32874026bef5f586315f098c" :info="data5" name="5e"  />
      </v-card> 
      <v-card class="card-map"> 
        <v-card-title>ข้อ 5 - f</v-card-title>
        <h3 class="ml-4 mb-4">Given a 'year_input' from the user, visualize all the city points which are
considered as “low income” (as specified in column wbinc16_text).</h3>
        <div class="card-content">
            <v-btn class="ml-3 align-self-center mb-3" @click="get5f"> GET ANSWER </v-btn>
            <p class="align-self-center pa-0">ใส่ปี : </p>
            <v-text-field class="card-input" v-model="year5f"></v-text-field>
        </div>
        <WebMap msg="96cf806c32874026bef5f586315f098c" :info="data6" name="5f"  />
      </v-card>
  </v-container>
</template>

<style scoped>
.page{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px
}

p{
    margin: 0 1rem;
    padding: 0;
}
.card{
    padding: 0.5rem;
    width: 1000px;
    overflow: hidden;
}
.card-map{
    padding: 0.5rem;
    width: 1000px;
    height: 1000px;
}
.card-content{
    display: flex;
    flex-direction: row;
    align-content: center;
}
.card-input{
    margin-left: 0 1rem;
    padding: 0 1rem;
    width: 30%;
}

</style>

<script>
import WebMap from '../components/WebMap.vue';

export default {
    components: {
        WebMap
    },

    data: () => ({
        country4c: 'Italy',
        year4d: 2000,
        color4d: 'red',
        year5a: '2016',
        year5f: '2016',
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
            this.$store.dispatch('get4c', {country: this.country4c})
            },
        get4d(){
            this.$store.dispatch('get4d', {year: this.year4d, color: this.color4d})
        },

        get5a(){
            this.$store.dispatch('get5a', {year: this.year5a})
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
            this.$store.dispatch('get5f', {year: this.year5f})
        },
    },
}
</script>

