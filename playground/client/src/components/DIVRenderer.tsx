import { useEffect, useRef } from "react";
// @ts-ignore
import MondrianLayout from "../../../../utils/MondrianLayout.js";

interface DivRendererProps {
    data: number[] | null;
    style?: React.CSSProperties;
    color?: string;
    className?: string;
}

function DivRenderer({ data, style, color = 'orange' }: DivRendererProps) {
    const parentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!data || !parentRef.current) return;
        renderImage(data);
    }, [data, parentRef])

    function renderImage(data: number[]) {
        if (!parentRef.current || !data || data.length === 0) return;

        const mondrian = new MondrianLayout(data);
        const padd = 0.5; //margin between squares
        const mondrianSize = mondrian.getSize();

        const scaleX = parentRef.current.clientWidth / (mondrianSize.width - padd);
        const scaleY = parentRef.current.clientHeight / (mondrianSize.height - padd);
        const scale = Math.min(scaleX, scaleY);

        const offsetX = (parentRef.current.clientWidth - (mondrianSize.width - padd) * scale) / 2;
        const offsetY = (parentRef.current.clientHeight - (mondrianSize.height - padd) * scale) / 2;

        parentRef.current.innerHTML = '';

        for (let i = 0; i < mondrian.slots.length; i++) {
            const slot = mondrian.slots[i];
            const x = slot.position.x * scale;
            const y = slot.position.y * scale;
            const size = (slot.size - padd) * scale;

            const childDiv = document.createElement('div');

            childDiv.style.position = 'absolute'; // Set children divs' position to absolute
            childDiv.style.cursor = 'pointer'; // Set children divs' position to absolute
            childDiv.style.left = `${offsetX+x}px`;
            childDiv.style.top = `${offsetY+y}px`;
            childDiv.style.width = `${size}px`;
            childDiv.style.height = `${size}px`;
            childDiv.style.backgroundColor = color;

            childDiv.onmouseover = () => { childDiv.style.backgroundColor = 'red';  childDiv.textContent = `${i}`; }
            childDiv.onmouseout = () => { childDiv.style.backgroundColor = color; childDiv.textContent = ``;}
            childDiv.onclick = () => { console.log(`Clicked on parcel ${i}`)}
            
            parentRef.current.appendChild(childDiv);
        }

    }

    return <div style={{ ...style }}><div ref={parentRef} style={{ width: '100%', height: '100%', position: 'relative' }} ></div></div>;
}

export default DivRenderer;
