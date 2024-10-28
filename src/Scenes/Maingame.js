class Maingame extends Phaser.Scene { 
    constructor() {
        super("Maingame");
    }

    preload() {
        this.load.audio("collect", "assets/confirmation_001.ogg");
        this.load.audio("damage", "assets/laserLarge_001.ogg");
        this.load.audio("end_sound","assets/jingles_PIZZI07.ogg");
        this.load.audio("next_sound","assets/jingles_PIZZI10.ogg");

        this.load.image('ground', 'assets/images/ground 2.png');
        this.load.image('groundCol', 'assets/images/ground col.png');
        this.load.image('background', 'assets/images/Level_image.png');
        this.load.image('nuts', 'assets/images/nuts.png');
        this.load.spritesheet('squirrel_sheet', 'assets/images/squirrel sheet.png', { frameWidth: 75, frameHeight: 75 });
        this.load.spritesheet('car_sheet', 'assets/images/car sheet.png', { frameWidth: 350, frameHeight: 90 });
    }

    create() {
        const { height, width } = this.game.config;

        this.background_image = this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.resizeBackground();
        window.addEventListener('resize', () => {
            this.resizeBackground();
        });

        let scoreText = this.add.text(16, 16, 'Nuts: 0 / 10', { fontSize: '32px', fill: "black" }).setScrollFactor(0);
        let healthText = this.add.text(16, 64, 'Health: 5', { fontSize: '32px', fill: "black" }).setScrollFactor(0);
        const collectNut = (squirrel, nut) => {
            this.sound.play("collect");
            nut_count += 1;
            nut.destroy();
            console.log(nut_count);
            scoreText.setText('Nuts: ' + nut_count + ' / 10');
            if (nut_count >= 10) {
                this.sound.play("next_sound");
                health = 5;
                level1_count += 1;
                nut_count = 0;
                console.log(level1_count);
                this.scene.start('selectMenu');
              }
        };
        const hitByCar = (squirrel, car) => {
            this.sound.play("damage");
            health -= 1;
            healthText.setText('Health: ' + health);
            car.destroy();
            if (health <= 0) {
                this.sound.play("end_sound");
                this.scene.start('badEnd');
              }
        };
        // Create ground
        this.ground = this.add.tileSprite(0, height, width, 32, 'ground').setOrigin(0, 1);
        this.groundCol = this.physics.add.staticImage(0, height - 5, 'groundCol').setOrigin(0, 1);
        this.groundCol.setSize(width, 32); 
        
        // Create the squirrel with physics
        this.squirrel = this.physics.add.sprite(100, height - 50, 'squirrel_sheet')
            .setOrigin(0, 1)
            .setCollideWorldBounds(true)
            .setGravityY(1000);
        
        const colliderWidth = 50; 
        const colliderHeight = 80; 
        this.squirrel.body.setSize(colliderWidth, colliderHeight);
        this.squirrel.body.setOffset(25, 0); 

        this.physics.add.collider(this.squirrel, this.groundCol);
        
        // Set up cursor keys for movement
        this.cursors = this.input.keyboard.createCursorKeys();
    
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
            key: 'car',
            frames: this.anims.generateFrameNumbers('car_sheet', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1
        });

        // Input handling for jump
        this.handleInputs();
    
        // Group for nuts with physics enabled
        this.nutsGroup = this.physics.add.group();
    
        // Start spawning nuts with random frequency
        this.spawnNutWithRandomDelay();

        // Group for cars with physics enabled
        this.carsGroup = this.physics.add.group();

        // Start spawning cars with random frequency
        this.spawnCarWithRandomDelay();

        // Collision detection between squirrel and nuts
        this.physics.add.overlap(this.squirrel, this.nutsGroup, collectNut, null, this);

        // Collision detection between squirrel and cars
        this.physics.add.overlap(this.squirrel, this.carsGroup, hitByCar, null, this);

        // Enable collision between cars and the ground
        this.physics.add.collider(this.carsGroup, this.groundCol);
    }
    resizeBackground() {
        // Get the current width and height of the canvas
        const canvasWidth = this.scale.width;
        const canvasHeight = this.scale.height;
    
        // Set the image size to match the canvas
        this.background_image.setDisplaySize(canvasWidth, canvasHeight);
    }
    spawnNutWithRandomDelay() {
        const randomDelay = Phaser.Math.Between(1000, 5000); // Random delay between 1 and 5 seconds
        this.time.addEvent({
            delay: randomDelay,
            callback: () => {
                this.spawnNut(); // Spawn the nut
                this.spawnNutWithRandomDelay(); // Call again for the next nut with a new random delay
            },
            callbackScope: this,
            loop: false
        });
    }

    spawnCarWithRandomDelay() {
        const randomDelay = Phaser.Math.Between(2000, 6000); // Random delay between 2 and 6 seconds
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

    spawnNut() {
        const { width, height } = this.game.config;

        const nutY = height - 70; 
        const nutX = width + 50; 

        const nut = this.nutsGroup.create(nutX, nutY, 'nuts');
        nut.setVelocityX(-300); 
        nut.setGravityY(0);
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

    

    handleInputs() {
        this.input.keyboard.on('keydown_SPACE', () => {
            if (!this.squirrel.body.onFloor()) return; 

            this.squirrel.anims.play('jump', true);
            const jumpStrength = -700; 
            let jumpVelocityX = this.squirrel.body.velocity.x; 
            this.squirrel.setVelocity(jumpVelocityX, jumpStrength); 
        });
    }

    update() {
        this.ground.tilePositionX += 5;

        if (this.squirrel.body.onFloor()) {
            this.squirrel.anims.play('run', true); 
        } else {
            this.squirrel.anims.play('jump', true); 
        }

        this.nutsGroup.children.iterate((nut) => {
            if (nut && nut.x < 0) {
                nut.destroy();
            }
        });

        this.carsGroup.children.iterate((car) => {
            if (car && car.x < -car.width) {
                car.destroy(); 
            }
        });
    }
}

