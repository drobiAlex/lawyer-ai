'use client';
import React from "react";
import {useRouter} from "next/navigation";
import {SelectForm} from "@/components/Onboarding";


export default function Home() {
  const router = useRouter();

  function onClick() {
    router.push('/builder')
  }

  return (
    <>
      <div className='container flex h-screen w-screen flex-col items-center justify-center'>
        <SelectForm/>
      </div>
    </>
  )
}
