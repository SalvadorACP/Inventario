import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const database_name = "inventario.db";
const database_version = "1.0";
const database_displayname = "SQLite Inventario Database";
const database_size = 200000;

export default class localDB {
    static connect() {
        return new Promise<SQLite.SQLiteDatabase>((resolve, reject) => {
            SQLite.openDatabase(
                {
                    name: database_name,
                    location: 'default',
                },
                (db) => {
                    console.log("Database opened successfully");
                    resolve(db);
                },
                (error) => {
                    console.error("Error opening database", error);
                    reject(error);
                }
            );
        });
    }

    static async initialize() {
        try {
            const db = await localDB.connect();
            db.transaction(tx => {
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS productos (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        nombre VARCHAR(64) NOT NULL,
                        precio DECIMAL(10,2) NOT NULL DEFAULT 0.0,
                        minStock INTEGER NOT NULL DEFAULT 0,
                        currentStock INTEGER NOT NULL DEFAULT 0,
                        maxStock INTEGER NOT NULL DEFAULT 0
                    );`,
                    [],
                    () => console.log('Table productos created successfully'),
                    error => console.error('Error creating table productos', error)
                );

                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS movimientos (
                        idmovimiento INTEGER PRIMARY KEY AUTOINCREMENT,
                        idproducto INTEGER NOT NULL,
                        fecha_hora DATETIME NOT NULL DEFAULT (datetime('now', 'localtime')),
                        cantidad INTEGER NOT NULL,
                        tipomovimiento VARCHAR(10) NOT NULL
                    );`,
                    [],
                    () => console.log('Table movimientos created successfully'),
                    error => console.error('Error creating table movimientos', error)
                );
            });
        } catch (error) {
            console.error("Error initializing database", error);
        }
    }
}

