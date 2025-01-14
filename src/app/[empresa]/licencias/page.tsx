"use client";

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

import React from "react";
interface Photo {
  id: string; // Unique identifier for the photo
  file: File; // The actual file object
}

const Home = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [notas, setNotas] = useState("");
  const [tipoLicencia, setTipoLicencia] = useState("");
  const [archivos, setArchivos] = useState<File[]>([]);
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
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };
  const handleDeletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((photo) => photo.id !== id));
  };
  const handleSelect = (ranges: any) => {
    setSelectionRange(ranges.selection);
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
    const formData = {
      selectionRange,
      notas,
      tipoLicencia,
      archivos,
    };
    console.log(formData);
    // Example API call
    // await api.post("/your-endpoint", formData);
  };

  return (
    <UpdateTriggerProvider>
      <Navbar />
      <section className="pt-40 md:pt-20">
        <div className="container mx-auto flex justify-center  bg-white p-5 md:p-8 md:mt-10 mt-1 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="">
          <h1 className="text-2xl font-bold mb-5 text-center">Solicitud de Licencia</h1>

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
                  onChange={(e) => setNotas(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                ></textarea>
              </div>
              <div>
              <label>Archivos:</label>
              <div className="flex flex-wrap w-80 gap-4 items-center">
                {photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative w-24 h-24 rounded-full border-2 border-gray-300 overflow-hidden flex items-center justify-center"
                  >
                    <Image
                      src={photo.id}
                      alt="Uploaded"
                      layout="fill"
                      objectFit="cover"
                    />
                    <button
                      onClick={() => handleDeletePhoto(photo.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <label
                  htmlFor="photo-upload"
                  className="w-24 h-24 rounded-full bg-orange-100 border-2 border-dashed border-orange-400 flex items-center justify-center cursor-pointer hover:bg-orange-200"
                >
                  <span className="text-orange-500 text-2xl font-bold">+</span>
                </label>
                <input
                  type="file"
                  id="photo-upload"
                  accept="image/*"
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
              </div>
            </div>
            </div>
            <div className="flex justify-center mt-5">
            <button
              type="submit"
              className="px-10 py-2  bg-blue-500 text-white rounded-2xl hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
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
