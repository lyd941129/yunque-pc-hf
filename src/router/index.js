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
		meta: {
			title: '云雀登录'
		},
		component: () => import("../views/Log.vue"),
	},
	{ // 首页路由
		path: "/",
		name: "Index",
		meta: {
			title: '云雀后台'
		},
		component: () => import("../views/Index.vue"),
		children: [{ // 应用管理路由
			path: '/Application',
			name: 'Application',
			meta: {
				title: '应用管理'
			},
			component: () => import("../views/ApplicationManagement.vue")
		}, { // 我的桌面路由
			path: '/MyDesktop',
			name: 'MyDesktop',
			meta: {
				title: '我的桌面'
			},
			component: () => import("../views/MyDesktop.vue")
		}]
	},
];

const router = new VueRouter({
	routes
});

router.beforeEach((to, from, next) => {
	window.document.title = to.meta.title == undefined ? '云雀后台' : to.meta.title
	next();
})

export default router;
