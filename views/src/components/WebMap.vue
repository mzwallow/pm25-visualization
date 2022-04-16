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
}
</style>

<script>
import arcGISMap from "@arcgis/core/WebMap";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Multipoint from "@arcgis/core/geometry/Multipoint";
import Geometry from "@arcgis/core/geometry/Geometry";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import TileInfo from "@arcgis/core/layers/support/TileInfo";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils";
import * as projection from "@arcgis/core/geometry/projection";
import { geographicToWebMercator } from '@arcgis/core/geometry/support/webMercatorUtils';

export default {
	name: "WebMap",

	props: ["msg", "name", "info"],

	data: () => ({}),

	computed: {
		data() {
			let map, view, graphicsLayer, simpleMarkerSymbol, pointGraphic;

			if (!this.info) {
				return;
			}

			map = new arcGISMap({
				basemap: "topo-vector",
			});


			simpleMarkerSymbol = {
				type: "simple-marker",
				color: [226, 119, 40], // Orange
				outline: {
					color: [255, 255, 255], // White
					width: 1,
				},
			};
			view = new MapView({
				map,
				// extent: {
				// 	xmin: -118.98364392089809,
				// 	ymin: 33.64236255586565,
				// 	xmax: -117.5073560791019,
				// 	ymax: 34.3638389963474,
				// 	spatialReference: 4326,
				// },
				extent: {
					xmin: -9177882,
					ymin: 4246761,
					xmax: -9176720,
					ymax: 4247967,
					spatialReference: SpatialReference.WebMercator,
				},
				spatialReference: SpatialReference.WebMercator,
				zoom: 2,
				constraints: {
					lods: TileInfo.create({
						// create the LODs to match the spatial reference of the view
						spatialReference: SpatialReference.WGS84,
					}).lods,
				},
				container: this.name,
				center: [this.info[0][0], this.info[0][1]],
				zoom: 11,
			});
			graphicsLayer = new GraphicsLayer();
			map.add(graphicsLayer);

			let geometry = new Multipoint({
				points: this.info,
				type: "Multipoint",
				SpatialReference: {
					wkid: 4326
				}
			});

			console.log('x', geometry)
			let projectedPoints = projection.project(geometry, SpatialReference.WebMercator);
			console.log('y',projectedPoints)
			let canProjectWGS84toWebMercator = webMercatorUtils.canProject(SpatialReference.WGS84, SpatialReference.WebMercator);
			console.log(canProjectWGS84toWebMercator)
			let newGeometry = geographicToWebMercator(geometry)
			console.log('z',newGeometry)

			// geometry = projection.project(geometry, SpatialReference.WGS84)

			pointGraphic = new Graphic({
				geometry: newGeometry,
				symbol: simpleMarkerSymbol,
			});

			graphicsLayer.add(pointGraphic);
			view.when(() => {
				console.log("moo");
			});

			return null;
		},
	},
};
</script>
