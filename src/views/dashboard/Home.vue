<template>
  <v-container fill-height>
    <v-layout>
      <v-card>
        <v-card-title primary-title>
          <v-avatar size="38" class="avatar" slot="activator">
            <img :src="avatarUrl">
          </v-avatar>
          <span class="title ml-2">Pointless Bot</span>
        </v-card-title>
        <v-layout>
          <v-flex xs8 ma-4>
            <div>
              <v-sparkline
                      :value="sparkline"
                      color="#9c27b0"
                      :line-width="3"
                      :smooth="5"
                      auto-draw
              ></v-sparkline>
            </div>
          </v-flex>
          <v-flex xs4 ma-4 style="text-align: right">
            <v-layout wrap>
              <v-flex sm6>
                <p class="display-2">504</p>
                <p class="caption">Messages sent</p>
              </v-flex>
              <v-flex sm6>
                <p class="display-2">32</p>
                <p class="caption">Guilds</p>
              </v-flex>
              <v-flex sm6>
                <p class="display-2">12</p>
                <p class="caption">Scripts running</p>
              </v-flex>
              <v-flex sm6>
                <p class="display-2">32</p>
                <p class="caption">Guilds</p>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import {namespace} from 'vuex-class';

  const auth = namespace('auth');

  @Component({})
  export default class Home extends Vue {
    public stats: string[][] = [];
    public sparkline = Array.from({length: 24}, this.sparklineValue);
    @auth.Getter('avatarUrl') public avatarUrl!: string;

    public sparklineValue() {
      return Math.floor(Math.random() * 10);
    }
    public created() {
      this.stats.push([Math.PI.toString().substr(0, 7), 'is pi']);
      this.stats.push([this.$store.state.auth.user.id as string, 'is you']);
    }
  }
</script>
