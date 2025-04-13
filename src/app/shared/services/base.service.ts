import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, retry, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthenticationService } from '../../iam/services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class BaseService<T> {
  basePath: string = `${environment.serverBasePath}`;
  resourceEndpoint: string = '/resource';
  farmerId: number | null = null;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    }),
  };

  constructor(protected http: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error occurred ${error.error.message}`);
    } else {
      console.log(
        `Backend returned code ${error.status}, body was ${error.error}`,
      );
    }
    return throwError(
      () =>
        new Error('Something happened with request, please try again later'),
    );
  }

  protected resourcePath() {
    return `${this.basePath}${this.resourceEndpoint}`;
  }

  create(item: T): Observable<T> {
    return this.http
      .post<T>(this.resourcePath(), JSON.stringify(item), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  createWithFile(formData: FormData): Observable<any> {
    const httpOptionsWithAuth = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    };

    return this.http
      .post(this.resourcePath(), formData, httpOptionsWithAuth)
      .pipe(retry(2), catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  update(id: number, item: T): Observable<T> {
    return this.http
      .put<T>(
        `${this.resourcePath()}/${id}`,
        JSON.stringify(item),
        this.httpOptions,
      )
      .pipe(retry(2), catchError(this.handleError));
  }

  getAll(): Observable<T[]> {
    return this.http
      .get<T[]>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getById(id: number): Observable<T> {
    return this.http
      .get<T>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  getByCustomPath(customPath: string): Observable<T[]> {
    return this.http
      .get<T[]>(`${this.resourcePath()}/${customPath}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
