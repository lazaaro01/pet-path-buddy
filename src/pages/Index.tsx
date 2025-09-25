import { useState, useEffect } from 'react';
import { Plus, MapPin, Bell, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PetMap } from '@/components/PetMap';
import { PetCard } from '@/components/PetCard';
import { AddPetDialog } from '@/components/AddPetDialog';
import { usePets } from '@/hooks/usePets';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const { pets, addPet, updatePetLocation } = usePets();
  const { toast } = useToast();

  useEffect(() => {
    // Simulação de movimento dos pets
    const interval = setInterval(() => {
      pets.forEach(pet => {
        if (pet.isActive) {
          const newLat = pet.currentLocation.lat + (Math.random() - 0.5) * 0.001;
          const newLng = pet.currentLocation.lng + (Math.random() - 0.5) * 0.001;
          
          updatePetLocation(pet.id, { lat: newLat, lng: newLng });
          
          // Verificar se está longe de casa (simulação)
          const distanceFromHome = Math.sqrt(
            Math.pow(newLat - pet.homeLocation.lat, 2) + 
            Math.pow(newLng - pet.homeLocation.lng, 2)
          );
          
          if (distanceFromHome > 0.005 && Math.random() > 0.7) {
            toast({
              title: `🚨 ${pet.name} está longe de casa!`,
              description: `Seu pet foi detectado a uma distância considerável do local seguro.`,
              variant: "destructive",
            });
          }
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [pets, updatePetLocation, toast]);

  const activePets = pets.filter(pet => pet.isActive);
  const selectedPet = selectedPetId ? pets.find(p => p.id === selectedPetId) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold gradient-text">PetTracker</h1>
              <p className="text-muted-foreground mt-1">
                Monitoramento em tempo real dos seus pets
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="gap-2">
                <Activity className="w-4 h-4" />
                {activePets.length} pets ativos
              </Badge>
              <Button
                onClick={() => setIsAddPetOpen(true)}
                className="hero-button gap-2"
              >
                <Plus className="w-4 h-4" />
                Adicionar Pet
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pet Cards */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Seus Pets</h2>
            </div>
            
            <div className="space-y-4">
              {pets.length === 0 ? (
                <div className="pet-card text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Nenhum pet cadastrado</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece adicionando seu primeiro pet para começar o rastreamento
                  </p>
                  <Button
                    onClick={() => setIsAddPetOpen(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Pet
                  </Button>
                </div>
              ) : (
                pets.map(pet => (
                  <PetCard
                    key={pet.id}
                    pet={pet}
                    isSelected={selectedPetId === pet.id}
                    onClick={() => setSelectedPetId(pet.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Bell className="w-5 h-5 text-secondary" />
              <h2 className="text-xl font-semibold">Mapa de Rastreamento</h2>
              {selectedPet && (
                <Badge variant="secondary">
                  Focado em {selectedPet.name}
                </Badge>
              )}
            </div>
            
            <div className="map-container h-96 lg:h-[600px]">
              <PetMap
                pets={pets}
                selectedPet={selectedPet}
                onPetSelect={setSelectedPetId}
              />
            </div>
          </div>
        </div>
      </div>

      <AddPetDialog
        open={isAddPetOpen}
        onOpenChange={setIsAddPetOpen}
        onAddPet={addPet}
      />
    </div>
  );
};

export default Index;