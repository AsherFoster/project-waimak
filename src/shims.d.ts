declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.graphql' {
  const value: string;
  export default value;
}

// declare module 'vuetify/lib' {
//   const Vuetify: any;
//   export default Vuetify;
// }

// declare module 'vue' {
//   tslint:disable-next-line:no-empty-interface
  // interface Vue {

  // }
// }

// declare module 'raven-js/plugins/vue' {
//   const RavenVue: any;
//   export default RavenVue;
// }
