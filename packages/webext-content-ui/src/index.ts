export type {
	AnchorInput,
	InjectOptions,
	Injector,
	InjectPosition,
	MountContext,
	MountedInstance,
	MountResult,
} from "./types";

export { resolveAnchors, watchForAnchors } from "./anchor";
export { createIframeUi, createIntegratedUi, createShadowUi } from "./injector";
export {
	applyStyles,
	clearSharedStyleRegistry,
	sharedStyleRegistrySize,
	supportsConstructibleStylesheets,
} from "./shared-styles";
