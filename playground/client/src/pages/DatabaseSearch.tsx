import { useEffect, useState } from 'react'
import SVGDebugRenderer from '../components/SVGDebugRenderer'

export default function DatabaseSearch() {
    const [txArray, setTxArray] = useState([1])
    const [debugFillEmpty, setDebugFillEmpty] = useState(false)
    const [debugShowSizes, setDebugShowSizes] = useState(true)
    const [debugMargin, setDebugMargin] = useState(0)
    const [bitmapInput, setBitmapInput] = useState('50886')
    const [bitmapData, setBitmapData] = useState({ bitmap: undefined, tx: [], size: [] })

    async function loadBitmap(bitmap: string) {
        const response = await fetch(`/api/v1/getBitmap/${bitmap}`);
        const result = await response.json();
        if (result.success) {
            setBitmapData(result.data);
            setTxArray(result.data.tx);
        } else {
            console.log(result.error);
        }
    }

    useEffect(() => {
        loadBitmap(bitmapInput)
    }, [])

    return (
        <>
            <h2 style={{ marginBottom: '0px' }}>BITMAP PREVIEW DATABASE</h2>
            <span>
                840000 pre-calculated bitmaps (tx data) for use in the bitmap preview image (Mondrian Layout) generation<br />
            </span>

            <br />

            <b>Files available here</b>: <a href='https://github.com/bitlodo/bitmap-utils/releases' target='_blank'>https://github.com/bitlodo/bitmap-utils/releases</a>


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
                        <button type="submit" disabled={bitmapInput === '' || parseInt(bitmapInput) > 839999} style={{ marginLeft: '10px' }}>Search</button>
                    </form>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3 style={{ marginBottom: '20px' }}>
                    {bitmapData != undefined && `${bitmapData.bitmap}.bitmap`}
                </h3>

                <table cellPadding={0} cellSpacing={8} border={0} style={{ lineHeight: '1px', fontSize: '0.8em', color: '#a0a0a0' }}>
                    <tbody>
                        <tr>
                            <td style={{ border: 'none' }}>{bitmapData.bitmap && bitmapData.size[0]}</td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td style={{ border: '1px solid #a0a0a0', borderBottom: '0px #a0a0a0', height: '8px' }} />
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td><SVGDebugRenderer data={txArray} showSizes={debugShowSizes} fillEmpty={debugFillEmpty} margin={debugMargin} style={{ width: '500px', margin: '0px', outline: 'dashed 0px gray', outlineOffset: '-1px' }} /></td>
                            <td style={{ border: '1px solid #a0a0a0', borderLeft: '0px #a0a0a0', width: '8px' }} />
                            <td style={{ border: 'none' }}>{bitmapData.bitmap && bitmapData.size[1]}</td>
                        </tr>
                        <tr>
                            <td style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} >

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '2em', color: '#a0a0a0' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <label htmlFor="input-margin">Margin</label>
                                        <input id="input-margin" type="range" min="0" max="100" step="20" value={debugMargin * 200} onChange={(e) => setDebugMargin(parseInt(e.target.value) / 200)} style={{ padding: '0px' }} />
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            id="input-fill-empty"
                                            type="checkbox"
                                            checked={debugFillEmpty}
                                            onChange={(e) => setDebugFillEmpty(e.target.checked)}
                                        />
                                        <label htmlFor="input-fill-empty">Fill empty spaces</label>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input
                                            id="input-show-sizes"
                                            type="checkbox"
                                            checked={debugShowSizes}
                                            onChange={(e) => setDebugShowSizes(e.target.checked)}
                                        />
                                        <label htmlFor="input-show-sizes">Show sizes</label>
                                    </div>
                                </div>

                                <textarea readOnly style={{ width: 'auto', height: '200px', resize: 'vertical', border: 'solid 1px gray', marginTop: '15px', color: 'gray' }} value={bitmapData != undefined ? JSON.stringify(bitmapData) : ''}></textarea>

                            </td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>

            </div>

            <br />
            <span>
                <b>DATABASE SCHEMA</b><br/>
                <pre>bitmap INTEGER PRIMARY KEY, tx INTEGER[], size INTEGER[], pattern INTEGER</pre>
                
                <br/><br/>

                <b>bitmap</b><br/>
                Block height of the bitmap.
                <br/><br/>

                <b>tx</b><br/>
                TX value array in log10.<br/>
                Useful for generating preview images.
                <br/><br/>

                <b>size</b><br/>
                Pre-calculated preview image size (width x height).<br/>
                Useful for allocating the bitmap in a 2D map.
                <br/><br/>

                <b>pattern</b><br/>
                Block height of the first occurrence of this pattern.<br/>
                Useful for grouping images by shape (aka bitmons)
                <br/><br/>
                {/* CSV format ........... 344 MB (2,78 GB uncompressed)
                DuckDB format ... 370 MB */}
            </span>
        </>
    )
}