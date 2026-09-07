var background = (function() {
	//#region \0rolldown/runtime.js
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/utils/define-background.mjs
	function defineBackground(arg) {
		if (arg == null || typeof arg === "function") return { main: arg };
		return arg;
	}
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/browser.mjs
	/**
	* Contains the `browser` export which you should use to access the extension
	* APIs in your project:
	*
	* ```ts
	* import { browser } from 'wxt/browser';
	*
	* browser.runtime.onInstalled.addListener(() => {
	*   // ...
	* });
	* ```
	*
	* @module wxt/browser
	*/
	var browser$1 = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
	//#endregion
	//#region ../../node_modules/.bun/react@19.2.8/node_modules/react/cjs/react.development.js
	/**
	* @license React
	* react.development.js
	*
	* Copyright (c) Meta Platforms, Inc. and affiliates.
	*
	* This source code is licensed under the MIT license found in the
	* LICENSE file in the root directory of this source tree.
	*/
	var require_react_development = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		(function() {
			function defineDeprecationWarning(methodName, info) {
				Object.defineProperty(Component.prototype, methodName, { get: function() {
					console.warn("%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
				} });
			}
			function getIteratorFn(maybeIterable) {
				if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
				maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
				return "function" === typeof maybeIterable ? maybeIterable : null;
			}
			function warnNoop(publicInstance, callerName) {
				publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
				var warningKey = publicInstance + "." + callerName;
				didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, publicInstance), didWarnStateUpdateForUnmountedComponent[warningKey] = !0);
			}
			function Component(props, context, updater) {
				this.props = props;
				this.context = context;
				this.refs = emptyObject;
				this.updater = updater || ReactNoopUpdateQueue;
			}
			function ComponentDummy() {}
			function PureComponent(props, context, updater) {
				this.props = props;
				this.context = context;
				this.refs = emptyObject;
				this.updater = updater || ReactNoopUpdateQueue;
			}
			function noop() {}
			function testStringCoercion(value) {
				return "" + value;
			}
			function checkKeyStringCoercion(value) {
				try {
					testStringCoercion(value);
					var JSCompiler_inline_result = !1;
				} catch (e) {
					JSCompiler_inline_result = !0;
				}
				if (JSCompiler_inline_result) {
					JSCompiler_inline_result = console;
					var JSCompiler_temp_const = JSCompiler_inline_result.error;
					var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
					JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
					return testStringCoercion(value);
				}
			}
			function getComponentNameFromType(type) {
				if (null == type) return null;
				if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
				if ("string" === typeof type) return type;
				switch (type) {
					case REACT_FRAGMENT_TYPE: return "Fragment";
					case REACT_PROFILER_TYPE: return "Profiler";
					case REACT_STRICT_MODE_TYPE: return "StrictMode";
					case REACT_SUSPENSE_TYPE: return "Suspense";
					case REACT_SUSPENSE_LIST_TYPE: return "SuspenseList";
					case REACT_ACTIVITY_TYPE: return "Activity";
				}
				if ("object" === typeof type) switch ("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof) {
					case REACT_PORTAL_TYPE: return "Portal";
					case REACT_CONTEXT_TYPE: return type.displayName || "Context";
					case REACT_CONSUMER_TYPE: return (type._context.displayName || "Context") + ".Consumer";
					case REACT_FORWARD_REF_TYPE:
						var innerType = type.render;
						type = type.displayName;
						type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
						return type;
					case REACT_MEMO_TYPE: return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
					case REACT_LAZY_TYPE:
						innerType = type._payload;
						type = type._init;
						try {
							return getComponentNameFromType(type(innerType));
						} catch (x) {}
				}
				return null;
			}
			function getTaskName(type) {
				if (type === REACT_FRAGMENT_TYPE) return "<>";
				if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
				try {
					var name = getComponentNameFromType(type);
					return name ? "<" + name + ">" : "<...>";
				} catch (x) {
					return "<...>";
				}
			}
			function getOwner() {
				var dispatcher = ReactSharedInternals.A;
				return null === dispatcher ? null : dispatcher.getOwner();
			}
			function UnknownOwner() {
				return Error("react-stack-top-frame");
			}
			function hasValidKey(config) {
				if (hasOwnProperty.call(config, "key")) {
					var getter = Object.getOwnPropertyDescriptor(config, "key").get;
					if (getter && getter.isReactWarning) return !1;
				}
				return void 0 !== config.key;
			}
			function defineKeyPropWarningGetter(props, displayName) {
				function warnAboutAccessingKey() {
					specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
				}
				warnAboutAccessingKey.isReactWarning = !0;
				Object.defineProperty(props, "key", {
					get: warnAboutAccessingKey,
					configurable: !0
				});
			}
			function elementRefGetterWithDeprecationWarning() {
				var componentName = getComponentNameFromType(this.type);
				didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
				componentName = this.props.ref;
				return void 0 !== componentName ? componentName : null;
			}
			function ReactElement(type, key, props, owner, debugStack, debugTask) {
				var refProp = props.ref;
				type = {
					$$typeof: REACT_ELEMENT_TYPE,
					type,
					key,
					props,
					_owner: owner
				};
				null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
					enumerable: !1,
					get: elementRefGetterWithDeprecationWarning
				}) : Object.defineProperty(type, "ref", {
					enumerable: !1,
					value: null
				});
				type._store = {};
				Object.defineProperty(type._store, "validated", {
					configurable: !1,
					enumerable: !1,
					writable: !0,
					value: 0
				});
				Object.defineProperty(type, "_debugInfo", {
					configurable: !1,
					enumerable: !1,
					writable: !0,
					value: null
				});
				Object.defineProperty(type, "_debugStack", {
					configurable: !1,
					enumerable: !1,
					writable: !0,
					value: debugStack
				});
				Object.defineProperty(type, "_debugTask", {
					configurable: !1,
					enumerable: !1,
					writable: !0,
					value: debugTask
				});
				Object.freeze && (Object.freeze(type.props), Object.freeze(type));
				return type;
			}
			function cloneAndReplaceKey(oldElement, newKey) {
				newKey = ReactElement(oldElement.type, newKey, oldElement.props, oldElement._owner, oldElement._debugStack, oldElement._debugTask);
				oldElement._store && (newKey._store.validated = oldElement._store.validated);
				return newKey;
			}
			function validateChildKeys(node) {
				isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
			}
			function isValidElement(object) {
				return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
			}
			function escape(key) {
				var escaperLookup = {
					"=": "=0",
					":": "=2"
				};
				return "$" + key.replace(/[=:]/g, function(match) {
					return escaperLookup[match];
				});
			}
			function getElementKey(element, index) {
				return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
			}
			function resolveThenable(thenable) {
				switch (thenable.status) {
					case "fulfilled": return thenable.value;
					case "rejected": throw thenable.reason;
					default: switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
						"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
					}, function(error) {
						"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
					})), thenable.status) {
						case "fulfilled": return thenable.value;
						case "rejected": throw thenable.reason;
					}
				}
				throw thenable;
			}
			function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
				var type = typeof children;
				if ("undefined" === type || "boolean" === type) children = null;
				var invokeCallback = !1;
				if (null === children) invokeCallback = !0;
				else switch (type) {
					case "bigint":
					case "string":
					case "number":
						invokeCallback = !0;
						break;
					case "object": switch (children.$$typeof) {
						case REACT_ELEMENT_TYPE:
						case REACT_PORTAL_TYPE:
							invokeCallback = !0;
							break;
						case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
					}
				}
				if (invokeCallback) {
					invokeCallback = children;
					callback = callback(invokeCallback);
					var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
					isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
						return c;
					})) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + childKey), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
					return 1;
				}
				invokeCallback = 0;
				childKey = "" === nameSoFar ? "." : nameSoFar + ":";
				if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
				else if (i = getIteratorFn(children), "function" === typeof i) for (i === children.entries && (didWarnAboutMaps || console.warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead."), didWarnAboutMaps = !0), children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
				else if ("object" === type) {
					if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
					array = String(children);
					throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
				}
				return invokeCallback;
			}
			function mapChildren(children, func, context) {
				if (null == children) return children;
				var result = [], count = 0;
				mapIntoArray(children, result, "", "", function(child) {
					return func.call(context, child, count++);
				});
				return result;
			}
			function lazyInitializer(payload) {
				if (-1 === payload._status) {
					var ioInfo = payload._ioInfo;
					null != ioInfo && (ioInfo.start = ioInfo.end = performance.now());
					ioInfo = payload._result;
					var thenable = ioInfo();
					thenable.then(function(moduleObject) {
						if (0 === payload._status || -1 === payload._status) {
							payload._status = 1;
							payload._result = moduleObject;
							var _ioInfo = payload._ioInfo;
							null != _ioInfo && (_ioInfo.end = performance.now());
							void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
						}
					}, function(error) {
						if (0 === payload._status || -1 === payload._status) {
							payload._status = 2;
							payload._result = error;
							var _ioInfo2 = payload._ioInfo;
							null != _ioInfo2 && (_ioInfo2.end = performance.now());
							void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
						}
					});
					ioInfo = payload._ioInfo;
					if (null != ioInfo) {
						ioInfo.value = thenable;
						var displayName = thenable.displayName;
						"string" === typeof displayName && (ioInfo.name = displayName);
					}
					-1 === payload._status && (payload._status = 0, payload._result = thenable);
				}
				if (1 === payload._status) return ioInfo = payload._result, void 0 === ioInfo && console.error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?", ioInfo), "default" in ioInfo || console.error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", ioInfo), ioInfo.default;
				throw payload._result;
			}
			function resolveDispatcher() {
				var dispatcher = ReactSharedInternals.H;
				null === dispatcher && console.error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem.");
				return dispatcher;
			}
			function releaseAsyncTransition() {
				ReactSharedInternals.asyncTransitions--;
			}
			function enqueueTask(task) {
				if (null === enqueueTaskImpl) try {
					var requireString = ("require" + Math.random()).slice(0, 7);
					enqueueTaskImpl = (module && module[requireString]).call(module, "timers").setImmediate;
				} catch (_err) {
					enqueueTaskImpl = function(callback) {
						!1 === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = !0, "undefined" === typeof MessageChannel && console.error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."));
						var channel = new MessageChannel();
						channel.port1.onmessage = callback;
						channel.port2.postMessage(void 0);
					};
				}
				return enqueueTaskImpl(task);
			}
			function aggregateErrors(errors) {
				return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
			}
			function popActScope(prevActQueue, prevActScopeDepth) {
				prevActScopeDepth !== actScopeDepth - 1 && console.error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. ");
				actScopeDepth = prevActScopeDepth;
			}
			function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
				var queue = ReactSharedInternals.actQueue;
				if (null !== queue) if (0 !== queue.length) try {
					flushActQueue(queue);
					enqueueTask(function() {
						return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
					});
					return;
				} catch (error) {
					ReactSharedInternals.thrownErrors.push(error);
				}
				else ReactSharedInternals.actQueue = null;
				0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
			}
			function flushActQueue(queue) {
				if (!isFlushing) {
					isFlushing = !0;
					var i = 0;
					try {
						for (; i < queue.length; i++) {
							var callback = queue[i];
							do {
								ReactSharedInternals.didUsePromise = !1;
								var continuation = callback(!1);
								if (null !== continuation) {
									if (ReactSharedInternals.didUsePromise) {
										queue[i] = callback;
										queue.splice(0, i);
										return;
									}
									callback = continuation;
								} else break;
							} while (1);
						}
						queue.length = 0;
					} catch (error) {
						queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
					} finally {
						isFlushing = !1;
					}
				}
			}
			"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
			var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
				isMounted: function() {
					return !1;
				},
				enqueueForceUpdate: function(publicInstance) {
					warnNoop(publicInstance, "forceUpdate");
				},
				enqueueReplaceState: function(publicInstance) {
					warnNoop(publicInstance, "replaceState");
				},
				enqueueSetState: function(publicInstance) {
					warnNoop(publicInstance, "setState");
				}
			}, assign = Object.assign, emptyObject = {};
			Object.freeze(emptyObject);
			Component.prototype.isReactComponent = {};
			Component.prototype.setState = function(partialState, callback) {
				if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
				this.updater.enqueueSetState(this, partialState, callback, "setState");
			};
			Component.prototype.forceUpdate = function(callback) {
				this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
			};
			var deprecatedAPIs = {
				isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
				replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
			};
			for (fnName in deprecatedAPIs) deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
			ComponentDummy.prototype = Component.prototype;
			deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
			deprecatedAPIs.constructor = PureComponent;
			assign(deprecatedAPIs, Component.prototype);
			deprecatedAPIs.isPureReactComponent = !0;
			var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = {
				H: null,
				A: null,
				T: null,
				S: null,
				actQueue: null,
				asyncTransitions: 0,
				isBatchingLegacy: !1,
				didScheduleLegacyUpdate: !1,
				didUsePromise: !1,
				thrownErrors: [],
				getCurrentStack: null,
				recentlyCreatedOwnerStacks: 0
			}, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
				return null;
			};
			deprecatedAPIs = { react_stack_bottom_frame: function(callStackForError) {
				return callStackForError();
			} };
			var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
			var didWarnAboutElementRef = {};
			var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(deprecatedAPIs, UnknownOwner)();
			var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
			var didWarnAboutMaps = !1, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
				if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
					var event = new window.ErrorEvent("error", {
						bubbles: !0,
						cancelable: !0,
						message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
						error
					});
					if (!window.dispatchEvent(event)) return;
				} else if ("object" === typeof process && "function" === typeof process.emit) {
					process.emit("uncaughtException", error);
					return;
				}
				console.error(error);
			}, didWarnAboutMessageChannel = !1, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = !1, isFlushing = !1, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
				queueMicrotask(function() {
					return queueMicrotask(callback);
				});
			} : enqueueTask;
			deprecatedAPIs = Object.freeze({
				__proto__: null,
				c: function(size) {
					return resolveDispatcher().useMemoCache(size);
				}
			});
			var fnName = {
				map: mapChildren,
				forEach: function(children, forEachFunc, forEachContext) {
					mapChildren(children, function() {
						forEachFunc.apply(this, arguments);
					}, forEachContext);
				},
				count: function(children) {
					var n = 0;
					mapChildren(children, function() {
						n++;
					});
					return n;
				},
				toArray: function(children) {
					return mapChildren(children, function(child) {
						return child;
					}) || [];
				},
				only: function(children) {
					if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
					return children;
				}
			};
			exports.Activity = REACT_ACTIVITY_TYPE;
			exports.Children = fnName;
			exports.Component = Component;
			exports.Fragment = REACT_FRAGMENT_TYPE;
			exports.Profiler = REACT_PROFILER_TYPE;
			exports.PureComponent = PureComponent;
			exports.StrictMode = REACT_STRICT_MODE_TYPE;
			exports.Suspense = REACT_SUSPENSE_TYPE;
			exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
			exports.__COMPILER_RUNTIME = deprecatedAPIs;
			exports.act = function(callback) {
				var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
				actScopeDepth++;
				var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = !1;
				try {
					var result = callback();
				} catch (error) {
					ReactSharedInternals.thrownErrors.push(error);
				}
				if (0 < ReactSharedInternals.thrownErrors.length) throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
				if (null !== result && "object" === typeof result && "function" === typeof result.then) {
					var thenable = result;
					queueSeveralMicrotasks(function() {
						didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = !0, console.error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"));
					});
					return { then: function(resolve, reject) {
						didAwaitActCall = !0;
						thenable.then(function(returnValue) {
							popActScope(prevActQueue, prevActScopeDepth);
							if (0 === prevActScopeDepth) {
								try {
									flushActQueue(queue), enqueueTask(function() {
										return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
									});
								} catch (error$0) {
									ReactSharedInternals.thrownErrors.push(error$0);
								}
								if (0 < ReactSharedInternals.thrownErrors.length) {
									var _thrownError = aggregateErrors(ReactSharedInternals.thrownErrors);
									ReactSharedInternals.thrownErrors.length = 0;
									reject(_thrownError);
								}
							} else resolve(returnValue);
						}, function(error) {
							popActScope(prevActQueue, prevActScopeDepth);
							0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
						});
					} };
				}
				var returnValue$jscomp$0 = result;
				popActScope(prevActQueue, prevActScopeDepth);
				0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
					didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = !0, console.error("A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"));
				}), ReactSharedInternals.actQueue = null);
				if (0 < ReactSharedInternals.thrownErrors.length) throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
				return { then: function(resolve, reject) {
					didAwaitActCall = !0;
					0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
						return recursivelyFlushAsyncActWork(returnValue$jscomp$0, resolve, reject);
					})) : resolve(returnValue$jscomp$0);
				} };
			};
			exports.cache = function(fn) {
				return function() {
					return fn.apply(null, arguments);
				};
			};
			exports.cacheSignal = function() {
				return null;
			};
			exports.captureOwnerStack = function() {
				var getCurrentStack = ReactSharedInternals.getCurrentStack;
				return null === getCurrentStack ? null : getCurrentStack();
			};
			exports.cloneElement = function(element, config, children) {
				if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
				var props = assign({}, element.props), key = element.key, owner = element._owner;
				if (null != config) {
					var JSCompiler_inline_result;
					a: {
						if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(config, "ref").get) && JSCompiler_inline_result.isReactWarning) {
							JSCompiler_inline_result = !1;
							break a;
						}
						JSCompiler_inline_result = void 0 !== config.ref;
					}
					JSCompiler_inline_result && (owner = getOwner());
					hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
					for (propName in config) !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
				}
				var propName = arguments.length - 2;
				if (1 === propName) props.children = children;
				else if (1 < propName) {
					JSCompiler_inline_result = Array(propName);
					for (var i = 0; i < propName; i++) JSCompiler_inline_result[i] = arguments[i + 2];
					props.children = JSCompiler_inline_result;
				}
				props = ReactElement(element.type, key, props, owner, element._debugStack, element._debugTask);
				for (key = 2; key < arguments.length; key++) validateChildKeys(arguments[key]);
				return props;
			};
			exports.createContext = function(defaultValue) {
				defaultValue = {
					$$typeof: REACT_CONTEXT_TYPE,
					_currentValue: defaultValue,
					_currentValue2: defaultValue,
					_threadCount: 0,
					Provider: null,
					Consumer: null
				};
				defaultValue.Provider = defaultValue;
				defaultValue.Consumer = {
					$$typeof: REACT_CONSUMER_TYPE,
					_context: defaultValue
				};
				defaultValue._currentRenderer = null;
				defaultValue._currentRenderer2 = null;
				return defaultValue;
			};
			exports.createElement = function(type, config, children) {
				for (var i = 2; i < arguments.length; i++) validateChildKeys(arguments[i]);
				i = {};
				var key = null;
				if (null != config) for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = !0, console.warn("Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform")), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
				var childrenLength = arguments.length - 2;
				if (1 === childrenLength) i.children = children;
				else if (1 < childrenLength) {
					for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++) childArray[_i] = arguments[_i + 2];
					Object.freeze && Object.freeze(childArray);
					i.children = childArray;
				}
				if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === i[propName] && (i[propName] = childrenLength[propName]);
				key && defineKeyPropWarningGetter(i, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
				var propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
				return ReactElement(type, key, i, getOwner(), propName ? Error("react-stack-top-frame") : unknownOwnerDebugStack, propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
			};
			exports.createRef = function() {
				var refObject = { current: null };
				Object.seal(refObject);
				return refObject;
			};
			exports.forwardRef = function(render) {
				null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).") : "function" !== typeof render ? console.error("forwardRef requires a render function but was given %s.", null === render ? "null" : typeof render) : 0 !== render.length && 2 !== render.length && console.error("forwardRef render functions accept exactly two parameters: props and ref. %s", 1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.");
				null != render && null != render.defaultProps && console.error("forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?");
				var elementType = {
					$$typeof: REACT_FORWARD_REF_TYPE,
					render
				}, ownName;
				Object.defineProperty(elementType, "displayName", {
					enumerable: !1,
					configurable: !0,
					get: function() {
						return ownName;
					},
					set: function(name) {
						ownName = name;
						render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
					}
				});
				return elementType;
			};
			exports.isValidElement = isValidElement;
			exports.lazy = function(ctor) {
				ctor = {
					_status: -1,
					_result: ctor
				};
				var lazyType = {
					$$typeof: REACT_LAZY_TYPE,
					_payload: ctor,
					_init: lazyInitializer
				}, ioInfo = {
					name: "lazy",
					start: -1,
					end: -1,
					value: null,
					owner: null,
					debugStack: Error("react-stack-top-frame"),
					debugTask: console.createTask ? console.createTask("lazy()") : null
				};
				ctor._ioInfo = ioInfo;
				lazyType._debugInfo = [{ awaited: ioInfo }];
				return lazyType;
			};
			exports.memo = function(type, compare) {
				type ?? console.error("memo: The first argument must be a component. Instead received: %s", null === type ? "null" : typeof type);
				compare = {
					$$typeof: REACT_MEMO_TYPE,
					type,
					compare: void 0 === compare ? null : compare
				};
				var ownName;
				Object.defineProperty(compare, "displayName", {
					enumerable: !1,
					configurable: !0,
					get: function() {
						return ownName;
					},
					set: function(name) {
						ownName = name;
						type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
					}
				});
				return compare;
			};
			exports.startTransition = function(scope) {
				var prevTransition = ReactSharedInternals.T, currentTransition = {};
				currentTransition._updatedFibers = /* @__PURE__ */ new Set();
				ReactSharedInternals.T = currentTransition;
				try {
					var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
					null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
					"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
				} catch (error) {
					reportGlobalError(error);
				} finally {
					null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.")), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error("We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
				}
			};
			exports.unstable_useCacheRefresh = function() {
				return resolveDispatcher().useCacheRefresh();
			};
			exports.use = function(usable) {
				return resolveDispatcher().use(usable);
			};
			exports.useActionState = function(action, initialState, permalink) {
				return resolveDispatcher().useActionState(action, initialState, permalink);
			};
			exports.useCallback = function(callback, deps) {
				return resolveDispatcher().useCallback(callback, deps);
			};
			exports.useContext = function(Context) {
				var dispatcher = resolveDispatcher();
				Context.$$typeof === REACT_CONSUMER_TYPE && console.error("Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?");
				return dispatcher.useContext(Context);
			};
			exports.useDebugValue = function(value, formatterFn) {
				return resolveDispatcher().useDebugValue(value, formatterFn);
			};
			exports.useDeferredValue = function(value, initialValue) {
				return resolveDispatcher().useDeferredValue(value, initialValue);
			};
			exports.useEffect = function(create, deps) {
				create ?? console.warn("React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?");
				return resolveDispatcher().useEffect(create, deps);
			};
			exports.useEffectEvent = function(callback) {
				return resolveDispatcher().useEffectEvent(callback);
			};
			exports.useId = function() {
				return resolveDispatcher().useId();
			};
			exports.useImperativeHandle = function(ref, create, deps) {
				return resolveDispatcher().useImperativeHandle(ref, create, deps);
			};
			exports.useInsertionEffect = function(create, deps) {
				create ?? console.warn("React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?");
				return resolveDispatcher().useInsertionEffect(create, deps);
			};
			exports.useLayoutEffect = function(create, deps) {
				create ?? console.warn("React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?");
				return resolveDispatcher().useLayoutEffect(create, deps);
			};
			exports.useMemo = function(create, deps) {
				return resolveDispatcher().useMemo(create, deps);
			};
			exports.useOptimistic = function(passthrough, reducer) {
				return resolveDispatcher().useOptimistic(passthrough, reducer);
			};
			exports.useReducer = function(reducer, initialArg, init) {
				return resolveDispatcher().useReducer(reducer, initialArg, init);
			};
			exports.useRef = function(initialValue) {
				return resolveDispatcher().useRef(initialValue);
			};
			exports.useState = function(initialState) {
				return resolveDispatcher().useState(initialState);
			};
			exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
				return resolveDispatcher().useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
			};
			exports.useTransition = function() {
				return resolveDispatcher().useTransition();
			};
			exports.version = "19.2.8";
			"undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
		})();
	}));
	//#endregion
	//#region ../../node_modules/.bun/react@19.2.8/node_modules/react/index.js
	var require_react = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		module.exports = require_react_development();
	}));
	//#endregion
	//#region ../../node_modules/.bun/superlock@1.3.5/node_modules/superlock/src/create.js
	var require_create = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var Node = class {
			constructor(data) {
				this.data = data;
			}
		};
		var LinkedList = class {
			constructor() {
				this.length = 0;
			}
			enqueue(data) {
				const node = new Node(data);
				node.prev = this.tail;
				if (this.tail) this.tail.next = node;
				else this.head = node;
				this.tail = node;
				this.length++;
				return node;
			}
			dequeue() {
				if (!this.head) return;
				const { data } = this.head;
				this.remove(this.head);
				return data;
			}
			remove(node) {
				if (node.prev) node.prev.next = node.next;
				else this.head = node.next;
				if (node.next) node.next.prev = node.prev;
				else this.tail = node.prev;
				this.length--;
			}
			size() {
				return this.length;
			}
		};
		module.exports = (slots = 1) => {
			const queue = new LinkedList();
			const release = () => {
				++slots;
				const waiter = queue.dequeue();
				if (waiter) return waiter.acquire();
			};
			const acquire = (resolve) => {
				--slots;
				resolve(release);
			};
			const lock = (signal) => new Promise((resolve) => {
				if (signal != null && typeof signal.addEventListener !== "function") throw new TypeError("`signal` needs to be an AbortSignal.");
				if (signal?.aborted) return resolve(null);
				if (!lock.isLocked()) return acquire(resolve);
				const waiter = { acquire: () => acquire(resolve) };
				const node = queue.enqueue(waiter);
				if (signal != null) {
					const onAbort = () => {
						queue.remove(node);
						resolve(null);
					};
					waiter.acquire = () => {
						signal.removeEventListener("abort", onAbort);
						acquire(resolve);
					};
					signal.addEventListener("abort", onAbort, { once: true });
				}
			});
			lock.isLocked = () => slots === 0;
			lock.awaiting = () => queue.size();
			return lock;
		};
	}));
	//#endregion
	//#region ../../node_modules/.bun/superlock@1.3.5/node_modules/superlock/src/index.js
	var require_src = /* @__PURE__ */ __commonJSMin(((exports, module) => {
		var createLock = require_create();
		var withLock = (opts) => {
			const lock = createLock(opts);
			const withLock = async (fn, signal) => {
				const release = await lock(signal);
				if (!release) return;
				try {
					return await fn();
				} finally {
					release();
				}
			};
			withLock.isLocked = lock.isLocked;
			withLock.awaiting = lock.awaiting;
			return withLock;
		};
		module.exports = {
			withLock,
			createLock
		};
	}));
	require_react();
	var import_src = require_src();
	/** Migration error for version migrations */
	var MigrationError = class extends Error {
		key;
		version;
		constructor(key, version, options) {
			super(`v${version} migration failed for "${key}"`, options);
			this.key = key;
			this.version = version;
		}
	};
	var globals = globalThis;
	var browser = globals.browser ?? globals.chrome ?? {};
	var has = Object.prototype.hasOwnProperty;
	function dequal(foo, bar) {
		var ctor, len;
		if (foo === bar) return true;
		if (foo && bar && (ctor = foo.constructor) === bar.constructor) {
			if (ctor === Date) return foo.getTime() === bar.getTime();
			if (ctor === RegExp) return foo.toString() === bar.toString();
			if (ctor === Array) {
				if ((len = foo.length) === bar.length) while (len-- && dequal(foo[len], bar[len]));
				return len === -1;
			}
			if (!ctor || typeof foo === "object") {
				len = 0;
				for (ctor in foo) {
					if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
					if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
				}
				return Object.keys(bar).length === len;
			}
		}
		return foo !== foo && bar !== bar;
	}
	/**
	* Simplified, type-safe storage APIs for browser extensions, with support for
	* versioned fields, snapshots, metadata, and item definitions.
	*
	* @module webext-store
	*/
	var storage = createStorage();
	function createStorage() {
		const drivers = {
			local: createDriver("local"),
			session: createDriver("session"),
			sync: createDriver("sync"),
			managed: createDriver("managed")
		};
		const getDriver = (area) => {
			const driver = drivers[area];
			if (driver == null) {
				const areaNames = Object.keys(drivers).join(", ");
				throw Error(`Invalid area "${area}". Options: ${areaNames}`);
			}
			return driver;
		};
		const resolveKey = (key) => {
			const deliminatorIndex = key.indexOf(":");
			const driverArea = key.substring(0, deliminatorIndex);
			const driverKey = key.substring(deliminatorIndex + 1);
			if (driverKey == null) throw Error(`Storage key should be in the form of "area:key", but received "${key}"`);
			return {
				driverArea,
				driverKey,
				driver: getDriver(driverArea)
			};
		};
		const getMetaKey = (key) => `${key}$`;
		const mergeMeta = (oldMeta, newMeta) => {
			const newFields = { ...oldMeta };
			Object.entries(newMeta).forEach(([key, value]) => {
				if (value == null) delete newFields[key];
				else newFields[key] = value;
			});
			return newFields;
		};
		const getValueOrFallback = (value, fallback) => value ?? fallback ?? null;
		const getMetaValue = (properties) => typeof properties === "object" && !Array.isArray(properties) ? properties : {};
		const getItem = async (driver, driverKey, opts) => {
			const res = await driver.getItem(driverKey);
			return getValueOrFallback(res, opts?.fallback);
		};
		const getMeta = async (driver, driverKey) => {
			const metaKey = getMetaKey(driverKey);
			const res = await driver.getItem(metaKey);
			return getMetaValue(res);
		};
		const setItem = async (driver, driverKey, value) => {
			await driver.setItem(driverKey, value ?? null);
		};
		const setMeta = async (driver, driverKey, properties) => {
			const metaKey = getMetaKey(driverKey);
			const existingFields = getMetaValue(await driver.getItem(metaKey));
			await driver.setItem(metaKey, mergeMeta(existingFields, properties));
		};
		const removeItem = async (driver, driverKey, opts) => {
			await driver.removeItem(driverKey);
			if (opts?.removeMeta) {
				const metaKey = getMetaKey(driverKey);
				await driver.removeItem(metaKey);
			}
		};
		const removeMeta = async (driver, driverKey, properties) => {
			const metaKey = getMetaKey(driverKey);
			if (properties == null) await driver.removeItem(metaKey);
			else {
				const newFields = getMetaValue(await driver.getItem(metaKey));
				[properties].flat().forEach((field) => {
					delete newFields[field];
				});
				await driver.setItem(metaKey, newFields);
			}
		};
		const watch = (driver, driverKey, cb) => driver.watch(driverKey, cb);
		return {
			getItem: async (key, opts) => {
				const { driver, driverKey } = resolveKey(key);
				return await getItem(driver, driverKey, opts);
			},
			getItems: async (keys) => {
				const areaToKeyMap = /* @__PURE__ */ new Map();
				const keyToOptsMap = /* @__PURE__ */ new Map();
				const orderedKeys = [];
				keys.forEach((key) => {
					let keyStr;
					let opts;
					if (typeof key === "string") keyStr = key;
					else if ("getValue" in key) {
						keyStr = key.key;
						opts = { fallback: key.fallback };
					} else if ("item" in key) {
						keyStr = key.item.key;
						opts = { fallback: key.item.fallback };
					} else {
						keyStr = key.key;
						opts = key.options;
					}
					orderedKeys.push(keyStr);
					const { driverArea, driverKey } = resolveKey(keyStr);
					const areaKeys = areaToKeyMap.get(driverArea) ?? [];
					areaToKeyMap.set(driverArea, areaKeys.concat(driverKey));
					keyToOptsMap.set(keyStr, opts);
				});
				const resultsMap = /* @__PURE__ */ new Map();
				await Promise.all(Array.from(areaToKeyMap.entries()).map(async ([driverArea, keys]) => {
					(await drivers[driverArea].getItems(keys)).forEach((driverResult) => {
						const key = `${driverArea}:${driverResult.key}`;
						const opts = keyToOptsMap.get(key);
						const value = getValueOrFallback(driverResult.value, opts?.fallback ?? opts?.fallback);
						resultsMap.set(key, value);
					});
				}));
				return orderedKeys.map((key) => ({
					key,
					value: resultsMap.get(key)
				}));
			},
			getMeta: async (key) => {
				const { driver, driverKey } = resolveKey(key);
				return await getMeta(driver, driverKey);
			},
			getMetas: async (args) => {
				const keys = args.map((arg) => {
					const key = typeof arg === "string" ? arg : arg.key;
					const { driverArea, driverKey } = resolveKey(key);
					return {
						key,
						driverArea,
						driverKey,
						driverMetaKey: getMetaKey(driverKey)
					};
				});
				const areaToDriverMetaKeysMap = keys.reduce((map, key) => {
					map[key.driverArea] ??= [];
					map[key.driverArea]?.push(key);
					return map;
				}, {});
				const resultsMap = {};
				const storage = browser.storage;
				if (!storage) throw new Error("Browser storage API is unavailable");
				await Promise.all(Object.entries(areaToDriverMetaKeysMap).map(async ([area, keys]) => {
					const areaRes = await storage[area].get(keys.map((key) => key.driverMetaKey));
					keys.forEach((key) => {
						resultsMap[key.key] = areaRes[key.driverMetaKey] ?? {};
					});
				}));
				return keys.map((key) => ({
					key: key.key,
					meta: resultsMap[key.key]
				}));
			},
			setItem: async (key, value) => {
				const { driver, driverKey } = resolveKey(key);
				await setItem(driver, driverKey, value);
			},
			setItems: async (items) => {
				const areaToKeyValueMap = {};
				items.forEach((item) => {
					const { driverArea, driverKey } = resolveKey("key" in item ? item.key : item.item.key);
					areaToKeyValueMap[driverArea] ??= [];
					areaToKeyValueMap[driverArea].push({
						key: driverKey,
						value: item.value
					});
				});
				await Promise.all(Object.entries(areaToKeyValueMap).map(async ([driverArea, values]) => {
					await getDriver(driverArea).setItems(values);
				}));
			},
			setMeta: async (key, properties) => {
				const { driver, driverKey } = resolveKey(key);
				await setMeta(driver, driverKey, properties);
			},
			setMetas: async (items) => {
				const areaToMetaUpdatesMap = {};
				items.forEach((item) => {
					const { driverArea, driverKey } = resolveKey("key" in item ? item.key : item.item.key);
					areaToMetaUpdatesMap[driverArea] ??= [];
					areaToMetaUpdatesMap[driverArea].push({
						key: driverKey,
						properties: item.meta
					});
				});
				await Promise.all(Object.entries(areaToMetaUpdatesMap).map(async ([storageArea, updates]) => {
					const driver = getDriver(storageArea);
					const metaKeys = updates.map(({ key }) => getMetaKey(key));
					const existingMetas = await driver.getItems(metaKeys);
					const existingMetaMap = Object.fromEntries(existingMetas.map(({ key, value }) => [key, getMetaValue(value)]));
					const metaUpdates = updates.map(({ key, properties }) => {
						const metaKey = getMetaKey(key);
						return {
							key: metaKey,
							value: mergeMeta(existingMetaMap[metaKey] ?? {}, properties)
						};
					});
					await driver.setItems(metaUpdates);
				}));
			},
			removeItem: async (key, opts) => {
				const { driver, driverKey } = resolveKey(key);
				await removeItem(driver, driverKey, opts);
			},
			removeItems: async (keys) => {
				const areaToKeysMap = {};
				keys.forEach((key) => {
					let keyStr;
					let opts;
					if (typeof key === "string") keyStr = key;
					else if ("getValue" in key) keyStr = key.key;
					else if ("item" in key) {
						keyStr = key.item.key;
						opts = key.options;
					} else {
						keyStr = key.key;
						opts = key.options;
					}
					const { driverArea, driverKey } = resolveKey(keyStr);
					areaToKeysMap[driverArea] ??= [];
					areaToKeysMap[driverArea].push(driverKey);
					if (opts?.removeMeta) areaToKeysMap[driverArea].push(getMetaKey(driverKey));
				});
				await Promise.all(Object.entries(areaToKeysMap).map(async ([driverArea, keys]) => {
					await getDriver(driverArea).removeItems(keys);
				}));
			},
			clear: async (base) => {
				await getDriver(base).clear();
			},
			removeMeta: async (key, properties) => {
				const { driver, driverKey } = resolveKey(key);
				await removeMeta(driver, driverKey, properties);
			},
			snapshot: async (base, opts) => {
				const data = await getDriver(base).snapshot();
				opts?.excludeKeys?.forEach((key) => {
					delete data[key];
					delete data[getMetaKey(key)];
				});
				return data;
			},
			restoreSnapshot: async (base, data) => {
				await getDriver(base).restoreSnapshot(data);
			},
			watch: (key, cb) => {
				const { driver, driverKey } = resolveKey(key);
				return watch(driver, driverKey, cb);
			},
			unwatch() {
				Object.values(drivers).forEach((driver) => {
					driver.unwatch();
				});
			},
			defineItem: (key, opts) => {
				const { driver, driverKey } = resolveKey(key);
				const { version: targetVersion = 1, migrations = {}, onMigrationComplete, debug = false } = opts ?? {};
				if (targetVersion < 1) throw Error("Storage item version cannot be less than 1. Initial versions should be set to 1, not 0.");
				let needsVersionSet = false;
				const migrate = async () => {
					const driverMetaKey = getMetaKey(driverKey);
					const [{ value }, { value: meta }] = await driver.getItems([driverKey, driverMetaKey]);
					needsVersionSet = value == null && meta?.v == null && !!targetVersion;
					if (value == null) return;
					const currentVersion = meta?.v ?? 1;
					if (currentVersion > targetVersion) throw Error(`Version downgrade detected (v${currentVersion} -> v${targetVersion}) for "${key}"`);
					if (currentVersion === targetVersion) return;
					if (debug) console.debug(`[webext-store] Running storage migration for ${key}: v${currentVersion} -> v${targetVersion}`);
					const migrationsToRun = Array.from({ length: targetVersion - currentVersion }, (_, i) => currentVersion + i + 1);
					let migratedValue = value;
					for (const migrateToVersion of migrationsToRun) try {
						migratedValue = await migrations?.[migrateToVersion]?.(migratedValue) ?? migratedValue;
						if (debug) console.debug(`[webext-store] Storage migration processed for version: v${migrateToVersion}`);
					} catch (err) {
						throw new MigrationError(key, migrateToVersion, { cause: err });
					}
					await driver.setItems([{
						key: driverKey,
						value: migratedValue
					}, {
						key: driverMetaKey,
						value: {
							...meta,
							v: targetVersion
						}
					}]);
					if (debug) console.debug(`[webext-store] Storage migration completed for ${key} v${targetVersion}`, { migratedValue });
					onMigrationComplete?.(migratedValue, targetVersion);
				};
				const migrationsDone = opts?.migrations == null ? Promise.resolve() : migrate().catch((err) => {
					console.error(`[webext-store] Migration failed for ${key}`, err);
				});
				const initLock = (0, import_src.withLock)();
				const getFallback = () => opts?.fallback ?? opts?.defaultValue ?? null;
				const getOrInitValue = () => initLock(async () => {
					const value = await driver.getItem(driverKey);
					if (value != null || opts?.init == null) return value;
					const newValue = await opts.init();
					await driver.setItem(driverKey, newValue);
					if (value == null && targetVersion > 1) await setMeta(driver, driverKey, { v: targetVersion });
					return newValue;
				});
				migrationsDone.then(getOrInitValue);
				return {
					key,
					get defaultValue() {
						return getFallback();
					},
					get fallback() {
						return getFallback();
					},
					getValue: async () => {
						await migrationsDone;
						if (opts?.init) return await getOrInitValue();
						else return await getItem(driver, driverKey, opts);
					},
					getMeta: async () => {
						await migrationsDone;
						return await getMeta(driver, driverKey);
					},
					setValue: async (value) => {
						await migrationsDone;
						if (needsVersionSet) {
							needsVersionSet = false;
							await Promise.all([setItem(driver, driverKey, value), setMeta(driver, driverKey, { v: targetVersion })]);
						} else await setItem(driver, driverKey, value);
					},
					setMeta: async (properties) => {
						await migrationsDone;
						return await setMeta(driver, driverKey, properties);
					},
					removeValue: async (opts) => {
						await migrationsDone;
						return await removeItem(driver, driverKey, opts);
					},
					removeMeta: async (properties) => {
						await migrationsDone;
						return await removeMeta(driver, driverKey, properties);
					},
					watch: (cb) => watch(driver, driverKey, (newValue, oldValue) => cb(newValue ?? getFallback(), oldValue ?? getFallback())),
					migrate
				};
			}
		};
	}
	function createDriver(storageArea) {
		const getStorageArea = () => {
			if (browser.runtime == null) throw Error(`'webext-store' must be loaded in a web extension environment.`);
			if (browser.storage == null) throw Error("You must add the 'storage' permission to your manifest to use 'webext-store'");
			const area = browser.storage[storageArea];
			if (area == null) throw Error(`"browser.storage.${storageArea}" is undefined`);
			return area;
		};
		const watchListeners = /* @__PURE__ */ new Set();
		return {
			getItem: async (key) => {
				return (await getStorageArea().get(key))[key];
			},
			getItems: async (keys) => {
				const result = await getStorageArea().get(keys);
				return keys.map((key) => ({
					key,
					value: result[key] ?? null
				}));
			},
			setItem: async (key, value) => {
				if (value == null) await getStorageArea().remove(key);
				else await getStorageArea().set({ [key]: value });
			},
			setItems: async (values) => {
				const map = values.reduce((map, { key, value }) => {
					map[key] = value;
					return map;
				}, {});
				await getStorageArea().set(map);
			},
			removeItem: async (key) => {
				await getStorageArea().remove(key);
			},
			removeItems: async (keys) => {
				await getStorageArea().remove(keys);
			},
			clear: async () => {
				await getStorageArea().clear();
			},
			snapshot: async () => {
				return await getStorageArea().get();
			},
			restoreSnapshot: async (data) => {
				await getStorageArea().set(data);
			},
			watch(key, cb) {
				const listener = (changes) => {
					const change = changes[key];
					if (change == null || dequal(change.newValue, change.oldValue)) return;
					cb(change.newValue ?? null, change.oldValue ?? null);
				};
				getStorageArea().onChanged.addListener(listener);
				watchListeners.add(listener);
				return () => {
					getStorageArea().onChanged.removeListener(listener);
					watchListeners.delete(listener);
				};
			},
			unwatch() {
				watchListeners.forEach((listener) => {
					getStorageArea().onChanged.removeListener(listener);
				});
				watchListeners.clear();
			}
		};
	}
	//#endregion
	//#region src/utils/storage-items.ts
	/**
	* A versioned item. Bumping `version` and adding a migration function is how
	* webext-store evolves a stored shape over time — migrations run
	* automatically, once, the first time the item is touched after an update.
	*/
	var settingsItem = storage.defineItem("sync:settings", {
		fallback: {
			theme: "light",
			displayName: "Guest"
		},
		version: 3,
		migrations: {
			2: (old) => ({
				...old,
				theme: old?.theme ?? "light"
			}),
			3: (old) => ({
				...old,
				displayName: old?.displayName ?? "Guest"
			})
		},
		debug: true,
		onMigrationComplete: (value, targetVersion) => {
			console.log(`[webext-store-demo] settings migrated to v${targetVersion}`, value);
		}
	});
	/**
	* `init` runs exactly once — the first time this item is defined in any
	* extension context after install — and only if nothing is in storage yet.
	* Good for one-time IDs, first-run timestamps, etc.
	*/
	var installIdItem = storage.defineItem("local:installId", { init: () => crypto.randomUUID() });
	/**
	* A plain counter with a fallback of 0. Written to from the popup (via the
	* React hook), the background (on an alarm + on message), and read from
	* both — this is what the "Cross-context" tab uses to prove `watch()` fires
	* across execution contexts.
	*/
	var heartbeatItem = storage.defineItem("local:heartbeat", { fallback: 0 });
	storage.defineItem("local:appSetting", { fallback: {
		theme: "dark",
		free: true
	} });
	//#endregion
	//#region src/entrypoints/background.ts
	/**
	* Background / service worker guide
	* ----------------------------------
	* MV3 service workers are NOT long-lived — the browser kills and restarts
	* them whenever it wants (idle timeout, memory pressure, etc). Nothing you
	* hold in a plain JS variable here survives that. `webext-store` items do,
	* because every read/write goes straight to `browser.storage`, not to
	* in-memory state — that's *why* storage, not module-level variables, is
	* the right place for anything the background needs to remember.
	*
	* Three separate lifecycle hooks matter here, and it's easy to conflate
	* them:
	*   - `defineBackground(() => {...})` body — runs every time this service
	*     worker (re)starts. Put subscriptions (`.watch()`) and alarm/message
	*     listeners here — they need to be re-registered on every restart.
	*   - `browser.runtime.onInstalled` — runs once on install, and once per
	*     extension update. This is the correct place for one-time setup and
	*     for forcing migrations before anything else touches the data.
	*   - `browser.alarms` — MV3's replacement for `setInterval` in a service
	*     worker; a plain `setInterval` gets thrown away the moment the worker
	*     is killed, `alarms` survives restarts because the browser itself
	*     schedules them.
	*/
	var background_default = defineBackground(() => {
		console.log("[webext-store-demo] background started");
		browser$1.runtime.onInstalled.addListener(({ reason }) => {
			if (reason === "install") console.log("[webext-store-demo] first install");
			else if (reason === "update") console.log("[webext-store-demo] updated — running pending migrations");
			settingsItem.migrate();
		});
		settingsItem.migrate();
		installIdItem.getValue().then((id) => {
			console.log("[webext-store-demo] install id:", id);
		});
		const unwatchHeartbeat = heartbeatItem.watch((newValue, oldValue) => {
			console.log(`[webext-store-demo] heartbeat: ${oldValue} -> ${newValue}`);
		});
		browser$1.alarms.create("heartbeat", { periodInMinutes: .05 });
		browser$1.alarms.onAlarm.addListener(async (alarm) => {
			if (alarm.name !== "heartbeat") return;
			const current = await heartbeatItem.getValue();
			await heartbeatItem.setValue(current + 1);
		});
		browser$1.runtime.onMessage.addListener((message) => {
			if (message?.type === "bump-heartbeat") return heartbeatItem.getValue().then((current) => heartbeatItem.setValue(current + 1));
		});
		self.addEventListener("beforeunload", () => {
			unwatchHeartbeat();
			storage.unwatch();
		});
	});
	//#endregion
	//#region ../../node_modules/.bun/@webext-core+match-patterns@2.0.0/node_modules/@webext-core/match-patterns/dist/index.mjs
	/**
	* Class for parsing and performing operations on match patterns.
	*
	* @example
	*   const pattern = new MatchPattern('*://google.com/*');
	*
	*   pattern.includes('https://google.com'); // true
	*   pattern.includes('http://youtube.com/watch?v=123'); // false
	*/
	var MatchPattern = class MatchPattern {
		static {
			this.PROTOCOLS = [
				"http",
				"https",
				"file",
				"ftp",
				"urn",
				"ws",
				"wss"
			];
		}
		/**
		* Parse a match pattern string. If it is invalid, the constructor will throw an
		* `InvalidMatchPattern` error.
		*
		* @param matchPattern The match pattern to parse.
		*/
		constructor(matchPattern) {
			if (matchPattern === "<all_urls>") {
				this.isAllUrls = true;
				this.protocolMatches = [...MatchPattern.PROTOCOLS];
				this.hostnameMatch = "*";
				this.pathnameMatch = "*";
			} else {
				const groups = /(.*):\/\/(.*?)(\/.*)/.exec(matchPattern);
				if (groups == null) throw new InvalidMatchPattern(matchPattern, "Incorrect format");
				const [_, protocol, hostname, pathname] = groups;
				validateProtocol(matchPattern, protocol);
				validateHostname(matchPattern, hostname);
				this.protocolMatches = protocol === "*" ? ["http", "https"] : [protocol];
				this.hostnameMatch = hostname;
				this.pathnameMatch = pathname;
			}
		}
		/** Check if a URL is included in a pattern. */
		includes(url) {
			const u = typeof url === "string" ? new URL(url) : url instanceof Location ? new URL(url.href) : url;
			if (this.isAllUrls) return !this.isUnknownProtocol(u);
			return !!this.protocolMatches.find((protocol) => {
				if (protocol === "http") return this.isHttpMatch(u);
				if (protocol === "https") return this.isHttpsMatch(u);
				if (protocol === "file") return this.isFileMatch(u);
				if (protocol === "ftp") return this.isFtpMatch(u);
				if (protocol === "urn") return this.isUrnMatch(u);
			});
		}
		isHttpMatch(url) {
			return url.protocol === "http:" && this.isHostPathMatch(url);
		}
		isHttpsMatch(url) {
			return url.protocol === "https:" && this.isHostPathMatch(url);
		}
		isHostPathMatch(url) {
			if (!this.hostnameMatch || !this.pathnameMatch) return false;
			const hostnameMatchRegexs = [this.convertPatternToRegex(this.hostnameMatch), this.convertPatternToRegex(this.hostnameMatch.replace(/^\*\./, ""))];
			const pathnameMatchRegex = this.convertPatternToRegex(this.pathnameMatch);
			return !!hostnameMatchRegexs.find((regex) => regex.test(url.hostname)) && pathnameMatchRegex.test(url.pathname);
		}
		isUnknownProtocol(url) {
			return !this.protocolMatches.includes(url.protocol.slice(0, -1));
		}
		isPathMatch(url) {
			if (!this.pathnameMatch) return false;
			return this.convertPatternToRegex(this.pathnameMatch).test(url.pathname);
		}
		isFileMatch(url) {
			return url.protocol === "file:" && this.isPathMatch(url);
		}
		isFtpMatch(_url) {
			throw Error("Not implemented: ftp:// pattern matching. Open a PR to add support");
		}
		isUrnMatch(_url) {
			throw Error("Not implemented: urn:// pattern matching. Open a PR to add support");
		}
		convertPatternToRegex(pattern) {
			const starsReplaced = this.escapeForRegex(pattern).replace(/\\\*/g, ".*");
			return RegExp(`^${starsReplaced}$`);
		}
		escapeForRegex(string) {
			return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		}
	};
	var InvalidMatchPattern = class extends Error {
		constructor(matchPattern, reason) {
			super(`Invalid match pattern "${matchPattern}": ${reason}`);
		}
	};
	function validateProtocol(matchPattern, protocol) {
		if (!MatchPattern.PROTOCOLS.includes(protocol) && protocol !== "*") throw new InvalidMatchPattern(matchPattern, `${protocol} not a valid protocol (${MatchPattern.PROTOCOLS.join(", ")})`);
	}
	function validateHostname(matchPattern, hostname) {
		if (hostname.includes(":")) throw new InvalidMatchPattern(matchPattern, `Hostname cannot include a port`);
		if (hostname.includes("*") && hostname.length > 1 && !hostname.startsWith("*.")) throw new InvalidMatchPattern(matchPattern, `If using a wildcard (*), it must go at the start of the hostname`);
	}
	//#endregion
	//#region \0virtual:wxt-background-entrypoint?D:/Projects/webext-kit/examples/webext-store/src/entrypoints/background.ts
	function print(method, ...args) {
		if (typeof args[0] === "string") method(`[wxt] ${args.shift()}`, ...args);
		else method("[wxt]", ...args);
	}
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger = {
		debug: (...args) => print(console.debug, ...args),
		log: (...args) => print(console.log, ...args),
		warn: (...args) => print(console.warn, ...args),
		error: (...args) => print(console.error, ...args)
	};
	var ws;
	/** Connect to the websocket and listen for messages. */
	function getDevServerWebSocket() {
		if (ws == null) {
			const serverUrl = "ws://localhost:3000";
			logger.debug("Connecting to dev server @", serverUrl);
			ws = new WebSocket(serverUrl, "vite-hmr");
			ws.addWxtEventListener = ws.addEventListener.bind(ws);
			ws.sendCustom = (event, payload) => ws?.send(JSON.stringify({
				type: "custom",
				event,
				payload
			}));
			ws.addEventListener("open", () => {
				logger.debug("Connected to dev server");
			});
			ws.addEventListener("close", () => {
				logger.debug("Disconnected from dev server");
			});
			ws.addEventListener("error", (event) => {
				logger.error("Failed to connect to dev server", event);
			});
			ws.addEventListener("message", (e) => {
				try {
					const message = JSON.parse(e.data);
					if (message.type === "custom") ws?.dispatchEvent(new CustomEvent(message.event, { detail: message.data }));
				} catch (err) {
					logger.error("Failed to handle message", err);
				}
			});
		}
		return ws;
	}
	/** https://developer.chrome.com/blog/longer-esw-lifetimes/ */
	function keepServiceWorkerAlive() {
		setInterval(async () => {
			await browser$1.runtime.getPlatformInfo();
		}, 5e3);
	}
	function reloadContentScript(payload) {
		if (browser$1.runtime.getManifest().manifest_version == 2) reloadContentScriptMv2(payload);
		else reloadContentScriptMv3(payload);
	}
	async function reloadContentScriptMv3({ registration, contentScript }) {
		if (registration === "runtime") await reloadRuntimeContentScriptMv3(contentScript);
		else await reloadManifestContentScriptMv3(contentScript);
	}
	async function reloadManifestContentScriptMv3(contentScript) {
		const id = `wxt:${contentScript.js[0]}`;
		logger.log("Reloading content script:", contentScript);
		const registered = await browser$1.scripting.getRegisteredContentScripts();
		logger.debug("Existing scripts:", registered);
		const existing = registered.find((cs) => cs.id === id);
		if (existing) {
			logger.debug("Updating content script", existing);
			await browser$1.scripting.updateContentScripts([{
				...contentScript,
				id,
				css: contentScript.css ?? []
			}]);
		} else {
			logger.debug("Registering new content script...");
			await browser$1.scripting.registerContentScripts([{
				...contentScript,
				id,
				css: contentScript.css ?? []
			}]);
		}
		await reloadTabsForContentScript(contentScript);
	}
	async function reloadRuntimeContentScriptMv3(contentScript) {
		logger.log("Reloading content script:", contentScript);
		const registered = await browser$1.scripting.getRegisteredContentScripts();
		logger.debug("Existing scripts:", registered);
		const matches = registered.filter((cs) => {
			const hasJs = contentScript.js?.find((js) => cs.js?.includes(js));
			const hasCss = contentScript.css?.find((css) => cs.css?.includes(css));
			return hasJs || hasCss;
		});
		if (matches.length === 0) {
			logger.log("Content script is not registered yet, nothing to reload", contentScript);
			return;
		}
		await browser$1.scripting.updateContentScripts(matches);
		await reloadTabsForContentScript(contentScript);
	}
	async function reloadTabsForContentScript(contentScript) {
		const allTabs = await browser$1.tabs.query({});
		const matchPatterns = contentScript.matches.map((match) => new MatchPattern(match));
		const matchingTabs = allTabs.filter((tab) => {
			const url = tab.url;
			if (!url) return false;
			return !!matchPatterns.find((pattern) => pattern.includes(url));
		});
		await Promise.all(matchingTabs.map(async (tab) => {
			try {
				await browser$1.tabs.reload(tab.id);
			} catch (err) {
				logger.warn("Failed to reload tab:", err);
			}
		}));
	}
	async function reloadContentScriptMv2(_payload) {
		throw Error("TODO: reloadContentScriptMv2");
	}
	try {
		const ws = getDevServerWebSocket();
		ws.addWxtEventListener("wxt:reload-extension", () => {
			browser$1.runtime.reload();
		});
		ws.addWxtEventListener("wxt:reload-content-script", (event) => {
			reloadContentScript(event.detail);
		});
		ws.addEventListener("open", () => ws.sendCustom("wxt:background-initialized"));
		keepServiceWorkerAlive();
	} catch (err) {
		logger.error("Failed to setup web socket connection with dev server", err);
	}
	browser$1.commands.onCommand.addListener((command) => {
		if (command === "wxt:reload-extension") browser$1.runtime.reload();
	});
	var result;
	try {
		result = background_default.main();
		if (result instanceof Promise) console.warn("The background's main() function return a promise, but it must be synchronous");
	} catch (err) {
		logger.error("The background crashed on startup!");
		throw err;
	}
	//#endregion
	return result;
})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm5hbWVzIjpbImJyb3dzZXIiLCJicm93c2VyIiwiYnJvd3NlciQxIiwid2l0aExvY2siXSwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40KzAwN2RmYmM0MmY1YTQyNzYvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2RlZmluZS1iYWNrZ3JvdW5kLm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL0B3eHQtZGV2K2Jyb3dzZXJAMC4yLjcvbm9kZV9tb2R1bGVzL0B3eHQtZGV2L2Jyb3dzZXIvc3JjL2luZGV4Lm1qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrMDA3ZGZiYzQyZjVhNDI3Ni9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvYnJvd3Nlci5tanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9yZWFjdEAxOS4yLjgvbm9kZV9tb2R1bGVzL3JlYWN0L2Nqcy9yZWFjdC5kZXZlbG9wbWVudC5qcyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3JlYWN0QDE5LjIuOC9ub2RlX21vZHVsZXMvcmVhY3QvaW5kZXguanMiLCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9zdXBlcmxvY2tAMS4zLjUvbm9kZV9tb2R1bGVzL3N1cGVybG9jay9zcmMvY3JlYXRlLmpzIiwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vc3VwZXJsb2NrQDEuMy41L25vZGVfbW9kdWxlcy9zdXBlcmxvY2svc3JjL2luZGV4LmpzIiwiLi4vLi4vLi4vLi4vcGFja2FnZXMvd2ViZXh0LXN0b3JlL2Rpc3QvaG9vazIubWpzIiwiLi4vLi4vc3JjL3V0aWxzL3N0b3JhZ2UtaXRlbXMudHMiLCIuLi8uLi9zcmMvZW50cnlwb2ludHMvYmFja2dyb3VuZC50cyIsIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL0B3ZWJleHQtY29yZSttYXRjaC1wYXR0ZXJuc0AyLjAuMC9ub2RlX21vZHVsZXMvQHdlYmV4dC1jb3JlL21hdGNoLXBhdHRlcm5zL2Rpc3QvaW5kZXgubWpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vI3JlZ2lvbiBzcmMvdXRpbHMvZGVmaW5lLWJhY2tncm91bmQudHNcbmZ1bmN0aW9uIGRlZmluZUJhY2tncm91bmQoYXJnKSB7XG5cdGlmIChhcmcgPT0gbnVsbCB8fCB0eXBlb2YgYXJnID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB7IG1haW46IGFyZyB9O1xuXHRyZXR1cm4gYXJnO1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBkZWZpbmVCYWNrZ3JvdW5kIH07XG4iLCIvLyAjcmVnaW9uIHNuaXBwZXRcbmV4cG9ydCBjb25zdCBicm93c2VyID0gZ2xvYmFsVGhpcy5icm93c2VyPy5ydW50aW1lPy5pZFxuICA/IGdsb2JhbFRoaXMuYnJvd3NlclxuICA6IGdsb2JhbFRoaXMuY2hyb21lO1xuLy8gI2VuZHJlZ2lvbiBzbmlwcGV0XG4iLCJpbXBvcnQgeyBicm93c2VyIGFzIGJyb3dzZXIkMSB9IGZyb20gXCJAd3h0LWRldi9icm93c2VyXCI7XG4vLyNyZWdpb24gc3JjL2Jyb3dzZXIudHNcbi8qKlxuKiBDb250YWlucyB0aGUgYGJyb3dzZXJgIGV4cG9ydCB3aGljaCB5b3Ugc2hvdWxkIHVzZSB0byBhY2Nlc3MgdGhlIGV4dGVuc2lvblxuKiBBUElzIGluIHlvdXIgcHJvamVjdDpcbipcbiogYGBgdHNcbiogaW1wb3J0IHsgYnJvd3NlciB9IGZyb20gJ3d4dC9icm93c2VyJztcbipcbiogYnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCgpID0+IHtcbiogICAvLyAuLi5cbiogfSk7XG4qIGBgYFxuKlxuKiBAbW9kdWxlIHd4dC9icm93c2VyXG4qL1xuY29uc3QgYnJvd3NlciA9IGJyb3dzZXIkMTtcbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgYnJvd3NlciB9O1xuIiwiLyoqXG4gKiBAbGljZW5zZSBSZWFjdFxuICogcmVhY3QuZGV2ZWxvcG1lbnQuanNcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIE1ldGEgUGxhdGZvcm1zLCBJbmMuIGFuZCBhZmZpbGlhdGVzLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cblwidXNlIHN0cmljdFwiO1xuXCJwcm9kdWN0aW9uXCIgIT09IHByb2Nlc3MuZW52Lk5PREVfRU5WICYmXG4gIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nKG1ldGhvZE5hbWUsIGluZm8pIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb21wb25lbnQucHJvdG90eXBlLCBtZXRob2ROYW1lLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIFwiJXMoLi4uKSBpcyBkZXByZWNhdGVkIGluIHBsYWluIEphdmFTY3JpcHQgUmVhY3QgY2xhc3Nlcy4gJXNcIixcbiAgICAgICAgICAgIGluZm9bMF0sXG4gICAgICAgICAgICBpbmZvWzFdXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4obWF5YmVJdGVyYWJsZSkge1xuICAgICAgaWYgKG51bGwgPT09IG1heWJlSXRlcmFibGUgfHwgXCJvYmplY3RcIiAhPT0gdHlwZW9mIG1heWJlSXRlcmFibGUpXG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgbWF5YmVJdGVyYWJsZSA9XG4gICAgICAgIChNQVlCRV9JVEVSQVRPUl9TWU1CT0wgJiYgbWF5YmVJdGVyYWJsZVtNQVlCRV9JVEVSQVRPUl9TWU1CT0xdKSB8fFxuICAgICAgICBtYXliZUl0ZXJhYmxlW1wiQEBpdGVyYXRvclwiXTtcbiAgICAgIHJldHVybiBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBtYXliZUl0ZXJhYmxlID8gbWF5YmVJdGVyYWJsZSA6IG51bGw7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCBjYWxsZXJOYW1lKSB7XG4gICAgICBwdWJsaWNJbnN0YW5jZSA9XG4gICAgICAgICgocHVibGljSW5zdGFuY2UgPSBwdWJsaWNJbnN0YW5jZS5jb25zdHJ1Y3RvcikgJiZcbiAgICAgICAgICAocHVibGljSW5zdGFuY2UuZGlzcGxheU5hbWUgfHwgcHVibGljSW5zdGFuY2UubmFtZSkpIHx8XG4gICAgICAgIFwiUmVhY3RDbGFzc1wiO1xuICAgICAgdmFyIHdhcm5pbmdLZXkgPSBwdWJsaWNJbnN0YW5jZSArIFwiLlwiICsgY2FsbGVyTmFtZTtcbiAgICAgIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudFt3YXJuaW5nS2V5XSB8fFxuICAgICAgICAoY29uc29sZS5lcnJvcihcbiAgICAgICAgICBcIkNhbid0IGNhbGwgJXMgb24gYSBjb21wb25lbnQgdGhhdCBpcyBub3QgeWV0IG1vdW50ZWQuIFRoaXMgaXMgYSBuby1vcCwgYnV0IGl0IG1pZ2h0IGluZGljYXRlIGEgYnVnIGluIHlvdXIgYXBwbGljYXRpb24uIEluc3RlYWQsIGFzc2lnbiB0byBgdGhpcy5zdGF0ZWAgZGlyZWN0bHkgb3IgZGVmaW5lIGEgYHN0YXRlID0ge307YCBjbGFzcyBwcm9wZXJ0eSB3aXRoIHRoZSBkZXNpcmVkIHN0YXRlIGluIHRoZSAlcyBjb21wb25lbnQuXCIsXG4gICAgICAgICAgY2FsbGVyTmFtZSxcbiAgICAgICAgICBwdWJsaWNJbnN0YW5jZVxuICAgICAgICApLFxuICAgICAgICAoZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50W3dhcm5pbmdLZXldID0gITApKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gICAgICB0aGlzLnVwZGF0ZXIgPSB1cGRhdGVyIHx8IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBDb21wb25lbnREdW1teSgpIHt9XG4gICAgZnVuY3Rpb24gUHVyZUNvbXBvbmVudChwcm9wcywgY29udGV4dCwgdXBkYXRlcikge1xuICAgICAgdGhpcy5wcm9wcyA9IHByb3BzO1xuICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0O1xuICAgICAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbm9vcCgpIHt9XG4gICAgZnVuY3Rpb24gdGVzdFN0cmluZ0NvZXJjaW9uKHZhbHVlKSB7XG4gICAgICByZXR1cm4gXCJcIiArIHZhbHVlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjaGVja0tleVN0cmluZ0NvZXJjaW9uKHZhbHVlKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0ZXN0U3RyaW5nQ29lcmNpb24odmFsdWUpO1xuICAgICAgICB2YXIgSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0ID0gITE7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdCA9ICEwO1xuICAgICAgfVxuICAgICAgaWYgKEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdCkge1xuICAgICAgICBKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQgPSBjb25zb2xlO1xuICAgICAgICB2YXIgSlNDb21waWxlcl90ZW1wX2NvbnN0ID0gSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0LmVycm9yO1xuICAgICAgICB2YXIgSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0JGpzY29tcCQwID1cbiAgICAgICAgICAoXCJmdW5jdGlvblwiID09PSB0eXBlb2YgU3ltYm9sICYmXG4gICAgICAgICAgICBTeW1ib2wudG9TdHJpbmdUYWcgJiZcbiAgICAgICAgICAgIHZhbHVlW1N5bWJvbC50b1N0cmluZ1RhZ10pIHx8XG4gICAgICAgICAgdmFsdWUuY29uc3RydWN0b3IubmFtZSB8fFxuICAgICAgICAgIFwiT2JqZWN0XCI7XG4gICAgICAgIEpTQ29tcGlsZXJfdGVtcF9jb25zdC5jYWxsKFxuICAgICAgICAgIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdCxcbiAgICAgICAgICBcIlRoZSBwcm92aWRlZCBrZXkgaXMgYW4gdW5zdXBwb3J0ZWQgdHlwZSAlcy4gVGhpcyB2YWx1ZSBtdXN0IGJlIGNvZXJjZWQgdG8gYSBzdHJpbmcgYmVmb3JlIHVzaW5nIGl0IGhlcmUuXCIsXG4gICAgICAgICAgSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0JGpzY29tcCQwXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB0ZXN0U3RyaW5nQ29lcmNpb24odmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUodHlwZSkge1xuICAgICAgaWYgKG51bGwgPT0gdHlwZSkgcmV0dXJuIG51bGw7XG4gICAgICBpZiAoXCJmdW5jdGlvblwiID09PSB0eXBlb2YgdHlwZSlcbiAgICAgICAgcmV0dXJuIHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0NMSUVOVF9SRUZFUkVOQ0VcbiAgICAgICAgICA/IG51bGxcbiAgICAgICAgICA6IHR5cGUuZGlzcGxheU5hbWUgfHwgdHlwZS5uYW1lIHx8IG51bGw7XG4gICAgICBpZiAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIHR5cGUpIHJldHVybiB0eXBlO1xuICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgIGNhc2UgUkVBQ1RfRlJBR01FTlRfVFlQRTpcbiAgICAgICAgICByZXR1cm4gXCJGcmFnbWVudFwiO1xuICAgICAgICBjYXNlIFJFQUNUX1BST0ZJTEVSX1RZUEU6XG4gICAgICAgICAgcmV0dXJuIFwiUHJvZmlsZXJcIjtcbiAgICAgICAgY2FzZSBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFOlxuICAgICAgICAgIHJldHVybiBcIlN0cmljdE1vZGVcIjtcbiAgICAgICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9UWVBFOlxuICAgICAgICAgIHJldHVybiBcIlN1c3BlbnNlXCI7XG4gICAgICAgIGNhc2UgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFOlxuICAgICAgICAgIHJldHVybiBcIlN1c3BlbnNlTGlzdFwiO1xuICAgICAgICBjYXNlIFJFQUNUX0FDVElWSVRZX1RZUEU6XG4gICAgICAgICAgcmV0dXJuIFwiQWN0aXZpdHlcIjtcbiAgICAgIH1cbiAgICAgIGlmIChcIm9iamVjdFwiID09PSB0eXBlb2YgdHlwZSlcbiAgICAgICAgc3dpdGNoIChcbiAgICAgICAgICAoXCJudW1iZXJcIiA9PT0gdHlwZW9mIHR5cGUudGFnICYmXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICBcIlJlY2VpdmVkIGFuIHVuZXhwZWN0ZWQgb2JqZWN0IGluIGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSgpLiBUaGlzIGlzIGxpa2VseSBhIGJ1ZyBpbiBSZWFjdC4gUGxlYXNlIGZpbGUgYW4gaXNzdWUuXCJcbiAgICAgICAgICAgICksXG4gICAgICAgICAgdHlwZS4kJHR5cGVvZilcbiAgICAgICAgKSB7XG4gICAgICAgICAgY2FzZSBSRUFDVF9QT1JUQUxfVFlQRTpcbiAgICAgICAgICAgIHJldHVybiBcIlBvcnRhbFwiO1xuICAgICAgICAgIGNhc2UgUkVBQ1RfQ09OVEVYVF9UWVBFOlxuICAgICAgICAgICAgcmV0dXJuIHR5cGUuZGlzcGxheU5hbWUgfHwgXCJDb250ZXh0XCI7XG4gICAgICAgICAgY2FzZSBSRUFDVF9DT05TVU1FUl9UWVBFOlxuICAgICAgICAgICAgcmV0dXJuICh0eXBlLl9jb250ZXh0LmRpc3BsYXlOYW1lIHx8IFwiQ29udGV4dFwiKSArIFwiLkNvbnN1bWVyXCI7XG4gICAgICAgICAgY2FzZSBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFOlxuICAgICAgICAgICAgdmFyIGlubmVyVHlwZSA9IHR5cGUucmVuZGVyO1xuICAgICAgICAgICAgdHlwZSA9IHR5cGUuZGlzcGxheU5hbWU7XG4gICAgICAgICAgICB0eXBlIHx8XG4gICAgICAgICAgICAgICgodHlwZSA9IGlubmVyVHlwZS5kaXNwbGF5TmFtZSB8fCBpbm5lclR5cGUubmFtZSB8fCBcIlwiKSxcbiAgICAgICAgICAgICAgKHR5cGUgPSBcIlwiICE9PSB0eXBlID8gXCJGb3J3YXJkUmVmKFwiICsgdHlwZSArIFwiKVwiIDogXCJGb3J3YXJkUmVmXCIpKTtcbiAgICAgICAgICAgIHJldHVybiB0eXBlO1xuICAgICAgICAgIGNhc2UgUkVBQ1RfTUVNT19UWVBFOlxuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgKGlubmVyVHlwZSA9IHR5cGUuZGlzcGxheU5hbWUgfHwgbnVsbCksXG4gICAgICAgICAgICAgIG51bGwgIT09IGlubmVyVHlwZVxuICAgICAgICAgICAgICAgID8gaW5uZXJUeXBlXG4gICAgICAgICAgICAgICAgOiBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUodHlwZS50eXBlKSB8fCBcIk1lbW9cIlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICBjYXNlIFJFQUNUX0xBWllfVFlQRTpcbiAgICAgICAgICAgIGlubmVyVHlwZSA9IHR5cGUuX3BheWxvYWQ7XG4gICAgICAgICAgICB0eXBlID0gdHlwZS5faW5pdDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHJldHVybiBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUodHlwZShpbm5lclR5cGUpKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKHgpIHt9XG4gICAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRUYXNrTmFtZSh0eXBlKSB7XG4gICAgICBpZiAodHlwZSA9PT0gUkVBQ1RfRlJBR01FTlRfVFlQRSkgcmV0dXJuIFwiPD5cIjtcbiAgICAgIGlmIChcbiAgICAgICAgXCJvYmplY3RcIiA9PT0gdHlwZW9mIHR5cGUgJiZcbiAgICAgICAgbnVsbCAhPT0gdHlwZSAmJlxuICAgICAgICB0eXBlLiQkdHlwZW9mID09PSBSRUFDVF9MQVpZX1RZUEVcbiAgICAgIClcbiAgICAgICAgcmV0dXJuIFwiPC4uLj5cIjtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciBuYW1lID0gZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKHR5cGUpO1xuICAgICAgICByZXR1cm4gbmFtZSA/IFwiPFwiICsgbmFtZSArIFwiPlwiIDogXCI8Li4uPlwiO1xuICAgICAgfSBjYXRjaCAoeCkge1xuICAgICAgICByZXR1cm4gXCI8Li4uPlwiO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRPd25lcigpIHtcbiAgICAgIHZhciBkaXNwYXRjaGVyID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuQTtcbiAgICAgIHJldHVybiBudWxsID09PSBkaXNwYXRjaGVyID8gbnVsbCA6IGRpc3BhdGNoZXIuZ2V0T3duZXIoKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gVW5rbm93bk93bmVyKCkge1xuICAgICAgcmV0dXJuIEVycm9yKFwicmVhY3Qtc3RhY2stdG9wLWZyYW1lXCIpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBoYXNWYWxpZEtleShjb25maWcpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgXCJrZXlcIikpIHtcbiAgICAgICAgdmFyIGdldHRlciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoY29uZmlnLCBcImtleVwiKS5nZXQ7XG4gICAgICAgIGlmIChnZXR0ZXIgJiYgZ2V0dGVyLmlzUmVhY3RXYXJuaW5nKSByZXR1cm4gITE7XG4gICAgICB9XG4gICAgICByZXR1cm4gdm9pZCAwICE9PSBjb25maWcua2V5O1xuICAgIH1cbiAgICBmdW5jdGlvbiBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihwcm9wcywgZGlzcGxheU5hbWUpIHtcbiAgICAgIGZ1bmN0aW9uIHdhcm5BYm91dEFjY2Vzc2luZ0tleSgpIHtcbiAgICAgICAgc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24gfHxcbiAgICAgICAgICAoKHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duID0gITApLFxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICBcIiVzOiBga2V5YCBpcyBub3QgYSBwcm9wLiBUcnlpbmcgdG8gYWNjZXNzIGl0IHdpbGwgcmVzdWx0IGluIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgdmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCBwcm9wLiAoaHR0cHM6Ly9yZWFjdC5kZXYvbGluay9zcGVjaWFsLXByb3BzKVwiLFxuICAgICAgICAgICAgZGlzcGxheU5hbWVcbiAgICAgICAgICApKTtcbiAgICAgIH1cbiAgICAgIHdhcm5BYm91dEFjY2Vzc2luZ0tleS5pc1JlYWN0V2FybmluZyA9ICEwO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCBcImtleVwiLCB7XG4gICAgICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nS2V5LFxuICAgICAgICBjb25maWd1cmFibGU6ICEwXG4gICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZWxlbWVudFJlZkdldHRlcldpdGhEZXByZWNhdGlvbldhcm5pbmcoKSB7XG4gICAgICB2YXIgY29tcG9uZW50TmFtZSA9IGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0aGlzLnR5cGUpO1xuICAgICAgZGlkV2FybkFib3V0RWxlbWVudFJlZltjb21wb25lbnROYW1lXSB8fFxuICAgICAgICAoKGRpZFdhcm5BYm91dEVsZW1lbnRSZWZbY29tcG9uZW50TmFtZV0gPSAhMCksXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgXCJBY2Nlc3NpbmcgZWxlbWVudC5yZWYgd2FzIHJlbW92ZWQgaW4gUmVhY3QgMTkuIHJlZiBpcyBub3cgYSByZWd1bGFyIHByb3AuIEl0IHdpbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBKU1ggRWxlbWVudCB0eXBlIGluIGEgZnV0dXJlIHJlbGVhc2UuXCJcbiAgICAgICAgKSk7XG4gICAgICBjb21wb25lbnROYW1lID0gdGhpcy5wcm9wcy5yZWY7XG4gICAgICByZXR1cm4gdm9pZCAwICE9PSBjb21wb25lbnROYW1lID8gY29tcG9uZW50TmFtZSA6IG51bGw7XG4gICAgfVxuICAgIGZ1bmN0aW9uIFJlYWN0RWxlbWVudCh0eXBlLCBrZXksIHByb3BzLCBvd25lciwgZGVidWdTdGFjaywgZGVidWdUYXNrKSB7XG4gICAgICB2YXIgcmVmUHJvcCA9IHByb3BzLnJlZjtcbiAgICAgIHR5cGUgPSB7XG4gICAgICAgICQkdHlwZW9mOiBSRUFDVF9FTEVNRU5UX1RZUEUsXG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBwcm9wczogcHJvcHMsXG4gICAgICAgIF9vd25lcjogb3duZXJcbiAgICAgIH07XG4gICAgICBudWxsICE9PSAodm9pZCAwICE9PSByZWZQcm9wID8gcmVmUHJvcCA6IG51bGwpXG4gICAgICAgID8gT2JqZWN0LmRlZmluZVByb3BlcnR5KHR5cGUsIFwicmVmXCIsIHtcbiAgICAgICAgICAgIGVudW1lcmFibGU6ICExLFxuICAgICAgICAgICAgZ2V0OiBlbGVtZW50UmVmR2V0dGVyV2l0aERlcHJlY2F0aW9uV2FybmluZ1xuICAgICAgICAgIH0pXG4gICAgICAgIDogT2JqZWN0LmRlZmluZVByb3BlcnR5KHR5cGUsIFwicmVmXCIsIHsgZW51bWVyYWJsZTogITEsIHZhbHVlOiBudWxsIH0pO1xuICAgICAgdHlwZS5fc3RvcmUgPSB7fTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0eXBlLl9zdG9yZSwgXCJ2YWxpZGF0ZWRcIiwge1xuICAgICAgICBjb25maWd1cmFibGU6ICExLFxuICAgICAgICBlbnVtZXJhYmxlOiAhMSxcbiAgICAgICAgd3JpdGFibGU6ICEwLFxuICAgICAgICB2YWx1ZTogMFxuICAgICAgfSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodHlwZSwgXCJfZGVidWdJbmZvXCIsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiAhMSxcbiAgICAgICAgZW51bWVyYWJsZTogITEsXG4gICAgICAgIHdyaXRhYmxlOiAhMCxcbiAgICAgICAgdmFsdWU6IG51bGxcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHR5cGUsIFwiX2RlYnVnU3RhY2tcIiwge1xuICAgICAgICBjb25maWd1cmFibGU6ICExLFxuICAgICAgICBlbnVtZXJhYmxlOiAhMSxcbiAgICAgICAgd3JpdGFibGU6ICEwLFxuICAgICAgICB2YWx1ZTogZGVidWdTdGFja1xuICAgICAgfSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodHlwZSwgXCJfZGVidWdUYXNrXCIsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiAhMSxcbiAgICAgICAgZW51bWVyYWJsZTogITEsXG4gICAgICAgIHdyaXRhYmxlOiAhMCxcbiAgICAgICAgdmFsdWU6IGRlYnVnVGFza1xuICAgICAgfSk7XG4gICAgICBPYmplY3QuZnJlZXplICYmIChPYmplY3QuZnJlZXplKHR5cGUucHJvcHMpLCBPYmplY3QuZnJlZXplKHR5cGUpKTtcbiAgICAgIHJldHVybiB0eXBlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjbG9uZUFuZFJlcGxhY2VLZXkob2xkRWxlbWVudCwgbmV3S2V5KSB7XG4gICAgICBuZXdLZXkgPSBSZWFjdEVsZW1lbnQoXG4gICAgICAgIG9sZEVsZW1lbnQudHlwZSxcbiAgICAgICAgbmV3S2V5LFxuICAgICAgICBvbGRFbGVtZW50LnByb3BzLFxuICAgICAgICBvbGRFbGVtZW50Ll9vd25lcixcbiAgICAgICAgb2xkRWxlbWVudC5fZGVidWdTdGFjayxcbiAgICAgICAgb2xkRWxlbWVudC5fZGVidWdUYXNrXG4gICAgICApO1xuICAgICAgb2xkRWxlbWVudC5fc3RvcmUgJiZcbiAgICAgICAgKG5ld0tleS5fc3RvcmUudmFsaWRhdGVkID0gb2xkRWxlbWVudC5fc3RvcmUudmFsaWRhdGVkKTtcbiAgICAgIHJldHVybiBuZXdLZXk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHZhbGlkYXRlQ2hpbGRLZXlzKG5vZGUpIHtcbiAgICAgIGlzVmFsaWRFbGVtZW50KG5vZGUpXG4gICAgICAgID8gbm9kZS5fc3RvcmUgJiYgKG5vZGUuX3N0b3JlLnZhbGlkYXRlZCA9IDEpXG4gICAgICAgIDogXCJvYmplY3RcIiA9PT0gdHlwZW9mIG5vZGUgJiZcbiAgICAgICAgICBudWxsICE9PSBub2RlICYmXG4gICAgICAgICAgbm9kZS4kJHR5cGVvZiA9PT0gUkVBQ1RfTEFaWV9UWVBFICYmXG4gICAgICAgICAgKFwiZnVsZmlsbGVkXCIgPT09IG5vZGUuX3BheWxvYWQuc3RhdHVzXG4gICAgICAgICAgICA/IGlzVmFsaWRFbGVtZW50KG5vZGUuX3BheWxvYWQudmFsdWUpICYmXG4gICAgICAgICAgICAgIG5vZGUuX3BheWxvYWQudmFsdWUuX3N0b3JlICYmXG4gICAgICAgICAgICAgIChub2RlLl9wYXlsb2FkLnZhbHVlLl9zdG9yZS52YWxpZGF0ZWQgPSAxKVxuICAgICAgICAgICAgOiBub2RlLl9zdG9yZSAmJiAobm9kZS5fc3RvcmUudmFsaWRhdGVkID0gMSkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBpc1ZhbGlkRWxlbWVudChvYmplY3QpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiBvYmplY3QgJiZcbiAgICAgICAgbnVsbCAhPT0gb2JqZWN0ICYmXG4gICAgICAgIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFXG4gICAgICApO1xuICAgIH1cbiAgICBmdW5jdGlvbiBlc2NhcGUoa2V5KSB7XG4gICAgICB2YXIgZXNjYXBlckxvb2t1cCA9IHsgXCI9XCI6IFwiPTBcIiwgXCI6XCI6IFwiPTJcIiB9O1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgXCIkXCIgK1xuICAgICAgICBrZXkucmVwbGFjZSgvWz06XS9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgICAgICByZXR1cm4gZXNjYXBlckxvb2t1cFttYXRjaF07XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgICBmdW5jdGlvbiBnZXRFbGVtZW50S2V5KGVsZW1lbnQsIGluZGV4KSB7XG4gICAgICByZXR1cm4gXCJvYmplY3RcIiA9PT0gdHlwZW9mIGVsZW1lbnQgJiZcbiAgICAgICAgbnVsbCAhPT0gZWxlbWVudCAmJlxuICAgICAgICBudWxsICE9IGVsZW1lbnQua2V5XG4gICAgICAgID8gKGNoZWNrS2V5U3RyaW5nQ29lcmNpb24oZWxlbWVudC5rZXkpLCBlc2NhcGUoXCJcIiArIGVsZW1lbnQua2V5KSlcbiAgICAgICAgOiBpbmRleC50b1N0cmluZygzNik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlc29sdmVUaGVuYWJsZSh0aGVuYWJsZSkge1xuICAgICAgc3dpdGNoICh0aGVuYWJsZS5zdGF0dXMpIHtcbiAgICAgICAgY2FzZSBcImZ1bGZpbGxlZFwiOlxuICAgICAgICAgIHJldHVybiB0aGVuYWJsZS52YWx1ZTtcbiAgICAgICAgY2FzZSBcInJlamVjdGVkXCI6XG4gICAgICAgICAgdGhyb3cgdGhlbmFibGUucmVhc29uO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHN3aXRjaCAoXG4gICAgICAgICAgICAoXCJzdHJpbmdcIiA9PT0gdHlwZW9mIHRoZW5hYmxlLnN0YXR1c1xuICAgICAgICAgICAgICA/IHRoZW5hYmxlLnRoZW4obm9vcCwgbm9vcClcbiAgICAgICAgICAgICAgOiAoKHRoZW5hYmxlLnN0YXR1cyA9IFwicGVuZGluZ1wiKSxcbiAgICAgICAgICAgICAgICB0aGVuYWJsZS50aGVuKFxuICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGZ1bGZpbGxlZFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIFwicGVuZGluZ1wiID09PSB0aGVuYWJsZS5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAgICAgICAoKHRoZW5hYmxlLnN0YXR1cyA9IFwiZnVsZmlsbGVkXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICh0aGVuYWJsZS52YWx1ZSA9IGZ1bGZpbGxlZFZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIFwicGVuZGluZ1wiID09PSB0aGVuYWJsZS5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAgICAgICAoKHRoZW5hYmxlLnN0YXR1cyA9IFwicmVqZWN0ZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgKHRoZW5hYmxlLnJlYXNvbiA9IGVycm9yKSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKSksXG4gICAgICAgICAgICB0aGVuYWJsZS5zdGF0dXMpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBjYXNlIFwiZnVsZmlsbGVkXCI6XG4gICAgICAgICAgICAgIHJldHVybiB0aGVuYWJsZS52YWx1ZTtcbiAgICAgICAgICAgIGNhc2UgXCJyZWplY3RlZFwiOlxuICAgICAgICAgICAgICB0aHJvdyB0aGVuYWJsZS5yZWFzb247XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgICAgdGhyb3cgdGhlbmFibGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1hcEludG9BcnJheShjaGlsZHJlbiwgYXJyYXksIGVzY2FwZWRQcmVmaXgsIG5hbWVTb0ZhciwgY2FsbGJhY2spIHtcbiAgICAgIHZhciB0eXBlID0gdHlwZW9mIGNoaWxkcmVuO1xuICAgICAgaWYgKFwidW5kZWZpbmVkXCIgPT09IHR5cGUgfHwgXCJib29sZWFuXCIgPT09IHR5cGUpIGNoaWxkcmVuID0gbnVsbDtcbiAgICAgIHZhciBpbnZva2VDYWxsYmFjayA9ICExO1xuICAgICAgaWYgKG51bGwgPT09IGNoaWxkcmVuKSBpbnZva2VDYWxsYmFjayA9ICEwO1xuICAgICAgZWxzZVxuICAgICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgICBjYXNlIFwiYmlnaW50XCI6XG4gICAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjpcbiAgICAgICAgICAgIGludm9rZUNhbGxiYWNrID0gITA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICAgICAgICBzd2l0Y2ggKGNoaWxkcmVuLiQkdHlwZW9mKSB7XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfRUxFTUVOVF9UWVBFOlxuICAgICAgICAgICAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgICAgICAgICAgIGludm9rZUNhbGxiYWNrID0gITA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfTEFaWV9UWVBFOlxuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAoaW52b2tlQ2FsbGJhY2sgPSBjaGlsZHJlbi5faW5pdCksXG4gICAgICAgICAgICAgICAgICBtYXBJbnRvQXJyYXkoXG4gICAgICAgICAgICAgICAgICAgIGludm9rZUNhbGxiYWNrKGNoaWxkcmVuLl9wYXlsb2FkKSxcbiAgICAgICAgICAgICAgICAgICAgYXJyYXksXG4gICAgICAgICAgICAgICAgICAgIGVzY2FwZWRQcmVmaXgsXG4gICAgICAgICAgICAgICAgICAgIG5hbWVTb0ZhcixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICBpZiAoaW52b2tlQ2FsbGJhY2spIHtcbiAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSBjaGlsZHJlbjtcbiAgICAgICAgY2FsbGJhY2sgPSBjYWxsYmFjayhpbnZva2VDYWxsYmFjayk7XG4gICAgICAgIHZhciBjaGlsZEtleSA9XG4gICAgICAgICAgXCJcIiA9PT0gbmFtZVNvRmFyID8gXCIuXCIgKyBnZXRFbGVtZW50S2V5KGludm9rZUNhbGxiYWNrLCAwKSA6IG5hbWVTb0ZhcjtcbiAgICAgICAgaXNBcnJheUltcGwoY2FsbGJhY2spXG4gICAgICAgICAgPyAoKGVzY2FwZWRQcmVmaXggPSBcIlwiKSxcbiAgICAgICAgICAgIG51bGwgIT0gY2hpbGRLZXkgJiZcbiAgICAgICAgICAgICAgKGVzY2FwZWRQcmVmaXggPVxuICAgICAgICAgICAgICAgIGNoaWxkS2V5LnJlcGxhY2UodXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXgsIFwiJCYvXCIpICsgXCIvXCIpLFxuICAgICAgICAgICAgbWFwSW50b0FycmF5KGNhbGxiYWNrLCBhcnJheSwgZXNjYXBlZFByZWZpeCwgXCJcIiwgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGM7XG4gICAgICAgICAgICB9KSlcbiAgICAgICAgICA6IG51bGwgIT0gY2FsbGJhY2sgJiZcbiAgICAgICAgICAgIChpc1ZhbGlkRWxlbWVudChjYWxsYmFjaykgJiZcbiAgICAgICAgICAgICAgKG51bGwgIT0gY2FsbGJhY2sua2V5ICYmXG4gICAgICAgICAgICAgICAgKChpbnZva2VDYWxsYmFjayAmJiBpbnZva2VDYWxsYmFjay5rZXkgPT09IGNhbGxiYWNrLmtleSkgfHxcbiAgICAgICAgICAgICAgICAgIGNoZWNrS2V5U3RyaW5nQ29lcmNpb24oY2FsbGJhY2sua2V5KSksXG4gICAgICAgICAgICAgIChlc2NhcGVkUHJlZml4ID0gY2xvbmVBbmRSZXBsYWNlS2V5KFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrLFxuICAgICAgICAgICAgICAgIGVzY2FwZWRQcmVmaXggK1xuICAgICAgICAgICAgICAgICAgKG51bGwgPT0gY2FsbGJhY2sua2V5IHx8XG4gICAgICAgICAgICAgICAgICAoaW52b2tlQ2FsbGJhY2sgJiYgaW52b2tlQ2FsbGJhY2sua2V5ID09PSBjYWxsYmFjay5rZXkpXG4gICAgICAgICAgICAgICAgICAgID8gXCJcIlxuICAgICAgICAgICAgICAgICAgICA6IChcIlwiICsgY2FsbGJhY2sua2V5KS5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIiQmL1wiXG4gICAgICAgICAgICAgICAgICAgICAgKSArIFwiL1wiKSArXG4gICAgICAgICAgICAgICAgICBjaGlsZEtleVxuICAgICAgICAgICAgICApKSxcbiAgICAgICAgICAgICAgXCJcIiAhPT0gbmFtZVNvRmFyICYmXG4gICAgICAgICAgICAgICAgbnVsbCAhPSBpbnZva2VDYWxsYmFjayAmJlxuICAgICAgICAgICAgICAgIGlzVmFsaWRFbGVtZW50KGludm9rZUNhbGxiYWNrKSAmJlxuICAgICAgICAgICAgICAgIG51bGwgPT0gaW52b2tlQ2FsbGJhY2sua2V5ICYmXG4gICAgICAgICAgICAgICAgaW52b2tlQ2FsbGJhY2suX3N0b3JlICYmXG4gICAgICAgICAgICAgICAgIWludm9rZUNhbGxiYWNrLl9zdG9yZS52YWxpZGF0ZWQgJiZcbiAgICAgICAgICAgICAgICAoZXNjYXBlZFByZWZpeC5fc3RvcmUudmFsaWRhdGVkID0gMiksXG4gICAgICAgICAgICAgIChjYWxsYmFjayA9IGVzY2FwZWRQcmVmaXgpKSxcbiAgICAgICAgICAgIGFycmF5LnB1c2goY2FsbGJhY2spKTtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICBpbnZva2VDYWxsYmFjayA9IDA7XG4gICAgICBjaGlsZEtleSA9IFwiXCIgPT09IG5hbWVTb0ZhciA/IFwiLlwiIDogbmFtZVNvRmFyICsgXCI6XCI7XG4gICAgICBpZiAoaXNBcnJheUltcGwoY2hpbGRyZW4pKVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKVxuICAgICAgICAgIChuYW1lU29GYXIgPSBjaGlsZHJlbltpXSksXG4gICAgICAgICAgICAodHlwZSA9IGNoaWxkS2V5ICsgZ2V0RWxlbWVudEtleShuYW1lU29GYXIsIGkpKSxcbiAgICAgICAgICAgIChpbnZva2VDYWxsYmFjayArPSBtYXBJbnRvQXJyYXkoXG4gICAgICAgICAgICAgIG5hbWVTb0ZhcixcbiAgICAgICAgICAgICAgYXJyYXksXG4gICAgICAgICAgICAgIGVzY2FwZWRQcmVmaXgsXG4gICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgIGNhbGxiYWNrXG4gICAgICAgICAgICApKTtcbiAgICAgIGVsc2UgaWYgKCgoaSA9IGdldEl0ZXJhdG9yRm4oY2hpbGRyZW4pKSwgXCJmdW5jdGlvblwiID09PSB0eXBlb2YgaSkpXG4gICAgICAgIGZvciAoXG4gICAgICAgICAgaSA9PT0gY2hpbGRyZW4uZW50cmllcyAmJlxuICAgICAgICAgICAgKGRpZFdhcm5BYm91dE1hcHMgfHxcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICAgIFwiVXNpbmcgTWFwcyBhcyBjaGlsZHJlbiBpcyBub3Qgc3VwcG9ydGVkLiBVc2UgYW4gYXJyYXkgb2Yga2V5ZWQgUmVhY3RFbGVtZW50cyBpbnN0ZWFkLlwiXG4gICAgICAgICAgICAgICksXG4gICAgICAgICAgICAoZGlkV2FybkFib3V0TWFwcyA9ICEwKSksXG4gICAgICAgICAgICBjaGlsZHJlbiA9IGkuY2FsbChjaGlsZHJlbiksXG4gICAgICAgICAgICBpID0gMDtcbiAgICAgICAgICAhKG5hbWVTb0ZhciA9IGNoaWxkcmVuLm5leHQoKSkuZG9uZTtcblxuICAgICAgICApXG4gICAgICAgICAgKG5hbWVTb0ZhciA9IG5hbWVTb0Zhci52YWx1ZSksXG4gICAgICAgICAgICAodHlwZSA9IGNoaWxkS2V5ICsgZ2V0RWxlbWVudEtleShuYW1lU29GYXIsIGkrKykpLFxuICAgICAgICAgICAgKGludm9rZUNhbGxiYWNrICs9IG1hcEludG9BcnJheShcbiAgICAgICAgICAgICAgbmFtZVNvRmFyLFxuICAgICAgICAgICAgICBhcnJheSxcbiAgICAgICAgICAgICAgZXNjYXBlZFByZWZpeCxcbiAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgICAgICkpO1xuICAgICAgZWxzZSBpZiAoXCJvYmplY3RcIiA9PT0gdHlwZSkge1xuICAgICAgICBpZiAoXCJmdW5jdGlvblwiID09PSB0eXBlb2YgY2hpbGRyZW4udGhlbilcbiAgICAgICAgICByZXR1cm4gbWFwSW50b0FycmF5KFxuICAgICAgICAgICAgcmVzb2x2ZVRoZW5hYmxlKGNoaWxkcmVuKSxcbiAgICAgICAgICAgIGFycmF5LFxuICAgICAgICAgICAgZXNjYXBlZFByZWZpeCxcbiAgICAgICAgICAgIG5hbWVTb0ZhcixcbiAgICAgICAgICAgIGNhbGxiYWNrXG4gICAgICAgICAgKTtcbiAgICAgICAgYXJyYXkgPSBTdHJpbmcoY2hpbGRyZW4pO1xuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICBcIk9iamVjdHMgYXJlIG5vdCB2YWxpZCBhcyBhIFJlYWN0IGNoaWxkIChmb3VuZDogXCIgK1xuICAgICAgICAgICAgKFwiW29iamVjdCBPYmplY3RdXCIgPT09IGFycmF5XG4gICAgICAgICAgICAgID8gXCJvYmplY3Qgd2l0aCBrZXlzIHtcIiArIE9iamVjdC5rZXlzKGNoaWxkcmVuKS5qb2luKFwiLCBcIikgKyBcIn1cIlxuICAgICAgICAgICAgICA6IGFycmF5KSArXG4gICAgICAgICAgICBcIikuIElmIHlvdSBtZWFudCB0byByZW5kZXIgYSBjb2xsZWN0aW9uIG9mIGNoaWxkcmVuLCB1c2UgYW4gYXJyYXkgaW5zdGVhZC5cIlxuICAgICAgICApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGludm9rZUNhbGxiYWNrO1xuICAgIH1cbiAgICBmdW5jdGlvbiBtYXBDaGlsZHJlbihjaGlsZHJlbiwgZnVuYywgY29udGV4dCkge1xuICAgICAgaWYgKG51bGwgPT0gY2hpbGRyZW4pIHJldHVybiBjaGlsZHJlbjtcbiAgICAgIHZhciByZXN1bHQgPSBbXSxcbiAgICAgICAgY291bnQgPSAwO1xuICAgICAgbWFwSW50b0FycmF5KGNoaWxkcmVuLCByZXN1bHQsIFwiXCIsIFwiXCIsIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICByZXR1cm4gZnVuYy5jYWxsKGNvbnRleHQsIGNoaWxkLCBjb3VudCsrKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gbGF6eUluaXRpYWxpemVyKHBheWxvYWQpIHtcbiAgICAgIGlmICgtMSA9PT0gcGF5bG9hZC5fc3RhdHVzKSB7XG4gICAgICAgIHZhciBpb0luZm8gPSBwYXlsb2FkLl9pb0luZm87XG4gICAgICAgIG51bGwgIT0gaW9JbmZvICYmIChpb0luZm8uc3RhcnQgPSBpb0luZm8uZW5kID0gcGVyZm9ybWFuY2Uubm93KCkpO1xuICAgICAgICBpb0luZm8gPSBwYXlsb2FkLl9yZXN1bHQ7XG4gICAgICAgIHZhciB0aGVuYWJsZSA9IGlvSW5mbygpO1xuICAgICAgICB0aGVuYWJsZS50aGVuKFxuICAgICAgICAgIGZ1bmN0aW9uIChtb2R1bGVPYmplY3QpIHtcbiAgICAgICAgICAgIGlmICgwID09PSBwYXlsb2FkLl9zdGF0dXMgfHwgLTEgPT09IHBheWxvYWQuX3N0YXR1cykge1xuICAgICAgICAgICAgICBwYXlsb2FkLl9zdGF0dXMgPSAxO1xuICAgICAgICAgICAgICBwYXlsb2FkLl9yZXN1bHQgPSBtb2R1bGVPYmplY3Q7XG4gICAgICAgICAgICAgIHZhciBfaW9JbmZvID0gcGF5bG9hZC5faW9JbmZvO1xuICAgICAgICAgICAgICBudWxsICE9IF9pb0luZm8gJiYgKF9pb0luZm8uZW5kID0gcGVyZm9ybWFuY2Uubm93KCkpO1xuICAgICAgICAgICAgICB2b2lkIDAgPT09IHRoZW5hYmxlLnN0YXR1cyAmJlxuICAgICAgICAgICAgICAgICgodGhlbmFibGUuc3RhdHVzID0gXCJmdWxmaWxsZWRcIiksXG4gICAgICAgICAgICAgICAgKHRoZW5hYmxlLnZhbHVlID0gbW9kdWxlT2JqZWN0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICgwID09PSBwYXlsb2FkLl9zdGF0dXMgfHwgLTEgPT09IHBheWxvYWQuX3N0YXR1cykge1xuICAgICAgICAgICAgICBwYXlsb2FkLl9zdGF0dXMgPSAyO1xuICAgICAgICAgICAgICBwYXlsb2FkLl9yZXN1bHQgPSBlcnJvcjtcbiAgICAgICAgICAgICAgdmFyIF9pb0luZm8yID0gcGF5bG9hZC5faW9JbmZvO1xuICAgICAgICAgICAgICBudWxsICE9IF9pb0luZm8yICYmIChfaW9JbmZvMi5lbmQgPSBwZXJmb3JtYW5jZS5ub3coKSk7XG4gICAgICAgICAgICAgIHZvaWQgMCA9PT0gdGhlbmFibGUuc3RhdHVzICYmXG4gICAgICAgICAgICAgICAgKCh0aGVuYWJsZS5zdGF0dXMgPSBcInJlamVjdGVkXCIpLCAodGhlbmFibGUucmVhc29uID0gZXJyb3IpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIGlvSW5mbyA9IHBheWxvYWQuX2lvSW5mbztcbiAgICAgICAgaWYgKG51bGwgIT0gaW9JbmZvKSB7XG4gICAgICAgICAgaW9JbmZvLnZhbHVlID0gdGhlbmFibGU7XG4gICAgICAgICAgdmFyIGRpc3BsYXlOYW1lID0gdGhlbmFibGUuZGlzcGxheU5hbWU7XG4gICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGRpc3BsYXlOYW1lICYmIChpb0luZm8ubmFtZSA9IGRpc3BsYXlOYW1lKTtcbiAgICAgICAgfVxuICAgICAgICAtMSA9PT0gcGF5bG9hZC5fc3RhdHVzICYmXG4gICAgICAgICAgKChwYXlsb2FkLl9zdGF0dXMgPSAwKSwgKHBheWxvYWQuX3Jlc3VsdCA9IHRoZW5hYmxlKSk7XG4gICAgICB9XG4gICAgICBpZiAoMSA9PT0gcGF5bG9hZC5fc3RhdHVzKVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIChpb0luZm8gPSBwYXlsb2FkLl9yZXN1bHQpLFxuICAgICAgICAgIHZvaWQgMCA9PT0gaW9JbmZvICYmXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICBcImxhenk6IEV4cGVjdGVkIHRoZSByZXN1bHQgb2YgYSBkeW5hbWljIGltcG9ydCgpIGNhbGwuIEluc3RlYWQgcmVjZWl2ZWQ6ICVzXFxuXFxuWW91ciBjb2RlIHNob3VsZCBsb29rIGxpa2U6IFxcbiAgY29uc3QgTXlDb21wb25lbnQgPSBsYXp5KCgpID0+IGltcG9ydCgnLi9NeUNvbXBvbmVudCcpKVxcblxcbkRpZCB5b3UgYWNjaWRlbnRhbGx5IHB1dCBjdXJseSBicmFjZXMgYXJvdW5kIHRoZSBpbXBvcnQ/XCIsXG4gICAgICAgICAgICAgIGlvSW5mb1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICBcImRlZmF1bHRcIiBpbiBpb0luZm8gfHxcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgIFwibGF6eTogRXhwZWN0ZWQgdGhlIHJlc3VsdCBvZiBhIGR5bmFtaWMgaW1wb3J0KCkgY2FsbC4gSW5zdGVhZCByZWNlaXZlZDogJXNcXG5cXG5Zb3VyIGNvZGUgc2hvdWxkIGxvb2sgbGlrZTogXFxuICBjb25zdCBNeUNvbXBvbmVudCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL015Q29tcG9uZW50JykpXCIsXG4gICAgICAgICAgICAgIGlvSW5mb1xuICAgICAgICAgICAgKSxcbiAgICAgICAgICBpb0luZm8uZGVmYXVsdFxuICAgICAgICApO1xuICAgICAgdGhyb3cgcGF5bG9hZC5fcmVzdWx0O1xuICAgIH1cbiAgICBmdW5jdGlvbiByZXNvbHZlRGlzcGF0Y2hlcigpIHtcbiAgICAgIHZhciBkaXNwYXRjaGVyID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuSDtcbiAgICAgIG51bGwgPT09IGRpc3BhdGNoZXIgJiZcbiAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICBcIkludmFsaWQgaG9vayBjYWxsLiBIb29rcyBjYW4gb25seSBiZSBjYWxsZWQgaW5zaWRlIG9mIHRoZSBib2R5IG9mIGEgZnVuY3Rpb24gY29tcG9uZW50LiBUaGlzIGNvdWxkIGhhcHBlbiBmb3Igb25lIG9mIHRoZSBmb2xsb3dpbmcgcmVhc29uczpcXG4xLiBZb3UgbWlnaHQgaGF2ZSBtaXNtYXRjaGluZyB2ZXJzaW9ucyBvZiBSZWFjdCBhbmQgdGhlIHJlbmRlcmVyIChzdWNoIGFzIFJlYWN0IERPTSlcXG4yLiBZb3UgbWlnaHQgYmUgYnJlYWtpbmcgdGhlIFJ1bGVzIG9mIEhvb2tzXFxuMy4gWW91IG1pZ2h0IGhhdmUgbW9yZSB0aGFuIG9uZSBjb3B5IG9mIFJlYWN0IGluIHRoZSBzYW1lIGFwcFxcblNlZSBodHRwczovL3JlYWN0LmRldi9saW5rL2ludmFsaWQtaG9vay1jYWxsIGZvciB0aXBzIGFib3V0IGhvdyB0byBkZWJ1ZyBhbmQgZml4IHRoaXMgcHJvYmxlbS5cIlxuICAgICAgICApO1xuICAgICAgcmV0dXJuIGRpc3BhdGNoZXI7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlbGVhc2VBc3luY1RyYW5zaXRpb24oKSB7XG4gICAgICBSZWFjdFNoYXJlZEludGVybmFscy5hc3luY1RyYW5zaXRpb25zLS07XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVucXVldWVUYXNrKHRhc2spIHtcbiAgICAgIGlmIChudWxsID09PSBlbnF1ZXVlVGFza0ltcGwpXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIHJlcXVpcmVTdHJpbmcgPSAoXCJyZXF1aXJlXCIgKyBNYXRoLnJhbmRvbSgpKS5zbGljZSgwLCA3KTtcbiAgICAgICAgICBlbnF1ZXVlVGFza0ltcGwgPSAobW9kdWxlICYmIG1vZHVsZVtyZXF1aXJlU3RyaW5nXSkuY2FsbChcbiAgICAgICAgICAgIG1vZHVsZSxcbiAgICAgICAgICAgIFwidGltZXJzXCJcbiAgICAgICAgICApLnNldEltbWVkaWF0ZTtcbiAgICAgICAgfSBjYXRjaCAoX2Vycikge1xuICAgICAgICAgIGVucXVldWVUYXNrSW1wbCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgITEgPT09IGRpZFdhcm5BYm91dE1lc3NhZ2VDaGFubmVsICYmXG4gICAgICAgICAgICAgICgoZGlkV2FybkFib3V0TWVzc2FnZUNoYW5uZWwgPSAhMCksXG4gICAgICAgICAgICAgIFwidW5kZWZpbmVkXCIgPT09IHR5cGVvZiBNZXNzYWdlQ2hhbm5lbCAmJlxuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICAgICBcIlRoaXMgYnJvd3NlciBkb2VzIG5vdCBoYXZlIGEgTWVzc2FnZUNoYW5uZWwgaW1wbGVtZW50YXRpb24sIHNvIGVucXVldWluZyB0YXNrcyB2aWEgYXdhaXQgYWN0KGFzeW5jICgpID0+IC4uLikgd2lsbCBmYWlsLiBQbGVhc2UgZmlsZSBhbiBpc3N1ZSBhdCBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzIGlmIHlvdSBlbmNvdW50ZXIgdGhpcyB3YXJuaW5nLlwiXG4gICAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgICB2YXIgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgICAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBjYWxsYmFjaztcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDIucG9zdE1lc3NhZ2Uodm9pZCAwKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICByZXR1cm4gZW5xdWV1ZVRhc2tJbXBsKHRhc2spO1xuICAgIH1cbiAgICBmdW5jdGlvbiBhZ2dyZWdhdGVFcnJvcnMoZXJyb3JzKSB7XG4gICAgICByZXR1cm4gMSA8IGVycm9ycy5sZW5ndGggJiYgXCJmdW5jdGlvblwiID09PSB0eXBlb2YgQWdncmVnYXRlRXJyb3JcbiAgICAgICAgPyBuZXcgQWdncmVnYXRlRXJyb3IoZXJyb3JzKVxuICAgICAgICA6IGVycm9yc1swXTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcG9wQWN0U2NvcGUocHJldkFjdFF1ZXVlLCBwcmV2QWN0U2NvcGVEZXB0aCkge1xuICAgICAgcHJldkFjdFNjb3BlRGVwdGggIT09IGFjdFNjb3BlRGVwdGggLSAxICYmXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgXCJZb3Ugc2VlbSB0byBoYXZlIG92ZXJsYXBwaW5nIGFjdCgpIGNhbGxzLCB0aGlzIGlzIG5vdCBzdXBwb3J0ZWQuIEJlIHN1cmUgdG8gYXdhaXQgcHJldmlvdXMgYWN0KCkgY2FsbHMgYmVmb3JlIG1ha2luZyBhIG5ldyBvbmUuIFwiXG4gICAgICAgICk7XG4gICAgICBhY3RTY29wZURlcHRoID0gcHJldkFjdFNjb3BlRGVwdGg7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlY3Vyc2l2ZWx5Rmx1c2hBc3luY0FjdFdvcmsocmV0dXJuVmFsdWUsIHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIHF1ZXVlID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuYWN0UXVldWU7XG4gICAgICBpZiAobnVsbCAhPT0gcXVldWUpXG4gICAgICAgIGlmICgwICE9PSBxdWV1ZS5sZW5ndGgpXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZsdXNoQWN0UXVldWUocXVldWUpO1xuICAgICAgICAgICAgZW5xdWV1ZVRhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICByZXR1cm4gcmVjdXJzaXZlbHlGbHVzaEFzeW5jQWN0V29yayhyZXR1cm5WYWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBSZWFjdFNoYXJlZEludGVybmFscy50aHJvd25FcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICBlbHNlIFJlYWN0U2hhcmVkSW50ZXJuYWxzLmFjdFF1ZXVlID0gbnVsbDtcbiAgICAgIDAgPCBSZWFjdFNoYXJlZEludGVybmFscy50aHJvd25FcnJvcnMubGVuZ3RoXG4gICAgICAgID8gKChxdWV1ZSA9IGFnZ3JlZ2F0ZUVycm9ycyhSZWFjdFNoYXJlZEludGVybmFscy50aHJvd25FcnJvcnMpKSxcbiAgICAgICAgICAoUmVhY3RTaGFyZWRJbnRlcm5hbHMudGhyb3duRXJyb3JzLmxlbmd0aCA9IDApLFxuICAgICAgICAgIHJlamVjdChxdWV1ZSkpXG4gICAgICAgIDogcmVzb2x2ZShyZXR1cm5WYWx1ZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZsdXNoQWN0UXVldWUocXVldWUpIHtcbiAgICAgIGlmICghaXNGbHVzaGluZykge1xuICAgICAgICBpc0ZsdXNoaW5nID0gITA7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmb3IgKDsgaSA8IHF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2sgPSBxdWV1ZVtpXTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgUmVhY3RTaGFyZWRJbnRlcm5hbHMuZGlkVXNlUHJvbWlzZSA9ICExO1xuICAgICAgICAgICAgICB2YXIgY29udGludWF0aW9uID0gY2FsbGJhY2soITEpO1xuICAgICAgICAgICAgICBpZiAobnVsbCAhPT0gY29udGludWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgaWYgKFJlYWN0U2hhcmVkSW50ZXJuYWxzLmRpZFVzZVByb21pc2UpIHtcbiAgICAgICAgICAgICAgICAgIHF1ZXVlW2ldID0gY2FsbGJhY2s7XG4gICAgICAgICAgICAgICAgICBxdWV1ZS5zcGxpY2UoMCwgaSk7XG4gICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gY29udGludWF0aW9uO1xuICAgICAgICAgICAgICB9IGVsc2UgYnJlYWs7XG4gICAgICAgICAgICB9IHdoaWxlICgxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcXVldWUubGVuZ3RoID0gMDtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBxdWV1ZS5zcGxpY2UoMCwgaSArIDEpLCBSZWFjdFNoYXJlZEludGVybmFscy50aHJvd25FcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgaXNGbHVzaGluZyA9ICExO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18gJiZcbiAgICAgIFwiZnVuY3Rpb25cIiA9PT1cbiAgICAgICAgdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RhcnQgJiZcbiAgICAgIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RhcnQoRXJyb3IoKSk7XG4gICAgdmFyIFJFQUNUX0VMRU1FTlRfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC50cmFuc2l0aW9uYWwuZWxlbWVudFwiKSxcbiAgICAgIFJFQUNUX1BPUlRBTF9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LnBvcnRhbFwiKSxcbiAgICAgIFJFQUNUX0ZSQUdNRU5UX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QuZnJhZ21lbnRcIiksXG4gICAgICBSRUFDVF9TVFJJQ1RfTU9ERV9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LnN0cmljdF9tb2RlXCIpLFxuICAgICAgUkVBQ1RfUFJPRklMRVJfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5wcm9maWxlclwiKSxcbiAgICAgIFJFQUNUX0NPTlNVTUVSX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QuY29uc3VtZXJcIiksXG4gICAgICBSRUFDVF9DT05URVhUX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QuY29udGV4dFwiKSxcbiAgICAgIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QuZm9yd2FyZF9yZWZcIiksXG4gICAgICBSRUFDVF9TVVNQRU5TRV9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LnN1c3BlbnNlXCIpLFxuICAgICAgUkVBQ1RfU1VTUEVOU0VfTElTVF9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LnN1c3BlbnNlX2xpc3RcIiksXG4gICAgICBSRUFDVF9NRU1PX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QubWVtb1wiKSxcbiAgICAgIFJFQUNUX0xBWllfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5sYXp5XCIpLFxuICAgICAgUkVBQ1RfQUNUSVZJVFlfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5hY3Rpdml0eVwiKSxcbiAgICAgIE1BWUJFX0lURVJBVE9SX1NZTUJPTCA9IFN5bWJvbC5pdGVyYXRvcixcbiAgICAgIGRpZFdhcm5TdGF0ZVVwZGF0ZUZvclVubW91bnRlZENvbXBvbmVudCA9IHt9LFxuICAgICAgUmVhY3ROb29wVXBkYXRlUXVldWUgPSB7XG4gICAgICAgIGlzTW91bnRlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAhMTtcbiAgICAgICAgfSxcbiAgICAgICAgZW5xdWV1ZUZvcmNlVXBkYXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UpIHtcbiAgICAgICAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgXCJmb3JjZVVwZGF0ZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW5xdWV1ZVJlcGxhY2VTdGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlKSB7XG4gICAgICAgICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsIFwicmVwbGFjZVN0YXRlXCIpO1xuICAgICAgICB9LFxuICAgICAgICBlbnF1ZXVlU2V0U3RhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSkge1xuICAgICAgICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCBcInNldFN0YXRlXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgYXNzaWduID0gT2JqZWN0LmFzc2lnbixcbiAgICAgIGVtcHR5T2JqZWN0ID0ge307XG4gICAgT2JqZWN0LmZyZWV6ZShlbXB0eU9iamVjdCk7XG4gICAgQ29tcG9uZW50LnByb3RvdHlwZS5pc1JlYWN0Q29tcG9uZW50ID0ge307XG4gICAgQ29tcG9uZW50LnByb3RvdHlwZS5zZXRTdGF0ZSA9IGZ1bmN0aW9uIChwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgICBpZiAoXG4gICAgICAgIFwib2JqZWN0XCIgIT09IHR5cGVvZiBwYXJ0aWFsU3RhdGUgJiZcbiAgICAgICAgXCJmdW5jdGlvblwiICE9PSB0eXBlb2YgcGFydGlhbFN0YXRlICYmXG4gICAgICAgIG51bGwgIT0gcGFydGlhbFN0YXRlXG4gICAgICApXG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgIFwidGFrZXMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcyB0byB1cGRhdGUgb3IgYSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFuIG9iamVjdCBvZiBzdGF0ZSB2YXJpYWJsZXMuXCJcbiAgICAgICAgKTtcbiAgICAgIHRoaXMudXBkYXRlci5lbnF1ZXVlU2V0U3RhdGUodGhpcywgcGFydGlhbFN0YXRlLCBjYWxsYmFjaywgXCJzZXRTdGF0ZVwiKTtcbiAgICB9O1xuICAgIENvbXBvbmVudC5wcm90b3R5cGUuZm9yY2VVcGRhdGUgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMudXBkYXRlci5lbnF1ZXVlRm9yY2VVcGRhdGUodGhpcywgY2FsbGJhY2ssIFwiZm9yY2VVcGRhdGVcIik7XG4gICAgfTtcbiAgICB2YXIgZGVwcmVjYXRlZEFQSXMgPSB7XG4gICAgICBpc01vdW50ZWQ6IFtcbiAgICAgICAgXCJpc01vdW50ZWRcIixcbiAgICAgICAgXCJJbnN0ZWFkLCBtYWtlIHN1cmUgdG8gY2xlYW4gdXAgc3Vic2NyaXB0aW9ucyBhbmQgcGVuZGluZyByZXF1ZXN0cyBpbiBjb21wb25lbnRXaWxsVW5tb3VudCB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcy5cIlxuICAgICAgXSxcbiAgICAgIHJlcGxhY2VTdGF0ZTogW1xuICAgICAgICBcInJlcGxhY2VTdGF0ZVwiLFxuICAgICAgICBcIlJlZmFjdG9yIHlvdXIgY29kZSB0byB1c2Ugc2V0U3RhdGUgaW5zdGVhZCAoc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMvMzIzNikuXCJcbiAgICAgIF1cbiAgICB9O1xuICAgIGZvciAoZm5OYW1lIGluIGRlcHJlY2F0ZWRBUElzKVxuICAgICAgZGVwcmVjYXRlZEFQSXMuaGFzT3duUHJvcGVydHkoZm5OYW1lKSAmJlxuICAgICAgICBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcoZm5OYW1lLCBkZXByZWNhdGVkQVBJc1tmbk5hbWVdKTtcbiAgICBDb21wb25lbnREdW1teS5wcm90b3R5cGUgPSBDb21wb25lbnQucHJvdG90eXBlO1xuICAgIGRlcHJlY2F0ZWRBUElzID0gUHVyZUNvbXBvbmVudC5wcm90b3R5cGUgPSBuZXcgQ29tcG9uZW50RHVtbXkoKTtcbiAgICBkZXByZWNhdGVkQVBJcy5jb25zdHJ1Y3RvciA9IFB1cmVDb21wb25lbnQ7XG4gICAgYXNzaWduKGRlcHJlY2F0ZWRBUElzLCBDb21wb25lbnQucHJvdG90eXBlKTtcbiAgICBkZXByZWNhdGVkQVBJcy5pc1B1cmVSZWFjdENvbXBvbmVudCA9ICEwO1xuICAgIHZhciBpc0FycmF5SW1wbCA9IEFycmF5LmlzQXJyYXksXG4gICAgICBSRUFDVF9DTElFTlRfUkVGRVJFTkNFID0gU3ltYm9sLmZvcihcInJlYWN0LmNsaWVudC5yZWZlcmVuY2VcIiksXG4gICAgICBSZWFjdFNoYXJlZEludGVybmFscyA9IHtcbiAgICAgICAgSDogbnVsbCxcbiAgICAgICAgQTogbnVsbCxcbiAgICAgICAgVDogbnVsbCxcbiAgICAgICAgUzogbnVsbCxcbiAgICAgICAgYWN0UXVldWU6IG51bGwsXG4gICAgICAgIGFzeW5jVHJhbnNpdGlvbnM6IDAsXG4gICAgICAgIGlzQmF0Y2hpbmdMZWdhY3k6ICExLFxuICAgICAgICBkaWRTY2hlZHVsZUxlZ2FjeVVwZGF0ZTogITEsXG4gICAgICAgIGRpZFVzZVByb21pc2U6ICExLFxuICAgICAgICB0aHJvd25FcnJvcnM6IFtdLFxuICAgICAgICBnZXRDdXJyZW50U3RhY2s6IG51bGwsXG4gICAgICAgIHJlY2VudGx5Q3JlYXRlZE93bmVyU3RhY2tzOiAwXG4gICAgICB9LFxuICAgICAgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LFxuICAgICAgY3JlYXRlVGFzayA9IGNvbnNvbGUuY3JlYXRlVGFza1xuICAgICAgICA/IGNvbnNvbGUuY3JlYXRlVGFza1xuICAgICAgICA6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgIH07XG4gICAgZGVwcmVjYXRlZEFQSXMgPSB7XG4gICAgICByZWFjdF9zdGFja19ib3R0b21fZnJhbWU6IGZ1bmN0aW9uIChjYWxsU3RhY2tGb3JFcnJvcikge1xuICAgICAgICByZXR1cm4gY2FsbFN0YWNrRm9yRXJyb3IoKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biwgZGlkV2FybkFib3V0T2xkSlNYUnVudGltZTtcbiAgICB2YXIgZGlkV2FybkFib3V0RWxlbWVudFJlZiA9IHt9O1xuICAgIHZhciB1bmtub3duT3duZXJEZWJ1Z1N0YWNrID0gZGVwcmVjYXRlZEFQSXMucmVhY3Rfc3RhY2tfYm90dG9tX2ZyYW1lLmJpbmQoXG4gICAgICBkZXByZWNhdGVkQVBJcyxcbiAgICAgIFVua25vd25Pd25lclxuICAgICkoKTtcbiAgICB2YXIgdW5rbm93bk93bmVyRGVidWdUYXNrID0gY3JlYXRlVGFzayhnZXRUYXNrTmFtZShVbmtub3duT3duZXIpKTtcbiAgICB2YXIgZGlkV2FybkFib3V0TWFwcyA9ICExLFxuICAgICAgdXNlclByb3ZpZGVkS2V5RXNjYXBlUmVnZXggPSAvXFwvKy9nLFxuICAgICAgcmVwb3J0R2xvYmFsRXJyb3IgPVxuICAgICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiByZXBvcnRFcnJvclxuICAgICAgICAgID8gcmVwb3J0RXJyb3JcbiAgICAgICAgICA6IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgXCJvYmplY3RcIiA9PT0gdHlwZW9mIHdpbmRvdyAmJlxuICAgICAgICAgICAgICAgIFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIHdpbmRvdy5FcnJvckV2ZW50XG4gICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHZhciBldmVudCA9IG5ldyB3aW5kb3cuRXJyb3JFdmVudChcImVycm9yXCIsIHtcbiAgICAgICAgICAgICAgICAgIGJ1YmJsZXM6ICEwLFxuICAgICAgICAgICAgICAgICAgY2FuY2VsYWJsZTogITAsXG4gICAgICAgICAgICAgICAgICBtZXNzYWdlOlxuICAgICAgICAgICAgICAgICAgICBcIm9iamVjdFwiID09PSB0eXBlb2YgZXJyb3IgJiZcbiAgICAgICAgICAgICAgICAgICAgbnVsbCAhPT0gZXJyb3IgJiZcbiAgICAgICAgICAgICAgICAgICAgXCJzdHJpbmdcIiA9PT0gdHlwZW9mIGVycm9yLm1lc3NhZ2VcbiAgICAgICAgICAgICAgICAgICAgICA/IFN0cmluZyhlcnJvci5tZXNzYWdlKVxuICAgICAgICAgICAgICAgICAgICAgIDogU3RyaW5nKGVycm9yKSxcbiAgICAgICAgICAgICAgICAgIGVycm9yOiBlcnJvclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmICghd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpKSByZXR1cm47XG4gICAgICAgICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICAgICAgXCJvYmplY3RcIiA9PT0gdHlwZW9mIHByb2Nlc3MgJiZcbiAgICAgICAgICAgICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBwcm9jZXNzLmVtaXRcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgcHJvY2Vzcy5lbWl0KFwidW5jYXVnaHRFeGNlcHRpb25cIiwgZXJyb3IpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIH0sXG4gICAgICBkaWRXYXJuQWJvdXRNZXNzYWdlQ2hhbm5lbCA9ICExLFxuICAgICAgZW5xdWV1ZVRhc2tJbXBsID0gbnVsbCxcbiAgICAgIGFjdFNjb3BlRGVwdGggPSAwLFxuICAgICAgZGlkV2Fybk5vQXdhaXRBY3QgPSAhMSxcbiAgICAgIGlzRmx1c2hpbmcgPSAhMSxcbiAgICAgIHF1ZXVlU2V2ZXJhbE1pY3JvdGFza3MgPVxuICAgICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBxdWV1ZU1pY3JvdGFza1xuICAgICAgICAgID8gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgIHF1ZXVlTWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcXVldWVNaWNyb3Rhc2soY2FsbGJhY2spO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICA6IGVucXVldWVUYXNrO1xuICAgIGRlcHJlY2F0ZWRBUElzID0gT2JqZWN0LmZyZWV6ZSh7XG4gICAgICBfX3Byb3RvX186IG51bGwsXG4gICAgICBjOiBmdW5jdGlvbiAoc2l6ZSkge1xuICAgICAgICByZXR1cm4gcmVzb2x2ZURpc3BhdGNoZXIoKS51c2VNZW1vQ2FjaGUoc2l6ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGZuTmFtZSA9IHtcbiAgICAgIG1hcDogbWFwQ2hpbGRyZW4sXG4gICAgICBmb3JFYWNoOiBmdW5jdGlvbiAoY2hpbGRyZW4sIGZvckVhY2hGdW5jLCBmb3JFYWNoQ29udGV4dCkge1xuICAgICAgICBtYXBDaGlsZHJlbihcbiAgICAgICAgICBjaGlsZHJlbixcbiAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmb3JFYWNoRnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgZm9yRWFjaENvbnRleHRcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICBjb3VudDogZnVuY3Rpb24gKGNoaWxkcmVuKSB7XG4gICAgICAgIHZhciBuID0gMDtcbiAgICAgICAgbWFwQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBuKys7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbjtcbiAgICAgIH0sXG4gICAgICB0b0FycmF5OiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBtYXBDaGlsZHJlbihjaGlsZHJlbiwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgICAgICByZXR1cm4gY2hpbGQ7XG4gICAgICAgICAgfSkgfHwgW11cbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICBvbmx5OiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICAgICAgaWYgKCFpc1ZhbGlkRWxlbWVudChjaGlsZHJlbikpXG4gICAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgICBcIlJlYWN0LkNoaWxkcmVuLm9ubHkgZXhwZWN0ZWQgdG8gcmVjZWl2ZSBhIHNpbmdsZSBSZWFjdCBlbGVtZW50IGNoaWxkLlwiXG4gICAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xuICAgICAgfVxuICAgIH07XG4gICAgZXhwb3J0cy5BY3Rpdml0eSA9IFJFQUNUX0FDVElWSVRZX1RZUEU7XG4gICAgZXhwb3J0cy5DaGlsZHJlbiA9IGZuTmFtZTtcbiAgICBleHBvcnRzLkNvbXBvbmVudCA9IENvbXBvbmVudDtcbiAgICBleHBvcnRzLkZyYWdtZW50ID0gUkVBQ1RfRlJBR01FTlRfVFlQRTtcbiAgICBleHBvcnRzLlByb2ZpbGVyID0gUkVBQ1RfUFJPRklMRVJfVFlQRTtcbiAgICBleHBvcnRzLlB1cmVDb21wb25lbnQgPSBQdXJlQ29tcG9uZW50O1xuICAgIGV4cG9ydHMuU3RyaWN0TW9kZSA9IFJFQUNUX1NUUklDVF9NT0RFX1RZUEU7XG4gICAgZXhwb3J0cy5TdXNwZW5zZSA9IFJFQUNUX1NVU1BFTlNFX1RZUEU7XG4gICAgZXhwb3J0cy5fX0NMSUVOVF9JTlRFUk5BTFNfRE9fTk9UX1VTRV9PUl9XQVJOX1VTRVJTX1RIRVlfQ0FOTk9UX1VQR1JBREUgPVxuICAgICAgUmVhY3RTaGFyZWRJbnRlcm5hbHM7XG4gICAgZXhwb3J0cy5fX0NPTVBJTEVSX1JVTlRJTUUgPSBkZXByZWNhdGVkQVBJcztcbiAgICBleHBvcnRzLmFjdCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgdmFyIHByZXZBY3RRdWV1ZSA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLmFjdFF1ZXVlLFxuICAgICAgICBwcmV2QWN0U2NvcGVEZXB0aCA9IGFjdFNjb3BlRGVwdGg7XG4gICAgICBhY3RTY29wZURlcHRoKys7XG4gICAgICB2YXIgcXVldWUgPSAoUmVhY3RTaGFyZWRJbnRlcm5hbHMuYWN0UXVldWUgPVxuICAgICAgICAgIG51bGwgIT09IHByZXZBY3RRdWV1ZSA/IHByZXZBY3RRdWV1ZSA6IFtdKSxcbiAgICAgICAgZGlkQXdhaXRBY3RDYWxsID0gITE7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gY2FsbGJhY2soKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgIH1cbiAgICAgIGlmICgwIDwgUmVhY3RTaGFyZWRJbnRlcm5hbHMudGhyb3duRXJyb3JzLmxlbmd0aClcbiAgICAgICAgdGhyb3cgKFxuICAgICAgICAgIChwb3BBY3RTY29wZShwcmV2QWN0UXVldWUsIHByZXZBY3RTY29wZURlcHRoKSxcbiAgICAgICAgICAoY2FsbGJhY2sgPSBhZ2dyZWdhdGVFcnJvcnMoUmVhY3RTaGFyZWRJbnRlcm5hbHMudGhyb3duRXJyb3JzKSksXG4gICAgICAgICAgKFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9ycy5sZW5ndGggPSAwKSxcbiAgICAgICAgICBjYWxsYmFjaylcbiAgICAgICAgKTtcbiAgICAgIGlmIChcbiAgICAgICAgbnVsbCAhPT0gcmVzdWx0ICYmXG4gICAgICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiByZXN1bHQgJiZcbiAgICAgICAgXCJmdW5jdGlvblwiID09PSB0eXBlb2YgcmVzdWx0LnRoZW5cbiAgICAgICkge1xuICAgICAgICB2YXIgdGhlbmFibGUgPSByZXN1bHQ7XG4gICAgICAgIHF1ZXVlU2V2ZXJhbE1pY3JvdGFza3MoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGRpZEF3YWl0QWN0Q2FsbCB8fFxuICAgICAgICAgICAgZGlkV2Fybk5vQXdhaXRBY3QgfHxcbiAgICAgICAgICAgICgoZGlkV2Fybk5vQXdhaXRBY3QgPSAhMCksXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICBcIllvdSBjYWxsZWQgYWN0KGFzeW5jICgpID0+IC4uLikgd2l0aG91dCBhd2FpdC4gVGhpcyBjb3VsZCBsZWFkIHRvIHVuZXhwZWN0ZWQgdGVzdGluZyBiZWhhdmlvdXIsIGludGVybGVhdmluZyBtdWx0aXBsZSBhY3QgY2FsbHMgYW5kIG1peGluZyB0aGVpciBzY29wZXMuIFlvdSBzaG91bGQgLSBhd2FpdCBhY3QoYXN5bmMgKCkgPT4gLi4uKTtcIlxuICAgICAgICAgICAgKSk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRoZW46IGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGRpZEF3YWl0QWN0Q2FsbCA9ICEwO1xuICAgICAgICAgICAgdGhlbmFibGUudGhlbihcbiAgICAgICAgICAgICAgZnVuY3Rpb24gKHJldHVyblZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcG9wQWN0U2NvcGUocHJldkFjdFF1ZXVlLCBwcmV2QWN0U2NvcGVEZXB0aCk7XG4gICAgICAgICAgICAgICAgaWYgKDAgPT09IHByZXZBY3RTY29wZURlcHRoKSB7XG4gICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBmbHVzaEFjdFF1ZXVlKHF1ZXVlKSxcbiAgICAgICAgICAgICAgICAgICAgICBlbnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVjdXJzaXZlbHlGbHVzaEFzeW5jQWN0V29yayhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdFxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yJDApIHtcbiAgICAgICAgICAgICAgICAgICAgUmVhY3RTaGFyZWRJbnRlcm5hbHMudGhyb3duRXJyb3JzLnB1c2goZXJyb3IkMCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBpZiAoMCA8IFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF90aHJvd25FcnJvciA9IGFnZ3JlZ2F0ZUVycm9ycyhcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdFNoYXJlZEludGVybmFscy50aHJvd25FcnJvcnNcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgUmVhY3RTaGFyZWRJbnRlcm5hbHMudGhyb3duRXJyb3JzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChfdGhyb3duRXJyb3IpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJldHVyblZhbHVlKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgcG9wQWN0U2NvcGUocHJldkFjdFF1ZXVlLCBwcmV2QWN0U2NvcGVEZXB0aCk7XG4gICAgICAgICAgICAgICAgMCA8IFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9ycy5sZW5ndGhcbiAgICAgICAgICAgICAgICAgID8gKChlcnJvciA9IGFnZ3JlZ2F0ZUVycm9ycyhcbiAgICAgICAgICAgICAgICAgICAgICBSZWFjdFNoYXJlZEludGVybmFscy50aHJvd25FcnJvcnNcbiAgICAgICAgICAgICAgICAgICAgKSksXG4gICAgICAgICAgICAgICAgICAgIChSZWFjdFNoYXJlZEludGVybmFscy50aHJvd25FcnJvcnMubGVuZ3RoID0gMCksXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcikpXG4gICAgICAgICAgICAgICAgICA6IHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgdmFyIHJldHVyblZhbHVlJGpzY29tcCQwID0gcmVzdWx0O1xuICAgICAgcG9wQWN0U2NvcGUocHJldkFjdFF1ZXVlLCBwcmV2QWN0U2NvcGVEZXB0aCk7XG4gICAgICAwID09PSBwcmV2QWN0U2NvcGVEZXB0aCAmJlxuICAgICAgICAoZmx1c2hBY3RRdWV1ZShxdWV1ZSksXG4gICAgICAgIDAgIT09IHF1ZXVlLmxlbmd0aCAmJlxuICAgICAgICAgIHF1ZXVlU2V2ZXJhbE1pY3JvdGFza3MoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZGlkQXdhaXRBY3RDYWxsIHx8XG4gICAgICAgICAgICAgIGRpZFdhcm5Ob0F3YWl0QWN0IHx8XG4gICAgICAgICAgICAgICgoZGlkV2Fybk5vQXdhaXRBY3QgPSAhMCksXG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICAgXCJBIGNvbXBvbmVudCBzdXNwZW5kZWQgaW5zaWRlIGFuIGBhY3RgIHNjb3BlLCBidXQgdGhlIGBhY3RgIGNhbGwgd2FzIG5vdCBhd2FpdGVkLiBXaGVuIHRlc3RpbmcgUmVhY3QgY29tcG9uZW50cyB0aGF0IGRlcGVuZCBvbiBhc3luY2hyb25vdXMgZGF0YSwgeW91IG11c3QgYXdhaXQgdGhlIHJlc3VsdDpcXG5cXG5hd2FpdCBhY3QoKCkgPT4gLi4uKVwiXG4gICAgICAgICAgICAgICkpO1xuICAgICAgICAgIH0pLFxuICAgICAgICAoUmVhY3RTaGFyZWRJbnRlcm5hbHMuYWN0UXVldWUgPSBudWxsKSk7XG4gICAgICBpZiAoMCA8IFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9ycy5sZW5ndGgpXG4gICAgICAgIHRocm93IChcbiAgICAgICAgICAoKGNhbGxiYWNrID0gYWdncmVnYXRlRXJyb3JzKFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9ycykpLFxuICAgICAgICAgIChSZWFjdFNoYXJlZEludGVybmFscy50aHJvd25FcnJvcnMubGVuZ3RoID0gMCksXG4gICAgICAgICAgY2FsbGJhY2spXG4gICAgICAgICk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgZGlkQXdhaXRBY3RDYWxsID0gITA7XG4gICAgICAgICAgMCA9PT0gcHJldkFjdFNjb3BlRGVwdGhcbiAgICAgICAgICAgID8gKChSZWFjdFNoYXJlZEludGVybmFscy5hY3RRdWV1ZSA9IHF1ZXVlKSxcbiAgICAgICAgICAgICAgZW5xdWV1ZVRhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWN1cnNpdmVseUZsdXNoQXN5bmNBY3RXb3JrKFxuICAgICAgICAgICAgICAgICAgcmV0dXJuVmFsdWUkanNjb21wJDAsXG4gICAgICAgICAgICAgICAgICByZXNvbHZlLFxuICAgICAgICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICA6IHJlc29sdmUocmV0dXJuVmFsdWUkanNjb21wJDApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH07XG4gICAgZXhwb3J0cy5jYWNoZSA9IGZ1bmN0aW9uIChmbikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH07XG4gICAgZXhwb3J0cy5jYWNoZVNpZ25hbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgZXhwb3J0cy5jYXB0dXJlT3duZXJTdGFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBnZXRDdXJyZW50U3RhY2sgPSBSZWFjdFNoYXJlZEludGVybmFscy5nZXRDdXJyZW50U3RhY2s7XG4gICAgICByZXR1cm4gbnVsbCA9PT0gZ2V0Q3VycmVudFN0YWNrID8gbnVsbCA6IGdldEN1cnJlbnRTdGFjaygpO1xuICAgIH07XG4gICAgZXhwb3J0cy5jbG9uZUVsZW1lbnQgPSBmdW5jdGlvbiAoZWxlbWVudCwgY29uZmlnLCBjaGlsZHJlbikge1xuICAgICAgaWYgKG51bGwgPT09IGVsZW1lbnQgfHwgdm9pZCAwID09PSBlbGVtZW50KVxuICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICBcIlRoZSBhcmd1bWVudCBtdXN0IGJlIGEgUmVhY3QgZWxlbWVudCwgYnV0IHlvdSBwYXNzZWQgXCIgK1xuICAgICAgICAgICAgZWxlbWVudCArXG4gICAgICAgICAgICBcIi5cIlxuICAgICAgICApO1xuICAgICAgdmFyIHByb3BzID0gYXNzaWduKHt9LCBlbGVtZW50LnByb3BzKSxcbiAgICAgICAga2V5ID0gZWxlbWVudC5rZXksXG4gICAgICAgIG93bmVyID0gZWxlbWVudC5fb3duZXI7XG4gICAgICBpZiAobnVsbCAhPSBjb25maWcpIHtcbiAgICAgICAgdmFyIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdDtcbiAgICAgICAgYToge1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBcInJlZlwiKSAmJlxuICAgICAgICAgICAgKEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoXG4gICAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgICAgXCJyZWZcIlxuICAgICAgICAgICAgKS5nZXQpICYmXG4gICAgICAgICAgICBKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQuaXNSZWFjdFdhcm5pbmdcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdCA9ICExO1xuICAgICAgICAgICAgYnJlYWsgYTtcbiAgICAgICAgICB9XG4gICAgICAgICAgSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0ID0gdm9pZCAwICE9PSBjb25maWcucmVmO1xuICAgICAgICB9XG4gICAgICAgIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdCAmJiAob3duZXIgPSBnZXRPd25lcigpKTtcbiAgICAgICAgaGFzVmFsaWRLZXkoY29uZmlnKSAmJlxuICAgICAgICAgIChjaGVja0tleVN0cmluZ0NvZXJjaW9uKGNvbmZpZy5rZXkpLCAoa2V5ID0gXCJcIiArIGNvbmZpZy5rZXkpKTtcbiAgICAgICAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpXG4gICAgICAgICAgIWhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgfHxcbiAgICAgICAgICAgIFwia2V5XCIgPT09IHByb3BOYW1lIHx8XG4gICAgICAgICAgICBcIl9fc2VsZlwiID09PSBwcm9wTmFtZSB8fFxuICAgICAgICAgICAgXCJfX3NvdXJjZVwiID09PSBwcm9wTmFtZSB8fFxuICAgICAgICAgICAgKFwicmVmXCIgPT09IHByb3BOYW1lICYmIHZvaWQgMCA9PT0gY29uZmlnLnJlZikgfHxcbiAgICAgICAgICAgIChwcm9wc1twcm9wTmFtZV0gPSBjb25maWdbcHJvcE5hbWVdKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wTmFtZSA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuICAgICAgaWYgKDEgPT09IHByb3BOYW1lKSBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgZWxzZSBpZiAoMSA8IHByb3BOYW1lKSB7XG4gICAgICAgIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdCA9IEFycmF5KHByb3BOYW1lKTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wTmFtZTsgaSsrKVxuICAgICAgICAgIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdFtpXSA9IGFyZ3VtZW50c1tpICsgMl07XG4gICAgICAgIHByb3BzLmNoaWxkcmVuID0gSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0O1xuICAgICAgfVxuICAgICAgcHJvcHMgPSBSZWFjdEVsZW1lbnQoXG4gICAgICAgIGVsZW1lbnQudHlwZSxcbiAgICAgICAga2V5LFxuICAgICAgICBwcm9wcyxcbiAgICAgICAgb3duZXIsXG4gICAgICAgIGVsZW1lbnQuX2RlYnVnU3RhY2ssXG4gICAgICAgIGVsZW1lbnQuX2RlYnVnVGFza1xuICAgICAgKTtcbiAgICAgIGZvciAoa2V5ID0gMjsga2V5IDwgYXJndW1lbnRzLmxlbmd0aDsga2V5KyspXG4gICAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1trZXldKTtcbiAgICAgIHJldHVybiBwcm9wcztcbiAgICB9O1xuICAgIGV4cG9ydHMuY3JlYXRlQ29udGV4dCA9IGZ1bmN0aW9uIChkZWZhdWx0VmFsdWUpIHtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IHtcbiAgICAgICAgJCR0eXBlb2Y6IFJFQUNUX0NPTlRFWFRfVFlQRSxcbiAgICAgICAgX2N1cnJlbnRWYWx1ZTogZGVmYXVsdFZhbHVlLFxuICAgICAgICBfY3VycmVudFZhbHVlMjogZGVmYXVsdFZhbHVlLFxuICAgICAgICBfdGhyZWFkQ291bnQ6IDAsXG4gICAgICAgIFByb3ZpZGVyOiBudWxsLFxuICAgICAgICBDb25zdW1lcjogbnVsbFxuICAgICAgfTtcbiAgICAgIGRlZmF1bHRWYWx1ZS5Qcm92aWRlciA9IGRlZmF1bHRWYWx1ZTtcbiAgICAgIGRlZmF1bHRWYWx1ZS5Db25zdW1lciA9IHtcbiAgICAgICAgJCR0eXBlb2Y6IFJFQUNUX0NPTlNVTUVSX1RZUEUsXG4gICAgICAgIF9jb250ZXh0OiBkZWZhdWx0VmFsdWVcbiAgICAgIH07XG4gICAgICBkZWZhdWx0VmFsdWUuX2N1cnJlbnRSZW5kZXJlciA9IG51bGw7XG4gICAgICBkZWZhdWx0VmFsdWUuX2N1cnJlbnRSZW5kZXJlcjIgPSBudWxsO1xuICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZTtcbiAgICB9O1xuICAgIGV4cG9ydHMuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICh0eXBlLCBjb25maWcsIGNoaWxkcmVuKSB7XG4gICAgICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKylcbiAgICAgICAgdmFsaWRhdGVDaGlsZEtleXMoYXJndW1lbnRzW2ldKTtcbiAgICAgIGkgPSB7fTtcbiAgICAgIHZhciBrZXkgPSBudWxsO1xuICAgICAgaWYgKG51bGwgIT0gY29uZmlnKVxuICAgICAgICBmb3IgKHByb3BOYW1lIGluIChkaWRXYXJuQWJvdXRPbGRKU1hSdW50aW1lIHx8XG4gICAgICAgICAgIShcIl9fc2VsZlwiIGluIGNvbmZpZykgfHxcbiAgICAgICAgICBcImtleVwiIGluIGNvbmZpZyB8fFxuICAgICAgICAgICgoZGlkV2FybkFib3V0T2xkSlNYUnVudGltZSA9ICEwKSxcbiAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICBcIllvdXIgYXBwIChvciBvbmUgb2YgaXRzIGRlcGVuZGVuY2llcykgaXMgdXNpbmcgYW4gb3V0ZGF0ZWQgSlNYIHRyYW5zZm9ybS4gVXBkYXRlIHRvIHRoZSBtb2Rlcm4gSlNYIHRyYW5zZm9ybSBmb3IgZmFzdGVyIHBlcmZvcm1hbmNlOiBodHRwczovL3JlYWN0LmRldi9saW5rL25ldy1qc3gtdHJhbnNmb3JtXCJcbiAgICAgICAgICApKSxcbiAgICAgICAgaGFzVmFsaWRLZXkoY29uZmlnKSAmJlxuICAgICAgICAgIChjaGVja0tleVN0cmluZ0NvZXJjaW9uKGNvbmZpZy5rZXkpLCAoa2V5ID0gXCJcIiArIGNvbmZpZy5rZXkpKSxcbiAgICAgICAgY29uZmlnKSlcbiAgICAgICAgICBoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmXG4gICAgICAgICAgICBcImtleVwiICE9PSBwcm9wTmFtZSAmJlxuICAgICAgICAgICAgXCJfX3NlbGZcIiAhPT0gcHJvcE5hbWUgJiZcbiAgICAgICAgICAgIFwiX19zb3VyY2VcIiAhPT0gcHJvcE5hbWUgJiZcbiAgICAgICAgICAgIChpW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV0pO1xuICAgICAgdmFyIGNoaWxkcmVuTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG4gICAgICBpZiAoMSA9PT0gY2hpbGRyZW5MZW5ndGgpIGkuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgICAgIGVsc2UgaWYgKDEgPCBjaGlsZHJlbkxlbmd0aCkge1xuICAgICAgICBmb3IgKFxuICAgICAgICAgIHZhciBjaGlsZEFycmF5ID0gQXJyYXkoY2hpbGRyZW5MZW5ndGgpLCBfaSA9IDA7XG4gICAgICAgICAgX2kgPCBjaGlsZHJlbkxlbmd0aDtcbiAgICAgICAgICBfaSsrXG4gICAgICAgIClcbiAgICAgICAgICBjaGlsZEFycmF5W19pXSA9IGFyZ3VtZW50c1tfaSArIDJdO1xuICAgICAgICBPYmplY3QuZnJlZXplICYmIE9iamVjdC5mcmVlemUoY2hpbGRBcnJheSk7XG4gICAgICAgIGkuY2hpbGRyZW4gPSBjaGlsZEFycmF5O1xuICAgICAgfVxuICAgICAgaWYgKHR5cGUgJiYgdHlwZS5kZWZhdWx0UHJvcHMpXG4gICAgICAgIGZvciAocHJvcE5hbWUgaW4gKChjaGlsZHJlbkxlbmd0aCA9IHR5cGUuZGVmYXVsdFByb3BzKSwgY2hpbGRyZW5MZW5ndGgpKVxuICAgICAgICAgIHZvaWQgMCA9PT0gaVtwcm9wTmFtZV0gJiYgKGlbcHJvcE5hbWVdID0gY2hpbGRyZW5MZW5ndGhbcHJvcE5hbWVdKTtcbiAgICAgIGtleSAmJlxuICAgICAgICBkZWZpbmVLZXlQcm9wV2FybmluZ0dldHRlcihcbiAgICAgICAgICBpLFxuICAgICAgICAgIFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIHR5cGVcbiAgICAgICAgICAgID8gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgXCJVbmtub3duXCJcbiAgICAgICAgICAgIDogdHlwZVxuICAgICAgICApO1xuICAgICAgdmFyIHByb3BOYW1lID0gMWU0ID4gUmVhY3RTaGFyZWRJbnRlcm5hbHMucmVjZW50bHlDcmVhdGVkT3duZXJTdGFja3MrKztcbiAgICAgIHJldHVybiBSZWFjdEVsZW1lbnQoXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGtleSxcbiAgICAgICAgaSxcbiAgICAgICAgZ2V0T3duZXIoKSxcbiAgICAgICAgcHJvcE5hbWUgPyBFcnJvcihcInJlYWN0LXN0YWNrLXRvcC1mcmFtZVwiKSA6IHVua25vd25Pd25lckRlYnVnU3RhY2ssXG4gICAgICAgIHByb3BOYW1lID8gY3JlYXRlVGFzayhnZXRUYXNrTmFtZSh0eXBlKSkgOiB1bmtub3duT3duZXJEZWJ1Z1Rhc2tcbiAgICAgICk7XG4gICAgfTtcbiAgICBleHBvcnRzLmNyZWF0ZVJlZiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciByZWZPYmplY3QgPSB7IGN1cnJlbnQ6IG51bGwgfTtcbiAgICAgIE9iamVjdC5zZWFsKHJlZk9iamVjdCk7XG4gICAgICByZXR1cm4gcmVmT2JqZWN0O1xuICAgIH07XG4gICAgZXhwb3J0cy5mb3J3YXJkUmVmID0gZnVuY3Rpb24gKHJlbmRlcikge1xuICAgICAgbnVsbCAhPSByZW5kZXIgJiYgcmVuZGVyLiQkdHlwZW9mID09PSBSRUFDVF9NRU1PX1RZUEVcbiAgICAgICAgPyBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgXCJmb3J3YXJkUmVmIHJlcXVpcmVzIGEgcmVuZGVyIGZ1bmN0aW9uIGJ1dCByZWNlaXZlZCBhIGBtZW1vYCBjb21wb25lbnQuIEluc3RlYWQgb2YgZm9yd2FyZFJlZihtZW1vKC4uLikpLCB1c2UgbWVtbyhmb3J3YXJkUmVmKC4uLikpLlwiXG4gICAgICAgICAgKVxuICAgICAgICA6IFwiZnVuY3Rpb25cIiAhPT0gdHlwZW9mIHJlbmRlclxuICAgICAgICAgID8gY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgXCJmb3J3YXJkUmVmIHJlcXVpcmVzIGEgcmVuZGVyIGZ1bmN0aW9uIGJ1dCB3YXMgZ2l2ZW4gJXMuXCIsXG4gICAgICAgICAgICAgIG51bGwgPT09IHJlbmRlciA/IFwibnVsbFwiIDogdHlwZW9mIHJlbmRlclxuICAgICAgICAgICAgKVxuICAgICAgICAgIDogMCAhPT0gcmVuZGVyLmxlbmd0aCAmJlxuICAgICAgICAgICAgMiAhPT0gcmVuZGVyLmxlbmd0aCAmJlxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgXCJmb3J3YXJkUmVmIHJlbmRlciBmdW5jdGlvbnMgYWNjZXB0IGV4YWN0bHkgdHdvIHBhcmFtZXRlcnM6IHByb3BzIGFuZCByZWYuICVzXCIsXG4gICAgICAgICAgICAgIDEgPT09IHJlbmRlci5sZW5ndGhcbiAgICAgICAgICAgICAgICA/IFwiRGlkIHlvdSBmb3JnZXQgdG8gdXNlIHRoZSByZWYgcGFyYW1ldGVyP1wiXG4gICAgICAgICAgICAgICAgOiBcIkFueSBhZGRpdGlvbmFsIHBhcmFtZXRlciB3aWxsIGJlIHVuZGVmaW5lZC5cIlxuICAgICAgICAgICAgKTtcbiAgICAgIG51bGwgIT0gcmVuZGVyICYmXG4gICAgICAgIG51bGwgIT0gcmVuZGVyLmRlZmF1bHRQcm9wcyAmJlxuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIFwiZm9yd2FyZFJlZiByZW5kZXIgZnVuY3Rpb25zIGRvIG5vdCBzdXBwb3J0IGRlZmF1bHRQcm9wcy4gRGlkIHlvdSBhY2NpZGVudGFsbHkgcGFzcyBhIFJlYWN0IGNvbXBvbmVudD9cIlxuICAgICAgICApO1xuICAgICAgdmFyIGVsZW1lbnRUeXBlID0geyAkJHR5cGVvZjogUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSwgcmVuZGVyOiByZW5kZXIgfSxcbiAgICAgICAgb3duTmFtZTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50VHlwZSwgXCJkaXNwbGF5TmFtZVwiLCB7XG4gICAgICAgIGVudW1lcmFibGU6ICExLFxuICAgICAgICBjb25maWd1cmFibGU6ICEwLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gb3duTmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgIG93bk5hbWUgPSBuYW1lO1xuICAgICAgICAgIHJlbmRlci5uYW1lIHx8XG4gICAgICAgICAgICByZW5kZXIuZGlzcGxheU5hbWUgfHxcbiAgICAgICAgICAgIChPYmplY3QuZGVmaW5lUHJvcGVydHkocmVuZGVyLCBcIm5hbWVcIiwgeyB2YWx1ZTogbmFtZSB9KSxcbiAgICAgICAgICAgIChyZW5kZXIuZGlzcGxheU5hbWUgPSBuYW1lKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGVsZW1lbnRUeXBlO1xuICAgIH07XG4gICAgZXhwb3J0cy5pc1ZhbGlkRWxlbWVudCA9IGlzVmFsaWRFbGVtZW50O1xuICAgIGV4cG9ydHMubGF6eSA9IGZ1bmN0aW9uIChjdG9yKSB7XG4gICAgICBjdG9yID0geyBfc3RhdHVzOiAtMSwgX3Jlc3VsdDogY3RvciB9O1xuICAgICAgdmFyIGxhenlUeXBlID0ge1xuICAgICAgICAgICQkdHlwZW9mOiBSRUFDVF9MQVpZX1RZUEUsXG4gICAgICAgICAgX3BheWxvYWQ6IGN0b3IsXG4gICAgICAgICAgX2luaXQ6IGxhenlJbml0aWFsaXplclxuICAgICAgICB9LFxuICAgICAgICBpb0luZm8gPSB7XG4gICAgICAgICAgbmFtZTogXCJsYXp5XCIsXG4gICAgICAgICAgc3RhcnQ6IC0xLFxuICAgICAgICAgIGVuZDogLTEsXG4gICAgICAgICAgdmFsdWU6IG51bGwsXG4gICAgICAgICAgb3duZXI6IG51bGwsXG4gICAgICAgICAgZGVidWdTdGFjazogRXJyb3IoXCJyZWFjdC1zdGFjay10b3AtZnJhbWVcIiksXG4gICAgICAgICAgZGVidWdUYXNrOiBjb25zb2xlLmNyZWF0ZVRhc2sgPyBjb25zb2xlLmNyZWF0ZVRhc2soXCJsYXp5KClcIikgOiBudWxsXG4gICAgICAgIH07XG4gICAgICBjdG9yLl9pb0luZm8gPSBpb0luZm87XG4gICAgICBsYXp5VHlwZS5fZGVidWdJbmZvID0gW3sgYXdhaXRlZDogaW9JbmZvIH1dO1xuICAgICAgcmV0dXJuIGxhenlUeXBlO1xuICAgIH07XG4gICAgZXhwb3J0cy5tZW1vID0gZnVuY3Rpb24gKHR5cGUsIGNvbXBhcmUpIHtcbiAgICAgIG51bGwgPT0gdHlwZSAmJlxuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIFwibWVtbzogVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgYSBjb21wb25lbnQuIEluc3RlYWQgcmVjZWl2ZWQ6ICVzXCIsXG4gICAgICAgICAgbnVsbCA9PT0gdHlwZSA/IFwibnVsbFwiIDogdHlwZW9mIHR5cGVcbiAgICAgICAgKTtcbiAgICAgIGNvbXBhcmUgPSB7XG4gICAgICAgICQkdHlwZW9mOiBSRUFDVF9NRU1PX1RZUEUsXG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGNvbXBhcmU6IHZvaWQgMCA9PT0gY29tcGFyZSA/IG51bGwgOiBjb21wYXJlXG4gICAgICB9O1xuICAgICAgdmFyIG93bk5hbWU7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29tcGFyZSwgXCJkaXNwbGF5TmFtZVwiLCB7XG4gICAgICAgIGVudW1lcmFibGU6ICExLFxuICAgICAgICBjb25maWd1cmFibGU6ICEwLFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gb3duTmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgIG93bk5hbWUgPSBuYW1lO1xuICAgICAgICAgIHR5cGUubmFtZSB8fFxuICAgICAgICAgICAgdHlwZS5kaXNwbGF5TmFtZSB8fFxuICAgICAgICAgICAgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0eXBlLCBcIm5hbWVcIiwgeyB2YWx1ZTogbmFtZSB9KSxcbiAgICAgICAgICAgICh0eXBlLmRpc3BsYXlOYW1lID0gbmFtZSkpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBjb21wYXJlO1xuICAgIH07XG4gICAgZXhwb3J0cy5zdGFydFRyYW5zaXRpb24gPSBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgIHZhciBwcmV2VHJhbnNpdGlvbiA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlQsXG4gICAgICAgIGN1cnJlbnRUcmFuc2l0aW9uID0ge307XG4gICAgICBjdXJyZW50VHJhbnNpdGlvbi5fdXBkYXRlZEZpYmVycyA9IG5ldyBTZXQoKTtcbiAgICAgIFJlYWN0U2hhcmVkSW50ZXJuYWxzLlQgPSBjdXJyZW50VHJhbnNpdGlvbjtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciByZXR1cm5WYWx1ZSA9IHNjb3BlKCksXG4gICAgICAgICAgb25TdGFydFRyYW5zaXRpb25GaW5pc2ggPSBSZWFjdFNoYXJlZEludGVybmFscy5TO1xuICAgICAgICBudWxsICE9PSBvblN0YXJ0VHJhbnNpdGlvbkZpbmlzaCAmJlxuICAgICAgICAgIG9uU3RhcnRUcmFuc2l0aW9uRmluaXNoKGN1cnJlbnRUcmFuc2l0aW9uLCByZXR1cm5WYWx1ZSk7XG4gICAgICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiByZXR1cm5WYWx1ZSAmJlxuICAgICAgICAgIG51bGwgIT09IHJldHVyblZhbHVlICYmXG4gICAgICAgICAgXCJmdW5jdGlvblwiID09PSB0eXBlb2YgcmV0dXJuVmFsdWUudGhlbiAmJlxuICAgICAgICAgIChSZWFjdFNoYXJlZEludGVybmFscy5hc3luY1RyYW5zaXRpb25zKyssXG4gICAgICAgICAgcmV0dXJuVmFsdWUudGhlbihyZWxlYXNlQXN5bmNUcmFuc2l0aW9uLCByZWxlYXNlQXN5bmNUcmFuc2l0aW9uKSxcbiAgICAgICAgICByZXR1cm5WYWx1ZS50aGVuKG5vb3AsIHJlcG9ydEdsb2JhbEVycm9yKSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXBvcnRHbG9iYWxFcnJvcihlcnJvcik7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICBudWxsID09PSBwcmV2VHJhbnNpdGlvbiAmJlxuICAgICAgICAgIGN1cnJlbnRUcmFuc2l0aW9uLl91cGRhdGVkRmliZXJzICYmXG4gICAgICAgICAgKChzY29wZSA9IGN1cnJlbnRUcmFuc2l0aW9uLl91cGRhdGVkRmliZXJzLnNpemUpLFxuICAgICAgICAgIGN1cnJlbnRUcmFuc2l0aW9uLl91cGRhdGVkRmliZXJzLmNsZWFyKCksXG4gICAgICAgICAgMTAgPCBzY29wZSAmJlxuICAgICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgICBcIkRldGVjdGVkIGEgbGFyZ2UgbnVtYmVyIG9mIHVwZGF0ZXMgaW5zaWRlIHN0YXJ0VHJhbnNpdGlvbi4gSWYgdGhpcyBpcyBkdWUgdG8gYSBzdWJzY3JpcHRpb24gcGxlYXNlIHJlLXdyaXRlIGl0IHRvIHVzZSBSZWFjdCBwcm92aWRlZCBob29rcy4gT3RoZXJ3aXNlIGNvbmN1cnJlbnQgbW9kZSBndWFyYW50ZWVzIGFyZSBvZmYgdGhlIHRhYmxlLlwiXG4gICAgICAgICAgICApKSxcbiAgICAgICAgICBudWxsICE9PSBwcmV2VHJhbnNpdGlvbiAmJlxuICAgICAgICAgICAgbnVsbCAhPT0gY3VycmVudFRyYW5zaXRpb24udHlwZXMgJiZcbiAgICAgICAgICAgIChudWxsICE9PSBwcmV2VHJhbnNpdGlvbi50eXBlcyAmJlxuICAgICAgICAgICAgICBwcmV2VHJhbnNpdGlvbi50eXBlcyAhPT0gY3VycmVudFRyYW5zaXRpb24udHlwZXMgJiZcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICBcIldlIGV4cGVjdGVkIGlubmVyIFRyYW5zaXRpb25zIHRvIGhhdmUgdHJhbnNmZXJyZWQgdGhlIG91dGVyIHR5cGVzIHNldCBhbmQgdGhhdCB5b3UgY2Fubm90IGFkZCB0byB0aGUgb3V0ZXIgVHJhbnNpdGlvbiB3aGlsZSBpbnNpZGUgdGhlIGlubmVyLlRoaXMgaXMgYSBidWcgaW4gUmVhY3QuXCJcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIChwcmV2VHJhbnNpdGlvbi50eXBlcyA9IGN1cnJlbnRUcmFuc2l0aW9uLnR5cGVzKSksXG4gICAgICAgICAgKFJlYWN0U2hhcmVkSW50ZXJuYWxzLlQgPSBwcmV2VHJhbnNpdGlvbik7XG4gICAgICB9XG4gICAgfTtcbiAgICBleHBvcnRzLnVuc3RhYmxlX3VzZUNhY2hlUmVmcmVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZUNhY2hlUmVmcmVzaCgpO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2UgPSBmdW5jdGlvbiAodXNhYmxlKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZURpc3BhdGNoZXIoKS51c2UodXNhYmxlKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudXNlQWN0aW9uU3RhdGUgPSBmdW5jdGlvbiAoYWN0aW9uLCBpbml0aWFsU3RhdGUsIHBlcm1hbGluaykge1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlQWN0aW9uU3RhdGUoXG4gICAgICAgIGFjdGlvbixcbiAgICAgICAgaW5pdGlhbFN0YXRlLFxuICAgICAgICBwZXJtYWxpbmtcbiAgICAgICk7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZUNhbGxiYWNrID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBkZXBzKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZURpc3BhdGNoZXIoKS51c2VDYWxsYmFjayhjYWxsYmFjaywgZGVwcyk7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZUNvbnRleHQgPSBmdW5jdGlvbiAoQ29udGV4dCkge1xuICAgICAgdmFyIGRpc3BhdGNoZXIgPSByZXNvbHZlRGlzcGF0Y2hlcigpO1xuICAgICAgQ29udGV4dC4kJHR5cGVvZiA9PT0gUkVBQ1RfQ09OU1VNRVJfVFlQRSAmJlxuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIFwiQ2FsbGluZyB1c2VDb250ZXh0KENvbnRleHQuQ29uc3VtZXIpIGlzIG5vdCBzdXBwb3J0ZWQgYW5kIHdpbGwgY2F1c2UgYnVncy4gRGlkIHlvdSBtZWFuIHRvIGNhbGwgdXNlQ29udGV4dChDb250ZXh0KSBpbnN0ZWFkP1wiXG4gICAgICAgICk7XG4gICAgICByZXR1cm4gZGlzcGF0Y2hlci51c2VDb250ZXh0KENvbnRleHQpO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2VEZWJ1Z1ZhbHVlID0gZnVuY3Rpb24gKHZhbHVlLCBmb3JtYXR0ZXJGbikge1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlRGVidWdWYWx1ZSh2YWx1ZSwgZm9ybWF0dGVyRm4pO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2VEZWZlcnJlZFZhbHVlID0gZnVuY3Rpb24gKHZhbHVlLCBpbml0aWFsVmFsdWUpIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZURlZmVycmVkVmFsdWUodmFsdWUsIGluaXRpYWxWYWx1ZSk7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZUVmZmVjdCA9IGZ1bmN0aW9uIChjcmVhdGUsIGRlcHMpIHtcbiAgICAgIG51bGwgPT0gY3JlYXRlICYmXG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBcIlJlYWN0IEhvb2sgdXNlRWZmZWN0IHJlcXVpcmVzIGFuIGVmZmVjdCBjYWxsYmFjay4gRGlkIHlvdSBmb3JnZXQgdG8gcGFzcyBhIGNhbGxiYWNrIHRvIHRoZSBob29rP1wiXG4gICAgICAgICk7XG4gICAgICByZXR1cm4gcmVzb2x2ZURpc3BhdGNoZXIoKS51c2VFZmZlY3QoY3JlYXRlLCBkZXBzKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudXNlRWZmZWN0RXZlbnQgPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZUVmZmVjdEV2ZW50KGNhbGxiYWNrKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudXNlSWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZURpc3BhdGNoZXIoKS51c2VJZCgpO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2VJbXBlcmF0aXZlSGFuZGxlID0gZnVuY3Rpb24gKHJlZiwgY3JlYXRlLCBkZXBzKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZURpc3BhdGNoZXIoKS51c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgY3JlYXRlLCBkZXBzKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudXNlSW5zZXJ0aW9uRWZmZWN0ID0gZnVuY3Rpb24gKGNyZWF0ZSwgZGVwcykge1xuICAgICAgbnVsbCA9PSBjcmVhdGUgJiZcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIFwiUmVhY3QgSG9vayB1c2VJbnNlcnRpb25FZmZlY3QgcmVxdWlyZXMgYW4gZWZmZWN0IGNhbGxiYWNrLiBEaWQgeW91IGZvcmdldCB0byBwYXNzIGEgY2FsbGJhY2sgdG8gdGhlIGhvb2s/XCJcbiAgICAgICAgKTtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZUluc2VydGlvbkVmZmVjdChjcmVhdGUsIGRlcHMpO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2VMYXlvdXRFZmZlY3QgPSBmdW5jdGlvbiAoY3JlYXRlLCBkZXBzKSB7XG4gICAgICBudWxsID09IGNyZWF0ZSAmJlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgXCJSZWFjdCBIb29rIHVzZUxheW91dEVmZmVjdCByZXF1aXJlcyBhbiBlZmZlY3QgY2FsbGJhY2suIERpZCB5b3UgZm9yZ2V0IHRvIHBhc3MgYSBjYWxsYmFjayB0byB0aGUgaG9vaz9cIlxuICAgICAgICApO1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlTGF5b3V0RWZmZWN0KGNyZWF0ZSwgZGVwcyk7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZU1lbW8gPSBmdW5jdGlvbiAoY3JlYXRlLCBkZXBzKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZURpc3BhdGNoZXIoKS51c2VNZW1vKGNyZWF0ZSwgZGVwcyk7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZU9wdGltaXN0aWMgPSBmdW5jdGlvbiAocGFzc3Rocm91Z2gsIHJlZHVjZXIpIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZU9wdGltaXN0aWMocGFzc3Rocm91Z2gsIHJlZHVjZXIpO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2VSZWR1Y2VyID0gZnVuY3Rpb24gKHJlZHVjZXIsIGluaXRpYWxBcmcsIGluaXQpIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZVJlZHVjZXIocmVkdWNlciwgaW5pdGlhbEFyZywgaW5pdCk7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZVJlZiA9IGZ1bmN0aW9uIChpbml0aWFsVmFsdWUpIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZVJlZihpbml0aWFsVmFsdWUpO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2VTdGF0ZSA9IGZ1bmN0aW9uIChpbml0aWFsU3RhdGUpIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZVN0YXRlKGluaXRpYWxTdGF0ZSk7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZVN5bmNFeHRlcm5hbFN0b3JlID0gZnVuY3Rpb24gKFxuICAgICAgc3Vic2NyaWJlLFxuICAgICAgZ2V0U25hcHNob3QsXG4gICAgICBnZXRTZXJ2ZXJTbmFwc2hvdFxuICAgICkge1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlU3luY0V4dGVybmFsU3RvcmUoXG4gICAgICAgIHN1YnNjcmliZSxcbiAgICAgICAgZ2V0U25hcHNob3QsXG4gICAgICAgIGdldFNlcnZlclNuYXBzaG90XG4gICAgICApO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2VUcmFuc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlVHJhbnNpdGlvbigpO1xuICAgIH07XG4gICAgZXhwb3J0cy52ZXJzaW9uID0gXCIxOS4yLjhcIjtcbiAgICBcInVuZGVmaW5lZFwiICE9PSB0eXBlb2YgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fICYmXG4gICAgICBcImZ1bmN0aW9uXCIgPT09XG4gICAgICAgIHR5cGVvZiBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18ucmVnaXN0ZXJJbnRlcm5hbE1vZHVsZVN0b3AgJiZcbiAgICAgIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RvcChFcnJvcigpKTtcbiAgfSkoKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicpIHtcbiAgbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2Nqcy9yZWFjdC5wcm9kdWN0aW9uLmpzJyk7XG59IGVsc2Uge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LmRldmVsb3BtZW50LmpzJyk7XG59XG4iLCIndXNlIHN0cmljdCdcblxuY2xhc3MgTm9kZSB7XG4gIGNvbnN0cnVjdG9yIChkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YVxuICB9XG59XG5cbmNsYXNzIExpbmtlZExpc3Qge1xuICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgdGhpcy5sZW5ndGggPSAwXG4gIH1cblxuICBlbnF1ZXVlIChkYXRhKSB7XG4gICAgY29uc3Qgbm9kZSA9IG5ldyBOb2RlKGRhdGEpXG4gICAgbm9kZS5wcmV2ID0gdGhpcy50YWlsXG4gICAgaWYgKHRoaXMudGFpbCkgdGhpcy50YWlsLm5leHQgPSBub2RlXG4gICAgZWxzZSB0aGlzLmhlYWQgPSBub2RlXG4gICAgdGhpcy50YWlsID0gbm9kZVxuICAgIHRoaXMubGVuZ3RoKytcbiAgICByZXR1cm4gbm9kZVxuICB9XG5cbiAgZGVxdWV1ZSAoKSB7XG4gICAgaWYgKCF0aGlzLmhlYWQpIHJldHVyblxuICAgIGNvbnN0IHsgZGF0YSB9ID0gdGhpcy5oZWFkXG4gICAgdGhpcy5yZW1vdmUodGhpcy5oZWFkKVxuICAgIHJldHVybiBkYXRhXG4gIH1cblxuICByZW1vdmUgKG5vZGUpIHtcbiAgICBpZiAobm9kZS5wcmV2KSBub2RlLnByZXYubmV4dCA9IG5vZGUubmV4dFxuICAgIGVsc2UgdGhpcy5oZWFkID0gbm9kZS5uZXh0XG4gICAgaWYgKG5vZGUubmV4dCkgbm9kZS5uZXh0LnByZXYgPSBub2RlLnByZXZcbiAgICBlbHNlIHRoaXMudGFpbCA9IG5vZGUucHJldlxuICAgIHRoaXMubGVuZ3RoLS1cbiAgfVxuXG4gIHNpemUgKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gKHNsb3RzID0gMSkgPT4ge1xuICBjb25zdCBxdWV1ZSA9IG5ldyBMaW5rZWRMaXN0KClcblxuICBjb25zdCByZWxlYXNlID0gKCkgPT4ge1xuICAgICsrc2xvdHNcbiAgICBjb25zdCB3YWl0ZXIgPSBxdWV1ZS5kZXF1ZXVlKClcbiAgICBpZiAod2FpdGVyKSByZXR1cm4gd2FpdGVyLmFjcXVpcmUoKVxuICB9XG5cbiAgY29uc3QgYWNxdWlyZSA9IHJlc29sdmUgPT4ge1xuICAgIC0tc2xvdHNcbiAgICByZXNvbHZlKHJlbGVhc2UpXG4gIH1cblxuICBjb25zdCBsb2NrID0gc2lnbmFsID0+XG4gICAgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBpZiAoc2lnbmFsICE9IG51bGwgJiYgdHlwZW9mIHNpZ25hbC5hZGRFdmVudExpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2BzaWduYWxgIG5lZWRzIHRvIGJlIGFuIEFib3J0U2lnbmFsLicpXG4gICAgICB9XG4gICAgICBpZiAoc2lnbmFsPy5hYm9ydGVkKSByZXR1cm4gcmVzb2x2ZShudWxsKVxuICAgICAgaWYgKCFsb2NrLmlzTG9ja2VkKCkpIHJldHVybiBhY3F1aXJlKHJlc29sdmUpXG5cbiAgICAgIGNvbnN0IHdhaXRlciA9IHsgYWNxdWlyZTogKCkgPT4gYWNxdWlyZShyZXNvbHZlKSB9XG4gICAgICBjb25zdCBub2RlID0gcXVldWUuZW5xdWV1ZSh3YWl0ZXIpXG5cbiAgICAgIGlmIChzaWduYWwgIT0gbnVsbCkge1xuICAgICAgICBjb25zdCBvbkFib3J0ID0gKCkgPT4ge1xuICAgICAgICAgIHF1ZXVlLnJlbW92ZShub2RlKVxuICAgICAgICAgIHJlc29sdmUobnVsbClcbiAgICAgICAgfVxuICAgICAgICB3YWl0ZXIuYWNxdWlyZSA9ICgpID0+IHtcbiAgICAgICAgICBzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkFib3J0KVxuICAgICAgICAgIGFjcXVpcmUocmVzb2x2ZSlcbiAgICAgICAgfVxuICAgICAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkFib3J0LCB7IG9uY2U6IHRydWUgfSlcbiAgICAgIH1cbiAgICB9KVxuXG4gIGxvY2suaXNMb2NrZWQgPSAoKSA9PiBzbG90cyA9PT0gMFxuXG4gIGxvY2suYXdhaXRpbmcgPSAoKSA9PiBxdWV1ZS5zaXplKClcblxuICByZXR1cm4gbG9ja1xufVxuIiwiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGNyZWF0ZUxvY2sgPSByZXF1aXJlKCcuL2NyZWF0ZScpXG5cbmNvbnN0IHdpdGhMb2NrID0gb3B0cyA9PiB7XG4gIGNvbnN0IGxvY2sgPSBjcmVhdGVMb2NrKG9wdHMpXG5cbiAgY29uc3Qgd2l0aExvY2sgPSBhc3luYyAoZm4sIHNpZ25hbCkgPT4ge1xuICAgIGNvbnN0IHJlbGVhc2UgPSBhd2FpdCBsb2NrKHNpZ25hbClcbiAgICBpZiAoIXJlbGVhc2UpIHJldHVyblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgZm4oKVxuICAgIH0gZmluYWxseSB7XG4gICAgICByZWxlYXNlKClcbiAgICB9XG4gIH1cblxuICB3aXRoTG9jay5pc0xvY2tlZCA9IGxvY2suaXNMb2NrZWRcbiAgd2l0aExvY2suYXdhaXRpbmcgPSBsb2NrLmF3YWl0aW5nXG5cbiAgcmV0dXJuIHdpdGhMb2NrXG59XG5cbm1vZHVsZS5leHBvcnRzID0geyB3aXRoTG9jaywgY3JlYXRlTG9jayB9XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyB3aXRoTG9jayB9IGZyb20gXCJzdXBlcmxvY2tcIjtcbi8vI3JlZ2lvbiBzcmMvdHlwZXMudHNcbi8qKiBNaWdyYXRpb24gZXJyb3IgZm9yIHZlcnNpb24gbWlncmF0aW9ucyAqL1xudmFyIE1pZ3JhdGlvbkVycm9yID0gY2xhc3MgZXh0ZW5kcyBFcnJvciB7XG5cdGtleTtcblx0dmVyc2lvbjtcblx0Y29uc3RydWN0b3Ioa2V5LCB2ZXJzaW9uLCBvcHRpb25zKSB7XG5cdFx0c3VwZXIoYHYke3ZlcnNpb259IG1pZ3JhdGlvbiBmYWlsZWQgZm9yIFwiJHtrZXl9XCJgLCBvcHRpb25zKTtcblx0XHR0aGlzLmtleSA9IGtleTtcblx0XHR0aGlzLnZlcnNpb24gPSB2ZXJzaW9uO1xuXHR9XG59O1xuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL2Jyb3dzZXIudHNcbmNvbnN0IGdsb2JhbHMgPSBnbG9iYWxUaGlzO1xuY29uc3QgYnJvd3NlciA9IGdsb2JhbHMuYnJvd3NlciA/PyBnbG9iYWxzLmNocm9tZSA/PyB7fTtcbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIC4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL2RlcXVhbEAyLjAuMy9ub2RlX21vZHVsZXMvZGVxdWFsL2xpdGUvaW5kZXgubWpzXG52YXIgaGFzID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbmZ1bmN0aW9uIGRlcXVhbChmb28sIGJhcikge1xuXHR2YXIgY3RvciwgbGVuO1xuXHRpZiAoZm9vID09PSBiYXIpIHJldHVybiB0cnVlO1xuXHRpZiAoZm9vICYmIGJhciAmJiAoY3RvciA9IGZvby5jb25zdHJ1Y3RvcikgPT09IGJhci5jb25zdHJ1Y3Rvcikge1xuXHRcdGlmIChjdG9yID09PSBEYXRlKSByZXR1cm4gZm9vLmdldFRpbWUoKSA9PT0gYmFyLmdldFRpbWUoKTtcblx0XHRpZiAoY3RvciA9PT0gUmVnRXhwKSByZXR1cm4gZm9vLnRvU3RyaW5nKCkgPT09IGJhci50b1N0cmluZygpO1xuXHRcdGlmIChjdG9yID09PSBBcnJheSkge1xuXHRcdFx0aWYgKChsZW4gPSBmb28ubGVuZ3RoKSA9PT0gYmFyLmxlbmd0aCkgd2hpbGUgKGxlbi0tICYmIGRlcXVhbChmb29bbGVuXSwgYmFyW2xlbl0pKTtcblx0XHRcdHJldHVybiBsZW4gPT09IC0xO1xuXHRcdH1cblx0XHRpZiAoIWN0b3IgfHwgdHlwZW9mIGZvbyA9PT0gXCJvYmplY3RcIikge1xuXHRcdFx0bGVuID0gMDtcblx0XHRcdGZvciAoY3RvciBpbiBmb28pIHtcblx0XHRcdFx0aWYgKGhhcy5jYWxsKGZvbywgY3RvcikgJiYgKytsZW4gJiYgIWhhcy5jYWxsKGJhciwgY3RvcikpIHJldHVybiBmYWxzZTtcblx0XHRcdFx0aWYgKCEoY3RvciBpbiBiYXIpIHx8ICFkZXF1YWwoZm9vW2N0b3JdLCBiYXJbY3Rvcl0pKSByZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gT2JqZWN0LmtleXMoYmFyKS5sZW5ndGggPT09IGxlbjtcblx0XHR9XG5cdH1cblx0cmV0dXJuIGZvbyAhPT0gZm9vICYmIGJhciAhPT0gYmFyO1xufVxuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gc3JjL3N0b3JhZ2UudHNcbi8qKlxuKiBTaW1wbGlmaWVkLCB0eXBlLXNhZmUgc3RvcmFnZSBBUElzIGZvciBicm93c2VyIGV4dGVuc2lvbnMsIHdpdGggc3VwcG9ydCBmb3JcbiogdmVyc2lvbmVkIGZpZWxkcywgc25hcHNob3RzLCBtZXRhZGF0YSwgYW5kIGl0ZW0gZGVmaW5pdGlvbnMuXG4qXG4qIEBtb2R1bGUgd2ViZXh0LXN0b3JlXG4qL1xuY29uc3Qgc3RvcmFnZSA9IGNyZWF0ZVN0b3JhZ2UoKTtcbmZ1bmN0aW9uIGNyZWF0ZVN0b3JhZ2UoKSB7XG5cdGNvbnN0IGRyaXZlcnMgPSB7XG5cdFx0bG9jYWw6IGNyZWF0ZURyaXZlcihcImxvY2FsXCIpLFxuXHRcdHNlc3Npb246IGNyZWF0ZURyaXZlcihcInNlc3Npb25cIiksXG5cdFx0c3luYzogY3JlYXRlRHJpdmVyKFwic3luY1wiKSxcblx0XHRtYW5hZ2VkOiBjcmVhdGVEcml2ZXIoXCJtYW5hZ2VkXCIpXG5cdH07XG5cdGNvbnN0IGdldERyaXZlciA9IChhcmVhKSA9PiB7XG5cdFx0Y29uc3QgZHJpdmVyID0gZHJpdmVyc1thcmVhXTtcblx0XHRpZiAoZHJpdmVyID09IG51bGwpIHtcblx0XHRcdGNvbnN0IGFyZWFOYW1lcyA9IE9iamVjdC5rZXlzKGRyaXZlcnMpLmpvaW4oXCIsIFwiKTtcblx0XHRcdHRocm93IEVycm9yKGBJbnZhbGlkIGFyZWEgXCIke2FyZWF9XCIuIE9wdGlvbnM6ICR7YXJlYU5hbWVzfWApO1xuXHRcdH1cblx0XHRyZXR1cm4gZHJpdmVyO1xuXHR9O1xuXHRjb25zdCByZXNvbHZlS2V5ID0gKGtleSkgPT4ge1xuXHRcdGNvbnN0IGRlbGltaW5hdG9ySW5kZXggPSBrZXkuaW5kZXhPZihcIjpcIik7XG5cdFx0Y29uc3QgZHJpdmVyQXJlYSA9IGtleS5zdWJzdHJpbmcoMCwgZGVsaW1pbmF0b3JJbmRleCk7XG5cdFx0Y29uc3QgZHJpdmVyS2V5ID0ga2V5LnN1YnN0cmluZyhkZWxpbWluYXRvckluZGV4ICsgMSk7XG5cdFx0aWYgKGRyaXZlcktleSA9PSBudWxsKSB0aHJvdyBFcnJvcihgU3RvcmFnZSBrZXkgc2hvdWxkIGJlIGluIHRoZSBmb3JtIG9mIFwiYXJlYTprZXlcIiwgYnV0IHJlY2VpdmVkIFwiJHtrZXl9XCJgKTtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZHJpdmVyQXJlYSxcblx0XHRcdGRyaXZlcktleSxcblx0XHRcdGRyaXZlcjogZ2V0RHJpdmVyKGRyaXZlckFyZWEpXG5cdFx0fTtcblx0fTtcblx0Y29uc3QgZ2V0TWV0YUtleSA9IChrZXkpID0+IGAke2tleX0kYDtcblx0Y29uc3QgbWVyZ2VNZXRhID0gKG9sZE1ldGEsIG5ld01ldGEpID0+IHtcblx0XHRjb25zdCBuZXdGaWVsZHMgPSB7IC4uLm9sZE1ldGEgfTtcblx0XHRPYmplY3QuZW50cmllcyhuZXdNZXRhKS5mb3JFYWNoKChba2V5LCB2YWx1ZV0pID0+IHtcblx0XHRcdGlmICh2YWx1ZSA9PSBudWxsKSBkZWxldGUgbmV3RmllbGRzW2tleV07XG5cdFx0XHRlbHNlIG5ld0ZpZWxkc1trZXldID0gdmFsdWU7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIG5ld0ZpZWxkcztcblx0fTtcblx0Y29uc3QgZ2V0VmFsdWVPckZhbGxiYWNrID0gKHZhbHVlLCBmYWxsYmFjaykgPT4gdmFsdWUgPz8gZmFsbGJhY2sgPz8gbnVsbDtcblx0Y29uc3QgZ2V0TWV0YVZhbHVlID0gKHByb3BlcnRpZXMpID0+IHR5cGVvZiBwcm9wZXJ0aWVzID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHByb3BlcnRpZXMpID8gcHJvcGVydGllcyA6IHt9O1xuXHRjb25zdCBnZXRJdGVtID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKSA9PiB7XG5cdFx0Y29uc3QgcmVzID0gYXdhaXQgZHJpdmVyLmdldEl0ZW0oZHJpdmVyS2V5KTtcblx0XHRyZXR1cm4gZ2V0VmFsdWVPckZhbGxiYWNrKHJlcywgb3B0cz8uZmFsbGJhY2spO1xuXHR9O1xuXHRjb25zdCBnZXRNZXRhID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5KSA9PiB7XG5cdFx0Y29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcblx0XHRjb25zdCByZXMgPSBhd2FpdCBkcml2ZXIuZ2V0SXRlbShtZXRhS2V5KTtcblx0XHRyZXR1cm4gZ2V0TWV0YVZhbHVlKHJlcyk7XG5cdH07XG5cdGNvbnN0IHNldEl0ZW0gPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXksIHZhbHVlKSA9PiB7XG5cdFx0YXdhaXQgZHJpdmVyLnNldEl0ZW0oZHJpdmVyS2V5LCB2YWx1ZSA/PyBudWxsKTtcblx0fTtcblx0Y29uc3Qgc2V0TWV0YSA9IGFzeW5jIChkcml2ZXIsIGRyaXZlcktleSwgcHJvcGVydGllcykgPT4ge1xuXHRcdGNvbnN0IG1ldGFLZXkgPSBnZXRNZXRhS2V5KGRyaXZlcktleSk7XG5cdFx0Y29uc3QgZXhpc3RpbmdGaWVsZHMgPSBnZXRNZXRhVmFsdWUoYXdhaXQgZHJpdmVyLmdldEl0ZW0obWV0YUtleSkpO1xuXHRcdGF3YWl0IGRyaXZlci5zZXRJdGVtKG1ldGFLZXksIG1lcmdlTWV0YShleGlzdGluZ0ZpZWxkcywgcHJvcGVydGllcykpO1xuXHR9O1xuXHRjb25zdCByZW1vdmVJdGVtID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKSA9PiB7XG5cdFx0YXdhaXQgZHJpdmVyLnJlbW92ZUl0ZW0oZHJpdmVyS2V5KTtcblx0XHRpZiAob3B0cz8ucmVtb3ZlTWV0YSkge1xuXHRcdFx0Y29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcblx0XHRcdGF3YWl0IGRyaXZlci5yZW1vdmVJdGVtKG1ldGFLZXkpO1xuXHRcdH1cblx0fTtcblx0Y29uc3QgcmVtb3ZlTWV0YSA9IGFzeW5jIChkcml2ZXIsIGRyaXZlcktleSwgcHJvcGVydGllcykgPT4ge1xuXHRcdGNvbnN0IG1ldGFLZXkgPSBnZXRNZXRhS2V5KGRyaXZlcktleSk7XG5cdFx0aWYgKHByb3BlcnRpZXMgPT0gbnVsbCkgYXdhaXQgZHJpdmVyLnJlbW92ZUl0ZW0obWV0YUtleSk7XG5cdFx0ZWxzZSB7XG5cdFx0XHRjb25zdCBuZXdGaWVsZHMgPSBnZXRNZXRhVmFsdWUoYXdhaXQgZHJpdmVyLmdldEl0ZW0obWV0YUtleSkpO1xuXHRcdFx0W3Byb3BlcnRpZXNdLmZsYXQoKS5mb3JFYWNoKChmaWVsZCkgPT4ge1xuXHRcdFx0XHRkZWxldGUgbmV3RmllbGRzW2ZpZWxkXTtcblx0XHRcdH0pO1xuXHRcdFx0YXdhaXQgZHJpdmVyLnNldEl0ZW0obWV0YUtleSwgbmV3RmllbGRzKTtcblx0XHR9XG5cdH07XG5cdGNvbnN0IHdhdGNoID0gKGRyaXZlciwgZHJpdmVyS2V5LCBjYikgPT4gZHJpdmVyLndhdGNoKGRyaXZlcktleSwgY2IpO1xuXHRyZXR1cm4ge1xuXHRcdGdldEl0ZW06IGFzeW5jIChrZXksIG9wdHMpID0+IHtcblx0XHRcdGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdHJldHVybiBhd2FpdCBnZXRJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKTtcblx0XHR9LFxuXHRcdGdldEl0ZW1zOiBhc3luYyAoa2V5cykgPT4ge1xuXHRcdFx0Y29uc3QgYXJlYVRvS2V5TWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdGNvbnN0IGtleVRvT3B0c01hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHRjb25zdCBvcmRlcmVkS2V5cyA9IFtdO1xuXHRcdFx0a2V5cy5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdFx0bGV0IGtleVN0cjtcblx0XHRcdFx0bGV0IG9wdHM7XG5cdFx0XHRcdGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKSBrZXlTdHIgPSBrZXk7XG5cdFx0XHRcdGVsc2UgaWYgKFwiZ2V0VmFsdWVcIiBpbiBrZXkpIHtcblx0XHRcdFx0XHRrZXlTdHIgPSBrZXkua2V5O1xuXHRcdFx0XHRcdG9wdHMgPSB7IGZhbGxiYWNrOiBrZXkuZmFsbGJhY2sgfTtcblx0XHRcdFx0fSBlbHNlIGlmIChcIml0ZW1cIiBpbiBrZXkpIHtcblx0XHRcdFx0XHRrZXlTdHIgPSBrZXkuaXRlbS5rZXk7XG5cdFx0XHRcdFx0b3B0cyA9IHsgZmFsbGJhY2s6IGtleS5pdGVtLmZhbGxiYWNrIH07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0a2V5U3RyID0ga2V5LmtleTtcblx0XHRcdFx0XHRvcHRzID0ga2V5Lm9wdGlvbnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0b3JkZXJlZEtleXMucHVzaChrZXlTdHIpO1xuXHRcdFx0XHRjb25zdCB7IGRyaXZlckFyZWEsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXlTdHIpO1xuXHRcdFx0XHRjb25zdCBhcmVhS2V5cyA9IGFyZWFUb0tleU1hcC5nZXQoZHJpdmVyQXJlYSkgPz8gW107XG5cdFx0XHRcdGFyZWFUb0tleU1hcC5zZXQoZHJpdmVyQXJlYSwgYXJlYUtleXMuY29uY2F0KGRyaXZlcktleSkpO1xuXHRcdFx0XHRrZXlUb09wdHNNYXAuc2V0KGtleVN0ciwgb3B0cyk7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IHJlc3VsdHNNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoQXJyYXkuZnJvbShhcmVhVG9LZXlNYXAuZW50cmllcygpKS5tYXAoYXN5bmMgKFtkcml2ZXJBcmVhLCBrZXlzXSkgPT4ge1xuXHRcdFx0XHQoYXdhaXQgZHJpdmVyc1tkcml2ZXJBcmVhXS5nZXRJdGVtcyhrZXlzKSkuZm9yRWFjaCgoZHJpdmVyUmVzdWx0KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qga2V5ID0gYCR7ZHJpdmVyQXJlYX06JHtkcml2ZXJSZXN1bHQua2V5fWA7XG5cdFx0XHRcdFx0Y29uc3Qgb3B0cyA9IGtleVRvT3B0c01hcC5nZXQoa2V5KTtcblx0XHRcdFx0XHRjb25zdCB2YWx1ZSA9IGdldFZhbHVlT3JGYWxsYmFjayhkcml2ZXJSZXN1bHQudmFsdWUsIG9wdHM/LmZhbGxiYWNrID8/IG9wdHM/LmZhbGxiYWNrKTtcblx0XHRcdFx0XHRyZXN1bHRzTWFwLnNldChrZXksIHZhbHVlKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KSk7XG5cdFx0XHRyZXR1cm4gb3JkZXJlZEtleXMubWFwKChrZXkpID0+ICh7XG5cdFx0XHRcdGtleSxcblx0XHRcdFx0dmFsdWU6IHJlc3VsdHNNYXAuZ2V0KGtleSlcblx0XHRcdH0pKTtcblx0XHR9LFxuXHRcdGdldE1ldGE6IGFzeW5jIChrZXkpID0+IHtcblx0XHRcdGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdHJldHVybiBhd2FpdCBnZXRNZXRhKGRyaXZlciwgZHJpdmVyS2V5KTtcblx0XHR9LFxuXHRcdGdldE1ldGFzOiBhc3luYyAoYXJncykgPT4ge1xuXHRcdFx0Y29uc3Qga2V5cyA9IGFyZ3MubWFwKChhcmcpID0+IHtcblx0XHRcdFx0Y29uc3Qga2V5ID0gdHlwZW9mIGFyZyA9PT0gXCJzdHJpbmdcIiA/IGFyZyA6IGFyZy5rZXk7XG5cdFx0XHRcdGNvbnN0IHsgZHJpdmVyQXJlYSwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0a2V5LFxuXHRcdFx0XHRcdGRyaXZlckFyZWEsXG5cdFx0XHRcdFx0ZHJpdmVyS2V5LFxuXHRcdFx0XHRcdGRyaXZlck1ldGFLZXk6IGdldE1ldGFLZXkoZHJpdmVyS2V5KVxuXHRcdFx0XHR9O1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBhcmVhVG9Ecml2ZXJNZXRhS2V5c01hcCA9IGtleXMucmVkdWNlKChtYXAsIGtleSkgPT4ge1xuXHRcdFx0XHRtYXBba2V5LmRyaXZlckFyZWFdID8/PSBbXTtcblx0XHRcdFx0bWFwW2tleS5kcml2ZXJBcmVhXT8ucHVzaChrZXkpO1xuXHRcdFx0XHRyZXR1cm4gbWFwO1xuXHRcdFx0fSwge30pO1xuXHRcdFx0Y29uc3QgcmVzdWx0c01hcCA9IHt9O1xuXHRcdFx0Y29uc3Qgc3RvcmFnZSA9IGJyb3dzZXIuc3RvcmFnZTtcblx0XHRcdGlmICghc3RvcmFnZSkgdGhyb3cgbmV3IEVycm9yKFwiQnJvd3NlciBzdG9yYWdlIEFQSSBpcyB1bmF2YWlsYWJsZVwiKTtcblx0XHRcdGF3YWl0IFByb21pc2UuYWxsKE9iamVjdC5lbnRyaWVzKGFyZWFUb0RyaXZlck1ldGFLZXlzTWFwKS5tYXAoYXN5bmMgKFthcmVhLCBrZXlzXSkgPT4ge1xuXHRcdFx0XHRjb25zdCBhcmVhUmVzID0gYXdhaXQgc3RvcmFnZVthcmVhXS5nZXQoa2V5cy5tYXAoKGtleSkgPT4ga2V5LmRyaXZlck1ldGFLZXkpKTtcblx0XHRcdFx0a2V5cy5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdFx0XHRyZXN1bHRzTWFwW2tleS5rZXldID0gYXJlYVJlc1trZXkuZHJpdmVyTWV0YUtleV0gPz8ge307XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSkpO1xuXHRcdFx0cmV0dXJuIGtleXMubWFwKChrZXkpID0+ICh7XG5cdFx0XHRcdGtleToga2V5LmtleSxcblx0XHRcdFx0bWV0YTogcmVzdWx0c01hcFtrZXkua2V5XVxuXHRcdFx0fSkpO1xuXHRcdH0sXG5cdFx0c2V0SXRlbTogYXN5bmMgKGtleSwgdmFsdWUpID0+IHtcblx0XHRcdGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdGF3YWl0IHNldEl0ZW0oZHJpdmVyLCBkcml2ZXJLZXksIHZhbHVlKTtcblx0XHR9LFxuXHRcdHNldEl0ZW1zOiBhc3luYyAoaXRlbXMpID0+IHtcblx0XHRcdGNvbnN0IGFyZWFUb0tleVZhbHVlTWFwID0ge307XG5cdFx0XHRpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHsgZHJpdmVyQXJlYSwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KFwia2V5XCIgaW4gaXRlbSA/IGl0ZW0ua2V5IDogaXRlbS5pdGVtLmtleSk7XG5cdFx0XHRcdGFyZWFUb0tleVZhbHVlTWFwW2RyaXZlckFyZWFdID8/PSBbXTtcblx0XHRcdFx0YXJlYVRvS2V5VmFsdWVNYXBbZHJpdmVyQXJlYV0ucHVzaCh7XG5cdFx0XHRcdFx0a2V5OiBkcml2ZXJLZXksXG5cdFx0XHRcdFx0dmFsdWU6IGl0ZW0udmFsdWVcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHRcdGF3YWl0IFByb21pc2UuYWxsKE9iamVjdC5lbnRyaWVzKGFyZWFUb0tleVZhbHVlTWFwKS5tYXAoYXN5bmMgKFtkcml2ZXJBcmVhLCB2YWx1ZXNdKSA9PiB7XG5cdFx0XHRcdGF3YWl0IGdldERyaXZlcihkcml2ZXJBcmVhKS5zZXRJdGVtcyh2YWx1ZXMpO1xuXHRcdFx0fSkpO1xuXHRcdH0sXG5cdFx0c2V0TWV0YTogYXN5bmMgKGtleSwgcHJvcGVydGllcykgPT4ge1xuXHRcdFx0Y29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0YXdhaXQgc2V0TWV0YShkcml2ZXIsIGRyaXZlcktleSwgcHJvcGVydGllcyk7XG5cdFx0fSxcblx0XHRzZXRNZXRhczogYXN5bmMgKGl0ZW1zKSA9PiB7XG5cdFx0XHRjb25zdCBhcmVhVG9NZXRhVXBkYXRlc01hcCA9IHt9O1xuXHRcdFx0aXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuXHRcdFx0XHRjb25zdCB7IGRyaXZlckFyZWEsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShcImtleVwiIGluIGl0ZW0gPyBpdGVtLmtleSA6IGl0ZW0uaXRlbS5rZXkpO1xuXHRcdFx0XHRhcmVhVG9NZXRhVXBkYXRlc01hcFtkcml2ZXJBcmVhXSA/Pz0gW107XG5cdFx0XHRcdGFyZWFUb01ldGFVcGRhdGVzTWFwW2RyaXZlckFyZWFdLnB1c2goe1xuXHRcdFx0XHRcdGtleTogZHJpdmVyS2V5LFxuXHRcdFx0XHRcdHByb3BlcnRpZXM6IGl0ZW0ubWV0YVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoT2JqZWN0LmVudHJpZXMoYXJlYVRvTWV0YVVwZGF0ZXNNYXApLm1hcChhc3luYyAoW3N0b3JhZ2VBcmVhLCB1cGRhdGVzXSkgPT4ge1xuXHRcdFx0XHRjb25zdCBkcml2ZXIgPSBnZXREcml2ZXIoc3RvcmFnZUFyZWEpO1xuXHRcdFx0XHRjb25zdCBtZXRhS2V5cyA9IHVwZGF0ZXMubWFwKCh7IGtleSB9KSA9PiBnZXRNZXRhS2V5KGtleSkpO1xuXHRcdFx0XHRjb25zdCBleGlzdGluZ01ldGFzID0gYXdhaXQgZHJpdmVyLmdldEl0ZW1zKG1ldGFLZXlzKTtcblx0XHRcdFx0Y29uc3QgZXhpc3RpbmdNZXRhTWFwID0gT2JqZWN0LmZyb21FbnRyaWVzKGV4aXN0aW5nTWV0YXMubWFwKCh7IGtleSwgdmFsdWUgfSkgPT4gW2tleSwgZ2V0TWV0YVZhbHVlKHZhbHVlKV0pKTtcblx0XHRcdFx0Y29uc3QgbWV0YVVwZGF0ZXMgPSB1cGRhdGVzLm1hcCgoeyBrZXksIHByb3BlcnRpZXMgfSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IG1ldGFLZXkgPSBnZXRNZXRhS2V5KGtleSk7XG5cdFx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRcdGtleTogbWV0YUtleSxcblx0XHRcdFx0XHRcdHZhbHVlOiBtZXJnZU1ldGEoZXhpc3RpbmdNZXRhTWFwW21ldGFLZXldID8/IHt9LCBwcm9wZXJ0aWVzKVxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRhd2FpdCBkcml2ZXIuc2V0SXRlbXMobWV0YVVwZGF0ZXMpO1xuXHRcdFx0fSkpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlSXRlbTogYXN5bmMgKGtleSwgb3B0cykgPT4ge1xuXHRcdFx0Y29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0YXdhaXQgcmVtb3ZlSXRlbShkcml2ZXIsIGRyaXZlcktleSwgb3B0cyk7XG5cdFx0fSxcblx0XHRyZW1vdmVJdGVtczogYXN5bmMgKGtleXMpID0+IHtcblx0XHRcdGNvbnN0IGFyZWFUb0tleXNNYXAgPSB7fTtcblx0XHRcdGtleXMuZm9yRWFjaCgoa2V5KSA9PiB7XG5cdFx0XHRcdGxldCBrZXlTdHI7XG5cdFx0XHRcdGxldCBvcHRzO1xuXHRcdFx0XHRpZiAodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIikga2V5U3RyID0ga2V5O1xuXHRcdFx0XHRlbHNlIGlmIChcImdldFZhbHVlXCIgaW4ga2V5KSBrZXlTdHIgPSBrZXkua2V5O1xuXHRcdFx0XHRlbHNlIGlmIChcIml0ZW1cIiBpbiBrZXkpIHtcblx0XHRcdFx0XHRrZXlTdHIgPSBrZXkuaXRlbS5rZXk7XG5cdFx0XHRcdFx0b3B0cyA9IGtleS5vcHRpb25zO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGtleVN0ciA9IGtleS5rZXk7XG5cdFx0XHRcdFx0b3B0cyA9IGtleS5vcHRpb25zO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbnN0IHsgZHJpdmVyQXJlYSwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleVN0cik7XG5cdFx0XHRcdGFyZWFUb0tleXNNYXBbZHJpdmVyQXJlYV0gPz89IFtdO1xuXHRcdFx0XHRhcmVhVG9LZXlzTWFwW2RyaXZlckFyZWFdLnB1c2goZHJpdmVyS2V5KTtcblx0XHRcdFx0aWYgKG9wdHM/LnJlbW92ZU1ldGEpIGFyZWFUb0tleXNNYXBbZHJpdmVyQXJlYV0ucHVzaChnZXRNZXRhS2V5KGRyaXZlcktleSkpO1xuXHRcdFx0fSk7XG5cdFx0XHRhd2FpdCBQcm9taXNlLmFsbChPYmplY3QuZW50cmllcyhhcmVhVG9LZXlzTWFwKS5tYXAoYXN5bmMgKFtkcml2ZXJBcmVhLCBrZXlzXSkgPT4ge1xuXHRcdFx0XHRhd2FpdCBnZXREcml2ZXIoZHJpdmVyQXJlYSkucmVtb3ZlSXRlbXMoa2V5cyk7XG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRjbGVhcjogYXN5bmMgKGJhc2UpID0+IHtcblx0XHRcdGF3YWl0IGdldERyaXZlcihiYXNlKS5jbGVhcigpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlTWV0YTogYXN5bmMgKGtleSwgcHJvcGVydGllcykgPT4ge1xuXHRcdFx0Y29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0YXdhaXQgcmVtb3ZlTWV0YShkcml2ZXIsIGRyaXZlcktleSwgcHJvcGVydGllcyk7XG5cdFx0fSxcblx0XHRzbmFwc2hvdDogYXN5bmMgKGJhc2UsIG9wdHMpID0+IHtcblx0XHRcdGNvbnN0IGRhdGEgPSBhd2FpdCBnZXREcml2ZXIoYmFzZSkuc25hcHNob3QoKTtcblx0XHRcdG9wdHM/LmV4Y2x1ZGVLZXlzPy5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdFx0ZGVsZXRlIGRhdGFba2V5XTtcblx0XHRcdFx0ZGVsZXRlIGRhdGFbZ2V0TWV0YUtleShrZXkpXTtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0fSxcblx0XHRyZXN0b3JlU25hcHNob3Q6IGFzeW5jIChiYXNlLCBkYXRhKSA9PiB7XG5cdFx0XHRhd2FpdCBnZXREcml2ZXIoYmFzZSkucmVzdG9yZVNuYXBzaG90KGRhdGEpO1xuXHRcdH0sXG5cdFx0d2F0Y2g6IChrZXksIGNiKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRyZXR1cm4gd2F0Y2goZHJpdmVyLCBkcml2ZXJLZXksIGNiKTtcblx0XHR9LFxuXHRcdHVud2F0Y2goKSB7XG5cdFx0XHRPYmplY3QudmFsdWVzKGRyaXZlcnMpLmZvckVhY2goKGRyaXZlcikgPT4ge1xuXHRcdFx0XHRkcml2ZXIudW53YXRjaCgpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRkZWZpbmVJdGVtOiAoa2V5LCBvcHRzKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRjb25zdCB7IHZlcnNpb246IHRhcmdldFZlcnNpb24gPSAxLCBtaWdyYXRpb25zID0ge30sIG9uTWlncmF0aW9uQ29tcGxldGUsIGRlYnVnID0gZmFsc2UgfSA9IG9wdHMgPz8ge307XG5cdFx0XHRpZiAodGFyZ2V0VmVyc2lvbiA8IDEpIHRocm93IEVycm9yKFwiU3RvcmFnZSBpdGVtIHZlcnNpb24gY2Fubm90IGJlIGxlc3MgdGhhbiAxLiBJbml0aWFsIHZlcnNpb25zIHNob3VsZCBiZSBzZXQgdG8gMSwgbm90IDAuXCIpO1xuXHRcdFx0bGV0IG5lZWRzVmVyc2lvblNldCA9IGZhbHNlO1xuXHRcdFx0Y29uc3QgbWlncmF0ZSA9IGFzeW5jICgpID0+IHtcblx0XHRcdFx0Y29uc3QgZHJpdmVyTWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcblx0XHRcdFx0Y29uc3QgW3sgdmFsdWUgfSwgeyB2YWx1ZTogbWV0YSB9XSA9IGF3YWl0IGRyaXZlci5nZXRJdGVtcyhbZHJpdmVyS2V5LCBkcml2ZXJNZXRhS2V5XSk7XG5cdFx0XHRcdG5lZWRzVmVyc2lvblNldCA9IHZhbHVlID09IG51bGwgJiYgbWV0YT8udiA9PSBudWxsICYmICEhdGFyZ2V0VmVyc2lvbjtcblx0XHRcdFx0aWYgKHZhbHVlID09IG51bGwpIHJldHVybjtcblx0XHRcdFx0Y29uc3QgY3VycmVudFZlcnNpb24gPSBtZXRhPy52ID8/IDE7XG5cdFx0XHRcdGlmIChjdXJyZW50VmVyc2lvbiA+IHRhcmdldFZlcnNpb24pIHRocm93IEVycm9yKGBWZXJzaW9uIGRvd25ncmFkZSBkZXRlY3RlZCAodiR7Y3VycmVudFZlcnNpb259IC0+IHYke3RhcmdldFZlcnNpb259KSBmb3IgXCIke2tleX1cImApO1xuXHRcdFx0XHRpZiAoY3VycmVudFZlcnNpb24gPT09IHRhcmdldFZlcnNpb24pIHJldHVybjtcblx0XHRcdFx0aWYgKGRlYnVnKSBjb25zb2xlLmRlYnVnKGBbd2ViZXh0LXN0b3JlXSBSdW5uaW5nIHN0b3JhZ2UgbWlncmF0aW9uIGZvciAke2tleX06IHYke2N1cnJlbnRWZXJzaW9ufSAtPiB2JHt0YXJnZXRWZXJzaW9ufWApO1xuXHRcdFx0XHRjb25zdCBtaWdyYXRpb25zVG9SdW4gPSBBcnJheS5mcm9tKHsgbGVuZ3RoOiB0YXJnZXRWZXJzaW9uIC0gY3VycmVudFZlcnNpb24gfSwgKF8sIGkpID0+IGN1cnJlbnRWZXJzaW9uICsgaSArIDEpO1xuXHRcdFx0XHRsZXQgbWlncmF0ZWRWYWx1ZSA9IHZhbHVlO1xuXHRcdFx0XHRmb3IgKGNvbnN0IG1pZ3JhdGVUb1ZlcnNpb24gb2YgbWlncmF0aW9uc1RvUnVuKSB0cnkge1xuXHRcdFx0XHRcdG1pZ3JhdGVkVmFsdWUgPSBhd2FpdCBtaWdyYXRpb25zPy5bbWlncmF0ZVRvVmVyc2lvbl0/LihtaWdyYXRlZFZhbHVlKSA/PyBtaWdyYXRlZFZhbHVlO1xuXHRcdFx0XHRcdGlmIChkZWJ1ZykgY29uc29sZS5kZWJ1ZyhgW3dlYmV4dC1zdG9yZV0gU3RvcmFnZSBtaWdyYXRpb24gcHJvY2Vzc2VkIGZvciB2ZXJzaW9uOiB2JHttaWdyYXRlVG9WZXJzaW9ufWApO1xuXHRcdFx0XHR9IGNhdGNoIChlcnIpIHtcblx0XHRcdFx0XHR0aHJvdyBuZXcgTWlncmF0aW9uRXJyb3Ioa2V5LCBtaWdyYXRlVG9WZXJzaW9uLCB7IGNhdXNlOiBlcnIgfSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0YXdhaXQgZHJpdmVyLnNldEl0ZW1zKFt7XG5cdFx0XHRcdFx0a2V5OiBkcml2ZXJLZXksXG5cdFx0XHRcdFx0dmFsdWU6IG1pZ3JhdGVkVmFsdWVcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdGtleTogZHJpdmVyTWV0YUtleSxcblx0XHRcdFx0XHR2YWx1ZToge1xuXHRcdFx0XHRcdFx0Li4ubWV0YSxcblx0XHRcdFx0XHRcdHY6IHRhcmdldFZlcnNpb25cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1dKTtcblx0XHRcdFx0aWYgKGRlYnVnKSBjb25zb2xlLmRlYnVnKGBbd2ViZXh0LXN0b3JlXSBTdG9yYWdlIG1pZ3JhdGlvbiBjb21wbGV0ZWQgZm9yICR7a2V5fSB2JHt0YXJnZXRWZXJzaW9ufWAsIHsgbWlncmF0ZWRWYWx1ZSB9KTtcblx0XHRcdFx0b25NaWdyYXRpb25Db21wbGV0ZT8uKG1pZ3JhdGVkVmFsdWUsIHRhcmdldFZlcnNpb24pO1xuXHRcdFx0fTtcblx0XHRcdGNvbnN0IG1pZ3JhdGlvbnNEb25lID0gb3B0cz8ubWlncmF0aW9ucyA9PSBudWxsID8gUHJvbWlzZS5yZXNvbHZlKCkgOiBtaWdyYXRlKCkuY2F0Y2goKGVycikgPT4ge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKGBbd2ViZXh0LXN0b3JlXSBNaWdyYXRpb24gZmFpbGVkIGZvciAke2tleX1gLCBlcnIpO1xuXHRcdFx0fSk7XG5cdFx0XHRjb25zdCBpbml0TG9jayA9IHdpdGhMb2NrKCk7XG5cdFx0XHRjb25zdCBnZXRGYWxsYmFjayA9ICgpID0+IG9wdHM/LmZhbGxiYWNrID8/IG9wdHM/LmRlZmF1bHRWYWx1ZSA/PyBudWxsO1xuXHRcdFx0Y29uc3QgZ2V0T3JJbml0VmFsdWUgPSAoKSA9PiBpbml0TG9jayhhc3luYyAoKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0gYXdhaXQgZHJpdmVyLmdldEl0ZW0oZHJpdmVyS2V5KTtcblx0XHRcdFx0aWYgKHZhbHVlICE9IG51bGwgfHwgb3B0cz8uaW5pdCA9PSBudWxsKSByZXR1cm4gdmFsdWU7XG5cdFx0XHRcdGNvbnN0IG5ld1ZhbHVlID0gYXdhaXQgb3B0cy5pbml0KCk7XG5cdFx0XHRcdGF3YWl0IGRyaXZlci5zZXRJdGVtKGRyaXZlcktleSwgbmV3VmFsdWUpO1xuXHRcdFx0XHRpZiAodmFsdWUgPT0gbnVsbCAmJiB0YXJnZXRWZXJzaW9uID4gMSkgYXdhaXQgc2V0TWV0YShkcml2ZXIsIGRyaXZlcktleSwgeyB2OiB0YXJnZXRWZXJzaW9uIH0pO1xuXHRcdFx0XHRyZXR1cm4gbmV3VmFsdWU7XG5cdFx0XHR9KTtcblx0XHRcdG1pZ3JhdGlvbnNEb25lLnRoZW4oZ2V0T3JJbml0VmFsdWUpO1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0a2V5LFxuXHRcdFx0XHRnZXQgZGVmYXVsdFZhbHVlKCkge1xuXHRcdFx0XHRcdHJldHVybiBnZXRGYWxsYmFjaygpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXQgZmFsbGJhY2soKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGdldEZhbGxiYWNrKCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldFZhbHVlOiBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0aWYgKG9wdHM/LmluaXQpIHJldHVybiBhd2FpdCBnZXRPckluaXRWYWx1ZSgpO1xuXHRcdFx0XHRcdGVsc2UgcmV0dXJuIGF3YWl0IGdldEl0ZW0oZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRnZXRNZXRhOiBhc3luYyAoKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IGdldE1ldGEoZHJpdmVyLCBkcml2ZXJLZXkpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzZXRWYWx1ZTogYXN5bmMgKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0aWYgKG5lZWRzVmVyc2lvblNldCkge1xuXHRcdFx0XHRcdFx0bmVlZHNWZXJzaW9uU2V0ID0gZmFsc2U7XG5cdFx0XHRcdFx0XHRhd2FpdCBQcm9taXNlLmFsbChbc2V0SXRlbShkcml2ZXIsIGRyaXZlcktleSwgdmFsdWUpLCBzZXRNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCB7IHY6IHRhcmdldFZlcnNpb24gfSldKTtcblx0XHRcdFx0XHR9IGVsc2UgYXdhaXQgc2V0SXRlbShkcml2ZXIsIGRyaXZlcktleSwgdmFsdWUpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRzZXRNZXRhOiBhc3luYyAocHJvcGVydGllcykgPT4ge1xuXHRcdFx0XHRcdGF3YWl0IG1pZ3JhdGlvbnNEb25lO1xuXHRcdFx0XHRcdHJldHVybiBhd2FpdCBzZXRNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0cmVtb3ZlVmFsdWU6IGFzeW5jIChvcHRzKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IHJlbW92ZUl0ZW0oZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRyZW1vdmVNZXRhOiBhc3luYyAocHJvcGVydGllcykgPT4ge1xuXHRcdFx0XHRcdGF3YWl0IG1pZ3JhdGlvbnNEb25lO1xuXHRcdFx0XHRcdHJldHVybiBhd2FpdCByZW1vdmVNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0d2F0Y2g6IChjYikgPT4gd2F0Y2goZHJpdmVyLCBkcml2ZXJLZXksIChuZXdWYWx1ZSwgb2xkVmFsdWUpID0+IGNiKG5ld1ZhbHVlID8/IGdldEZhbGxiYWNrKCksIG9sZFZhbHVlID8/IGdldEZhbGxiYWNrKCkpKSxcblx0XHRcdFx0bWlncmF0ZVxuXHRcdFx0fTtcblx0XHR9XG5cdH07XG59XG5mdW5jdGlvbiBjcmVhdGVEcml2ZXIoc3RvcmFnZUFyZWEpIHtcblx0Y29uc3QgZ2V0U3RvcmFnZUFyZWEgPSAoKSA9PiB7XG5cdFx0aWYgKGJyb3dzZXIucnVudGltZSA9PSBudWxsKSB0aHJvdyBFcnJvcihgJ3dlYmV4dC1zdG9yZScgbXVzdCBiZSBsb2FkZWQgaW4gYSB3ZWIgZXh0ZW5zaW9uIGVudmlyb25tZW50LmApO1xuXHRcdGlmIChicm93c2VyLnN0b3JhZ2UgPT0gbnVsbCkgdGhyb3cgRXJyb3IoXCJZb3UgbXVzdCBhZGQgdGhlICdzdG9yYWdlJyBwZXJtaXNzaW9uIHRvIHlvdXIgbWFuaWZlc3QgdG8gdXNlICd3ZWJleHQtc3RvcmUnXCIpO1xuXHRcdGNvbnN0IGFyZWEgPSBicm93c2VyLnN0b3JhZ2Vbc3RvcmFnZUFyZWFdO1xuXHRcdGlmIChhcmVhID09IG51bGwpIHRocm93IEVycm9yKGBcImJyb3dzZXIuc3RvcmFnZS4ke3N0b3JhZ2VBcmVhfVwiIGlzIHVuZGVmaW5lZGApO1xuXHRcdHJldHVybiBhcmVhO1xuXHR9O1xuXHRjb25zdCB3YXRjaExpc3RlbmVycyA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgU2V0KCk7XG5cdHJldHVybiB7XG5cdFx0Z2V0SXRlbTogYXN5bmMgKGtleSkgPT4ge1xuXHRcdFx0cmV0dXJuIChhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLmdldChrZXkpKVtrZXldO1xuXHRcdH0sXG5cdFx0Z2V0SXRlbXM6IGFzeW5jIChrZXlzKSA9PiB7XG5cdFx0XHRjb25zdCByZXN1bHQgPSBhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLmdldChrZXlzKTtcblx0XHRcdHJldHVybiBrZXlzLm1hcCgoa2V5KSA9PiAoe1xuXHRcdFx0XHRrZXksXG5cdFx0XHRcdHZhbHVlOiByZXN1bHRba2V5XSA/PyBudWxsXG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRzZXRJdGVtOiBhc3luYyAoa2V5LCB2YWx1ZSkgPT4ge1xuXHRcdFx0aWYgKHZhbHVlID09IG51bGwpIGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkucmVtb3ZlKGtleSk7XG5cdFx0XHRlbHNlIGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuc2V0KHsgW2tleV06IHZhbHVlIH0pO1xuXHRcdH0sXG5cdFx0c2V0SXRlbXM6IGFzeW5jICh2YWx1ZXMpID0+IHtcblx0XHRcdGNvbnN0IG1hcCA9IHZhbHVlcy5yZWR1Y2UoKG1hcCwgeyBrZXksIHZhbHVlIH0pID0+IHtcblx0XHRcdFx0bWFwW2tleV0gPSB2YWx1ZTtcblx0XHRcdFx0cmV0dXJuIG1hcDtcblx0XHRcdH0sIHt9KTtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuc2V0KG1hcCk7XG5cdFx0fSxcblx0XHRyZW1vdmVJdGVtOiBhc3luYyAoa2V5KSA9PiB7XG5cdFx0XHRhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLnJlbW92ZShrZXkpO1xuXHRcdH0sXG5cdFx0cmVtb3ZlSXRlbXM6IGFzeW5jIChrZXlzKSA9PiB7XG5cdFx0XHRhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLnJlbW92ZShrZXlzKTtcblx0XHR9LFxuXHRcdGNsZWFyOiBhc3luYyAoKSA9PiB7XG5cdFx0XHRhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLmNsZWFyKCk7XG5cdFx0fSxcblx0XHRzbmFwc2hvdDogYXN5bmMgKCkgPT4ge1xuXHRcdFx0cmV0dXJuIGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuZ2V0KCk7XG5cdFx0fSxcblx0XHRyZXN0b3JlU25hcHNob3Q6IGFzeW5jIChkYXRhKSA9PiB7XG5cdFx0XHRhd2FpdCBnZXRTdG9yYWdlQXJlYSgpLnNldChkYXRhKTtcblx0XHR9LFxuXHRcdHdhdGNoKGtleSwgY2IpIHtcblx0XHRcdGNvbnN0IGxpc3RlbmVyID0gKGNoYW5nZXMpID0+IHtcblx0XHRcdFx0Y29uc3QgY2hhbmdlID0gY2hhbmdlc1trZXldO1xuXHRcdFx0XHRpZiAoY2hhbmdlID09IG51bGwgfHwgZGVxdWFsKGNoYW5nZS5uZXdWYWx1ZSwgY2hhbmdlLm9sZFZhbHVlKSkgcmV0dXJuO1xuXHRcdFx0XHRjYihjaGFuZ2UubmV3VmFsdWUgPz8gbnVsbCwgY2hhbmdlLm9sZFZhbHVlID8/IG51bGwpO1xuXHRcdFx0fTtcblx0XHRcdGdldFN0b3JhZ2VBcmVhKCkub25DaGFuZ2VkLmFkZExpc3RlbmVyKGxpc3RlbmVyKTtcblx0XHRcdHdhdGNoTGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG5cdFx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0XHRnZXRTdG9yYWdlQXJlYSgpLm9uQ2hhbmdlZC5yZW1vdmVMaXN0ZW5lcihsaXN0ZW5lcik7XG5cdFx0XHRcdHdhdGNoTGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG5cdFx0XHR9O1xuXHRcdH0sXG5cdFx0dW53YXRjaCgpIHtcblx0XHRcdHdhdGNoTGlzdGVuZXJzLmZvckVhY2goKGxpc3RlbmVyKSA9PiB7XG5cdFx0XHRcdGdldFN0b3JhZ2VBcmVhKCkub25DaGFuZ2VkLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcblx0XHRcdH0pO1xuXHRcdFx0d2F0Y2hMaXN0ZW5lcnMuY2xlYXIoKTtcblx0XHR9XG5cdH07XG59XG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvaG9vay50c1xuLyoqXG4qIE9wdGlvbmFsIFJlYWN0IGJpbmRpbmdzIGZvciBgd2ViZXh0LXN0b3JlYC5cbipcbiogYHJlYWN0YCBpcyBhIHBlZXIgZGVwZW5kZW5jeSBhbmQgaXMgb25seSBldmVyIGltcG9ydGVkIGZyb20gdGhpcyBmaWxlLCBzb1xuKiBhbnlvbmUgaW1wb3J0aW5nIGZyb20gYHdlYmV4dC1zdG9yZWAgKHRoZSByb290IGVudHJ5cG9pbnQpIG5ldmVyIHB1bGxzXG4qIFJlYWN0IGludG8gdGhlaXIgYnVuZGxlLiBPbmx5IHByb2plY3RzIHRoYXQgaW1wb3J0IGZyb21cbiogYHdlYmV4dC1zdG9yZS9yZWFjdGAgbmVlZCBgcmVhY3RgIGluc3RhbGxlZCBhdCBhbGwuXG4qXG4qIEBtb2R1bGUgd2ViZXh0LXN0b3JlL3JlYWN0IChzb3VyY2U6IGhvb2sudHMpXG4qL1xuY29uc3QgaXNTdG9yYWdlSXRlbSA9ICh4KSA9PiB0eXBlb2YgeCA9PT0gXCJvYmplY3RcIiAmJiB4ICE9IG51bGwgJiYgdHlwZW9mIHguZ2V0VmFsdWUgPT09IFwiZnVuY3Rpb25cIjtcbmNvbnN0IHBhdGNoUXVldWVzID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcbmZ1bmN0aW9uIHF1ZXVlUGF0Y2goa2V5LCBmbikge1xuXHRjb25zdCBuZXh0ID0gKHBhdGNoUXVldWVzLmdldChrZXkpID8/IFByb21pc2UucmVzb2x2ZSgpKS50aGVuKGZuLCBmbik7XG5cdHBhdGNoUXVldWVzLnNldChrZXksIG5leHQudGhlbigoKSA9PiB2b2lkIDAsICgpID0+IHZvaWQgMCkpO1xuXHRyZXR1cm4gbmV4dDtcbn1cbmZ1bmN0aW9uIHVzZVN0b3JhZ2Uoa2V5T3JJdGVtLCBvcHRpb25zKSB7XG5cdGNvbnN0IGl0ZW0gPSBpc1N0b3JhZ2VJdGVtKGtleU9ySXRlbSkgPyBrZXlPckl0ZW0gOiB2b2lkIDA7XG5cdGNvbnN0IGtleSA9IGl0ZW0gPyBpdGVtLmtleSA6IGtleU9ySXRlbTtcblx0Y29uc3QgZmFsbGJhY2sgPSBpdGVtID8gaXRlbS5mYWxsYmFjayA6IG9wdGlvbnM/LmZhbGxiYWNrID8/IG9wdGlvbnM/LmRlZmF1bHRWYWx1ZSA/PyBudWxsO1xuXHRjb25zdCBvbkNoYW5nZVJlZiA9IHVzZVJlZihvcHRpb25zPy5vbkNoYW5nZSk7XG5cdG9uQ2hhbmdlUmVmLmN1cnJlbnQgPSBvcHRpb25zPy5vbkNoYW5nZTtcblx0Y29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZSh7XG5cdFx0dmFsdWU6IGZhbGxiYWNrLFxuXHRcdGxvYWRpbmc6IHRydWUsXG5cdFx0ZXJyb3I6IG51bGxcblx0fSk7XG5cdHVzZUVmZmVjdCgoKSA9PiB7XG5cdFx0bGV0IGNhbmNlbGxlZCA9IGZhbHNlO1xuXHRcdHNldFN0YXRlKChzKSA9PiAoe1xuXHRcdFx0Li4ucyxcblx0XHRcdGxvYWRpbmc6IHRydWVcblx0XHR9KSk7XG5cdFx0KGFzeW5jICgpID0+IHtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGNvbnN0IHZhbHVlID0gaXRlbSA/IGF3YWl0IGl0ZW0uZ2V0VmFsdWUoKSA6IGF3YWl0IHN0b3JhZ2UuZ2V0SXRlbShrZXksIG9wdGlvbnMpO1xuXHRcdFx0XHRpZiAoIWNhbmNlbGxlZCkgc2V0U3RhdGUoe1xuXHRcdFx0XHRcdHZhbHVlLFxuXHRcdFx0XHRcdGxvYWRpbmc6IGZhbHNlLFxuXHRcdFx0XHRcdGVycm9yOiBudWxsXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0aWYgKCFjYW5jZWxsZWQpIHNldFN0YXRlKChzKSA9PiAoe1xuXHRcdFx0XHRcdC4uLnMsXG5cdFx0XHRcdFx0bG9hZGluZzogZmFsc2UsXG5cdFx0XHRcdFx0ZXJyb3Jcblx0XHRcdFx0fSkpO1xuXHRcdFx0fVxuXHRcdH0pKCk7XG5cdFx0Y29uc3QgaGFuZGxlQ2hhbmdlID0gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkgPT4ge1xuXHRcdFx0c2V0U3RhdGUoe1xuXHRcdFx0XHR2YWx1ZTogbmV3VmFsdWUgPz8gZmFsbGJhY2ssXG5cdFx0XHRcdGxvYWRpbmc6IGZhbHNlLFxuXHRcdFx0XHRlcnJvcjogbnVsbFxuXHRcdFx0fSk7XG5cdFx0XHRvbkNoYW5nZVJlZi5jdXJyZW50Py4obmV3VmFsdWUsIG9sZFZhbHVlKTtcblx0XHR9O1xuXHRcdGNvbnN0IHVud2F0Y2ggPSBpdGVtID8gaXRlbS53YXRjaChoYW5kbGVDaGFuZ2UpIDogc3RvcmFnZS53YXRjaChrZXksIGhhbmRsZUNoYW5nZSk7XG5cdFx0cmV0dXJuICgpID0+IHtcblx0XHRcdGNhbmNlbGxlZCA9IHRydWU7XG5cdFx0XHR1bndhdGNoKCk7XG5cdFx0fTtcblx0fSwgW2tleV0pO1xuXHRjb25zdCBzZXRWYWx1ZSA9IHVzZUNhbGxiYWNrKGFzeW5jICh2YWx1ZSkgPT4ge1xuXHRcdGlmIChpdGVtKSBhd2FpdCBpdGVtLnNldFZhbHVlKHZhbHVlKTtcblx0XHRlbHNlIGF3YWl0IHN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcblx0fSwgW2tleV0pO1xuXHRjb25zdCBwYXRjaFZhbHVlID0gdXNlQ2FsbGJhY2soKHBhcnRpYWwpID0+IHF1ZXVlUGF0Y2goa2V5LCBhc3luYyAoKSA9PiB7XG5cdFx0Y29uc3QgbmV4dCA9IHtcblx0XHRcdC4uLml0ZW0gPyBhd2FpdCBpdGVtLmdldFZhbHVlKCkgOiBhd2FpdCBzdG9yYWdlLmdldEl0ZW0oa2V5LCBvcHRpb25zKSA/PyBmYWxsYmFjayxcblx0XHRcdC4uLnBhcnRpYWxcblx0XHR9O1xuXHRcdGlmIChpdGVtKSBhd2FpdCBpdGVtLnNldFZhbHVlKG5leHQpO1xuXHRcdGVsc2UgYXdhaXQgc3RvcmFnZS5zZXRJdGVtKGtleSwgbmV4dCk7XG5cdH0pLCBba2V5XSk7XG5cdGNvbnN0IHJlbW92ZVZhbHVlID0gdXNlQ2FsbGJhY2soYXN5bmMgKG9wdHMpID0+IHtcblx0XHRpZiAoaXRlbSkgYXdhaXQgaXRlbS5yZW1vdmVWYWx1ZShvcHRzKTtcblx0XHRlbHNlIGF3YWl0IHN0b3JhZ2UucmVtb3ZlSXRlbShrZXksIG9wdHMpO1xuXHR9LCBba2V5XSk7XG5cdHJldHVybiB7XG5cdFx0dmFsdWU6IHN0YXRlLnZhbHVlLFxuXHRcdGxvYWRpbmc6IHN0YXRlLmxvYWRpbmcsXG5cdFx0ZXJyb3I6IHN0YXRlLmVycm9yLFxuXHRcdHNldFZhbHVlLFxuXHRcdHBhdGNoVmFsdWUsXG5cdFx0cmVtb3ZlVmFsdWVcblx0fTtcbn1cbi8qKlxuKiBMb3dlci1sZXZlbCBob29rIGZvciB3aGVuIHlvdSBqdXN0IHdhbnQgdG8gKnJlYWN0KiB0byBjaGFuZ2VzIChlLmcuIHN5bmNcbiogc29tZXRoaW5nIG91dHNpZGUgUmVhY3QsIGxvZyBhbmFseXRpY3MsIGludmFsaWRhdGUgYSBjYWNoZSkgd2l0aG91dFxuKiBuZWVkaW5nIHRoZSB2YWx1ZSBpbiByZW5kZXIgc3RhdGUgYXQgYWxsLiBFZmZlY3RpdmVseSBgc3RvcmFnZS53YXRjaCgpYFxuKiB3aXJlZCB1cCB0byB0aGUgY29tcG9uZW50IGxpZmVjeWNsZS5cbipcbiogQGV4YW1wbGVcbiogICB1c2VTdG9yYWdlV2F0Y2goJ2xvY2FsOnRoZW1lJywgKG5ld1RoZW1lLCBvbGRUaGVtZSkgPT4ge1xuKiAgICAgY29uc29sZS5sb2coYHRoZW1lIGNoYW5nZWQ6ICR7b2xkVGhlbWV9IC0+ICR7bmV3VGhlbWV9YCk7XG4qICAgfSk7XG4qL1xuZnVuY3Rpb24gdXNlU3RvcmFnZVdhdGNoKGtleSwgY2FsbGJhY2spIHtcblx0Y29uc3QgY2FsbGJhY2tSZWYgPSB1c2VSZWYoY2FsbGJhY2spO1xuXHRjYWxsYmFja1JlZi5jdXJyZW50ID0gY2FsbGJhY2s7XG5cdHVzZUVmZmVjdCgoKSA9PiB7XG5cdFx0cmV0dXJuIHN0b3JhZ2Uud2F0Y2goa2V5LCAobmV3VmFsdWUsIG9sZFZhbHVlKSA9PiBjYWxsYmFja1JlZi5jdXJyZW50KG5ld1ZhbHVlLCBvbGRWYWx1ZSkpO1xuXHR9LCBba2V5XSk7XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IE1pZ3JhdGlvbkVycm9yIGFzIGEsIGJyb3dzZXIgYXMgaSwgdXNlU3RvcmFnZVdhdGNoIGFzIG4sIHN0b3JhZ2UgYXMgciwgdXNlU3RvcmFnZSBhcyB0IH07XG4iLCJpbXBvcnQgeyBzdG9yYWdlIH0gZnJvbSBcIndlYmV4dC1zdG9yZVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzIHtcblx0dGhlbWU6IFwibGlnaHRcIiB8IFwiZGFya1wiO1xuXHRkaXNwbGF5TmFtZTogc3RyaW5nO1xufVxuXG4vKipcbiAqIEEgdmVyc2lvbmVkIGl0ZW0uIEJ1bXBpbmcgYHZlcnNpb25gIGFuZCBhZGRpbmcgYSBtaWdyYXRpb24gZnVuY3Rpb24gaXMgaG93XG4gKiB3ZWJleHQtc3RvcmUgZXZvbHZlcyBhIHN0b3JlZCBzaGFwZSBvdmVyIHRpbWUg4oCUIG1pZ3JhdGlvbnMgcnVuXG4gKiBhdXRvbWF0aWNhbGx5LCBvbmNlLCB0aGUgZmlyc3QgdGltZSB0aGUgaXRlbSBpcyB0b3VjaGVkIGFmdGVyIGFuIHVwZGF0ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IHNldHRpbmdzSXRlbSA9IHN0b3JhZ2UuZGVmaW5lSXRlbTxTZXR0aW5ncz4oXCJzeW5jOnNldHRpbmdzXCIsIHtcblx0ZmFsbGJhY2s6IHsgdGhlbWU6IFwibGlnaHRcIiwgZGlzcGxheU5hbWU6IFwiR3Vlc3RcIiB9LFxuXHR2ZXJzaW9uOiAzLFxuXHRtaWdyYXRpb25zOiB7XG5cdFx0Ly8gdjEgLT4gdjI6IGludHJvZHVjZWQgYHRoZW1lYFxuXHRcdDI6IChvbGQ6IGFueSkgPT4gKHsgLi4ub2xkLCB0aGVtZTogb2xkPy50aGVtZSA/PyBcImxpZ2h0XCIgfSksXG5cdFx0Ly8gdjIgLT4gdjM6IGludHJvZHVjZWQgYGRpc3BsYXlOYW1lYFxuXHRcdDM6IChvbGQ6IGFueSkgPT4gKHsgLi4ub2xkLCBkaXNwbGF5TmFtZTogb2xkPy5kaXNwbGF5TmFtZSA/PyBcIkd1ZXN0XCIgfSksXG5cdH0sXG5cdGRlYnVnOiB0cnVlLFxuXHRvbk1pZ3JhdGlvbkNvbXBsZXRlOiAodmFsdWUsIHRhcmdldFZlcnNpb24pID0+IHtcblx0XHRjb25zb2xlLmxvZyhcblx0XHRcdGBbd2ViZXh0LXN0b3JlLWRlbW9dIHNldHRpbmdzIG1pZ3JhdGVkIHRvIHYke3RhcmdldFZlcnNpb259YCxcblx0XHRcdHZhbHVlLFxuXHRcdCk7XG5cdH0sXG59KTtcblxuLyoqXG4gKiBgaW5pdGAgcnVucyBleGFjdGx5IG9uY2Ug4oCUIHRoZSBmaXJzdCB0aW1lIHRoaXMgaXRlbSBpcyBkZWZpbmVkIGluIGFueVxuICogZXh0ZW5zaW9uIGNvbnRleHQgYWZ0ZXIgaW5zdGFsbCDigJQgYW5kIG9ubHkgaWYgbm90aGluZyBpcyBpbiBzdG9yYWdlIHlldC5cbiAqIEdvb2QgZm9yIG9uZS10aW1lIElEcywgZmlyc3QtcnVuIHRpbWVzdGFtcHMsIGV0Yy5cbiAqL1xuZXhwb3J0IGNvbnN0IGluc3RhbGxJZEl0ZW0gPSBzdG9yYWdlLmRlZmluZUl0ZW08c3RyaW5nPihcImxvY2FsOmluc3RhbGxJZFwiLCB7XG5cdGluaXQ6ICgpID0+IGNyeXB0by5yYW5kb21VVUlEKCksXG59KTtcblxuLyoqXG4gKiBBIHBsYWluIGNvdW50ZXIgd2l0aCBhIGZhbGxiYWNrIG9mIDAuIFdyaXR0ZW4gdG8gZnJvbSB0aGUgcG9wdXAgKHZpYSB0aGVcbiAqIFJlYWN0IGhvb2spLCB0aGUgYmFja2dyb3VuZCAob24gYW4gYWxhcm0gKyBvbiBtZXNzYWdlKSwgYW5kIHJlYWQgZnJvbVxuICogYm90aCDigJQgdGhpcyBpcyB3aGF0IHRoZSBcIkNyb3NzLWNvbnRleHRcIiB0YWIgdXNlcyB0byBwcm92ZSBgd2F0Y2goKWAgZmlyZXNcbiAqIGFjcm9zcyBleGVjdXRpb24gY29udGV4dHMuXG4gKi9cbmV4cG9ydCBjb25zdCBoZWFydGJlYXRJdGVtID0gc3RvcmFnZS5kZWZpbmVJdGVtPG51bWJlcj4oXCJsb2NhbDpoZWFydGJlYXRcIiwge1xuXHRmYWxsYmFjazogMCxcbn0pO1xuXG4vKiogRml4ZWQga2V5cyB1c2VkIGJ5IHRoZSBiYXRjaC1vcGVyYXRpb25zIHRhYi4gKi9cbmV4cG9ydCBjb25zdCBCQVRDSF9LRVlTID0gW1xuXHRcImxvY2FsOmJhdGNoQVwiLFxuXHRcImxvY2FsOmJhdGNoQlwiLFxuXHRcImxvY2FsOmJhdGNoQ1wiLFxuXSBhcyBjb25zdDtcblxuZXhwb3J0IGludGVyZmFjZSBBcHBTZXR0aW5nIHtcblx0dGhlbWU6IFwibGlnaHRcIiB8IFwiZGFya1wiO1xuXHRmcmVlOiBib29sZWFuO1xufVxuXG4vKipcbiAqIFRoZSBgeyB0aGVtZTogJ2RhcmsnLCBmcmVlOiB0cnVlIH1gIHNoYXBlIGZyb20gdGhlIFwiaG93IGRvIEkgdXBkYXRlIG9uZVxuICoga2V5XCIgcXVlc3Rpb24g4oCUIHVzZWQgYnkgT2JqZWN0VXBkYXRlUGFuZWwuIHdlYmV4dC1zdG9yZSBzdG9yZXMgdGhlIHdob2xlXG4gKiB2YWx1ZSBhcyBvbmUgSlNPTiBibG9iLCBzbyBcInVwZGF0aW5nIG9uZSBrZXlcIiBhbHdheXMgbWVhbnMgcmVhZC1tb2RpZnktXG4gKiB3cml0ZSB0aGUgd2hvbGUgb2JqZWN0LCBzYW1lIGFzIHlvdSB3b3VsZCB3aXRoIHBsYWluIFJlYWN0IHN0YXRlLlxuICovXG5leHBvcnQgY29uc3QgYXBwU2V0dGluZ0l0ZW0gPSBzdG9yYWdlLmRlZmluZUl0ZW08QXBwU2V0dGluZz4oXG5cdFwibG9jYWw6YXBwU2V0dGluZ1wiLFxuXHR7XG5cdFx0ZmFsbGJhY2s6IHsgdGhlbWU6IFwiZGFya1wiLCBmcmVlOiB0cnVlIH0sXG5cdH0sXG4pO1xuIiwiaW1wb3J0IHsgc3RvcmFnZSB9IGZyb20gXCJ3ZWJleHQtc3RvcmVcIjtcblxuaW1wb3J0IHtcblx0aGVhcnRiZWF0SXRlbSxcblx0aW5zdGFsbElkSXRlbSxcblx0c2V0dGluZ3NJdGVtLFxufSBmcm9tIFwiQC91dGlscy9zdG9yYWdlLWl0ZW1zXCI7XG5cbi8qKlxuICogQmFja2dyb3VuZCAvIHNlcnZpY2Ugd29ya2VyIGd1aWRlXG4gKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gKiBNVjMgc2VydmljZSB3b3JrZXJzIGFyZSBOT1QgbG9uZy1saXZlZCDigJQgdGhlIGJyb3dzZXIga2lsbHMgYW5kIHJlc3RhcnRzXG4gKiB0aGVtIHdoZW5ldmVyIGl0IHdhbnRzIChpZGxlIHRpbWVvdXQsIG1lbW9yeSBwcmVzc3VyZSwgZXRjKS4gTm90aGluZyB5b3VcbiAqIGhvbGQgaW4gYSBwbGFpbiBKUyB2YXJpYWJsZSBoZXJlIHN1cnZpdmVzIHRoYXQuIGB3ZWJleHQtc3RvcmVgIGl0ZW1zIGRvLFxuICogYmVjYXVzZSBldmVyeSByZWFkL3dyaXRlIGdvZXMgc3RyYWlnaHQgdG8gYGJyb3dzZXIuc3RvcmFnZWAsIG5vdCB0b1xuICogaW4tbWVtb3J5IHN0YXRlIOKAlCB0aGF0J3MgKndoeSogc3RvcmFnZSwgbm90IG1vZHVsZS1sZXZlbCB2YXJpYWJsZXMsIGlzXG4gKiB0aGUgcmlnaHQgcGxhY2UgZm9yIGFueXRoaW5nIHRoZSBiYWNrZ3JvdW5kIG5lZWRzIHRvIHJlbWVtYmVyLlxuICpcbiAqIFRocmVlIHNlcGFyYXRlIGxpZmVjeWNsZSBob29rcyBtYXR0ZXIgaGVyZSwgYW5kIGl0J3MgZWFzeSB0byBjb25mbGF0ZVxuICogdGhlbTpcbiAqICAgLSBgZGVmaW5lQmFja2dyb3VuZCgoKSA9PiB7Li4ufSlgIGJvZHkg4oCUIHJ1bnMgZXZlcnkgdGltZSB0aGlzIHNlcnZpY2VcbiAqICAgICB3b3JrZXIgKHJlKXN0YXJ0cy4gUHV0IHN1YnNjcmlwdGlvbnMgKGAud2F0Y2goKWApIGFuZCBhbGFybS9tZXNzYWdlXG4gKiAgICAgbGlzdGVuZXJzIGhlcmUg4oCUIHRoZXkgbmVlZCB0byBiZSByZS1yZWdpc3RlcmVkIG9uIGV2ZXJ5IHJlc3RhcnQuXG4gKiAgIC0gYGJyb3dzZXIucnVudGltZS5vbkluc3RhbGxlZGAg4oCUIHJ1bnMgb25jZSBvbiBpbnN0YWxsLCBhbmQgb25jZSBwZXJcbiAqICAgICBleHRlbnNpb24gdXBkYXRlLiBUaGlzIGlzIHRoZSBjb3JyZWN0IHBsYWNlIGZvciBvbmUtdGltZSBzZXR1cCBhbmRcbiAqICAgICBmb3IgZm9yY2luZyBtaWdyYXRpb25zIGJlZm9yZSBhbnl0aGluZyBlbHNlIHRvdWNoZXMgdGhlIGRhdGEuXG4gKiAgIC0gYGJyb3dzZXIuYWxhcm1zYCDigJQgTVYzJ3MgcmVwbGFjZW1lbnQgZm9yIGBzZXRJbnRlcnZhbGAgaW4gYSBzZXJ2aWNlXG4gKiAgICAgd29ya2VyOyBhIHBsYWluIGBzZXRJbnRlcnZhbGAgZ2V0cyB0aHJvd24gYXdheSB0aGUgbW9tZW50IHRoZSB3b3JrZXJcbiAqICAgICBpcyBraWxsZWQsIGBhbGFybXNgIHN1cnZpdmVzIHJlc3RhcnRzIGJlY2F1c2UgdGhlIGJyb3dzZXIgaXRzZWxmXG4gKiAgICAgc2NoZWR1bGVzIHRoZW0uXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUJhY2tncm91bmQoKCkgPT4ge1xuXHRjb25zb2xlLmxvZyhcIlt3ZWJleHQtc3RvcmUtZGVtb10gYmFja2dyb3VuZCBzdGFydGVkXCIpO1xuXG5cdC8vIFJ1bnMgb25jZSBwZXIgaW5zdGFsbCBhbmQgb25jZSBwZXIgdXBkYXRlIOKAlCBub3Qgb24gZXZlcnkgd29ya2VyXG5cdC8vIHJlc3RhcnQuIEdvb2QgcGxhY2UgdG8gZm9yY2UgbWlncmF0aW9ucy9pbml0IGFoZWFkIG9mIGFueXRoaW5nIGVsc2UsXG5cdC8vIGFuZCB0byB0ZWxsIGZyZXNoIGluc3RhbGxzIGFwYXJ0IGZyb20gdXBkYXRlcy5cblx0YnJvd3Nlci5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKCh7IHJlYXNvbiB9KSA9PiB7XG5cdFx0aWYgKHJlYXNvbiA9PT0gXCJpbnN0YWxsXCIpIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiW3dlYmV4dC1zdG9yZS1kZW1vXSBmaXJzdCBpbnN0YWxsXCIpO1xuXHRcdH0gZWxzZSBpZiAocmVhc29uID09PSBcInVwZGF0ZVwiKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhcIlt3ZWJleHQtc3RvcmUtZGVtb10gdXBkYXRlZCDigJQgcnVubmluZyBwZW5kaW5nIG1pZ3JhdGlvbnNcIik7XG5cdFx0fVxuXHRcdHNldHRpbmdzSXRlbS5taWdyYXRlKCk7XG5cdH0pO1xuXG5cdC8vIGBkZWZpbmVJdGVtKClgIGFsc28gcnVucyBwZW5kaW5nIG1pZ3JhdGlvbnMgbGF6aWx5IHRoZSBmaXJzdCB0aW1lIGl0J3Ncblx0Ly8gdG91Y2hlZCwgc28gdGhpcyBpc24ndCBzdHJpY3RseSByZXF1aXJlZCDigJQgYnV0IGNhbGxpbmcgaXQgZXhwbGljaXRseSBvblxuXHQvLyBldmVyeSB3b3JrZXIgc3RhcnQgKG5vdCBqdXN0IG9uIGluc3RhbGwvdXBkYXRlKSBtZWFucyBpdCdzIGd1YXJhbnRlZWRcblx0Ly8gdG8gaGF2ZSBoYXBwZW5lZCBiZWZvcmUgYW55dGhpbmcgYmVsb3cgcmVhZHMgYHNldHRpbmdzSXRlbWAuXG5cdHNldHRpbmdzSXRlbS5taWdyYXRlKCk7XG5cblx0Ly8gYGluaXRgIGl0ZW1zIHJlc29sdmUgdGhlbXNlbHZlcyBvbiBmaXJzdCBhY2Nlc3MgdG9vIOKAlCB0aGlzIGp1c3QgZm9yY2VzXG5cdC8vIHRoYXQgdG8gaGFwcGVuIGltbWVkaWF0ZWx5LCBzbyB0aGUgaW5zdGFsbCBJRCBleGlzdHMgcmlnaHQgYXdheSByYXRoZXJcblx0Ly8gdGhhbiB3YWl0aW5nIGZvciB0aGUgZmlyc3QgYGdldFZhbHVlKClgIGNhbGwgZnJvbSBlbHNld2hlcmUuXG5cdGluc3RhbGxJZEl0ZW0uZ2V0VmFsdWUoKS50aGVuKChpZCkgPT4ge1xuXHRcdGNvbnNvbGUubG9nKFwiW3dlYmV4dC1zdG9yZS1kZW1vXSBpbnN0YWxsIGlkOlwiLCBpZCk7XG5cdH0pO1xuXG5cdC8vIFByb3ZlIGBzdG9yYWdlLndhdGNoYCB3b3JrcyBmcm9tIHRoZSBiYWNrZ3JvdW5kIHRvbywgbm90IGp1c3QgZnJvbVxuXHQvLyBSZWFjdCDigJQgdGhpcyBsb2dzIGV2ZXJ5IGNoYW5nZSBtYWRlIGZyb20gQU5ZIGNvbnRleHQgKHBvcHVwIGluY2x1ZGVkKS5cblx0Ly8gTXVzdCBiZSByZS1yZWdpc3RlcmVkIGhlcmUsIGluIHRoZSBmdW5jdGlvbiBib2R5LCBldmVyeSB0aW1lIHRoZVxuXHQvLyB3b3JrZXIgcmVzdGFydHMg4oCUIGEgd2F0Y2hlciBzZXQgdXAgb25jZSBhbmQgXCJyZW1lbWJlcmVkXCIgZG9lc24ndFxuXHQvLyBzdXJ2aXZlIHRoZSB3b3JrZXIgYmVpbmcga2lsbGVkLlxuXHRjb25zdCB1bndhdGNoSGVhcnRiZWF0ID0gaGVhcnRiZWF0SXRlbS53YXRjaCgobmV3VmFsdWUsIG9sZFZhbHVlKSA9PiB7XG5cdFx0Y29uc29sZS5sb2coYFt3ZWJleHQtc3RvcmUtZGVtb10gaGVhcnRiZWF0OiAke29sZFZhbHVlfSAtPiAke25ld1ZhbHVlfWApO1xuXHR9KTtcblxuXHQvLyBQZXJpb2RpYyB3cml0ZSwgZW50aXJlbHkgaW5kZXBlbmRlbnQgb2YgdGhlIHBvcHVwIGJlaW5nIG9wZW4uIElmIHlvdVxuXHQvLyBoYXZlIHRoZSBwb3B1cCBvcGVuIHdpdGggdGhlIFwiQ3Jvc3MtY29udGV4dFwiIHRhYiBhY3RpdmUsIHlvdSdsbCBzZWVcblx0Ly8gdGhpcyB0aWNrIHVwIG9uIGl0cyBvd24gZXZlcnkgZmV3IHNlY29uZHMuIGBhbGFybXMuY3JlYXRlYCBpc1xuXHQvLyBpZGVtcG90ZW50IGJ5IG5hbWUsIHNvIHJlLWNhbGxpbmcgaXQgb24gZXZlcnkgd29ya2VyIHJlc3RhcnQgaXMgZmluZSDigJRcblx0Ly8gaXQgd29uJ3QgY3JlYXRlIGR1cGxpY2F0ZSBhbGFybXMuXG5cdGJyb3dzZXIuYWxhcm1zLmNyZWF0ZShcImhlYXJ0YmVhdFwiLCB7IHBlcmlvZEluTWludXRlczogMC4wNSB9KTsgLy8gfjNzXG5cdGJyb3dzZXIuYWxhcm1zLm9uQWxhcm0uYWRkTGlzdGVuZXIoYXN5bmMgKGFsYXJtKSA9PiB7XG5cdFx0aWYgKGFsYXJtLm5hbWUgIT09IFwiaGVhcnRiZWF0XCIpIHJldHVybjtcblx0XHRjb25zdCBjdXJyZW50ID0gYXdhaXQgaGVhcnRiZWF0SXRlbS5nZXRWYWx1ZSgpO1xuXHRcdGF3YWl0IGhlYXJ0YmVhdEl0ZW0uc2V0VmFsdWUoY3VycmVudCArIDEpO1xuXHR9KTtcblxuXHQvLyBPbi1kZW1hbmQgYnVtcCwgdHJpZ2dlcmVkIGJ5IGEgYnV0dG9uIGluIHRoZSBwb3B1cCDigJQgZGVtb25zdHJhdGVzIGFcblx0Ly8gd3JpdGUgZnJvbSB0aGUgYmFja2dyb3VuZCBiZWluZyByZWZsZWN0ZWQgbGl2ZSBpbiB0aGUgcG9wdXAncyBVSSB2aWFcblx0Ly8gYHVzZVN0b3JhZ2VgJ3MgYnVpbHQtaW4gd2F0Y2gsIHdpdGggbm8gbWFudWFsIG1lc3NhZ2UtcGFzc2luZyBuZWVkZWQgb25cblx0Ly8gdGhlIHBvcHVwIHNpZGUgdG8gcGljayBpdCB1cC5cblx0YnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZSkgPT4ge1xuXHRcdGlmIChtZXNzYWdlPy50eXBlID09PSBcImJ1bXAtaGVhcnRiZWF0XCIpIHtcblx0XHRcdHJldHVybiBoZWFydGJlYXRJdGVtXG5cdFx0XHRcdC5nZXRWYWx1ZSgpXG5cdFx0XHRcdC50aGVuKChjdXJyZW50KSA9PiBoZWFydGJlYXRJdGVtLnNldFZhbHVlKGN1cnJlbnQgKyAxKSk7XG5cdFx0fVxuXHR9KTtcblxuXHQvLyBDbGVhbnVwIGlzIG1vc3RseSBtb290IGZvciBhIHNlcnZpY2Ugd29ya2VyIChpdCdzIHRvcm4gZG93biBieSB0aGVcblx0Ly8gYnJvd3Nlciwgbm90IHVubW91bnRlZCksIGJ1dCBzaG93biBoZXJlIGZvciBjb21wbGV0ZW5lc3MgLyBzeW1tZXRyeVxuXHQvLyB3aXRoIGhvdyB5b3UnZCBjbGVhbiB1cCBhIHdhdGNoZXIgYW55d2hlcmUgZWxzZS5cblx0c2VsZi5hZGRFdmVudExpc3RlbmVyKFwiYmVmb3JldW5sb2FkXCIgYXMgYW55LCAoKSA9PiB7XG5cdFx0dW53YXRjaEhlYXJ0YmVhdCgpO1xuXHRcdHN0b3JhZ2UudW53YXRjaCgpO1xuXHR9KTtcbn0pO1xuIiwiLy8jcmVnaW9uIHNyYy9pbmRleC50c1xuLyoqXG4qIENsYXNzIGZvciBwYXJzaW5nIGFuZCBwZXJmb3JtaW5nIG9wZXJhdGlvbnMgb24gbWF0Y2ggcGF0dGVybnMuXG4qXG4qIEBleGFtcGxlXG4qICAgY29uc3QgcGF0dGVybiA9IG5ldyBNYXRjaFBhdHRlcm4oJyo6Ly9nb29nbGUuY29tLyonKTtcbipcbiogICBwYXR0ZXJuLmluY2x1ZGVzKCdodHRwczovL2dvb2dsZS5jb20nKTsgLy8gdHJ1ZVxuKiAgIHBhdHRlcm4uaW5jbHVkZXMoJ2h0dHA6Ly95b3V0dWJlLmNvbS93YXRjaD92PTEyMycpOyAvLyBmYWxzZVxuKi9cbnZhciBNYXRjaFBhdHRlcm4gPSBjbGFzcyBNYXRjaFBhdHRlcm4ge1xuXHRzdGF0aWMge1xuXHRcdHRoaXMuUFJPVE9DT0xTID0gW1xuXHRcdFx0XCJodHRwXCIsXG5cdFx0XHRcImh0dHBzXCIsXG5cdFx0XHRcImZpbGVcIixcblx0XHRcdFwiZnRwXCIsXG5cdFx0XHRcInVyblwiLFxuXHRcdFx0XCJ3c1wiLFxuXHRcdFx0XCJ3c3NcIlxuXHRcdF07XG5cdH1cblx0LyoqXG5cdCogUGFyc2UgYSBtYXRjaCBwYXR0ZXJuIHN0cmluZy4gSWYgaXQgaXMgaW52YWxpZCwgdGhlIGNvbnN0cnVjdG9yIHdpbGwgdGhyb3cgYW5cblx0KiBgSW52YWxpZE1hdGNoUGF0dGVybmAgZXJyb3IuXG5cdCpcblx0KiBAcGFyYW0gbWF0Y2hQYXR0ZXJuIFRoZSBtYXRjaCBwYXR0ZXJuIHRvIHBhcnNlLlxuXHQqL1xuXHRjb25zdHJ1Y3RvcihtYXRjaFBhdHRlcm4pIHtcblx0XHRpZiAobWF0Y2hQYXR0ZXJuID09PSBcIjxhbGxfdXJscz5cIikge1xuXHRcdFx0dGhpcy5pc0FsbFVybHMgPSB0cnVlO1xuXHRcdFx0dGhpcy5wcm90b2NvbE1hdGNoZXMgPSBbLi4uTWF0Y2hQYXR0ZXJuLlBST1RPQ09MU107XG5cdFx0XHR0aGlzLmhvc3RuYW1lTWF0Y2ggPSBcIipcIjtcblx0XHRcdHRoaXMucGF0aG5hbWVNYXRjaCA9IFwiKlwiO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjb25zdCBncm91cHMgPSAvKC4qKTpcXC9cXC8oLio/KShcXC8uKikvLmV4ZWMobWF0Y2hQYXR0ZXJuKTtcblx0XHRcdGlmIChncm91cHMgPT0gbnVsbCkgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4obWF0Y2hQYXR0ZXJuLCBcIkluY29ycmVjdCBmb3JtYXRcIik7XG5cdFx0XHRjb25zdCBbXywgcHJvdG9jb2wsIGhvc3RuYW1lLCBwYXRobmFtZV0gPSBncm91cHM7XG5cdFx0XHR2YWxpZGF0ZVByb3RvY29sKG1hdGNoUGF0dGVybiwgcHJvdG9jb2wpO1xuXHRcdFx0dmFsaWRhdGVIb3N0bmFtZShtYXRjaFBhdHRlcm4sIGhvc3RuYW1lKTtcblx0XHRcdHRoaXMucHJvdG9jb2xNYXRjaGVzID0gcHJvdG9jb2wgPT09IFwiKlwiID8gW1wiaHR0cFwiLCBcImh0dHBzXCJdIDogW3Byb3RvY29sXTtcblx0XHRcdHRoaXMuaG9zdG5hbWVNYXRjaCA9IGhvc3RuYW1lO1xuXHRcdFx0dGhpcy5wYXRobmFtZU1hdGNoID0gcGF0aG5hbWU7XG5cdFx0fVxuXHR9XG5cdC8qKiBDaGVjayBpZiBhIFVSTCBpcyBpbmNsdWRlZCBpbiBhIHBhdHRlcm4uICovXG5cdGluY2x1ZGVzKHVybCkge1xuXHRcdGNvbnN0IHUgPSB0eXBlb2YgdXJsID09PSBcInN0cmluZ1wiID8gbmV3IFVSTCh1cmwpIDogdXJsIGluc3RhbmNlb2YgTG9jYXRpb24gPyBuZXcgVVJMKHVybC5ocmVmKSA6IHVybDtcblx0XHRpZiAodGhpcy5pc0FsbFVybHMpIHJldHVybiAhdGhpcy5pc1Vua25vd25Qcm90b2NvbCh1KTtcblx0XHRyZXR1cm4gISF0aGlzLnByb3RvY29sTWF0Y2hlcy5maW5kKChwcm90b2NvbCkgPT4ge1xuXHRcdFx0aWYgKHByb3RvY29sID09PSBcImh0dHBcIikgcmV0dXJuIHRoaXMuaXNIdHRwTWF0Y2godSk7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiaHR0cHNcIikgcmV0dXJuIHRoaXMuaXNIdHRwc01hdGNoKHUpO1xuXHRcdFx0aWYgKHByb3RvY29sID09PSBcImZpbGVcIikgcmV0dXJuIHRoaXMuaXNGaWxlTWF0Y2godSk7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwiZnRwXCIpIHJldHVybiB0aGlzLmlzRnRwTWF0Y2godSk7XG5cdFx0XHRpZiAocHJvdG9jb2wgPT09IFwidXJuXCIpIHJldHVybiB0aGlzLmlzVXJuTWF0Y2godSk7XG5cdFx0fSk7XG5cdH1cblx0aXNIdHRwTWF0Y2godXJsKSB7XG5cdFx0cmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJodHRwOlwiICYmIHRoaXMuaXNIb3N0UGF0aE1hdGNoKHVybCk7XG5cdH1cblx0aXNIdHRwc01hdGNoKHVybCkge1xuXHRcdHJldHVybiB1cmwucHJvdG9jb2wgPT09IFwiaHR0cHM6XCIgJiYgdGhpcy5pc0hvc3RQYXRoTWF0Y2godXJsKTtcblx0fVxuXHRpc0hvc3RQYXRoTWF0Y2godXJsKSB7XG5cdFx0aWYgKCF0aGlzLmhvc3RuYW1lTWF0Y2ggfHwgIXRoaXMucGF0aG5hbWVNYXRjaCkgcmV0dXJuIGZhbHNlO1xuXHRcdGNvbnN0IGhvc3RuYW1lTWF0Y2hSZWdleHMgPSBbdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5ob3N0bmFtZU1hdGNoKSwgdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5ob3N0bmFtZU1hdGNoLnJlcGxhY2UoL15cXCpcXC4vLCBcIlwiKSldO1xuXHRcdGNvbnN0IHBhdGhuYW1lTWF0Y2hSZWdleCA9IHRoaXMuY29udmVydFBhdHRlcm5Ub1JlZ2V4KHRoaXMucGF0aG5hbWVNYXRjaCk7XG5cdFx0cmV0dXJuICEhaG9zdG5hbWVNYXRjaFJlZ2V4cy5maW5kKChyZWdleCkgPT4gcmVnZXgudGVzdCh1cmwuaG9zdG5hbWUpKSAmJiBwYXRobmFtZU1hdGNoUmVnZXgudGVzdCh1cmwucGF0aG5hbWUpO1xuXHR9XG5cdGlzVW5rbm93blByb3RvY29sKHVybCkge1xuXHRcdHJldHVybiAhdGhpcy5wcm90b2NvbE1hdGNoZXMuaW5jbHVkZXModXJsLnByb3RvY29sLnNsaWNlKDAsIC0xKSk7XG5cdH1cblx0aXNQYXRoTWF0Y2godXJsKSB7XG5cdFx0aWYgKCF0aGlzLnBhdGhuYW1lTWF0Y2gpIHJldHVybiBmYWxzZTtcblx0XHRyZXR1cm4gdGhpcy5jb252ZXJ0UGF0dGVyblRvUmVnZXgodGhpcy5wYXRobmFtZU1hdGNoKS50ZXN0KHVybC5wYXRobmFtZSk7XG5cdH1cblx0aXNGaWxlTWF0Y2godXJsKSB7XG5cdFx0cmV0dXJuIHVybC5wcm90b2NvbCA9PT0gXCJmaWxlOlwiICYmIHRoaXMuaXNQYXRoTWF0Y2godXJsKTtcblx0fVxuXHRpc0Z0cE1hdGNoKF91cmwpIHtcblx0XHR0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogZnRwOi8vIHBhdHRlcm4gbWF0Y2hpbmcuIE9wZW4gYSBQUiB0byBhZGQgc3VwcG9ydFwiKTtcblx0fVxuXHRpc1Vybk1hdGNoKF91cmwpIHtcblx0XHR0aHJvdyBFcnJvcihcIk5vdCBpbXBsZW1lbnRlZDogdXJuOi8vIHBhdHRlcm4gbWF0Y2hpbmcuIE9wZW4gYSBQUiB0byBhZGQgc3VwcG9ydFwiKTtcblx0fVxuXHRjb252ZXJ0UGF0dGVyblRvUmVnZXgocGF0dGVybikge1xuXHRcdGNvbnN0IHN0YXJzUmVwbGFjZWQgPSB0aGlzLmVzY2FwZUZvclJlZ2V4KHBhdHRlcm4pLnJlcGxhY2UoL1xcXFxcXCovZywgXCIuKlwiKTtcblx0XHRyZXR1cm4gUmVnRXhwKGBeJHtzdGFyc1JlcGxhY2VkfSRgKTtcblx0fVxuXHRlc2NhcGVGb3JSZWdleChzdHJpbmcpIHtcblx0XHRyZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1suKis/XiR7fSgpfFtcXF1cXFxcXS9nLCBcIlxcXFwkJlwiKTtcblx0fVxufTtcbnZhciBJbnZhbGlkTWF0Y2hQYXR0ZXJuID0gY2xhc3MgZXh0ZW5kcyBFcnJvciB7XG5cdGNvbnN0cnVjdG9yKG1hdGNoUGF0dGVybiwgcmVhc29uKSB7XG5cdFx0c3VwZXIoYEludmFsaWQgbWF0Y2ggcGF0dGVybiBcIiR7bWF0Y2hQYXR0ZXJufVwiOiAke3JlYXNvbn1gKTtcblx0fVxufTtcbmZ1bmN0aW9uIHZhbGlkYXRlUHJvdG9jb2wobWF0Y2hQYXR0ZXJuLCBwcm90b2NvbCkge1xuXHRpZiAoIU1hdGNoUGF0dGVybi5QUk9UT0NPTFMuaW5jbHVkZXMocHJvdG9jb2wpICYmIHByb3RvY29sICE9PSBcIipcIikgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4obWF0Y2hQYXR0ZXJuLCBgJHtwcm90b2NvbH0gbm90IGEgdmFsaWQgcHJvdG9jb2wgKCR7TWF0Y2hQYXR0ZXJuLlBST1RPQ09MUy5qb2luKFwiLCBcIil9KWApO1xufVxuZnVuY3Rpb24gdmFsaWRhdGVIb3N0bmFtZShtYXRjaFBhdHRlcm4sIGhvc3RuYW1lKSB7XG5cdGlmIChob3N0bmFtZS5pbmNsdWRlcyhcIjpcIikpIHRocm93IG5ldyBJbnZhbGlkTWF0Y2hQYXR0ZXJuKG1hdGNoUGF0dGVybiwgYEhvc3RuYW1lIGNhbm5vdCBpbmNsdWRlIGEgcG9ydGApO1xuXHRpZiAoaG9zdG5hbWUuaW5jbHVkZXMoXCIqXCIpICYmIGhvc3RuYW1lLmxlbmd0aCA+IDEgJiYgIWhvc3RuYW1lLnN0YXJ0c1dpdGgoXCIqLlwiKSkgdGhyb3cgbmV3IEludmFsaWRNYXRjaFBhdHRlcm4obWF0Y2hQYXR0ZXJuLCBgSWYgdXNpbmcgYSB3aWxkY2FyZCAoKiksIGl0IG11c3QgZ28gYXQgdGhlIHN0YXJ0IG9mIHRoZSBob3N0bmFtZWApO1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBJbnZhbGlkTWF0Y2hQYXR0ZXJuLCBNYXRjaFBhdHRlcm4gfTtcbiJdLCJ4X2dvb2dsZV9pZ25vcmVMaXN0IjpbMCwxLDIsMyw0LDUsNiwxMF0sIm1hcHBpbmdzIjoiOzs7OztDQUNBLFNBQVMsaUJBQWlCLEtBQUs7RUFDOUIsSUFBSSxPQUFPLFFBQVEs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