import { Component, ReactNode } from 'react'

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(err: any) {
    console.error('UI error:', err)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 rounded-xl bg-red-50 text-red-700">
          Something went wrong while rendering. Please refresh and try again.
        </div>
      )
    }
    return this.props.children
  }
}
