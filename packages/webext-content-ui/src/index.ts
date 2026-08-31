export type {
	AnchorInput,
	ContentUi,
	ContentUiOptions,
	ContentUiPosition,
	MountContext,
	MountedInstance,
	MountResult,
} from "./types";

export { resolveAnchors, watchForAnchors } from "./anchor";
export {
	createIframeUi,
	createIntegratedUi,
	createShadowRootUi,
} from "./injector";
export {
	applyStyles,
	clearSharedStyleRegistry,
	sharedStyleRegistrySize,
	supportsConstructibleStylesheets,
} from "./shared-styles";
