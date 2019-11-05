const apiHosts: {[propName: string]: string} = {
  production: 'https://api.canal.nz',
  beta: 'https://api.beta.canal.nz',
  default: 'http://localhost:4080'
};

export const API_BASE = apiHosts[process.env.NODE_ENV as string] || apiHosts.default;

const siteHosts: {[propName: string]: string} = {
  production: 'https://canal.nz',
  beta: 'https://beta.canal.nz',
  default: 'http://localhost:3000'
};
export const SITE_BASE = siteHosts[process.env.NODE_ENV as string] || siteHosts.default;

const appHosts: {[propName: string]: string} = {
  production: 'https://app.canal.nz',
  beta: 'https://app.beta.canal.nz',
  default: 'http://localhost:8081'
};
export const APP_BASE = appHosts[process.env.NODE_ENV as string] || appHosts.default;

export const DOCS_URL = 'https://www.notion.so/Canal-Documentation-c782021e27d64d628f09ce2db902bec6';
