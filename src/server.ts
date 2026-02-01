import app from "./app";
import { prisma } from "./lib/prisma";

const PORT = process.env.PORT || 4000;

// User try catch for async errors in the future
async function server() {
    try {
        await prisma.$disconnect();

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.log(error);
        await prisma.$disconnect();
        process.exit(1);
    }

}

server();