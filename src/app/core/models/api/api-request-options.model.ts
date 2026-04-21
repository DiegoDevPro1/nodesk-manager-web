import { HttpHeaders } from '@angular/common/http';

export type ApiQueryParamScalar = string | number | boolean | Date;

export type ApiQueryParamValue = ApiQueryParamScalar | ApiQueryParamScalar[] | null | undefined;

export type ApiQueryParams = Record<string, ApiQueryParamValue>;

export interface ApiRequestOptions {
  params?: ApiQueryParams;
  headers?: HttpHeaders | Record<string, string | string[]>;
}
