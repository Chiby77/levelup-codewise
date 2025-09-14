
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type BackgroundType = "binary" | "circuit" | "neural" | "code" | "particle";

const AnimatedHeroBackground = () => {
  const [activeBackground, setActiveBackground] = useState<BackgroundType>("binary");
  const [transitioning, setTransitioning] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isMobile = useIsMobile();

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Cycle through background types
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const backgrounds: BackgroundType[] = ["binary", "circuit", "neural", "code", "particle"];
    let currentIndex = 0;
    
    const cycleBackground = () => {
      setTransitioning(true);
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % backgrounds.length;
        setActiveBackground(backgrounds[currentIndex]);
        setTransitioning(false);
      }, 800); // Faster transition
    };
    
    const intervalId = setInterval(cycleBackground, 3000); // Faster cycling every 3 seconds
    return () => clearInterval(intervalId);
  }, [prefersReducedMotion]);

  // Binary rain animation
  useEffect(() => {
    if (!canvasRef.current || prefersReducedMotion) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    
    // Animation variables
    let animationFrameId: number;
    
    // Binary rain animation
    const drawBinaryRain = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#F97316";
      ctx.font = isMobile ? "10px monospace" : "14px monospace";
      
      const symbols = "01";
      const columns = Math.floor(canvas.width / 20);
      
      for (let i = 0; i < columns; i++) {
        const x = i * 20;
        const y = Math.random() * canvas.height;
        ctx.fillText(symbols.charAt(Math.floor(Math.random() * symbols.length)), x, y);
      }
    };
    
    // Circuit pattern animation
    const drawCircuit = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.strokeStyle = "#F97316";
      ctx.lineWidth = 1;
      
      // Draw horizontal and vertical lines
      const gridSize = isMobile ? 40 : 80;
      const time = Date.now() / 1000;
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        
        // Animated node points
        for (let x = 0; x < canvas.width; x += gridSize) {
          const brightness = Math.sin(time + x/100 + y/100) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(249, 115, 22, ${brightness})`;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };
    
    // Neural network animation
    const drawNeural = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const nodes: {x: number, y: number}[] = [];
      const nodeCount = isMobile ? 30 : 60;
      
      // Create random nodes
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height
        });
      }
      
      // Draw connections between nearby nodes
      ctx.strokeStyle = "rgba(249, 115, 22, 0.2)";
      ctx.lineWidth = 1;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) { // Only connect nearby nodes
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Draw nodes
      for (const node of nodes) {
        ctx.fillStyle = "#F97316";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    
    // Code blocks animation
    const drawCodeBlocks = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() / 1000;
      const blockSize = isMobile ? 30 : 50;
      const columns = Math.ceil(canvas.width / blockSize);
      const rows = Math.ceil(canvas.height / blockSize);
      
      for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
          const posX = x * blockSize;
          const posY = y * blockSize;
          
          // Animate opacity based on position and time
          const opacity = Math.sin(time + x/5 + y/5) * 0.5 + 0.5;
          ctx.fillStyle = `rgba(249, 115, 22, ${opacity * 0.3})`;
          
          if (Math.random() > 0.8) {
            ctx.fillRect(posX, posY, blockSize - 2, blockSize - 2);
          }
        }
      }
      
      // Add some text-like lines
      ctx.fillStyle = "rgba(249, 115, 22, 0.8)";
      for (let i = 0; i < 20; i++) {
        const y = Math.random() * canvas.height;
        const width = Math.random() * 100 + 50;
        ctx.fillRect(Math.random() * canvas.width, y, width, 2);
      }
    };
    
    // Particle grid animation
    const drawParticleGrid = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const time = Date.now() / 1000;
      const gridSize = isMobile ? 30 : 50;
      
      // Add a touch of Zimbabwean pride with green and yellow particles
      const colors = ["#F97316", "#F97316", "#F97316", "#ca9501", "#148808"];
      
      for (let x = 0; x < canvas.width; x += gridSize) {
        for (let y = 0; y < canvas.height; y += gridSize) {
          const distFromCenter = Math.sin(
            Math.sqrt(
              Math.pow((x - canvas.width / 2) / 100, 2) + 
              Math.pow((y - canvas.height / 2) / 100, 2)
            ) + time
          );
          
          const size = (distFromCenter + 1) * 3;
          const colorIndex = Math.floor(Math.random() * colors.length);
          
          ctx.fillStyle = colors[colorIndex];
          ctx.beginPath();
          ctx.arc(
            x + Math.sin(time + y / 50) * 10, 
            y + Math.cos(time + x / 50) * 10, 
            size, 
            0, 
            Math.PI * 2
          );
          ctx.fill();
        }
      }
    };
    
    // Main animation loop
    const render = () => {
      switch (activeBackground) {
        case "binary":
          drawBinaryRain();
          break;
        case "circuit":
          drawCircuit();
          break;
        case "neural":
          drawNeural();
          break;
        case "code":
          drawCodeBlocks();
          break;
        case "particle":
          drawParticleGrid();
          break;
        default:
          drawBinaryRain();
      }
      
      animationFrameId = window.requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [activeBackground, prefersReducedMotion, isMobile]);
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className={`absolute inset-0 transition-opacity duration-1000 ${transitioning ? 'opacity-0' : 'opacity-100'}`}
        style={{ backgroundColor: "#1A1F2C" }} 
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary/20 opacity-95 z-10" style={{ background: 'var(--gradient-hero)', opacity: 0.9 }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 z-20" />
    </div>
  );
};

export default AnimatedHeroBackground;
