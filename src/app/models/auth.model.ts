export interface AuthResponse {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

export interface SignUpRequest {
  email: string;
  password: string;
  returnSecureToken: boolean;
}

export interface SignInRequest {
  email: string;
  password: string;
  returnSecureToken: boolean;
}
