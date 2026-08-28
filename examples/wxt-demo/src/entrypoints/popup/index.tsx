import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { sendToBackground } from "webext-message";
import { useMessage, usePort } from "webext-message/hook";

interface MessageResult {
	success?: boolean;
	echoed?: string;
	status?: string;
	error?: string;
	data?: any;
}

const PopupApp: React.FC = () => {
	const [log, setLog] = useState<string[]>(["Popup initialized"]);
	const [loading, setLoading] = useState(false);
	const [portData, setPortData] = useState<any>(null);

	// Example: Use the useMessage hook to listen for messages
	const { data: messageData } = useMessage<
		{ type: string },
		{ response: string }
	>(async (request, response) => {
		addLog(`Message from background: ${request.name}`);
		response.send({ response: "acknowledged" });
	});

	// Example: Use the usePort hook for port communication
	const {
		data: portInfo,
		send: sendToPort,
		listen,
	} = usePort<any, any>("demo-port");

	const addLog = useCallback((msg: string) => {
		setLog((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
	}, []);

	const handleSimpleMessage = useCallback(async () => {
		setLoading(true);
		try {
			const response = await sendToBackground<
				{ text: string },
				{ success: boolean }
			>({
				name: "simple-message",
				body: { text: "Hello from popup!" },
			});

			addLog(`Simple message response: ${JSON.stringify(response)}`);
		} catch (error) {
			addLog(
				`Error: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setLoading(false);
		}
	}, [addLog]);

	const handleEchoMessage = useCallback(async () => {
		setLoading(true);
		try {
			const response = await sendToBackground<
				{ echo: string },
				{ echoed: string }
			>({
				name: "echo-message",
				body: { echo: "Test echo message" },
			});

			addLog(`Echo response: ${response.echoed}`);
		} catch (error) {
			addLog(
				`Error: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setLoading(false);
		}
	}, [addLog]);

	const handleProcessData = useCallback(async () => {
		setLoading(true);
		try {
			const response = await sendToBackground<any, MessageResult>({
				name: "process-data",
				body: { type: "fetch", payload: { query: "test" } },
			});

			addLog(`Process response: ${JSON.stringify(response.data)}`);
		} catch (error) {
			addLog(
				`Error: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setLoading(false);
		}
	}, [addLog]);

	const handleBroadcast = useCallback(async () => {
		setLoading(true);
		try {
			const response = await sendToBackground<
				{ message: string },
				{ broadcastId: string }
			>({
				name: "broadcast-message",
				body: { message: "Broadcast from popup" },
			});

			addLog(`Broadcast sent: ${response.broadcastId}`);
		} catch (error) {
			addLog(
				`Error: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		} finally {
			setLoading(false);
		}
	}, [addLog]);

	const handlePortMessage = useCallback(() => {
		sendToPort({ type: "ping", timestamp: Date.now() });
		addLog("Port message sent");
	}, [sendToPort, addLog]);

	const handlePortListen = useCallback(() => {
		const { port, disconnect } = listen((msg) => {
			setPortData(msg);
			addLog(`Port data received: ${JSON.stringify(msg)}`);
		});

		addLog("Listening on port");

		return () => {
			disconnect();
			addLog("Stopped listening on port");
		};
	}, [listen, addLog]);

	const handleClearLog = useCallback(() => {
		setLog([]);
	}, []);

	return (
		<div style={styles.container}>
			<header style={styles.header}>
				<h1 style={styles.title}>webext-message Demo</h1>
				<p style={styles.subtitle}>WXT Browser Extension Messaging Examples</p>
			</header>

			<main style={styles.main}>
				<section style={styles.section}>
					<h2 style={styles.sectionTitle}>Message Examples</h2>

					<div style={styles.buttonGroup}>
						<button
							style={styles.button}
							onClick={handleSimpleMessage}
							disabled={loading}
						>
							📤 Simple Message
						</button>

						<button
							style={styles.button}
							onClick={handleEchoMessage}
							disabled={loading}
						>
							🔊 Echo Message
						</button>

						<button
							style={styles.button}
							onClick={handleProcessData}
							disabled={loading}
						>
							⚙️ Process Data
						</button>

						<button
							style={styles.button}
							onClick={handleBroadcast}
							disabled={loading}
						>
							📢 Broadcast
						</button>
					</div>
				</section>

				<section style={styles.section}>
					<h2 style={styles.sectionTitle}>Port Communication</h2>

					<div style={styles.buttonGroup}>
						<button
							style={styles.button}
							onClick={handlePortMessage}
							disabled={loading}
						>
							📞 Send to Port
						</button>

						<button
							style={styles.button}
							onClick={handlePortListen}
							disabled={loading}
						>
							👂 Listen Port
						</button>
					</div>

					{portData && (
						<div style={styles.infoBox}>
							<strong>Port Data:</strong>
							<pre style={styles.pre}>{JSON.stringify(portData, null, 2)}</pre>
						</div>
					)}
				</section>

				<section style={styles.section}>
					<div style={styles.logHeader}>
						<h2 style={styles.sectionTitle}>Activity Log</h2>
						<button
							style={{
								...styles.button,
								padding: "4px 12px",
								fontSize: "12px",
							}}
							onClick={handleClearLog}
						>
							Clear
						</button>
					</div>

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
		height: "100vh",
		backgroundColor: "#f5f5f5",
		color: "#333",
	},
	header: {
		background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
		color: "white",
		padding: "20px",
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
		overflowY: "auto",
		padding: "20px",
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
	buttonGroup: {
		display: "grid",
		gridTemplateColumns: "repeat(2, 1fr)",
		gap: "8px",
	},
	button: {
		padding: "10px 16px",
		backgroundColor: "#667eea",
		color: "white",
		border: "none",
		borderRadius: "6px",
		cursor: "pointer",
		fontSize: "14px",
		fontWeight: "500",
		transition: "all 0.2s",
	},
	logHeader: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: "12px",
	},
	logContainer: {
		backgroundColor: "#f8f8f8",
		border: "1px solid #e0e0e0",
		borderRadius: "4px",
		padding: "12px",
		height: "200px",
		overflowY: "auto",
		fontFamily: "monospace",
		fontSize: "12px",
	},
	logEntry: {
		padding: "4px 0",
		borderBottom: "1px solid #f0f0f0",
	},
	infoBox: {
		backgroundColor: "#f0f4ff",
		border: "1px solid #c5d3ff",
		borderRadius: "4px",
		padding: "12px",
		marginTop: "12px",
	},
	pre: {
		margin: "8px 0 0 0",
		backgroundColor: "#fff",
		padding: "8px",
		borderRadius: "4px",
		overflowX: "auto",
		fontSize: "11px",
	},
};

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<PopupApp />);
