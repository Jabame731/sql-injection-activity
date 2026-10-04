export interface User {
  id: string;
  username: string;
  name: string;
  password: string;
  role: string;
  created_at: Date;
}

export interface RegisterUser {
  username: string;
  name: string;
  password: string;
  role: string;
}

export interface LoginUser {
  username: string;
  password: string;
}

export interface UserAttr {
  username: string;
  name: string;
  created_at: Date;
}

export interface UserResponse {
  id: string;
  type: string;
  attributes: UserAttr;
}
