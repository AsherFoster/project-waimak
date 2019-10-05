<template>
    <v-list>
        <v-list-item v-for="user in users" :key="user.id">
            <v-list-item-avatar>
                <v-img :src="user.avatarUrl"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
                <v-list-item-title>
                    {{user.name}}
                    <AdministratorBadge v-if="user.admin"></AdministratorBadge>
                </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
                <v-menu>
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon small>
                            <v-icon>more_vert</v-icon>
                        </v-btn>
                    </template>
                    <v-card>
                        <v-layout align-center row class="menu-header">
                            <CopyText :value="user.id"></CopyText>
                            <p class="subheading">{{user.id}}</p>
                        </v-layout>
                        <v-divider></v-divider>
                        <v-list>
                            <v-list-item @click="destroySessions(user.id)">
                                <v-list-item-action>
                                    <v-icon>lock</v-icon>
                                </v-list-item-action>
                                <v-list-item-title>Destroy Sessions</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="setAdmin(user.id, !user.admin)">
                                <v-list-item-action>
                                    <v-icon>security</v-icon>
                                </v-list-item-action>
                                <v-list-item-title>{{user.admin ? 'Demote from' : 'Promote to'}} admin</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="deleteUser(user.id)">
                                <v-list-item-action>
                                    <v-icon>delete_forever</v-icon>
                                </v-list-item-action>
                                <v-list-item-title>Delete User (wip)</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-menu>
            </v-list-item-action>
        </v-list-item>
    </v-list>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import gql from 'graphql-tag';
    import AdministratorBadge from '@/components/AdministratorBadge.vue';
    import CopyText from '@/components/CopyText.vue';

    interface User {
        id: string;
        name: string;
        avatarUrl: string;
        admin: boolean;
    }

    @Component({
        components: {
            AdministratorBadge,
            CopyText
        },
        apollo: {
            users: gql`query ListAllUsers {
  users {
    id
    name
    avatarUrl
    admin
  }
}`
        }
    })
    export default class UserList extends Vue {
        public users: User[] = [];

        reload() {
            this.$apollo.queries.users.refetch();
        }
        async destroySessions(userId: string) {
            await this.$apollo.mutate({
                mutation: gql`mutation DestroyUserSessions($user: String!) {
    destroyAllSessions(user: $user)
}`,
                variables: {
                    user: userId
                }
            })
        }

        async setAdmin(userId: string, to: boolean) {
            await this.$apollo.mutate({
                mutation: gql`mutation SetUserAdmin($user: String!, $value: Boolean) {
  setUserFlag(user: $user, name: "isAdmin", value: $value)
}`,
                variables: {
                    user: userId,
                    value: to ? true : null
                }
            })
        }

        deleteUser(userId: string) {
            return false; // TODO implement popups, etc
        }
    }
</script>

<style scoped>
    .menu-header{
        padding-left: 12px;
    }
    .menu-header .subheading {
        margin-bottom: 0;
    }
</style>
