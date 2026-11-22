# 0011. Use Balam without installing it

- **Date:** 2026-11-20
- **Status:** accepted (supersedes [0007](0007-entry-flow.md))

## Context

ADR 0007 made the browser only for installing: on the phone, the welcome screen asked the family to install Balam, and only the installed app showed the login.

A parent could not install Balam: their phone is old and low-end. With 0007, that family could not use Balam at all. Installing a PWA depends on the browser, the system version and the free space, and we cannot fix any of that for the families.

## Decision

On the phone, the family logs in and uses Balam right away, installed or not. Installing becomes an optional banner inside the app.

| Platform | Session | Screen      |
| -------- | ------- | ----------- |
| desktop  | —       | `#/welcome` |
| phone    | no      | `#/login`   |
| phone    | yes     | `#/notices` |

`decideRoute` (pure, tested in Node) only decides when the route is missing or unknown. The banner (`<balam-install-banner>`) shows on the phone, in the browser, while Balam is not installed and the family has not closed it. "Instalar" opens the browser's dialog, or the welcome screen with the steps when the browser has none. "Ahora no" closes it for good on that phone.

## Alternatives considered

- **Keep 0007 and help that family by hand:** it does not scale; any old phone would leave a family out.
- **Show the welcome screen first, with an "Entrar sin instalar" button:** one more screen and one more decision for parents who just want to see the notices.
- **Show the banner again after some days:** it nags parents whose phone cannot install. It can be added later if few families install.

## Consequences

**We gain:**

- Every family with a browser can use Balam.
- Three cases instead of four: the phone does not care whether it is installed.

**We accept:**

- **On iPhone, a family that logs in in Safari and installs later logs in twice**, because the installed app does not share the session with Safari. It is a one-time cost.
- Some parents will use Balam from a browser tab, which can get closed or lost. The banner reminds them once.
- Security does not change: as in 0007, it lives in the Firebase rules, not in the flow.

**Revisit the decision if:** few families install Balam and that hurts (for example, if notifications need the installed app).
