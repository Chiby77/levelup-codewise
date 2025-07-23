import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Canvas as FabricCanvas, Rect, Circle, Path, Text } from 'fabric';
import { Square, Circle as CircleIcon, Triangle, Type, Eraser, Download, Undo, Redo } from 'lucide-react';
import { toast } from 'sonner';

interface FlowchartDrawerProps {
  value?: any;
  onChange: (data: any) => void;
}

export const FlowchartDrawer: React.FC<FlowchartDrawerProps> = ({ value, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'rectangle' | 'circle' | 'diamond' | 'text' | 'draw'>('select');
  const [canvasData, setCanvasData] = useState<any>(value || null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: Math.min(800, window.innerWidth - 100),
      height: Math.min(600, window.innerHeight - 300),
      backgroundColor: '#ffffff',
    });

    // Configure drawing brush
    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = '#000000';

    setFabricCanvas(canvas);

    // Load existing data if available
    if (value && typeof value === 'object' && value.objects) {
      canvas.loadFromJSON(value, () => {
        canvas.renderAll();
      });
    }

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === 'draw';
    
    if (activeTool === 'draw') {
      fabricCanvas.freeDrawingBrush.width = 2;
      fabricCanvas.freeDrawingBrush.color = '#000000';
    }
  }, [activeTool, fabricCanvas]);

  const saveCanvasData = () => {
    if (!fabricCanvas) return;
    
    const canvasJSON = fabricCanvas.toJSON();
    setCanvasData(canvasJSON);
    onChange(canvasJSON);
  };

  const addShape = (shapeType: 'rectangle' | 'circle' | 'diamond' | 'text') => {
    if (!fabricCanvas) return;

    let shape;
    const centerX = fabricCanvas.width! / 2;
    const centerY = fabricCanvas.height! / 2;

    switch (shapeType) {
      case 'rectangle':
        shape = new Rect({
          left: centerX - 75,
          top: centerY - 40,
          fill: 'transparent',
          stroke: '#000000',
          strokeWidth: 2,
          width: 150,
          height: 80,
        });
        break;
      
      case 'circle':
        shape = new Circle({
          left: centerX - 50,
          top: centerY - 50,
          fill: 'transparent',
          stroke: '#000000',
          strokeWidth: 2,
          radius: 50,
        });
        break;
      
      case 'diamond':
        const points = [
          { x: centerX, y: centerY - 50 },
          { x: centerX + 60, y: centerY },
          { x: centerX, y: centerY + 50 },
          { x: centerX - 60, y: centerY },
        ];
        const pathString = `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y} L ${points[3].x} ${points[3].y} Z`;
        shape = new Path(pathString, {
          fill: 'transparent',
          stroke: '#000000',
          strokeWidth: 2,
        });
        break;
      
      case 'text':
        shape = new Text('Text', {
          left: centerX - 25,
          top: centerY - 10,
          fontFamily: 'Arial',
          fontSize: 16,
          fill: '#000000',
        });
        break;
    }

    if (shape) {
      fabricCanvas.add(shape);
      fabricCanvas.setActiveObject(shape);
      fabricCanvas.renderAll();
      saveCanvasData();
      toast.success(`${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)} added`);
    }
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = '#ffffff';
    fabricCanvas.renderAll();
    saveCanvasData();
    toast.success('Canvas cleared');
  };

  const deleteSelected = () => {
    if (!fabricCanvas) return;
    const activeObjects = fabricCanvas.getActiveObjects();
    if (activeObjects.length > 0) {
      fabricCanvas.remove(...activeObjects);
      fabricCanvas.discardActiveObject();
      fabricCanvas.renderAll();
      saveCanvasData();
      toast.success('Objects deleted');
    }
  };

  const exportCanvas = () => {
    if (!fabricCanvas) return;
    const dataURL = fabricCanvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });
    
    const link = document.createElement('a');
    link.download = 'flowchart.png';
    link.href = dataURL;
    link.click();
    toast.success('Flowchart exported');
  };

  // Save canvas data when objects are modified
  useEffect(() => {
    if (!fabricCanvas) return;

    const handleObjectModified = () => {
      setTimeout(saveCanvasData, 100); // Debounce saves
    };

    fabricCanvas.on('object:modified', handleObjectModified);
    fabricCanvas.on('object:added', handleObjectModified);
    fabricCanvas.on('object:removed', handleObjectModified);
    fabricCanvas.on('path:created', handleObjectModified);

    return () => {
      fabricCanvas.off('object:modified', handleObjectModified);
      fabricCanvas.off('object:added', handleObjectModified);
      fabricCanvas.off('object:removed', handleObjectModified);
      fabricCanvas.off('path:created', handleObjectModified);
    };
  }, [fabricCanvas]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium">Flowchart Drawing Tool</h4>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportCanvas}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearCanvas}>
              <Eraser className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={activeTool === 'select' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTool('select')}
          >
            Select
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveTool('rectangle');
              addShape('rectangle');
            }}
          >
            <Square className="h-4 w-4 mr-2" />
            Process
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveTool('circle');
              addShape('circle');
            }}
          >
            <CircleIcon className="h-4 w-4 mr-2" />
            Start/End
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveTool('diamond');
              addShape('diamond');
            }}
          >
            <Triangle className="h-4 w-4 mr-2" />
            Decision
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setActiveTool('text');
              addShape('text');
            }}
          >
            <Type className="h-4 w-4 mr-2" />
            Text
          </Button>
          
          <Button
            variant={activeTool === 'draw' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTool('draw')}
          >
            Draw Arrows
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={deleteSelected}
          >
            <Eraser className="h-4 w-4 mr-2" />
            Delete
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (fabricCanvas) {
                fabricCanvas.getObjects().forEach(obj => {
                  obj.set({
                    fill: 'lightblue',
                    stroke: 'navy',
                    strokeWidth: 2
                  });
                });
                fabricCanvas.renderAll();
                saveCanvasData();
                toast.success('Styling applied');
              }
            }}
          >
            Style
          </Button>
        </div>

        {/* Canvas */}
        <div className="border border-gray-200 rounded-lg overflow-auto bg-white">
          <canvas ref={canvasRef} className="max-w-full h-auto" />
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Instructions:</strong> Use the tools above to create your flowchart. 
            Click shapes to add them, use "Draw" for freehand drawing. 
            Select objects to move, resize, or delete them. Double-click text to edit.
          </p>
        </div>
      </Card>
    </div>
  );
};