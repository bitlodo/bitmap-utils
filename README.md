
# Bitmap-utils

A collection of code + examples that can be useful if you are developing a Bitmap Metaverse related project.

Currently, you can find some 2D and 3D examples of how to implement a runtime Bitmap image viewer.  

---

**MondrianLayout.js**

To generate pure bitmap image data, create a MondrianLayout object using your array data. The output data can be used to generate the preview image in your desired image lib or app.

    import MondrianLayout from "./utils/MondrianLayout.js";

    //input: your tx array with log10 values. Example: 100000.bitmap
    const txList = [5,5,4,1];

    //create the MondrianLayout object using your array
    const mondrian = new MondrianLayout(txList);

    //output: [{position: {x: 0, y: 0}, size: 5},{position: {x: 5, y: 0}, size: 5},...]
    console.log(mondrian.slots);

---

**Bitmap Playground** - Demo: https://playground.bitlords.land

This is a client/server example you will find in the folder playground.

**Client**

Inside `/playground/client` folder:
- `npm install` to install
- `npm run dev` to run (developer mode)
- (deploy only)  `npm run build` to generate the static files.


**Server**

Inside `/playground/server` folder:

- rename the `.env.template` file to `.env` and replace entries with you local paths
- `npm instal` to install
- `npm run start` to run

*DB files available in the release page.*