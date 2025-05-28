import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postDeposit } from "./apiClient";
import { BALANCE_QUERY_KEY } from "./useBalance";
import { useExpectedRevision } from "./useExpectedRevision";

export function useDeposit() {
  const queryClient = useQueryClient();
  const { actualize } = useExpectedRevision();

  return useMutation({
    mutationFn: postDeposit,
    onSuccess: (updateResponse) => {
      actualize(updateResponse.revision);
      queryClient.removeQueries({ queryKey: [BALANCE_QUERY_KEY] });
    },
  });
}
