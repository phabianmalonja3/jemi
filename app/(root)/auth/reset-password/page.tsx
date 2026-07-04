import React from 'react';
import ResetPasswordClient from './ResetPasswordClient';

interface PageProps {
  readonly searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  // Await search parameters asynchronously in Next.js
  const resolvedParams = await searchParams;
  const token = resolvedParams.token ?? '';

  return <ResetPasswordClient token={token} />;
}