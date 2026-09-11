
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

      <p className="text-sm text-gray-500 mb-8">
        <strong>Last Updated:</strong> September 2026
      </p>

      <p className="mb-6">
        Welcome to Jemigrapher. We respect your privacy and are committed to
        protecting your personal information when you use the Jemigrapher
        mobile application and services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        1. Information We Collect
      </h2>

      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>
          <strong>Account Information:</strong> Name, phone number, and email
          address used to create and manage your account.
        </li>

        <li>
          <strong>Location Data:</strong> Location information used to provide
          photographer tracking and location-based booking services.
        </li>

        <li>
          <strong>Booking Information:</strong> Information related to
          bookings, booking status, and services requested through the app.
        </li>

        <li>
          <strong>Device Information:</strong> Device notification tokens used
          to send booking and service notifications.
        </li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        2. How We Use Your Information
      </h2>

      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Manage your account and bookings.</li>
        <li>Provide photographer location tracking during active bookings.</li>
        <li>Send booking and service notifications.</li>
        <li>Provide customer support and improve our services.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        3. Location Information
      </h2>

      <p className="mb-6">
        Jemigrapher may collect location information to provide photographer
        tracking during an active booking. When background location access is
        enabled, location information may be collected when the application is
        running in the background or when the app is not actively being used.
        This is used to allow clients to track the assigned photographer while
        the photographer is travelling to the booking location.
      </p>

      <p className="mb-6">
        Location information is used only to provide location-based booking
        and tracking services and is not used for advertising.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        4. Sharing of Information
      </h2>

      <p className="mb-6">
        We do not sell or rent your personal information. Information may be
        shared with the relevant user when necessary to provide the requested
        booking or tracking service, or when required by law.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        5. Data Security
      </h2>

      <p className="mb-6">
        We use reasonable technical and organizational measures to protect
        your information against unauthorized access, loss, misuse, or
        disclosure.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        6. Account Deletion
      </h2>

      <p className="mb-6">
        You may request deletion of your Jemigrapher account and associated
        personal information. To request deletion, contact us using the email
        address below.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        7. Changes to This Policy
      </h2>

      <p className="mb-6">
        We may update this Privacy Policy when necessary. Any changes will be
        published on this page with an updated date.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">
        8. Contact Us
      </h2>

      <p className="mb-2">
        If you have questions about this Privacy Policy, contact:
      </p>

      <ul className="list-none space-y-1 mb-8">
        <li>
          <strong>Developer:</strong> Ahmad Siasa
        </li>
        <li>
          <strong>Email:</strong> help@jemigraph.co.tz
        </li>
        <li>
          <strong>Website:</strong> jemigraph.co.tz
        </li>
      </ul>

      <p className="text-sm text-gray-500">
        © 2026 Hi Developers at Ahmad Siasa. All rights reserved.
      </p>
    </div>
  );
}

