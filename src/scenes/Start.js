export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
        this.playerSpeed = 300;
        this.wave = 1;
        this.enemiesAlive = this.wave * 6;
        // this.highscore = 0;

    }

    preload() {
        this.load.image('background', 'assets/kenney/Tiles/tile_0000.png');
        this.load.image('background2', 'assets/kenney/Tiles/tile_0233.png');


        //player
        this.load.image('player', 'assets/kenney/Tiles/tile_0366.png');
        this.load.image('hitPoint', 'assets/kenney/Tiles/tile_0041.png')
        this.load.image('bullet', 'assets/kenney/Tiles/tile_0001.png')
        this.load.audio('bulletAudio', 'assets/kenney/Audio/laserRetro_000.ogg');

        //enemy
        this.load.image('enemyBullet', 'assets/kenney/Tiles/tile_0325.png');
        this.load.image('enemy1', 'assets/kenney/Tiles/tile_0323.png');
        this.load.image('enemy1down', 'assets/kenney/Tiles/tile_0324.png');
        this.load.image('enemy2', 'assets/kenney/Tiles/tile_0343.png');
        this.load.image('enemy2down', 'assets/kenney/Tiles/tile_0344.png');
        this.load.audio('enemyBulletAudio', 'assets/kenney/Audio/laserRetro_001.ogg');
        this.load.audio('enemyDie', 'assets/kenney/Audio/explosionCrunch_000.ogg')


    }

    create() {
        this.background = this.physics.add.sprite(640, 400, 'background2').setScale(40);
        this.base = this.physics.add.sprite(640, 940, 'background2').setScale(40)
        this.base.setVisible(false);

        const rawData = localStorage.getItem('highscore');
        if (rawData) {
            const data = JSON.parse(rawData);
            this.highscore = data.highscore ?? 0;
        } else {
            this.highscore = 0;
        }


        // UI  
        // this.highscore = 0;
        this.score = 0;
        this.wave = 1;
        this.enemiesAlive = this.wave * 6;
        this.health = 3;

        this.scoreT = this.add.text(20, 20, 'Score: ' + this.score, {fontSize: '24px', fill: '#fff'});
        this.highscoreT = this.add.text(20, 80, 'Highscore: ' + this.highscore, {fontSize: '24px', fill: '#fff'});
        this.waveT = this.add.text(20, 140, 'Level: ' + this.wave, {fontSize: '24px', fill: '#fff'})

        this.hearts = []
        for (let i = 0; i < 3; i++) {
            let heart = this.add.sprite(60 + i*100, 220, 'hitPoint').setScale(6);
            this.hearts.push(heart);
        }

        this.updateHealth(0);



        // controls
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        
        // player sprite
        this.player = this.physics.add.sprite(650, 550, 'player').setScale(3)


        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
        })

        this.enemies = this.physics.add.group();

        this.enemyBullets = this.physics.add.group({
            defaultKey: "enemyBullet",
        })

        this.newWave();

        this.last_time = 0;
    }

    update(time) {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;

        // controls
        if (this.left.isDown) {
            this.player.setVelocityX(-this.playerSpeed)
        } else if (this.right.isDown) {
            this.player.setVelocityX(this.playerSpeed)
        } else {
            this.player.setVelocityX(0);
        }

        // player bounds
        if (this.player.x < 390)
        {
            this.player.x = 390;
            this.player.velocityX = 0;
        }
        if (this.player.x > 890)
        {
            this.player.x = 890;
            this.player.velocityX = 0;
        }

        // shoot
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            this.shoot();
        }

        // check collisions
        this.checkCollisions();

        // update wave
        if (this.enemiesAlive <= 0) {
            this.updateWave();
        }

        // check gameover
        if (this.health <= 0) {
            this.gameOver();
        }

        // console.log(this.player.x)
        
    }
    updateHealth(heartsGained) {
        this.health += heartsGained;

        for (let i = 0; i < this.hearts.length; i++) {
            this.hearts[i].setVisible(false);
        }

        for (let i = 0; i < this.health; i++) {
            this.hearts[i].setVisible(true);
        }


    }

    updateScore(points) {
        this.score += points;
        this.scoreT.setText('Score: ' + this.score);
    }

    updateWave() {
        this.wave++
        this.waveT.setText('Wave: ' + this.wave);
        this.enemiesAlive = 6 * this.wave
        this.newWave();
    }


    shoot() {
        // console.log("pew");

        const bullet = this.bullets.get(this.player.x, this.player.y - 30).setScale(3)

        bullet.setActive(true);
        bullet.setVisible(true);
        bullet.setVelocityY(-300);
        this.sound.play('bulletAudio', {volume: 0.3});
        setTimeout(() => {
            bullet.destroy();
        }, 2000);

        
    }
    
    enemyShoot(enemy) {
        // console.log('evil pew');
        
        if (enemy.scene){
            const enemyBullet = this.enemyBullets.get(enemy.x, enemy.y + 30).setScale(2)
            
            enemyBullet.setActive(true);
            enemyBullet.setVisible(true);
            enemyBullet.setVelocityY(100);
            this.sound.play('enemyBulletAudio', {volume: 0.3});
            const flip = setInterval(() => {
                enemyBullet.flipX = !(enemyBullet.flipX);
                
            }, 1000); 
            setTimeout(() => {
                enemyBullet.destroy();
            }, 9400);
        }

    }

    playerCollision() {
        // console.log("yeowch");
        this.updateHealth(-1);
        this.sound.play('enemyDie', {volume: 0.4});

    }

    enemyCollision() {
        // console.log("evil yeowch");
        this.enemiesAlive--;
        this.sound.play('enemyDie', {volume: 0.4});

    }


    newWave() {
       
        for (let j = 0; j < this.wave; j++) {
            setTimeout(() => {    
                for (let i = 0; i < 6; i++) {
                
                    const isShooter = Math.random() <= .14 * (this.wave - 1);
                    const enemy = this.enemies.create(415 + i*90, 0, isShooter ? 'enemy2' : 'enemy1');

                    enemy.setScale(5);
                    enemy.setActive();
                    enemy.setVisible(true);
                    enemy.setVelocityY(20);
                    // enemy.setVelocityY(200);
                        
                    if (isShooter) {
                        enemy.tween = this.tweens.add({
                            targets: enemy,
                            x: Math.random() <= 0.5 ? enemy.x + 50 : enemy.x - 50,
                            ease: 'Sine.easeInOut',
                            duration: 2000,
                            yoyo: true,
                            repeat: -1

                        })

                        const shootTime = setInterval(() => {
                            Math.random() <= 0.4 ? this.enemyShoot(enemy) : true;
                        }, 800); 
                    }


                }
            }, 5000 * (j+1));

        }
    }

    checkCollisions() {
        const enemyBullets = this.enemyBullets.getChildren();
        const enemies = this.enemies.getChildren();
        const bullets = this.bullets.getChildren();

        // this.wave = 8;

        // player and enemy bullets
        this.physics.add.overlap(this.player, enemyBullets, (player, enemyBullet) => {
            this.playerCollision();
            
            enemyBullet.destroy();
        });

        // player and enemies
        this.physics.add.overlap(this.player, enemies, (player, enemy) => {
            this.playerCollision();
            
            enemy.destroy();
        });

        // enemies and player bullets
        this.physics.add.overlap(enemies, bullets, (enemy, bullet) => {
            if (enemy.texture.key == 'enemy2') {
                enemy.setTexture('enemy2down');
                
            } else if (enemy.texture.key == 'enemy2down') {
                enemy.destroy();
                this.updateScore(20);
                this.enemyCollision();
                
            } else if (enemy.texture.key == 'enemy1') {
                enemy.setTexture('enemy1down')

            } else if (enemy.texture.key == 'enemy1down') {
                enemy.destroy();
                this.updateScore(10)
                this.enemyCollision();
            }
            bullet.destroy();
        })

        this.physics.add.overlap(enemies, this.base, (enemy, base) => {
            enemy.destroy();
            this.enemyCollision();
            this.updateScore(-20);
        })

    }


    gameOver() {
        // console.log('blegh')
        if (this.score > this.highscore) {
            this.highscore = this.score;
        }
        
        const saveData = { highscore: this.highscore}
        localStorage.setItem('highscore', JSON.stringify(saveData));

        this.scene.start('GameOver', {score: this.score, highscore: this.highscore})
        


    }
    
}
