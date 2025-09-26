import { useState } from "react";
import { LotteryForm } from "@/components/LotteryForm";
import { WinnersDisplay } from "@/components/WinnersDisplay";

const Index = () => {
  const [winners, setWinners] = useState<number[]>([]);

  const handleDraw = (newWinners: number[]) => {
    setWinners(newWinners);
  };

  const handleReset = () => {
    setWinners([]);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="flex flex-col items-center justify-center max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Sorteio de Números
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Defina o intervalo de números e a quantidade de ganhadores para realizar seu sorteio
          </p>
        </div>

        <div className="flex flex-col items-center w-full">
          <LotteryForm onDraw={handleDraw} />
          <WinnersDisplay winners={winners} onReset={handleReset} />
        </div>
      </div>
    </div>
  );
};

export default Index;
