window.addEventListener('DOMContentLoaded', () => {
    // Select all game tiles (elements with the class "title")
    const tiles = Array.from(document.querySelectorAll('.tile'));
    // Select the element that displays the current player's turn
    const playerDisplay = document.querySelector('.display-player');
    // Select the reset button element
    const resetButton = document.querySelector('#reset');
    // Select the announcer element for showing win/draw messages
    const announcer = document.querySelector('.announcer');

    // Initialize the game board and variables
    let board = ['','','','','','','','',''];
    let currentPlayer = 'X';
    let isGameActive = true;

    // Constants for game results
    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const DRAW = 'DRAW';

    /*
      Board indexes:
            [0] [1] [2]
            [3] [4] [5]
            [6] [7] [8]
    */
    const winningConditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6]
    ];

    // Function to validate the game result after each move
    function handleResultValidation() {
        let roundWon = false;
        // Loop over every possible winning condition
        for (let i = 0; i < winningConditions.length; i++) {
            const winCondition = winningConditions[i];
            const a = board[winCondition[0]];
            const b = board[winCondition[1]];
            const c = board[winCondition[2]];

            // If any of the cells is empty, skip this condition
            if (a === '' || b === '' || c === '') {
                continue;
            }
            // Check if all three cells in the winning condition have the same value
            if (a === b && b === c) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            // Announce the winner and set the game as inactive
            announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
            isGameActive = false;
            return;
        }

        // If no empty cells remain, it's a draw
        if (!board.includes('')) {
            announce(DRAW);
            isGameActive = false;
        }
    }

    // Function to announce the game result
    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = 'Player<span class="playerO">O</span> Won!';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player<span class="playerX">X</span> Won!';
                break;
            case DRAW:
                announcer.innerHTML = 'Tie';
                break;
        }
        // Remove the "hide" class so that the announcer becomes visible
        announcer.classList.remove('hide');
    };

    // Function to check if the selected tile is valid (i.e., not already occupied)
    const isValidAction = (tile) => {
        if (tile.innerText === 'X' || tile.innerText === 'O') {
            return false;
        }
        return true;
    };

    // Function to update the board array with the current player's move
    const updateBoard = (index) => {
        board[index] = currentPlayer;
    };

    // Function to change the active player and update the display accordingly
    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    };

    // Function to handle a player's action when clicking on a tile
    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
            }
        }


    // Function to reset the game board to its initial state
    const resetBoard = () => {
        board = ['','','','','','','','',''];
        isGameActive = true;
        // Hide the announcer message again
        announcer.classList.add('hide');

        // Ensure player X always starts first
        if (currentPlayer === 'O') {
            changePlayer();
        }

        // Clear all tiles and remove player-specific classes
        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX');
            tile.classList.remove('playerO');
        });
    };

    // Attach click event listeners to each tile
    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    // Attach click event listener to the reset button
    resetButton.addEventListener('click', resetBoard);
});

