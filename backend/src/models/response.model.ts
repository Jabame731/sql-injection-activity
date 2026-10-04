export type Success<T> = {
  success: true;
  data: T;
};

export type Failure<E> = {
  success: false;
  error: E;
};

export type Result<T, E> = Success<T> | Failure<E>;

export type SuccessResponse<T = undefined> = {
  statusCode: number;
  message: string;
  data?: T;
};

export type ErrorResponse = {
  statusCode: number;
  errorMessage: string;
};
