<template>
  <div class="map-view">
  </div>
</template>

<style scoped>
  @import url("https://js.arcgis.com/4.23/esri/themes/light/main.css");
  .map-view {
    height: 100%;
    width: 100%;
  }
</style>

<script>
  import arcGISMap from '@arcgis/core/WebMap';
  import MapView from '@arcgis/core/views/MapView'

  export default {
    name: 'WebMap',

    props: ['msg'],

    data: () => ({
      
    }),

    mounted(){
      const map = new arcGISMap({
        portalItem: {
          id: this.msg
        }
      });

      const view = new MapView({
        map,
        container: this.$el
      });

      view.when(() => {
        console.log('moo')
      })
    }
  }
</script>
