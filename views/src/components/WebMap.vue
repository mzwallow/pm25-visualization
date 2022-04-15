<template>
  <div id="viewDiv" class="map-view">
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
  import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
  import Graphic from '@arcgis/core/Graphic'

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
        center: [-118.80500,34.02700],
        zoom: 13,
        container: 'viewDiv'
      });

      const graphicsLayer = new GraphicsLayer();
      map.add(graphicsLayer);

      const point = { //Create a point
          type: "point",
          longitude: -118.80657463861,
          latitude: 34.0005930608889
      };
      const simpleMarkerSymbol = {
          type: "simple-marker",
          color: [226, 119, 40],  // Orange
          outline: {
              color: [255, 255, 255], // White
              width: 1
          }
      };
      const pointGraphic = new Graphic({
          geometry: point,
          symbol: simpleMarkerSymbol
      });

      graphicsLayer.add(pointGraphic);

      view.when(() => {
        console.log('moo')
      })
    }
  }
</script>
