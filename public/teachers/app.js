/**
 * @file Teachers' app entry point: starts the router with the teachers'
 * routes. It has no manifest or service worker yet (ADR 0012), so it cannot
 * be installed.
 */

import { startRouter } from '../js/router.js';
import { routes, pickTeacherDefault } from './js/router.js';
import { listenRipples } from '../components/ripple/ripple.js';
import { connect } from '../js/firebase/connection.js';

// Here and not in a screen, so it runs once and works on any first screen
listenRipples();
connect('teachers');
startRouter(routes, pickTeacherDefault);
