"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import {
  FaUser,
  FaShieldAlt,
  FaLock,
  FaMobileAlt,
  FaEnvelope,
  FaCamera,
  FaSave,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaInfoCircle,
  FaGlobe,
  FaSpinner,
  FaTrash,
  FaQrcode,
  FaWallet,
  FaRegCreditCard,
  FaUserCircle,
} from "react-icons/fa";

import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getAuthSession, getToken } from "@/lib/actions";
import axios from "axios";

import { apiClient } from "@/lib/data";
import { getApiUrl } from "@/lib/utils/image-utils";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [session, setSession] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [backendProfile, setBackendProfile] = useState<any>(null);

  useEffect(() => {
    const initSettings = async () => {
      try {
        setLoadingProfile(true);
        const sessionData = await getAuthSession();
        const token = await getToken();

        setSession(sessionData);

        if (token) {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const profileData = response.data;



         
          
          // Handle image URL properly
          if (profileData.profileImage) {
            profileData.profileImage = getFullImageUrl(profileData.profileImage);
          }

          setBackendProfile(profileData);
          
        }
      } catch (error) {
        console.error("Failed to initialize settings:", error);
      } finally {
        setLoadingProfile(false);
      }
    };

    initSettings();
  }, []);

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Remove any duplicate /api/v0.1 if exists
    const cleanPath = imagePath.replace(/^\/api\/v0\.1/, '');
    return `${process.env.NEXT_PUBLIC_API_URL}${cleanPath}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    toast.success("Logged out successfully");

    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-10 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-black text-gray-900">
          Account Settings
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your Jemigraph photography account preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 space-y-1.5">
          <TabButton
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
            icon={<FaUser size={16} />}
            label="Profile Information"
          />

          {/* <TabButton
            active={activeTab === "security"}
            onClick={() => setActiveTab("security")}
            icon={<FaShieldAlt size={16} />}
            label="Security & 2af"
          /> */}

          {/* <TabButton
            active={activeTab === "billing"}
            onClick={() => setActiveTab("billing")}
            icon={<FaRegCreditCard size={16} />}
            label="Billing & Payouts"
          /> */}

          <div className="pt-6 mt-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm text-red-600 hover:bg-red-50 transition-all"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 lg:p-8">
            {activeTab === "profile" &&
              (loadingProfile ? (
                <div className="flex items-center justify-center py-20">
                  <FaSpinner className="animate-spin text-green-600 text-3xl" />
                </div>
              ) : (
                <ProfileSection
                  session={session}
                  initialProfile={backendProfile}
                  setBackendProfile={setBackendProfile}
                />
              ))}
            {activeTab === "security" && (
              <SecuritySettings
                initialProfile={backendProfile}
                setBackendProfile={setBackendProfile}
              />
            )}
            {activeTab === "billing" && <BillingSettings />}
          </div>
        </main>
      </div>
    </div>
  );
}

/* =========================================
    PROFILE SECTION
========================================= */
function ProfileSection({
  session,
  initialProfile,
  setBackendProfile,
}: {
  session: any;
  initialProfile: any;
  setBackendProfile: any;
}) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    displayName: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    website: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper function to get full image URL
  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Remove any duplicate /api/v0.1 if exists
    const cleanPath = imagePath.replace(/^\/api\/v0\.1/, '');
    return `${process.env.NEXT_PUBLIC_API_URL}${cleanPath}`;
  };

  useEffect(() => {
    if (initialProfile) {
      setFormData({
        name: initialProfile.name || initialProfile.user?.name || "",
        email: initialProfile.email || initialProfile.user?.email || "",
        phone: initialProfile.phone || "",
        location: initialProfile.location || "",
        bio: initialProfile.bio || "",
        displayName: initialProfile.displayName || "",
        instagram: initialProfile.instagram || "",
        facebook: initialProfile.facebook || "",
        twitter: initialProfile.twitter || "",
        linkedin: initialProfile.linkedin || "",
        website: initialProfile.website || "",
      });

      // Handle image URL properly
      if (initialProfile.profileImage) {
        const imageUrl = getFullImageUrl(initialProfile.profileImage);
        setProfileImage(imageUrl);
        setImageError(false);
      } else {
        setProfileImage(null);
      }
    } else if (session) {
      setFormData((prev) => ({
        ...prev,
        name: session.name || "",
        email: session.email || "",
        displayName: session.name ? session.name.split(" ")[0] : "",
      }));
    }
  }, [session, initialProfile]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload PNG, JPG, JPEG or WEBP");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image must be below 5MB");
      return;
    }

    // Show preview immediately
    const previewUrl = URL.createObjectURL(file);
    setProfileImage(previewUrl);
    setImageError(false);

    await uploadImage(file, previewUrl);
  };


const uploadImage = async (file: File, previewUrl: string) => {
    setUploading(true);
    try {
        const token = await getToken();
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(getApiUrl('/profile/profile-image'), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }

        const data = await response.json();
        const imagePath = data.imageUrl; // "/uploads/profiles/filename.jpg"
        
        // Get full URL
        const fullImageUrl = getFullImageUrl(imagePath);
        
        // Revoke preview URL
        URL.revokeObjectURL(previewUrl);

        if (fullImageUrl) {
            // Add cache buster
            const finalUrl = `${fullImageUrl}?t=${Date.now()}`;
            setProfileImage(finalUrl);
            setImageError(false);

            // Update backend profile
            if (setBackendProfile && initialProfile) {
                setBackendProfile((prev: any) => ({
                    ...prev,
                    profileImage: finalUrl,
                }));
            }

            toast.success("Profile image uploaded successfully!");
        }
    } catch (error) {
        console.error("Upload error:", error);
        toast.error("Upload failed: " + (error as Error).message);
        // Revert to previous image
        if (initialProfile?.profileImage) {
            setProfileImage(getFullImageUrl(initialProfile.profileImage));
        }
    } finally {
        setUploading(false);
    }
};
  const handleRemoveImage = async () => {
    try {
      const tkn = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/profile-image`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${tkn}`,
          },
        }
      );

      if (response.ok) {
        setProfileImage(null);
        setImageError(false);
        if (setBackendProfile && initialProfile) {
          setBackendProfile((prev: any) => ({
            ...prev,
            profileImage: null,
          }));
        }
        toast.success("Profile image removed successfully");
      } else {
        toast.error("Failed to remove profile image");
      }
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove profile image");
    }
  };

  const handleImageError = () => {
    console.error("Image failed to load:", profileImage);
    setImageError(true);
  };

  const handleSave = async () => {
    if (!formData.name || formData.name.trim() === "") {
      toast.error("Full name cannot be blank");
      return;
    }

    setSaving(true);
    try {
      const tkn = await getToken();

      const profilePayload = {
        name: formData.name.trim(),
        displayName: formData.displayName || "",
        phone: formData.phone || "",
        location: formData.location || "",
        bio: formData.bio || "",
        instagram: formData.instagram || "",
        facebook: formData.facebook || "",
        twitter: formData.twitter || "",
        linkedin: formData.linkedin || "",
        website: formData.website || "",
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tkn}`,
          },
          body: JSON.stringify(profilePayload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("Validation issues from Spring Boot:", errorData);
        throw new Error(
          errorData?.message ||
            "Failed to update profile. Please check validation rules."
        );
      }

      const updatedProfileResponse = await response.json();

      // Handle image URL properly
      if (updatedProfileResponse.profileImage) {
        const fullImageUrl = getFullImageUrl(updatedProfileResponse.profileImage);
        if (fullImageUrl) {
          updatedProfileResponse.profileImage = fullImageUrl;
          setProfileImage(fullImageUrl);
          setImageError(false);
        }
      }

      setBackendProfile(updatedProfileResponse);

      setFormData({
        name: updatedProfileResponse.name || "",
        email: updatedProfileResponse.email || "",
        phone: updatedProfileResponse.phone || "",
        location: updatedProfileResponse.location || "",
        bio: updatedProfileResponse.bio || "",
        displayName: updatedProfileResponse.displayName || "",
        instagram: updatedProfileResponse.instagram || "",
        facebook: updatedProfileResponse.facebook || "",
        twitter: updatedProfileResponse.twitter || "",
        linkedin: updatedProfileResponse.linkedin || "",
        website: updatedProfileResponse.website || "",
      });

      localStorage.setItem("user", JSON.stringify(updatedProfileResponse));
      toast.success("Profile saved successfully to database");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update profile in backend");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7">
      {/* IMAGE SECTION */}
      <div className="flex items-center gap-6 pb-4 border-b border-gray-100">
        <div className="relative group">
          <div
            onClick={handleImageClick}
            className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 ring-4 ring-green-50 cursor-pointer"
          >
            {profileImage && !imageError ? (
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <FaUserCircle className="text-gray-400 text-5xl" />
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <FaSpinner className="text-white animate-spin text-2xl" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 flex gap-2">
            {profileImage && !imageError && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition"
                disabled={uploading}
              >
                <FaTrash size={10} />
              </button>
            )}
            <button
              type="button"
              onClick={handleImageClick}
              className="bg-green-600 text-white p-2 rounded-full hover:bg-green-700 transition"
              disabled={uploading}
            >
              <FaCamera size={10} />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
        <div>
          <h3 className="font-bold text-lg">Profile Photo</h3>
          <p className="text-sm text-gray-500">PNG, JPG, WEBP up to 5MB</p>
          {uploading && (
            <p className="text-xs text-green-600 mt-1">Uploading...</p>
          )}
          {imageError && (
            <p className="text-xs text-red-500 mt-1">
              Image not available. Click camera to upload.
            </p>
          )}
        </div>
      </div>

      {/* BASIC INFO FORM - Same as before */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputGroup
          label="Full Name"
          value={formData.name}
          onChange={(value: string) => handleInputChange("name", value)}
          placeholder="Full name"
        />

        <InputGroup
          label="Display Name"
          value={formData.displayName}
          onChange={(value: string) => handleInputChange("displayName", value)}
          placeholder="Display name"
        />

        <InputGroup
          label="Email Address (Cannot be changed)"
          value={formData.email}
          onChange={() => {}}
          placeholder="Email"
          icon={<FaEnvelope />}
          disabled={true}
          className="opacity-60 cursor-not-allowed bg-gray-100/80 select-none"
        />

        <InputGroup
          label="Phone"
          value={formData.phone}
          onChange={(value: string) => handleInputChange("phone", value)}
          placeholder="+255..."
          icon={<FaMobileAlt />}
        />

        <InputGroup
          label="Location"
          value={formData.location}
          onChange={(value: string) => handleInputChange("location", value)}
          placeholder="Dar es Salaam"
          icon={<FaMapMarkerAlt />}
        />

        <div className="md:col-span-2">
          <InputGroup
            label="Bio"
            value={formData.bio}
            onChange={(value: string) => handleInputChange("bio", value)}
            placeholder="Tell us about yourself as a photographer..."
            isTextarea
          />
        </div>
      </div>

      {/* SOCIAL NETWORKS SECTION - Same as before */}
      <div className="pt-4 border-t border-gray-100">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">Social Networks</h3>
          <p className="text-sm text-gray-500">
            Connect your social media accounts
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <InputGroup
            label="Instagram"
            value={formData.instagram}
            onChange={(value: string) => handleInputChange("instagram", value)}
            placeholder="https://instagram.com/username"
            icon={<FaInstagram className="text-pink-600" />}
          />
          <InputGroup
            label="Facebook"
            value={formData.facebook}
            onChange={(value: string) => handleInputChange("facebook", value)}
            placeholder="https://facebook.com/username"
            icon={<FaFacebook className="text-blue-600" />}
          />
          <InputGroup
            label="Twitter / X"
            value={formData.twitter}
            onChange={(value: string) => handleInputChange("twitter", value)}
            placeholder="https://twitter.com/username"
            icon={<FaTwitter className="text-blue-400" />}
          />
          <InputGroup
            label="LinkedIn"
            value={formData.linkedin}
            onChange={(value: string) => handleInputChange("linkedin", value)}
            placeholder="https://linkedin.com/in/username"
            icon={<FaInfoCircle className="text-blue-700" />}
          />
          <InputGroup
            label="Personal Website"
            value={formData.website}
            onChange={(value: string) => handleInputChange("website", value)}
            placeholder="https://yourwebsite.com"
            icon={<FaGlobe className="text-gray-600" />}
          />
        </div>
      </div>

      {/* SAVE BUTTON */}
      <button
        type="button"
        onClick={handleSave}
        disabled={saving || uploading}
        className="flex items-center gap-2 bg-green-600 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
      >
        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
        {saving ? "Saving Changes..." : "Save Changes"}
      </button>
    </div>
  );
}

/* =========================================
    SECURITY & 2af SETTINGS
========================================= */
function SecuritySettings({
  initialProfile,
  setBackendProfile,
}: {
  initialProfile: any;
  setBackendProfile: any;
}) {
  const [is2afEnabled, setIs2afEnabled] = useState(false);
  const [show2afSetup, setShow2afSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loading2af, setLoading2af] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  useEffect(() => {
    if (initialProfile) {
      setIs2afEnabled(
        !!initialProfile.twoFactorEnabled || !!initialProfile.is2afEnabled
      );
      if (initialProfile.backupCodes) {
        setBackupCodes(initialProfile.backupCodes);
      }
    }
  }, [initialProfile]);

  const handleToggle2af = async (nextValue: boolean) => {
    const tkn = await getToken();
    setLoading2af(true);

    if (nextValue) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/2af/setup`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${tkn}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setQrCodeUrl(data.qrCodeUrl || null);
          setShow2afSetup(true);
        } else {
          toast.error("Failed to fetch 2af configuration from server");
        }
      } catch (err) {
        console.error(err);
        toast.error("An error occurred starting 2af setup");
      } finally {
        setLoading2af(false);
      }
    } else {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/2af/disable`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${tkn}` },
          }
        );

        if (response.ok) {
          setIs2afEnabled(false);
          setBackupCodes([]);
          setShow2afSetup(false);
          setQrCodeUrl(null);

          if (setBackendProfile && initialProfile) {
            setBackendProfile({ ...initialProfile, twoFactorEnabled: false });
          }
          toast.success("2af disabled successfully");
        } else {
          toast.error("Failed to disable 2af on server configuration");
        }
      } catch (err) {
        console.error(err);
        toast.error("Connection error trying to disable 2af");
      } finally {
        setLoading2af(false);
      }
    }
  };

  const handleVerify2af = async () => {
    if (verificationCode?.trim().length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    const tkn = await getToken();
    setLoading2af(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/2af/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tkn}`,
          },
          body: JSON.stringify({ code: verificationCode.trim() }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIs2afEnabled(true);
        setShow2afSetup(false);
        setVerificationCode("");

        if (data.backupCodes) {
          setBackupCodes(data.backupCodes);
        } else {
          setBackupCodes([
            "ABCD-1234",
            "EFGH-5678",
            "IJKL-9012",
            "MNOP-3456",
            "QRST-7890",
          ]);
        }

        if (setBackendProfile && initialProfile) {
          setBackendProfile({ ...initialProfile, twoFactorEnabled: true });
        }
        toast.success("2af enabled successfully");
      } else {
        toast.error("Invalid verification code. Please check your app.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed due to a server connection error");
    } finally {
      setLoading2af(false);
    }
  };

  const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long");
      return;
    }

    setUpdatingPassword(true);
    try {
      const tkn = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tkn}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      if (response.ok) {
        setShowPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");

        toast.success("Password changed successfully. Logging out...");

        setTimeout(() => {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          window.location.href = "/auth/login";
        }, 1500);
      } else {
        const errData = await response.json().catch(() => null);
        toast.error(
          errData?.message ||
            "Failed to change password. Check your current password."
        );
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error modifying credentials");
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>
        <p className="text-gray-500 mt-1">
          Protect your account with additional security
        </p>
      </div>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-xl">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-gray-900">Change Password</h3>
              <p className="text-sm text-gray-500 mt-1">
                Update your password regularly to keep your account secure
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-gray-900 transition-colors"
            >
              Change Password
            </button>
          </div>
        </div>

        {/* <div className="border rounded-xl p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2">
                <FaLock className="text-green-600" />
                <h3 className="font-bold text-gray-900">
                  Two-Factor Authentication (2af)
                </h3>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Add an extra layer of security to your account
              </p>
            </div>
            {loading2af ? (
              <FaSpinner className="animate-spin text-green-600 mt-2" size={20} />
            ) : (
              <ToggleSwitch enabled={is2afEnabled} onChange={handleToggle2af} />
            )}
          </div>

          {show2afSetup && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-4">
              <div className="text-center">
                <div className="bg-white p-4 inline-block rounded-lg mb-3">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="2af QR Code"
                      className="w-32 h-32 object-contain mx-auto"
                    />
                  ) : (
                    <FaQrcode className="text-4xl text-gray-800" />
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Scan this QR code with your authenticator app
                </p>
              </div>

              <InputGroup
                label="Enter Verification Code"
                value={verificationCode}
                onChange={setVerificationCode}
                placeholder="Enter 6-digit code"
                helper="Enter the code from your authenticator app"
              />

              <button
                type="button"
                onClick={handleVerify2af}
                disabled={loading2af}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading2af && <FaSpinner className="animate-spin" />}
                Verify & Enable 2af
              </button>
            </div>
          )}

          {backupCodes.length > 0 && (
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-sm font-bold text-yellow-800 mb-2">
                Backup Codes
              </p>
              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, idx) => (
                  <code
                    key={idx}
                    className="text-xs font-mono bg-white p-2 rounded text-center"
                  >
                    {code}
                  </code>
                ))}
              </div>
              <p className="text-xs text-yellow-700 mt-2">
                Save these backup codes in a secure place. Each code can be used
                only once.
              </p>
            </div>
          )}
        </div> */}
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl space-y-4 border border-gray-100">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Modify Credentials
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Please enter your current credentials to setup a new password.
              </p>
            </div>

            <div className="space-y-4">
              <InputGroup
                label="Current Password"
                type="password"
                value={oldPassword}
                onChange={setOldPassword}
                placeholder="••••••••"
              />
              <InputGroup
                label="New Password"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
                placeholder="••••••••"
              />
              <InputGroup
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(false);
                  setOldPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePassword}
                disabled={updatingPassword}
                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50 text-sm"
              >
                {updatingPassword && <FaSpinner className="animate-spin" />}
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================
    BILLING & PAYOUTS SETTINGS
========================================= */
function BillingSettings() {
  const [payoutMethod, setPayoutMethod] = useState("bank");
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    routingNumber: "",
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Billing & Payouts</h2>
        <p className="text-gray-500 mt-1">
          Manage your payment methods and payout preferences
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Available Balance</p>
          <p className="text-4xl font-bold">TZS 2,450,000</p>
        </div>

        <div className="border rounded-xl p-4">
          <h3 className="font-bold text-gray-900 mb-3">Payout Method</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payoutMethod"
                value="bank"
                checked={payoutMethod === "bank"}
                onChange={(e) => setPayoutMethod(e.target.value)}
                className="text-green-600"
              />
              <div className="flex-1">
                <p className="font-medium">Bank Transfer</p>
              </div>
              <FaWallet className="text-gray-400" />
            </label>
          </div>
        </div>

        {payoutMethod === "bank" && (
          <div className="border rounded-xl p-4 space-y-4">
            <h3 className="font-bold text-gray-900">Bank Account Details</h3>
            <InputGroup
              label="Bank Name"
              value={bankDetails.bankName}
              onChange={(val: string) =>
                setBankDetails({ ...bankDetails, bankName: val })
              }
              placeholder="e.g., CRDB Bank"
            />
            <InputGroup
              label="Account Holder Name"
              value={bankDetails.accountName}
              onChange={(val: string) =>
                setBankDetails({ ...bankDetails, accountName: val })
              }
              placeholder="Full name as on bank account"
            />
            <InputGroup
              label="Account Number"
              value={bankDetails.accountNumber}
              onChange={(val: string) =>
                setBankDetails({ ...bankDetails, accountNumber: val })
              }
              placeholder="Account number"
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => toast.success("Billing information saved")}
        className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition"
      >
        <FaSave /> Save Billing Information
      </button>
    </div>
  );
}

/* =========================================
    REUSABLE COMPONENTS
========================================= */
function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all",
        active
          ? "bg-green-600 text-white shadow-md"
          : "text-gray-600 hover:bg-gray-100"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function InputGroup({
  label,
  placeholder,
  type = "text",
  icon,
  helper,
  isTextarea,
  value,
  onChange,
  disabled,
  className,
}: any) {
  const Component = isTextarea ? "textarea" : "input";

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider ml-1">
        {label}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <Component
          type={type}
          value={value || ""}
          onChange={(e: any) => onChange && onChange(e.target.value)}
          placeholder={placeholder}
          rows={isTextarea ? 4 : undefined}
          disabled={disabled}
          className={cn(
            "w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none text-sm transition-all",
            icon && "pl-11",
            isTextarea && "resize-none pt-4",
            className
          )}
        />
      </div>

      {helper && <p className="text-xs text-gray-400 ml-1">{helper}</p>}
    </div>
  );
}

function ToggleSwitch({ enabled, onChange }: any) {
  return (
    <button
      type="button"
      onClick={() => onChange && onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        enabled ? "bg-green-600" : "bg-gray-300"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
          enabled ? "translate-x-6" : "translate-x-1"
        )}
      />
    </button>
  );
}