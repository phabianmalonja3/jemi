
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Loader2,
  MapPin,
  Package,
  RefreshCw,
  Search,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080/api/v0.1";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined"
    ) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

interface Photographer {
  id: string | number;
  name?: string | null;
  displayName?: string | null;
  email?: string | null;
  phone?: string | null;
  bio?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  profileImage?: string | null;
  profileImageUrl?: string | null;
  role?: string | null;
  isVerified?: boolean;
  packages?: unknown[];
  gallery?: unknown[];
}

interface PageResponse<T> {
  content?: T[];
  totalPages?: number;
  totalElements?: number;
  number?: number;
  size?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

type ProfileFilter =
  | "ALL"
  | "MISSING_PACKAGES"
  | "MISSING_LOCATION";

type ExportType = "excel" | "pdf" | null;

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to load photographer profiles."
    );
  }

  return "An unexpected error occurred.";
}

function hasLocation(p: Photographer): boolean {
  return (
    p.latitude != null &&
    p.longitude != null &&
    (p.latitude !== 0 || p.longitude !== 0)
  );
}

function hasPackages(p: Photographer): boolean {
  return Array.isArray(p.packages) && p.packages.length > 0;
}

function getName(p: Photographer): string {
  return (
    p.displayName?.trim() ||
    p.name?.trim() ||
    "Unnamed photographer"
  );
}

function getProfileStatus(p: Photographer): string {
  const missingPackages = !hasPackages(p);
  const missingLocation = !hasLocation(p);

  if (missingPackages && missingLocation) {
    return "Missing packages & location";
  }

  if (missingPackages) return "Missing packages";
  if (missingLocation) return "Missing location";

  return "Check profile";
}

function getExportRows(photographers: Photographer[]) {
  return photographers.map((p, index) => ({
    No: index + 1,
    ID: p.id,
    Name: getName(p),
    Email: p.email || "",
    Phone: p.phone || "",
    Bio: p.bio || "",
    Packages: Array.isArray(p.packages) ? p.packages.length : 0,
    PackageStatus: hasPackages(p) ? "Complete" : "Missing packages",
    LocationStatus: hasLocation(p) ? "Set" : "Missing location",
    Address: p.address || "",
    Latitude: p.latitude ?? "",
    Longitude: p.longitude ?? "",
    ProfileStatus: getProfileStatus(p),
    Verified: p.isVerified ? "Yes" : "No",
  }));
}

export default function IncompletePhotographerProfilesPage() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [profileFilter, setProfileFilter] =
    useState<ProfileFilter>("ALL");

  // Spring Boot pagination is zero-based.
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [exporting, setExporting] = useState<ExportType>(null);

  // Fetch the currently selected table page.
  const fetchIncompleteProfiles = useCallback(
    async (showToast = false) => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await apiClient.get<
          PageResponse<Photographer>
        >("/photographers/incomplete-profiles", {
          params: { size, page },
        });

        const data = response.data;

        setPhotographers(
          Array.isArray(data.content) ? data.content : []
        );
        setTotalPages(data.totalPages ?? 0);
        setTotalElements(data.totalElements ?? 0);

        if (showToast) {
          toast.success("Photographer profiles refreshed.");
        }
      } catch (error) {
        const message = getErrorMessage(error);

        setErrorMessage(message);
        setPhotographers([]);
        setTotalPages(0);
        setTotalElements(0);

        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    },
    [page, size]
  );

  useEffect(() => {
    void fetchIncompleteProfiles();
  }, [fetchIncompleteProfiles]);

  // Fetch every API page for a complete export.
  const fetchAllIncompleteProfiles =
    useCallback(async (): Promise<Photographer[]> => {
      const firstResponse = await apiClient.get<
        PageResponse<Photographer>
      >("/photographers/incomplete-profiles", {
        params: { page: 0, size: 100 },
      });

      const firstData = firstResponse.data;

      const allRecords: Photographer[] = Array.isArray(
        firstData.content
      )
        ? [...firstData.content]
        : [];

      const pages = firstData.totalPages ?? 0;

      // Request remaining pages in batches of five.
      for (let start = 1; start < pages; start += 5) {
        const pageNumbers = Array.from(
          { length: Math.min(5, pages - start) },
          (_, index) => start + index
        );

        const responses = await Promise.all(
          pageNumbers.map((pageNumber) =>
            apiClient.get<PageResponse<Photographer>>(
              "/photographers/incomplete-profiles",
              {
                params: {
                  page: pageNumber,
                  size: 100,
                },
              }
            )
          )
        );

        for (const response of responses) {
          if (Array.isArray(response.data.content)) {
            allRecords.push(...response.data.content);
          }
        }
      }

      return allRecords;
    }, []);

  // Apply search and profile filters to any supplied dataset.
  const filterRecords = useCallback(
    (records: Photographer[]) => {
      const query = searchTerm.trim().toLowerCase();

      return records.filter((p) => {
        const matchesSearch =
          !query ||
          getName(p).toLowerCase().includes(query) ||
          (p.email || "").toLowerCase().includes(query) ||
          (p.phone || "").toLowerCase().includes(query) ||
          (p.address || "").toLowerCase().includes(query);

        const matchesFilter =
          profileFilter === "ALL" ||
          (profileFilter === "MISSING_PACKAGES" &&
            !hasPackages(p)) ||
          (profileFilter === "MISSING_LOCATION" &&
            !hasLocation(p));

        return matchesSearch && matchesFilter;
      });
    },
    [searchTerm, profileFilter]
  );

  const filteredPhotographers = useMemo(
    () => filterRecords(photographers),
    [photographers, filterRecords]
  );

  // EXPORT EXCEL
  const handleExportExcel = async () => {
    setExporting("excel");

    try {
      const allRecords = await fetchAllIncompleteProfiles();
      const recordsToExport = filterRecords(allRecords);

      if (recordsToExport.length === 0) {
        toast.info("No matching photographer profiles to export.");
        return;
      }

      const worksheet = XLSX.utils.json_to_sheet(
        getExportRows(recordsToExport)
      );

      worksheet["!cols"] = [
        { wch: 8 },
        { wch: 18 },
        { wch: 28 },
        { wch: 30 },
        { wch: 18 },
        { wch: 35 },
        { wch: 12 },
        { wch: 20 },
        { wch: 20 },
        { wch: 32 },
        { wch: 14 },
        { wch: 14 },
        { wch: 32 },
        { wch: 12 },
      ];

      const workbook = XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Incomplete Profiles"
      );

      XLSX.writeFile(
        workbook,
        `incomplete_photographer_profiles_${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`
      );

      toast.success(
        `Exported ${recordsToExport.length} profiles to Excel.`
      );
    } catch (error) {
      toast.error(`Excel export failed: ${getErrorMessage(error)}`);
    } finally {
      setExporting(null);
    }
  };

  // EXPORT PDF
  const handleExportPDF = async () => {
    setExporting("pdf");

    try {
      const allRecords = await fetchAllIncompleteProfiles();
      const recordsToExport = filterRecords(allRecords);

      if (recordsToExport.length === 0) {
        toast.info("No matching photographer profiles to export.");
        return;
      }

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      doc.setFontSize(16);
      doc.text("Incomplete Photographer Profiles", 14, 15);

      doc.setFontSize(9);
      doc.text(
        `Generated: ${new Date().toLocaleString()}`,
        14,
        22
      );
      doc.text(
        `Total records: ${recordsToExport.length}`,
        14,
        28
      );

      autoTable(doc, {
        startY: 34,
        head: [[
          "No.",
          "Name",
          "Email",
          "Phone",
          "Packages",
          "Location",
          "Address",
          "Profile status",
        ]],
        body: recordsToExport.map((p, index) => [
          index + 1,
          getName(p),
          p.email || "—",
          p.phone || "—",
          hasPackages(p)
            ? `${p.packages!.length} package(s)`
            : "Missing",
          hasLocation(p) ? "Set" : "Missing",
          p.address ||
            (hasLocation(p)
              ? `${p.latitude}, ${p.longitude}`
              : "Not provided"),
          getProfileStatus(p),
        ]),
        theme: "grid",
        styles: {
          fontSize: 7,
          cellPadding: 2,
          overflow: "linebreak",
        },
        headStyles: {
          fillColor: [37, 99, 45],
          textColor: 255,
        },
        alternateRowStyles: {
          fillColor: [245, 247, 245],
        },
        columnStyles: {
          0: { cellWidth: 10 },
          1: { cellWidth: 30 },
          2: { cellWidth: 43 },
          3: { cellWidth: 25 },
          4: { cellWidth: 23 },
          5: { cellWidth: 20 },
          6: { cellWidth: 45 },
          7: { cellWidth: 45 },
        },
        margin: { left: 12, right: 12 },
      });

      doc.save(
        `incomplete_photographer_profiles_${new Date()
          .toISOString()
          .slice(0, 10)}.pdf`
      );

      toast.success(
        `Exported ${recordsToExport.length} profiles to PDF.`
      );
    } catch (error) {
      toast.error(`PDF export failed: ${getErrorMessage(error)}`);
    } finally {
      setExporting(null);
    }
  };

  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSize(Number(event.target.value));
    setPage(0);
  };

  const goToPreviousPage = () => {
    setPage((current) => Math.max(0, current - 1));
  };

  const goToNextPage = () => {
    setPage((current) =>
      Math.min(Math.max(0, totalPages - 1), current + 1)
    );
  };

  const startItem =
    totalElements === 0 ? 0 : page * size + 1;

  const endItem = Math.min(
    (page + 1) * size,
    totalElements
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* PAGE HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              <Camera size={25} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Incomplete Photographer Profiles
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Monitor photographers who need to complete their profiles.
              </p>
            </div>
          </div>

          {/* EXPORT AND REFRESH BUTTONS */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void handleExportExcel()}
              disabled={isLoading || exporting !== null}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exporting === "excel" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileSpreadsheet size={16} />
              )}
              Export Excel
            </button>

            <button
              type="button"
              onClick={() => void handleExportPDF()}
              disabled={isLoading || exporting !== null}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exporting === "pdf" ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <FileText size={16} />
              )}
              Export PDF
            </button>

            <button
              type="button"
              onClick={() => void fetchIncompleteProfiles(true)}
              disabled={isLoading || exporting !== null}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={isLoading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Incomplete profiles
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {isLoading ? "—" : totalElements}
                </p>
              </div>
              <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current page</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalPages === 0 ? 0 : page + 1}
                  <span className="text-lg font-medium text-gray-400">
                    {" "}/ {totalPages}
                  </span>
                </p>
              </div>
              <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                <Package size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name, email, phone or address..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <select
              value={profileFilter}
              onChange={(event) =>
                setProfileFilter(event.target.value as ProfileFilter)
              }
              className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-600"
            >
              <option value="ALL">All incomplete profiles</option>
              <option value="MISSING_PACKAGES">Missing packages</option>
              <option value="MISSING_LOCATION">Missing location</option>
            </select>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Table search and filters apply to the current page.
            Exports apply them to all records fetched from the API.
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-2 text-sm text-red-700">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>

            <button
              type="button"
              onClick={() => void fetchIncompleteProfiles()}
              className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700"
            >
              Try again
            </button>
          </div>
        )}

        {/* PHOTOGRAPHER TABLE */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-5 py-4 font-semibold text-gray-600">
                    Photographer
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-600">
                    Contact
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-600">
                    Packages
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-600">
                    Location
                  </th>
                  <th className="px-5 py-4 font-semibold text-gray-600">
                    Profile status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-500">
                        <Loader2
                          size={30}
                          className="animate-spin text-green-700"
                        />
                        <span>Loading photographer profiles...</span>
                      </div>
                    </td>
                  </tr>
                ) : errorMessage ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-gray-500">
                      Unable to load profiles.
                    </td>
                  </tr>
                ) : filteredPhotographers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-500">
                        <CheckCircle2 size={32} className="text-green-600" />
                        <p className="font-medium text-gray-700">
                          No profiles found
                        </p>
                        <p>Try changing your search or filter.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPhotographers.map((photographer) => {
                    const packagesComplete = hasPackages(photographer);
                    const locationComplete = hasLocation(photographer);
                    const image =
                      photographer.profileImageUrl ||
                      photographer.profileImage;

                    const imageUrl = image
                      ? `${API_BASE_URL}${image}`
                      : null;

                    return (
                      <tr
                        key={photographer.id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {imageUrl ? (
                              <img
                                src={imageUrl}
                                alt={getName(photographer)}
                                className="h-11 w-11 rounded-full border border-gray-200 object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 font-semibold text-green-700">
                                {getName(photographer)
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-gray-900">
                                {getName(photographer)}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                ID: {photographer.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-gray-800">
                            {photographer.email || "No email"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {photographer.phone || "No phone"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {packagesComplete ? (
                              <CheckCircle2
                                size={17}
                                className="text-green-600"
                              />
                            ) : (
                              <XCircle
                                size={17}
                                className="text-red-500"
                              />
                            )}

                            <span
                              className={
                                packagesComplete
                                  ? "text-green-700"
                                  : "text-red-600"
                              }
                            >
                              {packagesComplete
                                ? `${photographer.packages!.length} package(s)`
                                : "No packages"}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            {locationComplete ? (
                              <CheckCircle2
                                size={17}
                                className="text-green-600"
                              />
                            ) : (
                              <MapPin
                                size={17}
                                className="text-red-500"
                              />
                            )}

                            <span
                              className={
                                locationComplete
                                  ? "text-green-700"
                                  : "text-red-600"
                              }
                            >
                              {locationComplete ? "Set" : "Not set"}
                            </span>
                          </div>

                          {locationComplete && (
                            <p className="mt-1 text-xs text-gray-500">
                              {photographer.address ||
                                `${photographer.latitude}, ${photographer.longitude}`}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1.5 text-xs font-medium text-orange-800">
                            {getProfileStatus(photographer)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col gap-4 border-t border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex flex-wrap items-center gap-3">
              <label
                htmlFor="page-size"
                className="text-sm text-gray-600"
              >
                Rows per page:
              </label>

              <select
                id="page-size"
                value={size}
                onChange={handlePageSizeChange}
                disabled={isLoading}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-green-600 disabled:opacity-50"
              >
                {[10, 20, 50, 100].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>

              <span className="text-sm text-gray-500">
                {startItem}–{endItem} of {totalElements}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <span className="text-sm text-gray-600">
                Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
              </span>

              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={page === 0 || isLoading}
                aria-label="Previous page"
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={
                  totalPages === 0 ||
                  page >= totalPages - 1 ||
                  isLoading
                }
                aria-label="Next page"
                className="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Excel and PDF exports include all incomplete profiles
          fetched from the paginated API. Search and profile filters
          are applied to the exported file.
        </p>
      </div>
    </div>
  );
}
