<template>
  <div>
    <v-expansion-panels v-if="bot && bot.permissions.length">
      <v-expansion-panel
              v-for="perm in bot.permissions"
              :key="perm.id"
      >
        <v-expansion-panel-header v-slot="{ open }">{{open ? '' : perm.name}}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <!-- Header -->
          <v-hover>
            <template slot-scope="{hover}">
              <v-text-field
                      :flat="!hover"
                      solo
                      class="perm-title-input pt-0 mt-0 pb-4"
                      hide-details
                      v-model="perm.name"
                      @input="perm.edited = true"
              ></v-text-field>
            </template>
          </v-hover>
          <v-divider></v-divider>
          <!-- Add area -->
          <v-layout align-center pl-4 pa-2>
            <v-flex shrink>
              <v-select
                      :items="qualTypes"
                      dense
                      style="max-width: 100px"
                      v-model="addQual.type"
              ></v-select>
            </v-flex>
            <v-flex shrink>
              <v-text-field v-model="addQual.value"></v-text-field>
            </v-flex>
            <v-flex>
              <v-btn text @disabled="!addQual.type || !addQual.value" @click="doAddQual(perm, addQual)">Add</v-btn>
            </v-flex>
            <v-flex></v-flex>
          </v-layout>
          <!-- Existing quals -->
          <v-list>
            <v-hover v-for="qual in perm.qualifiers.filter(q => !q.delete)" :key="qual.id">
              <v-list-item slot-scope="{hover}">
                <v-select
                        :items="qualTypes"
                        v-model="qual.type"
                        @input="qual.edited = true"
                        dense
                        style="max-width: 100px"
                ></v-select>
                <v-flex shrink>
                  <v-text-field
                          v-model="qual.value"
                          @input="qual.edited = true"
                  ></v-text-field>
                </v-flex>
                <v-btn icon :style="`opacity: ${hover ? 1 : 0}`" @click="deleteQualifier(qual)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-list-item>
            </v-hover>
          </v-list>
          <v-layout>
            <v-flex></v-flex>
            <p v-if="edited(perm)" class="caption pt-2 mb-0">You have unsaved changes</p>
            <v-btn text color="error" @click="deletePermission(perm)">Delete</v-btn>
            <v-btn :disabled="!edited(perm)" @click="savePermission(perm)">Save</v-btn>
          </v-layout>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-layout v-else-if="!bot" align-center justify-center>
      <v-progress-circular></v-progress-circular>
    </v-layout>
    <v-layout v-else-if="bot && !bot.permissions.length" align-center justify-center>
      <p class="my-6">No Permissions for this bot</p>
    </v-layout>
    <v-btn fab fixed bottom right>
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';

  type QualifierType = 'USER'|'ROLE'|'GUILD'|'CHANNEL';

  interface Permission {
    id: string;
    name: string;
    edited: boolean;
    qualifiers: PermissionQualifier[];
  }
  interface PermissionUpdateInput {
    id: string;
    name?: string;
    qualifiers: PermissionQualifierUpdateInput[];
  }
  interface PermissionQualifier {
    id: string;
    edited: boolean;
    fake?: true;
    delete: boolean;
    type: QualifierType;
    value: string;
  }
  interface PermissionQualifierUpdateInput {
    id?: string;
    delete?: true;
    name?: string;
    value?: string;
  }
  interface QueryResult {
    permissions: Permission[];
  }

  @Component({
    apollo: {
      bot() {
        return {
          query: gql`
query GetPermissionsForBot($bot: String!) {
  bot(id: $bot) {
    id
    permissions {
      id
      name
      qualifiers {
        id
        type
        value
      }
    }
  }
}
          `,
          variables() {
            return {
              bot: this.$route.params.id
            };
          },
          result(res: {data: {bot: {permissions: Permission[]}}}) {
            res.data.bot.permissions.forEach((p, i) => {
              this.$set(p, 'edited', false);
              res.data.bot.permissions[i].qualifiers.forEach((q) => {
                this.$set(q, 'edited', false);
                this.$set(q, 'delete', false);
              });
            });
          }
        };
      }
    }
  })
  export default class BotPermissions extends Vue {
    public readonly qualTypes: QualifierType[] = ['USER', 'ROLE', 'CHANNEL', 'GUILD'];
    public bot: QueryResult | null = null;
    public addQual: {type: QualifierType, value: string} = {type: 'USER', value: ''};

    public deleteQualifier(qualifier: PermissionQualifier): void {
      // If it's already marked as edited, update that record
      qualifier.edited = true;
      qualifier.delete = true;
    }
    public async deletePermission(perm: Permission): Promise<void> {
      await this.$apollo.mutate({
        mutation: gql`mutation DeletePermissionFromBot($perm: String!) {
  deleteBotPermission(perm: $perm)
}`,
        variables: {
          perm: perm.id
        }
      });
    }
    public async savePermission(perm: Permission): Promise<void> {
      const resp = await this.$apollo.mutate({
        mutation: gql`mutation UpdatePermissionForBot($perm: BotPermissionUpdateInput!) {
  updateBotPermission(perm: $perm) {
     id
     name
     qualifiers {
       id
       type
       value
     }
  }
}`,
        variables: {
          perm: {
            id: perm.id,
            name: perm.edited ? perm.name : undefined,
            qualifiers: this.makeQualInputs(perm.qualifiers)
          } as PermissionUpdateInput
        }
      });
      perm.name = resp.data.updateBotPermission.name;
      perm.qualifiers = resp.data.updateBotPermission.qualifiers;
    }
    public makeQualInputs(qualifiers: PermissionQualifier[]): PermissionQualifierUpdateInput[] {
      return qualifiers.map((q) => {
        // No need to update if it hasn't changed
        if (!q.edited) return null;
        // If it's only ever existed clientside
        if (q.fake && q.delete) return null;
        if (q.delete) return {id: q.id, delete: true};
        return {
          id: q.fake ? undefined : q.id, // If it's fake, then the server will create the ID
          type: q.type,
          value: q.value
        };
      }).filter((q) => q !== null) as PermissionQualifierUpdateInput[];
    }
    public doAddQual(perm: Permission, newQual: {type: QualifierType, value: string}): void {
      const tempKey = Math.random().toString(36);
      perm.qualifiers.push({
        id: tempKey,
        edited: true,
        delete: false,
        fake: true,
        type: newQual.type,
        value: newQual.value
      });
      newQual.value = '';
    }
    public edited(perm: Permission): boolean {
      return perm.edited || perm.qualifiers.some((q) => q.edited);
    }
  }
</script>

<style scoped>
  .perm-title-input {
    font-size: 1.5rem;
  }
</style>
