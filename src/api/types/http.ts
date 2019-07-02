export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'UPDATE';
export interface Headers {
  [headerName: string]: string;
}
