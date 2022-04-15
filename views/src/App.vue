<template>
  <v-app>
    <v-app-bar
      class="nav"
      app
      color="amber darken-4"
      dark
    > 
    <h2 class="logo">
      Spatial Database
    </h2>
    </v-app-bar>

    <v-main>
      <v-container fluid style="height: 100vh">
				<router-view></router-view>
			</v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
  .logo{
    text-align: center;
    margin-left: 2rem;
  }
  .nav{
    justify-content: center;
  }
</style>

<script>

export default {
  name: 'App',
  data: () => ({
    //
  }),

};
</script>
