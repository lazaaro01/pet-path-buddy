import { useState, useCallback } from 'react';
import { Pet, Location } from '@/types/pet';

export const usePets = () => {
  const [pets, setPets] = useState<Pet[]>([]);

  const addPet = useCallback((petData: Omit<Pet, 'id'>) => {
    const newPet: Pet = {
      ...petData,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    setPets(prevPets => [...prevPets, newPet]);
  }, []);

  const updatePetLocation = useCallback((petId: string, newLocation: Location) => {
    setPets(prevPets => 
      prevPets.map(pet => {
        if (pet.id === petId) {
          return {
            ...pet,
            pathHistory: [...pet.pathHistory.slice(-10), pet.currentLocation], // Manter apenas últimas 10 posições
            currentLocation: newLocation,
            lastUpdate: new Date(),
          };
        }
        return pet;
      })
    );
  }, []);

  const togglePetActive = useCallback((petId: string) => {
    setPets(prevPets =>
      prevPets.map(pet =>
        pet.id === petId ? { ...pet, isActive: !pet.isActive } : pet
      )
    );
  }, []);

  const updatePet = useCallback((petId: string, updates: Partial<Pet>) => {
    setPets(prevPets =>
      prevPets.map(pet =>
        pet.id === petId ? { ...pet, ...updates, lastUpdate: new Date() } : pet
      )
    );
  }, []);

  const deletePet = useCallback((petId: string) => {
    setPets(prevPets => prevPets.filter(pet => pet.id !== petId));
  }, []);

  return {
    pets,
    addPet,
    updatePetLocation,
    togglePetActive,
    updatePet,
    deletePet,
  };
};