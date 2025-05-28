import { BusinessError, TechnicalError } from "./errors";
import type {
  Account,
  Balance,
  DepositRequest,
  UpdateResponse,
  WithdrawRequest,
} from "./types";

export async function getAccount(): Promise<Account> {
  const req = new Request("/api/query/account");
  const account = await send<Account>(req);

  return account;
}

export async function getBalance(expectedRevision: number): Promise<Balance> {
  const query =
    expectedRevision > 0 ? `?expected_revision=${expectedRevision}` : "";
  const req = new Request(`api/query/balance${query}`);
  const balance = await send<Balance>(req);

  return balance;
}

export async function postDeposit(
  depositRequest: DepositRequest,
): Promise<UpdateResponse> {
  const req = new Request("/api/command/deposit", {
    method: "POST",
    body: JSON.stringify(depositRequest),
  });

  const res = await send<UpdateResponse>(req);

  return res;
}

export async function postWithdraw(
  withdrawRequest: WithdrawRequest,
): Promise<UpdateResponse> {
  const req = new Request("/api/command/withdraw", {
    method: "POST",
    body: JSON.stringify(withdrawRequest),
  });

  const res = await send<UpdateResponse>(req);

  return res;
}

async function send<T>(req: Request): Promise<T> {
  const headers = req.headers;
  headers.set("Content-Type", "application/json");
  req = new Request(req, { headers });

  const resp = await fetch(req);
  const json = await resp.json();

  if (resp.ok) {
    return json;
  }

  if (resp.status === 409) {
    throw new BusinessError(json.error);
  }

  throw new TechnicalError(resp.status, resp.statusText);
}
