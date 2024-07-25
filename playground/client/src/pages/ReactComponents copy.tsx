import { useRef, useState } from 'react'
import CanvasRenderer from '../components/CanvasRenderer'
import DIVRenderer from '../components/DIVRenderer'
import SVGRenderer from '../components/SVGRenderer'
import ThreeJSRenderer from '../components/ThreeJSRenderer'

export default function ReactComponents() {
    const [txInput, setTxInput] = useState('5,5,6,4')
    const [txArray, setTxArray] = useState([5, 5, 6, 4])
    const [txHover, setTxHover] = useState(-1)
    const [txSelected, setTxSelected] = useState(-1)
    const threeJSRendererRef = useRef<any>();
    return (
        <>
            <h2 style={{ marginBottom: '0px' }}>REACT COMPONENTS</h2>
            <span>
                Three.js implementation of <a href='https://bitfeed.live/' target='_blank'>Bitfeed's</a> visualization mode for transactions.
            </span>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ marginBottom: '0px' }}>Parcel sizes array (1 to 9)</h3>
                <span>(Separated by comma)</span>
                <div>
                    <input value={txInput} style={{ width: '300px' }} onChange={(event) => {
                        const v = event.target.value.replace(/[^1-9,]/g, '');
                        setTxInput(v);
                        const newTxArray = v.split(',').map(value => parseInt(value[0])).filter(value => !isNaN(value));
                        setTxArray(newTxArray);
                    }}></input>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', justifyContent:'center' }}>

                <div style={{width: '220px'}}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ marginBottom: '0px' }}>DIV Renderer</h3>
                        <DIVRenderer color='orange' data={txArray} style={{ width: '200px', height: '200px', maxWidth: '200px', maxHeight: '200px', border: 'solid 1px', padding: '20px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ marginBottom: '0px' }}>Canvas Renderer</h3>
                        <CanvasRenderer color='orange' data={txArray} style={{ width: '200px', height: '200px', maxWidth: '200px', maxHeight: '200px', border: 'solid 1px', padding: '20px' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ marginBottom: '0px' }}>SVG Renderer</h3>
                        <SVGRenderer color='orange' data={txArray} style={{ width: '200px', height: '200px', maxWidth: '200px', maxHeight: '200px', border: 'solid 1px', padding: '20px' }} />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '800px' }}>
                    <h3 style={{ marginBottom: '0px' }}>ThreeJS Renderer</h3>

                    <ThreeJSRenderer data={txArray} onTxHover={setTxHover} onTxSelect={setTxSelected} style={{ width: '700px', height: '700px', border: 'solid 1px black' }} ref={threeJSRendererRef} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '500px' }}>
                        <span>Hover: {txHover >= 0 ? txHover : 'none'}</span>
                        <span>Selected: {txSelected >= 0 ? txSelected : 'none'}</span>
                    </div>

                    <br />

                    <button onClick={() => threeJSRendererRef?.current.resetCamera()}>Reset camera</button>
                </div>

            </div>

        </>
    )
}