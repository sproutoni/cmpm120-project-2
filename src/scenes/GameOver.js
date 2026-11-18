export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    init(data) {
        this.finalScore = data.score;
        this.finalHighscore = this.loadHighscore();
    }

    preload() {
        this.load.image('guy', 'assets/kenney/Tiles/tile_0324.png')

    }

    create() {

        this.physics.add.sprite(500, 100, 'guy').setScale(8);

        this.add.text(100, 100, 'Game Over !', {
            fontSize: '64px', fill: '#fff' 
        })


        this.add.text(150, 180, 'Score: ' + this.finalScore, {
            fontSize: '32px', fill: '#fff'
        })
        this.add.text(150, 240, 'Highscore: ' + this.finalHighscore, {
            fontSize: '32px', fill: '#fff'
        })

        const back = this.add.text(100, 600, '< Main Menu', 
            {
                fontSize: '48px', fill: '#fff'
            }
        )
        back.setInteractive();
        back.on('pointerdown', () => this.scene.start('TitleScreen'))
        
        const play = this.add.text(100, 360, 'Play Again', {
            fontSize: '64px', fill: '#fff' 
        })
        play.setInteractive();
        play.on('pointerdown', () => this.scene.start('Start'))

        this.physics.add.sprite(550, 360, 'guy').setScale(8);
    }

    loadHighscore() {
        try {
            const raw = localStorage.getItem('highscore');
            if (raw) {
                const data = JSON.parse(raw);
                return data.highscore ?? 0;
            }
        } catch (e) {
            
        }
        return 0;

    }
    
}