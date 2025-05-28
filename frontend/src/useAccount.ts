import { useSuspenseQuery } from "@tanstack/react-query";
import { getAccount } from "./apiClient";

export const ACCOUNT_QUERY_KEY = "ACCOUNT_QUERY_KEY";

export function useAccount() {
  const { data: account } = useSuspenseQuery({
    queryKey: [ACCOUNT_QUERY_KEY],
    queryFn: async () => {
      const account = await getAccount();

      return account;
    },
  });

  return { account };
}
