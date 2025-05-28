export interface Account {
  accountNo: string;
}

export interface Balance {
  amount: number;
  revision: number;
  updatedAt: string;
}

export interface DepositRequest {
  amount: number;
  expectedRevision: number;
}

export interface WithdrawRequest {
  amount: number;
  expectedRevision: number;
}

export interface UpdateResponse {
  revision: number;
}
