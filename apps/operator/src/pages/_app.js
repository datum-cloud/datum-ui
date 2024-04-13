import { SessionProvider } from "next-auth/react"
import { useRouter } from "next/router"
import { useEffect } from "react"
import posthog from "posthog-js"
import { PostHogProvider } from 'posthog-js/react'
import PropTypes from 'prop-types';

// Check that PostHog is client-side
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',

	})
  
}

export default function App(
	{ Component, pageProps: { session, ...pageProps } }
) {
	const router = useRouter()
	useEffect(() => {
		// Track page views
		const handleRouteChange = () => posthog.capture('$pageview')
		// Track page views on route change
		router.events.on('routeChangeComplete', handleRouteChange)
			return () => {
				router.events.off('routeChangeComplete', handleRouteChange)
			}
		}, [])
		
	return (
		<PostHogProvider client={posthog}>
			<SessionProvider session={session}>
				<Component {...pageProps} />
			</SessionProvider>
		</PostHogProvider>
	)
}

App.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.shape({
		session: PropTypes.object.isRequired,
	}).isRequired,
};
