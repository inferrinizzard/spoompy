interface ApiResponse {
  body: unknown;
  headers: Record<string, string>;
  statusCode: number;
}

export const handleRateLimitedError = <R extends ApiResponse>(res: R): R => {
  if (res.statusCode === 429) {
    console.info('Rate limit reached !');
    console.log(res);
  }

  return res;
};

export const throwError = (error: unknown): never => {
  throw new Error(error as string);
};
