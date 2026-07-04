export type FallbackVariant = "notFound" | "error"

type FallbackAction =
  | {
      type: "link"
      label: string
      href: string
      variant?: "default" | "outline"
    }
  | {
      type: "retry"
      label: string
    }

export type FallbackContent = {
  code: string
  title: string
  description: string
  actions: readonly FallbackAction[]
}

export const FALLBACK_PAGE_CONTENT: Record<FallbackVariant, FallbackContent> = {
  notFound: {
    code: "404",
    title: "Event Not Found",
    description:
      "We couldn't find the event or page you're looking for. It might have been moved, deleted, or never existed in the first place.",
    actions: [
      { type: "link", label: "Back to Home", href: "/" },
      { type: "link", label: "Browse Events", href: "/events", variant: "outline" },
    ],
  },
  error: {
    code: "500",
    title: "Something Went Wrong",
    description:
      "An unexpected error occurred while loading this page. You can retry the request or return to the home page.",
    actions: [
      { type: "retry", label: "Try Again" },
      { type: "link", label: "Back to Home", href: "/", variant: "outline" },
    ],
  },
}
