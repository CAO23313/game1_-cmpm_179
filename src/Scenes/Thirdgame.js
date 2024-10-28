class Thirdgame extends Phaser.Scene {
    constructor() {
        super("Thirdgame");
    }

    preload() {
        // Load assets
        this.load.audio("collect", "assets/confirmation_001.ogg");
        this.load.audio("damage", "assets/laserLarge_001.ogg");
        this.load.audio("end_sound","assets/jingles_PIZZI07.ogg");
        this.load.audio("next_sound","assets/jingles_PIZZI10.ogg");

        this.load.image('nuts', 'assets/images/nuts.png');
        this.load.image('main_image', 'assets/images/main_image.png');
        this.load.image('cans', 'assets/images/can 1.png');
        this.load.spritesheet('squirrel_sheet', 'assets/images/squirrel sheet.png', { frameWidth: 75, frameHeight: 75 });
        this.load.spritesheet('car_sheet', 'assets/images/car sheet.png', { frameWidth: 350, frameHeight: 90 });
        this.load.image('groundL3', 'assets/images/ground 2.png');
        this.load.image('groundCol', 'assets/images/ground col.png');
        this.load.image('tree', 'assets/images/tree 0.png');
        this.load.image('tree1', 'assets/images/tree 1.png');
    }

    create() {
        const { height, width } = this.game.config;
        this.back_image = this.add.image(0, 0, 'main_image').setOrigin(0, 0);
        this.resizeBackground();
        window.addEventListener('resize', () => {
            this.resizeBackground();
        });

        // Create animations
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
        this.anims.create({
            key: 'car',
            frames: this.anims.generateFrameNumbers('car_sheet', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.physics.add.sprite(400, 350, 'tree').setScale(1.5);
        this.physics.add.sprite(700, 280, 'tree1').setScale(1.5);

        // Create ground
        this.ground_L3 = this.add.tileSprite(0, height, width, 32, 'groundL3').setOrigin(0, 1);
        this.groundCol = this.physics.add.staticImage(0, height - 5, 'groundCol').setOrigin(0, 1);
        this.groundCol.setSize(width + 150, 10); // Adjust the height as needed
    
        // Set up player
        this.squirrel = this.physics.add.sprite(400, -500, 'squirrel_sheet')
            .setCollideWorldBounds(true)
            .setGravityY(300);
        this.squirrel.body.setSize(50, 50);
        this.squirrel.body.setOffset(25, 10);
    
        // Add collision between squirrel and ground after squirrel is initialized
        this.physics.add.collider(this.squirrel, this.groundCol);
    
        // Set up controls
        this.cursors = this.input.keyboard.createCursorKeys();
    
        // Group of platforms with physics
        this.nut = this.physics.add.staticGroup();
        this.can = this.physics.add.group();
    
        // Create initial platforms
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(50, 750);
            const y = i * 150;
            const platform = this.nut.create(x, y, 'nuts');
            platform.setScale(0.5);
        }
    
        // Add collision between player and platforms
    
        const enemyHit = (player, enemy) => {
            this.sound.play("damage");
            health -= 1;
            healthText.setText('Health: ' + health);
            if (health <= 0) {
                this.scene.start('badEnd');
            }
            player.setVelocity(0, 0);
            player.setX(700);
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

        let scoreText = this.add.text(16, 16, 'Nuts: 0 / 15', { fontSize: '32px', fill: "black" }).setScrollFactor(0);
        let healthText = this.add.text(16, 64, 'Health: 5', { fontSize: '32px', fill: "black" }).setScrollFactor(0);
        const handleNutCollision = (squirrel, nut) => {
            this.sound.play("collect");
            nut_count += 1;
            scoreText.setText('Nuts: ' + nut_count + ' / 15');
            nut.destroy();
            console.log(nut_count);
            if (nut_count >= 15) {
                this.sound.play("next_sound");
                level3_count += 1;
                console.log(level3_count);
                this.scene.start('goodEnd');
            }
        }
        const handleCanCollision = (squirrel, can) => {
            this.sound.play("damage");
            health -= 1;
            healthText.setText('Health: ' + health);
            console.log("health:", health);
            if (health <= 0) {
                this.sound.play("end_sound");
                this.scene.start('badEnd');
            }
            can.destroy();
        }

        this.physics.add.collider(this.squirrel, this.nut, handleNutCollision, null, this);
        this.physics.add.collider(this.squirrel, this.can, handleCanCollision, null, this);

        this.carsGroup = this.physics.add.group();
        this.spawnCarWithRandomDelay();
        this.physics.add.collider(this.squirrel, this.carsGroup, enemyHit, null, this);

        // Time for spawning new platforms
        this.time.addEvent({
            delay: 1000,
            callback: this.addnut,
            callbackScope: this,
            loop: true
        });
        this.time.addEvent({
            delay: 1000,
            callback: this.addcan,
            callbackScope: this,
            loop: true
        });
    }
    resizeBackground() {
    // Get the current width and height of the canvas
    const canvasWidth = this.scale.width;
    const canvasHeight = this.scale.height;

    // Set the image size to match the canvas
    this.back_image.setDisplaySize(canvasWidth, canvasHeight);
    }

    addnut() {
        const x = Phaser.Math.Between(50, 1250);
        const y = 0; // Spawn at the top of the screen
        const nut = this.nut.create(x, y, 'nuts');
        nut.setScale(0.5);
        
        // Remove off-screen platforms
        this.nut.children.iterate(platform => {
            if (nut && nut.y > 600) { // Adjust to remove sooner if needed
                nut.destroy();
            }
        });
    }

    
    addcan() {
        const x = Phaser.Math.Between(50, 1250);
        const y = 0; // Spawn at the top of the screen
        const can = this.can.create(x, y, 'cans');
        can.setScale(0.5);
        can.setGravityY(50);
        // Remove off-screen platforms
        this.can.children.iterate(platform => {
            if (can && can.y > 600) { // Adjust to remove sooner if needed
                can.destroy();
            }
        });
    }


    spawnCarWithRandomDelay() {
        const randomDelay = Phaser.Math.Between(10000, 12000); // Random delay between 2 and 6 seconds
        this.time.addEvent({
            delay: randomDelay,
            callback: () => {
                this.spawnCar(); // Spawn a car
                this.spawnCarWithRandomDelay(); // Call again for the next car with a new random delay
            },
            callbackScope: this,
            loop: false
        });
    }

    spawnCar() {
        const { width, height } = this.game.config;

        const carY = height - 30; 
        const carX = width + 100; 

        const car = this.carsGroup.create(carX, carY, 'car_sheet').setOrigin(0, 1);
        car.setVelocityX(-500); 
        car.setGravityY(0); // Ensure car doesn't bounce by keeping it on the ground
        car.anims.play('car', true); 
    }

    hitByCar(squirrel, car) {
        health -= 1;
        if (health <= 0) {
            this.scene.start('badEnd');
        }
        car.destroy(); 
    }

    update() {
        let currentDirection = 0;


        if (this.cursors.left.isDown) {
            this.squirrel.setVelocityX(-160);
            currentDirection = -1;
            if (this.squirrel.body.onFloor()) {
                this.squirrel.play('run', true);
            }
        } else if (this.cursors.right.isDown) {
            this.squirrel.setVelocityX(160);
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

        if ((this.cursors.space.isDown || this.cursors.up.isDown) && this.squirrel.body.onFloor()) {
            this.squirrel.setVelocityY(-300);
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
        // Move platforms downwards
        this.nut.children.iterate(platform => {
            if (platform) {
                platform.y += 1;
                platform.body.updateFromGameObject();
            }
        });
    }    
}


