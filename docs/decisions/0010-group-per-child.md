# 0010. Each child has a group: grade and section in its own field

- **Date:** 2026-11-18
- **Status:** accepted

## Context

Notices are for a group (`groupId`), and the Firestore rules use it so each family reads only its group's notices. But the family document does not say which group each child is in: each child only has `id`, `name` and `grade`.

The conditions that mattered:

- Some grades have several sections (e.g. 7-1 and 7-2), and a notice may be for only one of them.
- A family can have children in different grades or sections, so a family can belong to several groups.
- `grade` is already used to know which grade the child is in (and later, which math content applies).

## Decision

Each child gets a new field, `groupId`, with the grade and section (e.g. `'7-1'`). `grade` stays as it is.

```js
{ id, name, grade: 7, groupId: '7-1' }
```

The screen asks for the notices of the child the parent is viewing, using that child's `groupId`.

## Alternatives considered

- **Use `grade` as the group:** it needs no new data, but it cannot tell sections apart.
- **Write the section inside `grade` (`'7-1'`):** it mixes two things in one field. Every place that needs the grade would have to split the text, and `grade` would stop being a number.
- **A `groups` collection in Firestore:** more flexible (a group could have a name, a teacher, a year), but more work and more reads. Not needed yet.

## Consequences

**We gain:**

- Each field says one thing: `grade` is the grade, `groupId` is who receives the notice.
- A notice can be for one section only.
- Siblings in different groups work without extra steps: each child brings their own group.

**We accept:**

- `toFamily` must validate `groupId`, and the `Child` type must include it.
- The families already in Firestore need `groupId` added to each child (with the script that creates the accounts).
- The rules must check that the family has a child in the notice's group.
- Families stored on the phone before this change have no `groupId`: `getSession` treats them as damaged and logs out (ADR 0008).

**Revisit the decision if:** groups need data of their own (a name, a teacher, a school year), which would call for a `groups` collection.
