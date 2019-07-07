<template>
  <div v-if="script">
    <v-toolbar>
      <v-btn icon to="/dashboard/scripts">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>{{script.name}}</v-toolbar-title>
    </v-toolbar>
    <v-content>
      <code>{{script.body}}</code>
    </v-content>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';

  @Component({
    apollo: {
      script() {
        return {
          query: gql`query GetScriptDetails($id: String!) {
  script(id: $id) {
    id
    name
    body
  }
}`,
          variables: {
            id: this.$route.params.id
          }
        };
      }
    }
  })
  export default class Detail extends Vue {
  }
</script>

<style scoped>

</style>
