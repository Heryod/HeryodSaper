document.addEventListener("DOMContentLoaded", () => {
    const board = [];
    const rows = 8;
    const columns = 8;
    const minesCount = 10;
    const minesLocation = new Set();
    let tilesClicked = 0;
    let gameOver = false;

    function setMines() {
        let minesLeft = minesCount;

        while (minesLeft > 0) {
            let r = Math.floor(Math.random() * rows);
            let c = Math.floor(Math.random() * columns);
            let id = `${r}-${c}`;

            if (!minesLocation.has(id)) {
                minesLocation.add(id);
                minesLeft -= 1;
            }
        }
    }

    function createTile(r, c) {
        const tile = document.createElement("div");
        tile.id = `${r}-${c}`;
        tile.addEventListener("click", clickTile);
        tile.addEventListener("contextmenu", setFlag);
        document.getElementById("board").append(tile);
        return tile;
    }

    function initializeBoard() {
        setMines();

        for (let r = 0; r < rows; r++) {
            let row = [];
            for (let c = 0; c < columns; c++) {
                row.push(createTile(r, c));
            }
            board.push(row);
        }

        console.log(board);
    }

    function setFlag(event) {
        event.preventDefault();
        let tile = event.target;

        if (gameOver || tile.classList.contains("tile-clicked")) {
            return;
        }

        tile.innerText = tile.innerText === "" ? "🚩" : "";
    }

    function clickTile(event) {
        if (gameOver || this.classList.contains("tile-clicked")) {
            return;
        }

        let tile = this;

        if (minesLocation.has(tile.id)) {
            gameOver = true;
            revealMines();
            return;
        }

        let coords = tile.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        checkMine(r, c);
    }

    function revealMines() {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                let tile = board[r][c];
                if (minesLocation.has(tile.id)) {
                    tile.innerText = "💣";
                    tile.style.backgroundColor = "red";
                }
            }
        }
    }

    function checkMine(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= columns || board[r][c].classList.contains("tile-clicked")) {
            return;
        }

        board[r][c].classList.add("tile-clicked");
        tilesClicked += 1;

        let minesFound = 0;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                minesFound += checkTile(r + i, c + j);
            }
        }

        if (minesFound > 0) {
            board[r][c].innerText = minesFound;
            board[r][c].classList.add(`x${minesFound}`);
        } else {
            board[r][c].innerText = "";

            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    checkMine(r + i, c + j);
                }
            }
        }

        if (tilesClicked === rows * columns - minesCount) {
            document.getElementById("mines-count").innerText = "Brak";
            gameOver = true;
        }
    }

    function checkTile(r, c) {
        return r >= 0 && r < rows && c >= 0 && c < columns && minesLocation.has(`${r}-${c}`) ? 1 : 0;
    }

    function startGame() {
        document.getElementById("mines-count").innerText = minesCount;
        initializeBoard();
    }

    startGame();
});
