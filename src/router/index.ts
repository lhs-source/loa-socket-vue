import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/test",
    name: "Test",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/GetData.vue"),
  },
  {
    path: "/trade-rate",
    name: "TradeRate",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/TradeRate.vue"),
  },
  // {
  //   path: "/acc-list",
  //   name: "AccList",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AccList.vue"),
  // },
  // {
  //   path: "/acc-list-legend",
  //   name: "AccListLegend",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AccListLegend.vue"),
  // },
  {
    path: "/acc-list-remote",
    name: "AccListRemote",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AccListRemote.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
