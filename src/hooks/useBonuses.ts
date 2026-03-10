import {
  assignBonus,
  AssignBonusPayload,
  deleteBonus,
  getBonusSummary,
  getEmployeesWithBonuses,
  listBonuses,
  BonusListParams,
  BonusSummary,
  EmployeesWithBonusParams,
} from "@/services/bonus/bonus.service";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const BONUS_KEYS = {
  all: ["bonuses"] as const,
  list: (params: BonusListParams) => ["bonuses", "list", params] as const,
  summary: (params: BonusListParams) => ["bonuses", "summary", params] as const,
  withEmployees: (params: EmployeesWithBonusParams) =>
    ["bonuses", "employees-with-bonuses", params] as const,
};

export function useBonuses(params: BonusListParams = {}) {
  return useQuery({
    queryKey: BONUS_KEYS.list(params),
    queryFn: () => listBonuses(params),
  });
}

export function useBonusSummary(params: BonusListParams = {}) {
  return useQuery({
    queryKey: BONUS_KEYS.summary(params),
    queryFn: () => getBonusSummary(params),
  });
}

export function useEmployeesWithBonuses(
  params: EmployeesWithBonusParams,
  enabled = true,
) {
  return useQuery({
    queryKey: BONUS_KEYS.withEmployees(params),
    queryFn: () => getEmployeesWithBonuses(params),
    enabled,
  });
}

export function useBonusesByEmployees(employeeIds: string[]) {
  const results = useQueries({
    queries: employeeIds.map((id) => ({
      queryKey: BONUS_KEYS.list({ employeeId: id }),
      queryFn: () => listBonuses({ employeeId: id }),
      enabled: employeeIds.length > 0,
    })),
  });
  const data = results.flatMap((r) => r.data ?? []);
  const isLoading = results.some((r) => r.isLoading);
  return { data, isLoading };
}

export function useAssignBonus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AssignBonusPayload) => assignBonus(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BONUS_KEYS.all });
    },
  });
}

export function useDeleteBonus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteBonus(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: BONUS_KEYS.all });
    },
  });
}
