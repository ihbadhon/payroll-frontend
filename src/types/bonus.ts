import { BonusStatus, BonusType } from "./enums";

export interface Bonus {
  id: string;
  bonusType: BonusType;
  amount: string;
  month: number;
  year: number;
  reason?: string;
  status: BonusStatus;
  employeeId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeWithBonuses {
  id: string;
  employeeId: string;
  fullName: string;
  designation: string;
  departmentId: string;
  bonuses: Bonus[];
}
