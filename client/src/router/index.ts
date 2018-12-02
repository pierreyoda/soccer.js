import Vue from "vue";
import Router from "vue-router";

import Home from "@/views/Home.vue";
import Game from "@/views/Game.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/play",
      name: "play",
      component: Game,
    },
    {
      path: "/about",
      name: "about",
      component: () => import(/* webpackChunkName: "about" */ "@/views/About.vue"),
    },
  ],
});
