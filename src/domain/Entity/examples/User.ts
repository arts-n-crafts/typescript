import { Entity } from '../Entity'

interface UserProps {
  username: string
  email: string
}

export class User extends Entity<UserProps> {
  static create(id: string, props: UserProps) {
    return new User(id, props)
  }
}
