import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw } from "lucide-react";

interface WinnersDisplayProps {
  winners: number[];
  onReset: () => void;
}

export const WinnersDisplay = ({ winners, onReset }: WinnersDisplayProps) => {
  const [animatedWinners, setAnimatedWinners] = useState<number[]>([]);

  useEffect(() => {
    setAnimatedWinners([]);
    
    winners.forEach((winner, index) => {
      setTimeout(() => {
        setAnimatedWinners(prev => [...prev, winner]);
      }, index * 300);
    });
  }, [winners]);

  if (winners.length === 0) return null;

  return (
    <Card className="w-full max-w-md mt-6">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-success">
          <Trophy className="w-5 h-5" />
          Números Sorteados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {winners.map((winner, index) => (
            <div
              key={winner}
              className={`
                bg-gradient-to-br from-success to-success/80 
                text-success-foreground 
                rounded-lg p-4 text-center font-bold text-xl
                transform transition-all duration-500 ease-out
                ${animatedWinners.includes(winner) 
                  ? 'scale-100 opacity-100 translate-y-0' 
                  : 'scale-75 opacity-0 translate-y-4'
                }
              `}
              style={{
                boxShadow: 'var(--shadow-success)',
                transitionDelay: `${index * 300}ms`
              }}
            >
              {winner}
            </div>
          ))}
        </div>
        
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="w-full"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Novo Sorteio
        </Button>
      </CardContent>
    </Card>
  );
};