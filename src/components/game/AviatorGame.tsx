
import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';

const AviatorGame: React.FC = () => {
  const { gameState, history } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the game animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sky background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#1a237e');
    gradient.addColorStop(1, '#3949ab');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height / 2);
      const radius = 20 + Math.random() * 30;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw runway
    ctx.fillStyle = '#424242';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);
    
    // Draw runway markings
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.fillRect(i, canvas.height - 30, 20, 5);
    }

    // Draw airplane if game is flying or crashed
    if (gameState.status === 'flying' || gameState.status === 'crashed') {
      // Calculate position based on multiplier
      const maxHeight = canvas.height - 100;
      const progress = Math.min(1, Math.log10(gameState.currentMultiplier) / 3);
      const x = 100 + (canvas.width - 200) * progress;
      const y = canvas.height - 70 - maxHeight * progress;

      // Draw airplane
      ctx.save();
      ctx.translate(x, y);
      
      // Rotate airplane based on progress
      const angle = Math.PI / 6 * progress;
      ctx.rotate(-angle);
      
      // Draw airplane body
      ctx.fillStyle = gameState.status === 'crashed' ? '#f44336' : '#2196f3';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(30, 0);
      ctx.lineTo(40, 5);
      ctx.lineTo(30, 10);
      ctx.lineTo(0, 10);
      ctx.closePath();
      ctx.fill();
      
      // Draw wings
      ctx.fillStyle = gameState.status === 'crashed' ? '#d32f2f' : '#1976d2';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(5, -15);
      ctx.lineTo(25, -15);
      ctx.closePath();
      ctx.fill();
      
      // Draw tail
      ctx.beginPath();
      ctx.moveTo(0, 5);
      ctx.lineTo(-10, -5);
      ctx.lineTo(-10, 15);
      ctx.lineTo(0, 5);
      ctx.closePath();
      ctx.fill();
      
      ctx.restore();

      // Draw trail
      ctx.strokeStyle = gameState.status === 'crashed' ? '#ffccbc' : '#bbdefb';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(100, canvas.height - 70);
      
      // Create a curved path for the trail
      const controlX = 100 + (x - 100) * 0.5;
      const controlY = canvas.height - 70 - (canvas.height - 70 - y) * 0.2;
      ctx.quadraticCurveTo(controlX, controlY, x, y);
      ctx.stroke();
    }

    // Draw "CRASHED" text if game has crashed
    if (gameState.status === 'crashed') {
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = '#f44336';
      ctx.textAlign = 'center';
      ctx.fillText('CRASHED', canvas.width / 2, canvas.height / 2);
    }

  }, [gameState]);

  return (
    <div className="relative w-full h-[400px] bg-gray-900 rounded-lg overflow-hidden">
      {/* Game canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full"
      />
      
      {/* Multiplier display */}
      <div className="absolute top-4 left-0 right-0 flex justify-center">
        <div 
          className={`text-4xl font-bold ${
            gameState.status === 'crashed' ? 'text-red-500' : 'text-green-400'
          } transition-transform duration-500 ${
            gameState.status === 'flying' ? 'animate-pulse' : ''
          }`}
        >
          {gameState.currentMultiplier.toFixed(2)}x
        </div>
      </div>
      
      {/* Countdown display */}
      {gameState.status === 'waiting' && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div 
            className="text-6xl font-bold text-white animate-pulse"
          >
            {gameState.countdown}
          </div>
          <div className="text-center text-white mt-2">Next round starting...</div>
        </div>
      )}
      
      {/* History display */}
      <div className="absolute bottom-4 right-4 bg-gray-800 bg-opacity-70 p-2 rounded">
        <div className="text-xs text-white mb-1">Recent Results:</div>
        <div className="flex space-x-2">
          {history.map((result, index) => (
            <div 
              key={index}
              className={`w-10 h-6 rounded flex items-center justify-center text-xs font-bold ${
                result < 2 ? 'bg-red-500' : 'bg-green-500'
              }`}
            >
              {result.toFixed(2)}x
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AviatorGame;