export class OutdatedError extends Error {
  constructor(public readonly projectionName: string) {
    super(`${projectionName} is outdated; please refetch`);
  }
}

export class TechnicalError extends Error {
  constructor(
    public readonly httpCode: number,
    public readonly message: string,
  ) {
    super(`HTTP ${httpCode}: ${message}`);
  }
}

export class BusinessError extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}
