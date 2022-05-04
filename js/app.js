const app = {
    boardElement: null,
    nbGridRows: 4,
    nbRowCells: 6,
    // Compteur de nombre de déplacement
    nbMove: 0,
    // La partie est-elle finie ?
    gameOver: false,
    // Une variable pour gérer le joueur ( position ET orientation )
    player: {
        x: 0,
        y: 0,
        direction: 'right',
    },

    // Une variable pour gérer la case ciblée
    targetCell: {
        x: 5,
        y: 3,
    },

    drawBoard: () => {

        // Construisons la grille
        // Commençons par les lignes
        for(let rowIndex = 0; rowIndex < app.nbGridRows; rowIndex++){
            // On créé la ligne
            const rowElement = document.createElement('div');
            // Et on lui applique la classe row
            rowElement.className = 'row';
            // On lui rajoute des cells à cette row
            for(let cellIndex = 0; cellIndex < app.nbRowCells; cellIndex++){
                // On créé la cell
                const cellElement = document.createElement('div');
                // On lui applique la classe cell
                cellElement.className = 'cell';

                //* Si la case actuelle est la case targetCell
                // Pour savoir si c'est la bonne case on va comparer ses coordonnées
                // On va donc comparer le X de targetCell et cellIndex
                // Et comparer le Y de targetCell et rowIndex
                if (rowIndex === app.targetCell.y && cellIndex === app.targetCell.x){
                    // alors, on lui applique la classe targetCell
                    cellElement.classList.add('targetCell');
                }

                //* Si la case actuelle correspond à la case où se trouve le joueur
                if (rowIndex === app.player.y && cellIndex === app.player.x){
                    // Alors on créé un élément player
                    const playerElement = document.createElement('div');
                    // On lui ajoute la classe player
                    playerElement.className = `player player--${app.player.direction}`;
                    // Et on l'ajoute dans la cellule
                    cellElement.appendChild(playerElement);
                }

                // Et on l'ajoute à la row
                rowElement.appendChild(cellElement);
            }

            // Une fois l'élément créé on l'ajoute à la board
            app.boardElement.appendChild(rowElement);
        }
        // Et on vérifie si le jeu est terminé
        app.isGameOver();
    },

    /**
     * Fonction qui vérifie si la partie est terminée ou pas
     * Si elle est terminée, elle met à jour la propriété gameOver
     */
    isGameOver: () => {
        // On vérifie la position du joueur par rapport à targetCell
        if (
            app.player.x === app.targetCell.x &&
            app.player.y === app.targetCell.y
        ){
            // Dans ce cas là, les coordonnées du joueur sont les même que celle de l'arrivée
            // Donc le joueur a atteint son but
            // Il faut donc mettre fin au jeu et afficher un message
            setTimeout(() => {
                alert(`Bravo tu as trouvé ton chemin en ${app.nbMove} mouvements !`);
            }, 100);
            app.gameOver = true;
            
        }
    },

    moveForward: () => {
        // Si jamais le jeu est fini
        if (app.gameOver){
            // On met fin à la fonction avant même qu'elle ai eu le temps
            // de faire quoi que ce soit
            return;
        }
        app.nbMove++;

        let newXPosition = app.player.x;
        let newYPosition = app.player.y;

        // Suivant la direction du joueur, on va pas avoir le même effet
        switch(app.player.direction){
            case 'right':
                newXPosition += 1;
                break;
            case 'down':
                newYPosition += 1;
                break;
            case 'left':
                newXPosition -= 1;
                break;
            case 'up':
                newYPosition -= 1;
                break;
        }

        // On vérifie si il sort de la grille ou pas
        // Il ne faut pas que x OU y soit négatif
        if (
            newXPosition < 0 || newYPosition < 0 ||
            newXPosition >= app.nbRowCells || newYPosition >= app.nbGridRows
        ){
            console.error('Le joueur sort de la grille ABORT !');
            return;
        }

        // Si on a passé le if, c'est qu'on est dans la grille
        // Dans ce cas là on met à jour la nouvelle position du joueur
        app.player.x = newXPosition;
        app.player.y = newYPosition;

        // Et on reconstruit la grille
        app.redrawBoard();
    },
    /**
     * Fonction permettant de tourner le joueur à droite
     */
    turnRight: () => {
        // Si jamais le jeu est fini
        if (app.gameOver){
            // On met fin à la fonction avant même qu'elle ai eu le temps
            // de faire quoi que ce soit
            return;
        }
        app.nbMove++;

        // Admettons app.player.direction
        switch (app.player.direction){
            // Dans le cas où app.player.direction vaut 'right'
            case 'right':
                app.player.direction = 'down';
                break;
            // Dans le cas où app.player.direction vaut 'down'
            case 'down':
                app.player.direction = 'left';
                break;
            // Dans le cas où app.player.direction vaut 'left'
            case 'left':
                app.player.direction = 'up';
                break;
            // Dans le cas où app.player.direction vaut 'up'
            case 'up':
                app.player.direction = 'right';
                break;
            default: 
                console.error('Impossible de faire tourner le joueur');
                return;
        }
        
        app.redrawBoard();
    },
    /**
     * Fonction permettant de tourner le joueur à gauche
     */
    turnLeft: () => {
        // Si jamais le jeu est fini
        if (app.gameOver){
            // On met fin à la fonction avant même qu'elle ai eu le temps
            // de faire quoi que ce soit
            return;
        }

        app.nbMove++;

        if (app.player.direction === 'right'){
            app.player.direction = 'up';
        }
        else if (app.player.direction === 'up'){
            app.player.direction = 'left';
        }
        else if (app.player.direction === 'left'){
            app.player.direction = 'down';
        }
        else if (app.player.direction === 'down'){
            app.player.direction = 'right';
        }
        else {
            console.error('Impossible de faire tourner le joueur');
            return;
        }

        app.redrawBoard();
    },

    /**
     * Fonction permettant d'écouter les appuis sur les touches du clavier
     */
    listenKeyboardEvents: () => {
        document.addEventListener('keyup', (event) => {
            // Suivant la touche appuyée, on va faire quelque chose
            switch(event.code){
                // Si jamais c'est la touche fleche du haut, on avance
                case 'ArrowUp':
                    return app.moveForward();
                // Si jamais c'est la touche fleche de droite, on tourne à droite
                case 'ArrowRight':
                    return app.turnRight();
                // Si jamais c'est la touche fleche de gauche, on tourne à gauche
                case 'ArrowLeft':
                    return app.turnLeft();
            }
            // J'ai rien d'autre à faire que déclencher ces fonction, donc au lieu d'utiliser le break
            // je return direct, pour mettre fin à la fonction, ce qui est au final
            // beaucoup plus bourrin qu'un break, mais aussi plus radical
        });
    },

    /**
     * Fonction permettant de vider l'élément qui a pour id board
     */
    clearBoard: () => {
        // On vide le contenu HTML de l'élément #board
        app.boardElement.innerHTML = '';
    },

    /**
     * Vide la board actuelle et redessine une nouvelle board
     */
    redrawBoard: () => {
        app.clearBoard();
        app.drawBoard();
    },

    init: () => {
        // On fait prendre la valeur de boardElement dans la fonction init
        // puisque on doit attendre que le DOM soit charger avant
        // Si on l'avait fait direct dans app et pas dans une fonction déclenchée
        // aprés le DOMContentLoaded, document.getElementById('board') retournerait null
        app.boardElement = document.getElementById('board');

        app.drawBoard();
        app.listenKeyboardEvents();
        console.log('init !');
    }
};

document.addEventListener('DOMContentLoaded', app.init);