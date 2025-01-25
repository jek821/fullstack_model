const fs = require('fs');

const base64Image = `
    iVBORw0KGgoAAAANSUhEUgAAADgAAAAcCAYAAAA0u3w+AAAAXklEQVRYR+3SsREAIAzDQNh/aGADtQqn1C6Mn33erY9v98DhugkOB1wJJihfoC8qB8J6CeJE8kCCciCslyBOJA8kKAfCegniRPJAgnIgrJcgTiQPJCgHwnoJ4kTywAV+hG+tyVV3nwAAAABJRU5ErkJggg==`.replace(/\n/g, ''); // Remove newlines from the string

// Decode and write to a file
fs.writeFileSync('decoded_image.png', Buffer.from(base64Image, 'base64'));
console.log('Image saved as decoded_image.png');
