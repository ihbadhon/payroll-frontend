import {
  BonusStatus,
  EmployeeStatus,
  EmployeeType,
  LoanStatus,
  PayrollStatus,
  SalaryStructureStatus,
} from "@/types/enums";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple";

export function getPayrollStatusBadge(status: PayrollStatus): {
  label: string;
  variant: BadgeVariant;
} {
  switch (status) {
    case PayrollStatus.DRAFT:
      return { label: "Draft", variant: "warning" };
    case PayrollStatus.APPROVED:
      return { label: "Approved", variant: "info" };
    case PayrollStatus.PAID:
      return { label: "Paid", variant: "success" };
    default:
      return { label: status, variant: "default" };
  }
}

export function getLoanStatusBadge(status: LoanStatus): {
  label: string;
  variant: BadgeVariant;
} {
  switch (status) {
    case LoanStatus.PENDING:
      return { label: "Pending", variant: "warning" };
    case LoanStatus.APPROVED:
      return { label: "Approved", variant: "info" };
    case LoanStatus.ACTIVE:
      return { label: "Active", variant: "success" };
    case LoanStatus.COMPLETED:
      return { label: "Completed", variant: "default" };
    case LoanStatus.REJECTED:
      return { label: "Rejected", variant: "danger" };
    default:
      return { label: status, variant: "default" };
  }
}

export function getBonusStatusBadge(status: BonusStatus): {
  label: string;
  variant: BadgeVariant;
} {
  switch (status) {
    case BonusStatus.PENDING:
      return { label: "Pending", variant: "warning" };
    case BonusStatus.APPROVED:
      return { label: "Approved", variant: "info" };
    case BonusStatus.PAID:
      return { label: "Paid", variant: "success" };
    default:
      return { label: status, variant: "default" };
  }
}

export function getSalaryStatusBadge(status: SalaryStructureStatus): {
  label: string;
  variant: BadgeVariant;
} {
  switch (status) {
    case SalaryStructureStatus.PENDING_APPROVAL:
      return { label: "Pending Approval", variant: "warning" };
    case SalaryStructureStatus.APPROVED:
      return { label: "Approved", variant: "success" };
    case SalaryStructureStatus.REJECTED:
      return { label: "Rejected", variant: "danger" };
    default:
      return { label: status, variant: "default" };
  }
}

export function getEmployeeStatusBadge(status: EmployeeStatus): {
  label: string;
  variant: BadgeVariant;
} {
  switch (status) {
    case EmployeeStatus.ACTIVE:
      return { label: "Active", variant: "success" };
    case EmployeeStatus.RESIGNED:
      return { label: "Resigned", variant: "warning" };
    case EmployeeStatus.TERMINATED:
      return { label: "Terminated", variant: "danger" };
    case EmployeeStatus.ON_LEAVE:
      return { label: "On Leave", variant: "info" };
    default:
      return { label: status, variant: "default" };
  }
}

export function getEmployeeTypeBadge(type: EmployeeType): {
  label: string;
  variant: BadgeVariant;
} {
  switch (type) {
    case EmployeeType.FULL_TIME:
      return { label: "Full Time", variant: "success" };
    case EmployeeType.PART_TIME:
      return { label: "Part Time", variant: "info" };
    case EmployeeType.CONTRACT:
      return { label: "Contract", variant: "purple" };
    case EmployeeType.INTERN:
      return { label: "Intern", variant: "warning" };
    default:
      return { label: type, variant: "default" };
  }
}
