"use client";

import PageHeader from "@/components/layout/PageHeader";
import {
  useUserProfile,
  useEmergencyContacts,
  useAddEmergencyContact,
  useUpdateEmergencyContact,
  useMyBankAccount,
  useAddBankAccount,
  useUpdateBankAccount,
} from "@/hooks/useMyData";
import { formatDate } from "@/utils/format";
import {
  Mail,
  Phone,
  User,
  Calendar,
  Shield,
  Clock,
  Edit,
  Key,
  Plus,
  UserCog,
  MapPin,
  StickyNote,
  X,
  Loader2,
  Landmark,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import EditProfileModal from "@/components/settings/EditProfileModal";
import ChangePasswordModal from "@/components/settings/ChangePasswordModal";
import PageLoader from "@/components/shared/PageLoader";
import Button from "@/components/ui/Button";
import { EmergencyContact, EmergencyContactPayload } from "@/types/auth";
import { BankDetails } from "@/types/employee";
import { BankAccountPayload } from "@/services/user/user.service";
import { getErrorMessage } from "@/utils/error-handler";

// ─── Emergency Contact Modal ──────────────────────────────────────────────────
function EmergencyContactModal({
  contact,
  onClose,
}: {
  contact: EmergencyContact | null;
  onClose: () => void;
}) {
  const isEdit = contact !== null;
  const addMutation = useAddEmergencyContact();
  const updateMutation = useUpdateEmergencyContact();
  const isPending = addMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmergencyContactPayload>({
    defaultValues: {
      name: contact?.name ?? "",
      phone: contact?.phone ?? "",
      relationship: contact?.relationship ?? "",
      address: contact?.address ?? "",
      email: contact?.email ?? "",
      alternatePhone: contact?.alternatePhone ?? "",
      notes: contact?.notes ?? "",
    },
  });

  const [serverError, setServerError] = useState("");

  const onSubmit = async (data: EmergencyContactPayload) => {
    setServerError("");
    const cleaned: EmergencyContactPayload = {
      name: data.name,
      phone: data.phone,
      relationship: data.relationship,
      ...(data.address?.trim() && { address: data.address.trim() }),
      ...(data.email?.trim() && { email: data.email.trim() }),
      ...(data.alternatePhone?.trim() && {
        alternatePhone: data.alternatePhone.trim(),
      }),
      ...(data.notes?.trim() && { notes: data.notes.trim() }),
    };
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          contactId: contact.id,
          payload: cleaned,
        });
      } else {
        await addMutation.mutateAsync(cleaned);
      }
      onClose();
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  const inputCls =
    "w-full rounded-xl border border-stroke bg-gray-50 px-4 py-2.5 text-sm text-dark outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder:text-gray-500";
  const labelCls =
    "mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-dark-2 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <h3 className="text-base font-semibold text-dark dark:text-white">
            {isEdit ? "Edit Emergency Contact" : "Add Emergency Contact"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-3"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-5">
          {serverError && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {serverError}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className={labelCls}>Full Name *</label>
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Jane Doe"
                className={inputCls}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Relationship */}
            <div>
              <label className={labelCls}>Relationship *</label>
              <input
                {...register("relationship", {
                  required: "Relationship is required",
                })}
                placeholder="Spouse, Parent, Sibling…"
                className={inputCls}
              />
              {errors.relationship && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.relationship.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className={labelCls}>Phone *</label>
              <input
                {...register("phone", { required: "Phone is required" })}
                placeholder="+880 17XX XXXXXX"
                className={inputCls}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Alternate Phone */}
            <div>
              <label className={labelCls}>Alternate Phone</label>
              <input
                {...register("alternatePhone")}
                placeholder="+880 18XX XXXXXX"
                className={inputCls}
              />
            </div>

            {/* Email */}
            <div>
              <label className={labelCls}>Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="jane@example.com"
                className={inputCls}
              />
            </div>

            {/* Address */}
            <div>
              <label className={labelCls}>Address</label>
              <input
                {...register("address")}
                placeholder="123 Main St, City"
                className={inputCls}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls}>Notes</label>
            <textarea
              {...register("notes")}
              rows={2}
              placeholder="Any additional information…"
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark-4 transition hover:bg-gray-50 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Contact"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Bank Account Modal ───────────────────────────────────────────────────────
function BankAccountModal({
  bankDetails,
  onClose,
}: {
  bankDetails: BankDetails | null;
  onClose: () => void;
}) {
  const accountId = bankDetails?.id ?? null;
  const isEdit = Boolean(accountId);
  const addMutation = useAddBankAccount();
  const updateMutation = useUpdateBankAccount();
  const isPending = addMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankAccountPayload>({
    defaultValues: {
      bankName: bankDetails?.bankName ?? "",
      accountNumber: bankDetails?.accountNumber ?? "",
      accountHolderName: bankDetails?.accountHolderName ?? "",
      routingNumber: bankDetails?.routingNumber ?? "",
      accountType: bankDetails?.accountType ?? "SAVINGS",
    },
  });

  const [serverError, setServerError] = useState("");

  const onSubmit = async (data: BankAccountPayload) => {
    setServerError("");
    const payload: BankAccountPayload = {
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      accountHolderName: data.accountHolderName,
      ...(data.routingNumber?.trim() && {
        routingNumber: data.routingNumber.trim(),
      }),
      accountType: data.accountType,
    };
    try {
      if (accountId) {
        await updateMutation.mutateAsync({
          accountId,
          payload,
        });
      } else {
        await addMutation.mutateAsync(payload);
      }
      onClose();
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  const inputCls =
    "w-full rounded-xl border border-stroke bg-gray-50 px-4 py-2.5 text-sm text-dark outline-none transition placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder:text-gray-500";
  const labelCls =
    "mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-dark-2 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stroke px-6 py-4 dark:border-dark-3">
          <h3 className="text-base font-semibold text-dark dark:text-white">
            {isEdit ? "Edit Bank Account" : "Add Bank Account"}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-dark-3"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-6 py-5">
          {serverError && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
              {serverError}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Bank Name */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Bank Name *</label>
              <input
                {...register("bankName", { required: "Bank name is required" })}
                placeholder="e.g. Sonali Bank"
                className={inputCls}
              />
              {errors.bankName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.bankName.message}
                </p>
              )}
            </div>

            {/* Account Holder Name */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Account Holder Name *</label>
              <input
                {...register("accountHolderName", {
                  required: "Account holder name is required",
                })}
                placeholder="Full name as on bank account"
                className={inputCls}
              />
              {errors.accountHolderName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.accountHolderName.message}
                </p>
              )}
            </div>

            {/* Account Number */}
            <div>
              <label className={labelCls}>Account Number *</label>
              <input
                {...register("accountNumber", {
                  required: "Account number is required",
                })}
                placeholder="XXXX XXXX XXXX"
                className={inputCls}
              />
              {errors.accountNumber && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>

            {/* Account Type */}
            <div>
              <label className={labelCls}>Account Type</label>
              <select {...register("accountType")} className={inputCls}>
                <option value="SAVINGS">Savings</option>
                <option value="CURRENT">Current</option>
                <option value="SALARY">Salary</option>
              </select>
            </div>

            {/* Routing Number */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Routing Number</label>
              <input
                {...register("routingNumber")}
                placeholder="Optional routing / IFSC number"
                className={inputCls}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stroke px-4 py-2 text-sm font-medium text-dark-4 transition hover:bg-gray-50 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isEdit ? "Save Changes" : "Add Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: profile, isLoading } = useUserProfile();
  const { data: bankDetails, isLoading: empLoading } = useMyBankAccount();
  const { data: ecData, isLoading: ecLoading } = useEmergencyContacts();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [ecModalContact, setEcModalContact] = useState<EmergencyContact | null>(
    null,
  );
  const [ecModalOpen, setEcModalOpen] = useState(false);
  const [bankModalOpen, setBankModalOpen] = useState(false);

  const contacts = ecData?.contacts ?? [];
  const canAddMore = contacts.length < 2;

  const openAdd = () => {
    setEcModalContact(null);
    setEcModalOpen(true);
  };
  const openEdit = (c: EmergencyContact) => {
    setEcModalContact(c);
    setEcModalOpen(true);
  };
  const closeEcModal = () => setEcModalOpen(false);

  if (isLoading) {
    return <PageLoader />;
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Settings"
          description="Manage your account and preferences"
        />
        <div className="card p-8 text-center text-gray-400">
          Unable to load profile
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      {/* Profile Overview Card */}
      <div className="card overflow-hidden">
        {/* Header Section */}
        <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-8 dark:border-dark-3 dark:from-indigo-900/20 dark:to-purple-900/20">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-2xl font-bold text-white shadow-lg">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.name}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {profile.role.name}
                </p>
                {profile.role.description && (
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
                    {profile.role.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowEditModal(true)}
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setShowPasswordModal(true)}
              >
                <Key className="h-4 w-4" />
                Change Password
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Details Grid */}
        <div className="grid gap-6 p-6 md:grid-cols-2">
          {/* Email */}
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Email Address
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {profile.email}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/20">
              <Phone className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Phone Number
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {profile.phone || "Not provided"}
              </p>
            </div>
          </div>

          {/* User ID */}
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/20">
              <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                User ID
              </p>
              <p className="mt-1 font-mono text-xs text-gray-900 dark:text-white">
                {profile.id}
              </p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-start space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
              <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Role
              </p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                {profile.role.name}
              </p>
            </div>
          </div>

          {/* Last Login */}
          {profile.lastLogin && (
            <div className="flex items-start space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-900/20">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Last Login
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(profile.lastLogin)}
                </p>
              </div>
            </div>
          )}

          {/* Member Since */}
          {profile.createdAt && (
            <div className="flex items-start space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-50 dark:bg-pink-900/20">
                <Calendar className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Member Since
                </p>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                  {formatDate(profile.createdAt)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Account Status */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-dark-3 dark:bg-dark-3/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    profile.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {profile.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    profile.isVerified ? "bg-blue-500" : "bg-yellow-500"
                  }`}
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {profile.isVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts Card */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 dark:bg-red-500/10">
              <UserCog className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-dark dark:text-white">
                Emergency Contacts
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Up to 2 contacts
              </p>
            </div>
          </div>
          <button
            onClick={openAdd}
            disabled={!canAddMore}
            title={
              !canAddMore
                ? "Maximum of 2 emergency contacts allowed"
                : undefined
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Contact
          </button>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-dark-3">
          {ecLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
              <UserCog className="h-10 w-10 text-gray-300 dark:text-dark-4" />
              <p className="text-sm font-medium text-gray-500 dark:text-dark-6">
                No emergency contacts yet
              </p>
              <p className="text-xs text-gray-400 dark:text-dark-5">
                Add up to 2 emergency contacts for safety
              </p>
            </div>
          ) : (
            contacts.map((contact, idx) => (
              <div key={contact.id} className="px-6 py-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-sm font-bold text-red-500 dark:bg-red-500/10 dark:text-red-400">
                      {idx + 1}
                    </div>
                    <div className="space-y-2.5">
                      <div>
                        <p className="text-sm font-semibold text-dark dark:text-white">
                          {contact.name}
                        </p>
                        <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {contact.relationship}
                        </span>
                      </div>
                      <div className="grid gap-1.5 sm:grid-cols-2">
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                          <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          {contact.phone}
                        </div>
                        {contact.alternatePhone && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                            <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            {contact.alternatePhone}
                          </div>
                        )}
                        {contact.email && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                            <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            {contact.email}
                          </div>
                        )}
                        {contact.address && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                            <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                            {contact.address}
                          </div>
                        )}
                      </div>
                      {contact.notes && (
                        <div className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                          {contact.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => openEdit(contact)}
                    className="shrink-0 rounded-lg border border-stroke p-2 text-gray-400 transition hover:border-primary hover:text-primary dark:border-dark-3"
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bank Account Card */}
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-dark-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
              <Landmark className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-dark dark:text-white">
                Bank Account
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your salary payment details
              </p>
            </div>
          </div>
          <button
            onClick={() => setBankModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-primary/90"
          >
            {bankDetails ? (
              <>
                <Edit className="h-3.5 w-3.5" />
                Edit
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Add Account
              </>
            )}
          </button>
        </div>

        <div className="px-6 py-5">
          {empLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : bankDetails ? (
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Bank Name */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-500/10">
                  <Landmark className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Bank Name
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-dark dark:text-white">
                    {bankDetails.bankName}
                  </p>
                </div>
              </div>

              {/* Account Type */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/10">
                  <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Account Type
                  </p>
                  <span className="mt-0.5 inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary capitalize">
                    {bankDetails.accountType.charAt(0) +
                      bankDetails.accountType.slice(1).toLowerCase()}
                  </span>
                </div>
              </div>

              {/* Account Holder */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-500/10">
                  <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Account Holder
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-dark dark:text-white">
                    {bankDetails.accountHolderName}
                  </p>
                </div>
              </div>

              {/* Account Number */}
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 dark:bg-dark-3">
                  <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Account Number
                  </p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-dark dark:text-white">
                    {"•••• " + bankDetails.accountNumber.slice(-4)}
                  </p>
                </div>
              </div>

              {/* Routing Number */}
              {bankDetails.routingNumber && (
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 dark:bg-orange-500/10">
                    <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      Routing / IFSC Number
                    </p>
                    <p className="mt-0.5 font-mono text-sm font-semibold text-dark dark:text-white">
                      {bankDetails.routingNumber}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
              <Landmark className="h-10 w-10 text-gray-300 dark:text-dark-4" />
              <p className="text-sm font-medium text-gray-500 dark:text-dark-6">
                No bank account linked
              </p>
              <p className="text-xs text-gray-400 dark:text-dark-5">
                Add your bank details to receive salary payments
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
      />
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
      {ecModalOpen && (
        <EmergencyContactModal
          contact={ecModalContact as EmergencyContact | null}
          onClose={closeEcModal}
        />
      )}
      {bankModalOpen && (
        <BankAccountModal
          bankDetails={bankDetails ?? null}
          onClose={() => setBankModalOpen(false)}
        />
      )}
    </div>
  );
}
