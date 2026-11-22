import { getServerSession as _getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export const getServerSession = async () => {
	const session = await _getServerSession(authOptions);
	return session;
};
