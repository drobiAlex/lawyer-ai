'use client';
import React, {useState} from "react";

import {Loader2} from "lucide-react";

import {SelectForm} from "@/components/Onboarding";


export default function Home() {
  const [loading, setLoading] = useState(false)
  return (
    <>
      <div className='container flex h-screen w-screen flex-col items-center justify-center'>
        {loading ? (
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin">
            <p className='mt-2 text-sm text-slate-500'>Uploading...</p>
          </Loader2>
        ) : (
          <SelectForm
            setLoading={setLoading}
          />
        )}
      </div>
    </>
  )
}
