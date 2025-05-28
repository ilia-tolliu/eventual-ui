import { useQuery } from "@tanstack/react-query";
import { getBalance } from "./apiClient";
import { BusinessError } from "./errors";
import { useExpectedRevision } from "./useExpectedRevision";

export const BALANCE_QUERY_KEY = "BALANCE_QUERY_KEY";

export function useBalance() {
  const { expectedRevision, actualize } = useExpectedRevision();

  const { data: balance } = useQuery({
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: [BALANCE_QUERY_KEY],
    queryFn: async () => {
      const balance = await getBalance(expectedRevision);
      actualize(balance.revision);

      return balance;
    },
    retry: (attempt, error) => {
      return attempt <= 3 || error instanceof BusinessError;
    },
    retryDelay: 1000,
  });

  return {
    balance,
  };
}
