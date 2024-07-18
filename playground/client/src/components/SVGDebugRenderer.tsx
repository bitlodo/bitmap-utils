import { useEffect, useRef } from "react";
// @ts-ignore 
import MondrianLayout from "../../../../utils/MondrianLayout.js";

interface SVGDebugRendererProps {
    data: number[] | null;
    style?: any | {};
}

function SVGDebugRenderer({ data, style }: SVGDebugRendererProps) {

    const heatMapPallete = ['#47029f', '#6101a4', '#7c06a5', '#9d189c', '#c13c81', '#d6556c', '#ff9438', '#fbce25', '#ffff00']

    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!data || !svgRef.current) return;
        renderImage(data);
    }, [data, svgRef])

    function renderImage(data: number[]) {

        if (svgRef.current === null || data == null || data.length == 0) return null;

        let blockWeight = 0;

        for (const size of data) {
            blockWeight += size * size;
        }

        const blockWidth = Math.ceil(Math.sqrt(blockWeight));
        const mondrian = new MondrianLayout(blockWidth);
        const mondrianSlots: any[] = [];

        for (const size of data) {
            const slot = mondrian.place(size);
            mondrianSlots.push(slot);
        }

        const padd = 0; //margin between squares

        const strokeWidth = ((mondrian.width/svgRef.current.getBoundingClientRect().width)).toString();

        const groupSlots = document.createElementNS("http://www.w3.org/2000/svg", "g");
        groupSlots.setAttribute("id", 'full')

        for (let i = 0; i < mondrianSlots.length; i++) {
            const slot = mondrianSlots[i];
            const size = slot.size - padd;

            const rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rectElement.setAttribute("x", slot.position.x.toString());
            rectElement.setAttribute("y", slot.position.y.toString());
            rectElement.setAttribute("width", size.toString());
            rectElement.setAttribute("height", size.toString());
            rectElement.setAttribute("fill", heatMapPallete[slot.size - 1]); // Cor do texto
            rectElement.setAttribute("stroke", "black");
            rectElement.setAttribute("stroke-width", strokeWidth);

            const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
            // Define a posição do texto no centro do retângulo
            const textX = slot.position.x + (size) / 2;
            const textY = slot.position.y + (size) / 2;
            textElement.setAttribute("x", textX.toString());
            textElement.setAttribute("y", textY.toString());
            textElement.setAttribute("text-anchor", "middle"); // Alinhamento do texto no centro
            textElement.setAttribute("alignment-baseline", "middle"); // Alinhamento do texto no centro
            textElement.setAttribute("font-size", (slot.size / 2).toString());
            textElement.setAttribute("fill", "white"); // Cor do texto
            textElement.setAttribute("fill-opacity", "0.4"); // Cor do texto
            // textElement.setAttribute("fill", generateColor2(slot.r, -8)); // Cor do texto

            // Define o texto que você deseja exibir (substitua 'seuNumero' pelo número real)
            const textContent = document.createTextNode(slot.size);
            textElement.appendChild(textContent);

            // Adiciona o elemento de texto como filho do elemento de retângulo
            // groupTextElement.appendChild(textElement);
            // groupTextElement.setAttribute('opacity', showDetails ? '1' : '0')



            groupSlots.appendChild(rectElement);
            groupSlots.appendChild(textElement);
        }

        const groupEmpty = document.createElementNS("http://www.w3.org/2000/svg", "g");
        groupEmpty.setAttribute("id", 'empty')

        const filledSlots = mondrian.fillEmptySpaces();

        for (let i = 0; i < filledSlots.length; i++) {
            const slot = filledSlots[i];
            const size = slot.size - padd;

            const rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rectElement.setAttribute("x", slot.position.x.toString());
            rectElement.setAttribute("y", slot.position.y.toString());
            rectElement.setAttribute("width", size.toString());
            rectElement.setAttribute("height", size.toString());
            rectElement.setAttribute("fill", 'gray'); // Cor do texto
            rectElement.setAttribute("stroke", "black");
            rectElement.setAttribute("stroke-width", strokeWidth);
            groupEmpty.appendChild(rectElement);
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