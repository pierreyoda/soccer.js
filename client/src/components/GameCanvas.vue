<template>
  <div class="w-full" ref="container">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import Game from "../game";
import { setTimeout } from "timers";

@Component
export default class GameCanvas extends Vue {
  @Prop(String) clientId!: string;
  private game!: Game;

  mounted() {
    const clientIdTemp = 'test-1';
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    this.game = new Game(canvas, clientIdTemp);
    this.game.simulation.addPlayer(clientIdTemp, 0);
    this.game.simulation.addPlayer('test-2', 1);
    this.game.simulation.start();
  }
}
</script>
