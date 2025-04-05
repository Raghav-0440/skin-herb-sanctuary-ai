
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PlantCard from "../components/PlantCard";
import { plantData } from "../data/plantData";
import { Search } from "lucide-react";

const ExplorePlants = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPlants = plantData.filter((plant) =>
    plant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-white">
            Explore the Healing Power of Plants and Herbs
          </h1>

          <div className="relative max-w-xl mb-10">
            <input
              type="text"
              placeholder="Search Your Herbal Plant By Name!"
              className="w-full bg-[#222] border border-[#333] rounded-full py-3 pl-5 pr-12 text-white focus:outline-none focus:ring-2 focus:ring-herb focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-herb">
              <Search size={20} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredPlants.length > 0 ? (
              filteredPlants.map((plant) => (
                <PlantCard
                  key={plant.id}
                  id={plant.id}
                  name={plant.name}
                  image={plant.image}
                  family={plant.family}
                  familyLatin={plant.familyLatin}
                  genus={plant.genus}
                  size={plant.size}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl text-white font-medium mb-2">
                  No plants found
                </h3>
                <p className="text-gray-400">
                  Try searching with a different term
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExplorePlants;
