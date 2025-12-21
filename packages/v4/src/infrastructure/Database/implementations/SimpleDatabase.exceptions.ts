export class RecordNotFoundException extends Error {
  constructor(id: string) {
    super(`Record not found for id: ${id}`)
  }
}

export class DuplicateRecordException extends Error {
  constructor(id: string) {
    super(`Duplicate record found for id: ${id}`)
  }
}

export class DatabaseOfflineException extends Error {
  constructor() {
    super(`Database is offline`)
  }
}
