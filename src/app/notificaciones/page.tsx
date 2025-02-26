"use client";

import Navbar from "@/components/Navbar";
import { UpdateTriggerProvider } from "@/app/context"; // Import the UpdateTriggerProvider
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import NotificationCard from "@/components/NotificationCard";
import PopUpNotification from "@/components/PopUpNotification";
export default function Home() {
    const {
      traerNotificacionesUser,
      loadingNotificaciones,
    } = useAppContext();
    const [notiAbierta, setNotiAbierta] = useState(-1);
    const [notiEstado, setNotiEstado] = useState(false);
    const [notificaciones, setNotificaciones] = useState([]);
    useEffect(() => {
      const fetchData = async () => {
        setNotificaciones(await traerNotificacionesUser());
      };
      fetchData();
    }, []);
  return (
    <UpdateTriggerProvider>
      <Navbar></Navbar>
      <section className="pt-40 md:pt-20">
        <div className="container mx-auto  bg-white p-5 md:p-8 md:mt-10 mt-1 rounded-lg shadow-lg">
          <div className="text-center mb-2">
            <h1 className="sm:text-3xl text-2xl mb-10 font-medium title-font text-gray-900">
              Notificaciones
            </h1>
            {!loadingNotificaciones && (
            <div className="flex justify-center">
              <div className="w-1/2">
              {notificaciones.map((notificacion, index) => (
                <NotificationCard key={index} index={index} notificacion={notificacion} setNotiAbierta={setNotiAbierta} setNotiEstado={setNotiEstado} />
              ))}
              </div>
            </div>
            )}
          </div>
        </div>
      </section>
      {notiEstado &&  
      <PopUpNotification notificacionArray={notificaciones} setNotiEstado={setNotiEstado} notiAbierta={notiAbierta}  />}
    </UpdateTriggerProvider>
  );
}
