import {
  downloadMyPayslip,
  getMyActiveSalary,
  getMyBonuses,
  getMyEmployeeProfile,
  getMyPayslips,
} from "@/services/employee/employee-self.service";
import { getMyLoans } from "@/services/loans/loans.service";
import {
  getProfile,
  updateProfile,
  changePassword,
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  getMyBankAccount,
  addBankAccount,
  updateBankAccount,
  BankAccountPayload,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "@/services/user/user.service";
import { EmergencyContactPayload } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const MY_DATA_KEYS = {
  profile: ["my", "profile"] as const,
  salary: ["my", "salary"] as const,
  bonuses: ["my", "bonuses"] as const,
  payslips: ["my", "payslips"] as const,
  loans: ["my", "loans"] as const,
  userProfile: ["user", "profile"] as const,
  emergencyContacts: ["user", "emergency-contacts"] as const,
  bankAccount: ["user", "bank-account"] as const,
};

export function useMyEmployeeProfile(enabled = true) {
  return useQuery({
    queryKey: MY_DATA_KEYS.profile,
    queryFn: getMyEmployeeProfile,
    enabled,
  });
}

export function useMyActiveSalary() {
  return useQuery({
    queryKey: MY_DATA_KEYS.salary,
    queryFn: getMyActiveSalary,
  });
}

export function useMyBonuses() {
  return useQuery({
    queryKey: MY_DATA_KEYS.bonuses,
    queryFn: getMyBonuses,
  });
}

export function useMyPayslips() {
  return useQuery({
    queryKey: MY_DATA_KEYS.payslips,
    queryFn: getMyPayslips,
  });
}

export function useMyLoans() {
  return useQuery({
    queryKey: MY_DATA_KEYS.loans,
    queryFn: getMyLoans,
  });
}

export function useDownloadMyPayslip() {
  return useMutation({
    mutationFn: (payrollItemId: string) => downloadMyPayslip(payrollItemId),
  });
}

// ─── User Profile Management ────────────────────────────────────────────────
export function useUserProfile() {
  return useQuery({
    queryKey: MY_DATA_KEYS.userProfile,
    queryFn: getProfile,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_DATA_KEYS.userProfile });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePassword(payload),
  });
}

// ─── Emergency Contacts ──────────────────────────────────────────────────────
export function useEmergencyContacts() {
  return useQuery({
    queryKey: MY_DATA_KEYS.emergencyContacts,
    queryFn: getEmergencyContacts,
  });
}

export function useAddEmergencyContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmergencyContactPayload) =>
      addEmergencyContact(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MY_DATA_KEYS.emergencyContacts,
      });
    },
  });
}

export function useUpdateEmergencyContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      contactId,
      payload,
    }: {
      contactId: string;
      payload: Partial<EmergencyContactPayload>;
    }) => updateEmergencyContact(contactId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: MY_DATA_KEYS.emergencyContacts,
      });
    },
  });
}

// ─── Bank Account ────────────────────────────────────────────────────────────
export function useMyBankAccount() {
  return useQuery({
    queryKey: MY_DATA_KEYS.bankAccount,
    queryFn: getMyBankAccount,
  });
}

export function useAddBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BankAccountPayload) => addBankAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_DATA_KEYS.bankAccount });
    },
  });
}

export function useUpdateBankAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      accountId,
      payload,
    }: {
      accountId: string;
      payload: Partial<BankAccountPayload>;
    }) => updateBankAccount(accountId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_DATA_KEYS.bankAccount });
    },
  });
}
