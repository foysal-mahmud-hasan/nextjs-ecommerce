import "next-auth";

declare module "next-auth" {
	interface Session {
		license?: string;
		activeKey?: string;
	}

	interface User {
		license: string;
		activeKey: string;
	}

	interface JWT {
		license?: string;
		activeKey?: string;
	}
}
