<template>
  <section class="flex flex-col md:flex-row hero">
    <div class="w-full md:w-2/5 flex flex-col items-center p-12">
      <div class="flex flex-col items-center justify-center hero-img-container">
        <img alt="Vue logo" src="../assets/logo.png" class="hero-img">
      </div>
      <router-link to="/play"
        class="bg-sjs-teal-500 hover:bg-sjs-teal-700 py-2 px-4 rounded font-bold text-xl text-white">
        Play now!
      </router-link>
    </div>
    <div class="w-full md:w-3/5 flex flex-col items-start py-8 px-8 text-left">
      <h2 class="font-bold text-sjs-teal-700 text-5xl mb-3">
        Soccer.js
      </h2>
      <p class="font-semibold text-sjs-teal-700 mb-12">
        Soccer.js is a free, open-source multiplayer top-down football game
        based on physics and teamplay.<br><br>
        Open-source clone of Haxball.
      </p>
      <div class="flex flex-col items-start">
        <div v-for="(feature, i) in features" :key="i"
          class="flex flex-row items-center justify-start hero-feature">
          <div class="flex flex-col items-center justify-center icon-container">
            <component class="icon" :is="feature.iconComponent" />
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

import IconServer from "../assets/icons/icon-server.svg";
import IconChart from "../assets/icons/icon-chart.svg";
import IconUserCircle from "../assets/icons/icon-user-circle.svg";
import IconCode from "../assets/icons/icon-code.svg";

interface Feature {
  iconComponent: string;
  title: string;
  description: string;
}

@Component({
  components: {
    IconServer,
    IconChart,
    IconUserCircle,
    IconCode,
  },
})
export default class Home extends Vue {
  readonly features: Feature[] = [
    {
      iconComponent: "IconServer",
      title: "Authoritative server",
      description: "A centralized server architecture for lag compensation and anti-cheat protection.",
    },
    {
      iconComponent: "IconChart",
      title: "Statistics",
      description: "Live statistics on the match in progress.",
    },
    {
      iconComponent: "IconUserCircle",
      title: "Accounts",
      description: "An optional, free player accounts system.",
    },
    {
      iconComponent: "IconCode",
      title: "Open-source",
      description: "A fully open-source code under the MIT license. Contributions are welcome!",
    },
  ];
}
</script>

<style lang="scss" scoped>
.hero-img-container {
  @apply w-auto h-full;
  max-height: 400px;
  @screen md {
    max-height: 500px;
  }
  img {
    @apply w-full h-auto max-w-full;
  }
}

.hero-feature {
  @apply mb-8;
  &:last-child {
    @apply mb-0;
  }
  .icon-container {
    @apply rounded-full bg-sjs-blue-grey-100 mr-6;
    $size: 50px;
    width: $size;
    height: $size;
    .icon {
      $icon-size: 0.6 * $size;
      width: $icon-size;
      height: $icon-size;
      .primary {
        fill: white;
      }
      .secondary {
        fill: #199473;
      }
    }
  }
}
</style>
