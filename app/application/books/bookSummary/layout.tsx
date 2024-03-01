// app/layout.ts

import ContextQueryContextProvider from "@/app/wrappers/ContextQueryContext"

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <section><ContextQueryContextProvider> {children}</ContextQueryContextProvider></section>
  }
