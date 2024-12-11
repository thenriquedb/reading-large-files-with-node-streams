import { faker } from '@faker-js/faker';
import { createWriteStream } from 'node:fs';
import { pipeline, Readable, Writable, Transform } from 'node:stream';
import { promisify } from 'node:util';

const pipelineAsync = promisify(pipeline);

const LIMIT = process.argv[2] || 50;

const readbleStream = Readable({
  read() {
    for (let i = 0; i < LIMIT; i++) {
      const person = {
        name: faker.person.fullName(),
        document: faker.string.numeric({ length: 11 }),
        email: faker.internet.email(),
        phone: faker.phone.number(),
      };

      this.push(JSON.stringify(person));
    }

    this.push(null);
  }
});

const writableMapToCSV = Transform({
  transform(chunk, encoding, callback) {
    const person = JSON.parse(chunk);
    const row = Object.values(person).join(',') + '\n';

    callback(null, row);
  }
});

const setHeader = Transform({
  transform(chunk, encoding, callback) {
    this.counter = this.counter ?? 0;
    if (this.counter > 0) {
      return callback(null, chunk);
    }

    this.counter += 1;

    callback(null, 'name,document,email,phone\n');
  }
});

(async () => {
  await pipelineAsync(
    readbleStream,
    writableMapToCSV,
    setHeader,
    createWriteStream('out/data.csv')
  )
})()