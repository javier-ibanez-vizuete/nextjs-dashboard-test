import "@/app/ui/global.css";
import { inter } from "./ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: {
		template: "%s | Acme Dashboard",
		default: "Acme Dashboard",
	},
	description: "The Official Next.js Course Dashboard, built with App Router",
	metadataBase: new URL("https://nextjs-dashboard-test-beta-ecru.vercel.app/"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			{/* <head>
				<title>Page Title</title>
				<meta name="description" content="A brief Description of the page content" />
				<meta name="keywords" content="keyword1, keyword2, keyword3" />

				<meta property="og:title" content="Title Here" />
				<meta property="og:description" content="Description Here" />
				<meta property="og:image" content="image_url_here" />
				<meta property="og:url" content="webpage_url_here" />
				<meta property="og:site-name" content="Site Name Here" />
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
			</head> */}
			<body className={`${inter.className} antialiased`}>{children}</body>
		</html>
	);
}
