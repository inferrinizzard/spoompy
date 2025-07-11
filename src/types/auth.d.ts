import NextAuth, { type User } from "next-auth";

declare module "next-auth/jwt" {
	interface JWT {
		access_token: string;
		access_token_expires?: number;
		refresh_token: string;
		user: User;
	}
}
