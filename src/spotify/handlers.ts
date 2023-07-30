interface ApiResponse {
  body: unknown;
  headers: Record<string, string>;
  statusCode: number;
}

export const handleRateLimitedError = <R extends ApiResponse>(res: R) => {
  if (res.statusCode === 429) {
    console.info('Rate limit reached !');
  }

  return res;
};

export const throwError = (error: unknown) => {
  throw new Error(error as string);
};
