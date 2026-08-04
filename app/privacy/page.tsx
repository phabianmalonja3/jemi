import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">
        <strong>Last Updated:</strong> August 2026
      </p>

      <p className="mb-6">
        Welcome to Jemiapp. We respect your privacy and are committed to protecting your personal data. 
        This privacy policy explains how we collect, use, and safeguard your information when you use our mobile application and services.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">1. Information We Collect</h2>
      <p className="mb-2">We may collect the following types of information when you use our services:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li><strong>Account Information:</strong> Your name, phone number, and email address used to create an account.</li>
        <li><strong>Location Data:</strong> GPS location information when making a booking or tracking your photographer while they are en route (<code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">EN_ROUTE</code>).</li>
        <li><strong>Device Information (FCM Tokens):</strong> Device tokens used to send push notifications regarding your booking status.</li>
        <li><strong>Feedback and Ratings:</strong> Information you submit through the review page after a service is completed.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">2. How We Use Your Information</h2>
      <p className="mb-2">We use the collected information to:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Initiate, manage, and complete your booking requests.</li>
        <li>Send you important notifications regarding your service status (e.g., when a photographer accepts or is on the way).</li>
        <li>Improve our services and enhance your user experience within the app.</li>
        <li>Communicate with you for support or service updates.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">3. Data Security</h2>
      <p className="mb-6">
        We implement appropriate security measures to protect your personal information against unauthorized access, alteration, 
        disclosure, or destruction. We utilize secure storage mechanisms on your device and protected environments on our backend servers.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">4. Sharing Your Information</h2>
      <p className="mb-6">
        We do not sell, trade, or rent your personal information to third parties, except as necessary to provide the requested service 
        (such as sharing your location details with the assigned photographer) or when required by law.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">5. Your Rights</h2>
      <p className="mb-2">You have the right to:</p>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Access and update your account information at any time.</li>
        <li>Request the deletion of your account and associated data from our systems.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-8 mb-3">6. Changes to This Policy</h2>
      <p className="mb-6">
        We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-3">7. Contact Us</h2>
      <p className="mb-2">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
      <ul className="list-none space-y-1">
        <li><strong>Email:</strong> support@jemigraph.co.tz</li>
        <li><strong>Phone:</strong> +255 700 000 000</li>
      </ul>
    </div>
  );
}