export default function Home() {

    return (
        <>
            <h2 style={{ marginBottom: '0px' }}> Bitmap Playground </h2>

            Collection of utilities and some experiments with bitmap

            <br /><br /><br /><br /><br /><br />

            <pre>
                <code spellCheck="false" style={{ display: 'block' }}>

                    import MondrianLayout from "./utils/MondrianLayout.js";

                    //your tx array with log10 values
                    const txList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

                    const mondrian = new MondrianLayout(txList);

                    //output: {`[{position: {x: 0, y: 0}, size: 1},{position: {x: 1, y: 0}, size: 2},...]</pre>`}
                    console.log(mondrian.slots);

                </code>
            </pre>
            <pre>
                <b>WIP</b>
                <br />
                (database integration examples soon)
            </pre>
        </>
    )
}