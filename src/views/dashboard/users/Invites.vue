<template>
    <v-content style="max-width: 90%">
        <h2>Invite key creation machine</h2>
        <v-slider
                v-model="lifespan"
                label="Key lifetime (hours)"
                ticks="always"
                min="1"
                max="48"
                step="2"
                thumb-label
                style="max-width: 90%"
        ></v-slider>
        <v-btn accent @click="generate()">Generate!</v-btn>
        <div>
            <v-layout v-if="key">
                <v-text-field style="max-width: 400px" :value="link" readonly></v-text-field>
                <CopyText :value="link"></CopyText>
            </v-layout>
            <span class="caption">{{key}}</span>
        </div>
    </v-content>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import gql from 'graphql-tag';
    import CopyText from '@/components/CopyText.vue';

    @Component({
        components: {
            CopyText
        }
    })
    export default class Invites extends Vue {
        public lifespan: number = 24;
        public key: string | null = null;
        public async generate() {
            this.key = (await this.$apollo.mutate({
                mutation: gql`mutation CreateInviteKey($lifespan: Int) {
createInviteKey(lifespan: $lifespan)
}`,
                variables: {
                    lifespan: this.lifespan * 60 * 60 * 1000 // API wants ms
                }
            })).data.createInviteKey;
        }
        public get link() {
            return 'https://canal.nz/invite?' + this.key;
        }
    }
</script>

<style scoped>

</style>
