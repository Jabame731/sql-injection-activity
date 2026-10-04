import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, tap, throwError } from 'rxjs';

export interface AuthUser {
  id: string;
  role: string; // e.g. "admin" | "user" — comes from the backend's `type` field
  username: string;
  name: string;
  created_at: string;
}

// Matches the backend's actual UserResponse shape:
// { id, type, attributes: { username, name, created_at } }
interface UserResponseDto {
  id: string;
  type: string;
  attributes: {
    username: string;
    name: string;
    created_at: string;
  };
}

// Matches loginUserIn's Result<SuccessResponse<UserResponse>, ErrorResponse>
interface LoginResponse {
  success: boolean;
  data?: {
    statusCode: number;
    message: string;
    data: UserResponseDto;
  };
  error?: {
    errorMessage: string;
    statusCode: number;
  };
}

function toAuthUser(dto: UserResponseDto): AuthUser {
  return {
    id: dto.id,
    role: dto.type,
    username: dto.attributes.username,
    name: dto.attributes.name,
    created_at: dto.attributes.created_at,
  };
}

const API_BASE = 'http://localhost:8800';
const STORAGE_KEY = 'crew_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<AuthUser | null>(this.readStoredUser());

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthUser> {
    return this.http.post<LoginResponse>(`${API_BASE}/api/auth/login`, { username, password }).pipe(
      map((res) => {
        console.log(res);

        if (!res.success || !res.data?.data) {
          throw new Error(res.error?.errorMessage ?? 'Invalid credentials.');
        }
        return toAuthUser(res.data?.data);
      }),
      tap((user) => this.setUser(user)),
      catchError((err: HttpErrorResponse | Error) => {
        const message =
          err instanceof HttpErrorResponse
            ? (err.error?.error?.errorMessage ??
              err.error?.errorMessage ??
              'Unable to sign in. Check your details and try again.')
            : err.message;
        return throwError(() => new Error(message));
      }),
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  private setUser(user: AuthUser): void {
    this.currentUser.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  private readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }
}
