"use client";

import type { PropsWithChildren } from "react";
import { SessionProvider } from "next-auth/react";

export const AuthProvider = ({ children }: PropsWithChildren<unknown>) => (
	<SessionProvider>{children}</SessionProvider>
);
