import ReactDOM from "react-dom/client";
import "@/assets/tailwind.css";
import { SharedPanel } from "@/components/SharedPanel";

function App() {
	return (
		<div className="w-72 space-y-2 p-3">
			<h1 className="font-bold text-base text-brand-600">Popup</h1>
			<SharedPanel label="popup" />
		</div>
	);
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
