# CSV Read/Write with Node.js Streams and SQLite

This is a proof of concept (POC) demonstrating how to read and write large CSV files efficiently using Node.js streams. The data read from the CSV is also inserted into an SQLite database concurrently, making it suitable for handling large datasets without consuming excessive memory.

## Features

- **Efficiently read large CSV files** using Node.js streams.
- **Write data to new CSV files** with minimal memory usage.
- **Insert CSV data into an SQLite database** as it is read, line by line.
- Suitable for processing large datasets without loading the entire file into memory.

## Install

1. Install dependecies
```bash
yarn
```

2. Generate CSV file. 
```bash
# If the number of records is not passeddd, the default value will be 50
yarn seed <number of records>
```

3. Run aplication
```bash
yarn migrate
```