export class TitleScreen extends Phaser.Scene {
    constructor() {
        super('TitleScreen');
    }

    init(data) {
        this.finalScore = data.score;
        this.finalHighscore = this.loadHighscore();
    }

    preload() {
        this.load.image('guy', 'assets/kenney/Tiles/tile_0324.png')
        this.load.video('demo', 'assets/demo.mp4');
    }

    create() {
        const rawData = localStorage.getItem('highscore');
        if (rawData) {
            const data = JSON.parse(rawData);
            this.highscore = data.highscore ?? 0;
        } else {
            this.highscore = 0;
        }

        this.physics.add.sprite(1000, 150, 'guy').setScale(8);

        this.add.text(100, 150, '1-Bit Gallery Shooter', {
            fontSize: '64px', fill: '#fff' 
        })

        const play = this.add.text(100, 250, 'Play', 
            {
                fontSize: '48px', fill: '#fff'
            }
        )

        let video = this.add.video(1000, 400, 'demo').setScale(0.40);
        video.video.muted = true;
        video.play()
        video.setLoop(true);

        play.setInteractive();
        play.on('pointerdown', () => this.scene.start('Start'))

        const controls = this.add.text(100, 320, 'Controls + Credits', 
            {
                fontSize: '48px', fill: '#fff'
            }
        )
        controls.setInteractive();
        controls.on('pointerdown', () => this.scene.start('ControlMenu'))
    
        this.add.text(100, 390, 'Highscore: ' + this.highscore, {
            fontSize: '48px', fill: '#fff' 
        })
    
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
