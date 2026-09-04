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
export { addStyleToDom, removeStyleFromDom } from "./dom-style";
export type { StyleHandle } from "./dom-style";
export {
	createIframeUi,
	createIntegratedUi,
	createShadowRootUi,
} from "./injector";
export { onLocationChange } from "./location-watcher";
export type {
	LocationChangeDetail,
	LocationChangeListener,
} from "./location-watcher";
export { matchesAnyPattern, matchesPattern } from "./match-pattern";
export {
	applyStyles,
	clearSharedStyleRegistry,
	getSharedCssText,
	sharedStyleRegistrySize,
	supportsConstructibleStylesheets,
} from "./shared-styles";
