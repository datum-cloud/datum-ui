import Providers from './providers'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}): JSX.Element {
	return (
		<body>
			<Providers>{children}</Providers>
		</body>
	)
}
