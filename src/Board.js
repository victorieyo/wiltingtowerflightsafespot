export default class Board {
    constructor(targetNumber, open) {
        this.topRow = new Array(6);
        this.bottomRow = new Array(6);
        this.safeTop = new Array(6);
        this.safeBot = new Array(6);

        this.generateBoard(targetNumber, open);
    }

    generateBoard(targetNumber, open) {
        do {
            const numbers = this.generateNumbers(targetNumber);
            shuffle(numbers);

            for (let i = 0; i < numbers.length; i++) {
                if (i < 6) {
                    this.topRow[i] = numbers[i];
                } else {
                    this.bottomRow[i - 6] = numbers[i];
                }
            }
        } while (!this.isValid(targetNumber));

        for (let i = 0; i < 6; i++) {
            this.safeTop[i] = this.topRow[i] === targetNumber ? open : !open;
            this.safeBot[i] = this.bottomRow[i] === targetNumber ? open : !open;
        }
    }

    generateNumbers(targetNumber) {
        const numbers = [];

        for (let i = 0; i < 6; i++) {
            numbers.push(targetNumber);
        }

        while (numbers.length < 12) {
            const n = Math.floor(Math.random() * 8) + 1;

            if (n !== targetNumber) {
                numbers.push(n);
            }
        }

        return numbers;
    }

    isValid(targetNumber) {
        const freq = new Array(9).fill(0);

        for (const n of this.topRow) {
            freq[n]++;
        }

        for (const n of this.bottomRow) {
            freq[n]++;
        }

        let six = 0;

        for (let n = 1; n <= 8; n++) {
            if (freq[n] > 6) {
                return false;
            }

            if (freq[n] === 6) {
                six++;

                if (n !== targetNumber) {
                    return false;
                }
            }
        }

        return six === 1 && freq[targetNumber] === 6;
    }

    getTopRow() {
        return this.topRow;
    }

    getBottomRow() {
        return this.bottomRow;
    }

    getSafeTop() {
        return this.safeTop;
    }

    getSafeBot() {
        return this.safeBot;
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}