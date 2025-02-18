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
import { addDays } from "date-fns";
import Image from "next/image";
import { differenceInDays } from "date-fns";

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
  const { licenciaPost, enviarImagen, imagenLoading } = useAppContext();
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });

  const handleAddPhoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newPhotos: Photo[] = Array.from(files).map((file) => ({
      id: URL.createObjectURL(file), // Generate a unique URL for preview
      file,
      description: "",
      type: file.type.startsWith("image") ? "image" : "pdf",
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };
  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };
  const handleSelect = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    setSelectionRange(ranges.selection);
    const days = differenceInDays(endDate, startDate) + 1;
    setDaysCount(days);
  };
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setArchivos([...archivos, ...Array.from(event.target.files)]);
    }
  };

  const handleFileRemove = (index: number) => {
    setArchivos(archivos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Call your API with the form data
    const photosNames = [];
    for (const photo of photos) {
      photosNames.push(await enviarImagen(photo.file, photo.description));
    }
    let concatPhotos = "";
    for (const photoName of photosNames) {
      concatPhotos += photoName; 
    }
    const formData = {
      selectionRange,
      notas,
      tipoLicencia,
      photos,
      daysCount,
      ARCHIVOS: concatPhotos,
    };
    licenciaPost(formData);
    console.log(formData);
  };

  return (
    <UpdateTriggerProvider>
      <Navbar />
      <section className="pt-40 md:pt-20">
        <div className="container mx-auto flex justify-center  bg-white p-5 md:p-8 md:mt-10 mt-1 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="">
            <h1 className="text-2xl font-bold mb-5 text-slate-700 text-center">
              Solicitud de Licencia
            </h1>

            <div className="flex ">
              <div className=" mr-10">
                <div className="mb-5 ">
                  <label>Tipo de Licencia:</label>
                  <select
                    value={tipoLicencia}
                    onChange={(e) => setTipoLicencia(e.target.value)}
                    className="w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="V">Vacaciones</option>
                    <option value="E">Enfermedad</option>
                    <option value="A">Accidente</option>
                    <option value="M">Matrimonio</option>
                    <option value="N">Nacimiento de hijo/adopción</option>
                    <option value="F">Fallecimiento de familiar</option>
                    <option value="Z">Mudanza</option>
                    <option value="D">Donación de sangre</option>
                    <option value="X">Estudio/examen</option>
                    <option value="C">Enfermedad/accidente</option>
                    <option value="P">Maternidad/paternidad</option>
                    <option value="T">Tareas gremiales</option>
                    <option value="O">Otras</option>
                  </select>
                </div>
                <div>
                  <label>Notas:</label>
                    <textarea
                    value={notas}
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^a-zA-Z0-9\s!?¡¿]/g, "");
                      setNotas(value);
                    }}
                    className="w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                    ></textarea>
                </div>
                <div className="mt-3">
                  <label>Archivos:</label>
                    <div className="flex flex-wrap flex-col w-80 gap-4 w-full pt-2">
                    {photos.map((photo) => (
                      <div
                      key={photo.id}
                      className="relative rounded-lg w-24 h-24 border-2 border-gray-300 overflow-hidden flex w-full"
                      >
                      <div className="relative w-24 h-30">
                        {photo.type === "image" ? (
                        <Image
                          src={photo.id}
                          alt="Uploaded"
                          width={300}
                          height={300}
                          objectFit="cover"
                        />
                        ) : (
                        <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                          <Viewer fileUrl={photo.id} />
                        </Worker>
                        )}
                      </div>
                      <div className="p-2 pt-0 flex flex-col w-full">
                        <label className="mt-2">Descripción:</label>
                        <input
                        type="text"
                        required
                        value={photo.description}
                        onChange={(e) => {
                          const updatedPhotos = photos.map((p) =>
                          p.id === photo.id
                            ? { ...p, description: e.target.value }
                            : p
                          );
                          setPhotos(updatedPhotos);
                        }}
                        className="w-30 p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2"
                        />
                      </div>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="absolute -top-0 -right-0 bg-red-500 text-white rounded-bl-lg rounded-tr-sm rounded-tl-none rounded-br-none w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600"
                      >
                        ×
                      </button>
                      </div>
                    ))}
                    <label
                      htmlFor="photo-upload"
                      className="w-full h-16 rounded-md bg-orange-100 border-2 border-dashed border-orange-400 flex items-center justify-center cursor-pointer hover:bg-orange-200"
                    >
                      <span className="text-orange-500 text-lg font-bold">
                      Agregar archivo
                      </span>
                    </label>
                    <input
                      type="file"
                      id="photo-upload"
                      accept="image/*,application/pdf"
                      multiple
                      className="hidden"
                      onChange={handleAddPhoto}
                    />
                    </div>
                </div>
              </div>

              <div>
                <div className="mb-3 flex flex-col">
                  <label>Fecha:</label>
                  <DateRange
                    ranges={[selectionRange]}
                    onChange={handleSelect}
                    locale={es} // Pass the Spanish locale here
                  />
                  <h2>{`Cantidad de dias: ${daysCount}`}</h2>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-5">
              <button
                type="submit"
                className="px-12 py-2  bg-blue-500 text-white rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </section>
    </UpdateTriggerProvider>
  );
};

export default Home;
