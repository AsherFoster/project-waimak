const apiHosts: {[propName: string]: string} = {
  production: 'https://api.canal.nz',
  beta: 'https://api.beta.canal.nz',
  default: 'http://localhost:4080'
};

export const API_BASE = apiHosts[process.env.NODE_ENV as string] || apiHosts.default;

const appBases: {[propName: string]: string} = {
  production: 'https://canal.nz',
  beta: 'https://beta.canal.nz',
  default: 'http://localhost:8081'
};
export const SITE_BASE = appBases[process.env.NODE_ENV as string] || appBases.default;

export const DOCS_URL = 'https://www.notion.so/Canal-Documentation-c782021e27d64d628f09ce2db902bec6';
