"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// Define the Team Member interface based on your entity and DTO structure
interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
  displayOrder?: number;
}

export default function TeamManager() {
  // ============================================================
  // FORM STATE
  // ============================================================

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    instagramUrl: "",
    twitterUrl: "",
    displayOrder: 1,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  // ============================================================
  // FETCH ALL TEAM MEMBERS
  // ============================================================

  const fetchTeamMembers = async () => {
    try {
      setFetching(true);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";

      const response = await fetch(`${baseUrl}/team`, {
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
        throw new Error(`Failed to fetch team members: ${response.status}`);
      }

      const data = await response.json();
      setTeamMembers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      toast.error("Failed to load team members.");
    } finally {
      setFetching(false);
    }
  };

  // ============================================================
  // LOAD TEAM MEMBERS ON PAGE LOAD
  // ============================================================

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // ============================================================
  // HANDLE FORM INPUT
  // ============================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Number fields
    if (name === "displayOrder") {
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

  // Handle file input change separately
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
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

    if (!formData.name || !formData.role) {
      setErrorMessage("Please fill all required fields (Name and Role).");
      setLoading(false);
      return;
    }

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";

      // ========================================================
      // MULTIPART FORM DATA PAYLOAD
      // ========================================================

      const dataPayload = new FormData();

      // Create the JSON blob for the @RequestPart("data") argument
      const jsonBlob = new Blob(
        [
          JSON.stringify({
            name: formData.name,
            role: formData.role,
            bio: formData.bio || null,
            instagramUrl: formData.instagramUrl || null,
            twitterUrl: formData.twitterUrl || null,
            displayOrder: formData.displayOrder,
          }),
        ],
        { type: "application/json" }
      );

      dataPayload.append("data", jsonBlob);

      // Append file if selected (matches @RequestPart(value = "file", required = false))
      if (selectedFile) {
        dataPayload.append("file", selectedFile);
      }

      // ========================================================
      // POST TO SPRING BOOT
      // ========================================================

      const response = await fetch(`${baseUrl}/team`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
          // Note: Do NOT manually set "Content-Type": "multipart/form-data" 
          // Browser sets it automatically with the correct boundary.
        },
        body: dataPayload,
      });

      // ========================================================
      // SUCCESS
      // ========================================================

      if (response.ok) {
        const savedMember = await response.json();
        console.log("SAVED TEAM MEMBER:", savedMember);

        toast.success("Team member added successfully!");
        setSuccessMessage("🎉 Team member added successfully!");

        // ======================================================
        // RESET FORM
        // ======================================================

        setFormData({
          name: "",
          role: "",
          bio: "",
          instagramUrl: "",
          twitterUrl: "",
          displayOrder: teamMembers.length + 1,
        });
        setSelectedFile(null);

        // Clear file input DOM element if needed
        const fileInput = document.getElementById("team-image-file") as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        // ======================================================
        // REFRESH LIST
        // ======================================================

        await fetchTeamMembers();
        return;
      }

      // ========================================================
      // ERROR RESPONSE
      // ========================================================

      const errorData = await response.json().catch(() => null);
      const message = errorData?.message || "Failed to save team member.";

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
  // DELETE TEAM MEMBER
  // ============================================================

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;

    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : "";

      const response = await fetch(`${baseUrl}/team/${id}`, {
        method: "DELETE",
        headers: {
          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      });

      if (response.ok) {
        toast.success("Team member deleted successfully!");
        setTeamMembers((prev) => prev.filter((member) => member.id !== id));
      } else {
        toast.error("Failed to delete team member.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Network error occurred during deletion.");
    }
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-6">
      {/* FORM SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Manage Team Members
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Add and configure leadership or staff profiles displayed on the platform.
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mb-4 p-4 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200">
            {successMessage}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            {errorMessage}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Jeremiah lutego weslaus"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>

            {/* ROLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role / Title *
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Founder & Lead Photographer"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* FILE UPLOAD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image File (JPEG, PNG, WebP - Max 2MB)
              </label>
              <input
                id="team-image-file"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>

            {/* DISPLAY ORDER */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                name="displayOrder"
                value={formData.displayOrder}
                onChange={handleChange}
                min={1}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* INSTAGRAM URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>

            {/* TWITTER URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter URL
              </label>
              <input
                type="url"
                name="twitterUrl"
                value={formData.twitterUrl}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>
          </div>

          {/* BIO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biography
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Short bio or description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#25632D] text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Team Member"}
          </button>
        </form>
      </div>

      {/* TEAM LIST SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              Existing Team Members
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              All team profiles currently saved in the system.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchTeamMembers}
            disabled={fetching}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {fetching ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {fetching ? (
          <div className="py-10 text-center">
            <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-[#25632D] rounded-full animate-spin" />
            <p className="text-sm text-gray-500 mt-3">Loading team members...</p>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-gray-500">No team members found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase bg-gray-50">
                  <th className="p-3">Member</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Bio</th>
                  <th className="p-3">Order</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">
                {teamMembers.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 flex items-center gap-3">
                      {member.imageUrl ? (
                        <img
                          src={
                            member.imageUrl.startsWith("http")
                              ? member.imageUrl
                              : `${baseUrl}${member.imageUrl}`
                          }
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                          {member.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-gray-800 block">
                          {member.name}
                        </span>
                        <span className="text-xs text-gray-400 truncate max-w-[150px] block">
                          {member.id}
                        </span>
                      </div>
                    </td>

                    <td className="p-3 font-medium text-gray-700">
                      {member.role}
                    </td>

                    <td className="p-3 text-gray-600 max-w-xs truncate">
                      {member.bio || "-"}
                    </td>

                    <td className="p-3 text-gray-600">
                      {member.displayOrder ?? "-"}
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md text-xs font-semibold transition"
                      >
                        Delete
                      </button>
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