import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const lotterySchema = z.object({
  startNumber: z.number().int().min(1, "Número inicial deve ser pelo menos 1"),
  endNumber: z.number().int().min(1, "Número final deve ser pelo menos 1"),
  winnersCount: z.number().int().min(1, "Deve haver pelo menos 1 ganhador"),
}).refine((data) => data.endNumber > data.startNumber, {
  message: "Número final deve ser maior que o inicial",
  path: ["endNumber"],
}).refine((data) => data.winnersCount <= (data.endNumber - data.startNumber + 1), {
  message: "Quantidade de ganhadores não pode ser maior que números disponíveis",
  path: ["winnersCount"],
});

interface LotteryFormProps {
  onDraw: (winners: number[]) => void;
}

export const LotteryForm = ({ onDraw }: LotteryFormProps) => {
  const [startNumber, setStartNumber] = useState<string>("");
  const [endNumber, setEndNumber] = useState<string>("");
  const [winnersCount, setWinnersCount] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const { toast } = useToast();

  const generateWinners = (start: number, end: number, count: number): number[] => {
    const availableNumbers = Array.from(
      { length: end - start + 1 }, 
      (_, i) => start + i
    );
    
    const winners: number[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * availableNumbers.length);
      winners.push(availableNumbers[randomIndex]);
      availableNumbers.splice(randomIndex, 1);
    }
    
    return winners.sort((a, b) => a - b);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = lotterySchema.parse({
        startNumber: parseInt(startNumber),
        endNumber: parseInt(endNumber),
        winnersCount: parseInt(winnersCount),
      });

      setIsDrawing(true);

      // Simula o tempo do sorteio para melhor UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      const winners = generateWinners(data.startNumber, data.endNumber, data.winnersCount);
      onDraw(winners);

      toast({
        title: "Sorteio realizado!",
        description: `${winners.length} número(s) sorteado(s) com sucesso.`,
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        toast({
          title: "Erro na validação",
          description: firstError.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startNumber">Número inicial</Label>
              <Input
                id="startNumber"
                type="number"
                value={startNumber}
                onChange={(e) => setStartNumber(e.target.value)}
                placeholder="Ex: 1"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endNumber">Número final</Label>
              <Input
                id="endNumber"
                type="number"
                value={endNumber}
                onChange={(e) => setEndNumber(e.target.value)}
                placeholder="Ex: 100"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="winnersCount">Quantidade de ganhadores</Label>
              <Input
                id="winnersCount"
                type="number"
                value={winnersCount}
                onChange={(e) => setWinnersCount(e.target.value)}
                placeholder="Ex: 3"
                min="1"
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isDrawing}
            variant={isDrawing ? "secondary" : "default"}
          >
            {isDrawing ? "Sorteando..." : "Realizar Sorteio"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};