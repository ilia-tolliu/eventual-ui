import type { ReactNode } from "react";
import { useBalance } from "./useBalance";
import { useAccount } from "./useAccount";

interface Props {
  className?: string;
}

export function Balance({ className }: Props): ReactNode {
  const { account } = useAccount();
  const { balance } = useBalance();

  const balancePlaceholder = "__";
  const balanceInteger = balance ? balance.amount : balancePlaceholder;
  const balanceFraction = (
    <span className="text-4xl">{balance ? ",00" : ""}</span>
  );

  const datePlaceholder = "__ / __ / ____, __:__:__";

  return (
    <div
      className={`bg-white shadow-md rounded overflow-hidden ${className || ""}`}
    >
      <div className="py-4 px-8 font-bold bg-blue-400 flex justify-between items-baseline text-xl text-white">
        <div>Balance</div>
        <div>
          Acc No: <span className="tabular-nums">{account.accountNo}</span>
        </div>
      </div>
      <div className="flex flex-col gap-4 mx-8 mb-8 mt-6">
        <div className="leading-10 text-6xl">
          {balanceInteger}
          {balanceFraction}
        </div>

        <div>
          <dt className="font-bold">Updated at:</dt>
          {balance ? (
            <dd>{new Date(balance.updatedAt).toLocaleString()}</dd>
          ) : (
            datePlaceholder
          )}
        </div>
      </div>
    </div>
  );
}
