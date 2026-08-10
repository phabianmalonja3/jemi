"use client";
import React, { useState, useEffect } from 'react';
import { AppVersionRequest, AppVersion } from '@/lib/models/app_version';
import { toast } from 'sonner';

export default function AppVersionManager() {
  const [formData, setFormData] = useState<AppVersionRequest>({
    appId: 'com.jemigraph.jemigrapher',
    platform: 'ANDROID',
    currentVersion: '1.0.0',
    currentBuildNumber: 1,
    minimumBuildNumber: 1,
    updateMessage: 'A new version of the app is available. Please update to continue.',
    storeUrl: 'https://play.google.com/store/apps/details?id=com.jemigraph.jemigrapher',
    active: true,
  });

  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  // Fetch existing app versions list
  const fetchVersions = async () => {
    try {
      setFetching(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const response = await fetch(`${baseUrl}/app-version/all`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setVersions(data);
      }
    } catch (error) {
      console.error('Failed to fetch versions:', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  // Handle Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'currentBuildNumber' || name === 'minimumBuildNumber') {
      setFormData(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Submit to Spring Boot Backend (`POST /app-version`)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

      const response = await fetch(`${baseUrl}/app-version`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {

        toast.success(" App version configuration saved successfully!")


        setSuccessMessage('🎉 App version configuration saved successfully!');
        fetchVersions(); // Refresh the list
      } else {
        const errorData = await response.json().catch(() => null);
        setErrorMessage(errorData?.message || '❌ Failed to save app version.');
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrorMessage('❌ Network error occurred while connecting to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 my-8">
      {/* FORM SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Manage App Versions</h2>
        <p className="text-sm text-gray-500 mb-6">Configure application versions and control updates for your apps.</p>

        {successMessage && (
          <div className="mb-4 p-4 text-sm text-green-700 bg-green-50 rounded-lg border border-green-200">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* App ID Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target App ID</label>
              <select
                name="appId"
                value={formData.appId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              >
                <option value="com.jemigraph.jemigrapher">com.jemigraph.jemigrapher (jemigrapher)</option>
                <option value="com.jemigraph.jemigraph">com.jemigraph.jemigraph (jemigraph)</option>
              </select>
            </div>

            {/* Platform Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              >
                <option value="ANDROID">ANDROID</option>
                <option value="IOS">IOS</option>
              </select>
            </div>
          </div>

          {/* Current Version & Build Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Version Name (e.g., 1.0.2)</label>
              <input
                type="text"
                name="currentVersion"
                value={formData.currentVersion}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Build (e.g., 12)</label>
              <input
                type="number"
                name="currentBuildNumber"
                value={formData.currentBuildNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Build (Force Update)</label>
              <input
                type="number"
                name="minimumBuildNumber"
                value={formData.minimumBuildNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Store URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store URL</label>
            <input
              type="url"
              name="storeUrl"
              value={formData.storeUrl}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* Update Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Message</label>
            <textarea
              name="updateMessage"
              rows={2}
              value={formData.updateMessage}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* Active Checkbox */}
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

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#25632D] text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Version Configuration'}
          </button>
        </form>
      </div>

      {/* LIST TABLE SECTION */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Existing Version Configurations</h3>
        
        {fetching ? (
          <p className="text-sm text-gray-500 py-4 text-center">Loading versions...</p>
        ) : versions.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No configurations found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase bg-gray-50">
                  <th className="p-3">App ID</th>
                  <th className="p-3">Platform</th>
                  <th className="p-3">Version</th>
                  <th className="p-3">Current Build</th>
                  <th className="p-3">Min Build</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {versions.map((ver) => (
                  <tr key={ver.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 font-semibold text-gray-800">{ver.appId}</td>
                    <td className="p-3 text-gray-600">{ver.platform}</td>
                    <td className="p-3 text-gray-600">{ver.currentVersion}</td>
                    <td className="p-3 text-gray-600">{ver.currentBuildNumber}</td>
                    <td className="p-3 text-gray-600">{ver.minimumBuildNumber}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        ver.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {ver.active ? 'Active' : 'Inactive'}
                      </span>
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