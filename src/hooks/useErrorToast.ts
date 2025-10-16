import { useEffect } from 'react'
import { toast } from 'react-toastify'

export function useErrorToast(error: string | null) {
  useEffect(() => {
    if (error) toast.error(error)
  }, [error])
}
