class Secondgame extends Phaser.Scene {
    constructor() {
        super("Secondgame");
    }

    preload() {
        this.load.audio("collect", "assets/confirmation_001.ogg");
        this.load.audio("damage", "assets/laserLarge_001.ogg");
        this.load.audio("end_sound","assets/jingles_PIZZI07.ogg");
        this.load.audio("next_sound","assets/jingles_PIZZI10.ogg");

        this.load.image('tile_set', 'assets/tilemaps/tile_maps.png');
        this.load.image('back_image', 'assets/images/background.png');
        this.load.image('nuts1', 'assets/images/nuts 1.png');
        this.load.tilemapTiledJSON('map-tmj', 'assets/tilemaps/second_game.json');
        this.load.spritesheet('squirrel_sheet', 'assets/images/squirrel sheet.png', { frameWidth: 75, frameHeight: 75 });
        this.load.spritesheet('turkey_sheet', 'assets/images/turkey sheet.png', { frameWidth: 57, frameHeight: 60 });
    }

    create() {
        const backgroundImage = this.add.image(0, 0, 'back_image').setOrigin(0, 0);
        backgroundImage.setScale(4, 1);
    
        const map = this.make.tilemap({ key: 'map-tmj' });
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    
        const tileset = map.addTilesetImage('ground_tile', 'tile_set');
        const platforms = map.createStaticLayer('ground', tileset, 0, 0);
        map.createStaticLayer('trees', tileset, 0, 0);
        platforms.setCollisionByExclusion(-1, true);
    
        // Squirrel setup
        this.squirrel = this.physics.add.sprite(50, -10, 'squirrel_sheet')
            .setOrigin(0, 0)
            .setCollideWorldBounds(true)
            .setGravityY(1000);
        this.squirrel.body.setSize(50, 50);
        this.squirrel.body.setOffset(25, 10);
    
        // Squirrel animations
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('squirrel_sheet', { start: 2, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('squirrel_sheet', { start: 1, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'stay',
            frames: this.anims.generateFrameNumbers('squirrel_sheet', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
    
        // Squirrel collision with platforms
        this.physics.add.collider(this.squirrel, platforms);
    
        // Nut collection from object layer in tilemap
        const nutObjects = map.getObjectLayer('object').objects;
        this.nut_group = this.physics.add.group();
        nutObjects.forEach(nutObject => {
            const nut = this.physics.add.sprite(nutObject.x, nutObject.y - 10, 'nuts1').setImmovable(true);
            this.nut_group.add(nut);
        });
    

        let scoreText = this.add.text(16, 16, 'Nuts: 0 / 20', { fontSize: '32px', fill: "black" }).setScrollFactor(0);
        let healthText = this.add.text(16, 64, 'Health: 5', { fontSize: '32px', fill: "black" }).setScrollFactor(0);
        // Collision callback for nuts
        const playerCollideBox = (squirrel, nut) => {
            this.sound.play("collect");
            health = 5;
            nut_count += 1;
            scoreText.setText('Nuts: ' + nut_count + ' / 20');
            nut.destroy();
            console.log(nut_count);
            if (nut_count >= 20) {
                this.sound.play("next_sound");
                level2_count += 1;
                nut_count = 0;
                console.log(level2_count);
                this.scene.start('selectMenu');
            }
        };
        this.physics.add.collider(this.squirrel, this.nut_group, playerCollideBox, null, this);

        // Define enemy collision behavior
        const enemyHit = (player, enemy) => {
            this.sound.play("damage");
            health -= 1;
            healthText.setText('Health: ' + health);
            if (health <= 0) {
                this.sound.play("end_sound");
                this.scene.start('badEnd');
            }
            player.setVelocity(0, 0);
            player.setX(50);
            player.setY(-100);
            player.setAlpha(0);
            this.tweens.add({
                targets: player,
                alpha: 1,
                duration: 100,
                ease: 'Linear',
                repeat: 5,
            });
        };

        // Turkey animations
        this.anims.create({
            key: 'turkey_stand',
            frames: this.anims.generateFrameNumbers('turkey_sheet', { start: 0, end: 0 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turkey_walk',
            frames: this.anims.generateFrameNumbers('turkey_sheet', { start: 1, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
    
        // Turkey 1 setup
        this.turkey1 = this.physics.add.sprite(300, 780, 'turkey_sheet').setFlipX(true);
        this.turkey1.play('turkey_walk');
        this.physics.add.collider(this.turkey1, platforms);
        this.physics.add.collider(this.squirrel, this.turkey1, enemyHit, null, this);
        this.tweens.add({
            targets: this.turkey1,
            x: 900,
            duration: 2000,
            repeat: -1,
            yoyo: true,
            flipX: true
        });
    
        // Turkey 2 setup
        this.turkey2 = this.physics.add.sprite(1750, 780, 'turkey_sheet').setFlipX(true);
        this.turkey2.play('turkey_walk');
        this.physics.add.collider(this.turkey2, platforms);
        this.physics.add.collider(this.squirrel, this.turkey2, enemyHit, null, this);
        this.tweens.add({
            targets: this.turkey2,
            x: 2050,
            duration: 2000,
            repeat: -1,
            yoyo: true,
            flipX: true
        });
    
        // Turkey 3 setup
        this.turkey3 = this.physics.add.sprite(3000, 685, 'turkey_sheet').setFlipX(true);
        this.turkey3.play('turkey_walk');
        this.physics.add.collider(this.turkey3, platforms);
        this.physics.add.collider(this.squirrel, this.turkey3, enemyHit, null, this);
        this.tweens.add({
            targets: this.turkey3,
            x: 3200,
            duration: 2000,
            repeat: -1,
            yoyo: true,
            flipX: true
        });
    
        // Camera settings
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.squirrel, true, 0.25, 0.25);
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(1);
    
        // Input controls
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        let currentDirection = 0;

        if (this.cursors.left.isDown) {
            this.squirrel.setVelocityX(-300);
            currentDirection = -1;
            if (this.squirrel.body.onFloor()) {
                this.squirrel.play('run', true);
            }
        } else if (this.cursors.right.isDown) {
            this.squirrel.setVelocityX(300);
            currentDirection = 1;
            if (this.squirrel.body.onFloor()) {
                this.squirrel.play('run', true);
            }
        } else {
            this.squirrel.setVelocityX(0);
            if (this.squirrel.body.onFloor()) {
                this.squirrel.play('stay', true);
            }
        }

        if ((this.cursors.space.isDown) && this.squirrel.body.onFloor()) {
            this.squirrel.setVelocityY(-500);
            this.squirrel.play('jump', true);
        }
        if (!this.squirrel.body.onFloor()) {
            this.squirrel.play('jump', true);
        }

        // Flip direction and offset based on movement
        if (currentDirection === -1) {
            this.squirrel.setFlipX(true);
            this.squirrel.body.setOffset(0, 10);
        } else if (currentDirection === 1) {
            this.squirrel.setFlipX(false);
            this.squirrel.body.setOffset(25, 10);
        }
    }
}
