import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";

import Board from "./Board.js";
import Writer from "./Writer.js";

export default class Game {
    constructor() {
        this.eyesOpen = Math.random() < 0.5;
        this.targetNumber = Math.floor(Math.random() * 8) + 1;

        this.board = new Board(this.targetNumber, this.eyesOpen);
        this.topWriter = new Writer(this.board.getTopRow());
        this.botWriter = new Writer(this.board.getBottomRow());

        this.rl = readline.createInterface({ input, output });
    }

    async start() {
        console.log("=-=-=-= New Round =-=-=-=\n");
        console.log(`Eyes: ${this.eyesOpen ? "OPEN" : "CLOSED"}\n`);

        process.stdout.write("Top Row: ");
        this.printRow(this.topWriter.getWriter1Row());

        const top = await this.rl.question("Enter top row: ");
        console.log(`POV2: ${this.topWriter.getWriter2()}\n`);

        console.log("=-=-=-=\n");

        process.stdout.write("Bottom Row: ");
        this.printRow(this.botWriter.getWriter1Row());

        const bot = await this.rl.question("Enter bot row: ");
        console.log(`POV2: ${this.botWriter.getWriter2()}\n`);

        const combined = await this.rl.question("Combine both rows: ");

        console.log(`\nEyes: ${this.eyesOpen ? "OPEN" : "CLOSED"}`);

        const target = await this.rl.question("Enter target number: ");
        const chosen = await this.rl.question("Enter position to stand: ");

        console.log("\n" + (this.safe(chosen) ? "SAFE" : "DEAD"));

        this.rl.close();
    }

    printRow(row) {
        for (const i of row) {
            process.stdout.write(this.toRoman(i) + " ");
        }

        console.log();
    }

    safe(chosen) {
        const chose = Number.parseInt(chosen, 10) - 1;

        if (chose < 6) {
            return this.board.getSafeTop()[chose];
        }

        return this.board.getSafeBot()[chose - 6];
    }

    toRoman(n) {
        switch (n) {
            case 1:
                return "I";
            case 2:
                return "II";
            case 3:
                return "III";
            case 4:
                return "IV";
            case 5:
                return "V";
            case 6:
                return "VI";
            case 7:
                return "VII";
            case 8:
                return "VIII";
            default:
                return "x";
        }
    }
}