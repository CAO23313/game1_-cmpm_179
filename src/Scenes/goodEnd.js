class goodEnd extends Phaser.Scene {
    constructor() {
        super("goodEnd");
    }

    preload() {
        this.load.image('good_end', 'assets/images/goodend.png');
        this.load.image('restart', 'assets/images/restart button.png');
        this.load.audio("click", "assets/click_001.ogg");
    }

    create() {
        this.goodend_image = this.add.image(0, 0, 'good_end').setOrigin(0, 0);
        this.resizeBackground();
        
        this.restart_button = this.add.image(470, 140, 'restart').setInteractive().setScale(2);
            this.restart_button.on('pointerdown', () => {
            nut_count = 0;
            level1_count = 0;
            level2_count = 0;
            level3_count = 0;
            health = 5;
            this.sound.play("click");
            this.scene.start('MainMenu');
        });
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
        this.goodend_image.setDisplaySize(canvasWidth, canvasHeight);
    }

    update() {
        // Any update logic goes here
    }
}