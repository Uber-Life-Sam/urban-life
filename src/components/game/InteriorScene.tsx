import { Building } from '@/data/buildings';

interface InteriorSceneProps {
  building: Building;
  onExit: () => void;
}

const InteriorScene = ({ building, onExit }: InteriorSceneProps) => {
  const getInteriorContent = () => {
    switch (building.type) {
      case 'shop':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">{building.name}</h2>
            <p className="text-muted-foreground">Browse the shop and purchase items.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg bg-card">
                <p className="font-semibold text-card-foreground">Coffee - $3</p>
              </div>
              <div className="p-4 border border-border rounded-lg bg-card">
                <p className="font-semibold text-card-foreground">Snack - $2</p>
              </div>
            </div>
          </div>
        );
      case 'office':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">{building.name}</h2>
            <p className="text-muted-foreground">Your office workspace.</p>
            <div className="p-6 border border-border rounded-lg bg-card">
              <p className="text-card-foreground">Computer desk with multiple monitors</p>
            </div>
          </div>
        );
      case 'home':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">{building.name}</h2>
            <p className="text-muted-foreground">Your cozy home.</p>
            <div className="p-6 border border-border rounded-lg bg-card">
              <p className="text-card-foreground">A comfortable living space</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4 p-6 bg-card border border-border rounded-lg shadow-lg">
        {getInteriorContent()}
        <button
          onClick={onExit}
          className="mt-6 w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Exit Building
        </button>
      </div>
    </div>
  );
};

export default InteriorScene;
