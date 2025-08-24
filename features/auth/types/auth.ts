export type LoginFormValues = {
  username: string;
  password: string;
};

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface SignupResponse {
  message: string;
  access?: string;
  refresh?: string;
}

export interface LogoutResponse {
  detail: string; 
}

