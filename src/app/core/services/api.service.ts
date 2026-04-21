import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../enviroment/environment';
import {
  ApiQueryParams,
  ApiQueryParamValue,
  ApiRequestOptions,
} from '../models/api/api-request-options.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl.replace(/\/+$/, '');

  constructor(private readonly http: HttpClient) {}

  get<TResponse>(endpoint: string, options?: ApiRequestOptions): Observable<TResponse> {
    return this.http.get<TResponse>(this.buildUrl(endpoint), this.buildOptions(options));
  }

  post<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: ApiRequestOptions,
  ): Observable<TResponse> {
    return this.http.post<TResponse>(this.buildUrl(endpoint), body, this.buildOptions(options));
  }

  put<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: ApiRequestOptions,
  ): Observable<TResponse> {
    return this.http.put<TResponse>(this.buildUrl(endpoint), body, this.buildOptions(options));
  }

  patch<TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options?: ApiRequestOptions,
  ): Observable<TResponse> {
    return this.http.patch<TResponse>(this.buildUrl(endpoint), body, this.buildOptions(options));
  }

  delete<TResponse>(endpoint: string, options?: ApiRequestOptions): Observable<TResponse> {
    return this.http.delete<TResponse>(this.buildUrl(endpoint), this.buildOptions(options));
  }

  private buildUrl(endpoint: string): string {
    const normalizedEndpoint = endpoint.replace(/^\/+/, '');

    return `${this.baseUrl}/${normalizedEndpoint}`;
  }

  private buildOptions(options?: ApiRequestOptions): {
    headers?: HttpHeaders | Record<string, string | string[]>;
    params?: HttpParams;
  } {
    return {
      headers: options?.headers,
      params: this.buildHttpParams(options?.params),
    };
  }

  private buildHttpParams(params?: ApiQueryParams): HttpParams | undefined {
    if (!params) {
      return undefined;
    }

    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          httpParams = httpParams.append(key, this.serializeParamValue(item));
        });

        return;
      }

      httpParams = httpParams.set(key, this.serializeParamValue(value));
    });

    return httpParams;
  }

  private serializeParamValue(
    value: Exclude<ApiQueryParamValue, null | undefined | ApiQueryParamValue[]>,
  ): string {
    if (value instanceof Date) {
      return value.toISOString();
    }

    return String(value);
  }
}
