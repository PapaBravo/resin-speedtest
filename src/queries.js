

const create = `
        CREATE TABLE IF NOT EXISTS Speed (
            id BIGINT PRIMARY KEY,
            download REAL,
            upload REAL,
            clientIp TEXT,
            server TEXT,
            ping REAL,
            timestamp DATETIME
        )
`

module.exports = {
    create
}