import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      username: string
      roles: string[]
    }
    token: string
  }

  interface User {
    id: string
    email: string
    name: string
    username: string
    roles: string[]
    token: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles: string[]
    username: string
    token: string
  }
}
