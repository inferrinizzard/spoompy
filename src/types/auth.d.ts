import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";

import type { AccessToken } from "@spotify/web-api-ts-sdk";

declare module "next-auth" {
	interface Session {
		token: JWT;
	}
}

declare module "next-auth/jwt" {
	interface JWT extends AccessToken {
		scope: string;
		id: string;
	}
}
