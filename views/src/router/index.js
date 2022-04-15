import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		redirect: "/home",
	},
	{
		path: "/home",
		name: "my-home",
		component: () => import("../views/my-home.vue"),
	},
];

const router = new VueRouter({
	routes,
});

export default router;
