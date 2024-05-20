export default function Topology() {

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ marginBottom: '0px' }}> TOPOLOGY </h2>

            <p>
            A more detailed version of this page can be found at <a href='https://bitlords.land/bitmon/anatomy' target='_blank'>https://bitlords.land/bitmon/anatomy</a>
            <br/>
            The original bitfeed code can be found at <a href="https://github.com/bitfeed-project/bitfeed" target="_blank" >https://github.com/bitfeed-project/bitfeed</a>
            </p>

            <br/>
            
            <p>The Bitfeed format uses a mathematical equation using decimal logarithm to reduce the disparity between the transaction values and create a more harmonious visualization:</p>

            <table cellPadding={10} style={{ width: '500px', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #DDD', fontWeight: 'bold' }}>
                        <td>Transaction value</td>
                        <td>Square size</td>
                    </tr>
                </thead>
                <tbody>
                    <tr style={{ borderBottom: '1px solid #DDD' }}>
                        <td>0 ~ 0.01 BTC</td>
                        <td>1x1 units</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #DDD' }}>
                        <td>0.01 ~ 0.1 BTC</td>
                        <td>2x2 units</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #DDD' }}>
                        <td>0.1 ~ 1 BTC</td>
                        <td>3x3 units</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #DDD' }}>
                        <td>1 ~ 10 BTC</td>
                        <td>4x4 units</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #DDD' }}>
                        <td>10 ~ 100 BTC</td>
                        <td>5x5 units</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #DDD' }}>
                        <td>100 ~ 1K BTC</td>
                        <td>6x6 units</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #DDD' }}>
                        <td>1K ~ 10K BTC</td>
                        <td>7x7 units</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #DDD' }}>
                        <td>10K ~ 100K BTC</td>
                        <td>8x8 units</td>
                    </tr>
                    <tr>
                        <td>100K ~ 1M BTC</td>
                        <td>9x9 units</td>
                    </tr>
                </tbody>
            </table>

            <p>The largest transaction is 550,000 BTC, and the square representing that transaction is 9x9 units in size.<br />
                Since it is highly unlikely nowadays to have a transaction above 1 million BTC, 9x9 squares will be probably the largest ones.<br />
                Transactions with a value of 0 are represented in a 1x1 square.</p>

            <br />

            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'top' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((value) => (
                    <div key={value} style={{ height: `${value * 18}px`, width: `${value * 18}px`, fontSize: '0.8em', border: 'solid 1px #DDD', marginLeft: '5px', backgroundColor: '#FAFAFA' }}>{value}</div>
                ))}
            </div>

            <br />

            <h1 style={{ fontWeight: '600', fontSize: '24px', marginTop: '20px' }}>Square distribution</h1>
            <p>The generation of shapes is done by checking the size of the squares and verifying collisions between them, in the order of the block's transaction list. <br />
                The squares need to have precise integer dimensions for the calculation to occur correctly.<br />
                After everything is calculated, the squares are reduced to generate a margin, which is the spacing between the squares we see in the display.<br />
                The most affected blocks in terms of margin reduction are the 1x1 blocks, as they can lose up to 50% of their size if a margin of 0.5 is used.<br />
                Therefore, the final display we are used to is not the actual display of the square sizes, as for that, the squares would have to be literally touching each other, like a puzzle.</p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span><b>Full size squares:</b></span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 22" style={{ display: 'flex', height: 'auto', width: '400px', margin: '8px' }}>
                    <g id="blocksFull" opacity="1"><rect x="0" y="0" width="5" height="5" fill="#CCCCCC" stroke="#AAAAAA" stroke-width="0.02"></rect><path d="M4.5 0 l 0 4.5 L 0 4.5" fill="none" stroke="#AAAAAA" stroke-opacity="0.8" stroke-dasharray="0.1,0.3" stroke-width="0.12"></path><rect x="5" y="0" width="6" height="6" fill="#CCCCCC" stroke="#AAAAAA" stroke-width="0.02"></rect><path d="M10.5 0 l 0 5.5 L 5 5.5" fill="none" stroke="#AAAAAA" stroke-opacity="0.8" stroke-dasharray="0.1,0.3" stroke-width="0.12"></path><rect x="11" y="0" width="4" height="4" fill="#CCCCCC" stroke="#AAAAAA" stroke-width="0.02"></rect><path d="M14.5 0 l 0 3.5 L 11 3.5" fill="none" stroke="#AAAAAA" stroke-opacity="0.8" stroke-dasharray="0.1,0.3" stroke-width="0.12"></path><rect x="11" y="4" width="6" height="6" fill="#CCCCCC" stroke="#AAAAAA" stroke-width="0.02"></rect><path d="M16.5 4 l 0 5.5 L 11 9.5" fill="none" stroke="#AAAAAA" stroke-opacity="0.8" stroke-dasharray="0.1,0.3" stroke-width="0.12"></path><rect x="0" y="5" width="4" height="4" fill="#CCCCCC" stroke="#AAAAAA" stroke-width="0.02"></rect><path d="M3.5 5 l 0 3.5 L 0 8.5" fill="none" stroke="#AAAAAA" stroke-opacity="0.8" stroke-dasharray="0.1,0.3" stroke-width="0.12"></path><rect x="4" y="6" width="6" height="6" fill="#CCCCCC" stroke="#AAAAAA" stroke-width="0.02"></rect><path d="M9.5 6 l 0 5.5 L 4 11.5" fill="none" stroke="#AAAAAA" stroke-opacity="0.8" stroke-dasharray="0.1,0.3" stroke-width="0.12"></path><rect x="0" y="9" width="4" height="4" fill="#CCCCCC" stroke="#AAAAAA" stroke-width="0.02"></rect><path d="M3.5 9 l 0 3.5 L 0 12.5" fill="none" stroke="#AAAAAA" stroke-opacity="0.8" stroke-dasharray="0.1,0.3" stroke-width="0.12"></path><rect x="10" y="10" width="6" height="6" fill="#CCCCCC" stroke="#AAAAAA" stroke-width="0.02"></rect><path d="M15.5 10 l 0 5.5 L 10 15.5" fill="none" stroke="#AAAAAA" stroke-opacity="0.8" stroke-dasharray="0.1,0.3" stroke-width="0.12"></path><rect x="4" y="12" width="4" height="4" fill="#CCCCCC" stroke="#AAAAAA" stroke-width="0.02"></rect><path d="M7.5 12 l 0 3.5 L 4 15.5" fill="none" stroke="#AAAAAA" stroke-opacity="0.8" stroke-dasharray="0.1,0.3" stroke-width="0.12"></path><rect x="0" y="16" width="6" height="6" fill="#CCCCCC" stroke="#AAAAAA" stroke-width="0.02"></rect><path d="M5.5 16 l 0 5.5 L 0 21.5" fill="none" stroke="#AAAAAA" stroke-opacity="0.8" stroke-dasharray="0.1,0.3" stroke-width="0.12"></path><rect x="6" y="16" width="4" height="4" fill="#CCCCCC" stroke="#AAAAAA" stroke-width="0.02"></rect><path d="M9.5 16 l 0 3.5 L 6 19.5" fill="none" stroke="#AAAAAA" stroke-opacity="0.8" stroke-dasharray="0.1,0.3" stroke-width="0.12"></path><rect x="10" y="16" width="6" height="6" fill="#CCCCCC" stroke="#AAAAAA" stroke-width="0.02"></rect><path d="M15.5 16 l 0 5.5 L 10 21.5" fill="none" stroke="#AAAAAA" stroke-opacity="0.8" stroke-dasharray="0.1,0.3" stroke-width="0.12"></path></g><g id="text" opacity="1"><text x="2.5" y="2.5" text-anchor="middle" alignment-baseline="middle" font-size="2.5" fill="white" fill-opacity="0.4">5</text><text x="8" y="3" text-anchor="middle" alignment-baseline="middle" font-size="3" fill="white" fill-opacity="0.4">6</text><text x="13" y="2" text-anchor="middle" alignment-baseline="middle" font-size="2" fill="white" fill-opacity="0.4">4</text><text x="14" y="7" text-anchor="middle" alignment-baseline="middle" font-size="3" fill="white" fill-opacity="0.4">6</text><text x="2" y="7" text-anchor="middle" alignment-baseline="middle" font-size="2" fill="white" fill-opacity="0.4">4</text><text x="7" y="9" text-anchor="middle" alignment-baseline="middle" font-size="3" fill="white" fill-opacity="0.4">6</text><text x="2" y="11" text-anchor="middle" alignment-baseline="middle" font-size="2" fill="white" fill-opacity="0.4">4</text><text x="13" y="13" text-anchor="middle" alignment-baseline="middle" font-size="3" fill="white" fill-opacity="0.4">6</text><text x="6" y="14" text-anchor="middle" alignment-baseline="middle" font-size="2" fill="white" fill-opacity="0.4">4</text><text x="3" y="19" text-anchor="middle" alignment-baseline="middle" font-size="3" fill="white" fill-opacity="0.4">6</text><text x="8" y="18" text-anchor="middle" alignment-baseline="middle" font-size="2" fill="white" fill-opacity="0.4">4</text><text x="13" y="19" text-anchor="middle" alignment-baseline="middle" font-size="3" fill="white" fill-opacity="0.4">6</text></g>
                </svg>
                <br />
                <br />
                <span><b>Reduced squares:</b></span>
                <p>The spaces between squares, are calculated with a margin factor.<br />
                    This margin separates the squares to make the display clearer.</p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 22" style={{ display: 'flex', height: 'auto', width: '400px', margin: '8px' }}>
                    <g id="blocks"><rect x="0" y="0" width="4.5" height="4.5" fill="#CCCCCC"></rect><rect x="5" y="0" width="5.5" height="5.5" fill="#CCCCCC"></rect><rect x="11" y="0" width="3.5" height="3.5" fill="#CCCCCC"></rect><rect x="11" y="4" width="5.5" height="5.5" fill="#CCCCCC"></rect><rect x="0" y="5" width="3.5" height="3.5" fill="#CCCCCC"></rect><rect x="4" y="6" width="5.5" height="5.5" fill="#CCCCCC"></rect><rect x="0" y="9" width="3.5" height="3.5" fill="#CCCCCC"></rect><rect x="10" y="10" width="5.5" height="5.5" fill="#CCCCCC"></rect><rect x="4" y="12" width="3.5" height="3.5" fill="#CCCCCC"></rect><rect x="0" y="16" width="5.5" height="5.5" fill="#CCCCCC"></rect><rect x="6" y="16" width="3.5" height="3.5" fill="#CCCCCC"></rect><rect x="10" y="16" width="5.5" height="5.5" fill="#CCCCCC"></rect></g>
                </svg>
            </div>



        </div >
    )
}