export enum EmployeeType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERN = "INTERN",
}

export enum EmployeeStatus {
  ACTIVE = "ACTIVE",
  RESIGNED = "RESIGNED",
  TERMINATED = "TERMINATED",
  ON_LEAVE = "ON_LEAVE",
}

export enum ComponentType {
  EARNING = "EARNING",
  DEDUCTION = "DEDUCTION",
}

export enum CalculationType {
  FIXED = "FIXED",
  PERCENTAGE = "PERCENTAGE",
}

export enum CalculationBase {
  GROSS = "GROSS",
  BASIC = "BASIC",
}

export enum BonusType {
  PERFORMANCE = "PERFORMANCE",
  FESTIVAL = "FESTIVAL",
  YEARLY = "YEARLY",
  ONE_TIME = "ONE_TIME",
}

export enum BonusStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PAID = "PAID",
}

export enum LoanStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export enum InstallmentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}

export enum PayrollStatus {
  DRAFT = "DRAFT",
  APPROVED = "APPROVED",
  PAID = "PAID",
}

export enum SalaryStructureStatus {
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}
