# 0007. Entry flow: the browser installs, the app logs in

- **Date:** 2026-11-13
- **Status:** accepted

## Context

Balam must be used only by the families of the class, so it needs a login. We had to decide which screen each person sees when opening Balam: in the browser or in the installed app, on a phone or on a computer, with a session or without one.

The conditions that mattered:

- **Balam is for phones.** The student has no phone of their own: they use the parent's, and the parent is the one who keeps the account. The teacher does not need features on the computer either; if they prepare something there, they pass it as a file (JSON or Excel) and load it from the phone.
- **Parents must not fight with technology.** As with WhatsApp, they should log in once and never again.
- **Nobody can be stopped from installing a PWA.** Anyone who opens `balam-math.web.app` can install it from the browser menu, even if the page shows no button. What we do control is what they see when they open it.
- **On iPhone, the installed app does not share the session with Safari.** If the session were asked for in the browser, the parent would have to log in twice. On Android it is shared.

## Decision

The browser is only for installing, and the installed app is the only way in:

| Platform | Installed | Session | Screen      |
| -------- | --------- | ------- | ----------- |
| desktop  | —         | —       | `#/welcome` |
| phone    | no        | —       | `#/welcome` |
| phone    | yes       | no      | `#/login`   |
| phone    | yes       | yes     | `#/home`    |

On the computer the welcome screen is always shown, which points to the phone with the QR code, **even if someone installs the app from the Chrome or Edge menu** (computers can install PWAs too). A route typed by hand does not change the result: the decision is made by a pure function (`decideRoute`) that is tested in Node.

## Alternatives considered

- **Log in in the browser before installing:** it forces iPhone parents to log in twice, and it protects nothing, because installing cannot be prevented.
- **Allow using Balam in the browser without installing:** some parents would never install it and would use it from a tab that gets closed or lost.
- **Different cases per platform (Android, iPhone, desktop):** it worked, but it had six cases instead of four and was harder to test and to explain.
- **Teacher access from the computer (with an "I am the teacher" button or with a QR code, like WhatsApp Web):** the QR code needs a server that creates sessions (Cloud Functions, paid plan). Today there is no desktop feature that justifies it.

## Consequences

**We gain:**

- Four cases, easy to test and to explain to families: "install the app and log in with your username".
- Phones have no differences between them: Android and iPhone follow the same rules.
- The computer does not check the session.

**We accept:**

- The welcome screen and the install instructions are public. It is not a problem: they hold nobody's data.
- **Security is not in the flow, but on the server.** Firebase rules (and later PHP) must deny data to anyone without a session, and give each family only its own. Hiding screens protects nothing.
- The teacher has no web access: they work from the phone.

**Revisit the decision if:** the teacher needs features that do not fit on the phone, or if Balam stops being only for the class.
