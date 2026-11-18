export class ControlMenu extends Phaser.Scene {
    constructor() {
        super('ControlMenu');
    }

    preload() {
        this.load.image('guy', 'assets/kenney/Tiles/tile_0324.png')

    }

    create() {

        this.physics.add.sprite(500, 100, 'guy').setScale(8);

        this.add.text(100, 100, 'Controls', {
            fontSize: '64px', fill: '#fff' 
        })

        this.add.text(150, 180, '"A" -> left', {
            fontSize: '32px', fill: '#fff'
        })
        this.add.text(150, 240, '"D" -> right', {
            fontSize: '32px', fill: '#fff'
        })
        this.add.text(150, 300, '"SPACE" -> shoot', {
            fontSize: '32px', fill: '#fff'
        })

        const back = this.add.text(100, 600, '< Back', 
            {
                fontSize: '48px', fill: '#fff'
            }
        )
        back.setInteractive();
        back.on('pointerdown', () => this.scene.start('TitleScreen'))
        
        this.add.text(100, 360, 'Credits', {
            fontSize: '64px', fill: '#fff' 
        })

        this.physics.add.sprite(450, 360, 'guy').setScale(8);

        this.add.text(150, 440, 'Game by Toni En', {
            fontSize: '32px', fill: '#fff'
        })
        this.add.text(150, 500, 'Assets from https://kenney.nl/assets', {
            fontSize: '32px', fill: '#fff'
        })

    }
    
}