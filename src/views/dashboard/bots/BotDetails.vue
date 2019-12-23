<template>
  <div v-if="bot">
    <v-toolbar>
      <v-avatar class="mr-4">
        <img :src="bot.avatarUrl" />
      </v-avatar>
      <v-toolbar-title>{{bot.name}}</v-toolbar-title>
<!--      <span v-if="selected.length">{{selected.length}} script{{selected.length > 1 ? 's' : ''}} selected</span>-->
      <v-flex />
      <v-btn icon :disabled="!selected.length" @click="removeSelected">
        <v-icon>link_off</v-icon>
      </v-btn>
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>more_vert</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item @click="refreshList">
              <v-list-item-action>
                <v-icon>refresh</v-icon>
              </v-list-item-action>
              <v-list-item-title>
                Reload List
              </v-list-item-title>
            </v-list-item>
            <v-list-item @click="() => copy(inviteLink)">
              <v-list-item-action>
                <v-icon>file_copy</v-icon>
              </v-list-item-action>
              <v-list-item-title>
                Copy Invite Link
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-toolbar>
    <v-data-table
            :headers="tableHeaders"
            :items="bot.modules.nodes"
            show-select
            v-model="selected"
            hide-default-footer
            item-key="module.id"
    >
      <template v-slot:item.created="{ item }">
        {{item.created | cMomentNow}}
      </template>
      <template v-slot:item.state="{ item }">
        {{item.state | cScriptState}}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-layout justify-end>
          <v-menu>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-list>
                <v-list-item @click="removeModule(item.module.id)">
                  <v-list-item-action>
                    <v-icon>link_off</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Stop</v-list-item-title>
                </v-list-item>
                <v-list-item :to="'/workspaces/' + item.module.workspace.id + '/modules/' + item.module.id">
                  <v-list-item-action>
                    <v-icon>info</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Details</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-layout>
      </template>
      <template v-slot:no-data>No modules linked</template>
    </v-data-table>
    <v-tooltip left>
      <template #activator="{ on }">
        <v-btn fab color="accent" fixed bottom right v-on="on" @click="attaching = true">
          <v-icon>link</v-icon>
        </v-btn>
      </template>
      <span>Attach new Module</span>
    </v-tooltip>
    <SelectModuleToAttach v-model="attaching" :bot="bot.id" />
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';
  import CopyText from '@/components/CopyText.vue';
  import {copy} from '@/util';
  import WithTooltip from '@/components/WithTooltip.vue';
  import SelectModuleToAttach from '@/components/SelectModuleToAttach.vue';

  interface BotQueryResult {
    id: string;
    name: string;
    avatarUrl?: string;
    created: Date;
    modules: ModuleLink[];
  }
  interface ModuleLink {
    module: {
      id: string;
      name: string;
      workspace: {
        id: string;
      };
    };
    created: Date;
    state: string;
  }

  @Component({
    components: {SelectModuleToAttach, WithTooltip, CopyText},
    apollo: {
      bot: {
        query: gql`query GetBotDetails($id: String!) {
  bot(id: $id) {
    id
    name
    avatarUrl
    created
    modules {
      totalCount
      nodes {
        module {
          workspace {
            id
          }
          id
          name
        }
        created
        state
      }
    }
  }
}`,
        variables() {
          return {
            id: this.$route.params.id
          };
        }
      }
    }
  })
  export default class BotDetails extends Vue {
    public bot: BotQueryResult | null = null;
    public attaching: boolean = false;

    public get inviteLink(): string {
      if (!this.bot) return '';
      return `https://discordapp.com/oauth2/authorize?client_id=${this.bot.id}&scope=bot`;
    }
    public readonly tableHeaders = [
      {
        text: 'Name',
        value: 'module.name'
      },
      {
        text: 'Added',
        value: 'created'
      },
      {
        text: 'State',
        value: 'state'
      },
      {
        text: '',
        value: 'actions',
        sortable: false,
        align: 'end'
      }
    ];
    public selected: ModuleLink[] = [];
    public async refreshList(): Promise<void> {
      await this.$apollo.queries.bot.refetch();
    }

    public async removeModule(id: string, reloadAfter: boolean = true): Promise<void> {
      if (!this.bot) return;
      await this.$apollo.mutate({
        mutation: gql`
mutation RemoveScriptFromBot($bot: String!, $module: String!) {
  removeModuleFromBot(bot: $bot, module: $module)
}
        `,
        variables: {
          bot: this.bot.id,
          module: id
        }
      });
      if (reloadAfter) this.refreshList();
    }

    // public async restartSelected() {
    //   return Promise.all(this.selected.map((s) => this.restartModule(s.module.id, false)));
    // }
    public async removeSelected() {
      return Promise.all(this.selected.map((s) => this.removeModule(s.module.id), false));
    }

    public copy = (t: string) => copy(t);
  }
</script>

<style scoped>

</style>
