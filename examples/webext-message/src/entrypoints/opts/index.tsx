import type React from "react";
import { useCallback, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { sendToBackground } from "webext-message";
import { useMessage } from "webext-message/hook";

interface Notification {
	message: string;
	timestamp: number;
}

const OptionsApp: React.FC = () => {
	const [log, setLog] = useState<string[]>(["Options page initialized"]);
	const [notification, setNotification] = useState<Notification | null>(null);

	const addLog = useCallback((msg: string) => {
		setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
	}, []);

	// Live updates: if the options page happens to already be open when the
	// content script's "Notify Options + Popup" button fires, this hook
	// picks up the broadcast() the background sends alongside opening us.
	useMessage<{ type: string; message?: string }, { response: string }>(
		async (request, response) => {
			if (request.body?.message) {
				setNotification({
					message: request.body.message,
					timestamp: Date.now(),
				});
				addLog(`Broadcast received: ${request.body.message}`);
			}
			response.send({ response: "acknowledged" });
		},
	);

	// Options pages aren't tabs, so a content script can't message this page
	// directly — on mount we just ask the background for whatever it has
	// stashed (set by the "open-and-notify" flow).
	useEffect(() => {
		(async () => {
			try {
				const latest = await sendToBackground<
					{ target: "options" | "popup" },
					Notification | null
				>({ name: "get-latest-notification", body: { target: "options" } });

				if (latest) {
					setNotification(latest);
					addLog(`Loaded pending notification: ${latest.message}`);
				}
			} catch (error) {
				addLog(
					`Error loading notification: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			}
		})();
	}, [addLog]);

	return (
		<div style={styles.container}>
			<header style={styles.header}>
				<h1 style={styles.title}>webext-message Demo — Options</h1>
				<p style={styles.subtitle}>
					Opened via <code>browser.runtime.openOptionsPage()</code>, triggered
					from the content script's "Notify Options + Popup" button.
				</p>
			</header>

			<main style={styles.main}>
				<section style={styles.section}>
					<h2 style={styles.sectionTitle}>Latest Notification</h2>
					{notification ? (
						<div style={styles.infoBox}>
							<strong>{notification.message}</strong>
							<div style={styles.timestamp}>
								{new Date(notification.timestamp).toLocaleTimeString()}
							</div>
						</div>
					) : (
						<p style={styles.muted}>
							No notification yet — click "Notify Options + Popup" on a page
							matching the content script.
						</p>
					)}
				</section>

				<section style={styles.section}>
					<h2 style={styles.sectionTitle}>Activity Log</h2>
					<div style={styles.logContainer}>
						{log.map((entry, idx) => (
							<div key={idx} style={styles.logEntry}>
								{entry}
							</div>
						))}
					</div>
				</section>
			</main>
		</div>
	);
};

const styles: Record<string, React.CSSProperties> = {
	container: {
		display: "flex",
		flexDirection: "column",
		minHeight: "100vh",
		color: "#333",
	},
	header: {
		background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		color: "white",
		padding: "24px",
		boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
	},
	title: {
		fontSize: "24px",
		fontWeight: "bold",
		margin: "0 0 8px 0",
	},
	subtitle: {
		fontSize: "14px",
		opacity: 0.9,
		margin: 0,
	},
	main: {
		flex: 1,
		padding: "24px",
		maxWidth: "640px",
	},
	section: {
		marginBottom: "20px",
		backgroundColor: "white",
		borderRadius: "8px",
		padding: "16px",
		boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
	},
	sectionTitle: {
		fontSize: "16px",
		fontWeight: "bold",
		marginBottom: "12px",
		color: "#667eea",
	},
	infoBox: {
		backgroundColor: "#f0f4ff",
		border: "1px solid #c5d3ff",
		borderRadius: "4px",
		padding: "12px",
	},
	timestamp: {
		fontSize: "12px",
		color: "#666",
		marginTop: "4px",
	},
	muted: {
		fontSize: "13px",
		color: "#888",
	},
	logContainer: {
		backgroundColor: "#f8f8f8",
		border: "1px solid #e0e0e0",
		borderRadius: "4px",
		padding: "12px",
		height: "160px",
		overflowY: "auto",
		fontFamily: "monospace",
		fontSize: "12px",
	},
	logEntry: {
		padding: "4px 0",
		borderBottom: "1px solid #f0f0f0",
	},
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<OptionsApp />);
