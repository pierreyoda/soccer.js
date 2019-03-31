<template>
  <section class="flex flex-col md:flex-row hero">
    <div class="w-full md:w-1/2 flex flex-col items-center p-12">
      <div class="hero-img-container">
        <img alt="Vue logo" src="../assets/logo.png" class="hero-img">
      </div>
      <router-link to="/play"
        class="bg-sjs-teal-500 hover:bg-sjs-teal-700 py-2 px-4 rounded font-bold text-xl text-white">
        Play now!
      </router-link>
    </div>
    <div class="w-full md:w-1/2 flex flex-col items-start py-8 px-8 text-left">
      <h2 class="font-bold text-sjs-teal-700 text-5xl mb-3">
        Soccer.js
      </h2>
      <p class="font-semibold text-sjs-teal-700 mb-12">
        Soccer.js is a free, open-source multiplayer top-down football-like game
        based on physics and teamplay.<br><br>
        Open-source clone of Haxball.
      </p>
      <div class="flex flex-col items-start">
        <div v-for="(feature, i) in features" :key="i"
          class="flex flex-row items-center justify-start hero-feature">
          <div class="flex flex-col items-center justify-center icon-container">
            <img class="icon" :src="feature.iconImg" :alt="feature.title">
          </div>
          <div class="flex flex-col items-start text-left">
            <h4 class="font-bold text-sjs-blue-grey-800">
              {{ feature.title }}
            </h4>
            <p class="font-semibold text-sm text-sjs-blue-grey-900">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

interface Feature {
  iconImg: string;
  title: string;
  description: string;
}

@Component
export default class Home extends Vue {
  readonly features: Feature[] = [
    {
      iconImg: require("../assets/icons/icon-server.svg"),
      title: "Authoritative server",
      description: "A centralized server architecture for lag compensation and anti-cheat protection.",
    },
    {
      iconImg: require("../assets/icons/icon-chart.svg"),
      title: "Statistics",
      description: "Live statistics on the match in progress.",
    },
    {
      iconImg: require("../assets/icons/icon-user-circle.svg"),
      title: "Accounts",
      description: "An optional, free player accounts system.",
    },
    {
      iconImg: require("../assets/icons/icon-code.svg"),
      title: "Open-source",
      description: "A fully open-source code under the MIT license. Contributions are welcome!",
    },
  ];
}
</script>

<style lang="scss" scoped>
.hero-img-container {
  width: auto;
  height: 400px;
  @screen md {
    height: 500px;
  }
  img {
    width: auto;
    height: 100%;
    max-width: 100%;
  }
}

.hero-feature {
  @apply mb-8;
  &:last-child {
    @apply mb-0;
  }
  .icon-container {
    @apply rounded-full bg-sjs-blue-grey-200 mr-6;
    $size: 50px;
    width: $size;
    height: $size;
    .icon {
      width: $size / 2;
      height: $size / 2;
    }
  }
}
</style>
