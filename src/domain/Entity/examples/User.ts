import { Entity } from '../Entity'

interface UserProps {
  username: string
  email: string
}

export class User extends Entity<UserProps> {
  static create(props: UserProps, id: string) {
    return new User(props, id)
  }
}
