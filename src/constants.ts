type EnvName = 'production' | 'beta' | 'development';
type EnvDict = {[prop in EnvName]: string};

const env: EnvName = (process.env.NODE_ENV || 'development') as EnvName;

const apiHosts: EnvDict = {
  production: 'https://api.canal.nz',
  beta: 'https://api.beta.canal.nz',
  development: 'http://localhost:4080'
};

export const API_BASE = apiHosts[env];

const siteHosts: EnvDict = {
  production: 'https://canal.nz',
  beta: 'https://beta.canal.nz',
  development: 'http://localhost:3000'
};
export const SITE_BASE = siteHosts[env];

const appHosts: EnvDict = {
  production: 'https://app.canal.nz',
  beta: 'https://app.beta.canal.nz',
  development: 'http://localhost:8081'
};
export const APP_BASE = appHosts[env];

const staticHosts: EnvDict = {
  production: siteHosts.production + '/static',
  beta: siteHosts.beta + '/static',
  development: siteHosts.beta + '/static'
};

export const STATIC_BASE = staticHosts[env];

export const DOCS_URL = 'https://www.notion.so/Canal-Documentation-c782021e27d64d628f09ce2db902bec6';
