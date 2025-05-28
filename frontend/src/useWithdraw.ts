import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postWithdraw } from "./apiClient";
import { BALANCE_QUERY_KEY } from "./useBalance";
import { useExpectedRevision } from "./useExpectedRevision";

export function useWithdraw() {
  const queryClient = useQueryClient();
  const { actualize } = useExpectedRevision();

  return useMutation({
    mutationFn: postWithdraw,
    onSuccess: (updateResponse) => {
      actualize(updateResponse.revision);
      queryClient.removeQueries({ queryKey: [BALANCE_QUERY_KEY] });
    },
  });
}
