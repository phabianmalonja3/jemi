"use client";

import React, { useEffect, useState } from "react";
import { AppVersion } from "@/lib/models/app_version";
import { toast } from "sonner";

export default function AppVersionManager() {
  // ============================================================
  // FORM STATE
  // ============================================================

  const [formData, setFormData] = useState({
    appId: "com.jemi.app", // ✅ Fixed: Now using correct app ID
    platform: "ANDROID",
    currentVersion: "1.0.0",
    currentBuildNumber: 1,
    minimumBuildNumber: 1,
    updateMessage:
      "A new version of the app is available. Please update to continue.",
    storeUrl:
      "https://play.google.com/store/apps/details?id=com.jemi.app", // ✅ Fixed
    active: true,
  });

  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  // ============================================================
  // FETCH ALL VERSION CONFIGURATIONS
  // ============================================================

  const fetchVersions = async () => {
    try {
      setFetching(true);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";

      const response = await fetch(`${baseUrl}/app-version/all`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch versions: ${response.status}`);
      }

      const data = await response.json();
      setVersions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch versions:", error);
      toast.error("Failed to load app versions.");
    } finally {
      setFetching(false);
    }
  };

  // ============================================================
  // LOAD VERSIONS ON PAGE LOAD
  // ============================================================

  useEffect(() => {
    fetchVersions();
  }, []);

  // ============================================================
  // HANDLE FORM INPUT
  // ============================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Checkbox
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    // Number fields
    if (name === "currentBuildNumber" || name === "minimumBuildNumber") {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
      return;
    }

    // Normal fields
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    // ==========================================================
    // BASIC VALIDATION
    // ==========================================================

    if (!formData.appId || !formData.platform || !formData.currentVersion) {
      setErrorMessage("Please fill all required fields.");
      setLoading(false);
      return;
    }

    if (
      formData.currentBuildNumber <= 0 ||
      formData.minimumBuildNumber <= 0
    ) {
      setErrorMessage("Build numbers must be greater than 0.");
      setLoading(false);
      return;
    }

    if (formData.minimumBuildNumber > formData.currentBuildNumber) {
      setErrorMessage(
        "Minimum build number cannot be greater than current build number."
      );
      setLoading(false);
      return;
    }

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";

      // ========================================================
      // PAYLOAD
      // ========================================================

      const payload = {
        appId: formData.appId,
        platform: formData.platform,
        currentVersion: formData.currentVersion,
        currentBuildNumber: formData.currentBuildNumber,
        minimumBuildNumber: formData.minimumBuildNumber,
        updateMessage: formData.updateMessage,
        storeUrl: formData.storeUrl,
        active: formData.active,
      };

      console.log("APP VERSION PAYLOAD:", payload);

      // ========================================================
      // POST TO SPRING BOOT
      // ========================================================

      const response = await fetch(`${baseUrl}/app-version`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      // ========================================================
      // SUCCESS
      // ========================================================

      if (response.ok) {
        const savedVersion = await response.json();
        console.log("SAVED APP VERSION:", savedVersion);

        toast.success("App version configuration saved successfully!");

        setSuccessMessage(
          "🎉 App version configuration saved successfully!"
        );

        // ======================================================
        // RESET FORM - Keep the same app but reset other fields
        // ======================================================

        setFormData((prev) => ({
          ...prev,
          // Keep the same appId, platform, and storeUrl
          // But increment build number for convenience
          currentVersion: prev.currentVersion,
          currentBuildNumber: prev.currentBuildNumber + 1,
          minimumBuildNumber: prev.minimumBuildNumber,
          updateMessage: prev.updateMessage,
          storeUrl: prev.storeUrl,
          active: true,
        }));

        // ======================================================
        // REFRESH LIST
        // ======================================================

        await fetchVersions();

        return;
      }

      // ========================================================
      // ERROR RESPONSE
      // ========================================================

      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || "Failed to save app version.";

      setErrorMessage(`❌ ${message}`);
      toast.error(message);
    } catch (error) {
      console.error("Network error:", error);
      setErrorMessage("❌ Network error occurred while connecting to the server.");
      toast.error("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // APP NAME HELPER - ✅ FIXED with both apps
  // ============================================================

  const getAppName = (appId: string) => {
    switch (appId) {
      case "com.jemi.app":
        return "Jemi App";
      case "com.jemigraph.app":
        return "Jemigrapher";
      case "com.jemigraph.jemigraph":
        return "Jemigraph";
      default:
        return appId;
    }
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date?: string) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleString();
    } catch {
      return date;
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-6">
      {/* ======================================================
          FORM SECTION
      ======================================================= */}

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Manage App Versions
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure application versions and control mandatory updates.
          </p>
        </div>

        {/* ==================================================
            SUCCESS MESSAGE
        =================================================== */}

        {successMessage && (
          <div className="mb-4 p-4 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200">
            {successMessage}
          </div>
        )}

        {/* ==================================================
            ERROR MESSAGE
        =================================================== */}

        {errorMessage && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            {errorMessage}
          </div>
        )}

        {/* ==================================================
            FORM
        =================================================== */}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ==================================================
              APP ID + PLATFORM
          =================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* APP ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target App
              </label>

              <select
                name="appId"
                value={formData.appId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              >
                <option value="com.jemi.app">Jemi App (com.jemi.app)</option>
                <option value="com.jemigraph.app">
                  Jemigrapher (com.jemigraph.app)
                </option>
                <option value="com.jemigraph.jemigraph">
                  Jemigraph (com.jemigraph.jemigraph)
                </option>
              </select>
            </div>

            {/* PLATFORM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform
              </label>

              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              >
                <option value="ANDROID">Android</option>
                <option value="IOS">iOS</option>
              </select>
            </div>
          </div>

          {/* ==================================================
              VERSION + BUILD NUMBERS
          =================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* VERSION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Version Name
              </label>
              <input
                type="text"
                name="currentVersion"
                value={formData.currentVersion}
                onChange={handleChange}
                placeholder="e.g. 1.0.1"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>

            {/* CURRENT BUILD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Build
              </label>
              <input
                type="number"
                name="currentBuildNumber"
                value={formData.currentBuildNumber}
                onChange={handleChange}
                min={1}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>

            {/* MINIMUM BUILD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Build
              </label>
              <input
                type="number"
                name="minimumBuildNumber"
                value={formData.minimumBuildNumber}
                onChange={handleChange}
                min={1}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>
          </div>

          {/* ==================================================
              HELP TEXT
          =================================================== */}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>How force update works:</strong> Users with a build number
              below the Minimum Build will be forced to update.
            </p>
          </div>

          {/* ==================================================
              STORE URL
          =================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store URL
            </label>
            <input
              type="url"
              name="storeUrl"
              value={formData.storeUrl}
              onChange={handleChange}
              placeholder="https://play.google.com/store/apps/details?id=..."
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* ==================================================
              UPDATE MESSAGE
          =================================================== */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Update Message
            </label>
            <textarea
              name="updateMessage"
              rows={3}
              value={formData.updateMessage}
              onChange={handleChange}
              required
              placeholder="Message shown to users who must update"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* ==================================================
              ACTIVE
          =================================================== */}

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={formData.active}
              onChange={handleChange}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="active" className="text-sm font-medium text-gray-700">
              Set this version configuration as Active
            </label>
          </div>

          {/* ==================================================
              SUBMIT
          =================================================== */}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#25632D] text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Version Configuration"}
          </button>
        </form>
      </div>

      {/* ======================================================
          VERSION LIST
      ======================================================= */}

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Existing Version Configurations
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              All application version configurations stored in the system.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchVersions}
            disabled={fetching}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {fetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {/* ==================================================
            LOADING
        =================================================== */}

        {fetching ? (
          <div className="py-10 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#25632D] rounded-full animate-spin" />
            <p className="text-sm text-gray-500 mt-3">Loading versions...</p>
          </div>
        ) : versions.length === 0 ? (
          // ==================================================
          // EMPTY
          // ==================================================

          <div className="py-10 text-center">
            <p className="text-gray-500">No configurations found.</p>
          </div>
        ) : (
          // ==================================================
          // TABLE
          // ==================================================

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase bg-gray-50">
                  <th className="p-3">App</th>
                  <th className="p-3">App ID</th>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Version</th>
                  <th className="p-3">Current Build</th>
                  <th className="p-3">Min Build</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">
                {versions.map((ver) => (
                  <tr key={ver.id} className="hover:bg-gray-50 transition">
                    {/* APP */}
                    <td className="p-3">
                      <span className="font-semibold text-gray-800">
                        {getAppName(ver.appId)}
                      </span>
                    </td>

                    {/* APP ID */}
                    <td className="p-3">
                      <span className="text-xs text-gray-500">{ver.appId}</span>
                    </td>

                    {/* PLATFORM */}
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700">
                        {ver.platform}
                      </span>
                    </td>

                    {/* VERSION */}
                    <td className="p-3 font-medium text-gray-700">
                      {ver.currentVersion}
                    </td>

                    {/* CURRENT BUILD */}
                    <td className="p-3 text-gray-600">
                      {ver.currentBuildNumber}
                    </td>

                    {/* MINIMUM BUILD */}
                    <td className="p-3 text-gray-600">
                      {ver.minimumBuildNumber}
                    </td>

                    {/* STATUS */}
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          ver.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {ver.active ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* CREATED */}
                    <td className="p-3 text-xs text-gray-500">
                      {formatDate((ver as any).createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}