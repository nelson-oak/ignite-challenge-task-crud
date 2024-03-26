import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }
  
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }

    return data
  }

  getById(table, id) {
    if (!Array.isArray(this.#database[table])) {
      return undefined
    }

    const row = this.#database[table].find(item => item.id === id)

    return row
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
  }

  update(table, id, data) {
    if (!Array.isArray(this.#database[table])) {
      return
    }

    const rowIdx = this.#database[table].findIndex(item => item.id === id)

    if (rowIdx > -1) {
      this.#database[table][rowIdx] = {
        ...this.#database[table][rowIdx],
        ...data
      }
    }
  }

  delete(table, search) {
    // todo
  }
}