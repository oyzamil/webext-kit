(function() {
	//#region \0rolldown/runtime.js
	var __commonJSMin = (cb, mod) => () => (mod || (cb((mod = { exports: {} }).exports, mod), cb = null), mod.exports);
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/utils/define-content-script.mjs
	function defineContentScript(definition) {
		return definition;
	}
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
	var browser$2 = globals.browser ?? globals.chrome ?? {};
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
				const storage = browser$2.storage;
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
			if (browser$2.runtime == null) throw Error(`'webext-store' must be loaded in a web extension environment.`);
			if (browser$2.storage == null) throw Error("You must add the 'storage' permission to your manifest to use 'webext-store'");
			const area = browser$2.storage[storageArea];
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
	storage.defineItem("sync:settings", {
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
	storage.defineItem("local:installId", { init: () => crypto.randomUUID() });
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
	//#region src/entrypoints/content.ts
	var content_default = defineContentScript({
		matches: ["*://*/*"],
		runAt: "document_idle",
		main() {
			const badge = document.createElement("div");
			badge.setAttribute("style", [
				"position:fixed",
				"bottom:12px",
				"right:12px",
				"z-index:2147483647",
				"padding:6px 10px",
				"border-radius:8px",
				"background:#1e293b",
				"color:#6ee7b7",
				"font:600 11px/1.4 monospace",
				"box-shadow:0 2px 8px rgba(0,0,0,.25)",
				"pointer-events:none",
				"opacity:0.85"
			].join(";"));
			badge.textContent = "webext-store heartbeat: …";
			document.documentElement.appendChild(badge);
			const render = (n) => {
				badge.textContent = `webext-store heartbeat: ${n}`;
			};
			heartbeatItem.getValue().then(render);
			const unwatch = heartbeatItem.watch((newValue) => render(newValue));
			window.addEventListener("pagehide", unwatch, { once: true });
		}
	});
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/utils/internal/logger.mjs
	function print$1(method, ...args) {
		if (typeof args[0] === "string") method(`[wxt] ${args.shift()}`, ...args);
		else method("[wxt]", ...args);
	}
	/** Wrapper around `console` with a "[wxt]" prefix */
	var logger$1 = {
		debug: (...args) => print$1(console.debug, ...args),
		log: (...args) => print$1(console.log, ...args),
		warn: (...args) => print$1(console.warn, ...args),
		error: (...args) => print$1(console.error, ...args)
	};
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
	var browser = globalThis.browser?.runtime?.id ? globalThis.browser : globalThis.chrome;
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/utils/internal/custom-events.mjs
	var WxtLocationChangeEvent = class WxtLocationChangeEvent extends Event {
		static EVENT_NAME = getUniqueEventName("wxt:locationchange");
		constructor(newUrl, oldUrl) {
			super(WxtLocationChangeEvent.EVENT_NAME, {});
			this.newUrl = newUrl;
			this.oldUrl = oldUrl;
		}
	};
	/**
	* Returns an event name unique to the extension and content script that's
	* running.
	*/
	function getUniqueEventName(eventName) {
		return `${browser?.runtime?.id}:content:${eventName}`;
	}
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/utils/internal/location-watcher.mjs
	var supportsNavigationApi = typeof globalThis.navigation?.addEventListener === "function";
	/**
	* Create a util that watches for URL changes, dispatching the custom event when
	* detected. Stops watching when content script is invalidated. Uses Navigation
	* API when available, otherwise falls back to polling.
	*/
	function createLocationWatcher(ctx) {
		let lastUrl;
		let watching = false;
		return { run() {
			if (watching) return;
			watching = true;
			lastUrl = new URL(location.href);
			if (supportsNavigationApi) globalThis.navigation.addEventListener("navigate", (event) => {
				const newUrl = new URL(event.destination.url);
				if (newUrl.href === lastUrl.href) return;
				window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
				lastUrl = newUrl;
			}, { signal: ctx.signal });
			else ctx.setInterval(() => {
				const newUrl = new URL(location.href);
				if (newUrl.href !== lastUrl.href) {
					window.dispatchEvent(new WxtLocationChangeEvent(newUrl, lastUrl));
					lastUrl = newUrl;
				}
			}, 1e3);
		} };
	}
	//#endregion
	//#region ../../node_modules/.bun/wxt@0.21.4+007dfbc42f5a4276/node_modules/wxt/dist/utils/content-script-context.mjs
	/**
	* Implements
	* [`AbortController`](https://developer.mozilla.org/en-US/docs/Web/API/AbortController).
	* Used to detect and stop content script code when the script is invalidated.
	*
	* It also provides several utilities like `ctx.setTimeout` and
	* `ctx.setInterval` that should be used in content scripts instead of
	* `window.setTimeout` or `window.setInterval`.
	*
	* To create context for testing, you can use the class's constructor:
	*
	* ```ts
	* import { ContentScriptContext } from 'wxt/utils/content-scripts-context';
	*
	* test('storage listener should be removed when context is invalidated', () => {
	*   const ctx = new ContentScriptContext('test');
	*   const item = storage.defineItem('local:count', { defaultValue: 0 });
	*   const watcher = vi.fn();
	*
	*   const unwatch = item.watch(watcher);
	*   ctx.onInvalidated(unwatch); // Listen for invalidate here
	*
	*   await item.setValue(1);
	*   expect(watcher).toBeCalledTimes(1);
	*   expect(watcher).toBeCalledWith(1, 0);
	*
	*   ctx.notifyInvalidated(); // Use this function to invalidate the context
	*   await item.setValue(2);
	*   expect(watcher).toBeCalledTimes(1);
	* });
	* ```
	*/
	var ContentScriptContext = class ContentScriptContext {
		static SCRIPT_STARTED_MESSAGE_TYPE = getUniqueEventName("wxt:content-script-started");
		id;
		abortController;
		locationWatcher = createLocationWatcher(this);
		constructor(contentScriptName, options) {
			this.contentScriptName = contentScriptName;
			this.options = options;
			this.id = Math.random().toString(36).slice(2);
			this.abortController = new AbortController();
			this.stopOldScripts();
			this.listenForNewerScripts();
		}
		get signal() {
			return this.abortController.signal;
		}
		abort(reason) {
			return this.abortController.abort(reason);
		}
		get isInvalid() {
			if (browser.runtime?.id == null) this.notifyInvalidated();
			return this.signal.aborted;
		}
		get isValid() {
			return !this.isInvalid;
		}
		/**
		* Add a listener that is called when the content script's context is
		* invalidated.
		*
		* @example
		*   browser.runtime.onMessage.addListener(cb);
		*   const removeInvalidatedListener = ctx.onInvalidated(() => {
		*     browser.runtime.onMessage.removeListener(cb);
		*   });
		*   // ...
		*   removeInvalidatedListener();
		*
		* @returns A function to remove the listener.
		*/
		onInvalidated(cb) {
			this.signal.addEventListener("abort", cb);
			return () => this.signal.removeEventListener("abort", cb);
		}
		/**
		* Return a promise that never resolves. Useful if you have an async function
		* that shouldn't run after the context is expired.
		*
		* @example
		*   const getValueFromStorage = async () => {
		*     if (ctx.isInvalid) return ctx.block();
		*
		*     // ...
		*   };
		*/
		block() {
			return new Promise(() => {});
		}
		/**
		* Wrapper around `window.setInterval` that automatically clears the interval
		* when invalidated.
		*
		* Intervals can be cleared by calling the normal `clearInterval` function.
		*/
		setInterval(handler, timeout) {
			const id = setInterval(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearInterval(id));
			return id;
		}
		/**
		* Wrapper around `window.setTimeout` that automatically clears the interval
		* when invalidated.
		*
		* Timeouts can be cleared by calling the normal `setTimeout` function.
		*/
		setTimeout(handler, timeout) {
			const id = setTimeout(() => {
				if (this.isValid) handler();
			}, timeout);
			this.onInvalidated(() => clearTimeout(id));
			return id;
		}
		/**
		* Wrapper around `window.requestAnimationFrame` that automatically cancels
		* the request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelAnimationFrame`
		* function.
		*/
		requestAnimationFrame(callback) {
			const id = requestAnimationFrame((...args) => {
				if (this.isValid) callback(...args);
			});
			this.onInvalidated(() => cancelAnimationFrame(id));
			return id;
		}
		/**
		* Wrapper around `window.requestIdleCallback` that automatically cancels the
		* request when invalidated.
		*
		* Callbacks can be canceled by calling the normal `cancelIdleCallback`
		* function.
		*/
		requestIdleCallback(callback, options) {
			const id = requestIdleCallback((...args) => {
				if (!this.signal.aborted) callback(...args);
			}, options);
			this.onInvalidated(() => cancelIdleCallback(id));
			return id;
		}
		addEventListener(target, type, handler, options) {
			if (type === "wxt:locationchange") {
				if (this.isValid) this.locationWatcher.run();
			}
			target.addEventListener?.(type.startsWith("wxt:") ? getUniqueEventName(type) : type, handler, {
				...options,
				signal: this.signal
			});
		}
		/**
		* @internal
		* Abort the abort controller and execute all `onInvalidated` listeners.
		*/
		notifyInvalidated() {
			this.abort("Content script context invalidated");
			logger$1.debug(`Content script "${this.contentScriptName}" context invalidated`);
		}
		stopOldScripts() {
			document.dispatchEvent(new CustomEvent(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, { detail: {
				contentScriptName: this.contentScriptName,
				messageId: this.id
			} }));
			if (!this.options?.noScriptStartedPostMessage) window.postMessage({
				type: ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE,
				contentScriptName: this.contentScriptName,
				messageId: this.id
			}, "*");
		}
		verifyScriptStartedEvent(event) {
			const isSameContentScript = event.detail?.contentScriptName === this.contentScriptName;
			const isFromSelf = event.detail?.messageId === this.id;
			return isSameContentScript && !isFromSelf;
		}
		listenForNewerScripts() {
			const cb = (event) => {
				if (!(event instanceof CustomEvent) || !this.verifyScriptStartedEvent(event)) return;
				this.notifyInvalidated();
			};
			document.addEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb);
			this.onInvalidated(() => document.removeEventListener(ContentScriptContext.SCRIPT_STARTED_MESSAGE_TYPE, cb));
		}
	};
	//#endregion
	//#region \0virtual:wxt-content-script-isolated-world-entrypoint?D:/Projects/webext-kit/examples/webext-store/src/entrypoints/content.ts
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
	//#endregion
	return (async () => {
		try {
			const { main, ...options } = content_default;
			return await main(new ContentScriptContext("content", options));
		} catch (err) {
			logger.error(`The content script "content" crashed on startup!`, err);
			throw err;
		}
	})();
})();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudC5qcyIsIm5hbWVzIjpbImJyb3dzZXIiLCJ3aXRoTG9jayIsInByaW50IiwibG9nZ2VyIiwiYnJvd3NlciJdLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrMDA3ZGZiYzQyZjVhNDI3Ni9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvZGVmaW5lLWNvbnRlbnQtc2NyaXB0Lm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3JlYWN0QDE5LjIuOC9ub2RlX21vZHVsZXMvcmVhY3QvY2pzL3JlYWN0LmRldmVsb3BtZW50LmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vcmVhY3RAMTkuMi44L25vZGVfbW9kdWxlcy9yZWFjdC9pbmRleC5qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3N1cGVybG9ja0AxLjMuNS9ub2RlX21vZHVsZXMvc3VwZXJsb2NrL3NyYy9jcmVhdGUuanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi9zdXBlcmxvY2tAMS4zLjUvbm9kZV9tb2R1bGVzL3N1cGVybG9jay9zcmMvaW5kZXguanMiLCIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy93ZWJleHQtc3RvcmUvZGlzdC9ob29rMi5tanMiLCIuLi8uLi8uLi9zcmMvdXRpbHMvc3RvcmFnZS1pdGVtcy50cyIsIi4uLy4uLy4uL3NyYy9lbnRyeXBvaW50cy9jb250ZW50LnRzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vd3h0QDAuMjEuNCswMDdkZmJjNDJmNWE0Mjc2L25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9pbnRlcm5hbC9sb2dnZXIubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vQHd4dC1kZXYrYnJvd3NlckAwLjIuNy9ub2RlX21vZHVsZXMvQHd4dC1kZXYvYnJvd3Nlci9zcmMvaW5kZXgubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vd3h0QDAuMjEuNCswMDdkZmJjNDJmNWE0Mjc2L25vZGVfbW9kdWxlcy93eHQvZGlzdC9icm93c2VyLm1qcyIsIi4uLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy8uYnVuL3d4dEAwLjIxLjQrMDA3ZGZiYzQyZjVhNDI3Ni9ub2RlX21vZHVsZXMvd3h0L2Rpc3QvdXRpbHMvaW50ZXJuYWwvY3VzdG9tLWV2ZW50cy5tanMiLCIuLi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvLmJ1bi93eHRAMC4yMS40KzAwN2RmYmM0MmY1YTQyNzYvbm9kZV9tb2R1bGVzL3d4dC9kaXN0L3V0aWxzL2ludGVybmFsL2xvY2F0aW9uLXdhdGNoZXIubWpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vd3h0QDAuMjEuNCswMDdkZmJjNDJmNWE0Mjc2L25vZGVfbW9kdWxlcy93eHQvZGlzdC91dGlscy9jb250ZW50LXNjcmlwdC1jb250ZXh0Lm1qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyNyZWdpb24gc3JjL3V0aWxzL2RlZmluZS1jb250ZW50LXNjcmlwdC50c1xuZnVuY3Rpb24gZGVmaW5lQ29udGVudFNjcmlwdChkZWZpbml0aW9uKSB7XG5cdHJldHVybiBkZWZpbml0aW9uO1xufVxuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBkZWZpbmVDb250ZW50U2NyaXB0IH07XG4iLCIvKipcbiAqIEBsaWNlbnNlIFJlYWN0XG4gKiByZWFjdC5kZXZlbG9wbWVudC5qc1xuICpcbiAqIENvcHlyaWdodCAoYykgTWV0YSBQbGF0Zm9ybXMsIEluYy4gYW5kIGFmZmlsaWF0ZXMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuXCJ1c2Ugc3RyaWN0XCI7XG5cInByb2R1Y3Rpb25cIiAhPT0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgJiZcbiAgKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBkZWZpbmVEZXByZWNhdGlvbldhcm5pbmcobWV0aG9kTmFtZSwgaW5mbykge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbXBvbmVudC5wcm90b3R5cGUsIG1ldGhvZE5hbWUsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgICAgXCIlcyguLi4pIGlzIGRlcHJlY2F0ZWQgaW4gcGxhaW4gSmF2YVNjcmlwdCBSZWFjdCBjbGFzc2VzLiAlc1wiLFxuICAgICAgICAgICAgaW5mb1swXSxcbiAgICAgICAgICAgIGluZm9bMV1cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gICAgICBpZiAobnVsbCA9PT0gbWF5YmVJdGVyYWJsZSB8fCBcIm9iamVjdFwiICE9PSB0eXBlb2YgbWF5YmVJdGVyYWJsZSlcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICBtYXliZUl0ZXJhYmxlID1cbiAgICAgICAgKE1BWUJFX0lURVJBVE9SX1NZTUJPTCAmJiBtYXliZUl0ZXJhYmxlW01BWUJFX0lURVJBVE9SX1NZTUJPTF0pIHx8XG4gICAgICAgIG1heWJlSXRlcmFibGVbXCJAQGl0ZXJhdG9yXCJdO1xuICAgICAgcmV0dXJuIFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIG1heWJlSXRlcmFibGUgPyBtYXliZUl0ZXJhYmxlIDogbnVsbDtcbiAgICB9XG4gICAgZnVuY3Rpb24gd2Fybk5vb3AocHVibGljSW5zdGFuY2UsIGNhbGxlck5hbWUpIHtcbiAgICAgIHB1YmxpY0luc3RhbmNlID1cbiAgICAgICAgKChwdWJsaWNJbnN0YW5jZSA9IHB1YmxpY0luc3RhbmNlLmNvbnN0cnVjdG9yKSAmJlxuICAgICAgICAgIChwdWJsaWNJbnN0YW5jZS5kaXNwbGF5TmFtZSB8fCBwdWJsaWNJbnN0YW5jZS5uYW1lKSkgfHxcbiAgICAgICAgXCJSZWFjdENsYXNzXCI7XG4gICAgICB2YXIgd2FybmluZ0tleSA9IHB1YmxpY0luc3RhbmNlICsgXCIuXCIgKyBjYWxsZXJOYW1lO1xuICAgICAgZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50W3dhcm5pbmdLZXldIHx8XG4gICAgICAgIChjb25zb2xlLmVycm9yKFxuICAgICAgICAgIFwiQ2FuJ3QgY2FsbCAlcyBvbiBhIGNvbXBvbmVudCB0aGF0IGlzIG5vdCB5ZXQgbW91bnRlZC4gVGhpcyBpcyBhIG5vLW9wLCBidXQgaXQgbWlnaHQgaW5kaWNhdGUgYSBidWcgaW4geW91ciBhcHBsaWNhdGlvbi4gSW5zdGVhZCwgYXNzaWduIHRvIGB0aGlzLnN0YXRlYCBkaXJlY3RseSBvciBkZWZpbmUgYSBgc3RhdGUgPSB7fTtgIGNsYXNzIHByb3BlcnR5IHdpdGggdGhlIGRlc2lyZWQgc3RhdGUgaW4gdGhlICVzIGNvbXBvbmVudC5cIixcbiAgICAgICAgICBjYWxsZXJOYW1lLFxuICAgICAgICAgIHB1YmxpY0luc3RhbmNlXG4gICAgICAgICksXG4gICAgICAgIChkaWRXYXJuU3RhdGVVcGRhdGVGb3JVbm1vdW50ZWRDb21wb25lbnRbd2FybmluZ0tleV0gPSAhMCkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgICAgIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICB0aGlzLnJlZnMgPSBlbXB0eU9iamVjdDtcbiAgICAgIHRoaXMudXBkYXRlciA9IHVwZGF0ZXIgfHwgUmVhY3ROb29wVXBkYXRlUXVldWU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIENvbXBvbmVudER1bW15KCkge31cbiAgICBmdW5jdGlvbiBQdXJlQ29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gICAgICB0aGlzLnVwZGF0ZXIgPSB1cGRhdGVyIHx8IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBub29wKCkge31cbiAgICBmdW5jdGlvbiB0ZXN0U3RyaW5nQ29lcmNpb24odmFsdWUpIHtcbiAgICAgIHJldHVybiBcIlwiICsgdmFsdWU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNoZWNrS2V5U3RyaW5nQ29lcmNpb24odmFsdWUpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRlc3RTdHJpbmdDb2VyY2lvbih2YWx1ZSk7XG4gICAgICAgIHZhciBKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQgPSAhMTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0ID0gITA7XG4gICAgICB9XG4gICAgICBpZiAoSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0KSB7XG4gICAgICAgIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdCA9IGNvbnNvbGU7XG4gICAgICAgIHZhciBKU0NvbXBpbGVyX3RlbXBfY29uc3QgPSBKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQuZXJyb3I7XG4gICAgICAgIHZhciBKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQkanNjb21wJDAgPVxuICAgICAgICAgIChcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBTeW1ib2wgJiZcbiAgICAgICAgICAgIFN5bWJvbC50b1N0cmluZ1RhZyAmJlxuICAgICAgICAgICAgdmFsdWVbU3ltYm9sLnRvU3RyaW5nVGFnXSkgfHxcbiAgICAgICAgICB2YWx1ZS5jb25zdHJ1Y3Rvci5uYW1lIHx8XG4gICAgICAgICAgXCJPYmplY3RcIjtcbiAgICAgICAgSlNDb21waWxlcl90ZW1wX2NvbnN0LmNhbGwoXG4gICAgICAgICAgSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0LFxuICAgICAgICAgIFwiVGhlIHByb3ZpZGVkIGtleSBpcyBhbiB1bnN1cHBvcnRlZCB0eXBlICVzLiBUaGlzIHZhbHVlIG11c3QgYmUgY29lcmNlZCB0byBhIHN0cmluZyBiZWZvcmUgdXNpbmcgaXQgaGVyZS5cIixcbiAgICAgICAgICBKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQkanNjb21wJDBcbiAgICAgICAgKTtcbiAgICAgICAgcmV0dXJuIHRlc3RTdHJpbmdDb2VyY2lvbih2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlKSB7XG4gICAgICBpZiAobnVsbCA9PSB0eXBlKSByZXR1cm4gbnVsbDtcbiAgICAgIGlmIChcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiB0eXBlKVxuICAgICAgICByZXR1cm4gdHlwZS4kJHR5cGVvZiA9PT0gUkVBQ1RfQ0xJRU5UX1JFRkVSRU5DRVxuICAgICAgICAgID8gbnVsbFxuICAgICAgICAgIDogdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgbnVsbDtcbiAgICAgIGlmIChcInN0cmluZ1wiID09PSB0eXBlb2YgdHlwZSkgcmV0dXJuIHR5cGU7XG4gICAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgICAgY2FzZSBSRUFDVF9GUkFHTUVOVF9UWVBFOlxuICAgICAgICAgIHJldHVybiBcIkZyYWdtZW50XCI7XG4gICAgICAgIGNhc2UgUkVBQ1RfUFJPRklMRVJfVFlQRTpcbiAgICAgICAgICByZXR1cm4gXCJQcm9maWxlclwiO1xuICAgICAgICBjYXNlIFJFQUNUX1NUUklDVF9NT0RFX1RZUEU6XG4gICAgICAgICAgcmV0dXJuIFwiU3RyaWN0TW9kZVwiO1xuICAgICAgICBjYXNlIFJFQUNUX1NVU1BFTlNFX1RZUEU6XG4gICAgICAgICAgcmV0dXJuIFwiU3VzcGVuc2VcIjtcbiAgICAgICAgY2FzZSBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEU6XG4gICAgICAgICAgcmV0dXJuIFwiU3VzcGVuc2VMaXN0XCI7XG4gICAgICAgIGNhc2UgUkVBQ1RfQUNUSVZJVFlfVFlQRTpcbiAgICAgICAgICByZXR1cm4gXCJBY3Rpdml0eVwiO1xuICAgICAgfVxuICAgICAgaWYgKFwib2JqZWN0XCIgPT09IHR5cGVvZiB0eXBlKVxuICAgICAgICBzd2l0Y2ggKFxuICAgICAgICAgIChcIm51bWJlclwiID09PSB0eXBlb2YgdHlwZS50YWcgJiZcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgIFwiUmVjZWl2ZWQgYW4gdW5leHBlY3RlZCBvYmplY3QgaW4gZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKCkuIFRoaXMgaXMgbGlrZWx5IGEgYnVnIGluIFJlYWN0LiBQbGVhc2UgZmlsZSBhbiBpc3N1ZS5cIlxuICAgICAgICAgICAgKSxcbiAgICAgICAgICB0eXBlLiQkdHlwZW9mKVxuICAgICAgICApIHtcbiAgICAgICAgICBjYXNlIFJFQUNUX1BPUlRBTF9UWVBFOlxuICAgICAgICAgICAgcmV0dXJuIFwiUG9ydGFsXCI7XG4gICAgICAgICAgY2FzZSBSRUFDVF9DT05URVhUX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gdHlwZS5kaXNwbGF5TmFtZSB8fCBcIkNvbnRleHRcIjtcbiAgICAgICAgICBjYXNlIFJFQUNUX0NPTlNVTUVSX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gKHR5cGUuX2NvbnRleHQuZGlzcGxheU5hbWUgfHwgXCJDb250ZXh0XCIpICsgXCIuQ29uc3VtZXJcIjtcbiAgICAgICAgICBjYXNlIFJFQUNUX0ZPUldBUkRfUkVGX1RZUEU6XG4gICAgICAgICAgICB2YXIgaW5uZXJUeXBlID0gdHlwZS5yZW5kZXI7XG4gICAgICAgICAgICB0eXBlID0gdHlwZS5kaXNwbGF5TmFtZTtcbiAgICAgICAgICAgIHR5cGUgfHxcbiAgICAgICAgICAgICAgKCh0eXBlID0gaW5uZXJUeXBlLmRpc3BsYXlOYW1lIHx8IGlubmVyVHlwZS5uYW1lIHx8IFwiXCIpLFxuICAgICAgICAgICAgICAodHlwZSA9IFwiXCIgIT09IHR5cGUgPyBcIkZvcndhcmRSZWYoXCIgKyB0eXBlICsgXCIpXCIgOiBcIkZvcndhcmRSZWZcIikpO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICAgICAgY2FzZSBSRUFDVF9NRU1PX1RZUEU6XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICAoaW5uZXJUeXBlID0gdHlwZS5kaXNwbGF5TmFtZSB8fCBudWxsKSxcbiAgICAgICAgICAgICAgbnVsbCAhPT0gaW5uZXJUeXBlXG4gICAgICAgICAgICAgICAgPyBpbm5lclR5cGVcbiAgICAgICAgICAgICAgICA6IGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlLnR5cGUpIHx8IFwiTWVtb1wiXG4gICAgICAgICAgICApO1xuICAgICAgICAgIGNhc2UgUkVBQ1RfTEFaWV9UWVBFOlxuICAgICAgICAgICAgaW5uZXJUeXBlID0gdHlwZS5fcGF5bG9hZDtcbiAgICAgICAgICAgIHR5cGUgPSB0eXBlLl9pbml0O1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgcmV0dXJuIGdldENvbXBvbmVudE5hbWVGcm9tVHlwZSh0eXBlKGlubmVyVHlwZSkpO1xuICAgICAgICAgICAgfSBjYXRjaCAoeCkge31cbiAgICAgICAgfVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldFRhc2tOYW1lKHR5cGUpIHtcbiAgICAgIGlmICh0eXBlID09PSBSRUFDVF9GUkFHTUVOVF9UWVBFKSByZXR1cm4gXCI8PlwiO1xuICAgICAgaWYgKFxuICAgICAgICBcIm9iamVjdFwiID09PSB0eXBlb2YgdHlwZSAmJlxuICAgICAgICBudWxsICE9PSB0eXBlICYmXG4gICAgICAgIHR5cGUuJCR0eXBlb2YgPT09IFJFQUNUX0xBWllfVFlQRVxuICAgICAgKVxuICAgICAgICByZXR1cm4gXCI8Li4uPlwiO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIG5hbWUgPSBnZXRDb21wb25lbnROYW1lRnJvbVR5cGUodHlwZSk7XG4gICAgICAgIHJldHVybiBuYW1lID8gXCI8XCIgKyBuYW1lICsgXCI+XCIgOiBcIjwuLi4+XCI7XG4gICAgICB9IGNhdGNoICh4KSB7XG4gICAgICAgIHJldHVybiBcIjwuLi4+XCI7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldE93bmVyKCkge1xuICAgICAgdmFyIGRpc3BhdGNoZXIgPSBSZWFjdFNoYXJlZEludGVybmFscy5BO1xuICAgICAgcmV0dXJuIG51bGwgPT09IGRpc3BhdGNoZXIgPyBudWxsIDogZGlzcGF0Y2hlci5nZXRPd25lcigpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBVbmtub3duT3duZXIoKSB7XG4gICAgICByZXR1cm4gRXJyb3IoXCJyZWFjdC1zdGFjay10b3AtZnJhbWVcIik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGhhc1ZhbGlkS2V5KGNvbmZpZykge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBcImtleVwiKSkge1xuICAgICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsIFwia2V5XCIpLmdldDtcbiAgICAgICAgaWYgKGdldHRlciAmJiBnZXR0ZXIuaXNSZWFjdFdhcm5pbmcpIHJldHVybiAhMTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2b2lkIDAgIT09IGNvbmZpZy5rZXk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSkge1xuICAgICAgZnVuY3Rpb24gd2FybkFib3V0QWNjZXNzaW5nS2V5KCkge1xuICAgICAgICBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biB8fFxuICAgICAgICAgICgoc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24gPSAhMCksXG4gICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgIFwiJXM6IGBrZXlgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgaW4gYHVuZGVmaW5lZGAgYmVpbmcgcmV0dXJuZWQuIElmIHlvdSBuZWVkIHRvIGFjY2VzcyB0aGUgc2FtZSB2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50IHByb3AuIChodHRwczovL3JlYWN0LmRldi9saW5rL3NwZWNpYWwtcHJvcHMpXCIsXG4gICAgICAgICAgICBkaXNwbGF5TmFtZVxuICAgICAgICAgICkpO1xuICAgICAgfVxuICAgICAgd2FybkFib3V0QWNjZXNzaW5nS2V5LmlzUmVhY3RXYXJuaW5nID0gITA7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsIFwia2V5XCIsIHtcbiAgICAgICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdLZXksXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogITBcbiAgICAgIH0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBlbGVtZW50UmVmR2V0dGVyV2l0aERlcHJlY2F0aW9uV2FybmluZygpIHtcbiAgICAgIHZhciBjb21wb25lbnROYW1lID0gZ2V0Q29tcG9uZW50TmFtZUZyb21UeXBlKHRoaXMudHlwZSk7XG4gICAgICBkaWRXYXJuQWJvdXRFbGVtZW50UmVmW2NvbXBvbmVudE5hbWVdIHx8XG4gICAgICAgICgoZGlkV2FybkFib3V0RWxlbWVudFJlZltjb21wb25lbnROYW1lXSA9ICEwKSxcbiAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICBcIkFjY2Vzc2luZyBlbGVtZW50LnJlZiB3YXMgcmVtb3ZlZCBpbiBSZWFjdCAxOS4gcmVmIGlzIG5vdyBhIHJlZ3VsYXIgcHJvcC4gSXQgd2lsbCBiZSByZW1vdmVkIGZyb20gdGhlIEpTWCBFbGVtZW50IHR5cGUgaW4gYSBmdXR1cmUgcmVsZWFzZS5cIlxuICAgICAgICApKTtcbiAgICAgIGNvbXBvbmVudE5hbWUgPSB0aGlzLnByb3BzLnJlZjtcbiAgICAgIHJldHVybiB2b2lkIDAgIT09IGNvbXBvbmVudE5hbWUgPyBjb21wb25lbnROYW1lIDogbnVsbDtcbiAgICB9XG4gICAgZnVuY3Rpb24gUmVhY3RFbGVtZW50KHR5cGUsIGtleSwgcHJvcHMsIG93bmVyLCBkZWJ1Z1N0YWNrLCBkZWJ1Z1Rhc2spIHtcbiAgICAgIHZhciByZWZQcm9wID0gcHJvcHMucmVmO1xuICAgICAgdHlwZSA9IHtcbiAgICAgICAgJCR0eXBlb2Y6IFJFQUNUX0VMRU1FTlRfVFlQRSxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAga2V5OiBrZXksXG4gICAgICAgIHByb3BzOiBwcm9wcyxcbiAgICAgICAgX293bmVyOiBvd25lclxuICAgICAgfTtcbiAgICAgIG51bGwgIT09ICh2b2lkIDAgIT09IHJlZlByb3AgPyByZWZQcm9wIDogbnVsbClcbiAgICAgICAgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkodHlwZSwgXCJyZWZcIiwge1xuICAgICAgICAgICAgZW51bWVyYWJsZTogITEsXG4gICAgICAgICAgICBnZXQ6IGVsZW1lbnRSZWZHZXR0ZXJXaXRoRGVwcmVjYXRpb25XYXJuaW5nXG4gICAgICAgICAgfSlcbiAgICAgICAgOiBPYmplY3QuZGVmaW5lUHJvcGVydHkodHlwZSwgXCJyZWZcIiwgeyBlbnVtZXJhYmxlOiAhMSwgdmFsdWU6IG51bGwgfSk7XG4gICAgICB0eXBlLl9zdG9yZSA9IHt9O1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHR5cGUuX3N0b3JlLCBcInZhbGlkYXRlZFwiLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogITEsXG4gICAgICAgIGVudW1lcmFibGU6ICExLFxuICAgICAgICB3cml0YWJsZTogITAsXG4gICAgICAgIHZhbHVlOiAwXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0eXBlLCBcIl9kZWJ1Z0luZm9cIiwge1xuICAgICAgICBjb25maWd1cmFibGU6ICExLFxuICAgICAgICBlbnVtZXJhYmxlOiAhMSxcbiAgICAgICAgd3JpdGFibGU6ICEwLFxuICAgICAgICB2YWx1ZTogbnVsbFxuICAgICAgfSk7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodHlwZSwgXCJfZGVidWdTdGFja1wiLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogITEsXG4gICAgICAgIGVudW1lcmFibGU6ICExLFxuICAgICAgICB3cml0YWJsZTogITAsXG4gICAgICAgIHZhbHVlOiBkZWJ1Z1N0YWNrXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0eXBlLCBcIl9kZWJ1Z1Rhc2tcIiwge1xuICAgICAgICBjb25maWd1cmFibGU6ICExLFxuICAgICAgICBlbnVtZXJhYmxlOiAhMSxcbiAgICAgICAgd3JpdGFibGU6ICEwLFxuICAgICAgICB2YWx1ZTogZGVidWdUYXNrXG4gICAgICB9KTtcbiAgICAgIE9iamVjdC5mcmVlemUgJiYgKE9iamVjdC5mcmVlemUodHlwZS5wcm9wcyksIE9iamVjdC5mcmVlemUodHlwZSkpO1xuICAgICAgcmV0dXJuIHR5cGU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNsb25lQW5kUmVwbGFjZUtleShvbGRFbGVtZW50LCBuZXdLZXkpIHtcbiAgICAgIG5ld0tleSA9IFJlYWN0RWxlbWVudChcbiAgICAgICAgb2xkRWxlbWVudC50eXBlLFxuICAgICAgICBuZXdLZXksXG4gICAgICAgIG9sZEVsZW1lbnQucHJvcHMsXG4gICAgICAgIG9sZEVsZW1lbnQuX293bmVyLFxuICAgICAgICBvbGRFbGVtZW50Ll9kZWJ1Z1N0YWNrLFxuICAgICAgICBvbGRFbGVtZW50Ll9kZWJ1Z1Rhc2tcbiAgICAgICk7XG4gICAgICBvbGRFbGVtZW50Ll9zdG9yZSAmJlxuICAgICAgICAobmV3S2V5Ll9zdG9yZS52YWxpZGF0ZWQgPSBvbGRFbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQpO1xuICAgICAgcmV0dXJuIG5ld0tleTtcbiAgICB9XG4gICAgZnVuY3Rpb24gdmFsaWRhdGVDaGlsZEtleXMobm9kZSkge1xuICAgICAgaXNWYWxpZEVsZW1lbnQobm9kZSlcbiAgICAgICAgPyBub2RlLl9zdG9yZSAmJiAobm9kZS5fc3RvcmUudmFsaWRhdGVkID0gMSlcbiAgICAgICAgOiBcIm9iamVjdFwiID09PSB0eXBlb2Ygbm9kZSAmJlxuICAgICAgICAgIG51bGwgIT09IG5vZGUgJiZcbiAgICAgICAgICBub2RlLiQkdHlwZW9mID09PSBSRUFDVF9MQVpZX1RZUEUgJiZcbiAgICAgICAgICAoXCJmdWxmaWxsZWRcIiA9PT0gbm9kZS5fcGF5bG9hZC5zdGF0dXNcbiAgICAgICAgICAgID8gaXNWYWxpZEVsZW1lbnQobm9kZS5fcGF5bG9hZC52YWx1ZSkgJiZcbiAgICAgICAgICAgICAgbm9kZS5fcGF5bG9hZC52YWx1ZS5fc3RvcmUgJiZcbiAgICAgICAgICAgICAgKG5vZGUuX3BheWxvYWQudmFsdWUuX3N0b3JlLnZhbGlkYXRlZCA9IDEpXG4gICAgICAgICAgICA6IG5vZGUuX3N0b3JlICYmIChub2RlLl9zdG9yZS52YWxpZGF0ZWQgPSAxKSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGlzVmFsaWRFbGVtZW50KG9iamVjdCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgXCJvYmplY3RcIiA9PT0gdHlwZW9mIG9iamVjdCAmJlxuICAgICAgICBudWxsICE9PSBvYmplY3QgJiZcbiAgICAgICAgb2JqZWN0LiQkdHlwZW9mID09PSBSRUFDVF9FTEVNRU5UX1RZUEVcbiAgICAgICk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGVzY2FwZShrZXkpIHtcbiAgICAgIHZhciBlc2NhcGVyTG9va3VwID0geyBcIj1cIjogXCI9MFwiLCBcIjpcIjogXCI9MlwiIH07XG4gICAgICByZXR1cm4gKFxuICAgICAgICBcIiRcIiArXG4gICAgICAgIGtleS5yZXBsYWNlKC9bPTpdL2csIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgICAgIHJldHVybiBlc2NhcGVyTG9va3VwW21hdGNoXTtcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRLZXkoZWxlbWVudCwgaW5kZXgpIHtcbiAgICAgIHJldHVybiBcIm9iamVjdFwiID09PSB0eXBlb2YgZWxlbWVudCAmJlxuICAgICAgICBudWxsICE9PSBlbGVtZW50ICYmXG4gICAgICAgIG51bGwgIT0gZWxlbWVudC5rZXlcbiAgICAgICAgPyAoY2hlY2tLZXlTdHJpbmdDb2VyY2lvbihlbGVtZW50LmtleSksIGVzY2FwZShcIlwiICsgZWxlbWVudC5rZXkpKVxuICAgICAgICA6IGluZGV4LnRvU3RyaW5nKDM2KTtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVzb2x2ZVRoZW5hYmxlKHRoZW5hYmxlKSB7XG4gICAgICBzd2l0Y2ggKHRoZW5hYmxlLnN0YXR1cykge1xuICAgICAgICBjYXNlIFwiZnVsZmlsbGVkXCI6XG4gICAgICAgICAgcmV0dXJuIHRoZW5hYmxlLnZhbHVlO1xuICAgICAgICBjYXNlIFwicmVqZWN0ZWRcIjpcbiAgICAgICAgICB0aHJvdyB0aGVuYWJsZS5yZWFzb247XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgc3dpdGNoIChcbiAgICAgICAgICAgIChcInN0cmluZ1wiID09PSB0eXBlb2YgdGhlbmFibGUuc3RhdHVzXG4gICAgICAgICAgICAgID8gdGhlbmFibGUudGhlbihub29wLCBub29wKVxuICAgICAgICAgICAgICA6ICgodGhlbmFibGUuc3RhdHVzID0gXCJwZW5kaW5nXCIpLFxuICAgICAgICAgICAgICAgIHRoZW5hYmxlLnRoZW4oXG4gICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZnVsZmlsbGVkVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgXCJwZW5kaW5nXCIgPT09IHRoZW5hYmxlLnN0YXR1cyAmJlxuICAgICAgICAgICAgICAgICAgICAgICgodGhlbmFibGUuc3RhdHVzID0gXCJmdWxmaWxsZWRcIiksXG4gICAgICAgICAgICAgICAgICAgICAgKHRoZW5hYmxlLnZhbHVlID0gZnVsZmlsbGVkVmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgXCJwZW5kaW5nXCIgPT09IHRoZW5hYmxlLnN0YXR1cyAmJlxuICAgICAgICAgICAgICAgICAgICAgICgodGhlbmFibGUuc3RhdHVzID0gXCJyZWplY3RlZFwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAodGhlbmFibGUucmVhc29uID0gZXJyb3IpKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApKSxcbiAgICAgICAgICAgIHRoZW5hYmxlLnN0YXR1cylcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIGNhc2UgXCJmdWxmaWxsZWRcIjpcbiAgICAgICAgICAgICAgcmV0dXJuIHRoZW5hYmxlLnZhbHVlO1xuICAgICAgICAgICAgY2FzZSBcInJlamVjdGVkXCI6XG4gICAgICAgICAgICAgIHRocm93IHRoZW5hYmxlLnJlYXNvbjtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyB0aGVuYWJsZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gbWFwSW50b0FycmF5KGNoaWxkcmVuLCBhcnJheSwgZXNjYXBlZFByZWZpeCwgbmFtZVNvRmFyLCBjYWxsYmFjaykge1xuICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgY2hpbGRyZW47XG4gICAgICBpZiAoXCJ1bmRlZmluZWRcIiA9PT0gdHlwZSB8fCBcImJvb2xlYW5cIiA9PT0gdHlwZSkgY2hpbGRyZW4gPSBudWxsO1xuICAgICAgdmFyIGludm9rZUNhbGxiYWNrID0gITE7XG4gICAgICBpZiAobnVsbCA9PT0gY2hpbGRyZW4pIGludm9rZUNhbGxiYWNrID0gITA7XG4gICAgICBlbHNlXG4gICAgICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJiaWdpbnRcIjpcbiAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6XG4gICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxuICAgICAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSAhMDtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgXCJvYmplY3RcIjpcbiAgICAgICAgICAgIHN3aXRjaCAoY2hpbGRyZW4uJCR0eXBlb2YpIHtcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9FTEVNRU5UX1RZUEU6XG4gICAgICAgICAgICAgIGNhc2UgUkVBQ1RfUE9SVEFMX1RZUEU6XG4gICAgICAgICAgICAgICAgaW52b2tlQ2FsbGJhY2sgPSAhMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSBSRUFDVF9MQVpZX1RZUEU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgIChpbnZva2VDYWxsYmFjayA9IGNoaWxkcmVuLl9pbml0KSxcbiAgICAgICAgICAgICAgICAgIG1hcEludG9BcnJheShcbiAgICAgICAgICAgICAgICAgICAgaW52b2tlQ2FsbGJhY2soY2hpbGRyZW4uX3BheWxvYWQpLFxuICAgICAgICAgICAgICAgICAgICBhcnJheSxcbiAgICAgICAgICAgICAgICAgICAgZXNjYXBlZFByZWZpeCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZVNvRmFyLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFja1xuICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIGlmIChpbnZva2VDYWxsYmFjaykge1xuICAgICAgICBpbnZva2VDYWxsYmFjayA9IGNoaWxkcmVuO1xuICAgICAgICBjYWxsYmFjayA9IGNhbGxiYWNrKGludm9rZUNhbGxiYWNrKTtcbiAgICAgICAgdmFyIGNoaWxkS2V5ID1cbiAgICAgICAgICBcIlwiID09PSBuYW1lU29GYXIgPyBcIi5cIiArIGdldEVsZW1lbnRLZXkoaW52b2tlQ2FsbGJhY2ssIDApIDogbmFtZVNvRmFyO1xuICAgICAgICBpc0FycmF5SW1wbChjYWxsYmFjaylcbiAgICAgICAgICA/ICgoZXNjYXBlZFByZWZpeCA9IFwiXCIpLFxuICAgICAgICAgICAgbnVsbCAhPSBjaGlsZEtleSAmJlxuICAgICAgICAgICAgICAoZXNjYXBlZFByZWZpeCA9XG4gICAgICAgICAgICAgICAgY2hpbGRLZXkucmVwbGFjZSh1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCwgXCIkJi9cIikgKyBcIi9cIiksXG4gICAgICAgICAgICBtYXBJbnRvQXJyYXkoY2FsbGJhY2ssIGFycmF5LCBlc2NhcGVkUHJlZml4LCBcIlwiLCBmdW5jdGlvbiAoYykge1xuICAgICAgICAgICAgICByZXR1cm4gYztcbiAgICAgICAgICAgIH0pKVxuICAgICAgICAgIDogbnVsbCAhPSBjYWxsYmFjayAmJlxuICAgICAgICAgICAgKGlzVmFsaWRFbGVtZW50KGNhbGxiYWNrKSAmJlxuICAgICAgICAgICAgICAobnVsbCAhPSBjYWxsYmFjay5rZXkgJiZcbiAgICAgICAgICAgICAgICAoKGludm9rZUNhbGxiYWNrICYmIGludm9rZUNhbGxiYWNrLmtleSA9PT0gY2FsbGJhY2sua2V5KSB8fFxuICAgICAgICAgICAgICAgICAgY2hlY2tLZXlTdHJpbmdDb2VyY2lvbihjYWxsYmFjay5rZXkpKSxcbiAgICAgICAgICAgICAgKGVzY2FwZWRQcmVmaXggPSBjbG9uZUFuZFJlcGxhY2VLZXkoXG4gICAgICAgICAgICAgICAgY2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgZXNjYXBlZFByZWZpeCArXG4gICAgICAgICAgICAgICAgICAobnVsbCA9PSBjYWxsYmFjay5rZXkgfHxcbiAgICAgICAgICAgICAgICAgIChpbnZva2VDYWxsYmFjayAmJiBpbnZva2VDYWxsYmFjay5rZXkgPT09IGNhbGxiYWNrLmtleSlcbiAgICAgICAgICAgICAgICAgICAgPyBcIlwiXG4gICAgICAgICAgICAgICAgICAgIDogKFwiXCIgKyBjYWxsYmFjay5rZXkpLnJlcGxhY2UoXG4gICAgICAgICAgICAgICAgICAgICAgICB1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiJCYvXCJcbiAgICAgICAgICAgICAgICAgICAgICApICsgXCIvXCIpICtcbiAgICAgICAgICAgICAgICAgIGNoaWxkS2V5XG4gICAgICAgICAgICAgICkpLFxuICAgICAgICAgICAgICBcIlwiICE9PSBuYW1lU29GYXIgJiZcbiAgICAgICAgICAgICAgICBudWxsICE9IGludm9rZUNhbGxiYWNrICYmXG4gICAgICAgICAgICAgICAgaXNWYWxpZEVsZW1lbnQoaW52b2tlQ2FsbGJhY2spICYmXG4gICAgICAgICAgICAgICAgbnVsbCA9PSBpbnZva2VDYWxsYmFjay5rZXkgJiZcbiAgICAgICAgICAgICAgICBpbnZva2VDYWxsYmFjay5fc3RvcmUgJiZcbiAgICAgICAgICAgICAgICAhaW52b2tlQ2FsbGJhY2suX3N0b3JlLnZhbGlkYXRlZCAmJlxuICAgICAgICAgICAgICAgIChlc2NhcGVkUHJlZml4Ll9zdG9yZS52YWxpZGF0ZWQgPSAyKSxcbiAgICAgICAgICAgICAgKGNhbGxiYWNrID0gZXNjYXBlZFByZWZpeCkpLFxuICAgICAgICAgICAgYXJyYXkucHVzaChjYWxsYmFjaykpO1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH1cbiAgICAgIGludm9rZUNhbGxiYWNrID0gMDtcbiAgICAgIGNoaWxkS2V5ID0gXCJcIiA9PT0gbmFtZVNvRmFyID8gXCIuXCIgOiBuYW1lU29GYXIgKyBcIjpcIjtcbiAgICAgIGlmIChpc0FycmF5SW1wbChjaGlsZHJlbikpXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspXG4gICAgICAgICAgKG5hbWVTb0ZhciA9IGNoaWxkcmVuW2ldKSxcbiAgICAgICAgICAgICh0eXBlID0gY2hpbGRLZXkgKyBnZXRFbGVtZW50S2V5KG5hbWVTb0ZhciwgaSkpLFxuICAgICAgICAgICAgKGludm9rZUNhbGxiYWNrICs9IG1hcEludG9BcnJheShcbiAgICAgICAgICAgICAgbmFtZVNvRmFyLFxuICAgICAgICAgICAgICBhcnJheSxcbiAgICAgICAgICAgICAgZXNjYXBlZFByZWZpeCxcbiAgICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgICAgICkpO1xuICAgICAgZWxzZSBpZiAoKChpID0gZ2V0SXRlcmF0b3JGbihjaGlsZHJlbikpLCBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBpKSlcbiAgICAgICAgZm9yIChcbiAgICAgICAgICBpID09PSBjaGlsZHJlbi5lbnRyaWVzICYmXG4gICAgICAgICAgICAoZGlkV2FybkFib3V0TWFwcyB8fFxuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgXCJVc2luZyBNYXBzIGFzIGNoaWxkcmVuIGlzIG5vdCBzdXBwb3J0ZWQuIFVzZSBhbiBhcnJheSBvZiBrZXllZCBSZWFjdEVsZW1lbnRzIGluc3RlYWQuXCJcbiAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIChkaWRXYXJuQWJvdXRNYXBzID0gITApKSxcbiAgICAgICAgICAgIGNoaWxkcmVuID0gaS5jYWxsKGNoaWxkcmVuKSxcbiAgICAgICAgICAgIGkgPSAwO1xuICAgICAgICAgICEobmFtZVNvRmFyID0gY2hpbGRyZW4ubmV4dCgpKS5kb25lO1xuXG4gICAgICAgIClcbiAgICAgICAgICAobmFtZVNvRmFyID0gbmFtZVNvRmFyLnZhbHVlKSxcbiAgICAgICAgICAgICh0eXBlID0gY2hpbGRLZXkgKyBnZXRFbGVtZW50S2V5KG5hbWVTb0ZhciwgaSsrKSksXG4gICAgICAgICAgICAoaW52b2tlQ2FsbGJhY2sgKz0gbWFwSW50b0FycmF5KFxuICAgICAgICAgICAgICBuYW1lU29GYXIsXG4gICAgICAgICAgICAgIGFycmF5LFxuICAgICAgICAgICAgICBlc2NhcGVkUHJlZml4LFxuICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICBjYWxsYmFja1xuICAgICAgICAgICAgKSk7XG4gICAgICBlbHNlIGlmIChcIm9iamVjdFwiID09PSB0eXBlKSB7XG4gICAgICAgIGlmIChcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBjaGlsZHJlbi50aGVuKVxuICAgICAgICAgIHJldHVybiBtYXBJbnRvQXJyYXkoXG4gICAgICAgICAgICByZXNvbHZlVGhlbmFibGUoY2hpbGRyZW4pLFxuICAgICAgICAgICAgYXJyYXksXG4gICAgICAgICAgICBlc2NhcGVkUHJlZml4LFxuICAgICAgICAgICAgbmFtZVNvRmFyLFxuICAgICAgICAgICAgY2FsbGJhY2tcbiAgICAgICAgICApO1xuICAgICAgICBhcnJheSA9IFN0cmluZyhjaGlsZHJlbik7XG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgIFwiT2JqZWN0cyBhcmUgbm90IHZhbGlkIGFzIGEgUmVhY3QgY2hpbGQgKGZvdW5kOiBcIiArXG4gICAgICAgICAgICAoXCJbb2JqZWN0IE9iamVjdF1cIiA9PT0gYXJyYXlcbiAgICAgICAgICAgICAgPyBcIm9iamVjdCB3aXRoIGtleXMge1wiICsgT2JqZWN0LmtleXMoY2hpbGRyZW4pLmpvaW4oXCIsIFwiKSArIFwifVwiXG4gICAgICAgICAgICAgIDogYXJyYXkpICtcbiAgICAgICAgICAgIFwiKS4gSWYgeW91IG1lYW50IHRvIHJlbmRlciBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4sIHVzZSBhbiBhcnJheSBpbnN0ZWFkLlwiXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaW52b2tlQ2FsbGJhY2s7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jLCBjb250ZXh0KSB7XG4gICAgICBpZiAobnVsbCA9PSBjaGlsZHJlbikgcmV0dXJuIGNoaWxkcmVuO1xuICAgICAgdmFyIHJlc3VsdCA9IFtdLFxuICAgICAgICBjb3VudCA9IDA7XG4gICAgICBtYXBJbnRvQXJyYXkoY2hpbGRyZW4sIHJlc3VsdCwgXCJcIiwgXCJcIiwgZnVuY3Rpb24gKGNoaWxkKSB7XG4gICAgICAgIHJldHVybiBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGNvdW50KyspO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBsYXp5SW5pdGlhbGl6ZXIocGF5bG9hZCkge1xuICAgICAgaWYgKC0xID09PSBwYXlsb2FkLl9zdGF0dXMpIHtcbiAgICAgICAgdmFyIGlvSW5mbyA9IHBheWxvYWQuX2lvSW5mbztcbiAgICAgICAgbnVsbCAhPSBpb0luZm8gJiYgKGlvSW5mby5zdGFydCA9IGlvSW5mby5lbmQgPSBwZXJmb3JtYW5jZS5ub3coKSk7XG4gICAgICAgIGlvSW5mbyA9IHBheWxvYWQuX3Jlc3VsdDtcbiAgICAgICAgdmFyIHRoZW5hYmxlID0gaW9JbmZvKCk7XG4gICAgICAgIHRoZW5hYmxlLnRoZW4oXG4gICAgICAgICAgZnVuY3Rpb24gKG1vZHVsZU9iamVjdCkge1xuICAgICAgICAgICAgaWYgKDAgPT09IHBheWxvYWQuX3N0YXR1cyB8fCAtMSA9PT0gcGF5bG9hZC5fc3RhdHVzKSB7XG4gICAgICAgICAgICAgIHBheWxvYWQuX3N0YXR1cyA9IDE7XG4gICAgICAgICAgICAgIHBheWxvYWQuX3Jlc3VsdCA9IG1vZHVsZU9iamVjdDtcbiAgICAgICAgICAgICAgdmFyIF9pb0luZm8gPSBwYXlsb2FkLl9pb0luZm87XG4gICAgICAgICAgICAgIG51bGwgIT0gX2lvSW5mbyAmJiAoX2lvSW5mby5lbmQgPSBwZXJmb3JtYW5jZS5ub3coKSk7XG4gICAgICAgICAgICAgIHZvaWQgMCA9PT0gdGhlbmFibGUuc3RhdHVzICYmXG4gICAgICAgICAgICAgICAgKCh0aGVuYWJsZS5zdGF0dXMgPSBcImZ1bGZpbGxlZFwiKSxcbiAgICAgICAgICAgICAgICAodGhlbmFibGUudmFsdWUgPSBtb2R1bGVPYmplY3QpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgICAgaWYgKDAgPT09IHBheWxvYWQuX3N0YXR1cyB8fCAtMSA9PT0gcGF5bG9hZC5fc3RhdHVzKSB7XG4gICAgICAgICAgICAgIHBheWxvYWQuX3N0YXR1cyA9IDI7XG4gICAgICAgICAgICAgIHBheWxvYWQuX3Jlc3VsdCA9IGVycm9yO1xuICAgICAgICAgICAgICB2YXIgX2lvSW5mbzIgPSBwYXlsb2FkLl9pb0luZm87XG4gICAgICAgICAgICAgIG51bGwgIT0gX2lvSW5mbzIgJiYgKF9pb0luZm8yLmVuZCA9IHBlcmZvcm1hbmNlLm5vdygpKTtcbiAgICAgICAgICAgICAgdm9pZCAwID09PSB0aGVuYWJsZS5zdGF0dXMgJiZcbiAgICAgICAgICAgICAgICAoKHRoZW5hYmxlLnN0YXR1cyA9IFwicmVqZWN0ZWRcIiksICh0aGVuYWJsZS5yZWFzb24gPSBlcnJvcikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgaW9JbmZvID0gcGF5bG9hZC5faW9JbmZvO1xuICAgICAgICBpZiAobnVsbCAhPSBpb0luZm8pIHtcbiAgICAgICAgICBpb0luZm8udmFsdWUgPSB0aGVuYWJsZTtcbiAgICAgICAgICB2YXIgZGlzcGxheU5hbWUgPSB0aGVuYWJsZS5kaXNwbGF5TmFtZTtcbiAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2YgZGlzcGxheU5hbWUgJiYgKGlvSW5mby5uYW1lID0gZGlzcGxheU5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIC0xID09PSBwYXlsb2FkLl9zdGF0dXMgJiZcbiAgICAgICAgICAoKHBheWxvYWQuX3N0YXR1cyA9IDApLCAocGF5bG9hZC5fcmVzdWx0ID0gdGhlbmFibGUpKTtcbiAgICAgIH1cbiAgICAgIGlmICgxID09PSBwYXlsb2FkLl9zdGF0dXMpXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgKGlvSW5mbyA9IHBheWxvYWQuX3Jlc3VsdCksXG4gICAgICAgICAgdm9pZCAwID09PSBpb0luZm8gJiZcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgIFwibGF6eTogRXhwZWN0ZWQgdGhlIHJlc3VsdCBvZiBhIGR5bmFtaWMgaW1wb3J0KCkgY2FsbC4gSW5zdGVhZCByZWNlaXZlZDogJXNcXG5cXG5Zb3VyIGNvZGUgc2hvdWxkIGxvb2sgbGlrZTogXFxuICBjb25zdCBNeUNvbXBvbmVudCA9IGxhenkoKCkgPT4gaW1wb3J0KCcuL015Q29tcG9uZW50JykpXFxuXFxuRGlkIHlvdSBhY2NpZGVudGFsbHkgcHV0IGN1cmx5IGJyYWNlcyBhcm91bmQgdGhlIGltcG9ydD9cIixcbiAgICAgICAgICAgICAgaW9JbmZvXG4gICAgICAgICAgICApLFxuICAgICAgICAgIFwiZGVmYXVsdFwiIGluIGlvSW5mbyB8fFxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgXCJsYXp5OiBFeHBlY3RlZCB0aGUgcmVzdWx0IG9mIGEgZHluYW1pYyBpbXBvcnQoKSBjYWxsLiBJbnN0ZWFkIHJlY2VpdmVkOiAlc1xcblxcbllvdXIgY29kZSBzaG91bGQgbG9vayBsaWtlOiBcXG4gIGNvbnN0IE15Q29tcG9uZW50ID0gbGF6eSgoKSA9PiBpbXBvcnQoJy4vTXlDb21wb25lbnQnKSlcIixcbiAgICAgICAgICAgICAgaW9JbmZvXG4gICAgICAgICAgICApLFxuICAgICAgICAgIGlvSW5mby5kZWZhdWx0XG4gICAgICAgICk7XG4gICAgICB0aHJvdyBwYXlsb2FkLl9yZXN1bHQ7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHJlc29sdmVEaXNwYXRjaGVyKCkge1xuICAgICAgdmFyIGRpc3BhdGNoZXIgPSBSZWFjdFNoYXJlZEludGVybmFscy5IO1xuICAgICAgbnVsbCA9PT0gZGlzcGF0Y2hlciAmJlxuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgIFwiSW52YWxpZCBob29rIGNhbGwuIEhvb2tzIGNhbiBvbmx5IGJlIGNhbGxlZCBpbnNpZGUgb2YgdGhlIGJvZHkgb2YgYSBmdW5jdGlvbiBjb21wb25lbnQuIFRoaXMgY291bGQgaGFwcGVuIGZvciBvbmUgb2YgdGhlIGZvbGxvd2luZyByZWFzb25zOlxcbjEuIFlvdSBtaWdodCBoYXZlIG1pc21hdGNoaW5nIHZlcnNpb25zIG9mIFJlYWN0IGFuZCB0aGUgcmVuZGVyZXIgKHN1Y2ggYXMgUmVhY3QgRE9NKVxcbjIuIFlvdSBtaWdodCBiZSBicmVha2luZyB0aGUgUnVsZXMgb2YgSG9va3NcXG4zLiBZb3UgbWlnaHQgaGF2ZSBtb3JlIHRoYW4gb25lIGNvcHkgb2YgUmVhY3QgaW4gdGhlIHNhbWUgYXBwXFxuU2VlIGh0dHBzOi8vcmVhY3QuZGV2L2xpbmsvaW52YWxpZC1ob29rLWNhbGwgZm9yIHRpcHMgYWJvdXQgaG93IHRvIGRlYnVnIGFuZCBmaXggdGhpcyBwcm9ibGVtLlwiXG4gICAgICAgICk7XG4gICAgICByZXR1cm4gZGlzcGF0Y2hlcjtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVsZWFzZUFzeW5jVHJhbnNpdGlvbigpIHtcbiAgICAgIFJlYWN0U2hhcmVkSW50ZXJuYWxzLmFzeW5jVHJhbnNpdGlvbnMtLTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZW5xdWV1ZVRhc2sodGFzaykge1xuICAgICAgaWYgKG51bGwgPT09IGVucXVldWVUYXNrSW1wbClcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgcmVxdWlyZVN0cmluZyA9IChcInJlcXVpcmVcIiArIE1hdGgucmFuZG9tKCkpLnNsaWNlKDAsIDcpO1xuICAgICAgICAgIGVucXVldWVUYXNrSW1wbCA9IChtb2R1bGUgJiYgbW9kdWxlW3JlcXVpcmVTdHJpbmddKS5jYWxsKFxuICAgICAgICAgICAgbW9kdWxlLFxuICAgICAgICAgICAgXCJ0aW1lcnNcIlxuICAgICAgICAgICkuc2V0SW1tZWRpYXRlO1xuICAgICAgICB9IGNhdGNoIChfZXJyKSB7XG4gICAgICAgICAgZW5xdWV1ZVRhc2tJbXBsID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICAhMSA9PT0gZGlkV2FybkFib3V0TWVzc2FnZUNoYW5uZWwgJiZcbiAgICAgICAgICAgICAgKChkaWRXYXJuQWJvdXRNZXNzYWdlQ2hhbm5lbCA9ICEwKSxcbiAgICAgICAgICAgICAgXCJ1bmRlZmluZWRcIiA9PT0gdHlwZW9mIE1lc3NhZ2VDaGFubmVsICYmXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICAgIFwiVGhpcyBicm93c2VyIGRvZXMgbm90IGhhdmUgYSBNZXNzYWdlQ2hhbm5lbCBpbXBsZW1lbnRhdGlvbiwgc28gZW5xdWV1aW5nIHRhc2tzIHZpYSBhd2FpdCBhY3QoYXN5bmMgKCkgPT4gLi4uKSB3aWxsIGZhaWwuIFBsZWFzZSBmaWxlIGFuIGlzc3VlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9yZWFjdC9pc3N1ZXMgaWYgeW91IGVuY291bnRlciB0aGlzIHdhcm5pbmcuXCJcbiAgICAgICAgICAgICAgICApKTtcbiAgICAgICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGNhbGxiYWNrO1xuICAgICAgICAgICAgY2hhbm5lbC5wb3J0Mi5wb3N0TWVzc2FnZSh2b2lkIDApO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIHJldHVybiBlbnF1ZXVlVGFza0ltcGwodGFzayk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFnZ3JlZ2F0ZUVycm9ycyhlcnJvcnMpIHtcbiAgICAgIHJldHVybiAxIDwgZXJyb3JzLmxlbmd0aCAmJiBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiBBZ2dyZWdhdGVFcnJvclxuICAgICAgICA/IG5ldyBBZ2dyZWdhdGVFcnJvcihlcnJvcnMpXG4gICAgICAgIDogZXJyb3JzWzBdO1xuICAgIH1cbiAgICBmdW5jdGlvbiBwb3BBY3RTY29wZShwcmV2QWN0UXVldWUsIHByZXZBY3RTY29wZURlcHRoKSB7XG4gICAgICBwcmV2QWN0U2NvcGVEZXB0aCAhPT0gYWN0U2NvcGVEZXB0aCAtIDEgJiZcbiAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICBcIllvdSBzZWVtIHRvIGhhdmUgb3ZlcmxhcHBpbmcgYWN0KCkgY2FsbHMsIHRoaXMgaXMgbm90IHN1cHBvcnRlZC4gQmUgc3VyZSB0byBhd2FpdCBwcmV2aW91cyBhY3QoKSBjYWxscyBiZWZvcmUgbWFraW5nIGEgbmV3IG9uZS4gXCJcbiAgICAgICAgKTtcbiAgICAgIGFjdFNjb3BlRGVwdGggPSBwcmV2QWN0U2NvcGVEZXB0aDtcbiAgICB9XG4gICAgZnVuY3Rpb24gcmVjdXJzaXZlbHlGbHVzaEFzeW5jQWN0V29yayhyZXR1cm5WYWx1ZSwgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcXVldWUgPSBSZWFjdFNoYXJlZEludGVybmFscy5hY3RRdWV1ZTtcbiAgICAgIGlmIChudWxsICE9PSBxdWV1ZSlcbiAgICAgICAgaWYgKDAgIT09IHF1ZXVlLmxlbmd0aClcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZmx1c2hBY3RRdWV1ZShxdWV1ZSk7XG4gICAgICAgICAgICBlbnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWN1cnNpdmVseUZsdXNoQXN5bmNBY3RXb3JrKHJldHVyblZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIGVsc2UgUmVhY3RTaGFyZWRJbnRlcm5hbHMuYWN0UXVldWUgPSBudWxsO1xuICAgICAgMCA8IFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9ycy5sZW5ndGhcbiAgICAgICAgPyAoKHF1ZXVlID0gYWdncmVnYXRlRXJyb3JzKFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9ycykpLFxuICAgICAgICAgIChSZWFjdFNoYXJlZEludGVybmFscy50aHJvd25FcnJvcnMubGVuZ3RoID0gMCksXG4gICAgICAgICAgcmVqZWN0KHF1ZXVlKSlcbiAgICAgICAgOiByZXNvbHZlKHJldHVyblZhbHVlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZmx1c2hBY3RRdWV1ZShxdWV1ZSkge1xuICAgICAgaWYgKCFpc0ZsdXNoaW5nKSB7XG4gICAgICAgIGlzRmx1c2hpbmcgPSAhMDtcbiAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZvciAoOyBpIDwgcXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjayA9IHF1ZXVlW2ldO1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICBSZWFjdFNoYXJlZEludGVybmFscy5kaWRVc2VQcm9taXNlID0gITE7XG4gICAgICAgICAgICAgIHZhciBjb250aW51YXRpb24gPSBjYWxsYmFjayghMSk7XG4gICAgICAgICAgICAgIGlmIChudWxsICE9PSBjb250aW51YXRpb24pIHtcbiAgICAgICAgICAgICAgICBpZiAoUmVhY3RTaGFyZWRJbnRlcm5hbHMuZGlkVXNlUHJvbWlzZSkge1xuICAgICAgICAgICAgICAgICAgcXVldWVbaV0gPSBjYWxsYmFjaztcbiAgICAgICAgICAgICAgICAgIHF1ZXVlLnNwbGljZSgwLCBpKTtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2FsbGJhY2sgPSBjb250aW51YXRpb247XG4gICAgICAgICAgICAgIH0gZWxzZSBicmVhaztcbiAgICAgICAgICAgIH0gd2hpbGUgKDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBxdWV1ZS5sZW5ndGggPSAwO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHF1ZXVlLnNwbGljZSgwLCBpICsgMSksIFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICBpc0ZsdXNoaW5nID0gITE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXyAmJlxuICAgICAgXCJmdW5jdGlvblwiID09PVxuICAgICAgICB0eXBlb2YgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fLnJlZ2lzdGVySW50ZXJuYWxNb2R1bGVTdGFydCAmJlxuICAgICAgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fLnJlZ2lzdGVySW50ZXJuYWxNb2R1bGVTdGFydChFcnJvcigpKTtcbiAgICB2YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LnRyYW5zaXRpb25hbC5lbGVtZW50XCIpLFxuICAgICAgUkVBQ1RfUE9SVEFMX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3QucG9ydGFsXCIpLFxuICAgICAgUkVBQ1RfRlJBR01FTlRfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5mcmFnbWVudFwiKSxcbiAgICAgIFJFQUNUX1NUUklDVF9NT0RFX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3Quc3RyaWN0X21vZGVcIiksXG4gICAgICBSRUFDVF9QUk9GSUxFUl9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LnByb2ZpbGVyXCIpLFxuICAgICAgUkVBQ1RfQ09OU1VNRVJfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5jb25zdW1lclwiKSxcbiAgICAgIFJFQUNUX0NPTlRFWFRfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5jb250ZXh0XCIpLFxuICAgICAgUkVBQ1RfRk9SV0FSRF9SRUZfVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5mb3J3YXJkX3JlZlwiKSxcbiAgICAgIFJFQUNUX1NVU1BFTlNFX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3Quc3VzcGVuc2VcIiksXG4gICAgICBSRUFDVF9TVVNQRU5TRV9MSVNUX1RZUEUgPSBTeW1ib2wuZm9yKFwicmVhY3Quc3VzcGVuc2VfbGlzdFwiKSxcbiAgICAgIFJFQUNUX01FTU9fVFlQRSA9IFN5bWJvbC5mb3IoXCJyZWFjdC5tZW1vXCIpLFxuICAgICAgUkVBQ1RfTEFaWV9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LmxhenlcIiksXG4gICAgICBSRUFDVF9BQ1RJVklUWV9UWVBFID0gU3ltYm9sLmZvcihcInJlYWN0LmFjdGl2aXR5XCIpLFxuICAgICAgTUFZQkVfSVRFUkFUT1JfU1lNQk9MID0gU3ltYm9sLml0ZXJhdG9yLFxuICAgICAgZGlkV2FyblN0YXRlVXBkYXRlRm9yVW5tb3VudGVkQ29tcG9uZW50ID0ge30sXG4gICAgICBSZWFjdE5vb3BVcGRhdGVRdWV1ZSA9IHtcbiAgICAgICAgaXNNb3VudGVkOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICExO1xuICAgICAgICB9LFxuICAgICAgICBlbnF1ZXVlRm9yY2VVcGRhdGU6IGZ1bmN0aW9uIChwdWJsaWNJbnN0YW5jZSkge1xuICAgICAgICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCBcImZvcmNlVXBkYXRlXCIpO1xuICAgICAgICB9LFxuICAgICAgICBlbnF1ZXVlUmVwbGFjZVN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UpIHtcbiAgICAgICAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgXCJyZXBsYWNlU3RhdGVcIik7XG4gICAgICAgIH0sXG4gICAgICAgIGVucXVldWVTZXRTdGF0ZTogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlKSB7XG4gICAgICAgICAgd2Fybk5vb3AocHVibGljSW5zdGFuY2UsIFwic2V0U3RhdGVcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBhc3NpZ24gPSBPYmplY3QuYXNzaWduLFxuICAgICAgZW1wdHlPYmplY3QgPSB7fTtcbiAgICBPYmplY3QuZnJlZXplKGVtcHR5T2JqZWN0KTtcbiAgICBDb21wb25lbnQucHJvdG90eXBlLmlzUmVhY3RDb21wb25lbnQgPSB7fTtcbiAgICBDb21wb25lbnQucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2spIHtcbiAgICAgIGlmIChcbiAgICAgICAgXCJvYmplY3RcIiAhPT0gdHlwZW9mIHBhcnRpYWxTdGF0ZSAmJlxuICAgICAgICBcImZ1bmN0aW9uXCIgIT09IHR5cGVvZiBwYXJ0aWFsU3RhdGUgJiZcbiAgICAgICAgbnVsbCAhPSBwYXJ0aWFsU3RhdGVcbiAgICAgIClcbiAgICAgICAgdGhyb3cgRXJyb3IoXG4gICAgICAgICAgXCJ0YWtlcyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzIHRvIHVwZGF0ZSBvciBhIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcy5cIlxuICAgICAgICApO1xuICAgICAgdGhpcy51cGRhdGVyLmVucXVldWVTZXRTdGF0ZSh0aGlzLCBwYXJ0aWFsU3RhdGUsIGNhbGxiYWNrLCBcInNldFN0YXRlXCIpO1xuICAgIH07XG4gICAgQ29tcG9uZW50LnByb3RvdHlwZS5mb3JjZVVwZGF0ZSA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgdGhpcy51cGRhdGVyLmVucXVldWVGb3JjZVVwZGF0ZSh0aGlzLCBjYWxsYmFjaywgXCJmb3JjZVVwZGF0ZVwiKTtcbiAgICB9O1xuICAgIHZhciBkZXByZWNhdGVkQVBJcyA9IHtcbiAgICAgIGlzTW91bnRlZDogW1xuICAgICAgICBcImlzTW91bnRlZFwiLFxuICAgICAgICBcIkluc3RlYWQsIG1ha2Ugc3VyZSB0byBjbGVhbiB1cCBzdWJzY3JpcHRpb25zIGFuZCBwZW5kaW5nIHJlcXVlc3RzIGluIGNvbXBvbmVudFdpbGxVbm1vdW50IHRvIHByZXZlbnQgbWVtb3J5IGxlYWtzLlwiXG4gICAgICBdLFxuICAgICAgcmVwbGFjZVN0YXRlOiBbXG4gICAgICAgIFwicmVwbGFjZVN0YXRlXCIsXG4gICAgICAgIFwiUmVmYWN0b3IgeW91ciBjb2RlIHRvIHVzZSBzZXRTdGF0ZSBpbnN0ZWFkIChzZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8zMjM2KS5cIlxuICAgICAgXVxuICAgIH07XG4gICAgZm9yIChmbk5hbWUgaW4gZGVwcmVjYXRlZEFQSXMpXG4gICAgICBkZXByZWNhdGVkQVBJcy5oYXNPd25Qcm9wZXJ0eShmbk5hbWUpICYmXG4gICAgICAgIGRlZmluZURlcHJlY2F0aW9uV2FybmluZyhmbk5hbWUsIGRlcHJlY2F0ZWRBUElzW2ZuTmFtZV0pO1xuICAgIENvbXBvbmVudER1bW15LnByb3RvdHlwZSA9IENvbXBvbmVudC5wcm90b3R5cGU7XG4gICAgZGVwcmVjYXRlZEFQSXMgPSBQdXJlQ29tcG9uZW50LnByb3RvdHlwZSA9IG5ldyBDb21wb25lbnREdW1teSgpO1xuICAgIGRlcHJlY2F0ZWRBUElzLmNvbnN0cnVjdG9yID0gUHVyZUNvbXBvbmVudDtcbiAgICBhc3NpZ24oZGVwcmVjYXRlZEFQSXMsIENvbXBvbmVudC5wcm90b3R5cGUpO1xuICAgIGRlcHJlY2F0ZWRBUElzLmlzUHVyZVJlYWN0Q29tcG9uZW50ID0gITA7XG4gICAgdmFyIGlzQXJyYXlJbXBsID0gQXJyYXkuaXNBcnJheSxcbiAgICAgIFJFQUNUX0NMSUVOVF9SRUZFUkVOQ0UgPSBTeW1ib2wuZm9yKFwicmVhY3QuY2xpZW50LnJlZmVyZW5jZVwiKSxcbiAgICAgIFJlYWN0U2hhcmVkSW50ZXJuYWxzID0ge1xuICAgICAgICBIOiBudWxsLFxuICAgICAgICBBOiBudWxsLFxuICAgICAgICBUOiBudWxsLFxuICAgICAgICBTOiBudWxsLFxuICAgICAgICBhY3RRdWV1ZTogbnVsbCxcbiAgICAgICAgYXN5bmNUcmFuc2l0aW9uczogMCxcbiAgICAgICAgaXNCYXRjaGluZ0xlZ2FjeTogITEsXG4gICAgICAgIGRpZFNjaGVkdWxlTGVnYWN5VXBkYXRlOiAhMSxcbiAgICAgICAgZGlkVXNlUHJvbWlzZTogITEsXG4gICAgICAgIHRocm93bkVycm9yczogW10sXG4gICAgICAgIGdldEN1cnJlbnRTdGFjazogbnVsbCxcbiAgICAgICAgcmVjZW50bHlDcmVhdGVkT3duZXJTdGFja3M6IDBcbiAgICAgIH0sXG4gICAgICBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXG4gICAgICBjcmVhdGVUYXNrID0gY29uc29sZS5jcmVhdGVUYXNrXG4gICAgICAgID8gY29uc29sZS5jcmVhdGVUYXNrXG4gICAgICAgIDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgfTtcbiAgICBkZXByZWNhdGVkQVBJcyA9IHtcbiAgICAgIHJlYWN0X3N0YWNrX2JvdHRvbV9mcmFtZTogZnVuY3Rpb24gKGNhbGxTdGFja0ZvckVycm9yKSB7XG4gICAgICAgIHJldHVybiBjYWxsU3RhY2tGb3JFcnJvcigpO1xuICAgICAgfVxuICAgIH07XG4gICAgdmFyIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duLCBkaWRXYXJuQWJvdXRPbGRKU1hSdW50aW1lO1xuICAgIHZhciBkaWRXYXJuQWJvdXRFbGVtZW50UmVmID0ge307XG4gICAgdmFyIHVua25vd25Pd25lckRlYnVnU3RhY2sgPSBkZXByZWNhdGVkQVBJcy5yZWFjdF9zdGFja19ib3R0b21fZnJhbWUuYmluZChcbiAgICAgIGRlcHJlY2F0ZWRBUElzLFxuICAgICAgVW5rbm93bk93bmVyXG4gICAgKSgpO1xuICAgIHZhciB1bmtub3duT3duZXJEZWJ1Z1Rhc2sgPSBjcmVhdGVUYXNrKGdldFRhc2tOYW1lKFVua25vd25Pd25lcikpO1xuICAgIHZhciBkaWRXYXJuQWJvdXRNYXBzID0gITEsXG4gICAgICB1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCA9IC9cXC8rL2csXG4gICAgICByZXBvcnRHbG9iYWxFcnJvciA9XG4gICAgICAgIFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIHJlcG9ydEVycm9yXG4gICAgICAgICAgPyByZXBvcnRFcnJvclxuICAgICAgICAgIDogZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBcIm9iamVjdFwiID09PSB0eXBlb2Ygd2luZG93ICYmXG4gICAgICAgICAgICAgICAgXCJmdW5jdGlvblwiID09PSB0eXBlb2Ygd2luZG93LkVycm9yRXZlbnRcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gbmV3IHdpbmRvdy5FcnJvckV2ZW50KFwiZXJyb3JcIiwge1xuICAgICAgICAgICAgICAgICAgYnViYmxlczogITAsXG4gICAgICAgICAgICAgICAgICBjYW5jZWxhYmxlOiAhMCxcbiAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6XG4gICAgICAgICAgICAgICAgICAgIFwib2JqZWN0XCIgPT09IHR5cGVvZiBlcnJvciAmJlxuICAgICAgICAgICAgICAgICAgICBudWxsICE9PSBlcnJvciAmJlxuICAgICAgICAgICAgICAgICAgICBcInN0cmluZ1wiID09PSB0eXBlb2YgZXJyb3IubWVzc2FnZVxuICAgICAgICAgICAgICAgICAgICAgID8gU3RyaW5nKGVycm9yLm1lc3NhZ2UpXG4gICAgICAgICAgICAgICAgICAgICAgOiBTdHJpbmcoZXJyb3IpLFxuICAgICAgICAgICAgICAgICAgZXJyb3I6IGVycm9yXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYgKCF3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCkpIHJldHVybjtcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChcbiAgICAgICAgICAgICAgICBcIm9iamVjdFwiID09PSB0eXBlb2YgcHJvY2VzcyAmJlxuICAgICAgICAgICAgICAgIFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIHByb2Nlc3MuZW1pdFxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBwcm9jZXNzLmVtaXQoXCJ1bmNhdWdodEV4Y2VwdGlvblwiLCBlcnJvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgfSxcbiAgICAgIGRpZFdhcm5BYm91dE1lc3NhZ2VDaGFubmVsID0gITEsXG4gICAgICBlbnF1ZXVlVGFza0ltcGwgPSBudWxsLFxuICAgICAgYWN0U2NvcGVEZXB0aCA9IDAsXG4gICAgICBkaWRXYXJuTm9Bd2FpdEFjdCA9ICExLFxuICAgICAgaXNGbHVzaGluZyA9ICExLFxuICAgICAgcXVldWVTZXZlcmFsTWljcm90YXNrcyA9XG4gICAgICAgIFwiZnVuY3Rpb25cIiA9PT0gdHlwZW9mIHF1ZXVlTWljcm90YXNrXG4gICAgICAgICAgPyBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgcXVldWVNaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBxdWV1ZU1pY3JvdGFzayhjYWxsYmFjayk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIDogZW5xdWV1ZVRhc2s7XG4gICAgZGVwcmVjYXRlZEFQSXMgPSBPYmplY3QuZnJlZXplKHtcbiAgICAgIF9fcHJvdG9fXzogbnVsbCxcbiAgICAgIGM6IGZ1bmN0aW9uIChzaXplKSB7XG4gICAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZU1lbW9DYWNoZShzaXplKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgZm5OYW1lID0ge1xuICAgICAgbWFwOiBtYXBDaGlsZHJlbixcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIChjaGlsZHJlbiwgZm9yRWFjaEZ1bmMsIGZvckVhY2hDb250ZXh0KSB7XG4gICAgICAgIG1hcENoaWxkcmVuKFxuICAgICAgICAgIGNoaWxkcmVuLFxuICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZvckVhY2hGdW5jLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmb3JFYWNoQ29udGV4dFxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIGNvdW50OiBmdW5jdGlvbiAoY2hpbGRyZW4pIHtcbiAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICBtYXBDaGlsZHJlbihjaGlsZHJlbiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIG4rKztcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuO1xuICAgICAgfSxcbiAgICAgIHRvQXJyYXk6IGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIG1hcENoaWxkcmVuKGNoaWxkcmVuLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgICAgIHJldHVybiBjaGlsZDtcbiAgICAgICAgICB9KSB8fCBbXVxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIG9ubHk6IGZ1bmN0aW9uIChjaGlsZHJlbikge1xuICAgICAgICBpZiAoIWlzVmFsaWRFbGVtZW50KGNoaWxkcmVuKSlcbiAgICAgICAgICB0aHJvdyBFcnJvcihcbiAgICAgICAgICAgIFwiUmVhY3QuQ2hpbGRyZW4ub25seSBleHBlY3RlZCB0byByZWNlaXZlIGEgc2luZ2xlIFJlYWN0IGVsZW1lbnQgY2hpbGQuXCJcbiAgICAgICAgICApO1xuICAgICAgICByZXR1cm4gY2hpbGRyZW47XG4gICAgICB9XG4gICAgfTtcbiAgICBleHBvcnRzLkFjdGl2aXR5ID0gUkVBQ1RfQUNUSVZJVFlfVFlQRTtcbiAgICBleHBvcnRzLkNoaWxkcmVuID0gZm5OYW1lO1xuICAgIGV4cG9ydHMuQ29tcG9uZW50ID0gQ29tcG9uZW50O1xuICAgIGV4cG9ydHMuRnJhZ21lbnQgPSBSRUFDVF9GUkFHTUVOVF9UWVBFO1xuICAgIGV4cG9ydHMuUHJvZmlsZXIgPSBSRUFDVF9QUk9GSUxFUl9UWVBFO1xuICAgIGV4cG9ydHMuUHVyZUNvbXBvbmVudCA9IFB1cmVDb21wb25lbnQ7XG4gICAgZXhwb3J0cy5TdHJpY3RNb2RlID0gUkVBQ1RfU1RSSUNUX01PREVfVFlQRTtcbiAgICBleHBvcnRzLlN1c3BlbnNlID0gUkVBQ1RfU1VTUEVOU0VfVFlQRTtcbiAgICBleHBvcnRzLl9fQ0xJRU5UX0lOVEVSTkFMU19ET19OT1RfVVNFX09SX1dBUk5fVVNFUlNfVEhFWV9DQU5OT1RfVVBHUkFERSA9XG4gICAgICBSZWFjdFNoYXJlZEludGVybmFscztcbiAgICBleHBvcnRzLl9fQ09NUElMRVJfUlVOVElNRSA9IGRlcHJlY2F0ZWRBUElzO1xuICAgIGV4cG9ydHMuYWN0ID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICB2YXIgcHJldkFjdFF1ZXVlID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuYWN0UXVldWUsXG4gICAgICAgIHByZXZBY3RTY29wZURlcHRoID0gYWN0U2NvcGVEZXB0aDtcbiAgICAgIGFjdFNjb3BlRGVwdGgrKztcbiAgICAgIHZhciBxdWV1ZSA9IChSZWFjdFNoYXJlZEludGVybmFscy5hY3RRdWV1ZSA9XG4gICAgICAgICAgbnVsbCAhPT0gcHJldkFjdFF1ZXVlID8gcHJldkFjdFF1ZXVlIDogW10pLFxuICAgICAgICBkaWRBd2FpdEFjdENhbGwgPSAhMTtcbiAgICAgIHRyeSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBjYWxsYmFjaygpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgUmVhY3RTaGFyZWRJbnRlcm5hbHMudGhyb3duRXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgfVxuICAgICAgaWYgKDAgPCBSZWFjdFNoYXJlZEludGVybmFscy50aHJvd25FcnJvcnMubGVuZ3RoKVxuICAgICAgICB0aHJvdyAoXG4gICAgICAgICAgKHBvcEFjdFNjb3BlKHByZXZBY3RRdWV1ZSwgcHJldkFjdFNjb3BlRGVwdGgpLFxuICAgICAgICAgIChjYWxsYmFjayA9IGFnZ3JlZ2F0ZUVycm9ycyhSZWFjdFNoYXJlZEludGVybmFscy50aHJvd25FcnJvcnMpKSxcbiAgICAgICAgICAoUmVhY3RTaGFyZWRJbnRlcm5hbHMudGhyb3duRXJyb3JzLmxlbmd0aCA9IDApLFxuICAgICAgICAgIGNhbGxiYWNrKVxuICAgICAgICApO1xuICAgICAgaWYgKFxuICAgICAgICBudWxsICE9PSByZXN1bHQgJiZcbiAgICAgICAgXCJvYmplY3RcIiA9PT0gdHlwZW9mIHJlc3VsdCAmJlxuICAgICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiByZXN1bHQudGhlblxuICAgICAgKSB7XG4gICAgICAgIHZhciB0aGVuYWJsZSA9IHJlc3VsdDtcbiAgICAgICAgcXVldWVTZXZlcmFsTWljcm90YXNrcyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgZGlkQXdhaXRBY3RDYWxsIHx8XG4gICAgICAgICAgICBkaWRXYXJuTm9Bd2FpdEFjdCB8fFxuICAgICAgICAgICAgKChkaWRXYXJuTm9Bd2FpdEFjdCA9ICEwKSxcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgIFwiWW91IGNhbGxlZCBhY3QoYXN5bmMgKCkgPT4gLi4uKSB3aXRob3V0IGF3YWl0LiBUaGlzIGNvdWxkIGxlYWQgdG8gdW5leHBlY3RlZCB0ZXN0aW5nIGJlaGF2aW91ciwgaW50ZXJsZWF2aW5nIG11bHRpcGxlIGFjdCBjYWxscyBhbmQgbWl4aW5nIHRoZWlyIHNjb3Blcy4gWW91IHNob3VsZCAtIGF3YWl0IGFjdChhc3luYyAoKSA9PiAuLi4pO1wiXG4gICAgICAgICAgICApKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdGhlbjogZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgZGlkQXdhaXRBY3RDYWxsID0gITA7XG4gICAgICAgICAgICB0aGVuYWJsZS50aGVuKFxuICAgICAgICAgICAgICBmdW5jdGlvbiAocmV0dXJuVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBwb3BBY3RTY29wZShwcmV2QWN0UXVldWUsIHByZXZBY3RTY29wZURlcHRoKTtcbiAgICAgICAgICAgICAgICBpZiAoMCA9PT0gcHJldkFjdFNjb3BlRGVwdGgpIHtcbiAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGZsdXNoQWN0UXVldWUocXVldWUpLFxuICAgICAgICAgICAgICAgICAgICAgIGVucXVldWVUYXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWN1cnNpdmVseUZsdXNoQXN5bmNBY3RXb3JrKFxuICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IkMCkge1xuICAgICAgICAgICAgICAgICAgICBSZWFjdFNoYXJlZEludGVybmFscy50aHJvd25FcnJvcnMucHVzaChlcnJvciQwKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIGlmICgwIDwgUmVhY3RTaGFyZWRJbnRlcm5hbHMudGhyb3duRXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX3Rocm93bkVycm9yID0gYWdncmVnYXRlRXJyb3JzKFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9yc1xuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBSZWFjdFNoYXJlZEludGVybmFscy50aHJvd25FcnJvcnMubGVuZ3RoID0gMDtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KF90aHJvd25FcnJvcik7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHJlc29sdmUocmV0dXJuVmFsdWUpO1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBwb3BBY3RTY29wZShwcmV2QWN0UXVldWUsIHByZXZBY3RTY29wZURlcHRoKTtcbiAgICAgICAgICAgICAgICAwIDwgUmVhY3RTaGFyZWRJbnRlcm5hbHMudGhyb3duRXJyb3JzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgPyAoKGVycm9yID0gYWdncmVnYXRlRXJyb3JzKFxuICAgICAgICAgICAgICAgICAgICAgIFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9yc1xuICAgICAgICAgICAgICAgICAgICApKSxcbiAgICAgICAgICAgICAgICAgICAgKFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9ycy5sZW5ndGggPSAwKSxcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKSlcbiAgICAgICAgICAgICAgICAgIDogcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgICB2YXIgcmV0dXJuVmFsdWUkanNjb21wJDAgPSByZXN1bHQ7XG4gICAgICBwb3BBY3RTY29wZShwcmV2QWN0UXVldWUsIHByZXZBY3RTY29wZURlcHRoKTtcbiAgICAgIDAgPT09IHByZXZBY3RTY29wZURlcHRoICYmXG4gICAgICAgIChmbHVzaEFjdFF1ZXVlKHF1ZXVlKSxcbiAgICAgICAgMCAhPT0gcXVldWUubGVuZ3RoICYmXG4gICAgICAgICAgcXVldWVTZXZlcmFsTWljcm90YXNrcyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaWRBd2FpdEFjdENhbGwgfHxcbiAgICAgICAgICAgICAgZGlkV2Fybk5vQXdhaXRBY3QgfHxcbiAgICAgICAgICAgICAgKChkaWRXYXJuTm9Bd2FpdEFjdCA9ICEwKSxcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcbiAgICAgICAgICAgICAgICBcIkEgY29tcG9uZW50IHN1c3BlbmRlZCBpbnNpZGUgYW4gYGFjdGAgc2NvcGUsIGJ1dCB0aGUgYGFjdGAgY2FsbCB3YXMgbm90IGF3YWl0ZWQuIFdoZW4gdGVzdGluZyBSZWFjdCBjb21wb25lbnRzIHRoYXQgZGVwZW5kIG9uIGFzeW5jaHJvbm91cyBkYXRhLCB5b3UgbXVzdCBhd2FpdCB0aGUgcmVzdWx0OlxcblxcbmF3YWl0IGFjdCgoKSA9PiAuLi4pXCJcbiAgICAgICAgICAgICAgKSk7XG4gICAgICAgICAgfSksXG4gICAgICAgIChSZWFjdFNoYXJlZEludGVybmFscy5hY3RRdWV1ZSA9IG51bGwpKTtcbiAgICAgIGlmICgwIDwgUmVhY3RTaGFyZWRJbnRlcm5hbHMudGhyb3duRXJyb3JzLmxlbmd0aClcbiAgICAgICAgdGhyb3cgKFxuICAgICAgICAgICgoY2FsbGJhY2sgPSBhZ2dyZWdhdGVFcnJvcnMoUmVhY3RTaGFyZWRJbnRlcm5hbHMudGhyb3duRXJyb3JzKSksXG4gICAgICAgICAgKFJlYWN0U2hhcmVkSW50ZXJuYWxzLnRocm93bkVycm9ycy5sZW5ndGggPSAwKSxcbiAgICAgICAgICBjYWxsYmFjaylcbiAgICAgICAgKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBkaWRBd2FpdEFjdENhbGwgPSAhMDtcbiAgICAgICAgICAwID09PSBwcmV2QWN0U2NvcGVEZXB0aFxuICAgICAgICAgICAgPyAoKFJlYWN0U2hhcmVkSW50ZXJuYWxzLmFjdFF1ZXVlID0gcXVldWUpLFxuICAgICAgICAgICAgICBlbnF1ZXVlVGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlY3Vyc2l2ZWx5Rmx1c2hBc3luY0FjdFdvcmsoXG4gICAgICAgICAgICAgICAgICByZXR1cm5WYWx1ZSRqc2NvbXAkMCxcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUsXG4gICAgICAgICAgICAgICAgICByZWplY3RcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9KSlcbiAgICAgICAgICAgIDogcmVzb2x2ZShyZXR1cm5WYWx1ZSRqc2NvbXAkMCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcbiAgICBleHBvcnRzLmNhY2hlID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfTtcbiAgICBleHBvcnRzLmNhY2hlU2lnbmFsID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBleHBvcnRzLmNhcHR1cmVPd25lclN0YWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGdldEN1cnJlbnRTdGFjayA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLmdldEN1cnJlbnRTdGFjaztcbiAgICAgIHJldHVybiBudWxsID09PSBnZXRDdXJyZW50U3RhY2sgPyBudWxsIDogZ2V0Q3VycmVudFN0YWNrKCk7XG4gICAgfTtcbiAgICBleHBvcnRzLmNsb25lRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb25maWcsIGNoaWxkcmVuKSB7XG4gICAgICBpZiAobnVsbCA9PT0gZWxlbWVudCB8fCB2b2lkIDAgPT09IGVsZW1lbnQpXG4gICAgICAgIHRocm93IEVycm9yKFxuICAgICAgICAgIFwiVGhlIGFyZ3VtZW50IG11c3QgYmUgYSBSZWFjdCBlbGVtZW50LCBidXQgeW91IHBhc3NlZCBcIiArXG4gICAgICAgICAgICBlbGVtZW50ICtcbiAgICAgICAgICAgIFwiLlwiXG4gICAgICAgICk7XG4gICAgICB2YXIgcHJvcHMgPSBhc3NpZ24oe30sIGVsZW1lbnQucHJvcHMpLFxuICAgICAgICBrZXkgPSBlbGVtZW50LmtleSxcbiAgICAgICAgb3duZXIgPSBlbGVtZW50Ll9vd25lcjtcbiAgICAgIGlmIChudWxsICE9IGNvbmZpZykge1xuICAgICAgICB2YXIgSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0O1xuICAgICAgICBhOiB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIFwicmVmXCIpICYmXG4gICAgICAgICAgICAoSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0ID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihcbiAgICAgICAgICAgICAgY29uZmlnLFxuICAgICAgICAgICAgICBcInJlZlwiXG4gICAgICAgICAgICApLmdldCkgJiZcbiAgICAgICAgICAgIEpTQ29tcGlsZXJfaW5saW5lX3Jlc3VsdC5pc1JlYWN0V2FybmluZ1xuICAgICAgICAgICkge1xuICAgICAgICAgICAgSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0ID0gITE7XG4gICAgICAgICAgICBicmVhayBhO1xuICAgICAgICAgIH1cbiAgICAgICAgICBKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQgPSB2b2lkIDAgIT09IGNvbmZpZy5yZWY7XG4gICAgICAgIH1cbiAgICAgICAgSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0ICYmIChvd25lciA9IGdldE93bmVyKCkpO1xuICAgICAgICBoYXNWYWxpZEtleShjb25maWcpICYmXG4gICAgICAgICAgKGNoZWNrS2V5U3RyaW5nQ29lcmNpb24oY29uZmlnLmtleSksIChrZXkgPSBcIlwiICsgY29uZmlnLmtleSkpO1xuICAgICAgICBmb3IgKHByb3BOYW1lIGluIGNvbmZpZylcbiAgICAgICAgICAhaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSB8fFxuICAgICAgICAgICAgXCJrZXlcIiA9PT0gcHJvcE5hbWUgfHxcbiAgICAgICAgICAgIFwiX19zZWxmXCIgPT09IHByb3BOYW1lIHx8XG4gICAgICAgICAgICBcIl9fc291cmNlXCIgPT09IHByb3BOYW1lIHx8XG4gICAgICAgICAgICAoXCJyZWZcIiA9PT0gcHJvcE5hbWUgJiYgdm9pZCAwID09PSBjb25maWcucmVmKSB8fFxuICAgICAgICAgICAgKHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV0pO1xuICAgICAgfVxuICAgICAgdmFyIHByb3BOYW1lID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG4gICAgICBpZiAoMSA9PT0gcHJvcE5hbWUpIHByb3BzLmNoaWxkcmVuID0gY2hpbGRyZW47XG4gICAgICBlbHNlIGlmICgxIDwgcHJvcE5hbWUpIHtcbiAgICAgICAgSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0ID0gQXJyYXkocHJvcE5hbWUpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BOYW1lOyBpKyspXG4gICAgICAgICAgSlNDb21waWxlcl9pbmxpbmVfcmVzdWx0W2ldID0gYXJndW1lbnRzW2kgKyAyXTtcbiAgICAgICAgcHJvcHMuY2hpbGRyZW4gPSBKU0NvbXBpbGVyX2lubGluZV9yZXN1bHQ7XG4gICAgICB9XG4gICAgICBwcm9wcyA9IFJlYWN0RWxlbWVudChcbiAgICAgICAgZWxlbWVudC50eXBlLFxuICAgICAgICBrZXksXG4gICAgICAgIHByb3BzLFxuICAgICAgICBvd25lcixcbiAgICAgICAgZWxlbWVudC5fZGVidWdTdGFjayxcbiAgICAgICAgZWxlbWVudC5fZGVidWdUYXNrXG4gICAgICApO1xuICAgICAgZm9yIChrZXkgPSAyOyBrZXkgPCBhcmd1bWVudHMubGVuZ3RoOyBrZXkrKylcbiAgICAgICAgdmFsaWRhdGVDaGlsZEtleXMoYXJndW1lbnRzW2tleV0pO1xuICAgICAgcmV0dXJuIHByb3BzO1xuICAgIH07XG4gICAgZXhwb3J0cy5jcmVhdGVDb250ZXh0ID0gZnVuY3Rpb24gKGRlZmF1bHRWYWx1ZSkge1xuICAgICAgZGVmYXVsdFZhbHVlID0ge1xuICAgICAgICAkJHR5cGVvZjogUkVBQ1RfQ09OVEVYVF9UWVBFLFxuICAgICAgICBfY3VycmVudFZhbHVlOiBkZWZhdWx0VmFsdWUsXG4gICAgICAgIF9jdXJyZW50VmFsdWUyOiBkZWZhdWx0VmFsdWUsXG4gICAgICAgIF90aHJlYWRDb3VudDogMCxcbiAgICAgICAgUHJvdmlkZXI6IG51bGwsXG4gICAgICAgIENvbnN1bWVyOiBudWxsXG4gICAgICB9O1xuICAgICAgZGVmYXVsdFZhbHVlLlByb3ZpZGVyID0gZGVmYXVsdFZhbHVlO1xuICAgICAgZGVmYXVsdFZhbHVlLkNvbnN1bWVyID0ge1xuICAgICAgICAkJHR5cGVvZjogUkVBQ1RfQ09OU1VNRVJfVFlQRSxcbiAgICAgICAgX2NvbnRleHQ6IGRlZmF1bHRWYWx1ZVxuICAgICAgfTtcbiAgICAgIGRlZmF1bHRWYWx1ZS5fY3VycmVudFJlbmRlcmVyID0gbnVsbDtcbiAgICAgIGRlZmF1bHRWYWx1ZS5fY3VycmVudFJlbmRlcmVyMiA9IG51bGw7XG4gICAgICByZXR1cm4gZGVmYXVsdFZhbHVlO1xuICAgIH07XG4gICAgZXhwb3J0cy5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKHR5cGUsIGNvbmZpZywgY2hpbGRyZW4pIHtcbiAgICAgIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxuICAgICAgICB2YWxpZGF0ZUNoaWxkS2V5cyhhcmd1bWVudHNbaV0pO1xuICAgICAgaSA9IHt9O1xuICAgICAgdmFyIGtleSA9IG51bGw7XG4gICAgICBpZiAobnVsbCAhPSBjb25maWcpXG4gICAgICAgIGZvciAocHJvcE5hbWUgaW4gKGRpZFdhcm5BYm91dE9sZEpTWFJ1bnRpbWUgfHxcbiAgICAgICAgICAhKFwiX19zZWxmXCIgaW4gY29uZmlnKSB8fFxuICAgICAgICAgIFwia2V5XCIgaW4gY29uZmlnIHx8XG4gICAgICAgICAgKChkaWRXYXJuQWJvdXRPbGRKU1hSdW50aW1lID0gITApLFxuICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgIFwiWW91ciBhcHAgKG9yIG9uZSBvZiBpdHMgZGVwZW5kZW5jaWVzKSBpcyB1c2luZyBhbiBvdXRkYXRlZCBKU1ggdHJhbnNmb3JtLiBVcGRhdGUgdG8gdGhlIG1vZGVybiBKU1ggdHJhbnNmb3JtIGZvciBmYXN0ZXIgcGVyZm9ybWFuY2U6IGh0dHBzOi8vcmVhY3QuZGV2L2xpbmsvbmV3LWpzeC10cmFuc2Zvcm1cIlxuICAgICAgICAgICkpLFxuICAgICAgICBoYXNWYWxpZEtleShjb25maWcpICYmXG4gICAgICAgICAgKGNoZWNrS2V5U3RyaW5nQ29lcmNpb24oY29uZmlnLmtleSksIChrZXkgPSBcIlwiICsgY29uZmlnLmtleSkpLFxuICAgICAgICBjb25maWcpKVxuICAgICAgICAgIGhhc093blByb3BlcnR5LmNhbGwoY29uZmlnLCBwcm9wTmFtZSkgJiZcbiAgICAgICAgICAgIFwia2V5XCIgIT09IHByb3BOYW1lICYmXG4gICAgICAgICAgICBcIl9fc2VsZlwiICE9PSBwcm9wTmFtZSAmJlxuICAgICAgICAgICAgXCJfX3NvdXJjZVwiICE9PSBwcm9wTmFtZSAmJlxuICAgICAgICAgICAgKGlbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXSk7XG4gICAgICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgICAgIGlmICgxID09PSBjaGlsZHJlbkxlbmd0aCkgaS5jaGlsZHJlbiA9IGNoaWxkcmVuO1xuICAgICAgZWxzZSBpZiAoMSA8IGNoaWxkcmVuTGVuZ3RoKSB7XG4gICAgICAgIGZvciAoXG4gICAgICAgICAgdmFyIGNoaWxkQXJyYXkgPSBBcnJheShjaGlsZHJlbkxlbmd0aCksIF9pID0gMDtcbiAgICAgICAgICBfaSA8IGNoaWxkcmVuTGVuZ3RoO1xuICAgICAgICAgIF9pKytcbiAgICAgICAgKVxuICAgICAgICAgIGNoaWxkQXJyYXlbX2ldID0gYXJndW1lbnRzW19pICsgMl07XG4gICAgICAgIE9iamVjdC5mcmVlemUgJiYgT2JqZWN0LmZyZWV6ZShjaGlsZEFycmF5KTtcbiAgICAgICAgaS5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gICAgICB9XG4gICAgICBpZiAodHlwZSAmJiB0eXBlLmRlZmF1bHRQcm9wcylcbiAgICAgICAgZm9yIChwcm9wTmFtZSBpbiAoKGNoaWxkcmVuTGVuZ3RoID0gdHlwZS5kZWZhdWx0UHJvcHMpLCBjaGlsZHJlbkxlbmd0aCkpXG4gICAgICAgICAgdm9pZCAwID09PSBpW3Byb3BOYW1lXSAmJiAoaVtwcm9wTmFtZV0gPSBjaGlsZHJlbkxlbmd0aFtwcm9wTmFtZV0pO1xuICAgICAga2V5ICYmXG4gICAgICAgIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKFxuICAgICAgICAgIGksXG4gICAgICAgICAgXCJmdW5jdGlvblwiID09PSB0eXBlb2YgdHlwZVxuICAgICAgICAgICAgPyB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSB8fCBcIlVua25vd25cIlxuICAgICAgICAgICAgOiB0eXBlXG4gICAgICAgICk7XG4gICAgICB2YXIgcHJvcE5hbWUgPSAxZTQgPiBSZWFjdFNoYXJlZEludGVybmFscy5yZWNlbnRseUNyZWF0ZWRPd25lclN0YWNrcysrO1xuICAgICAgcmV0dXJuIFJlYWN0RWxlbWVudChcbiAgICAgICAgdHlwZSxcbiAgICAgICAga2V5LFxuICAgICAgICBpLFxuICAgICAgICBnZXRPd25lcigpLFxuICAgICAgICBwcm9wTmFtZSA/IEVycm9yKFwicmVhY3Qtc3RhY2stdG9wLWZyYW1lXCIpIDogdW5rbm93bk93bmVyRGVidWdTdGFjayxcbiAgICAgICAgcHJvcE5hbWUgPyBjcmVhdGVUYXNrKGdldFRhc2tOYW1lKHR5cGUpKSA6IHVua25vd25Pd25lckRlYnVnVGFza1xuICAgICAgKTtcbiAgICB9O1xuICAgIGV4cG9ydHMuY3JlYXRlUmVmID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHJlZk9iamVjdCA9IHsgY3VycmVudDogbnVsbCB9O1xuICAgICAgT2JqZWN0LnNlYWwocmVmT2JqZWN0KTtcbiAgICAgIHJldHVybiByZWZPYmplY3Q7XG4gICAgfTtcbiAgICBleHBvcnRzLmZvcndhcmRSZWYgPSBmdW5jdGlvbiAocmVuZGVyKSB7XG4gICAgICBudWxsICE9IHJlbmRlciAmJiByZW5kZXIuJCR0eXBlb2YgPT09IFJFQUNUX01FTU9fVFlQRVxuICAgICAgICA/IGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICBcImZvcndhcmRSZWYgcmVxdWlyZXMgYSByZW5kZXIgZnVuY3Rpb24gYnV0IHJlY2VpdmVkIGEgYG1lbW9gIGNvbXBvbmVudC4gSW5zdGVhZCBvZiBmb3J3YXJkUmVmKG1lbW8oLi4uKSksIHVzZSBtZW1vKGZvcndhcmRSZWYoLi4uKSkuXCJcbiAgICAgICAgICApXG4gICAgICAgIDogXCJmdW5jdGlvblwiICE9PSB0eXBlb2YgcmVuZGVyXG4gICAgICAgICAgPyBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICBcImZvcndhcmRSZWYgcmVxdWlyZXMgYSByZW5kZXIgZnVuY3Rpb24gYnV0IHdhcyBnaXZlbiAlcy5cIixcbiAgICAgICAgICAgICAgbnVsbCA9PT0gcmVuZGVyID8gXCJudWxsXCIgOiB0eXBlb2YgcmVuZGVyXG4gICAgICAgICAgICApXG4gICAgICAgICAgOiAwICE9PSByZW5kZXIubGVuZ3RoICYmXG4gICAgICAgICAgICAyICE9PSByZW5kZXIubGVuZ3RoICYmXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICBcImZvcndhcmRSZWYgcmVuZGVyIGZ1bmN0aW9ucyBhY2NlcHQgZXhhY3RseSB0d28gcGFyYW1ldGVyczogcHJvcHMgYW5kIHJlZi4gJXNcIixcbiAgICAgICAgICAgICAgMSA9PT0gcmVuZGVyLmxlbmd0aFxuICAgICAgICAgICAgICAgID8gXCJEaWQgeW91IGZvcmdldCB0byB1c2UgdGhlIHJlZiBwYXJhbWV0ZXI/XCJcbiAgICAgICAgICAgICAgICA6IFwiQW55IGFkZGl0aW9uYWwgcGFyYW1ldGVyIHdpbGwgYmUgdW5kZWZpbmVkLlwiXG4gICAgICAgICAgICApO1xuICAgICAgbnVsbCAhPSByZW5kZXIgJiZcbiAgICAgICAgbnVsbCAhPSByZW5kZXIuZGVmYXVsdFByb3BzICYmXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgXCJmb3J3YXJkUmVmIHJlbmRlciBmdW5jdGlvbnMgZG8gbm90IHN1cHBvcnQgZGVmYXVsdFByb3BzLiBEaWQgeW91IGFjY2lkZW50YWxseSBwYXNzIGEgUmVhY3QgY29tcG9uZW50P1wiXG4gICAgICAgICk7XG4gICAgICB2YXIgZWxlbWVudFR5cGUgPSB7ICQkdHlwZW9mOiBSRUFDVF9GT1JXQVJEX1JFRl9UWVBFLCByZW5kZXI6IHJlbmRlciB9LFxuICAgICAgICBvd25OYW1lO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnRUeXBlLCBcImRpc3BsYXlOYW1lXCIsIHtcbiAgICAgICAgZW51bWVyYWJsZTogITEsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogITAsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBvd25OYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgb3duTmFtZSA9IG5hbWU7XG4gICAgICAgICAgcmVuZGVyLm5hbWUgfHxcbiAgICAgICAgICAgIHJlbmRlci5kaXNwbGF5TmFtZSB8fFxuICAgICAgICAgICAgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZW5kZXIsIFwibmFtZVwiLCB7IHZhbHVlOiBuYW1lIH0pLFxuICAgICAgICAgICAgKHJlbmRlci5kaXNwbGF5TmFtZSA9IG5hbWUpKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gZWxlbWVudFR5cGU7XG4gICAgfTtcbiAgICBleHBvcnRzLmlzVmFsaWRFbGVtZW50ID0gaXNWYWxpZEVsZW1lbnQ7XG4gICAgZXhwb3J0cy5sYXp5ID0gZnVuY3Rpb24gKGN0b3IpIHtcbiAgICAgIGN0b3IgPSB7IF9zdGF0dXM6IC0xLCBfcmVzdWx0OiBjdG9yIH07XG4gICAgICB2YXIgbGF6eVR5cGUgPSB7XG4gICAgICAgICAgJCR0eXBlb2Y6IFJFQUNUX0xBWllfVFlQRSxcbiAgICAgICAgICBfcGF5bG9hZDogY3RvcixcbiAgICAgICAgICBfaW5pdDogbGF6eUluaXRpYWxpemVyXG4gICAgICAgIH0sXG4gICAgICAgIGlvSW5mbyA9IHtcbiAgICAgICAgICBuYW1lOiBcImxhenlcIixcbiAgICAgICAgICBzdGFydDogLTEsXG4gICAgICAgICAgZW5kOiAtMSxcbiAgICAgICAgICB2YWx1ZTogbnVsbCxcbiAgICAgICAgICBvd25lcjogbnVsbCxcbiAgICAgICAgICBkZWJ1Z1N0YWNrOiBFcnJvcihcInJlYWN0LXN0YWNrLXRvcC1mcmFtZVwiKSxcbiAgICAgICAgICBkZWJ1Z1Rhc2s6IGNvbnNvbGUuY3JlYXRlVGFzayA/IGNvbnNvbGUuY3JlYXRlVGFzayhcImxhenkoKVwiKSA6IG51bGxcbiAgICAgICAgfTtcbiAgICAgIGN0b3IuX2lvSW5mbyA9IGlvSW5mbztcbiAgICAgIGxhenlUeXBlLl9kZWJ1Z0luZm8gPSBbeyBhd2FpdGVkOiBpb0luZm8gfV07XG4gICAgICByZXR1cm4gbGF6eVR5cGU7XG4gICAgfTtcbiAgICBleHBvcnRzLm1lbW8gPSBmdW5jdGlvbiAodHlwZSwgY29tcGFyZSkge1xuICAgICAgbnVsbCA9PSB0eXBlICYmXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgXCJtZW1vOiBUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBhIGNvbXBvbmVudC4gSW5zdGVhZCByZWNlaXZlZDogJXNcIixcbiAgICAgICAgICBudWxsID09PSB0eXBlID8gXCJudWxsXCIgOiB0eXBlb2YgdHlwZVxuICAgICAgICApO1xuICAgICAgY29tcGFyZSA9IHtcbiAgICAgICAgJCR0eXBlb2Y6IFJFQUNUX01FTU9fVFlQRSxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgY29tcGFyZTogdm9pZCAwID09PSBjb21wYXJlID8gbnVsbCA6IGNvbXBhcmVcbiAgICAgIH07XG4gICAgICB2YXIgb3duTmFtZTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjb21wYXJlLCBcImRpc3BsYXlOYW1lXCIsIHtcbiAgICAgICAgZW51bWVyYWJsZTogITEsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogITAsXG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBvd25OYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgb3duTmFtZSA9IG5hbWU7XG4gICAgICAgICAgdHlwZS5uYW1lIHx8XG4gICAgICAgICAgICB0eXBlLmRpc3BsYXlOYW1lIHx8XG4gICAgICAgICAgICAoT2JqZWN0LmRlZmluZVByb3BlcnR5KHR5cGUsIFwibmFtZVwiLCB7IHZhbHVlOiBuYW1lIH0pLFxuICAgICAgICAgICAgKHR5cGUuZGlzcGxheU5hbWUgPSBuYW1lKSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNvbXBhcmU7XG4gICAgfTtcbiAgICBleHBvcnRzLnN0YXJ0VHJhbnNpdGlvbiA9IGZ1bmN0aW9uIChzY29wZSkge1xuICAgICAgdmFyIHByZXZUcmFuc2l0aW9uID0gUmVhY3RTaGFyZWRJbnRlcm5hbHMuVCxcbiAgICAgICAgY3VycmVudFRyYW5zaXRpb24gPSB7fTtcbiAgICAgIGN1cnJlbnRUcmFuc2l0aW9uLl91cGRhdGVkRmliZXJzID0gbmV3IFNldCgpO1xuICAgICAgUmVhY3RTaGFyZWRJbnRlcm5hbHMuVCA9IGN1cnJlbnRUcmFuc2l0aW9uO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFyIHJldHVyblZhbHVlID0gc2NvcGUoKSxcbiAgICAgICAgICBvblN0YXJ0VHJhbnNpdGlvbkZpbmlzaCA9IFJlYWN0U2hhcmVkSW50ZXJuYWxzLlM7XG4gICAgICAgIG51bGwgIT09IG9uU3RhcnRUcmFuc2l0aW9uRmluaXNoICYmXG4gICAgICAgICAgb25TdGFydFRyYW5zaXRpb25GaW5pc2goY3VycmVudFRyYW5zaXRpb24sIHJldHVyblZhbHVlKTtcbiAgICAgICAgXCJvYmplY3RcIiA9PT0gdHlwZW9mIHJldHVyblZhbHVlICYmXG4gICAgICAgICAgbnVsbCAhPT0gcmV0dXJuVmFsdWUgJiZcbiAgICAgICAgICBcImZ1bmN0aW9uXCIgPT09IHR5cGVvZiByZXR1cm5WYWx1ZS50aGVuICYmXG4gICAgICAgICAgKFJlYWN0U2hhcmVkSW50ZXJuYWxzLmFzeW5jVHJhbnNpdGlvbnMrKyxcbiAgICAgICAgICByZXR1cm5WYWx1ZS50aGVuKHJlbGVhc2VBc3luY1RyYW5zaXRpb24sIHJlbGVhc2VBc3luY1RyYW5zaXRpb24pLFxuICAgICAgICAgIHJldHVyblZhbHVlLnRoZW4obm9vcCwgcmVwb3J0R2xvYmFsRXJyb3IpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJlcG9ydEdsb2JhbEVycm9yKGVycm9yKTtcbiAgICAgIH0gZmluYWxseSB7XG4gICAgICAgIG51bGwgPT09IHByZXZUcmFuc2l0aW9uICYmXG4gICAgICAgICAgY3VycmVudFRyYW5zaXRpb24uX3VwZGF0ZWRGaWJlcnMgJiZcbiAgICAgICAgICAoKHNjb3BlID0gY3VycmVudFRyYW5zaXRpb24uX3VwZGF0ZWRGaWJlcnMuc2l6ZSksXG4gICAgICAgICAgY3VycmVudFRyYW5zaXRpb24uX3VwZGF0ZWRGaWJlcnMuY2xlYXIoKSxcbiAgICAgICAgICAxMCA8IHNjb3BlICYmXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgIFwiRGV0ZWN0ZWQgYSBsYXJnZSBudW1iZXIgb2YgdXBkYXRlcyBpbnNpZGUgc3RhcnRUcmFuc2l0aW9uLiBJZiB0aGlzIGlzIGR1ZSB0byBhIHN1YnNjcmlwdGlvbiBwbGVhc2UgcmUtd3JpdGUgaXQgdG8gdXNlIFJlYWN0IHByb3ZpZGVkIGhvb2tzLiBPdGhlcndpc2UgY29uY3VycmVudCBtb2RlIGd1YXJhbnRlZXMgYXJlIG9mZiB0aGUgdGFibGUuXCJcbiAgICAgICAgICAgICkpLFxuICAgICAgICAgIG51bGwgIT09IHByZXZUcmFuc2l0aW9uICYmXG4gICAgICAgICAgICBudWxsICE9PSBjdXJyZW50VHJhbnNpdGlvbi50eXBlcyAmJlxuICAgICAgICAgICAgKG51bGwgIT09IHByZXZUcmFuc2l0aW9uLnR5cGVzICYmXG4gICAgICAgICAgICAgIHByZXZUcmFuc2l0aW9uLnR5cGVzICE9PSBjdXJyZW50VHJhbnNpdGlvbi50eXBlcyAmJlxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAgIFwiV2UgZXhwZWN0ZWQgaW5uZXIgVHJhbnNpdGlvbnMgdG8gaGF2ZSB0cmFuc2ZlcnJlZCB0aGUgb3V0ZXIgdHlwZXMgc2V0IGFuZCB0aGF0IHlvdSBjYW5ub3QgYWRkIHRvIHRoZSBvdXRlciBUcmFuc2l0aW9uIHdoaWxlIGluc2lkZSB0aGUgaW5uZXIuVGhpcyBpcyBhIGJ1ZyBpbiBSZWFjdC5cIlxuICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgKHByZXZUcmFuc2l0aW9uLnR5cGVzID0gY3VycmVudFRyYW5zaXRpb24udHlwZXMpKSxcbiAgICAgICAgICAoUmVhY3RTaGFyZWRJbnRlcm5hbHMuVCA9IHByZXZUcmFuc2l0aW9uKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIGV4cG9ydHMudW5zdGFibGVfdXNlQ2FjaGVSZWZyZXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlQ2FjaGVSZWZyZXNoKCk7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZSA9IGZ1bmN0aW9uICh1c2FibGUpIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZSh1c2FibGUpO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2VBY3Rpb25TdGF0ZSA9IGZ1bmN0aW9uIChhY3Rpb24sIGluaXRpYWxTdGF0ZSwgcGVybWFsaW5rKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZURpc3BhdGNoZXIoKS51c2VBY3Rpb25TdGF0ZShcbiAgICAgICAgYWN0aW9uLFxuICAgICAgICBpbml0aWFsU3RhdGUsXG4gICAgICAgIHBlcm1hbGlua1xuICAgICAgKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudXNlQ2FsbGJhY2sgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGRlcHMpIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZUNhbGxiYWNrKGNhbGxiYWNrLCBkZXBzKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudXNlQ29udGV4dCA9IGZ1bmN0aW9uIChDb250ZXh0KSB7XG4gICAgICB2YXIgZGlzcGF0Y2hlciA9IHJlc29sdmVEaXNwYXRjaGVyKCk7XG4gICAgICBDb250ZXh0LiQkdHlwZW9mID09PSBSRUFDVF9DT05TVU1FUl9UWVBFICYmXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgXCJDYWxsaW5nIHVzZUNvbnRleHQoQ29udGV4dC5Db25zdW1lcikgaXMgbm90IHN1cHBvcnRlZCBhbmQgd2lsbCBjYXVzZSBidWdzLiBEaWQgeW91IG1lYW4gdG8gY2FsbCB1c2VDb250ZXh0KENvbnRleHQpIGluc3RlYWQ/XCJcbiAgICAgICAgKTtcbiAgICAgIHJldHVybiBkaXNwYXRjaGVyLnVzZUNvbnRleHQoQ29udGV4dCk7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZURlYnVnVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUsIGZvcm1hdHRlckZuKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZURpc3BhdGNoZXIoKS51c2VEZWJ1Z1ZhbHVlKHZhbHVlLCBmb3JtYXR0ZXJGbik7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZURlZmVycmVkVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUsIGluaXRpYWxWYWx1ZSkge1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlRGVmZXJyZWRWYWx1ZSh2YWx1ZSwgaW5pdGlhbFZhbHVlKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudXNlRWZmZWN0ID0gZnVuY3Rpb24gKGNyZWF0ZSwgZGVwcykge1xuICAgICAgbnVsbCA9PSBjcmVhdGUgJiZcbiAgICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICAgIFwiUmVhY3QgSG9vayB1c2VFZmZlY3QgcmVxdWlyZXMgYW4gZWZmZWN0IGNhbGxiYWNrLiBEaWQgeW91IGZvcmdldCB0byBwYXNzIGEgY2FsbGJhY2sgdG8gdGhlIGhvb2s/XCJcbiAgICAgICAgKTtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZUVmZmVjdChjcmVhdGUsIGRlcHMpO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2VFZmZlY3RFdmVudCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlRWZmZWN0RXZlbnQoY2FsbGJhY2spO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2VJZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZUlkKCk7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZUltcGVyYXRpdmVIYW5kbGUgPSBmdW5jdGlvbiAocmVmLCBjcmVhdGUsIGRlcHMpIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCBjcmVhdGUsIGRlcHMpO1xuICAgIH07XG4gICAgZXhwb3J0cy51c2VJbnNlcnRpb25FZmZlY3QgPSBmdW5jdGlvbiAoY3JlYXRlLCBkZXBzKSB7XG4gICAgICBudWxsID09IGNyZWF0ZSAmJlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgXCJSZWFjdCBIb29rIHVzZUluc2VydGlvbkVmZmVjdCByZXF1aXJlcyBhbiBlZmZlY3QgY2FsbGJhY2suIERpZCB5b3UgZm9yZ2V0IHRvIHBhc3MgYSBjYWxsYmFjayB0byB0aGUgaG9vaz9cIlxuICAgICAgICApO1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlSW5zZXJ0aW9uRWZmZWN0KGNyZWF0ZSwgZGVwcyk7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZUxheW91dEVmZmVjdCA9IGZ1bmN0aW9uIChjcmVhdGUsIGRlcHMpIHtcbiAgICAgIG51bGwgPT0gY3JlYXRlICYmXG4gICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICBcIlJlYWN0IEhvb2sgdXNlTGF5b3V0RWZmZWN0IHJlcXVpcmVzIGFuIGVmZmVjdCBjYWxsYmFjay4gRGlkIHlvdSBmb3JnZXQgdG8gcGFzcyBhIGNhbGxiYWNrIHRvIHRoZSBob29rP1wiXG4gICAgICAgICk7XG4gICAgICByZXR1cm4gcmVzb2x2ZURpc3BhdGNoZXIoKS51c2VMYXlvdXRFZmZlY3QoY3JlYXRlLCBkZXBzKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudXNlTWVtbyA9IGZ1bmN0aW9uIChjcmVhdGUsIGRlcHMpIHtcbiAgICAgIHJldHVybiByZXNvbHZlRGlzcGF0Y2hlcigpLnVzZU1lbW8oY3JlYXRlLCBkZXBzKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudXNlT3B0aW1pc3RpYyA9IGZ1bmN0aW9uIChwYXNzdGhyb3VnaCwgcmVkdWNlcikge1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlT3B0aW1pc3RpYyhwYXNzdGhyb3VnaCwgcmVkdWNlcik7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZVJlZHVjZXIgPSBmdW5jdGlvbiAocmVkdWNlciwgaW5pdGlhbEFyZywgaW5pdCkge1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlUmVkdWNlcihyZWR1Y2VyLCBpbml0aWFsQXJnLCBpbml0KTtcbiAgICB9O1xuICAgIGV4cG9ydHMudXNlUmVmID0gZnVuY3Rpb24gKGluaXRpYWxWYWx1ZSkge1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlUmVmKGluaXRpYWxWYWx1ZSk7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZVN0YXRlID0gZnVuY3Rpb24gKGluaXRpYWxTdGF0ZSkge1xuICAgICAgcmV0dXJuIHJlc29sdmVEaXNwYXRjaGVyKCkudXNlU3RhdGUoaW5pdGlhbFN0YXRlKTtcbiAgICB9O1xuICAgIGV4cG9ydHMudXNlU3luY0V4dGVybmFsU3RvcmUgPSBmdW5jdGlvbiAoXG4gICAgICBzdWJzY3JpYmUsXG4gICAgICBnZXRTbmFwc2hvdCxcbiAgICAgIGdldFNlcnZlclNuYXBzaG90XG4gICAgKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZURpc3BhdGNoZXIoKS51c2VTeW5jRXh0ZXJuYWxTdG9yZShcbiAgICAgICAgc3Vic2NyaWJlLFxuICAgICAgICBnZXRTbmFwc2hvdCxcbiAgICAgICAgZ2V0U2VydmVyU25hcHNob3RcbiAgICAgICk7XG4gICAgfTtcbiAgICBleHBvcnRzLnVzZVRyYW5zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZURpc3BhdGNoZXIoKS51c2VUcmFuc2l0aW9uKCk7XG4gICAgfTtcbiAgICBleHBvcnRzLnZlcnNpb24gPSBcIjE5LjIuOFwiO1xuICAgIFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiBfX1JFQUNUX0RFVlRPT0xTX0dMT0JBTF9IT09LX18gJiZcbiAgICAgIFwiZnVuY3Rpb25cIiA9PT1cbiAgICAgICAgdHlwZW9mIF9fUkVBQ1RfREVWVE9PTFNfR0xPQkFMX0hPT0tfXy5yZWdpc3RlckludGVybmFsTW9kdWxlU3RvcCAmJlxuICAgICAgX19SRUFDVF9ERVZUT09MU19HTE9CQUxfSE9PS19fLnJlZ2lzdGVySW50ZXJuYWxNb2R1bGVTdG9wKEVycm9yKCkpO1xuICB9KSgpO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdwcm9kdWN0aW9uJykge1xuICBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vY2pzL3JlYWN0LnByb2R1Y3Rpb24uanMnKTtcbn0gZWxzZSB7XG4gIG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9janMvcmVhY3QuZGV2ZWxvcG1lbnQuanMnKTtcbn1cbiIsIid1c2Ugc3RyaWN0J1xuXG5jbGFzcyBOb2RlIHtcbiAgY29uc3RydWN0b3IgKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhXG4gIH1cbn1cblxuY2xhc3MgTGlua2VkTGlzdCB7XG4gIGNvbnN0cnVjdG9yICgpIHtcbiAgICB0aGlzLmxlbmd0aCA9IDBcbiAgfVxuXG4gIGVucXVldWUgKGRhdGEpIHtcbiAgICBjb25zdCBub2RlID0gbmV3IE5vZGUoZGF0YSlcbiAgICBub2RlLnByZXYgPSB0aGlzLnRhaWxcbiAgICBpZiAodGhpcy50YWlsKSB0aGlzLnRhaWwubmV4dCA9IG5vZGVcbiAgICBlbHNlIHRoaXMuaGVhZCA9IG5vZGVcbiAgICB0aGlzLnRhaWwgPSBub2RlXG4gICAgdGhpcy5sZW5ndGgrK1xuICAgIHJldHVybiBub2RlXG4gIH1cblxuICBkZXF1ZXVlICgpIHtcbiAgICBpZiAoIXRoaXMuaGVhZCkgcmV0dXJuXG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzLmhlYWRcbiAgICB0aGlzLnJlbW92ZSh0aGlzLmhlYWQpXG4gICAgcmV0dXJuIGRhdGFcbiAgfVxuXG4gIHJlbW92ZSAobm9kZSkge1xuICAgIGlmIChub2RlLnByZXYpIG5vZGUucHJldi5uZXh0ID0gbm9kZS5uZXh0XG4gICAgZWxzZSB0aGlzLmhlYWQgPSBub2RlLm5leHRcbiAgICBpZiAobm9kZS5uZXh0KSBub2RlLm5leHQucHJldiA9IG5vZGUucHJldlxuICAgIGVsc2UgdGhpcy50YWlsID0gbm9kZS5wcmV2XG4gICAgdGhpcy5sZW5ndGgtLVxuICB9XG5cbiAgc2l6ZSAoKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoXG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSAoc2xvdHMgPSAxKSA9PiB7XG4gIGNvbnN0IHF1ZXVlID0gbmV3IExpbmtlZExpc3QoKVxuXG4gIGNvbnN0IHJlbGVhc2UgPSAoKSA9PiB7XG4gICAgKytzbG90c1xuICAgIGNvbnN0IHdhaXRlciA9IHF1ZXVlLmRlcXVldWUoKVxuICAgIGlmICh3YWl0ZXIpIHJldHVybiB3YWl0ZXIuYWNxdWlyZSgpXG4gIH1cblxuICBjb25zdCBhY3F1aXJlID0gcmVzb2x2ZSA9PiB7XG4gICAgLS1zbG90c1xuICAgIHJlc29sdmUocmVsZWFzZSlcbiAgfVxuXG4gIGNvbnN0IGxvY2sgPSBzaWduYWwgPT5cbiAgICBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGlmIChzaWduYWwgIT0gbnVsbCAmJiB0eXBlb2Ygc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignYHNpZ25hbGAgbmVlZHMgdG8gYmUgYW4gQWJvcnRTaWduYWwuJylcbiAgICAgIH1cbiAgICAgIGlmIChzaWduYWw/LmFib3J0ZWQpIHJldHVybiByZXNvbHZlKG51bGwpXG4gICAgICBpZiAoIWxvY2suaXNMb2NrZWQoKSkgcmV0dXJuIGFjcXVpcmUocmVzb2x2ZSlcblxuICAgICAgY29uc3Qgd2FpdGVyID0geyBhY3F1aXJlOiAoKSA9PiBhY3F1aXJlKHJlc29sdmUpIH1cbiAgICAgIGNvbnN0IG5vZGUgPSBxdWV1ZS5lbnF1ZXVlKHdhaXRlcilcblxuICAgICAgaWYgKHNpZ25hbCAhPSBudWxsKSB7XG4gICAgICAgIGNvbnN0IG9uQWJvcnQgPSAoKSA9PiB7XG4gICAgICAgICAgcXVldWUucmVtb3ZlKG5vZGUpXG4gICAgICAgICAgcmVzb2x2ZShudWxsKVxuICAgICAgICB9XG4gICAgICAgIHdhaXRlci5hY3F1aXJlID0gKCkgPT4ge1xuICAgICAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpXG4gICAgICAgICAgYWNxdWlyZShyZXNvbHZlKVxuICAgICAgICB9XG4gICAgICAgIHNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQsIHsgb25jZTogdHJ1ZSB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgbG9jay5pc0xvY2tlZCA9ICgpID0+IHNsb3RzID09PSAwXG5cbiAgbG9jay5hd2FpdGluZyA9ICgpID0+IHF1ZXVlLnNpemUoKVxuXG4gIHJldHVybiBsb2NrXG59XG4iLCIndXNlIHN0cmljdCdcblxuY29uc3QgY3JlYXRlTG9jayA9IHJlcXVpcmUoJy4vY3JlYXRlJylcblxuY29uc3Qgd2l0aExvY2sgPSBvcHRzID0+IHtcbiAgY29uc3QgbG9jayA9IGNyZWF0ZUxvY2sob3B0cylcblxuICBjb25zdCB3aXRoTG9jayA9IGFzeW5jIChmbiwgc2lnbmFsKSA9PiB7XG4gICAgY29uc3QgcmVsZWFzZSA9IGF3YWl0IGxvY2soc2lnbmFsKVxuICAgIGlmICghcmVsZWFzZSkgcmV0dXJuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBmbigpXG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHJlbGVhc2UoKVxuICAgIH1cbiAgfVxuXG4gIHdpdGhMb2NrLmlzTG9ja2VkID0gbG9jay5pc0xvY2tlZFxuICB3aXRoTG9jay5hd2FpdGluZyA9IGxvY2suYXdhaXRpbmdcblxuICByZXR1cm4gd2l0aExvY2tcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7IHdpdGhMb2NrLCBjcmVhdGVMb2NrIH1cbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCB7IHdpdGhMb2NrIH0gZnJvbSBcInN1cGVybG9ja1wiO1xuLy8jcmVnaW9uIHNyYy90eXBlcy50c1xuLyoqIE1pZ3JhdGlvbiBlcnJvciBmb3IgdmVyc2lvbiBtaWdyYXRpb25zICovXG52YXIgTWlncmF0aW9uRXJyb3IgPSBjbGFzcyBleHRlbmRzIEVycm9yIHtcblx0a2V5O1xuXHR2ZXJzaW9uO1xuXHRjb25zdHJ1Y3RvcihrZXksIHZlcnNpb24sIG9wdGlvbnMpIHtcblx0XHRzdXBlcihgdiR7dmVyc2lvbn0gbWlncmF0aW9uIGZhaWxlZCBmb3IgXCIke2tleX1cImAsIG9wdGlvbnMpO1xuXHRcdHRoaXMua2V5ID0ga2V5O1xuXHRcdHRoaXMudmVyc2lvbiA9IHZlcnNpb247XG5cdH1cbn07XG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvYnJvd3Nlci50c1xuY29uc3QgZ2xvYmFscyA9IGdsb2JhbFRoaXM7XG5jb25zdCBicm93c2VyID0gZ2xvYmFscy5icm93c2VyID8/IGdsb2JhbHMuY2hyb21lID8/IHt9O1xuLy8jZW5kcmVnaW9uXG4vLyNyZWdpb24gLi4vLi4vbm9kZV9tb2R1bGVzLy5idW4vZGVxdWFsQDIuMC4zL25vZGVfbW9kdWxlcy9kZXF1YWwvbGl0ZS9pbmRleC5tanNcbnZhciBoYXMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuZnVuY3Rpb24gZGVxdWFsKGZvbywgYmFyKSB7XG5cdHZhciBjdG9yLCBsZW47XG5cdGlmIChmb28gPT09IGJhcikgcmV0dXJuIHRydWU7XG5cdGlmIChmb28gJiYgYmFyICYmIChjdG9yID0gZm9vLmNvbnN0cnVjdG9yKSA9PT0gYmFyLmNvbnN0cnVjdG9yKSB7XG5cdFx0aWYgKGN0b3IgPT09IERhdGUpIHJldHVybiBmb28uZ2V0VGltZSgpID09PSBiYXIuZ2V0VGltZSgpO1xuXHRcdGlmIChjdG9yID09PSBSZWdFeHApIHJldHVybiBmb28udG9TdHJpbmcoKSA9PT0gYmFyLnRvU3RyaW5nKCk7XG5cdFx0aWYgKGN0b3IgPT09IEFycmF5KSB7XG5cdFx0XHRpZiAoKGxlbiA9IGZvby5sZW5ndGgpID09PSBiYXIubGVuZ3RoKSB3aGlsZSAobGVuLS0gJiYgZGVxdWFsKGZvb1tsZW5dLCBiYXJbbGVuXSkpO1xuXHRcdFx0cmV0dXJuIGxlbiA9PT0gLTE7XG5cdFx0fVxuXHRcdGlmICghY3RvciB8fCB0eXBlb2YgZm9vID09PSBcIm9iamVjdFwiKSB7XG5cdFx0XHRsZW4gPSAwO1xuXHRcdFx0Zm9yIChjdG9yIGluIGZvbykge1xuXHRcdFx0XHRpZiAoaGFzLmNhbGwoZm9vLCBjdG9yKSAmJiArK2xlbiAmJiAhaGFzLmNhbGwoYmFyLCBjdG9yKSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0XHRpZiAoIShjdG9yIGluIGJhcikgfHwgIWRlcXVhbChmb29bY3Rvcl0sIGJhcltjdG9yXSkpIHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBPYmplY3Qua2V5cyhiYXIpLmxlbmd0aCA9PT0gbGVuO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZm9vICE9PSBmb28gJiYgYmFyICE9PSBiYXI7XG59XG4vLyNlbmRyZWdpb25cbi8vI3JlZ2lvbiBzcmMvc3RvcmFnZS50c1xuLyoqXG4qIFNpbXBsaWZpZWQsIHR5cGUtc2FmZSBzdG9yYWdlIEFQSXMgZm9yIGJyb3dzZXIgZXh0ZW5zaW9ucywgd2l0aCBzdXBwb3J0IGZvclxuKiB2ZXJzaW9uZWQgZmllbGRzLCBzbmFwc2hvdHMsIG1ldGFkYXRhLCBhbmQgaXRlbSBkZWZpbml0aW9ucy5cbipcbiogQG1vZHVsZSB3ZWJleHQtc3RvcmVcbiovXG5jb25zdCBzdG9yYWdlID0gY3JlYXRlU3RvcmFnZSgpO1xuZnVuY3Rpb24gY3JlYXRlU3RvcmFnZSgpIHtcblx0Y29uc3QgZHJpdmVycyA9IHtcblx0XHRsb2NhbDogY3JlYXRlRHJpdmVyKFwibG9jYWxcIiksXG5cdFx0c2Vzc2lvbjogY3JlYXRlRHJpdmVyKFwic2Vzc2lvblwiKSxcblx0XHRzeW5jOiBjcmVhdGVEcml2ZXIoXCJzeW5jXCIpLFxuXHRcdG1hbmFnZWQ6IGNyZWF0ZURyaXZlcihcIm1hbmFnZWRcIilcblx0fTtcblx0Y29uc3QgZ2V0RHJpdmVyID0gKGFyZWEpID0+IHtcblx0XHRjb25zdCBkcml2ZXIgPSBkcml2ZXJzW2FyZWFdO1xuXHRcdGlmIChkcml2ZXIgPT0gbnVsbCkge1xuXHRcdFx0Y29uc3QgYXJlYU5hbWVzID0gT2JqZWN0LmtleXMoZHJpdmVycykuam9pbihcIiwgXCIpO1xuXHRcdFx0dGhyb3cgRXJyb3IoYEludmFsaWQgYXJlYSBcIiR7YXJlYX1cIi4gT3B0aW9uczogJHthcmVhTmFtZXN9YCk7XG5cdFx0fVxuXHRcdHJldHVybiBkcml2ZXI7XG5cdH07XG5cdGNvbnN0IHJlc29sdmVLZXkgPSAoa2V5KSA9PiB7XG5cdFx0Y29uc3QgZGVsaW1pbmF0b3JJbmRleCA9IGtleS5pbmRleE9mKFwiOlwiKTtcblx0XHRjb25zdCBkcml2ZXJBcmVhID0ga2V5LnN1YnN0cmluZygwLCBkZWxpbWluYXRvckluZGV4KTtcblx0XHRjb25zdCBkcml2ZXJLZXkgPSBrZXkuc3Vic3RyaW5nKGRlbGltaW5hdG9ySW5kZXggKyAxKTtcblx0XHRpZiAoZHJpdmVyS2V5ID09IG51bGwpIHRocm93IEVycm9yKGBTdG9yYWdlIGtleSBzaG91bGQgYmUgaW4gdGhlIGZvcm0gb2YgXCJhcmVhOmtleVwiLCBidXQgcmVjZWl2ZWQgXCIke2tleX1cImApO1xuXHRcdHJldHVybiB7XG5cdFx0XHRkcml2ZXJBcmVhLFxuXHRcdFx0ZHJpdmVyS2V5LFxuXHRcdFx0ZHJpdmVyOiBnZXREcml2ZXIoZHJpdmVyQXJlYSlcblx0XHR9O1xuXHR9O1xuXHRjb25zdCBnZXRNZXRhS2V5ID0gKGtleSkgPT4gYCR7a2V5fSRgO1xuXHRjb25zdCBtZXJnZU1ldGEgPSAob2xkTWV0YSwgbmV3TWV0YSkgPT4ge1xuXHRcdGNvbnN0IG5ld0ZpZWxkcyA9IHsgLi4ub2xkTWV0YSB9O1xuXHRcdE9iamVjdC5lbnRyaWVzKG5ld01ldGEpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuXHRcdFx0aWYgKHZhbHVlID09IG51bGwpIGRlbGV0ZSBuZXdGaWVsZHNba2V5XTtcblx0XHRcdGVsc2UgbmV3RmllbGRzW2tleV0gPSB2YWx1ZTtcblx0XHR9KTtcblx0XHRyZXR1cm4gbmV3RmllbGRzO1xuXHR9O1xuXHRjb25zdCBnZXRWYWx1ZU9yRmFsbGJhY2sgPSAodmFsdWUsIGZhbGxiYWNrKSA9PiB2YWx1ZSA/PyBmYWxsYmFjayA/PyBudWxsO1xuXHRjb25zdCBnZXRNZXRhVmFsdWUgPSAocHJvcGVydGllcykgPT4gdHlwZW9mIHByb3BlcnRpZXMgPT09IFwib2JqZWN0XCIgJiYgIUFycmF5LmlzQXJyYXkocHJvcGVydGllcykgPyBwcm9wZXJ0aWVzIDoge307XG5cdGNvbnN0IGdldEl0ZW0gPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpID0+IHtcblx0XHRjb25zdCByZXMgPSBhd2FpdCBkcml2ZXIuZ2V0SXRlbShkcml2ZXJLZXkpO1xuXHRcdHJldHVybiBnZXRWYWx1ZU9yRmFsbGJhY2socmVzLCBvcHRzPy5mYWxsYmFjayk7XG5cdH07XG5cdGNvbnN0IGdldE1ldGEgPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXkpID0+IHtcblx0XHRjb25zdCBtZXRhS2V5ID0gZ2V0TWV0YUtleShkcml2ZXJLZXkpO1xuXHRcdGNvbnN0IHJlcyA9IGF3YWl0IGRyaXZlci5nZXRJdGVtKG1ldGFLZXkpO1xuXHRcdHJldHVybiBnZXRNZXRhVmFsdWUocmVzKTtcblx0fTtcblx0Y29uc3Qgc2V0SXRlbSA9IGFzeW5jIChkcml2ZXIsIGRyaXZlcktleSwgdmFsdWUpID0+IHtcblx0XHRhd2FpdCBkcml2ZXIuc2V0SXRlbShkcml2ZXJLZXksIHZhbHVlID8/IG51bGwpO1xuXHR9O1xuXHRjb25zdCBzZXRNZXRhID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0Y29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcblx0XHRjb25zdCBleGlzdGluZ0ZpZWxkcyA9IGdldE1ldGFWYWx1ZShhd2FpdCBkcml2ZXIuZ2V0SXRlbShtZXRhS2V5KSk7XG5cdFx0YXdhaXQgZHJpdmVyLnNldEl0ZW0obWV0YUtleSwgbWVyZ2VNZXRhKGV4aXN0aW5nRmllbGRzLCBwcm9wZXJ0aWVzKSk7XG5cdH07XG5cdGNvbnN0IHJlbW92ZUl0ZW0gPSBhc3luYyAoZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpID0+IHtcblx0XHRhd2FpdCBkcml2ZXIucmVtb3ZlSXRlbShkcml2ZXJLZXkpO1xuXHRcdGlmIChvcHRzPy5yZW1vdmVNZXRhKSB7XG5cdFx0XHRjb25zdCBtZXRhS2V5ID0gZ2V0TWV0YUtleShkcml2ZXJLZXkpO1xuXHRcdFx0YXdhaXQgZHJpdmVyLnJlbW92ZUl0ZW0obWV0YUtleSk7XG5cdFx0fVxuXHR9O1xuXHRjb25zdCByZW1vdmVNZXRhID0gYXN5bmMgKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0Y29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoZHJpdmVyS2V5KTtcblx0XHRpZiAocHJvcGVydGllcyA9PSBudWxsKSBhd2FpdCBkcml2ZXIucmVtb3ZlSXRlbShtZXRhS2V5KTtcblx0XHRlbHNlIHtcblx0XHRcdGNvbnN0IG5ld0ZpZWxkcyA9IGdldE1ldGFWYWx1ZShhd2FpdCBkcml2ZXIuZ2V0SXRlbShtZXRhS2V5KSk7XG5cdFx0XHRbcHJvcGVydGllc10uZmxhdCgpLmZvckVhY2goKGZpZWxkKSA9PiB7XG5cdFx0XHRcdGRlbGV0ZSBuZXdGaWVsZHNbZmllbGRdO1xuXHRcdFx0fSk7XG5cdFx0XHRhd2FpdCBkcml2ZXIuc2V0SXRlbShtZXRhS2V5LCBuZXdGaWVsZHMpO1xuXHRcdH1cblx0fTtcblx0Y29uc3Qgd2F0Y2ggPSAoZHJpdmVyLCBkcml2ZXJLZXksIGNiKSA9PiBkcml2ZXIud2F0Y2goZHJpdmVyS2V5LCBjYik7XG5cdHJldHVybiB7XG5cdFx0Z2V0SXRlbTogYXN5bmMgKGtleSwgb3B0cykgPT4ge1xuXHRcdFx0Y29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0cmV0dXJuIGF3YWl0IGdldEl0ZW0oZHJpdmVyLCBkcml2ZXJLZXksIG9wdHMpO1xuXHRcdH0sXG5cdFx0Z2V0SXRlbXM6IGFzeW5jIChrZXlzKSA9PiB7XG5cdFx0XHRjb25zdCBhcmVhVG9LZXlNYXAgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuXHRcdFx0Y29uc3Qga2V5VG9PcHRzTWFwID0gLyogQF9fUFVSRV9fICovIG5ldyBNYXAoKTtcblx0XHRcdGNvbnN0IG9yZGVyZWRLZXlzID0gW107XG5cdFx0XHRrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0XHRsZXQga2V5U3RyO1xuXHRcdFx0XHRsZXQgb3B0cztcblx0XHRcdFx0aWYgKHR5cGVvZiBrZXkgPT09IFwic3RyaW5nXCIpIGtleVN0ciA9IGtleTtcblx0XHRcdFx0ZWxzZSBpZiAoXCJnZXRWYWx1ZVwiIGluIGtleSkge1xuXHRcdFx0XHRcdGtleVN0ciA9IGtleS5rZXk7XG5cdFx0XHRcdFx0b3B0cyA9IHsgZmFsbGJhY2s6IGtleS5mYWxsYmFjayB9O1xuXHRcdFx0XHR9IGVsc2UgaWYgKFwiaXRlbVwiIGluIGtleSkge1xuXHRcdFx0XHRcdGtleVN0ciA9IGtleS5pdGVtLmtleTtcblx0XHRcdFx0XHRvcHRzID0geyBmYWxsYmFjazoga2V5Lml0ZW0uZmFsbGJhY2sgfTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRrZXlTdHIgPSBrZXkua2V5O1xuXHRcdFx0XHRcdG9wdHMgPSBrZXkub3B0aW9ucztcblx0XHRcdFx0fVxuXHRcdFx0XHRvcmRlcmVkS2V5cy5wdXNoKGtleVN0cik7XG5cdFx0XHRcdGNvbnN0IHsgZHJpdmVyQXJlYSwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleVN0cik7XG5cdFx0XHRcdGNvbnN0IGFyZWFLZXlzID0gYXJlYVRvS2V5TWFwLmdldChkcml2ZXJBcmVhKSA/PyBbXTtcblx0XHRcdFx0YXJlYVRvS2V5TWFwLnNldChkcml2ZXJBcmVhLCBhcmVhS2V5cy5jb25jYXQoZHJpdmVyS2V5KSk7XG5cdFx0XHRcdGtleVRvT3B0c01hcC5zZXQoa2V5U3RyLCBvcHRzKTtcblx0XHRcdH0pO1xuXHRcdFx0Y29uc3QgcmVzdWx0c01hcCA9IC8qIEBfX1BVUkVfXyAqLyBuZXcgTWFwKCk7XG5cdFx0XHRhd2FpdCBQcm9taXNlLmFsbChBcnJheS5mcm9tKGFyZWFUb0tleU1hcC5lbnRyaWVzKCkpLm1hcChhc3luYyAoW2RyaXZlckFyZWEsIGtleXNdKSA9PiB7XG5cdFx0XHRcdChhd2FpdCBkcml2ZXJzW2RyaXZlckFyZWFdLmdldEl0ZW1zKGtleXMpKS5mb3JFYWNoKChkcml2ZXJSZXN1bHQpID0+IHtcblx0XHRcdFx0XHRjb25zdCBrZXkgPSBgJHtkcml2ZXJBcmVhfToke2RyaXZlclJlc3VsdC5rZXl9YDtcblx0XHRcdFx0XHRjb25zdCBvcHRzID0ga2V5VG9PcHRzTWFwLmdldChrZXkpO1xuXHRcdFx0XHRcdGNvbnN0IHZhbHVlID0gZ2V0VmFsdWVPckZhbGxiYWNrKGRyaXZlclJlc3VsdC52YWx1ZSwgb3B0cz8uZmFsbGJhY2sgPz8gb3B0cz8uZmFsbGJhY2spO1xuXHRcdFx0XHRcdHJlc3VsdHNNYXAuc2V0KGtleSwgdmFsdWUpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pKTtcblx0XHRcdHJldHVybiBvcmRlcmVkS2V5cy5tYXAoKGtleSkgPT4gKHtcblx0XHRcdFx0a2V5LFxuXHRcdFx0XHR2YWx1ZTogcmVzdWx0c01hcC5nZXQoa2V5KVxuXHRcdFx0fSkpO1xuXHRcdH0sXG5cdFx0Z2V0TWV0YTogYXN5bmMgKGtleSkgPT4ge1xuXHRcdFx0Y29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0cmV0dXJuIGF3YWl0IGdldE1ldGEoZHJpdmVyLCBkcml2ZXJLZXkpO1xuXHRcdH0sXG5cdFx0Z2V0TWV0YXM6IGFzeW5jIChhcmdzKSA9PiB7XG5cdFx0XHRjb25zdCBrZXlzID0gYXJncy5tYXAoKGFyZykgPT4ge1xuXHRcdFx0XHRjb25zdCBrZXkgPSB0eXBlb2YgYXJnID09PSBcInN0cmluZ1wiID8gYXJnIDogYXJnLmtleTtcblx0XHRcdFx0Y29uc3QgeyBkcml2ZXJBcmVhLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHRrZXksXG5cdFx0XHRcdFx0ZHJpdmVyQXJlYSxcblx0XHRcdFx0XHRkcml2ZXJLZXksXG5cdFx0XHRcdFx0ZHJpdmVyTWV0YUtleTogZ2V0TWV0YUtleShkcml2ZXJLZXkpXG5cdFx0XHRcdH07XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGFyZWFUb0RyaXZlck1ldGFLZXlzTWFwID0ga2V5cy5yZWR1Y2UoKG1hcCwga2V5KSA9PiB7XG5cdFx0XHRcdG1hcFtrZXkuZHJpdmVyQXJlYV0gPz89IFtdO1xuXHRcdFx0XHRtYXBba2V5LmRyaXZlckFyZWFdPy5wdXNoKGtleSk7XG5cdFx0XHRcdHJldHVybiBtYXA7XG5cdFx0XHR9LCB7fSk7XG5cdFx0XHRjb25zdCByZXN1bHRzTWFwID0ge307XG5cdFx0XHRjb25zdCBzdG9yYWdlID0gYnJvd3Nlci5zdG9yYWdlO1xuXHRcdFx0aWYgKCFzdG9yYWdlKSB0aHJvdyBuZXcgRXJyb3IoXCJCcm93c2VyIHN0b3JhZ2UgQVBJIGlzIHVuYXZhaWxhYmxlXCIpO1xuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoT2JqZWN0LmVudHJpZXMoYXJlYVRvRHJpdmVyTWV0YUtleXNNYXApLm1hcChhc3luYyAoW2FyZWEsIGtleXNdKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGFyZWFSZXMgPSBhd2FpdCBzdG9yYWdlW2FyZWFdLmdldChrZXlzLm1hcCgoa2V5KSA9PiBrZXkuZHJpdmVyTWV0YUtleSkpO1xuXHRcdFx0XHRrZXlzLmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0XHRcdHJlc3VsdHNNYXBba2V5LmtleV0gPSBhcmVhUmVzW2tleS5kcml2ZXJNZXRhS2V5XSA/PyB7fTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KSk7XG5cdFx0XHRyZXR1cm4ga2V5cy5tYXAoKGtleSkgPT4gKHtcblx0XHRcdFx0a2V5OiBrZXkua2V5LFxuXHRcdFx0XHRtZXRhOiByZXN1bHRzTWFwW2tleS5rZXldXG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRzZXRJdGVtOiBhc3luYyAoa2V5LCB2YWx1ZSkgPT4ge1xuXHRcdFx0Y29uc3QgeyBkcml2ZXIsIGRyaXZlcktleSB9ID0gcmVzb2x2ZUtleShrZXkpO1xuXHRcdFx0YXdhaXQgc2V0SXRlbShkcml2ZXIsIGRyaXZlcktleSwgdmFsdWUpO1xuXHRcdH0sXG5cdFx0c2V0SXRlbXM6IGFzeW5jIChpdGVtcykgPT4ge1xuXHRcdFx0Y29uc3QgYXJlYVRvS2V5VmFsdWVNYXAgPSB7fTtcblx0XHRcdGl0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcblx0XHRcdFx0Y29uc3QgeyBkcml2ZXJBcmVhLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoXCJrZXlcIiBpbiBpdGVtID8gaXRlbS5rZXkgOiBpdGVtLml0ZW0ua2V5KTtcblx0XHRcdFx0YXJlYVRvS2V5VmFsdWVNYXBbZHJpdmVyQXJlYV0gPz89IFtdO1xuXHRcdFx0XHRhcmVhVG9LZXlWYWx1ZU1hcFtkcml2ZXJBcmVhXS5wdXNoKHtcblx0XHRcdFx0XHRrZXk6IGRyaXZlcktleSxcblx0XHRcdFx0XHR2YWx1ZTogaXRlbS52YWx1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdFx0YXdhaXQgUHJvbWlzZS5hbGwoT2JqZWN0LmVudHJpZXMoYXJlYVRvS2V5VmFsdWVNYXApLm1hcChhc3luYyAoW2RyaXZlckFyZWEsIHZhbHVlc10pID0+IHtcblx0XHRcdFx0YXdhaXQgZ2V0RHJpdmVyKGRyaXZlckFyZWEpLnNldEl0ZW1zKHZhbHVlcyk7XG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRzZXRNZXRhOiBhc3luYyAoa2V5LCBwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRhd2FpdCBzZXRNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKTtcblx0XHR9LFxuXHRcdHNldE1ldGFzOiBhc3luYyAoaXRlbXMpID0+IHtcblx0XHRcdGNvbnN0IGFyZWFUb01ldGFVcGRhdGVzTWFwID0ge307XG5cdFx0XHRpdGVtcy5mb3JFYWNoKChpdGVtKSA9PiB7XG5cdFx0XHRcdGNvbnN0IHsgZHJpdmVyQXJlYSwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KFwia2V5XCIgaW4gaXRlbSA/IGl0ZW0ua2V5IDogaXRlbS5pdGVtLmtleSk7XG5cdFx0XHRcdGFyZWFUb01ldGFVcGRhdGVzTWFwW2RyaXZlckFyZWFdID8/PSBbXTtcblx0XHRcdFx0YXJlYVRvTWV0YVVwZGF0ZXNNYXBbZHJpdmVyQXJlYV0ucHVzaCh7XG5cdFx0XHRcdFx0a2V5OiBkcml2ZXJLZXksXG5cdFx0XHRcdFx0cHJvcGVydGllczogaXRlbS5tZXRhXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0XHRhd2FpdCBQcm9taXNlLmFsbChPYmplY3QuZW50cmllcyhhcmVhVG9NZXRhVXBkYXRlc01hcCkubWFwKGFzeW5jIChbc3RvcmFnZUFyZWEsIHVwZGF0ZXNdKSA9PiB7XG5cdFx0XHRcdGNvbnN0IGRyaXZlciA9IGdldERyaXZlcihzdG9yYWdlQXJlYSk7XG5cdFx0XHRcdGNvbnN0IG1ldGFLZXlzID0gdXBkYXRlcy5tYXAoKHsga2V5IH0pID0+IGdldE1ldGFLZXkoa2V5KSk7XG5cdFx0XHRcdGNvbnN0IGV4aXN0aW5nTWV0YXMgPSBhd2FpdCBkcml2ZXIuZ2V0SXRlbXMobWV0YUtleXMpO1xuXHRcdFx0XHRjb25zdCBleGlzdGluZ01ldGFNYXAgPSBPYmplY3QuZnJvbUVudHJpZXMoZXhpc3RpbmdNZXRhcy5tYXAoKHsga2V5LCB2YWx1ZSB9KSA9PiBba2V5LCBnZXRNZXRhVmFsdWUodmFsdWUpXSkpO1xuXHRcdFx0XHRjb25zdCBtZXRhVXBkYXRlcyA9IHVwZGF0ZXMubWFwKCh7IGtleSwgcHJvcGVydGllcyB9KSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgbWV0YUtleSA9IGdldE1ldGFLZXkoa2V5KTtcblx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0a2V5OiBtZXRhS2V5LFxuXHRcdFx0XHRcdFx0dmFsdWU6IG1lcmdlTWV0YShleGlzdGluZ01ldGFNYXBbbWV0YUtleV0gPz8ge30sIHByb3BlcnRpZXMpXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGF3YWl0IGRyaXZlci5zZXRJdGVtcyhtZXRhVXBkYXRlcyk7XG5cdFx0XHR9KSk7XG5cdFx0fSxcblx0XHRyZW1vdmVJdGVtOiBhc3luYyAoa2V5LCBvcHRzKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRhd2FpdCByZW1vdmVJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCBvcHRzKTtcblx0XHR9LFxuXHRcdHJlbW92ZUl0ZW1zOiBhc3luYyAoa2V5cykgPT4ge1xuXHRcdFx0Y29uc3QgYXJlYVRvS2V5c01hcCA9IHt9O1xuXHRcdFx0a2V5cy5mb3JFYWNoKChrZXkpID0+IHtcblx0XHRcdFx0bGV0IGtleVN0cjtcblx0XHRcdFx0bGV0IG9wdHM7XG5cdFx0XHRcdGlmICh0eXBlb2Yga2V5ID09PSBcInN0cmluZ1wiKSBrZXlTdHIgPSBrZXk7XG5cdFx0XHRcdGVsc2UgaWYgKFwiZ2V0VmFsdWVcIiBpbiBrZXkpIGtleVN0ciA9IGtleS5rZXk7XG5cdFx0XHRcdGVsc2UgaWYgKFwiaXRlbVwiIGluIGtleSkge1xuXHRcdFx0XHRcdGtleVN0ciA9IGtleS5pdGVtLmtleTtcblx0XHRcdFx0XHRvcHRzID0ga2V5Lm9wdGlvbnM7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0a2V5U3RyID0ga2V5LmtleTtcblx0XHRcdFx0XHRvcHRzID0ga2V5Lm9wdGlvbnM7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y29uc3QgeyBkcml2ZXJBcmVhLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5U3RyKTtcblx0XHRcdFx0YXJlYVRvS2V5c01hcFtkcml2ZXJBcmVhXSA/Pz0gW107XG5cdFx0XHRcdGFyZWFUb0tleXNNYXBbZHJpdmVyQXJlYV0ucHVzaChkcml2ZXJLZXkpO1xuXHRcdFx0XHRpZiAob3B0cz8ucmVtb3ZlTWV0YSkgYXJlYVRvS2V5c01hcFtkcml2ZXJBcmVhXS5wdXNoKGdldE1ldGFLZXkoZHJpdmVyS2V5KSk7XG5cdFx0XHR9KTtcblx0XHRcdGF3YWl0IFByb21pc2UuYWxsKE9iamVjdC5lbnRyaWVzKGFyZWFUb0tleXNNYXApLm1hcChhc3luYyAoW2RyaXZlckFyZWEsIGtleXNdKSA9PiB7XG5cdFx0XHRcdGF3YWl0IGdldERyaXZlcihkcml2ZXJBcmVhKS5yZW1vdmVJdGVtcyhrZXlzKTtcblx0XHRcdH0pKTtcblx0XHR9LFxuXHRcdGNsZWFyOiBhc3luYyAoYmFzZSkgPT4ge1xuXHRcdFx0YXdhaXQgZ2V0RHJpdmVyKGJhc2UpLmNsZWFyKCk7XG5cdFx0fSxcblx0XHRyZW1vdmVNZXRhOiBhc3luYyAoa2V5LCBwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0XHRjb25zdCB7IGRyaXZlciwgZHJpdmVyS2V5IH0gPSByZXNvbHZlS2V5KGtleSk7XG5cdFx0XHRhd2FpdCByZW1vdmVNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCBwcm9wZXJ0aWVzKTtcblx0XHR9LFxuXHRcdHNuYXBzaG90OiBhc3luYyAoYmFzZSwgb3B0cykgPT4ge1xuXHRcdFx0Y29uc3QgZGF0YSA9IGF3YWl0IGdldERyaXZlcihiYXNlKS5zbmFwc2hvdCgpO1xuXHRcdFx0b3B0cz8uZXhjbHVkZUtleXM/LmZvckVhY2goKGtleSkgPT4ge1xuXHRcdFx0XHRkZWxldGUgZGF0YVtrZXldO1xuXHRcdFx0XHRkZWxldGUgZGF0YVtnZXRNZXRhS2V5KGtleSldO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gZGF0YTtcblx0XHR9LFxuXHRcdHJlc3RvcmVTbmFwc2hvdDogYXN5bmMgKGJhc2UsIGRhdGEpID0+IHtcblx0XHRcdGF3YWl0IGdldERyaXZlcihiYXNlKS5yZXN0b3JlU25hcHNob3QoZGF0YSk7XG5cdFx0fSxcblx0XHR3YXRjaDogKGtleSwgY2IpID0+IHtcblx0XHRcdGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdHJldHVybiB3YXRjaChkcml2ZXIsIGRyaXZlcktleSwgY2IpO1xuXHRcdH0sXG5cdFx0dW53YXRjaCgpIHtcblx0XHRcdE9iamVjdC52YWx1ZXMoZHJpdmVycykuZm9yRWFjaCgoZHJpdmVyKSA9PiB7XG5cdFx0XHRcdGRyaXZlci51bndhdGNoKCk7XG5cdFx0XHR9KTtcblx0XHR9LFxuXHRcdGRlZmluZUl0ZW06IChrZXksIG9wdHMpID0+IHtcblx0XHRcdGNvbnN0IHsgZHJpdmVyLCBkcml2ZXJLZXkgfSA9IHJlc29sdmVLZXkoa2V5KTtcblx0XHRcdGNvbnN0IHsgdmVyc2lvbjogdGFyZ2V0VmVyc2lvbiA9IDEsIG1pZ3JhdGlvbnMgPSB7fSwgb25NaWdyYXRpb25Db21wbGV0ZSwgZGVidWcgPSBmYWxzZSB9ID0gb3B0cyA/PyB7fTtcblx0XHRcdGlmICh0YXJnZXRWZXJzaW9uIDwgMSkgdGhyb3cgRXJyb3IoXCJTdG9yYWdlIGl0ZW0gdmVyc2lvbiBjYW5ub3QgYmUgbGVzcyB0aGFuIDEuIEluaXRpYWwgdmVyc2lvbnMgc2hvdWxkIGJlIHNldCB0byAxLCBub3QgMC5cIik7XG5cdFx0XHRsZXQgbmVlZHNWZXJzaW9uU2V0ID0gZmFsc2U7XG5cdFx0XHRjb25zdCBtaWdyYXRlID0gYXN5bmMgKCkgPT4ge1xuXHRcdFx0XHRjb25zdCBkcml2ZXJNZXRhS2V5ID0gZ2V0TWV0YUtleShkcml2ZXJLZXkpO1xuXHRcdFx0XHRjb25zdCBbeyB2YWx1ZSB9LCB7IHZhbHVlOiBtZXRhIH1dID0gYXdhaXQgZHJpdmVyLmdldEl0ZW1zKFtkcml2ZXJLZXksIGRyaXZlck1ldGFLZXldKTtcblx0XHRcdFx0bmVlZHNWZXJzaW9uU2V0ID0gdmFsdWUgPT0gbnVsbCAmJiBtZXRhPy52ID09IG51bGwgJiYgISF0YXJnZXRWZXJzaW9uO1xuXHRcdFx0XHRpZiAodmFsdWUgPT0gbnVsbCkgcmV0dXJuO1xuXHRcdFx0XHRjb25zdCBjdXJyZW50VmVyc2lvbiA9IG1ldGE/LnYgPz8gMTtcblx0XHRcdFx0aWYgKGN1cnJlbnRWZXJzaW9uID4gdGFyZ2V0VmVyc2lvbikgdGhyb3cgRXJyb3IoYFZlcnNpb24gZG93bmdyYWRlIGRldGVjdGVkICh2JHtjdXJyZW50VmVyc2lvbn0gLT4gdiR7dGFyZ2V0VmVyc2lvbn0pIGZvciBcIiR7a2V5fVwiYCk7XG5cdFx0XHRcdGlmIChjdXJyZW50VmVyc2lvbiA9PT0gdGFyZ2V0VmVyc2lvbikgcmV0dXJuO1xuXHRcdFx0XHRpZiAoZGVidWcpIGNvbnNvbGUuZGVidWcoYFt3ZWJleHQtc3RvcmVdIFJ1bm5pbmcgc3RvcmFnZSBtaWdyYXRpb24gZm9yICR7a2V5fTogdiR7Y3VycmVudFZlcnNpb259IC0+IHYke3RhcmdldFZlcnNpb259YCk7XG5cdFx0XHRcdGNvbnN0IG1pZ3JhdGlvbnNUb1J1biA9IEFycmF5LmZyb20oeyBsZW5ndGg6IHRhcmdldFZlcnNpb24gLSBjdXJyZW50VmVyc2lvbiB9LCAoXywgaSkgPT4gY3VycmVudFZlcnNpb24gKyBpICsgMSk7XG5cdFx0XHRcdGxldCBtaWdyYXRlZFZhbHVlID0gdmFsdWU7XG5cdFx0XHRcdGZvciAoY29uc3QgbWlncmF0ZVRvVmVyc2lvbiBvZiBtaWdyYXRpb25zVG9SdW4pIHRyeSB7XG5cdFx0XHRcdFx0bWlncmF0ZWRWYWx1ZSA9IGF3YWl0IG1pZ3JhdGlvbnM/LlttaWdyYXRlVG9WZXJzaW9uXT8uKG1pZ3JhdGVkVmFsdWUpID8/IG1pZ3JhdGVkVmFsdWU7XG5cdFx0XHRcdFx0aWYgKGRlYnVnKSBjb25zb2xlLmRlYnVnKGBbd2ViZXh0LXN0b3JlXSBTdG9yYWdlIG1pZ3JhdGlvbiBwcm9jZXNzZWQgZm9yIHZlcnNpb246IHYke21pZ3JhdGVUb1ZlcnNpb259YCk7XG5cdFx0XHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0XHRcdHRocm93IG5ldyBNaWdyYXRpb25FcnJvcihrZXksIG1pZ3JhdGVUb1ZlcnNpb24sIHsgY2F1c2U6IGVyciB9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRhd2FpdCBkcml2ZXIuc2V0SXRlbXMoW3tcblx0XHRcdFx0XHRrZXk6IGRyaXZlcktleSxcblx0XHRcdFx0XHR2YWx1ZTogbWlncmF0ZWRWYWx1ZVxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0a2V5OiBkcml2ZXJNZXRhS2V5LFxuXHRcdFx0XHRcdHZhbHVlOiB7XG5cdFx0XHRcdFx0XHQuLi5tZXRhLFxuXHRcdFx0XHRcdFx0djogdGFyZ2V0VmVyc2lvblxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fV0pO1xuXHRcdFx0XHRpZiAoZGVidWcpIGNvbnNvbGUuZGVidWcoYFt3ZWJleHQtc3RvcmVdIFN0b3JhZ2UgbWlncmF0aW9uIGNvbXBsZXRlZCBmb3IgJHtrZXl9IHYke3RhcmdldFZlcnNpb259YCwgeyBtaWdyYXRlZFZhbHVlIH0pO1xuXHRcdFx0XHRvbk1pZ3JhdGlvbkNvbXBsZXRlPy4obWlncmF0ZWRWYWx1ZSwgdGFyZ2V0VmVyc2lvbik7XG5cdFx0XHR9O1xuXHRcdFx0Y29uc3QgbWlncmF0aW9uc0RvbmUgPSBvcHRzPy5taWdyYXRpb25zID09IG51bGwgPyBQcm9taXNlLnJlc29sdmUoKSA6IG1pZ3JhdGUoKS5jYXRjaCgoZXJyKSA9PiB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoYFt3ZWJleHQtc3RvcmVdIE1pZ3JhdGlvbiBmYWlsZWQgZm9yICR7a2V5fWAsIGVycik7XG5cdFx0XHR9KTtcblx0XHRcdGNvbnN0IGluaXRMb2NrID0gd2l0aExvY2soKTtcblx0XHRcdGNvbnN0IGdldEZhbGxiYWNrID0gKCkgPT4gb3B0cz8uZmFsbGJhY2sgPz8gb3B0cz8uZGVmYXVsdFZhbHVlID8/IG51bGw7XG5cdFx0XHRjb25zdCBnZXRPckluaXRWYWx1ZSA9ICgpID0+IGluaXRMb2NrKGFzeW5jICgpID0+IHtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSBhd2FpdCBkcml2ZXIuZ2V0SXRlbShkcml2ZXJLZXkpO1xuXHRcdFx0XHRpZiAodmFsdWUgIT0gbnVsbCB8fCBvcHRzPy5pbml0ID09IG51bGwpIHJldHVybiB2YWx1ZTtcblx0XHRcdFx0Y29uc3QgbmV3VmFsdWUgPSBhd2FpdCBvcHRzLmluaXQoKTtcblx0XHRcdFx0YXdhaXQgZHJpdmVyLnNldEl0ZW0oZHJpdmVyS2V5LCBuZXdWYWx1ZSk7XG5cdFx0XHRcdGlmICh2YWx1ZSA9PSBudWxsICYmIHRhcmdldFZlcnNpb24gPiAxKSBhd2FpdCBzZXRNZXRhKGRyaXZlciwgZHJpdmVyS2V5LCB7IHY6IHRhcmdldFZlcnNpb24gfSk7XG5cdFx0XHRcdHJldHVybiBuZXdWYWx1ZTtcblx0XHRcdH0pO1xuXHRcdFx0bWlncmF0aW9uc0RvbmUudGhlbihnZXRPckluaXRWYWx1ZSk7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRrZXksXG5cdFx0XHRcdGdldCBkZWZhdWx0VmFsdWUoKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGdldEZhbGxiYWNrKCk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldCBmYWxsYmFjaygpIHtcblx0XHRcdFx0XHRyZXR1cm4gZ2V0RmFsbGJhY2soKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0Z2V0VmFsdWU6IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRhd2FpdCBtaWdyYXRpb25zRG9uZTtcblx0XHRcdFx0XHRpZiAob3B0cz8uaW5pdCkgcmV0dXJuIGF3YWl0IGdldE9ySW5pdFZhbHVlKCk7XG5cdFx0XHRcdFx0ZWxzZSByZXR1cm4gYXdhaXQgZ2V0SXRlbShkcml2ZXIsIGRyaXZlcktleSwgb3B0cyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdGdldE1ldGE6IGFzeW5jICgpID0+IHtcblx0XHRcdFx0XHRhd2FpdCBtaWdyYXRpb25zRG9uZTtcblx0XHRcdFx0XHRyZXR1cm4gYXdhaXQgZ2V0TWV0YShkcml2ZXIsIGRyaXZlcktleSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNldFZhbHVlOiBhc3luYyAodmFsdWUpID0+IHtcblx0XHRcdFx0XHRhd2FpdCBtaWdyYXRpb25zRG9uZTtcblx0XHRcdFx0XHRpZiAobmVlZHNWZXJzaW9uU2V0KSB7XG5cdFx0XHRcdFx0XHRuZWVkc1ZlcnNpb25TZXQgPSBmYWxzZTtcblx0XHRcdFx0XHRcdGF3YWl0IFByb21pc2UuYWxsKFtzZXRJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCB2YWx1ZSksIHNldE1ldGEoZHJpdmVyLCBkcml2ZXJLZXksIHsgdjogdGFyZ2V0VmVyc2lvbiB9KV0pO1xuXHRcdFx0XHRcdH0gZWxzZSBhd2FpdCBzZXRJdGVtKGRyaXZlciwgZHJpdmVyS2V5LCB2YWx1ZSk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHNldE1ldGE6IGFzeW5jIChwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IHNldE1ldGEoZHJpdmVyLCBkcml2ZXJLZXksIHByb3BlcnRpZXMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRyZW1vdmVWYWx1ZTogYXN5bmMgKG9wdHMpID0+IHtcblx0XHRcdFx0XHRhd2FpdCBtaWdyYXRpb25zRG9uZTtcblx0XHRcdFx0XHRyZXR1cm4gYXdhaXQgcmVtb3ZlSXRlbShkcml2ZXIsIGRyaXZlcktleSwgb3B0cyk7XG5cdFx0XHRcdH0sXG5cdFx0XHRcdHJlbW92ZU1ldGE6IGFzeW5jIChwcm9wZXJ0aWVzKSA9PiB7XG5cdFx0XHRcdFx0YXdhaXQgbWlncmF0aW9uc0RvbmU7XG5cdFx0XHRcdFx0cmV0dXJuIGF3YWl0IHJlbW92ZU1ldGEoZHJpdmVyLCBkcml2ZXJLZXksIHByb3BlcnRpZXMpO1xuXHRcdFx0XHR9LFxuXHRcdFx0XHR3YXRjaDogKGNiKSA9PiB3YXRjaChkcml2ZXIsIGRyaXZlcktleSwgKG5ld1ZhbHVlLCBvbGRWYWx1ZSkgPT4gY2IobmV3VmFsdWUgPz8gZ2V0RmFsbGJhY2soKSwgb2xkVmFsdWUgPz8gZ2V0RmFsbGJhY2soKSkpLFxuXHRcdFx0XHRtaWdyYXRlXG5cdFx0XHR9O1xuXHRcdH1cblx0fTtcbn1cbmZ1bmN0aW9uIGNyZWF0ZURyaXZlcihzdG9yYWdlQXJlYSkge1xuXHRjb25zdCBnZXRTdG9yYWdlQXJlYSA9ICgpID0+IHtcblx0XHRpZiAoYnJvd3Nlci5ydW50aW1lID09IG51bGwpIHRocm93IEVycm9yKGAnd2ViZXh0LXN0b3JlJyBtdXN0IGJlIGxvYWRlZCBpbiBhIHdlYiBleHRlbnNpb24gZW52aXJvbm1lbnQuYCk7XG5cdFx0aWYgKGJyb3dzZXIuc3RvcmFnZSA9PSBudWxsKSB0aHJvdyBFcnJvcihcIllvdSBtdXN0IGFkZCB0aGUgJ3N0b3JhZ2UnIHBlcm1pc3Npb24gdG8geW91ciBtYW5pZmVzdCB0byB1c2UgJ3dlYmV4dC1zdG9yZSdcIik7XG5cdFx0Y29uc3QgYXJlYSA9IGJyb3dzZXIuc3RvcmFnZVtzdG9yYWdlQXJlYV07XG5cdFx0aWYgKGFyZWEgPT0gbnVsbCkgdGhyb3cgRXJyb3IoYFwiYnJvd3Nlci5zdG9yYWdlLiR7c3RvcmFnZUFyZWF9XCIgaXMgdW5kZWZpbmVkYCk7XG5cdFx0cmV0dXJuIGFyZWE7XG5cdH07XG5cdGNvbnN0IHdhdGNoTGlzdGVuZXJzID0gLyogQF9fUFVSRV9fICovIG5ldyBTZXQoKTtcblx0cmV0dXJuIHtcblx0XHRnZXRJdGVtOiBhc3luYyAoa2V5KSA9PiB7XG5cdFx0XHRyZXR1cm4gKGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuZ2V0KGtleSkpW2tleV07XG5cdFx0fSxcblx0XHRnZXRJdGVtczogYXN5bmMgKGtleXMpID0+IHtcblx0XHRcdGNvbnN0IHJlc3VsdCA9IGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuZ2V0KGtleXMpO1xuXHRcdFx0cmV0dXJuIGtleXMubWFwKChrZXkpID0+ICh7XG5cdFx0XHRcdGtleSxcblx0XHRcdFx0dmFsdWU6IHJlc3VsdFtrZXldID8/IG51bGxcblx0XHRcdH0pKTtcblx0XHR9LFxuXHRcdHNldEl0ZW06IGFzeW5jIChrZXksIHZhbHVlKSA9PiB7XG5cdFx0XHRpZiAodmFsdWUgPT0gbnVsbCkgYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5yZW1vdmUoa2V5KTtcblx0XHRcdGVsc2UgYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5zZXQoeyBba2V5XTogdmFsdWUgfSk7XG5cdFx0fSxcblx0XHRzZXRJdGVtczogYXN5bmMgKHZhbHVlcykgPT4ge1xuXHRcdFx0Y29uc3QgbWFwID0gdmFsdWVzLnJlZHVjZSgobWFwLCB7IGtleSwgdmFsdWUgfSkgPT4ge1xuXHRcdFx0XHRtYXBba2V5XSA9IHZhbHVlO1xuXHRcdFx0XHRyZXR1cm4gbWFwO1xuXHRcdFx0fSwge30pO1xuXHRcdFx0YXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5zZXQobWFwKTtcblx0XHR9LFxuXHRcdHJlbW92ZUl0ZW06IGFzeW5jIChrZXkpID0+IHtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkucmVtb3ZlKGtleSk7XG5cdFx0fSxcblx0XHRyZW1vdmVJdGVtczogYXN5bmMgKGtleXMpID0+IHtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkucmVtb3ZlKGtleXMpO1xuXHRcdH0sXG5cdFx0Y2xlYXI6IGFzeW5jICgpID0+IHtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuY2xlYXIoKTtcblx0XHR9LFxuXHRcdHNuYXBzaG90OiBhc3luYyAoKSA9PiB7XG5cdFx0XHRyZXR1cm4gYXdhaXQgZ2V0U3RvcmFnZUFyZWEoKS5nZXQoKTtcblx0XHR9LFxuXHRcdHJlc3RvcmVTbmFwc2hvdDogYXN5bmMgKGRhdGEpID0+IHtcblx0XHRcdGF3YWl0IGdldFN0b3JhZ2VBcmVhKCkuc2V0KGRhdGEpO1xuXHRcdH0sXG5cdFx0d2F0Y2goa2V5LCBjYikge1xuXHRcdFx0Y29uc3QgbGlzdGVuZXIgPSAoY2hhbmdlcykgPT4ge1xuXHRcdFx0XHRjb25zdCBjaGFuZ2UgPSBjaGFuZ2VzW2tleV07XG5cdFx0XHRcdGlmIChjaGFuZ2UgPT0gbnVsbCB8fCBkZXF1YWwoY2hhbmdlLm5ld1ZhbHVlLCBjaGFuZ2Uub2xkVmFsdWUpKSByZXR1cm47XG5cdFx0XHRcdGNiKGNoYW5nZS5uZXdWYWx1ZSA/PyBudWxsLCBjaGFuZ2Uub2xkVmFsdWUgPz8gbnVsbCk7XG5cdFx0XHR9O1xuXHRcdFx0Z2V0U3RvcmFnZUFyZWEoKS5vbkNoYW5nZWQuYWRkTGlzdGVuZXIobGlzdGVuZXIpO1xuXHRcdFx0d2F0Y2hMaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcblx0XHRcdHJldHVybiAoKSA9PiB7XG5cdFx0XHRcdGdldFN0b3JhZ2VBcmVhKCkub25DaGFuZ2VkLnJlbW92ZUxpc3RlbmVyKGxpc3RlbmVyKTtcblx0XHRcdFx0d2F0Y2hMaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcblx0XHRcdH07XG5cdFx0fSxcblx0XHR1bndhdGNoKCkge1xuXHRcdFx0d2F0Y2hMaXN0ZW5lcnMuZm9yRWFjaCgobGlzdGVuZXIpID0+IHtcblx0XHRcdFx0Z2V0U3RvcmFnZUFyZWEoKS5vbkNoYW5nZWQucmVtb3ZlTGlzdGVuZXIobGlzdGVuZXIpO1xuXHRcdFx0fSk7XG5cdFx0XHR3YXRjaExpc3RlbmVycy5jbGVhcigpO1xuXHRcdH1cblx0fTtcbn1cbi8vI2VuZHJlZ2lvblxuLy8jcmVnaW9uIHNyYy9ob29rLnRzXG4vKipcbiogT3B0aW9uYWwgUmVhY3QgYmluZGluZ3MgZm9yIGB3ZWJleHQtc3RvcmVgLlxuKlxuKiBgcmVhY3RgIGlzIGEgcGVlciBkZXBlbmRlbmN5IGFuZCBpcyBvbmx5IGV2ZXIgaW1wb3J0ZWQgZnJvbSB0aGlzIGZpbGUsIHNvXG4qIGFueW9uZSBpbXBvcnRpbmcgZnJvbSBgd2ViZXh0LXN0b3JlYCAodGhlIHJvb3QgZW50cnlwb2ludCkgbmV2ZXIgcHVsbHNcbiogUmVhY3QgaW50byB0aGVpciBidW5kbGUuIE9ubHkgcHJvamVjdHMgdGhhdCBpbXBvcnQgZnJvbVxuKiBgd2ViZXh0LXN0b3JlL3JlYWN0YCBuZWVkIGByZWFjdGAgaW5zdGFsbGVkIGF0IGFsbC5cbipcbiogQG1vZHVsZSB3ZWJleHQtc3RvcmUvcmVhY3QgKHNvdXJjZTogaG9vay50cylcbiovXG5jb25zdCBpc1N0b3JhZ2VJdGVtID0gKHgpID0+IHR5cGVvZiB4ID09PSBcIm9iamVjdFwiICYmIHggIT0gbnVsbCAmJiB0eXBlb2YgeC5nZXRWYWx1ZSA9PT0gXCJmdW5jdGlvblwiO1xuY29uc3QgcGF0Y2hRdWV1ZXMgPSAvKiBAX19QVVJFX18gKi8gbmV3IE1hcCgpO1xuZnVuY3Rpb24gcXVldWVQYXRjaChrZXksIGZuKSB7XG5cdGNvbnN0IG5leHQgPSAocGF0Y2hRdWV1ZXMuZ2V0KGtleSkgPz8gUHJvbWlzZS5yZXNvbHZlKCkpLnRoZW4oZm4sIGZuKTtcblx0cGF0Y2hRdWV1ZXMuc2V0KGtleSwgbmV4dC50aGVuKCgpID0+IHZvaWQgMCwgKCkgPT4gdm9pZCAwKSk7XG5cdHJldHVybiBuZXh0O1xufVxuZnVuY3Rpb24gdXNlU3RvcmFnZShrZXlPckl0ZW0sIG9wdGlvbnMpIHtcblx0Y29uc3QgaXRlbSA9IGlzU3RvcmFnZUl0ZW0oa2V5T3JJdGVtKSA/IGtleU9ySXRlbSA6IHZvaWQgMDtcblx0Y29uc3Qga2V5ID0gaXRlbSA/IGl0ZW0ua2V5IDoga2V5T3JJdGVtO1xuXHRjb25zdCBmYWxsYmFjayA9IGl0ZW0gPyBpdGVtLmZhbGxiYWNrIDogb3B0aW9ucz8uZmFsbGJhY2sgPz8gb3B0aW9ucz8uZGVmYXVsdFZhbHVlID8/IG51bGw7XG5cdGNvbnN0IG9uQ2hhbmdlUmVmID0gdXNlUmVmKG9wdGlvbnM/Lm9uQ2hhbmdlKTtcblx0b25DaGFuZ2VSZWYuY3VycmVudCA9IG9wdGlvbnM/Lm9uQ2hhbmdlO1xuXHRjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKHtcblx0XHR2YWx1ZTogZmFsbGJhY2ssXG5cdFx0bG9hZGluZzogdHJ1ZSxcblx0XHRlcnJvcjogbnVsbFxuXHR9KTtcblx0dXNlRWZmZWN0KCgpID0+IHtcblx0XHRsZXQgY2FuY2VsbGVkID0gZmFsc2U7XG5cdFx0c2V0U3RhdGUoKHMpID0+ICh7XG5cdFx0XHQuLi5zLFxuXHRcdFx0bG9hZGluZzogdHJ1ZVxuXHRcdH0pKTtcblx0XHQoYXN5bmMgKCkgPT4ge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3QgdmFsdWUgPSBpdGVtID8gYXdhaXQgaXRlbS5nZXRWYWx1ZSgpIDogYXdhaXQgc3RvcmFnZS5nZXRJdGVtKGtleSwgb3B0aW9ucyk7XG5cdFx0XHRcdGlmICghY2FuY2VsbGVkKSBzZXRTdGF0ZSh7XG5cdFx0XHRcdFx0dmFsdWUsXG5cdFx0XHRcdFx0bG9hZGluZzogZmFsc2UsXG5cdFx0XHRcdFx0ZXJyb3I6IG51bGxcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0XHRpZiAoIWNhbmNlbGxlZCkgc2V0U3RhdGUoKHMpID0+ICh7XG5cdFx0XHRcdFx0Li4ucyxcblx0XHRcdFx0XHRsb2FkaW5nOiBmYWxzZSxcblx0XHRcdFx0XHRlcnJvclxuXHRcdFx0XHR9KSk7XG5cdFx0XHR9XG5cdFx0fSkoKTtcblx0XHRjb25zdCBoYW5kbGVDaGFuZ2UgPSAobmV3VmFsdWUsIG9sZFZhbHVlKSA9PiB7XG5cdFx0XHRzZXRTdGF0ZSh7XG5cdFx0XHRcdHZhbHVlOiBuZXdWYWx1ZSA/PyBmYWxsYmFjayxcblx0XHRcdFx0bG9hZGluZzogZmFsc2UsXG5cdFx0XHRcdGVycm9yOiBudWxsXG5cdFx0XHR9KTtcblx0XHRcdG9uQ2hhbmdlUmVmLmN1cnJlbnQ/LihuZXdWYWx1ZSwgb2xkVmFsdWUpO1xuXHRcdH07XG5cdFx0Y29uc3QgdW53YXRjaCA9IGl0ZW0gPyBpdGVtLndhdGNoKGhhbmRsZUNoYW5nZSkgOiBzdG9yYWdlLndhdGNoKGtleSwgaGFuZGxlQ2hhbmdlKTtcblx0XHRyZXR1cm4gKCkgPT4ge1xuXHRcdFx0Y2FuY2VsbGVkID0gdHJ1ZTtcblx0XHRcdHVud2F0Y2goKTtcblx0XHR9O1xuXHR9LCBba2V5XSk7XG5cdGNvbnN0IHNldFZhbHVlID0gdXNlQ2FsbGJhY2soYXN5bmMgKHZhbHVlKSA9PiB7XG5cdFx0aWYgKGl0ZW0pIGF3YWl0IGl0ZW0uc2V0VmFsdWUodmFsdWUpO1xuXHRcdGVsc2UgYXdhaXQgc3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuXHR9LCBba2V5XSk7XG5cdGNvbnN0IHBhdGNoVmFsdWUgPSB1c2VDYWxsYmFjaygocGFydGlhbCkgPT4gcXVldWVQYXRjaChrZXksIGFzeW5jICgpID0+IHtcblx0XHRjb25zdCBuZXh0ID0ge1xuXHRcdFx0Li4uaXRlbSA/IGF3YWl0IGl0ZW0uZ2V0VmFsdWUoKSA6IGF3YWl0IHN0b3JhZ2UuZ2V0SXRlbShrZXksIG9wdGlvbnMpID8/IGZhbGxiYWNrLFxuXHRcdFx0Li4ucGFydGlhbFxuXHRcdH07XG5cdFx0aWYgKGl0ZW0pIGF3YWl0IGl0ZW0uc2V0VmFsdWUobmV4dCk7XG5cdFx0ZWxzZSBhd2FpdCBzdG9yYWdlLnNldEl0ZW0oa2V5LCBuZXh0KTtcblx0fSksIFtrZXldKTtcblx0Y29uc3QgcmVtb3ZlVmFsdWUgPSB1c2VDYWxsYmFjayhhc3luYyAob3B0cykgPT4ge1xuXHRcdGlmIChpdGVtKSBhd2FpdCBpdGVtLnJlbW92ZVZhbHVlKG9wdHMpO1xuXHRcdGVsc2UgYXdhaXQgc3RvcmFnZS5yZW1vdmVJdGVtKGtleSwgb3B0cyk7XG5cdH0sIFtrZXldKTtcblx0cmV0dXJuIHtcblx0XHR2YWx1ZTogc3RhdGUudmFsdWUsXG5cdFx0bG9hZGluZzogc3RhdGUubG9hZGluZyxcblx0XHRlcnJvcjogc3RhdGUuZXJyb3IsXG5cdFx0c2V0VmFsdWUsXG5cdFx0cGF0Y2hWYWx1ZSxcblx0XHRyZW1vdmVWYWx1ZVxuXHR9O1xufVxuLyoqXG4qIExvd2VyLWxldmVsIGhvb2sgZm9yIHdoZW4geW91IGp1c3Qgd2FudCB0byAqcmVhY3QqIHRvIGNoYW5nZXMgKGUuZy4gc3luY1xuKiBzb21ldGhpbmcgb3V0c2lkZSBSZWFjdCwgbG9nIGFuYWx5dGljcywgaW52YWxpZGF0ZSBhIGNhY2hlKSB3aXRob3V0XG4qIG5lZWRpbmcgdGhlIHZhbHVlIGluIHJlbmRlciBzdGF0ZSBhdCBhbGwuIEVmZmVjdGl2ZWx5IGBzdG9yYWdlLndhdGNoKClgXG4qIHdpcmVkIHVwIHRvIHRoZSBjb21wb25lbnQgbGlmZWN5Y2xlLlxuKlxuKiBAZXhhbXBsZVxuKiAgIHVzZVN0b3JhZ2VXYXRjaCgnbG9jYWw6dGhlbWUnLCAobmV3VGhlbWUsIG9sZFRoZW1lKSA9PiB7XG4qICAgICBjb25zb2xlLmxvZyhgdGhlbWUgY2hhbmdlZDogJHtvbGRUaGVtZX0gLT4gJHtuZXdUaGVtZX1gKTtcbiogICB9KTtcbiovXG5mdW5jdGlvbiB1c2VTdG9yYWdlV2F0Y2goa2V5LCBjYWxsYmFjaykge1xuXHRjb25zdCBjYWxsYmFja1JlZiA9IHVzZVJlZihjYWxsYmFjayk7XG5cdGNhbGxiYWNrUmVmLmN1cnJlbnQgPSBjYWxsYmFjaztcblx0dXNlRWZmZWN0KCgpID0+IHtcblx0XHRyZXR1cm4gc3RvcmFnZS53YXRjaChrZXksIChuZXdWYWx1ZSwgb2xkVmFsdWUpID0+IGNhbGxiYWNrUmVmLmN1cnJlbnQobmV3VmFsdWUsIG9sZFZhbHVlKSk7XG5cdH0sIFtrZXldKTtcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgTWlncmF0aW9uRXJyb3IgYXMgYSwgYnJvd3NlciBhcyBpLCB1c2VTdG9yYWdlV2F0Y2ggYXMgbiwgc3RvcmFnZSBhcyByLCB1c2VTdG9yYWdlIGFzIHQgfTtcbiIsImltcG9ydCB7IHN0b3JhZ2UgfSBmcm9tIFwid2ViZXh0LXN0b3JlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2V0dGluZ3Mge1xuXHR0aGVtZTogXCJsaWdodFwiIHwgXCJkYXJrXCI7XG5cdGRpc3BsYXlOYW1lOiBzdHJpbmc7XG59XG5cbi8qKlxuICogQSB2ZXJzaW9uZWQgaXRlbS4gQnVtcGluZyBgdmVyc2lvbmAgYW5kIGFkZGluZyBhIG1pZ3JhdGlvbiBmdW5jdGlvbiBpcyBob3dcbiAqIHdlYmV4dC1zdG9yZSBldm9sdmVzIGEgc3RvcmVkIHNoYXBlIG92ZXIgdGltZSDigJQgbWlncmF0aW9ucyBydW5cbiAqIGF1dG9tYXRpY2FsbHksIG9uY2UsIHRoZSBmaXJzdCB0aW1lIHRoZSBpdGVtIGlzIHRvdWNoZWQgYWZ0ZXIgYW4gdXBkYXRlLlxuICovXG5leHBvcnQgY29uc3Qgc2V0dGluZ3NJdGVtID0gc3RvcmFnZS5kZWZpbmVJdGVtPFNldHRpbmdzPihcInN5bmM6c2V0dGluZ3NcIiwge1xuXHRmYWxsYmFjazogeyB0aGVtZTogXCJsaWdodFwiLCBkaXNwbGF5TmFtZTogXCJHdWVzdFwiIH0sXG5cdHZlcnNpb246IDMsXG5cdG1pZ3JhdGlvbnM6IHtcblx0XHQvLyB2MSAtPiB2MjogaW50cm9kdWNlZCBgdGhlbWVgXG5cdFx0MjogKG9sZDogYW55KSA9PiAoeyAuLi5vbGQsIHRoZW1lOiBvbGQ/LnRoZW1lID8/IFwibGlnaHRcIiB9KSxcblx0XHQvLyB2MiAtPiB2MzogaW50cm9kdWNlZCBgZGlzcGxheU5hbWVgXG5cdFx0MzogKG9sZDogYW55KSA9PiAoeyAuLi5vbGQsIGRpc3BsYXlOYW1lOiBvbGQ/LmRpc3BsYXlOYW1lID8/IFwiR3Vlc3RcIiB9KSxcblx0fSxcblx0ZGVidWc6IHRydWUsXG5cdG9uTWlncmF0aW9uQ29tcGxldGU6ICh2YWx1ZSwgdGFyZ2V0VmVyc2lvbikgPT4ge1xuXHRcdGNvbnNvbGUubG9nKFxuXHRcdFx0YFt3ZWJleHQtc3RvcmUtZGVtb10gc2V0dGluZ3MgbWlncmF0ZWQgdG8gdiR7dGFyZ2V0VmVyc2lvbn1gLFxuXHRcdFx0dmFsdWUsXG5cdFx0KTtcblx0fSxcbn0pO1xuXG4vKipcbiAqIGBpbml0YCBydW5zIGV4YWN0bHkgb25jZSDigJQgdGhlIGZpcnN0IHRpbWUgdGhpcyBpdGVtIGlzIGRlZmluZWQgaW4gYW55XG4gKiBleHRlbnNpb24gY29udGV4dCBhZnRlciBpbnN0YWxsIOKAlCBhbmQgb25seSBpZiBub3RoaW5nIGlzIGluIHN0b3JhZ2UgeWV0LlxuICogR29vZCBmb3Igb25lLXRpbWUgSURzLCBmaXJzdC1ydW4gdGltZXN0YW1wcywgZXRjLlxuICovXG5leHBvcnQgY29uc3QgaW5zdGFsbElkSXRlbSA9IHN0b3JhZ2UuZGVmaW5lSXRlbTxzdHJpbmc+KFwibG9jYWw6aW5zdGFsbElkXCIsIHtcblx0aW5pdDogKCkgPT4gY3J5cHRvLnJhbmRvbVVVSUQoKSxcbn0pO1xuXG4vKipcbiAqIEEgcGxhaW4gY291bnRlciB3aXRoIGEgZmFsbGJhY2sgb2YgMC4gV3JpdHRlbiB0byBmcm9tIHRoZSBwb3B1cCAodmlhIHRoZVxuICogUmVhY3QgaG9vayksIHRoZSBiYWNrZ3JvdW5kIChvbiBhbiBhbGFybSArIG9uIG1lc3NhZ2UpLCBhbmQgcmVhZCBmcm9tXG4gKiBib3RoIOKAlCB0aGlzIGlzIHdoYXQgdGhlIFwiQ3Jvc3MtY29udGV4dFwiIHRhYiB1c2VzIHRvIHByb3ZlIGB3YXRjaCgpYCBmaXJlc1xuICogYWNyb3NzIGV4ZWN1dGlvbiBjb250ZXh0cy5cbiAqL1xuZXhwb3J0IGNvbnN0IGhlYXJ0YmVhdEl0ZW0gPSBzdG9yYWdlLmRlZmluZUl0ZW08bnVtYmVyPihcImxvY2FsOmhlYXJ0YmVhdFwiLCB7XG5cdGZhbGxiYWNrOiAwLFxufSk7XG5cbi8qKiBGaXhlZCBrZXlzIHVzZWQgYnkgdGhlIGJhdGNoLW9wZXJhdGlvbnMgdGFiLiAqL1xuZXhwb3J0IGNvbnN0IEJBVENIX0tFWVMgPSBbXG5cdFwibG9jYWw6YmF0Y2hBXCIsXG5cdFwibG9jYWw6YmF0Y2hCXCIsXG5cdFwibG9jYWw6YmF0Y2hDXCIsXG5dIGFzIGNvbnN0O1xuXG5leHBvcnQgaW50ZXJmYWNlIEFwcFNldHRpbmcge1xuXHR0aGVtZTogXCJsaWdodFwiIHwgXCJkYXJrXCI7XG5cdGZyZWU6IGJvb2xlYW47XG59XG5cbi8qKlxuICogVGhlIGB7IHRoZW1lOiAnZGFyaycsIGZyZWU6IHRydWUgfWAgc2hhcGUgZnJvbSB0aGUgXCJob3cgZG8gSSB1cGRhdGUgb25lXG4gKiBrZXlcIiBxdWVzdGlvbiDigJQgdXNlZCBieSBPYmplY3RVcGRhdGVQYW5lbC4gd2ViZXh0LXN0b3JlIHN0b3JlcyB0aGUgd2hvbGVcbiAqIHZhbHVlIGFzIG9uZSBKU09OIGJsb2IsIHNvIFwidXBkYXRpbmcgb25lIGtleVwiIGFsd2F5cyBtZWFucyByZWFkLW1vZGlmeS1cbiAqIHdyaXRlIHRoZSB3aG9sZSBvYmplY3QsIHNhbWUgYXMgeW91IHdvdWxkIHdpdGggcGxhaW4gUmVhY3Qgc3RhdGUuXG4gKi9cbmV4cG9ydCBjb25zdCBhcHBTZXR0aW5nSXRlbSA9IHN0b3JhZ2UuZGVmaW5lSXRlbTxBcHBTZXR0aW5nPihcblx0XCJsb2NhbDphcHBTZXR0aW5nXCIsXG5cdHtcblx0XHRmYWxsYmFjazogeyB0aGVtZTogXCJkYXJrXCIsIGZyZWU6IHRydWUgfSxcblx0fSxcbik7XG4iLCJpbXBvcnQgeyBoZWFydGJlYXRJdGVtIH0gZnJvbSBcIkAvdXRpbHMvc3RvcmFnZS1pdGVtc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb250ZW50U2NyaXB0KHtcblx0bWF0Y2hlczogW1wiKjovLyovKlwiXSxcblx0cnVuQXQ6IFwiZG9jdW1lbnRfaWRsZVwiLFxuXG5cdG1haW4oKSB7XG5cdFx0Ly8gTm8gUmVhY3QgaGVyZSBhdCBhbGwg4oCUIHByb3ZlcyB3ZWJleHQtc3RvcmUncyBjb3JlIEFQSSAoc3RvcmFnZSAvXG5cdFx0Ly8gZGVmaW5lSXRlbSkgd29ya3MgaW4gYSBwbGFpbiBjb250ZW50IHNjcmlwdCwgc2FtZSBhcyBhbnl3aGVyZSBlbHNlLlxuXHRcdGNvbnN0IGJhZGdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRiYWRnZS5zZXRBdHRyaWJ1dGUoXG5cdFx0XHRcInN0eWxlXCIsXG5cdFx0XHRbXG5cdFx0XHRcdFwicG9zaXRpb246Zml4ZWRcIixcblx0XHRcdFx0XCJib3R0b206MTJweFwiLFxuXHRcdFx0XHRcInJpZ2h0OjEycHhcIixcblx0XHRcdFx0XCJ6LWluZGV4OjIxNDc0ODM2NDdcIixcblx0XHRcdFx0XCJwYWRkaW5nOjZweCAxMHB4XCIsXG5cdFx0XHRcdFwiYm9yZGVyLXJhZGl1czo4cHhcIixcblx0XHRcdFx0XCJiYWNrZ3JvdW5kOiMxZTI5M2JcIixcblx0XHRcdFx0XCJjb2xvcjojNmVlN2I3XCIsXG5cdFx0XHRcdFwiZm9udDo2MDAgMTFweC8xLjQgbW9ub3NwYWNlXCIsXG5cdFx0XHRcdFwiYm94LXNoYWRvdzowIDJweCA4cHggcmdiYSgwLDAsMCwuMjUpXCIsXG5cdFx0XHRcdFwicG9pbnRlci1ldmVudHM6bm9uZVwiLFxuXHRcdFx0XHRcIm9wYWNpdHk6MC44NVwiLFxuXHRcdFx0XS5qb2luKFwiO1wiKSxcblx0XHQpO1xuXHRcdGJhZGdlLnRleHRDb250ZW50ID0gXCJ3ZWJleHQtc3RvcmUgaGVhcnRiZWF0OiDigKZcIjtcblx0XHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQoYmFkZ2UpO1xuXG5cdFx0Y29uc3QgcmVuZGVyID0gKG46IG51bWJlcikgPT4ge1xuXHRcdFx0YmFkZ2UudGV4dENvbnRlbnQgPSBgd2ViZXh0LXN0b3JlIGhlYXJ0YmVhdDogJHtufWA7XG5cdFx0fTtcblxuXHRcdGhlYXJ0YmVhdEl0ZW0uZ2V0VmFsdWUoKS50aGVuKHJlbmRlcik7XG5cblx0XHQvLyBGaXJlcyBmb3Igd3JpdGVzIGZyb20gdGhlIGJhY2tncm91bmQncyBhbGFybSwgdGhlIHBvcHVwJ3MgYnV0dG9uLFxuXHRcdC8vIGFuZCB0aGUgcG9wdXAncyBob29rIOKAlCB0aGlzIGNvbnRlbnQgc2NyaXB0IHNlZXMgYWxsIG9mIHRoZW0gZXF1YWxseS5cblx0XHRjb25zdCB1bndhdGNoID0gaGVhcnRiZWF0SXRlbS53YXRjaCgobmV3VmFsdWUpID0+IHJlbmRlcihuZXdWYWx1ZSkpO1xuXG5cdFx0Ly8gV1hUIHRlYXJzIGNvbnRlbnQgc2NyaXB0cyBkb3duIG9uIG5hdmlnYXRpb24vaW52YWxpZGF0aW9uIGZvciB1cztcblx0XHQvLyB0aGlzIGxpc3RlbmVyIGlzIGp1c3QgYmVsdC1hbmQtc3VzcGVuZGVycyBjbGVhbnVwLlxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZWhpZGVcIiwgdW53YXRjaCwgeyBvbmNlOiB0cnVlIH0pO1xuXHR9LFxufSk7XG4iLCIvLyNyZWdpb24gc3JjL3V0aWxzL2ludGVybmFsL2xvZ2dlci50c1xuZnVuY3Rpb24gcHJpbnQobWV0aG9kLCAuLi5hcmdzKSB7XG5cdGlmIChpbXBvcnQubWV0YS5lbnYuTU9ERSA9PT0gXCJwcm9kdWN0aW9uXCIpIHJldHVybjtcblx0aWYgKHR5cGVvZiBhcmdzWzBdID09PSBcInN0cmluZ1wiKSBtZXRob2QoYFt3eHRdICR7YXJncy5zaGlmdCgpfWAsIC4uLmFyZ3MpO1xuXHRlbHNlIG1ldGhvZChcIlt3eHRdXCIsIC4uLmFyZ3MpO1xufVxuLyoqIFdyYXBwZXIgYXJvdW5kIGBjb25zb2xlYCB3aXRoIGEgXCJbd3h0XVwiIHByZWZpeCAqL1xuY29uc3QgbG9nZ2VyID0ge1xuXHRkZWJ1ZzogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZGVidWcsIC4uLmFyZ3MpLFxuXHRsb2c6ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLmxvZywgLi4uYXJncyksXG5cdHdhcm46ICguLi5hcmdzKSA9PiBwcmludChjb25zb2xlLndhcm4sIC4uLmFyZ3MpLFxuXHRlcnJvcjogKC4uLmFyZ3MpID0+IHByaW50KGNvbnNvbGUuZXJyb3IsIC4uLmFyZ3MpXG59O1xuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBsb2dnZXIgfTtcbiIsIi8vICNyZWdpb24gc25pcHBldFxuZXhwb3J0IGNvbnN0IGJyb3dzZXIgPSBnbG9iYWxUaGlzLmJyb3dzZXI/LnJ1bnRpbWU/LmlkXG4gID8gZ2xvYmFsVGhpcy5icm93c2VyXG4gIDogZ2xvYmFsVGhpcy5jaHJvbWU7XG4vLyAjZW5kcmVnaW9uIHNuaXBwZXRcbiIsImltcG9ydCB7IGJyb3dzZXIgYXMgYnJvd3NlciQxIH0gZnJvbSBcIkB3eHQtZGV2L2Jyb3dzZXJcIjtcbi8vI3JlZ2lvbiBzcmMvYnJvd3Nlci50c1xuLyoqXG4qIENvbnRhaW5zIHRoZSBgYnJvd3NlcmAgZXhwb3J0IHdoaWNoIHlvdSBzaG91bGQgdXNlIHRvIGFjY2VzcyB0aGUgZXh0ZW5zaW9uXG4qIEFQSXMgaW4geW91ciBwcm9qZWN0OlxuKlxuKiBgYGB0c1xuKiBpbXBvcnQgeyBicm93c2VyIH0gZnJvbSAnd3h0L2Jyb3dzZXInO1xuKlxuKiBicm93c2VyLnJ1bnRpbWUub25JbnN0YWxsZWQuYWRkTGlzdGVuZXIoKCkgPT4ge1xuKiAgIC8vIC4uLlxuKiB9KTtcbiogYGBgXG4qXG4qIEBtb2R1bGUgd3h0L2Jyb3dzZXJcbiovXG5jb25zdCBicm93c2VyID0gYnJvd3NlciQxO1xuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBicm93c2VyIH07XG4iLCJpbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG4vLyNyZWdpb24gc3JjL3V0aWxzL2ludGVybmFsL2N1c3RvbS1ldmVudHMudHNcbnZhciBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50ID0gY2xhc3MgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCBleHRlbmRzIEV2ZW50IHtcblx0c3RhdGljIEVWRU5UX05BTUUgPSBnZXRVbmlxdWVFdmVudE5hbWUoXCJ3eHQ6bG9jYXRpb25jaGFuZ2VcIik7XG5cdGNvbnN0cnVjdG9yKG5ld1VybCwgb2xkVXJsKSB7XG5cdFx0c3VwZXIoV3h0TG9jYXRpb25DaGFuZ2VFdmVudC5FVkVOVF9OQU1FLCB7fSk7XG5cdFx0dGhpcy5uZXdVcmwgPSBuZXdVcmw7XG5cdFx0dGhpcy5vbGRVcmwgPSBvbGRVcmw7XG5cdH1cbn07XG4vKipcbiogUmV0dXJucyBhbiBldmVudCBuYW1lIHVuaXF1ZSB0byB0aGUgZXh0ZW5zaW9uIGFuZCBjb250ZW50IHNjcmlwdCB0aGF0J3NcbiogcnVubmluZy5cbiovXG5mdW5jdGlvbiBnZXRVbmlxdWVFdmVudE5hbWUoZXZlbnROYW1lKSB7XG5cdHJldHVybiBgJHticm93c2VyPy5ydW50aW1lPy5pZH06JHtpbXBvcnQubWV0YS5lbnYuRU5UUllQT0lOVH06JHtldmVudE5hbWV9YDtcbn1cbi8vI2VuZHJlZ2lvblxuZXhwb3J0IHsgV3h0TG9jYXRpb25DaGFuZ2VFdmVudCwgZ2V0VW5pcXVlRXZlbnROYW1lIH07XG4iLCJpbXBvcnQgeyBXeHRMb2NhdGlvbkNoYW5nZUV2ZW50IH0gZnJvbSBcIi4vY3VzdG9tLWV2ZW50cy5tanNcIjtcbi8vI3JlZ2lvbiBzcmMvdXRpbHMvaW50ZXJuYWwvbG9jYXRpb24td2F0Y2hlci50c1xuY29uc3Qgc3VwcG9ydHNOYXZpZ2F0aW9uQXBpID0gdHlwZW9mIGdsb2JhbFRoaXMubmF2aWdhdGlvbj8uYWRkRXZlbnRMaXN0ZW5lciA9PT0gXCJmdW5jdGlvblwiO1xuLyoqXG4qIENyZWF0ZSBhIHV0aWwgdGhhdCB3YXRjaGVzIGZvciBVUkwgY2hhbmdlcywgZGlzcGF0Y2hpbmcgdGhlIGN1c3RvbSBldmVudCB3aGVuXG4qIGRldGVjdGVkLiBTdG9wcyB3YXRjaGluZyB3aGVuIGNvbnRlbnQgc2NyaXB0IGlzIGludmFsaWRhdGVkLiBVc2VzIE5hdmlnYXRpb25cbiogQVBJIHdoZW4gYXZhaWxhYmxlLCBvdGhlcndpc2UgZmFsbHMgYmFjayB0byBwb2xsaW5nLlxuKi9cbmZ1bmN0aW9uIGNyZWF0ZUxvY2F0aW9uV2F0Y2hlcihjdHgpIHtcblx0bGV0IGxhc3RVcmw7XG5cdGxldCB3YXRjaGluZyA9IGZhbHNlO1xuXHRyZXR1cm4geyBydW4oKSB7XG5cdFx0aWYgKHdhdGNoaW5nKSByZXR1cm47XG5cdFx0d2F0Y2hpbmcgPSB0cnVlO1xuXHRcdGxhc3RVcmwgPSBuZXcgVVJMKGxvY2F0aW9uLmhyZWYpO1xuXHRcdGlmIChzdXBwb3J0c05hdmlnYXRpb25BcGkpIGdsb2JhbFRoaXMubmF2aWdhdGlvbi5hZGRFdmVudExpc3RlbmVyKFwibmF2aWdhdGVcIiwgKGV2ZW50KSA9PiB7XG5cdFx0XHRjb25zdCBuZXdVcmwgPSBuZXcgVVJMKGV2ZW50LmRlc3RpbmF0aW9uLnVybCk7XG5cdFx0XHRpZiAobmV3VXJsLmhyZWYgPT09IGxhc3RVcmwuaHJlZikgcmV0dXJuO1xuXHRcdFx0d2luZG93LmRpc3BhdGNoRXZlbnQobmV3IFd4dExvY2F0aW9uQ2hhbmdlRXZlbnQobmV3VXJsLCBsYXN0VXJsKSk7XG5cdFx0XHRsYXN0VXJsID0gbmV3VXJsO1xuXHRcdH0sIHsgc2lnbmFsOiBjdHguc2lnbmFsIH0pO1xuXHRcdGVsc2UgY3R4LnNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGNvbnN0IG5ld1VybCA9IG5ldyBVUkwobG9jYXRpb24uaHJlZik7XG5cdFx0XHRpZiAobmV3VXJsLmhyZWYgIT09IGxhc3RVcmwuaHJlZikge1xuXHRcdFx0XHR3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgV3h0TG9jYXRpb25DaGFuZ2VFdmVudChuZXdVcmwsIGxhc3RVcmwpKTtcblx0XHRcdFx0bGFzdFVybCA9IG5ld1VybDtcblx0XHRcdH1cblx0XHR9LCAxZTMpO1xuXHR9IH07XG59XG4vLyNlbmRyZWdpb25cbmV4cG9ydCB7IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlciB9O1xuIiwiaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSBcIi4vaW50ZXJuYWwvbG9nZ2VyLm1qc1wiO1xuaW1wb3J0IHsgZ2V0VW5pcXVlRXZlbnROYW1lIH0gZnJvbSBcIi4vaW50ZXJuYWwvY3VzdG9tLWV2ZW50cy5tanNcIjtcbmltcG9ydCB7IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlciB9IGZyb20gXCIuL2ludGVybmFsL2xvY2F0aW9uLXdhdGNoZXIubWpzXCI7XG5pbXBvcnQgeyBicm93c2VyIH0gZnJvbSBcInd4dC9icm93c2VyXCI7XG4vLyNyZWdpb24gc3JjL3V0aWxzL2NvbnRlbnQtc2NyaXB0LWNvbnRleHQudHNcbi8qKlxuKiBJbXBsZW1lbnRzXG4qIFtgQWJvcnRDb250cm9sbGVyYF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0Fib3J0Q29udHJvbGxlcikuXG4qIFVzZWQgdG8gZGV0ZWN0IGFuZCBzdG9wIGNvbnRlbnQgc2NyaXB0IGNvZGUgd2hlbiB0aGUgc2NyaXB0IGlzIGludmFsaWRhdGVkLlxuKlxuKiBJdCBhbHNvIHByb3ZpZGVzIHNldmVyYWwgdXRpbGl0aWVzIGxpa2UgYGN0eC5zZXRUaW1lb3V0YCBhbmRcbiogYGN0eC5zZXRJbnRlcnZhbGAgdGhhdCBzaG91bGQgYmUgdXNlZCBpbiBjb250ZW50IHNjcmlwdHMgaW5zdGVhZCBvZlxuKiBgd2luZG93LnNldFRpbWVvdXRgIG9yIGB3aW5kb3cuc2V0SW50ZXJ2YWxgLlxuKlxuKiBUbyBjcmVhdGUgY29udGV4dCBmb3IgdGVzdGluZywgeW91IGNhbiB1c2UgdGhlIGNsYXNzJ3MgY29uc3RydWN0b3I6XG4qXG4qIGBgYHRzXG4qIGltcG9ydCB7IENvbnRlbnRTY3JpcHRDb250ZXh0IH0gZnJvbSAnd3h0L3V0aWxzL2NvbnRlbnQtc2NyaXB0cy1jb250ZXh0JztcbipcbiogdGVzdCgnc3RvcmFnZSBsaXN0ZW5lciBzaG91bGQgYmUgcmVtb3ZlZCB3aGVuIGNvbnRleHQgaXMgaW52YWxpZGF0ZWQnLCAoKSA9PiB7XG4qICAgY29uc3QgY3R4ID0gbmV3IENvbnRlbnRTY3JpcHRDb250ZXh0KCd0ZXN0Jyk7XG4qICAgY29uc3QgaXRlbSA9IHN0b3JhZ2UuZGVmaW5lSXRlbSgnbG9jYWw6Y291bnQnLCB7IGRlZmF1bHRWYWx1ZTogMCB9KTtcbiogICBjb25zdCB3YXRjaGVyID0gdmkuZm4oKTtcbipcbiogICBjb25zdCB1bndhdGNoID0gaXRlbS53YXRjaCh3YXRjaGVyKTtcbiogICBjdHgub25JbnZhbGlkYXRlZCh1bndhdGNoKTsgLy8gTGlzdGVuIGZvciBpbnZhbGlkYXRlIGhlcmVcbipcbiogICBhd2FpdCBpdGVtLnNldFZhbHVlKDEpO1xuKiAgIGV4cGVjdCh3YXRjaGVyKS50b0JlQ2FsbGVkVGltZXMoMSk7XG4qICAgZXhwZWN0KHdhdGNoZXIpLnRvQmVDYWxsZWRXaXRoKDEsIDApO1xuKlxuKiAgIGN0eC5ub3RpZnlJbnZhbGlkYXRlZCgpOyAvLyBVc2UgdGhpcyBmdW5jdGlvbiB0byBpbnZhbGlkYXRlIHRoZSBjb250ZXh0XG4qICAgYXdhaXQgaXRlbS5zZXRWYWx1ZSgyKTtcbiogICBleHBlY3Qod2F0Y2hlcikudG9CZUNhbGxlZFRpbWVzKDEpO1xuKiB9KTtcbiogYGBgXG4qL1xudmFyIENvbnRlbnRTY3JpcHRDb250ZXh0ID0gY2xhc3MgQ29udGVudFNjcmlwdENvbnRleHQge1xuXHRzdGF0aWMgU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFID0gZ2V0VW5pcXVlRXZlbnROYW1lKFwid3h0OmNvbnRlbnQtc2NyaXB0LXN0YXJ0ZWRcIik7XG5cdGlkO1xuXHRhYm9ydENvbnRyb2xsZXI7XG5cdGxvY2F0aW9uV2F0Y2hlciA9IGNyZWF0ZUxvY2F0aW9uV2F0Y2hlcih0aGlzKTtcblx0Y29uc3RydWN0b3IoY29udGVudFNjcmlwdE5hbWUsIG9wdGlvbnMpIHtcblx0XHR0aGlzLmNvbnRlbnRTY3JpcHROYW1lID0gY29udGVudFNjcmlwdE5hbWU7XG5cdFx0dGhpcy5vcHRpb25zID0gb3B0aW9ucztcblx0XHR0aGlzLmlkID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMik7XG5cdFx0dGhpcy5hYm9ydENvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG5cdFx0dGhpcy5zdG9wT2xkU2NyaXB0cygpO1xuXHRcdHRoaXMubGlzdGVuRm9yTmV3ZXJTY3JpcHRzKCk7XG5cdH1cblx0Z2V0IHNpZ25hbCgpIHtcblx0XHRyZXR1cm4gdGhpcy5hYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuXHR9XG5cdGFib3J0KHJlYXNvbikge1xuXHRcdHJldHVybiB0aGlzLmFib3J0Q29udHJvbGxlci5hYm9ydChyZWFzb24pO1xuXHR9XG5cdGdldCBpc0ludmFsaWQoKSB7XG5cdFx0aWYgKGJyb3dzZXIucnVudGltZT8uaWQgPT0gbnVsbCkgdGhpcy5ub3RpZnlJbnZhbGlkYXRlZCgpO1xuXHRcdHJldHVybiB0aGlzLnNpZ25hbC5hYm9ydGVkO1xuXHR9XG5cdGdldCBpc1ZhbGlkKCkge1xuXHRcdHJldHVybiAhdGhpcy5pc0ludmFsaWQ7XG5cdH1cblx0LyoqXG5cdCogQWRkIGEgbGlzdGVuZXIgdGhhdCBpcyBjYWxsZWQgd2hlbiB0aGUgY29udGVudCBzY3JpcHQncyBjb250ZXh0IGlzXG5cdCogaW52YWxpZGF0ZWQuXG5cdCpcblx0KiBAZXhhbXBsZVxuXHQqICAgYnJvd3Nlci5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihjYik7XG5cdCogICBjb25zdCByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyID0gY3R4Lm9uSW52YWxpZGF0ZWQoKCkgPT4ge1xuXHQqICAgICBicm93c2VyLnJ1bnRpbWUub25NZXNzYWdlLnJlbW92ZUxpc3RlbmVyKGNiKTtcblx0KiAgIH0pO1xuXHQqICAgLy8gLi4uXG5cdCogICByZW1vdmVJbnZhbGlkYXRlZExpc3RlbmVyKCk7XG5cdCpcblx0KiBAcmV0dXJucyBBIGZ1bmN0aW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXIuXG5cdCovXG5cdG9uSW52YWxpZGF0ZWQoY2IpIHtcblx0XHR0aGlzLnNpZ25hbC5hZGRFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgY2IpO1xuXHRcdHJldHVybiAoKSA9PiB0aGlzLnNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKFwiYWJvcnRcIiwgY2IpO1xuXHR9XG5cdC8qKlxuXHQqIFJldHVybiBhIHByb21pc2UgdGhhdCBuZXZlciByZXNvbHZlcy4gVXNlZnVsIGlmIHlvdSBoYXZlIGFuIGFzeW5jIGZ1bmN0aW9uXG5cdCogdGhhdCBzaG91bGRuJ3QgcnVuIGFmdGVyIHRoZSBjb250ZXh0IGlzIGV4cGlyZWQuXG5cdCpcblx0KiBAZXhhbXBsZVxuXHQqICAgY29uc3QgZ2V0VmFsdWVGcm9tU3RvcmFnZSA9IGFzeW5jICgpID0+IHtcblx0KiAgICAgaWYgKGN0eC5pc0ludmFsaWQpIHJldHVybiBjdHguYmxvY2soKTtcblx0KlxuXHQqICAgICAvLyAuLi5cblx0KiAgIH07XG5cdCovXG5cdGJsb2NrKCkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgoKSA9PiB7fSk7XG5cdH1cblx0LyoqXG5cdCogV3JhcHBlciBhcm91bmQgYHdpbmRvdy5zZXRJbnRlcnZhbGAgdGhhdCBhdXRvbWF0aWNhbGx5IGNsZWFycyB0aGUgaW50ZXJ2YWxcblx0KiB3aGVuIGludmFsaWRhdGVkLlxuXHQqXG5cdCogSW50ZXJ2YWxzIGNhbiBiZSBjbGVhcmVkIGJ5IGNhbGxpbmcgdGhlIG5vcm1hbCBgY2xlYXJJbnRlcnZhbGAgZnVuY3Rpb24uXG5cdCovXG5cdHNldEludGVydmFsKGhhbmRsZXIsIHRpbWVvdXQpIHtcblx0XHRjb25zdCBpZCA9IHNldEludGVydmFsKCgpID0+IHtcblx0XHRcdGlmICh0aGlzLmlzVmFsaWQpIGhhbmRsZXIoKTtcblx0XHR9LCB0aW1lb3V0KTtcblx0XHR0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2xlYXJJbnRlcnZhbChpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHQvKipcblx0KiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnNldFRpbWVvdXRgIHRoYXQgYXV0b21hdGljYWxseSBjbGVhcnMgdGhlIGludGVydmFsXG5cdCogd2hlbiBpbnZhbGlkYXRlZC5cblx0KlxuXHQqIFRpbWVvdXRzIGNhbiBiZSBjbGVhcmVkIGJ5IGNhbGxpbmcgdGhlIG5vcm1hbCBgc2V0VGltZW91dGAgZnVuY3Rpb24uXG5cdCovXG5cdHNldFRpbWVvdXQoaGFuZGxlciwgdGltZW91dCkge1xuXHRcdGNvbnN0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRpZiAodGhpcy5pc1ZhbGlkKSBoYW5kbGVyKCk7XG5cdFx0fSwgdGltZW91dCk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNsZWFyVGltZW91dChpZCkpO1xuXHRcdHJldHVybiBpZDtcblx0fVxuXHQvKipcblx0KiBXcmFwcGVyIGFyb3VuZCBgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZWAgdGhhdCBhdXRvbWF0aWNhbGx5IGNhbmNlbHNcblx0KiB0aGUgcmVxdWVzdCB3aGVuIGludmFsaWRhdGVkLlxuXHQqXG5cdCogQ2FsbGJhY2tzIGNhbiBiZSBjYW5jZWxlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYGNhbmNlbEFuaW1hdGlvbkZyYW1lYFxuXHQqIGZ1bmN0aW9uLlxuXHQqL1xuXHRyZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spIHtcblx0XHRjb25zdCBpZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoLi4uYXJncykgPT4ge1xuXHRcdFx0aWYgKHRoaXMuaXNWYWxpZCkgY2FsbGJhY2soLi4uYXJncyk7XG5cdFx0fSk7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKSk7XG5cdFx0cmV0dXJuIGlkO1xuXHR9XG5cdC8qKlxuXHQqIFdyYXBwZXIgYXJvdW5kIGB3aW5kb3cucmVxdWVzdElkbGVDYWxsYmFja2AgdGhhdCBhdXRvbWF0aWNhbGx5IGNhbmNlbHMgdGhlXG5cdCogcmVxdWVzdCB3aGVuIGludmFsaWRhdGVkLlxuXHQqXG5cdCogQ2FsbGJhY2tzIGNhbiBiZSBjYW5jZWxlZCBieSBjYWxsaW5nIHRoZSBub3JtYWwgYGNhbmNlbElkbGVDYWxsYmFja2Bcblx0KiBmdW5jdGlvbi5cblx0Ki9cblx0cmVxdWVzdElkbGVDYWxsYmFjayhjYWxsYmFjaywgb3B0aW9ucykge1xuXHRcdGNvbnN0IGlkID0gcmVxdWVzdElkbGVDYWxsYmFjaygoLi4uYXJncykgPT4ge1xuXHRcdFx0aWYgKCF0aGlzLnNpZ25hbC5hYm9ydGVkKSBjYWxsYmFjayguLi5hcmdzKTtcblx0XHR9LCBvcHRpb25zKTtcblx0XHR0aGlzLm9uSW52YWxpZGF0ZWQoKCkgPT4gY2FuY2VsSWRsZUNhbGxiYWNrKGlkKSk7XG5cdFx0cmV0dXJuIGlkO1xuXHR9XG5cdGFkZEV2ZW50TGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBoYW5kbGVyLCBvcHRpb25zKSB7XG5cdFx0aWYgKHR5cGUgPT09IFwid3h0OmxvY2F0aW9uY2hhbmdlXCIpIHtcblx0XHRcdGlmICh0aGlzLmlzVmFsaWQpIHRoaXMubG9jYXRpb25XYXRjaGVyLnJ1bigpO1xuXHRcdH1cblx0XHR0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcj8uKHR5cGUuc3RhcnRzV2l0aChcInd4dDpcIikgPyBnZXRVbmlxdWVFdmVudE5hbWUodHlwZSkgOiB0eXBlLCBoYW5kbGVyLCB7XG5cdFx0XHQuLi5vcHRpb25zLFxuXHRcdFx0c2lnbmFsOiB0aGlzLnNpZ25hbFxuXHRcdH0pO1xuXHR9XG5cdC8qKlxuXHQqIEBpbnRlcm5hbFxuXHQqIEFib3J0IHRoZSBhYm9ydCBjb250cm9sbGVyIGFuZCBleGVjdXRlIGFsbCBgb25JbnZhbGlkYXRlZGAgbGlzdGVuZXJzLlxuXHQqL1xuXHRub3RpZnlJbnZhbGlkYXRlZCgpIHtcblx0XHR0aGlzLmFib3J0KFwiQ29udGVudCBzY3JpcHQgY29udGV4dCBpbnZhbGlkYXRlZFwiKTtcblx0XHRsb2dnZXIuZGVidWcoYENvbnRlbnQgc2NyaXB0IFwiJHt0aGlzLmNvbnRlbnRTY3JpcHROYW1lfVwiIGNvbnRleHQgaW52YWxpZGF0ZWRgKTtcblx0fVxuXHRzdG9wT2xkU2NyaXB0cygpIHtcblx0XHRkb2N1bWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChDb250ZW50U2NyaXB0Q29udGV4dC5TQ1JJUFRfU1RBUlRFRF9NRVNTQUdFX1RZUEUsIHsgZGV0YWlsOiB7XG5cdFx0XHRjb250ZW50U2NyaXB0TmFtZTogdGhpcy5jb250ZW50U2NyaXB0TmFtZSxcblx0XHRcdG1lc3NhZ2VJZDogdGhpcy5pZFxuXHRcdH0gfSkpO1xuXHRcdGlmICghdGhpcy5vcHRpb25zPy5ub1NjcmlwdFN0YXJ0ZWRQb3N0TWVzc2FnZSkgd2luZG93LnBvc3RNZXNzYWdlKHtcblx0XHRcdHR5cGU6IENvbnRlbnRTY3JpcHRDb250ZXh0LlNDUklQVF9TVEFSVEVEX01FU1NBR0VfVFlQRSxcblx0XHRcdGNvbnRlbnRTY3JpcHROYW1lOiB0aGlzLmNvbnRlbnRTY3JpcHROYW1lLFxuXHRcdFx0bWVzc2FnZUlkOiB0aGlzLmlkXG5cdFx0fSwgXCIqXCIpO1xuXHR9XG5cdHZlcmlmeVNjcmlwdFN0YXJ0ZWRFdmVudChldmVudCkge1xuXHRcdGNvbnN0IGlzU2FtZUNvbnRlbnRTY3JpcHQgPSBldmVudC5kZXRhaWw/LmNvbnRlbnRTY3JpcHROYW1lID09PSB0aGlzLmNvbnRlbnRTY3JpcHROYW1lO1xuXHRcdGNvbnN0IGlzRnJvbVNlbGYgPSBldmVudC5kZXRhaWw/Lm1lc3NhZ2VJZCA9PT0gdGhpcy5pZDtcblx0XHRyZXR1cm4gaXNTYW1lQ29udGVudFNjcmlwdCAmJiAhaXNGcm9tU2VsZjtcblx0fVxuXHRsaXN0ZW5Gb3JOZXdlclNjcmlwdHMoKSB7XG5cdFx0Y29uc3QgY2IgPSAoZXZlbnQpID0+IHtcblx0XHRcdGlmICghKGV2ZW50IGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQpIHx8ICF0aGlzLnZlcmlmeVNjcmlwdFN0YXJ0ZWRFdmVudChldmVudCkpIHJldHVybjtcblx0XHRcdHRoaXMubm90aWZ5SW52YWxpZGF0ZWQoKTtcblx0XHR9O1xuXHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLCBjYik7XG5cdFx0dGhpcy5vbkludmFsaWRhdGVkKCgpID0+IGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoQ29udGVudFNjcmlwdENvbnRleHQuU0NSSVBUX1NUQVJURURfTUVTU0FHRV9UWVBFLCBjYikpO1xuXHR9XG59O1xuLy8jZW5kcmVnaW9uXG5leHBvcnQgeyBDb250ZW50U2NyaXB0Q29udGV4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