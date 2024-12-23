"use client";

import Navbar from "@/components/Navbar";
import { UpdateTriggerProvider } from "@/app/context"; // Import the UpdateTriggerProvider
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";

export default function Home() {


  return (
    <UpdateTriggerProvider>
            <Navbar></Navbar>
      <div>a</div>
        
    </UpdateTriggerProvider>
  );
}
