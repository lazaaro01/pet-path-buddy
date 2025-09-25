import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, MapPin, Camera } from 'lucide-react';
import { Pet, Location } from '@/types/pet';
import { useToast } from '@/hooks/use-toast';

interface AddPetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPet: (pet: Omit<Pet, 'id'>) => void;
}

export const AddPetDialog: React.FC<AddPetDialogProps> = ({
  open,
  onOpenChange,
  onAddPet,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    breed: '',
    age: '',
    description: '',
    photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=face',
  });
  
  const [homeLocation, setHomeLocation] = useState<Location>({
    lat: -23.5505,
    lng: -46.6333,
  });
  
  const [isSettingLocation, setIsSettingLocation] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.breed.trim() || !formData.age) {
      toast({
        title: 'Erro no cadastro',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    // Gerar localização inicial próxima à casa
    const currentLocation: Location = {
      lat: homeLocation.lat + (Math.random() - 0.5) * 0.002,
      lng: homeLocation.lng + (Math.random() - 0.5) * 0.002,
    };

    const newPet: Omit<Pet, 'id'> = {
      name: formData.name.trim(),
      breed: formData.breed.trim(),
      age: parseInt(formData.age),
      description: formData.description.trim(),
      photo: formData.photo,
      homeLocation,
      currentLocation,
      isActive: true,
      lastUpdate: new Date(),
      pathHistory: [],
    };

    onAddPet(newPet);
    
    // Reset form
    setFormData({
      name: '',
      breed: '',
      age: '',
      description: '',
      photo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=face',
    });
    
    setHomeLocation({ lat: -23.5505, lng: -46.6333 });
    setIsSettingLocation(false);
    onOpenChange(false);

    toast({
      title: 'Pet cadastrado com sucesso! 🎉',
      description: `${newPet.name} foi adicionado ao sistema de rastreamento.`,
    });
  };

  const handleLocationClick = () => {
    setIsSettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setHomeLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsSettingLocation(false);
          toast({
            title: 'Localização definida!',
            description: 'Localização atual definida como casa do pet.',
          });
        },
        () => {
          setIsSettingLocation(false);
          toast({
            title: 'Erro de localização',
            description: 'Usando localização padrão de São Paulo.',
            variant: 'destructive',
          });
        }
      );
    } else {
      setIsSettingLocation(false);
      toast({
        title: 'Geolocalização não suportada',
        description: 'Usando localização padrão de São Paulo.',
        variant: 'destructive',
      });
    }
  };

  const petPhotos = [
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=400&h=400&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1570018144715-43110363d70a?w=400&h=400&fit=crop&crop=face',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">
            Adicionar Novo Pet
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto do Pet */}
          <div className="space-y-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Foto do Pet
            </Label>
            
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border-2 border-dashed border-border">
                <img 
                  src={formData.photo} 
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-3">
                  Escolha uma foto para seu pet:
                </p>
                <div className="grid grid-cols-6 gap-2">
                  {petPhotos.map((photo, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setFormData({ ...formData, photo })}
                      className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        formData.photo === photo 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img 
                        src={photo} 
                        alt={`Opção ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Informações Básicas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Pet *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Rex, Mimi, Luna..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Idade (anos) *</Label>
              <Input
                id="age"
                type="number"
                min="0"
                max="30"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="breed">Raça *</Label>
            <Input
              id="breed"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              placeholder="Ex: Labrador, Siamês, SRD..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Características especiais, comportamento, etc..."
              rows={3}
            />
          </div>

          {/* Localização da Casa */}
          <div className="space-y-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Localização da Casa
            </Label>
            
            <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
              <div>
                <p className="font-medium">Coordenadas</p>
                <p className="text-sm text-muted-foreground">
                  {homeLocation.lat.toFixed(6)}, {homeLocation.lng.toFixed(6)}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleLocationClick}
                disabled={isSettingLocation}
                className="gap-2"
              >
                <MapPin className="w-4 h-4" />
                {isSettingLocation ? 'Obtendo...' : 'Usar Localização Atual'}
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="text-xs">
                Dica
              </Badge>
              <span>
                Esta será a localização de referência "casa" para o seu pet
              </span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="hero-button flex-1">
              <Upload className="w-4 h-4 mr-2" />
              Cadastrar Pet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};