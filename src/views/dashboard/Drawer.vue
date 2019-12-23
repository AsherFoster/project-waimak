<template>
  <v-navigation-drawer
          app
          :mini-variant="mini"
          mobile-break-point="600"
          :class="mini && 'mini'"
  >
    <v-layout column fill-height>
      <v-flex>
        <img :src="staticBase + (mini ? '/img/icon.svg' : '/img/lockup.svg')" alt="Canal" class="logo">
        <v-list :class="mini || 'pt-0'" nav>
          <v-tooltip v-for="link in links" :key="link.name" right :disabled="!mini">
            <template v-slot:activator="{ on }">
              <v-list-item v-on="on" :to="link.path" :exact="link.path === '/'">
                <v-list-item-action>
                  <v-icon>{{link.icon}}</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>{{link.name}}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <span>{{link.name}}</span>
          </v-tooltip>
        </v-list>
      </v-flex>
      <v-spacer></v-spacer>
      <!-- Nav expansion arrow -->
      <v-flex shrink v-if="mini">
        <v-list>
          <v-list-item v-if="mini" @click="mini = !mini">
            <v-list-item-action>
              <v-icon>arrow_forward</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-flex>
      <!-- Bottom icon and toolbar -->
      <v-flex shrink v-if="user">
        <v-toolbar class="bottom-toolbar transparent" flat>
          <v-menu min-width="200" offset-x>
            <template v-slot:activator="{ on }">
              <v-badge overlap :value="user.admin">
                <template v-slot:badge>
                  <AdministratorBadge></AdministratorBadge>
                </template>
                <v-avatar size="38" class="avatar" v-on="on">
                  <img :src="user.avatarUrl" />
                </v-avatar>
              </v-badge>
            </template>
            <v-card>
              <div class="options-user" @click.stop>
                <p class="subheading">{{user.name}}</p>
                <p class="caption">{{user.email}}</p>
              </div>
              <v-divider></v-divider>
              <v-list>
                <v-list-item to="/settings">
                  <v-list-item-action>
                    <v-icon>settings</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Settings</v-list-item-title>
                </v-list-item>
                <v-list-item to="/about">
                  <v-list-item-action>
                    <v-icon>info</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>About</v-list-item-title>
                </v-list-item>
                <v-list-item @click="logout">
                  <v-list-item-action>
                    <v-icon>exit_to_app</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Logout</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
          <v-toolbar-title class="ml-2">
            <span class="subheading">
              {{user.name}}
            </span>
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="mini = !mini" v-if="!mini">
            <v-icon>arrow_left</v-icon>
          </v-btn>
        </v-toolbar>
      </v-flex>
    </v-layout>
  </v-navigation-drawer>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {namespace} from 'vuex-class';
  import AdministratorBadge from '@/components/AdministratorBadge.vue';
  import {STATIC_BASE} from '@/constants';

  const auth = namespace('auth');

  interface User {
    id: string;
    name: string;
    email: string;
    avatarUrl: string;
    admin: boolean;
  }
  @Component({
    components: {
      AdministratorBadge
    }
  })
  export default class Drawer extends Vue {
    public readonly staticBase: string = STATIC_BASE;
    public mini: boolean = localStorage.getItem('mini-drawer') === '1';
    @auth.State('user') public user!: User | null;
    @auth.Action('logout') public logout!: () => void;
    public links = [
      {
        icon: 'dashboard',
        name: 'Home',
        path: '/'
      },
      {
        icon: 'description',
        name: 'Modules',
        path: '/workspaces'
      }
    ];
    @Watch('mini')
    public onMiniChange(v: boolean) {
      localStorage.setItem('mini-drawer', (+v).toString());
    }

    public created() {
      if (this.user && this.user.admin) {
        this.links = this.links.concat([
                {
                  icon: 'account_circle',
                  name: 'Users',
                  path: '/users'
                },
                {
                  icon: 'bug_report',
                  name: 'Debug',
                  path: '/debug'
                }
          ]);
      }
    }
  }
</script>

<style scoped>
  .logo {
    margin: 6px 0;
    transition: margin-left 0.2s;
    max-height: 60px;
  }
  .mini .logo {
    margin-left: 10px;
  }
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
