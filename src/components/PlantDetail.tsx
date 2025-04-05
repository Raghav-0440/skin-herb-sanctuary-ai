
import { ArrowLeft, ArrowRight, PlayCircle, BookOpenCheck, Activity, ThermometerSun, Droplet, SunMedium } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { plantData } from "../data/plantData";

const PlantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const plant = plantData.find((p) => p.id === id);

  if (!plant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Plant not found</h1>
          <Link to="/explore" className="herb-button mt-4 inline-block">
            Go back to Explore
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6 md:px-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{plant.name}</h1>
        <Link to="/explore" className="herb-button-outline">
          Go back
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          <div className="herb-info">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-[#222]">
                <ThermometerSun size={24} className="text-herb" />
              </div>
              <h3 className="text-herb">Plant Size</h3>
            </div>
            <p className="mt-2 text-white">{plant.detailedInfo.size}</p>
          </div>

          <div className="herb-info">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-[#222]">
                <Droplet size={24} className="text-herb" />
              </div>
              <h3 className="text-herb">Native Region</h3>
            </div>
            <p className="mt-2 text-white">{plant.detailedInfo.nativeRegion}</p>
          </div>

          <div className="herb-info">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-[#222]">
                <ThermometerSun size={24} className="text-herb" />
              </div>
              <h3 className="text-herb">Preferred Climate</h3>
            </div>
            <p className="mt-2 text-white">{plant.detailedInfo.climate}</p>
          </div>

          <div className="herb-info">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-[#222]">
                <SunMedium size={24} className="text-herb" />
              </div>
              <h3 className="text-herb">Required Sunlight</h3>
            </div>
            <p className="mt-2 text-white">{plant.detailedInfo.sunlight}</p>
          </div>

          <div className="herb-info">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-[#222]">
                <Droplet size={24} className="text-herb" />
              </div>
              <h3 className="text-herb">Required Soil</h3>
            </div>
            <p className="mt-2 text-white">{plant.detailedInfo.soil}</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-4 mb-4">
            <button className="herb-button flex items-center gap-2">
              <BookOpenCheck size={20} />
              AYUSH Application
            </button>
            <button className="herb-button-outline flex items-center gap-2">
              <Activity size={20} />
              Health Benefits
            </button>
          </div>

          <div className="herb-info bg-[#1a1a1a] flex items-center gap-4 p-4">
            <PlayCircle size={24} className="text-herb" />
            <span className="text-white">Plant Knowledge on Play</span>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            <div className="relative w-full aspect-square max-w-md">
              <img 
                src={plant.image} 
                alt={plant.name}
                className="w-full h-full object-contain" 
              />
              <button className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#222] hover:bg-[#333]">
                <ArrowLeft size={20} className="text-herb" />
              </button>
              <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#222] hover:bg-[#333]">
                <ArrowRight size={20} className="text-herb" />
              </button>
            </div>
          </div>

          <div className="herb-info">
            <h3 className="text-herb mb-2">Part used in medicinal</h3>
            <div className="flex flex-wrap gap-2">
              {plant.medicinalParts.map((part, idx) => (
                <span key={idx} className="bg-[#222] px-3 py-1 rounded-full text-white flex items-center gap-1">
                  {part}
                </span>
              ))}
            </div>
          </div>

          <div className="herb-info">
            <h3 className="text-herb mb-2">Active compounds in plants</h3>
            <div className="flex flex-wrap gap-2">
              {plant.compounds.map((compound, idx) => (
                <span key={idx} className="bg-[#222] px-3 py-1 rounded-full text-white">{compound}</span>
              ))}
            </div>
          </div>

          <div className="herb-info">
            <h3 className="text-herb mb-2">Therapeutic properties in plants</h3>
            <div className="flex flex-wrap gap-2">
              {plant.therapeuticProperties.map((property, idx) => (
                <span key={idx} className="bg-[#222] px-3 py-1 rounded-full text-white">{property}</span>
              ))}
            </div>
          </div>

          <div className="herb-info">
            <h3 className="text-herb mb-2">Dosage Form</h3>
            <div className="flex flex-wrap gap-2">
              {plant.dosageForms.map((form, idx) => (
                <span key={idx} className="bg-[#222] px-3 py-1 rounded-full text-white">{form}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetail;
