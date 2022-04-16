<template>
	<div :id="this.name" class="map-view ">
		<div class="hidden">
			{{ this.data }}
		</div>
	</div>
</template>

<style scoped>
@import url("https://js.arcgis.com/4.23/esri/themes/light/main.css");
.map-view {
	height: 100%;
	width: 100%;
	padding: 10px;
	position: relative;
}
canvas {
  /* object-fit: cover; */
}
</style>

<script>
import arcGISMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Multipoint from "@arcgis/core/geometry/Multipoint";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import { geographicToWebMercator } from "@arcgis/core/geometry/support/webMercatorUtils";

export default {
	name: "WebMap",

	props: ["msg", "name", "info"],

	data: () => ({

	}),

	computed: {
		data() {
			let map, view, graphicsLayer, simpleMarkerSymbol, pointGraphic;
			if (!this.info) {
				return;
			}

			map = new arcGISMap({
				basemap: "topo-vector",
			});

			view = new MapView({
				map,
				spatialReference: SpatialReference.WebMercator,
				container: this.name,
				center: this.info.point.length > 0 ? [this.info.point[0][0], this.info.point[0][1]] : null ,
				zoom: 2,
			});
			if(this.info.point.length > 0){
				graphicsLayer = new GraphicsLayer();
				map.add(graphicsLayer);
				
				// this.info.point.forEach((item, index) => {
				// 	let geom = new Point({
				// 		x: item[0],
				// 		y: item[1],
				// 		type: "point",
				// 		SpatialReference: SpatialReference.WGS84,
				// 	})
				// 	simpleMarkerSymbol = {
				// 		type: "text",
				// 		text: this.info.city[index],
				// 		color: 'black', // Orange
				// 		outline: {
				// 			color: [255, 255, 255], // White
				// 			width: 1,
				// 		},
				// 	};
				// 	let newGeometry = geographicToWebMercator(geom);
				// 	pointGraphic = new Graphic({
				// 		geometry: newGeometry,
				// 		symbol: simpleMarkerSymbol,
				// 	});
				// 	graphicsLayer.add(pointGraphic)
				// });

				simpleMarkerSymbol = {
					type: "simple-marker",
					color: [226, 119, 40], // Orange
					outline: {
						color: [255, 255, 255], // White
						width: 1,
					},
				};

				let geometry = new Multipoint({
					points: this.info.point,
					type: "Multipoint",
					SpatialReference: SpatialReference.WGS84,
				});

				console.log(1,this.name, geometry)
				let newGeometry = geographicToWebMercator(geometry);
				console.log(2,this.name, newGeometry)

				pointGraphic = new Graphic({
					geometry: newGeometry,
					symbol: simpleMarkerSymbol,
				});

				graphicsLayer.add(pointGraphic);
			}

			return null;
		},
	},
};
</script>
