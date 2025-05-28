import { Balance } from "./Balance";
import { Deposit } from "./Deposit";
import { Withdraw } from "./Withdraw";

export function App() {
  return (
    <div className="h-screen w-full sm:p-6">
      <div className="grid gap-6 w-full min-w-xs max-w-lg mx-auto">
        <Balance className="sm:col-span-2" />
        <Deposit />
        <Withdraw />
      </div>
    </div>
  );
}
