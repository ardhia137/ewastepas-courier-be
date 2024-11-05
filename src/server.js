import app from './app.js';
import {loadingAnimation} from "./utils/loadingAnimation.js";

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await loadingAnimation(3000); // Adjust duration as needed

    try {
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error(`❌ Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();