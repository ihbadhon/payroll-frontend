"use client";

import PageHeader from "@/components/layout/PageHeader";
import { useUserProfile } from "@/hooks/useMyData";
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
} from "lucide-react";
import { useState } from "react";
import EditProfileModal from "@/components/settings/EditProfileModal";
import ChangePasswordModal from "@/components/settings/ChangePasswordModal";
import PageLoader from "@/components/shared/PageLoader";
import Button from "@/components/ui/Button";

export default function SettingsPage() {
  const { data: profile, isLoading } = useUserProfile();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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
    </div>
  );
}
