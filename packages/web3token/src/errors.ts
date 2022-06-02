
export class TokenExpiredError extends Error {
  name = 'TokenExpiredError';

  expiredAt: number;

  constructor(expiredAt: number) {
    super('w3t expired');
    this.expiredAt = expiredAt;
  }
}

export class Web3TokenError extends Error { name = 'Web3TokenError' }

export class TokenPrematureError extends Error { 
  name = 'TokenPrematureError';
  vaildAt: number;

  constructor(vaildAt: number) {
    super('w3t premature');
    this.vaildAt = vaildAt;
  }
}