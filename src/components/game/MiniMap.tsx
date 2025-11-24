import { Card } from '@/components/ui/card';
import { Building } from '@/data/buildings';
import { MapPin, User, Flag } from 'lucide-react';

interface MiniMapProps {
  playerPosition: [number, number, number];
  buildings: Building[];
  npcPositions: Array<[number, number, number]>;
  questMarkers?: Array<{ position: [number, number, number]; type: string }>;
  size?: number;
  zoom?: number;
}

const MiniMap = ({ 
  playerPosition, 
  buildings, 
  npcPositions,
  questMarkers = [],
  size = 200, 
  zoom = 4 
}: MiniMapProps) => {
  const worldToMap = (worldX: number, worldZ: number) => {
    const mapX = (worldX / zoom) + size / 2;
    const mapY = (worldZ / zoom) + size / 2;
    return { x: mapX, y: mapY };
  };

  const playerMap = worldToMap(playerPosition[0], playerPosition[2]);

  return (
    <Card 
      className="fixed bottom-4 right-4 z-30 p-2 bg-background/90 backdrop-blur-sm border-border/50"
      style={{ width: size, height: size }}
    >
      <div className="relative w-full h-full bg-muted/30 rounded overflow-hidden">
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Buildings */}
        {buildings.map((building) => {
          const pos = worldToMap(building.position[0], building.position[2]);
          const width = building.size[0] / zoom * 10;
          const height = building.size[2] / zoom * 10;
          
          if (pos.x < 0 || pos.x > size || pos.y < 0 || pos.y > size) return null;
          
          return (
            <div
              key={building.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: pos.x,
                top: pos.y,
                width: Math.max(width, 8),
                height: Math.max(height, 8),
              }}
            >
              <div 
                className="w-full h-full border border-primary/50 bg-primary/20 rounded-sm"
                title={building.name}
              />
            </div>
          );
        })}

        {/* NPCs */}
        {npcPositions.map((npcPos, index) => {
          const pos = worldToMap(npcPos[0], npcPos[2]);
          if (pos.x < 0 || pos.x > size || pos.y < 0 || pos.y > size) return null;
          
          return (
            <div
              key={`npc-${index}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: pos.x, top: pos.y }}
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            </div>
          );
        })}

        {/* Quest markers */}
        {questMarkers.map((marker, index) => {
          const pos = worldToMap(marker.position[0], marker.position[2]);
          if (pos.x < 0 || pos.x > size || pos.y < 0 || pos.y > size) return null;
          
          return (
            <div
              key={`quest-${index}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: pos.x, top: pos.y }}
            >
              <Flag className="w-3 h-3 text-yellow-500 animate-bounce" fill="currentColor" />
            </div>
          );
        })}

        {/* Player (always centered or at actual position) */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{ left: playerMap.x, top: playerMap.y }}
        >
          <div className="relative">
            <User className="w-4 h-4 text-green-500" fill="currentColor" />
            <div className="absolute inset-0 animate-ping">
              <User className="w-4 h-4 text-green-500/50" />
            </div>
          </div>
        </div>

        {/* Compass */}
        <div className="absolute top-1 left-1 text-[10px] font-bold text-foreground/60">
          N
        </div>
      </div>
    </Card>
  );
};

export default MiniMap;
