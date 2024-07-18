import { useEffect, useState } from 'react'
import SVGDebugRenderer from '../components/SVGDebugRenderer'

export default function PageSearch() {
    const [bitmapInput, setBitmapInput] = useState('123456')
    const [txArray, setTxArray] = useState([1])
    const [bitmapData, setBitmapData] = useState({ bitmap: undefined, tx: [], size: [] })

    async function loadBitmap(bitmap: string) {
        const response = await fetch(`http://localhost:3000/api/v1/getBitmap/${bitmap}`);
        const result = await response.json();
        if (result.success) {
            setBitmapData(result.data);
            setTxArray(result.data.tx);
        } else {
            console.log(result.error);
        }
        console.log(result)
    }

    useEffect(() => {
        loadBitmap(bitmapInput)
    }, [])

    return (
        <>
            <h2 style={{ marginBottom: '0px' }}>BITMAP PREVIEW DATABASE</h2>
            <span>
                840000 pre-calculated bitmap tx array data.
            </span>
            <br />
            <br />
            <span>
                The database has 3 colums: bitmap (block height), tx (array of tx values converted to log10), size (width x height of the final preview image, using the tx value (log10) as units).
            </span>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ marginBottom: '0px' }}>Search Bitmap </h3>
                <span>(from block 0 to 839999)</span>
                <div>

                    <form onSubmit={(event) => {
                        event.preventDefault();
                        if (bitmapInput !== '' && parseInt(bitmapInput) <= 839999) {
                            loadBitmap(bitmapInput);
                        }
                    }}>
                        <input
                            value={bitmapInput}
                            style={{ width: '300px' }}
                            onChange={(event) => {
                                const value = parseInt(event.target.value.replace(/\D/g, ''));
                                setBitmapInput(isNaN(value) ? '' : value.toString());
                            }}
                        />
                        <button type="submit" disabled={bitmapInput === '' || parseInt(bitmapInput) > 839999} style={{ marginLeft: '10px', border: 'solid 1px' }}>Search</button>
                    </form>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ marginBottom: '0px' }}>
                    {bitmapData != undefined && `${bitmapData.bitmap}.bitmap`}
                </h3>
                <SVGDebugRenderer data={txArray} style={{ maxWidth: '600px', maxHeight: '600px', marginTop: '10px' }} />
                {/* <SVGRenderer color='orange' data={txArray} style={{ maxWidth: `${bitmapData.size[0]*3}px`, maxHeight: `${bitmapData.size[1]*3}px`, border: 'solid 1px', padding: '0px' }} /> */}
                <textarea readOnly style={{ width: '430px', marginTop: '20px', height: '200px', border: 'solid 0px' }} value={bitmapData != undefined ? JSON.stringify(bitmapData) : ''}></textarea>

            </div>
        </>
    )
}