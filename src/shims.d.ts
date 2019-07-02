declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '*.graphql' {
  const value: string;
  export default value;
}

// declare module 'raven-js/plugins/vue' {
//   const RavenVue: any;
//   export default RavenVue;
// }
