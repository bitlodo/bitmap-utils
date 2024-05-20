import { useState } from 'react'
import CanvasRenderer from '../components/CanvasRenderer'
import DIVRenderer from '../components/DIVRenderer'
import SVGRenderer from '../components/SVGRenderer'

export default function Page2DGeneration() {
    const [txInput, setTxInput] = useState('5,5,6,4')
    const [txArray, setTxArray] = useState([5, 5, 6, 4])

    return (
        <>
            <h2 style={{ marginBottom: '0px' }}>2D PREVIEW GENERATION</h2>
            <span>
                Simple implementation of <a href='https://bitfeed.live/' target='_blank'>Bitfeed's</a> visualization mode for transactions.
            </span>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems:'center', marginBottom: '10px' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ marginBottom: '0px' }}>DIV Renderer</h3>
                <DIVRenderer color='orange' data={txArray} style={{ width: '250px', height: '250px', maxWidth: '250px', maxHeight: '250px', border: 'solid 1px', padding: '20px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ marginBottom: '0px' }}>Canvas Renderer</h3>
                <CanvasRenderer color='orange' data={txArray} style={{ width: '250px', height: '250px', maxWidth: '250px', maxHeight: '250px', border: 'solid 1px', padding: '20px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ marginBottom: '0px' }}>SVG Renderer</h3>
                <SVGRenderer color='orange' data={txArray} style={{ width: '250px', height: '250px', maxWidth: '250px', maxHeight: '250px', border: 'solid 1px', padding: '20px' }} />
            </div>
        </>
    )
}