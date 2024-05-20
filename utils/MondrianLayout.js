// Adapted from https://github.com/bitfeed-project/bitfeed/blob/master/client/src/models/TxMondrianPoolScene.js by @mononaut

export default class MondrianLayout {
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this.xMax = 0;
        this.yMax = 0;
        this.rowOffset = 0;
        this.rows = [];
        this.txMap = [];
    }

    getSize() {
        return {
            width: this.xMax,
            height: this.yMax
        };
    }

    getRow(position) {
        if (position.y - this.rowOffset < this.rows.length) {
            return this.rows[position.y - this.rowOffset];
        }
        return null;
    }

    getSlot(position) {
        const row = this.getRow(position);
        if (row !== null && row.map.has(position.x)) {
            return row.map.get(position.x);
        }
        return null;
    }

    addRow() {
        const newRow = {
            y: this.rows.length + this.rowOffset,
            slots: [],
            map: new Map(),
            max: 0
        };
        this.rows.push(newRow);
        return newRow;
    }

    addSlot(slot) {
        if (slot.r <= 0) {
            return null;
        }

        const existingSlot = this.getSlot(slot.position);
        if (existingSlot !== null) {
            existingSlot.r = Math.max(existingSlot.r, slot.r);
            return existingSlot;
        } else {
            const row = this.getRow(slot.position);
            if (row === null) {
                return null;
            }

            const insertAt = row.slots.findIndex(s => s.position.x > slot.position.x);
            if (insertAt === -1) {
                row.slots.push(slot);
            } else {
                row.slots.splice(insertAt, 0, slot);
            }

            row.map.set(slot.position.x, slot);

            return slot;
        }
    }

    removeSlot(slot) {
        const row = this.getRow(slot.position);
        if (row !== null) {
            row.map.delete(slot.position.x);
            const index = row.slots.findIndex(s => s.position.x === slot.position.x);
            if (index !== -1) {
                row.slots.splice(index, 1);
            }
        }
    }

    fillSlot(slot, squareWidth) {
        const square = {
            left: slot.position.x,
            right: slot.position.x + squareWidth,
            bottom: slot.position.y,
            top: slot.position.y + squareWidth
        };

        this.removeSlot(slot);

        for (let rowIndex = slot.position.y; rowIndex < square.top; rowIndex++) {
            const row = this.getRow({ x: slot.position.x, y: rowIndex });
            if (row !== null) {
                const collisions = [];
                let maxExcess = 0;
                for (const testSlot of row.slots) {
                    if (
                        !(
                            testSlot.position.x + testSlot.r < square.left ||
                            testSlot.position.x >= square.right
                        )
                    ) {
                        collisions.push(testSlot);
                        const excess = Math.max(
                            0,
                            testSlot.position.x + testSlot.r - (slot.position.x + slot.r)
                        );
                        maxExcess = Math.max(maxExcess, excess);
                    }
                }

                if (square.right < this._width && !row.map.has(square.right)) {
                    this.addSlot({
                        position: { x: square.right, y: rowIndex },
                        r: slot.r - squareWidth + maxExcess
                    });
                }

                for (let i = 0; i < collisions.length; i++) {
                    collisions[i].r = slot.position.x - collisions[i].position.x;

                    if (collisions[i].r === 0) {
                        this.removeSlot(collisions[i]);
                    }
                }
            } else {
                this.addRow();
                if (slot.position.x > 0) {
                    this.addSlot({
                        position: { x: 0, y: rowIndex },
                        r: slot.position.x
                    });
                }
                if (square.right < this._width) {
                    this.addSlot({
                        position: { x: square.right, y: rowIndex },
                        r: this._width - square.right
                    });
                }
            }
        }

        for (
            let rowIndex = Math.max(0, slot.position.y - squareWidth);
            rowIndex < slot.position.y;
            rowIndex++
        ) {
            const row = this.getRow({ x: slot.position.x, y: rowIndex });
            if (row === null || row === undefined) continue;

            for (let i = 0; i < row.slots.length; i++) {
                const testSlot = row.slots[i];

                if (
                    testSlot.position.x < slot.position.x + squareWidth &&
                    testSlot.position.x + testSlot.r > slot.position.x &&
                    testSlot.position.y + testSlot.r >= slot.position.y
                ) {
                    const oldSlotWidth = testSlot.r;
                    testSlot.r = slot.position.y - testSlot.position.y;

                    const remaining = {
                        x: testSlot.position.x + testSlot.r,
                        y: testSlot.position.y,
                        width: oldSlotWidth - testSlot.r,
                        height: testSlot.r
                    };

                    while (remaining.width > 0 && remaining.height > 0) {
                        if (remaining.width <= remaining.height) {
                            this.addSlot({
                                position: { x: remaining.x, y: remaining.y },
                                r: remaining.width
                            });
                            remaining.y += remaining.width;
                            remaining.height -= remaining.width;
                        } else {
                            this.addSlot({
                                position: { x: remaining.x, y: remaining.y },
                                r: remaining.height
                            });
                            remaining.x += remaining.height;
                            remaining.width -= remaining.height;
                        }
                    }
                }
            }
        }

        return { position: slot.position, r: squareWidth };
    }

    place(size) {
        const tx = {};

        let found = false;
        let squareSlot = null;

        for (const row of this.rows) {
            for (const slot of row.slots) {
                if (slot.r >= size) {
                    found = true;
                    squareSlot = this.fillSlot(slot, size);
                    break;
                }
            }

            if (found) {
                break;
            }
        }

        if (!found) {
            const row = this.addRow();
            const slot = this.addSlot({ position: { x: 0, y: row.y }, r: this._width });
            squareSlot = this.fillSlot(slot, size);
        }

        for (let x = 0; x < squareSlot.r; x++) {
            for (let y = 0; y < squareSlot.r; y++) {
                this.setTxMapCell(
                    { x: squareSlot.position.x + x, y: squareSlot.position.y + y },
                    tx
                );
            }
        }

        if (squareSlot.position.x + squareSlot.r > this.xMax) {
            this.xMax = squareSlot.position.x + squareSlot.r;
        }

        if (squareSlot.position.y + squareSlot.r > this.yMax) {
            this.yMax = squareSlot.position.y + squareSlot.r;
        }

        return squareSlot;
    }

    setTxMapCell(coord, tx) {
        const offsetY = coord.y - this.rowOffset;
        if (offsetY >= 0 && offsetY < this._height && coord.x >= 0 && coord.x < this._width) {
            const index = offsetY * this._width + coord.x;
            if (index >= 0 && index < this.txMap.length) {
                this.txMap[index] = tx;
            }
        }
    }
}
