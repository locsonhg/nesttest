export interface TypeResponseSuccess<T> {
  message: string;
  data: T;
  status: number;
}

export interface TypeResponseError {
  message: string;
  status: number;
}
