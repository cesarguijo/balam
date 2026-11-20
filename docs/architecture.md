# Architecture

How Balam's files connect. The ADRs in `decisions/` explain **why**; this
page shows **what talks to what**. Update it when a flow changes.

## The layers

Every data flow goes through the same four layers. Each one only knows the
one below it.

```mermaid
flowchart TD
  S[Screen<br/>public/screens/name/] --> L[App logic<br/>public/js/name.js]
  L --> A[Adapter<br/>public/js/firebase/name-adapter.js]
  A --> F[(Server<br/>Firebase today, PHP tomorrow)]
```

- **Screen**: draws. Never imports Firebase.
- **App logic**: the rules (dates, the copy on the phone). It is the same
  with Firebase or PHP.
- **Adapter**: only talks to the server and turns its errors into the app's
  errors. Moving to PHP means writing a new adapter with the same functions
  (ADR 0008).
- **Pure files** (`family.js`, `notice.js`, `list-state.js`, `tabs.js`):
  check and transform data. Any layer can use them; they are tested in Node.

## Session (the family)

```mermaid
flowchart TD
  Login[screens/login/login.js] -- "logIn()" --> Session[js/session.js]
  Notices[screens/notices/notices.js] -- "getSession()" --> Session
  Session -- "saves / reads the copy" --> LS[(localStorage<br/>key: family)]
  Session --> Adapter[js/firebase/session-adapter.js]
  Adapter --> Auth[(Firebase Auth + Firestore<br/>families/uid)]
  Session -. "toFamily()" .-> Family[js/family.js]
  Adapter -. "toFamily()" .-> Family
```

Screens never pass the family to each other: they all ask `getSession()`.
That way a screen works the same whether the parent just logged in or opened
the app the next day.

## Notices

```mermaid
flowchart TD
  Screen[screens/notices/notices.js] -- "getRecentNotices(groupId)" --> Notices[js/notices.js]
  Screen -. "getListState()" .-> State[screens/notices/list-state.js]
  Screen -. "getNoticeTabs()" .-> Tabs[screens/notices/tabs.js]
  Notices -. "getCutoffDate()" .-> Notice[js/notice.js]
  Notices -- "getNoticesSince(groupId, cutoff)" --> Adapter[js/firebase/notices-adapter.js]
  Adapter -. "toNotice()" .-> Notice
  Adapter --> Firestore[(Firestore<br/>notices)]
```

The screen gets the children's groups from the session, then asks for each
group's notices. Notices are not stored on the phone yet: with no internet,
`getRecentNotices` throws a `NoticeError` with type `offline`.
