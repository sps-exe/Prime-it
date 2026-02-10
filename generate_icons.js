
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceIcon = path.resolve(__dirname, 'build/icon.png');
const buildDir = path.resolve(__dirname, 'build');
const iconSetDir = path.resolve(buildDir, 'icon.iconset');

if (!fs.existsSync(sourceIcon)) {
    console.error('Source icon not found:', sourceIcon);
    process.exit(1);
}

// Ensure iconset directory exists
if (!fs.existsSync(iconSetDir)) {
    fs.mkdirSync(iconSetDir);
}

// 1. Generate macOS .icns using sips and iconutil
console.log('Generating macOS .icns...');
const sizes = [16, 32, 128, 256, 512];
const retinaSizes = [32, 64, 256, 512, 1024];

try {
    // Normal sizes
    sizes.forEach(size => {
        execSync(`sips -z ${size} ${size} "${sourceIcon}" --setProperty format png --out "${path.join(iconSetDir, `icon_${size}x${size}.png`)}"`);
    });

    // Retina sizes
    sizes.forEach((size, index) => {
        const retinaSize = retinaSizes[index];
        execSync(`sips -z ${retinaSize} ${retinaSize} "${sourceIcon}" --setProperty format png --out "${path.join(iconSetDir, `icon_${size}x${size}@2x.png`)}"`);
    });

    // Generate .icns
    execSync(`iconutil -c icns "${iconSetDir}"`);
    console.log('Successfully generated build/icon.icns');

    // Cleanup iconset
    fs.rmSync(iconSetDir, { recursive: true, force: true });

} catch (error) {
    console.error('Error generating .icns:', error.message);
}

// 2. Placeholder for Windows .ico
try {
    fs.copyFileSync(sourceIcon, path.join(buildDir, 'icon.ico'));
    console.log('Created icon.ico (copy of png) - placeholder.');
} catch (e) {
    console.error(e);
}
