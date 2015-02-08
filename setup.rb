require 'sqlite3'

Dir.mkdir 'db' unless Dir.exists? 'db'
File.delete 'db/development.sqlite3' if File.exists? 'db/development.sqlite3'

db = SQLite3::Database.new 'db/development.sqlite3'

# create database
db.execute <<-SQL
  CREATE TABLE todos(
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status INTEGER NOT NULL
  );
SQL
