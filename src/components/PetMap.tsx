import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Pet } from '@/types/pet';

interface ExtendedIconDefault extends L.Icon.Default {
  _getIconUrl?: () => string;
}

delete (L.Icon.Default.prototype as ExtendedIconDefault)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PetMapProps {
  pets: Pet[];
  selectedPet: Pet | null;
  onPetSelect: (petId: string | null) => void;
}

export const PetMap: React.FC<PetMapProps> = ({ pets, selectedPet, onPetSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const pathsRef = useRef<Map<string, L.Polyline>>(new Map());

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Inicializar mapa centrado em São Paulo
    const map = L.map(mapRef.current).setView([-23.5505, -46.6333], 13);
    
    // Adicionar tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Limpar markers existentes
    markersRef.current.forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current.clear();

    // Limpar paths existentes
    pathsRef.current.forEach(path => {
      map.removeLayer(path);
    });
    pathsRef.current.clear();

    // Adicionar markers dos pets
    pets.forEach(pet => {
      // Marker da casa
      const homeIcon = L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 bg-success rounded-full border-2 border-white shadow-lg">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </div>
        `,
        className: 'custom-home-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const homeMarker = L.marker([pet.homeLocation.lat, pet.homeLocation.lng], { 
        icon: homeIcon 
      }).addTo(map);
      
      homeMarker.bindPopup(`
        <div class="text-center">
          <strong>🏠 Casa do ${pet.name}</strong><br/>
          <small class="text-gray-600">Local seguro</small>
        </div>
      `);

      // Marker do pet atual
      const isSelected = selectedPet?.id === pet.id;
      const petIcon = L.divIcon({
        html: `
          <div class="relative">
            <div class="flex items-center justify-center w-12 h-12 bg-primary rounded-full border-3 border-white shadow-xl ${isSelected ? 'ring-4 ring-primary/30' : ''}">
              <img src="${pet.photo}" alt="${pet.name}" class="w-10 h-10 rounded-full object-cover" />
            </div>
            ${pet.isActive ? `
              <div class="absolute -top-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white animate-pulse"></div>
            ` : ''}
            ${isSelected ? `
              <div class="absolute inset-0 w-12 h-12 bg-primary/20 rounded-full animate-ping"></div>
            ` : ''}
          </div>
        `,
        className: 'custom-pet-marker',
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });

      const petMarker = L.marker([pet.currentLocation.lat, pet.currentLocation.lng], { 
        icon: petIcon 
      }).addTo(map);

      petMarker.bindPopup(`
        <div class="text-center min-w-[200px]">
          <div class="mb-3">
            <img src="${pet.photo}" alt="${pet.name}" class="w-16 h-16 rounded-full mx-auto mb-2 object-cover" />
            <strong class="text-lg">${pet.name}</strong>
          </div>
          <div class="space-y-1 text-sm">
            <div><strong>Raça:</strong> ${pet.breed}</div>
            <div><strong>Idade:</strong> ${pet.age} anos</div>
            <div><strong>Status:</strong> 
              <span class="inline-flex items-center px-2 py-1 rounded-full text-xs ${pet.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                ${pet.isActive ? '🟢 Ativo' : '🔴 Inativo'}
              </span>
            </div>
          </div>
        </div>
      `);

      petMarker.on('click', () => {
        onPetSelect(pet.id);
      });

      markersRef.current.set(pet.id, petMarker);

      // Linha conectando casa ao pet
      if (pet.pathHistory.length > 0) {
        const pathCoords: [number, number][] = [
          [pet.homeLocation.lat, pet.homeLocation.lng],
          ...pet.pathHistory.map(p => [p.lat, p.lng] as [number, number]),
          [pet.currentLocation.lat, pet.currentLocation.lng]
        ];

        const path = L.polyline(pathCoords, {
          color: isSelected ? '#10B981' : '#60A5FA',
          weight: isSelected ? 4 : 2,
          opacity: isSelected ? 0.8 : 0.6,
          dashArray: '5, 10'
        }).addTo(map);

        pathsRef.current.set(pet.id, path);
      }
    });

    // Ajustar visualização se houver pets
    if (pets.length > 0) {
      const group = new L.FeatureGroup(Array.from(markersRef.current.values()));
      map.fitBounds(group.getBounds().pad(0.1));
    }

    // Focar no pet selecionado
    if (selectedPet) {
      map.setView([selectedPet.currentLocation.lat, selectedPet.currentLocation.lng], 16, {
        animate: true,
        duration: 1
      });
    }
  }, [pets, selectedPet, onPetSelect]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-2xl"
      style={{ minHeight: '400px', zIndex: 1 }} 
    />
  );
};