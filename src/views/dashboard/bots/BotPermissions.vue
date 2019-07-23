<template>
  <div>
    <v-expansion-panel>
      <v-expansion-panel-content
              v-for="perm in permissions"
              :key="perm.id"
      >
        <template v-slot:header>{{perm.name}}</template>

        <v-card>
          <v-layout align-center pa-2>
            <v-flex shrink>
              <v-select
                      :items="qualTypes"
                      dense
                      style="max-width: 100px"
              ></v-select>
            </v-flex>
            <v-flex shrink>
              <v-text-field></v-text-field>
            </v-flex>
            <v-flex>
              <v-btn flat>Add</v-btn>
            </v-flex>
            <v-flex></v-flex>
          </v-layout>
          <v-list>
            <v-hover>
              <v-list-tile v-for="qual in perm.qualifiers" :key="qual.value" slot-scope="{hover}">
                {{qual.type}}: {{qual.value}}
                <v-btn icon v-if="hover">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-list-tile>
            </v-hover>
          </v-list>
          <v-card-actions>
            <v-flex></v-flex>
            <v-btn flat>Rename</v-btn>
            <v-btn flat>Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-btn fab fixed bottom right>
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  type QualifierType = 'user'|'role'|'guild'|'channel';

  interface Permission {
    id: string;
    name: string;
    qualifiers: PermissionQualifier[];
  }
  interface PermissionQualifier {
    type: QualifierType;
    value: string;
  }

  @Component({})
  export default class BotPermissions extends Vue {
    public headers = [
      {
        text: 'Name',
        value: 'name'
      },
      {
        text: '',
        value: 'actions',
        sortable: false
      }
    ];
    public readonly qualTypes = ['user', 'role', 'channel', 'guild'];
    public permissions: Permission[] = [{
      id: '191698332014346243',
      name: 'OWNER',
      qualifiers: [{
        type: 'user',
        value: '191698332014346242'
      },
        {
          type: 'user',
          value: '191698332014346243'
        }]
    },
      {
        id: '191698332014346244',
        name: 'ADMIN',
        qualifiers: [{
          type: 'role',
          value: '191698332014346244'
        }]
      }];
  }
</script>

<style scoped>

</style>
