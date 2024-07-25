import { useEffect, useRef } from "react";
// @ts-ignore 
import MondrianLayout from "../../../../utils/MondrianLayout.js";

interface SVGRendererProps {
    data: number[] | null;
    style?: any | {};
    color?: string | undefined;
}

function SVGRenderer({ data, style, color = 'orange' }: SVGRendererProps) {

    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data || !svgRef.current) return;
        renderImage(data);
    }, [data, svgRef])

    function renderImage(data: number[]) {

        if (svgRef.current === null || data == null || data.length == 0) return null;

        const mondrian = new MondrianLayout(data);
        const padd = 0.5; //margin between squares

        let pathData = "";

        for (let i = 0; i < mondrian.slots.length; i++) {
            const slot = mondrian.slots[i];
            const scaleValue = slot.size - padd;

            const x = slot.position.x;
            const y = slot.position.y;
            const size = scaleValue;
            
            const moveTo = `M${x} ${y}`;
            const horizontalLine = `H${x + size}`;
            const verticalLine = `V${y + size}`;
            const reverseHorizontalLine = `H${x}`;
            const closePath = "Z";

            pathData += `${moveTo} ${horizontalLine} ${verticalLine} ${reverseHorizontalLine} ${closePath}`;
        }

        const childrenCopy = [...svgRef.current.children];
        for (const element of childrenCopy) {
            svgRef.current.removeChild(element);
        }

        const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", pathData);
        pathElement.setAttribute("fill", color);

        svgRef.current?.appendChild(pathElement);

        const rectBBox = pathElement.getBBox();
        svgRef.current?.setAttribute(
            "viewBox",
            `${rectBBox.x} ${rectBBox.y} ${rectBBox.width} ${rectBBox.height}`
        );

    }

    return <svg xmlns="http://www.w3.org/2000/svg" ref={svgRef} viewBox="0 0 100 100" style={style} />
}

export default SVGRenderer;
