const Jimp = require('jimp');

async function removeBackground() {
    try {
        const image = await Jimp.read('../assets/cartoon_doctor.png');
        
        // Iterate over all pixels
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            const red = this.bitmap.data[idx + 0];
            const green = this.bitmap.data[idx + 1];
            const blue = this.bitmap.data[idx + 2];
            
            // If the pixel is close to pure white, make it transparent
            if (red > 240 && green > 240 && blue > 240) {
                this.bitmap.data[idx + 3] = 0; // Alpha to 0
            }
        });
        
        await image.writeAsync('../assets/cartoon_doctor_transparent.png');
        console.log('Successfully created transparent PNG');
    } catch (err) {
        console.error('Error:', err);
    }
}

removeBackground();
