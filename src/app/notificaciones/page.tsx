"use client";

import Navbar from "@/components/Navbar";
import { UpdateTriggerProvider } from "@/app/context"; // Import the UpdateTriggerProvider
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import NotificationCard from "@/components/NotificationCard";

export default function Home() {
  return (
    <UpdateTriggerProvider>
      <Navbar></Navbar>
      <section className="pt-40 md:pt-20">
        <div className="container mx-auto  bg-white p-5 md:p-8 md:mt-10 mt-1 rounded-lg shadow-lg">
          <div className="text-center mb-2">
            <h1 className="sm:text-3xl text-2xl mb-10 font-medium title-font text-gray-900">
              Notificaciones
            </h1>
            <div className="flex justify-center">
              <div className="w-1/2">
                <NotificationCard index={1}></NotificationCard>
            </div>
            </div>
          </div>
        </div>
      </section>
    </UpdateTriggerProvider>
  );
}
