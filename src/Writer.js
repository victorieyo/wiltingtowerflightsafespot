export default class Writer {
    constructor(row) {
        this.writer1 = "";
        this.writer2 = "";
        this.writer1Row = new Array(6);
        this.writer2Row = new Array(6);

        this.hideNumbers(row);
    }

    hideNumbers(row) {
        let pattern;

        do {
            pattern = [];

            for (let i = 0; i < 6; i++) {
                pattern.push(Math.random() < 0.5);
            }
        } while (
            pattern.every(value => value === true) ||
            pattern.every(value => value === false)
            );

        let a = "";
        let b = "";

        for (let i = 0; i < 6; i++) {
            const shown = pattern[i];

            this.writer1Row[i] = shown ? row[i] : 0;
            this.writer2Row[i] = shown ? 0 : row[i];

            a += shown ? row[i] : "x";
            b += shown ? "x" : row[i];

            if (i === 2) {
                a += " ";
                b += " ";
            }
        }

        this.writer1 = a;
        this.writer2 = b;
    }

    getWriter1Row() {
        return this.writer1Row;
    }

    getWriter2Row() {
        return this.writer2Row;
    }

    getWriter1() {
        return this.writer1;
    }

    getWriter2() {
        return this.writer2;
    }
}