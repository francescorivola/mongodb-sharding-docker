'use strict'

const mongodb = require('mongodb');

async function main() {
    const uri = 'mongodb://localhost:27020/test';
    const client = await mongodb.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true });
    const test = client.db('test');
    const messages = test.collection('messages');

    let i = 0;
    while(true) {
        i++;
        const createdAt = new Date();
        const message = 'Hello World ' + i;
        const type = i % 10;
        const inserted = await messages.insertOne({ createdAt, message, type });
        console.log('inserted', inserted.insertedId, createdAt);
        await wait(1);
    }
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});