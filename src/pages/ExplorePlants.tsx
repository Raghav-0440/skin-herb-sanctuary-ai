import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { plantsData } from '@/data/plantsData';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const categories = [
  'All',
  'General Skincare',
  'Acne',
  'Eczema',
  'Psoriasis',
  'Burns & Wounds',
  'Skin Allergies',
  'Complexion',
  'Other'
];

export default function ExplorePlants() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPlants = Object.values(plantsData).filter(plant => {
    const matchesSearch = plant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plant.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || plant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />
      <main className="section-spacing container-width pt-24">
        <h1 className="section-title mb-4">Explore Medicinal Plants</h1>
        <p className="section-description mb-16">
          Discover traditional herbs and plants used in skincare and healing
        </p>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search plants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-green-500 text-white'
                    : 'bg-[#1a1a1a] text-gray-300 hover:bg-[#2a2a2a]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlants.map((plant) => (
            <Link
              key={plant.id}
              to={`/explore-plants/${plant.id}`}
              className="bg-[#1a1a1a] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={plant.image}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{plant.name}</h3>
                <p className="text-gray-400 text-sm italic mb-4">{plant.scientificName}</p>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#2a2a2a] rounded-full text-sm">
                    {plant.category}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
