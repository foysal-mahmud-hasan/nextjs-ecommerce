import { setVendor } from "@/app/actions";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				license: { label: "License", type: "text" },
				activeKey: { label: "Active Key", type: "password" },
			},
			// @ts-expect-error: credentials type is not defined
			async authorize(credentials: { license: string; activeKey: string } | undefined) {
				try {
					const { license, activeKey } = credentials || {};

					if (!license || !activeKey) {
						throw new Error("license or active key not found");
					}

					const userInfo = await setVendor(license, activeKey);
					if (userInfo !== "Unauthorized access.") {
						const data = {
							name: userInfo.setup?.name,
							mobile: userInfo.setup?.mobile,
							email: userInfo.setup?.email,
						};
						return { ...data, license, activeKey };
					}

					throw new Error("Invalid license or active key");
				} catch (err: any) {
					throw new Error(err);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.license = user.license;
				token.activeKey = user.activeKey;
				token.user = {
					name: user.name as string,
					// @ts-expect-error: mobile is not defined on the user object
					mobile: user.mobile as string,
					email: user.email as string,
				};
			}
			return token;
		},

		async session({ session, token }) {
			session.user = token.user as { name?: string | null; email?: string | null };
			session.license = token.license as string;
			session.activeKey = token.activeKey as string;
			return session;
		},
	},
	theme: {
		colorScheme: "auto",
		brandColor: "#202e38",
		logo: "https://cdn-icons-png.flaticon.com/512/12440/12440960.png",
		buttonText: "",
	},
};
