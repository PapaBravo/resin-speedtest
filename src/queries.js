

const create = `CREATE TABLE IF NOT EXISTS Speed (
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
