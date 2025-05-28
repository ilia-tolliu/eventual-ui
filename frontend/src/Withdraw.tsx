import type { ReactNode } from "react";
import { useBalance } from "./useBalance";
import { useWithdraw } from "./useWithdraw";

export function Withdraw(): ReactNode {
  const { balance } = useBalance();
  const { mutate: postWithdraw, isPending, isError, error } = useWithdraw();

  const submit = (formData: FormData) => {
    if (!balance) {
      return;
    }

    const amount = parseInt(formData.get("amount") as string);
    const expectedRevision = balance.revision;
    postWithdraw({ amount, expectedRevision });
  };

  return (
    <form action={submit} className="bg-white shadow-md rounded px-8 py-6">
      <input
        name="amount"
        placeholder="Amount"
        type="number"
        min={1}
        required
        className="shadow appearance-none border rounded w-full py-2 px-3 mb-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />

      <button
        type="submit"
        disabled={isPending || !balance}
        className="shadow bg-red-500 hover:bg-red-700 disabled:bg-red-200 text-white font-bold w-full py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Withdraw
      </button>

      {isError && (
        <div className="text-red-500 font-bold pt-4">{error.message}</div>
      )}
    </form>
  );
}
