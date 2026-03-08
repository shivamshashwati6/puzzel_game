document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const newGameBtn = document.getElementById('new-game-btn');
    const winMessage = document.getElementById('win-message');
    
    let tiles = [];
    const size = 3; // 3x3 grid
    
    function initGame() {
        tiles = Array.from({ length: size * size }, (_, i) => i + 1);
        renderBoard();
        shuffle();
    }
    
    function renderBoard() {
        gameBoard.innerHTML = '';
        tiles.forEach((tileValue, index) => {
            const tileDiv = document.createElement('div');
            tileDiv.classList.add('tile');
            if (tileValue === size * size) {
                tileDiv.classList.add('empty');
                tileDiv.textContent = '';
            } else {
                tileDiv.textContent = tileValue;
                if (tileValue === index + 1) {
                    tileDiv.classList.add('correct');
                }
            }
            
            tileDiv.addEventListener('click', () => handleTileClick(index));
            gameBoard.appendChild(tileDiv);
        });
    }
    
    function handleTileClick(index) {
        const emptyIndex = tiles.indexOf(size * size);
        if (isAdjacent(index, emptyIndex)) {
            swapTiles(index, emptyIndex);
            renderBoard();
            checkWin();
        }
    }
    
    function isAdjacent(idx1, idx2) {
        const row1 = Math.floor(idx1 / size);
        const col1 = idx1 % size;
        const row2 = Math.floor(idx2 / size);
        const col2 = idx2 % size;
        
        const rowDiff = Math.abs(row1 - row2);
        const colDiff = Math.abs(col1 - col2);
        
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }
    
    function swapTiles(idx1, idx2) {
        [tiles[idx1], tiles[idx2]] = [tiles[idx2], tiles[idx1]];
    }
    
    function shuffle() {
        // To ensure solvability, we perform a series of random valid moves
        // instead of a completely random shuffle of the array.
        let moves = 0;
        const maxMoves = 100;
        
        while (moves < maxMoves) {
            const emptyIndex = tiles.indexOf(size * size);
            const adjacents = [];
            
            // Find valid adjacent moves
            for (let i = 0; i < size * size; i++) {
                if (isAdjacent(i, emptyIndex)) {
                    adjacents.push(i);
                }
            }
            
            const randomIdx = adjacents[Math.floor(Math.random() * adjacents.length)];
            swapTiles(randomIdx, emptyIndex);
            moves++;
        }
        
        renderBoard();
        winMessage.classList.remove('visible', 'hidden');
        winMessage.classList.add('hidden');
    }
    
    function checkWin() {
        const isWin = tiles.every((val, i) => val === i + 1);
        if (isWin) {
            winMessage.classList.remove('hidden');
            setTimeout(() => {
                winMessage.classList.add('visible');
            }, 10);
            
            // Disable board clicks?
            const allTiles = document.querySelectorAll('.tile');
            allTiles.forEach(t => t.style.pointerEvents = 'none');
        }
    }
    
    newGameBtn.addEventListener('click', () => {
        initGame();
        const allTiles = document.querySelectorAll('.tile');
        allTiles.forEach(t => t.style.pointerEvents = 'auto');
    });
    
    // Initial call
    initGame();
});
