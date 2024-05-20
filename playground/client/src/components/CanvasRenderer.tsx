import { useEffect, useRef } from "react";
// @ts-ignore 
import MondrianLayout from "../../../../utils/MondrianLayout.js";

interface CanvasRendererProps {
    data: number[] | null;
    style?: any | {};
    color?: string | undefined;
}

function CanvasRenderer({ data, style, color = 'orange' }: CanvasRendererProps) {

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!data || !canvasRef.current) return;
        renderImage(data);
    }, [data, canvasRef])

    function renderImage(data: number[]) {

        if (canvasRef.current === null || data == null || data.length == 0) return null;

        let blockWeight = 0;

        for (const size of data) {
            blockWeight += size * size;
        }

        const blockWidth = Math.ceil(Math.sqrt(blockWeight));
        const mondrian = new MondrianLayout(blockWidth, blockWidth);
        const mondrianSlots: any[] = [];

        for (const size of data) {
            const slot = mondrian.place(size);
            mondrianSlots.push(slot);
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.log("No context")
            return;
        }

        const clientRect = canvas.getBoundingClientRect();
        const padd = 0.5; //margin between squares
        const mondrianSize = mondrian.getSize();
        
        const scaleX = clientRect.width / (mondrianSize.width - padd);
        const scaleY = clientRect.height / (mondrianSize.height - padd);
        const scale = Math.min(scaleX, scaleY);

        const offsetX = (clientRect.width - (mondrianSize.width - padd) * scale) / 2;
        const offsetY = (clientRect.height - (mondrianSize.height - padd) * scale) / 2;

        canvas.width = clientRect.width;
        canvas.height = clientRect.height;

        for (let i = 0; i < mondrianSlots.length; i++) {
            const slot = mondrianSlots[i];
            const x = slot.position.x * scale;
            const y = slot.position.y * scale;
            const size = (slot.r - padd) * scale;
            ctx.fillStyle = color;
            ctx.fillRect(offsetX + x, offsetY + y, size, size);
        }

    }

    return <canvas ref={canvasRef} style={{ ...style }} />
}

export default CanvasRenderer;
