interface PackageLayoutProps {
  children: React.ReactNode
  status: React.ReactNode
  details: React.ReactNode
  vitals: React.ReactNode
  params: Promise<{
    packageName: string
  }>
}

export default async function PackageLayout({
  children,
  status,
  details,
  vitals,
  params,
}: PackageLayoutProps) {
  const resolvedParams = await params
  const packageName = resolvedParams.packageName

  return (
    <div className="dashboard-grid space-y-6">
      {/* Kama slot inahitaji kupitishwa kwa props au kama React inavyozi-render */}
      <div className="status-panel">{status}</div>
      <div className="details-panel">{details}</div>
      <div className="vitals-panel">{vitals}</div>
      {children}
    </div>
  )
}