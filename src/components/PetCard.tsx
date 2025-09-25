import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, Activity } from 'lucide-react';
import { Pet } from '@/types/pet';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PetCardProps {
  pet: Pet;
  isSelected: boolean;
  onClick: () => void;
}

export const PetCard: React.FC<PetCardProps> = ({ pet, isSelected, onClick }) => {
  const distanceFromHome = Math.sqrt(
    Math.pow(pet.currentLocation.lat - pet.homeLocation.lat, 2) + 
    Math.pow(pet.currentLocation.lng - pet.homeLocation.lng, 2)
  ) * 111000; // Conversão aproximada para metros

  const getStatusColor = () => {
    if (!pet.isActive) return 'bg-muted text-muted-foreground';
    if (distanceFromHome > 500) return 'bg-destructive text-destructive-foreground';
    if (distanceFromHome > 200) return 'bg-warning text-warning-foreground';
    return 'bg-success text-success-foreground';
  };

  const getStatusText = () => {
    if (!pet.isActive) return 'Inativo';
    if (distanceFromHome > 500) return 'Muito longe';
    if (distanceFromHome > 200) return 'Longe de casa';
    return 'Próximo de casa';
  };

  return (
    <Card 
      className={`pet-card cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-primary shadow-xl scale-[1.02]' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex gap-4">
        {/* Avatar do Pet */}
        <div className="relative">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted">
            <img 
              src={pet.photo} 
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>
          {pet.isActive && (
            <div className="absolute -bottom-1 -right-1">
              <div className="w-5 h-5 bg-success rounded-full border-2 border-card animate-pulse-soft" />
            </div>
          )}
        </div>

        {/* Informações do Pet */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg leading-tight">{pet.name}</h3>
              <p className="text-sm text-muted-foreground">
                {pet.breed} • {pet.age} anos
              </p>
            </div>
            <Badge className={`${getStatusColor()} text-xs`}>
              {getStatusText()}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">
                {Math.round(distanceFromHome)}m de casa
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-muted-foreground">
                {formatDistanceToNow(pet.lastUpdate, { 
                  addSuffix: true,
                  locale: ptBR 
                })}
              </span>
            </div>

            {pet.isActive && (
              <div className="flex items-center gap-2 text-sm">
                <Activity className="w-4 h-4 text-accent animate-pulse" />
                <span className="text-accent font-medium">Rastreamento ativo</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Barra de Proximidade */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground">Proximidade de casa</span>
          <span className={`font-medium ${distanceFromHome < 200 ? 'text-success' : distanceFromHome < 500 ? 'text-warning' : 'text-destructive'}`}>
            {distanceFromHome < 100 ? 'Muito perto' : distanceFromHome < 200 ? 'Perto' : distanceFromHome < 500 ? 'Longe' : 'Muito longe'}
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              distanceFromHome < 200 ? 'bg-success' : 
              distanceFromHome < 500 ? 'bg-warning' : 'bg-destructive'
            }`}
            style={{ 
              width: `${Math.max(10, Math.min(100, 100 - (distanceFromHome / 10)))}%` 
            }}
          />
        </div>
      </div>
    </Card>
  );
};