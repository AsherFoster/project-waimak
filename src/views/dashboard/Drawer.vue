<template>
  <v-navigation-drawer
          app
          :mini-variant="mini"
          mobile-break-point="600"
  >
    <v-layout column fill-height>
      <v-flex>
        <v-toolbar flat class="transparent" v-if="!mini">
          <v-toolbar-title>DSB Web</v-toolbar-title>
        </v-toolbar>
        <v-list :class="mini || 'pt-0'">
          <v-tooltip v-for="link in links" :key="link.name" right :disabled="!mini">
            <v-list-tile slot="activator" @click="$router.push(link.path)">
              <v-list-tile-action>
                <v-icon>{{link.icon}}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{link.name}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <span>{{link.name}}</span>
          </v-tooltip>
        </v-list>
      </v-flex>
      <v-list v-if="mini">
        <v-list-tile v-if="mini" @click="mini = !mini">
          <v-list-tile-action>
            <v-icon>arrow_forward</v-icon>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
      <v-toolbar class="bottom-toolbar transparent" flat>
        <v-menu min-width="200">
          <v-avatar size="38" class="avatar" slot="activator">
            <img :src="avatarUrl">
          </v-avatar>
          <v-card>
            <div class="options-user">
              <p class="subheading">{{user.username}}</p>
              <p class="caption">#{{user.discriminator}}</p>
            </div>
            <v-divider></v-divider>
            <v-list>
              <v-list-tile @click="">
                <v-list-tile-action>
                  <v-icon>settings</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>Settings</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="$router.push('/dashboard/about')">
                <v-list-tile-action>
                  <v-icon>info</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>About</v-list-tile-title>
              </v-list-tile>
              <v-list-tile @click="logout">
                <v-list-tile-action>
                  <v-icon>exit_to_app</v-icon>
                </v-list-tile-action>
                <v-list-tile-title>Logout</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-menu>
        <v-toolbar-title>
          <span class="subheading">{{user.username}}</span>
          <span class="caption grey--text">#{{user.discriminator}}</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="mini = !mini" v-if="!mini">
          <v-icon>arrow_left</v-icon>
        </v-btn>
      </v-toolbar>
    </v-layout>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import {User} from '@/rest/account';
  import { Component, Vue } from 'vue-property-decorator';
  import {namespace} from 'vuex-class';

  const auth = namespace('auth');

  @Component({
    watch: {
      mini(v: boolean) {
        localStorage.setItem('mini-drawer', (+v).toString());
      }
    }
  })
  export default class Drawer extends Vue {
    public mini: boolean = localStorage.getItem('mini-drawer') === '1';
    @auth.State('user') public user!: User;
    @auth.Getter('avatarUrl') public avatarUrl!: string;
    @auth.Action('logout') public logout!: () => void;
    public links = [
      {
        icon: 'dashboard',
        name: 'Home',
        path: '/dashboard'
      },
      {
        icon: 'android',
        name: 'Bots',
        path: '/dashboard/bots'
      },
      {
        icon: 'description',
        name: 'Scripts',
        path: '/dashboard/scripts'
      },
      {
        icon: 'account_circle',
        name: 'Users',
        path: '/dashboard/users'
      },
      {
        icon: 'bug_report',
        name: 'Debug',
        path: '/dashboard/debug'
      }
    ];
  }
</script>

<style scoped>
  .transparent {
    background: transparent;
  }
  .bottom-toolbar >>> .v-toolbar__content {
    padding-left: 20px;
  }
  .avatar:hover {
    opacity: 0.7;
    transition: opacity 0.4s;
  }
  .options-user{
    padding: 12px 12px 0;
  }
  .options-user .subheading {
    margin-bottom: 0;
  }
</style>
