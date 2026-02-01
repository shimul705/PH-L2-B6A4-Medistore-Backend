import app from "./app"
import { prisma } from "./lib/prisma"

const port = process.env.PORT || 3000;

async function main() {
    try {
        await prisma.$connect();
        console.log('Database connected');

        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        })

    } catch (error) {
        console.error('Database connection error:', error);
        await prisma.$disconnect();
        process.exit(1);

    }

}

main();