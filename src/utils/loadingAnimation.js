export const loadingAnimation = (duration) => {
    const totalLength = 30; // Length of the loading bar
    let loadedLength = 0;

    const interval = setInterval(() => {
        loadedLength++;
        const progress = '='.repeat(loadedLength).padEnd(totalLength, ' ');
        const percentage = ((loadedLength / totalLength) * 100).toFixed(0);

        process.stdout.write(`\rStarting server... [${progress}] ${percentage}%`);

        // If we reach the full length, stop the interval
        if (loadedLength >= totalLength) {
            clearInterval(interval);
        }
    }, duration / totalLength);

    // Ensure we complete the loading bar to 100%
    return new Promise(resolve => {
        setTimeout(() => {
            clearInterval(interval);
            process.stdout.write(`\rStarting server... [${'='.repeat(totalLength)}] 100%\n`);
            resolve();
        }, duration);
    });
};