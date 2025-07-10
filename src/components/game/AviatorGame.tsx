
import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Card, CardContent } from '@/components/ui/card';

const AviatorGame: React.FC = () => {
  const { currentMultiplier, isGameRunning } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });
  const planeImage = useRef<HTMLImageElement | null>(null);
  const cloudImages = useRef<HTMLImageElement[]>([]);
  const [clouds, setClouds] = useState<{ x: number; y: number; speed: number; image: number }[]>([]);

  // Initialize images
  useEffect(() => {
    // Load plane image
    const plane = new Image();
    plane.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIj48cGF0aCBmaWxsPSJyZWQiIGQ9Ik0xMDUuNiAyNTEuNWMtMjEuOSAyMS45LTIxLjkgNTcuMyAwIDc5LjJsMjEuOSAyMS45YzIxLjkgMjEuOSA1Ny4zIDIxLjkgNzkuMiAwbDIxLjktMjEuOSAyOTIuMy0yOTIuM2M3LjMtNy4zIDcuMy0xOS4xIDAtMjYuNGwtMjEuOS0yMS45Yy03LjMtNy4zLTE5LjEtNy4zLTI2LjQgMEwxODAgMjgyLjdsMjEuOS0yMS45YzIxLjktMjEuOSAyMS45LTU3LjMgMC03OS4yTDE4MCAyNTkuNmwtNzQuNS03NC41LTIxLjkgMjEuOSAyMS45IDIxLjkgMjEuOS0yMS45IDUyLjYgNTIuNi01Mi42IDUyLjYtMjEuOS0yMS45eiIvPjwvc3ZnPg==';
    planeImage.current = plane;

    // Load cloud images
    const cloud1 = new Image();
    cloud1.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTUxMiAyNTZjMCA1My0yOC43IDk5LjQtNzEuNSAxMjQuOEMzOTkuOCA0NjcuMiAzMjMuOCA1MTIgMjQwIDUxMkMxMDcuNSA1MTIgMCA0MDQuNiAwIDI3MkMwIDE3MS4zIDY0LjggODUuMyAxNTUuNiA1OS45QzE3MS4xIDI0LjIgMjA3LjkgMCAyNTIgMGM0OS4xIDAgOTIuNyAyNS4xIDExNy44IDYzLjNDMzg0LjUgNzIuOCA0MDAuOCA4MyA0MTkuOCA5NC41QzQ3NC4yIDEwOC41IDUxMiAxNzcuNiA1MTIgMjU2eiIvPjwvc3ZnPg==';
    const cloud2 = new Image();
    cloud2.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48cGF0aCBmaWxsPSJ3aGl0ZSIgZD0iTTI4OCAzMkMyMjEuNSAzMiAxNjYuNCA3NS45IDE1Mi44IDEzNi43QzE1MiAxMzYuNyAxNTEuMSAxMzYuNyAxNTAuMiAxMzYuN0M4NC43IDEzNi43IDMyIDE4OS40IDMyIDI1NC45QzMyIDMyMC40IDg0LjcgMzczLjEgMTUwLjIgMzczLjFIMzk1LjhDNDYxLjMgMzczLjEgNTE0IDMyMC40IDUxNCAyNTQuOUM1MTQgMTg5LjQgNDYxLjMgMTM2LjcgMzk1LjggMTM2LjdDMzk0LjkgMTM2LjcgMzk0IDEzNi43IDM5My4yIDEzNi43QzM3OS42IDc1LjkgMzI0LjUgMzIgMjg4IDMyeiIvPjwvc3ZnPg==';
    cloudImages.current = [cloud1, cloud2];

    // Generate initial clouds
    const initialClouds = Array.from({ length: 5 }, () => ({
      x: Math.random() * canvasSize.width,
      y: Math.random() * canvasSize.height * 0.7,
      speed: 0.5 + Math.random() * 1.5,
      image: Math.floor(Math.random() * 2),
    }));
    setClouds(initialClouds);

    // Handle resize
    const handleResize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        setCanvasSize({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Draw the game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F7FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    if (cloudImages.current.length > 0) {
      clouds.forEach(cloud => {
        const img = cloudImages.current[cloud.image];
        if (img.complete) {
          ctx.globalAlpha = 0.7;
          ctx.drawImage(
            img,
            cloud.x,
            cloud.y,
            80,
            50
          );
          ctx.globalAlpha = 1;
        }
      });
    }

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Draw grass
    ctx.fillStyle = '#228B22';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 10);

    // Draw runway
    ctx.fillStyle = '#555555';
    ctx.fillRect(50, canvas.height - 45, canvas.width - 100, 20);
    
    // Draw runway markings
    ctx.fillStyle = '#FFFFFF';
    for (let i = 60; i < canvas.width - 60; i += 30) {
      ctx.fillRect(i, canvas.height - 35, 15, 5);
    }

    // Draw multiplier
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = isGameRunning ? '#FF0000' : '#333333';
    ctx.textAlign = 'center';
    ctx.fillText(
      isGameRunning ? `${currentMultiplier.toFixed(2)}x` : 'WAITING...',
      canvas.width / 2,
      100
    );

    // Draw plane if game is running
    if (isGameRunning && planeImage.current && planeImage.current.complete) {
      // Calculate plane position based on multiplier
      const maxHeight = canvas.height - 100;
      const height = Math.min(maxHeight, maxHeight * (1 - Math.log10(currentMultiplier) / 3));
      const x = 100 + (currentMultiplier - 1) * 50;
      
      // Save context for rotation
      ctx.save();
      
      // Translate to the plane position
      ctx.translate(x, height);
      
      // Rotate slightly upward
      const angle = -Math.min(Math.PI / 6, Math.log10(currentMultiplier) / 5);
      ctx.rotate(angle);
      
      // Draw the plane
      ctx.drawImage(planeImage.current, -25, -25, 50, 50);
      
      // Restore context
      ctx.restore();
      
      // Draw trail
      ctx.strokeStyle = '#FF6347';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, canvas.height - 35);
      
      // Create a curve for the trail
      const controlX = 75;
      const controlY = canvas.height - 50 - (currentMultiplier - 1) * 20;
      ctx.quadraticCurveTo(controlX, controlY, x, height);
      
      ctx.stroke();
    }

  }, [canvasSize, currentMultiplier, isGameRunning, clouds]);

  // Move clouds
  useEffect(() => {
    if (!isGameRunning) return;

    const interval = setInterval(() => {
      setClouds(prevClouds => 
        prevClouds.map(cloud => ({
          ...cloud,
          x: cloud.x - cloud.speed,
          // If cloud moves off screen, reset to right side
          ...(cloud.x < -100 ? {
            x: canvasSize.width + 50,
            y: Math.random() * canvasSize.height * 0.7,
            speed: 0.5 + Math.random() * 1.5,
          } : {})
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isGameRunning, canvasSize.width, canvasSize.height]);

  return (
    <Card className="w-full h-[500px] overflow-hidden">
      <CardContent className="p-0 h-full">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />
      </CardContent>
    </Card>
  );
};

export default AviatorGame;