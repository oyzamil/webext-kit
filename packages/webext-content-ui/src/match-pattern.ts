/**
 * WebExtension-style URL match patterns, e.g.
 * "*://*.aliexpress.com/p/order/index.html*" or "<all_urls>".
 *
 * Grammar (simplified, matches the extension manifest spec):
 *   <scheme>://<host><path>
 *   scheme: "*" (http/https only) | exact scheme
 *   host:   "*" (any host) | "*.example.com" (example.com + any subdomain) | exact host
 *   path:   "/" followed by anything; "*" wildcards match any run of chars (incl. none)
 */

const PATTERN_RE = /^(\*|[a-z][a-z0-9+.-]*):\/\/(\*|(?:\*\.)?[^/*]+)(\/.*)$/i;

/**
 * Escape regex metacharacters so a literal string can be embedded in a RegExp source.
 * @param s - Raw string
 * @returns Escaped string, safe to splice into a `new RegExp(...)` template
 */
function escapeRegExp(s: string): string {
	return s.replace(/[.+^${}()|[\]\\]/g, "\\$&");
}

/** Cache compiled patterns — call sites (mountAll, location-change checks) re-test on every navigation. */
const compiledCache = new Map<string, RegExp | null>();

/**
 * Compile a match pattern into a RegExp, memoized. `null` means the pattern didn't parse
 * (malformed match pattern) — callers treat that as "never matches" rather than throwing,
 * since a bad pattern in `matches` shouldn't crash mounting.
 * @param pattern - WebExtension match pattern, or `"<all_urls>"`
 * @returns Compiled RegExp, or null if the pattern is malformed
 */
function compilePattern(pattern: string): RegExp | null {
	if (compiledCache.has(pattern)) return compiledCache.get(pattern)!;

	let re: RegExp | null;
	if (pattern === "<all_urls>") {
		re = /^(https?|file|ftp):\/\/.*$/i;
	} else {
		const match = PATTERN_RE.exec(pattern);
		if (!match) {
			re = null;
		} else {
			const scheme = match[1]!;
			const host = match[2]!;
			const path = match[3]!;
			const schemePart = scheme === "*" ? "https?" : escapeRegExp(scheme);
			let hostPart: string;
			if (host === "*") {
				hostPart = "[^/]*";
			} else if (host.startsWith("*.")) {
				hostPart = `(?:[^/]*\\.)?${escapeRegExp(host.slice(2))}`;
			} else {
				hostPart = escapeRegExp(host);
			}
			const pathPart = path.split("*").map(escapeRegExp).join(".*");
			re = new RegExp(`^${schemePart}://${hostPart}${pathPart}$`);
		}
	}
	compiledCache.set(pattern, re);
	return re;
}

/**
 * Test a URL against a single match pattern.
 * @param url - URL to test (typically `location.href`)
 * @param pattern - WebExtension match pattern
 */
export function matchesPattern(url: string, pattern: string): boolean {
	const re = compilePattern(pattern);
	return re !== null && re.test(url);
}

/**
 * Test a URL against a list of match patterns (OR semantics — same as manifest `matches`).
 * Empty/undefined list means "no restriction" — caller decides that default, this returns
 * false for an empty array so callers must opt in explicitly.
 * @param url - URL to test
 * @param patterns - WebExtension match patterns
 */
export function matchesAnyPattern(url: string, patterns: string[]): boolean {
	return patterns.some((p) => matchesPattern(url, p));
}
