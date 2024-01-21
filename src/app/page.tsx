'use client';
import {redirect} from "next/navigation";
import React from "react";
import {Button} from "@/components/ui/button";


export default function Home() {
  function onClick() {
    redirect('/builder')
  }

  return (
    <>
      <Button onClick={onClick}>Go to builder</Button>
    </>
  )
}
