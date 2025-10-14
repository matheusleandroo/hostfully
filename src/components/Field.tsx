import { ReactNode } from 'react'

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="grid gap-1">
      <span className="label">{label}</span>
      {children}
    </label>
  )
}
