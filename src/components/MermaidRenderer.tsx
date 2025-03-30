
import { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface MermaidRendererProps {
  chart: string;
  className?: string;
}

const MermaidRenderer = ({ chart, className = "" }: MermaidRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: "default",
        securityLevel: "loose",
        flowchart: { 
          useMaxWidth: true,
          htmlLabels: true,
          curve: "basis",
        },
        themeVariables: {
          primaryColor: "#a855f7",
          primaryTextColor: "#ffffff",
          primaryBorderColor: "#c084fc",
          lineColor: "#a855f7",
          secondaryColor: "#f0abfc",
          tertiaryColor: "#f5f5f5"
        }
      });
      
      try {
        // Clear previous renderings
        containerRef.current.innerHTML = "";
        
        // Generate a unique ID for this diagram
        const diagramId = `mermaid-diagram-${Date.now()}`;
        
        console.log("Rendering Mermaid chart:", chart.substring(0, 50) + "...");
        
        // Preprocess the chart to ensure it's valid
        const processedChart = chart
          .replace(/\n\s+\(/g, '[') // Replace node labels with linebreaks and parentheses
          .replace(/\)\n/g, ']\n')   // Close those brackets properly
          .replace(/\n\s+/g, '\n');  // Remove extra whitespace at line beginnings
        
        mermaid.render(diagramId, processedChart).then(({ svg }) => {
          if (containerRef.current) {
            containerRef.current.innerHTML = svg;
            
            // Make SVG responsive
            const svgElement = containerRef.current.querySelector("svg");
            if (svgElement) {
              svgElement.setAttribute("width", "100%");
              svgElement.setAttribute("height", "auto");
              svgElement.style.maxWidth = "100%";
            }
          }
        }).catch(error => {
          console.error("Mermaid rendering error inside promise:", error);
          if (containerRef.current) {
            containerRef.current.innerHTML = `<div class="p-4 text-red-500 border border-red-300 rounded">Failed to render flowchart: ${error.message}</div>`;
          }
        });
      } catch (error) {
        console.error("Mermaid rendering error in try/catch:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="p-4 text-red-500 border border-red-300 rounded">Failed to render flowchart: Invalid syntax</div>`;
        }
      }
    }
  }, [chart]);

  return (
    <div ref={containerRef} className={`overflow-auto rounded-lg ${className}`}>
      {/* Mermaid diagram will be rendered here */}
    </div>
  );
};

export default MermaidRenderer;
