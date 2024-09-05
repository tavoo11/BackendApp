module.exports = {
  type: 'sqlite',
  database: 'db.sqlite3',
  entities: ['dist/**/*.entity.js'],
  synchronize: true, // Cambia a false para producción
  migrations: ['dist/migration/*.js'],
  cli: {
    migrationsDir: 'src/migration',
  },
};
