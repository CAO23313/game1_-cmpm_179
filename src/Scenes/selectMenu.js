class selectMenu extends Phaser.Scene {
    constructor() {
        super("selectMenu");
    }

    preload() {
        this.load.image('map_image', 'assets/images/map1.png');
        this.load.image('L1_button', 'assets/images/level1_button.png');
        this.load.image('L2_button', 'assets/images/level2_button.png');
        this.load.image('L3_button', 'assets/images/level3_button.png');
        this.load.image('lock_button', 'assets/images/locked_button.png');
        this.load.audio("click", "assets/click_001.ogg");
    }

    create() {
        // Add the background image at position (0, 0) with its origin set to (0, 0)
        this.backgroundImage = this.add.image(0, 0, 'map_image').setOrigin(0, 0);
        // Add buttons and set up interactive events
        if(level1_count < 1) {
            this.level1_button = this.add.image(470, 140, 'L1_button').setInteractive().setScale(2);
            this.add.image(900, 270, 'lock_button').setInteractive().setScale(2);
            this.add.image(480, 430, 'lock_button').setInteractive().setScale(2);

            this.level1_button.on('pointerdown', () => {
            this.level1_button.disableInteractive(); // Disable interaction on the button
            this.sound.play("click");
            this.scene.start('Maingame');
        });
        }
        if(level2_count < 1 && level1_count == 1) {
            this.level2_button = this.add.image(900, 270, 'L2_button').setInteractive().setScale(2);
            this.add.image(480, 430, 'lock_button').setInteractive().setScale(2);

            this.level2_button.on('pointerdown', () => {
            this.level2_button.disableInteractive();
            this.sound.play("click");
            this.scene.start('Secondgame');
        });
        }   

        if(level2_count == 1 && level1_count == 1) {
            this.level3_button = this.add.image(480, 430, 'L3_button').setInteractive().setScale(2);
            this.level3_button.on('pointerdown', () => {
                this.level3_button.disableInteractive();
                this.sound.play("click");
                this.scene.start('Thirdgame');
            });
        }
        // Resize the image to fill the canvas
        this.resizeBackground();

        // Listen for window resize events
        window.addEventListener('resize', () => {
            this.resizeBackground();
        });
    }

    resizeBackground() {
        // Get the current width and height of the canvas
        const canvasWidth = this.scale.width;
        const canvasHeight = this.scale.height;

        // Set the image size to match the canvas
        this.backgroundImage.setDisplaySize(canvasWidth, canvasHeight);
    }

    update() {
        // Any update logic goes here
    }

    // Re-enable button interactions when the scene is reloaded
}