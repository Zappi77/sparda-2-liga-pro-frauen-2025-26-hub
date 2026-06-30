<?php
/**
 * Plugin Name: Knud – Security Headers für den Liga-Hub
 * Description: Setzt Sicherheitsheader ausschließlich für /sparda-2-liga-pro-frauen-2025-26/.
 * Version: 1.0.0
 */

defined( 'ABSPATH' ) || exit;

/**
 * Fügt Sicherheitsheader nur für den Liga-Hub hinzu.
 *
 * Die CSP startet als Report-Only, damit mögliche Konflikte mit WordPress,
 * dem Theme oder Plugins zunächst in der Browser-Konsole sichtbar werden,
 * ohne die Seite zu blockieren.
 */
function knud_liga_hub_security_headers( $headers, $wp ) {
	$request_path = isset( $wp->request ) ? trim( (string) $wp->request, '/' ) : '';

	if ( 'sparda-2-liga-pro-frauen-2025-26' !== $request_path ) {
		return $headers;
	}

	$headers['X-Content-Type-Options'] = 'nosniff';
	$headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
	$headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()';
	$headers['X-Frame-Options'] = 'SAMEORIGIN';
	$headers['Strict-Transport-Security'] = 'max-age=31536000';
	$headers['Content-Security-Policy-Report-Only'] = implode(
		'; ',
		array(
			"default-src 'self'",
			"base-uri 'self'",
			"object-src 'none'",
			"frame-ancestors 'self'",
			"script-src 'self'",
			"style-src 'self'",
			"img-src 'self' data:",
			"font-src 'self'",
			"connect-src 'self'",
			"form-action 'self'",
			'upgrade-insecure-requests',
		)
	);

	return $headers;
}
add_filter( 'wp_headers', 'knud_liga_hub_security_headers', 10, 2 );
