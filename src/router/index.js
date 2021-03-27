import Vue from "vue";
import VueRouter from "vue-router";

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}
Vue.use(VueRouter);

const routes = [{ //	登录路由
		path: "/Log",
		name: "Log",
		component: () => import("../views/Log.vue"),
	},
	{ // 首页路由
		path: "/",
		name: "Index",
		component: () => import("../views/Index.vue"),
		children: [{ // 应用管理路由
			path: '/Application',
			name: 'Application',
			component: () => import("../views/ApplicationManagement.vue")
		}, { // 我的桌面路由
			path: '/MyDesktop',
			name: 'MyDesktop',
			component: () => import("../views/MyDesktop.vue")
		}]
	},
];

const router = new VueRouter({
	routes
});

export default router;
