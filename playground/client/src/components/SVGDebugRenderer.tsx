import { useEffect, useRef } from "react";
// @ts-ignore 
import MondrianLayout from "../../../../utils/MondrianLayout.js";

interface SVGDebugRendererProps {
    data: number[] | null;
    fillEmpty?: boolean;
    showSizes?: boolean;
    margin?: number;
    style?: any | {};
}

function SVGDebugRenderer({ data, fillEmpty = true, showSizes = true, margin = 0, style }: SVGDebugRendererProps) {

    const heatMapPallete = ['#47029f', '#6101a4', '#7c06a5', '#9d189c', '#c13c81', '#d6556c', '#ff9438', '#fbce25', '#ffff00']

    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data || !svgRef.current) return;
        renderImage(data);
    }, [data, fillEmpty, showSizes, margin, svgRef])

    function renderImage(data: number[]) {

        if (svgRef.current === null || data == null || data.length == 0) return null;

        const mondrian = new MondrianLayout(data);
        const padd = Math.max(Math.min(margin, 1), 0); //margin between squares

        const strokeWidth = ((mondrian.width / svgRef.current.getBoundingClientRect().width) / 4).toString();

        const groupSlots = document.createElementNS("http://www.w3.org/2000/svg", "g");
        groupSlots.setAttribute("id", 'full')

        const rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rectElement.setAttribute("x", "0");
        rectElement.setAttribute("y", "0");
        rectElement.setAttribute("width", mondrian.width.toString());
        rectElement.setAttribute("height", mondrian.height.toString());
        rectElement.setAttribute("fill", "#E9E8E7");
        groupSlots.appendChild(rectElement);

        for (let i = 0; i < mondrian.slots.length; i++) {
            const slot = mondrian.slots[i];
            const size = slot.size - padd;

            const rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rectElement.setAttribute("x", slot.position.x.toString());
            rectElement.setAttribute("y", slot.position.y.toString());
            rectElement.setAttribute("width", size.toString());
            rectElement.setAttribute("height", size.toString());
            rectElement.setAttribute("fill", heatMapPallete[slot.size - 1]);
            rectElement.setAttribute("stroke", "black");
            rectElement.setAttribute("stroke-width", strokeWidth);
            groupSlots.appendChild(rectElement);

            if (showSizes) {
                const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
                const textX = slot.position.x + (size) / 2;
                const textY = slot.position.y + (size) / 2;
                textElement.setAttribute("x", textX.toString());
                textElement.setAttribute("y", textY.toString());
                textElement.setAttribute("text-anchor", "middle");
                textElement.setAttribute("alignment-baseline", "middle");
                textElement.setAttribute("font-size", (slot.size / 2).toString());
                textElement.setAttribute("fill", "white");
                textElement.setAttribute("fill-opacity", "0.4");

                const textContent = document.createTextNode(slot.size);
                textElement.appendChild(textContent);
                groupSlots.appendChild(textElement);
            }
        }

        const groupEmpty = document.createElementNS("http://www.w3.org/2000/svg", "g");
        groupEmpty.setAttribute("id", 'empty')


        if (fillEmpty) {


            const filledSlots = mondrian.fillEmptySpaces();

            for (let i = 0; i < filledSlots.length; i++) {
                const slot = filledSlots[i];
                const size = slot.size - padd;

                const rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rectElement.setAttribute("x", slot.position.x.toString());
                rectElement.setAttribute("y", slot.position.y.toString());
                rectElement.setAttribute("width", size.toString());
                rectElement.setAttribute("height", size.toString());
                rectElement.setAttribute("fill", "none");
                rectElement.setAttribute("stroke", "gray");
                rectElement.setAttribute("stroke-width", strokeWidth);
                groupEmpty.appendChild(rectElement);
            }
        }
        const childrenCopy = [...svgRef.current.children];
        for (const element of childrenCopy) {
            svgRef.current.removeChild(element);
        }

        svgRef.current?.appendChild(groupSlots);
        svgRef.current?.appendChild(groupEmpty);
        const rectBBox = groupSlots.getBBox();

        svgRef.current?.setAttribute("viewBox", `${rectBBox.x} ${rectBBox.y} ${rectBBox.width} ${rectBBox.height}`);
    }

    return <svg xmlns="http://www.w3.org/2000/svg" ref={svgRef} viewBox="0 0 100 100" style={style} />
}

export default SVGDebugRenderer;