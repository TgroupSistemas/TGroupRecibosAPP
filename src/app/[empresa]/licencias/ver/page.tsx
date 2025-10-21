"use client";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import Navbar from "@/components/Navbar";
import { UpdateTriggerProvider } from "@/app/context"; // Import the UpdateTriggerProvider
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import es from "date-fns/locale/es"; // This works after installing date-fns
import { addDays, differenceInDays } from "date-fns";
import Image from "next/image";
import LicenciaCard from "@/components/LicenciaCard";
import PopUpLicencia from "@/components/PopUpLicencia";
import React from "react";

interface Photo {
  id: string; // Unique identifier for the photo
  file: File; // The actual file object
  description: string; // A description of the photo
  type?: "image" | "pdf"; // The type of the file
}

const Home = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [notas, setNotas] = useState("");
  const [tipoLicencia, setTipoLicencia] = useState("V");
  const [archivos, setArchivos] = useState<File[]>([]);
  const [daysCount, setDaysCount] = useState(1);
  const [errorsito, setError] = useState("");
  const [notiAbierta, setNotiAbierta] = useState(-1);
  const [notiEstado, setNotiEstado] = useState(false);
  const [licencias, setLicencias] = useState<any[]>([]);

  const {
    licenciaPost,
    enviarImagen,
    imagenLoading,
    getCookie,
    traerLicenciaUser,
    loadingLicencias,
  } = useAppContext();

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await traerLicenciaUser();
      setLicencias(data || []);
    };
    fetchData();
  }, [traerLicenciaUser]);

  const irALicencias = async () => {
    const empresa = await getCookie("fl_erp_empresas");
    window.location.replace("/" + empresa + "/licencias");
  };

  return (
    <UpdateTriggerProvider>
      <Navbar />
      <section className="pt-40 md:pt-20">
        <div className="container mx-auto flex justify-center bg-white p-5 md:p-8 md:mt-10 mt-1 rounded-lg shadow-lg">
          <div className="container mx-auto bg-white p-5 md:p-8 md:mt-10 mt-1 rounded-lg shadow-lg">
            <div className="text-center mb-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => irALicencias()}
                  className="px-5 py-2 bg-grisclaro2 my-5 text-white rounded-lg hover:bg-grisclaro focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Cargar licencia/documentación
                </button>
              </div>

              <h1 className="sm:text-3xl text-2xl mb-10 font-medium title-font text-gray-900">
                Licencias y documentación
              </h1>

              {loadingLicencias && (
                <div className="flex justify-center">
                  <span className="loading loading-infinity loading-lg"></span>
                </div>
              )}

              {!loadingLicencias && (
                <div className="flex justify-center">
                  <div className="lg:w-1/2">
                    {licencias.length === 0 ? (
                      <p className="text-center text-gray-500">
                        No tenés licencias registradas.
                      </p>
                    ) : (
                      licencias.map((licencia, index) => (
                        <LicenciaCard
                          key={index}
                          index={index}
                          notificacion={licencia}
                          setNotiAbierta={setNotiAbierta}
                          setNotiEstado={setNotiEstado}
                        />
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {notiEstado && (
        <PopUpLicencia
          notificacionArray={licencias}
          setNotiEstado={setNotiEstado}
          notiAbierta={notiAbierta}
        />
      )}
    </UpdateTriggerProvider>
  );
};

export default Home;
