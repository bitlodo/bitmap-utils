import SVGDebugRenderer from "../components/SVGDebugRenderer";
import SVGRenderer from "../components/SVGRenderer";

export default function Home() {

    return (
        <>
            <h2 style={{ marginBottom: '0px' }}> Bitmap Playground </h2>

            Collection of utilities and some experiments with bitmap.<br/>
            Available at <a href='https://github.com/bitlodo/bitmap-utils' target='_blank'>https://github.com/bitlodo/bitmap-utils</a>

            <br /><br /><br />

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                Use the MondrianLayout.js class to generate data for creating a custom bitmap image. <br />
                The output is a list of squares with their positions and sizes. <br />

                <pre className="code">
                    import <b>MondrianLayout</b> from "./utils/MondrianLayout.js";
                    <br /><br />
                    <span className="comment">//input: your tx array with log10 values. Example: 100000.bitmap</span>
                    <br />
                    <b>const</b> txList = [5,5,4,1];
                    <br />
                    <b>const</b> mondrian = new <b>MondrianLayout</b>(txList);
                    <br /><br />
                    <span className="comment">//output: {`[{position: {x: 0, y: 0}, size: 5},{position: {x: 5, y: 0}, size: 5},...]`}</span>
                    <br />
                    console.log(mondrian.slots);
                </pre>

                <br />
                You can also choose one of the React components to display the bitmap preview image:
                <br /><br />

                <div style={{ width: '200px', border: 'solid 1px gray', padding: '15px'}}>
                    <SVGRenderer data={[5, 5, 4, 1]} />
                </div>

                <br />
                The MondrianLayout class can generate additional squares to fill empty spaces. <br/>
                This can be useful for procedural landscape generation:
                <br /><br />

                <div style={{ width: '200px', border: 'solid 1px gray', padding: '15px'}}>
                    <SVGDebugRenderer data={[5, 5, 4, 1]} />
                </div>

            </div>
        </>
    )
}