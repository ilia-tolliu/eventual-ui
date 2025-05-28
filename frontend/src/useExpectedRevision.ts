import { useQuery, useQueryClient } from "@tanstack/react-query";

const EXPECTED_REVISION_QUERY_KEY = "EXPECTED_REVISION_QUERY_KEY";

export function useExpectedRevision() {
  const queryClient = useQueryClient();

  const { data: expectedRevision } = useQuery({
    queryKey: [EXPECTED_REVISION_QUERY_KEY],
    queryFn: () => 0,
    initialData: 0,
  });

  const actualize = (revision: number) => {
    if (revision > expectedRevision) {
      queryClient.setQueryData([EXPECTED_REVISION_QUERY_KEY], revision);
    }
  };

  return {
    expectedRevision,
    actualize,
  };
}
