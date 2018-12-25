

const create = `CREATE TABLE Speed (
                    download REAL,
                    upload REAL,
                    clientIp TEXT,
                    server TEXT,
                    ping REAL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                );
`;

module.exports = {
    create
};
