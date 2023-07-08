'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      router.push('/story')
      return
    }

    router.push('/auth/login')
  }, [router])

  return (
    <></>
  )
}
