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
            <h1 className="sm:text-3xl text-2xl mb-6 font-medium title-font text-gray-900">
              Notificaciones
            </h1>
            <div className="flex justify-center mb-4">
              <div className="flex items-center mr-4">
                <span className="w-3 h-3 bg-grisclaro2 rounded-full inline-block mr-2"></span>
                <span className="text-gray-700">No Leídas</span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-gray-500 rounded-full inline-block mr-2"></span>
                <span className="text-gray-700">Leídas</span>
              </div>
            </div>
            {!loadingNotificaciones && (
            <div className="flex justify-center">
              <div className="lg:w-1/2">
                {notificaciones.length > 0 ? (
                notificaciones.map((notificacion, index) => (
                  <NotificationCard key={index} index={index} notificacion={notificacion} setNotiAbierta={setNotiAbierta} setNotiEstado={setNotiEstado} />
                ))
                ) : (
                <p className="text-gray-500 text-center">No hay notificaciones.</p>
                )}
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
