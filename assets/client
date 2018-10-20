/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* global window document */
	'use strict';
	const React = __webpack_require__(1);
	const ReactDOM = __webpack_require__(2);
	const AppComponent = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./components/app\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));


	const App = React.createFactory(AppComponent);
	const mountNode = document.getElementById('app-mount');
	const serverState = window.state;


	ReactDOM.hydrate(App(serverState), mountNode);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	if (process.env.NODE_ENV === 'production') {
	  module.exports = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./cjs/react.production.min.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	} else {
	  module.exports = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./cjs/react.development.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./../../../../../.npm-global/lib/node_modules/webpack/node_modules/process/browser.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))))

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	function checkDCE() {
	  /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
	  if (
	    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined' ||
	    typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== 'function'
	  ) {
	    return;
	  }
	  if (process.env.NODE_ENV !== 'production') {
	    // This branch is unreachable because this function is only called
	    // in production, but the condition is true only in development.
	    // Therefore if the branch is still here, dead code elimination wasn't
	    // properly applied.
	    // Don't change the message. React DevTools relies on it. Also make sure
	    // this message doesn't occur elsewhere in this function, or it will cause
	    // a false positive.
	    throw new Error('^_^');
	  }
	  try {
	    // Verify that the code above has been dead code eliminated (DCE'd).
	    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
	  } catch (err) {
	    // DevTools shouldn't crash React, no matter what.
	    // We should still report in case we break this code.
	    console.error(err);
	  }
	}

	if (process.env.NODE_ENV === 'production') {
	  // DCE check should happen before ReactDOM bundle executes so that
	  // DevTools can report bad minification during injection.
	  checkDCE();
	  module.exports = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./cjs/react-dom.production.min.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	} else {
	  module.exports = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./cjs/react-dom.development.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"./../../../../../.npm-global/lib/node_modules/webpack/node_modules/process/browser.js\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()))))

/***/ }
/******/ ]);