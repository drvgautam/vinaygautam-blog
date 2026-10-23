---
title: "Learn Git from first principles"
summary: "A 13-chapter visual guide that builds Git from a text editor and folder copies — snapshots, parents, branches, hashes, merges, staging, objects, and reflog — before the commands have to mean anything."
date: 2026-10-23
tags:
  - Git
  - Version control
  - Tutorials
draft: false
---

*A visual guide · 13 chapters*

Most Git lessons start with commands. This one starts with a computer that has only a text editor and a way to copy folders. Chapter by chapter you hit a real problem, invent the smallest fix, and end up with Git. The commands appear only at the end of each chapter, once they have something to mean.

**Contents:** [01 Snapshots](#01-snapshots) · [02 Parents](#02-parents-make-a-tree) · [03 Branch names](#03-branch-names) · [04 Tags](#04-tags) · [05 Names from hashes](#05-names-from-hashes) · [06 Working offline](#06-working-offline) · [07 Merges](#07-merges) · [08 Rewriting history](#08-rewriting-history) · [09 Staging area](#09-the-staging-area) · [10 Diffs](#10-diffs) · [11 Objects](#11-objects-not-copies) · [12 Compression](#12-compression) · [13 Nothing is lost](#13-nothing-is-lost) · [Full map](#what-you-invented-and-what-git-calls-it)

## 01 · Snapshots

**Problem:** you want to get back code you changed or deleted last week.

Think of a family that takes a portrait every year. Laid side by side, the photos let you step back to any year you like. You want the same thing for code: save points you can return to.

So you keep your project in a folder called `working`. Each time you finish a self-contained piece of work, you copy the whole folder to `snapshot-0`, then `snapshot-1`, and so on. Inside each copy you drop a small file called `message` that says what you did and when.

Copy, label, never touch again. That is the whole first version of your system.

**The rule.** A snapshot is a complete, frozen copy of the project plus a note describing it.

### In real Git

Git calls a snapshot a **commit**. The message file is the commit message.

```bash
git commit -m "Add parser"   # take a snapshot
git log                      # print every message file
git switch --detach <id>     # bring an old snapshot back into working
```

## 02 · Parents make a tree

**Problem:** you need to fix a bug in an old release without dragging in newer work.

You shipped `snapshot-99` as version 1.0 and have made ten more snapshots since. A bug report arrives. You copy `snapshot-99` back into `working` and fix it. Now what do you call the result? `snapshot-110` would be a lie: it does not come after 109.

Look at a tree. Every twig, however far out, leads back to the trunk by one simple rule: go to the thing you grew from. So you add one line to each message file, the name of its **parent** snapshot. History stops being a line and becomes a tree.

Arrows point backward, from child to parent. A snapshot knows where it came from, never where history will go next.

**The rule.** Every snapshot records its parent. Follow parents and you can trace any snapshot back to the very first one.

### In real Git

Every commit stores the ID of its parent. The first commit in a repository has none.

```bash
git log --oneline --graph --all   # draw the tree
git cat-file -p HEAD              # read a commit; look for the "parent" line
```

## 03 · Branch names

**Problem:** with two lines of work, "the latest snapshot" no longer means one thing.

In a straight line, the highest number was the newest. In a tree, there is a newest snapshot at the end of every twig, and numbers can't tell you which twig is which.

You could list every snapshot that belongs to a line of work, but that is a lot of data and still doesn't tell you where the end is. The least you need is the **tip**. Everything else on the line can be found by walking parents. So you keep one file, `branches`, outside all snapshots, with one name and one snapshot per line.

There is one new chore: when you take a snapshot on a branch, you update that branch's line in the file to point at the new snapshot.

A branch is not a container of snapshots. It is a name written next to one snapshot: the tip.

**The rule.** A branch is a movable name for the newest snapshot on a line of work. Taking a snapshot moves the name forward.

### In real Git

Each branch really is a tiny text file: `.git/refs/heads/main` holds 40 hex characters and a newline. A second file, `.git/HEAD`, says which branch you are on, e.g. `ref: refs/heads/main`. That is how Git knows which name to move when you commit.

```bash
git branch maint <id>     # write a new name/snapshot line
git switch maint          # look up the name, copy that snapshot into working
git switch -c feature     # create a name at the current snapshot and switch to it
cat .git/refs/heads/main  # see for yourself
```

## 04 · Tags

**Problem:** some names should follow the work, and some should stay put.

You notice you use names in two ways. "Release maintenance" should move as work continues. "Version 1.0" should mark one snapshot forever. Both are pointers to a snapshot, but one moves and one doesn't, and mixing them invites mistakes.

So the fixed ones get their own file, `tags`. Same format, different promise.

**The rule.** A tag is a name that never moves. Use it to mark releases and other points you'll want to find again.

### In real Git

Tags live in `.git/refs/tags/`. An "annotated" tag also stores who tagged it, when, and a message.

```bash
git tag v1.0               # lightweight tag at the current snapshot
git tag -a v1.0.1 -m "Fix" # annotated tag
git switch --detach v1.0   # look at the code exactly as released
```

## 05 · Names from hashes

**Problem:** a friend works on a copy, and you both create a different "snapshot-114".

Zoe joins the project. You give her copies of all your snapshots, branches and tags, and she disappears on a week-long trip without internet. You both keep working. When she returns, you each have a `snapshot-114` and `snapshot-115` with different contents, and you can't even tell who wrote what.

Two fixes. First, every message file now includes the author's name and email. Second, a snapshot is no longer named by a counter. It is named by a **hash** of its message file: a fixed-length fingerprint computed from the content. The message holds the date, the description, the author and the parent, so two different snapshots will never produce the same name, and the same snapshot gets the same name on every computer.

With content-derived names, fetching Zoe's work is just copying her snapshots next to yours. Nothing collides, and the parents still connect them into one tree.

Change a single character, even the date, and the whole name changes. Git adds a small header (`blob`, the length, a zero byte) before hashing, which is why `git hash-object` differs from a raw SHA-1 of the file text.

**The rule.** A snapshot's name is a fingerprint of its content, including its parent. Same content, same name, everywhere.

### In real Git

Commit IDs are SHA-1 hashes, 40 hex characters, usually shortened to 7. Newer Git can also create repositories that use SHA-256. Sharing is copying snapshots you don't have yet:

```bash
git clone <url>        # copy every snapshot, branch and tag
git fetch origin       # copy Zoe's new snapshots next to yours
git push origin main   # copy yours to her, then move her branch name
git log --format="%h %an %s"   # short ID, author, message
```

## 06 · Working offline

**Problem:** none, as it turns out. This one is a gift.

Zoe spends a lot of time on planes and boats. She loves your system because every everyday action happens on her own disk: taking snapshots, reading history, creating branches, switching between them, comparing versions. The network is needed only at the moment she wants to exchange snapshots with you.

This falls straight out of the design. Everyone holds the whole history, and names come from content, so no central server has to hand out the next number.

**The rule.** Every copy of the repository is complete. Only sharing needs a connection.

### In real Git

```bash
# talk to the network
git clone   git fetch   git pull   git push

# everything else is local, including
git commit  git log  git switch  git branch  git diff  git merge
```

## 07 · Merges

**Problem:** two lines of work need to become one again.

Before her trip, you both started from the `math` branch. Zoe wrote a prime number generator; you wrote a magic number generator. Now you want one codebase with both.

You combine the two into `working` and take a snapshot. While writing its message file you notice something new: this snapshot has **two parents**, your latest and Zoe's latest. It adds nothing of its own beyond what it took to combine them. Once Zoe fetches it, your two histories are identical.

A merge is an ordinary snapshot with two parent lines in its message file.

**The rule.** A merge is a snapshot with more than one parent. It ties separate lines of history back together.

### In real Git

If your branch has no new snapshots of its own, Git doesn't need a merge snapshot at all. It just moves your branch name forward to the other tip. That is called a **fast-forward**.

```bash
git switch math
git merge zoe/math         # creates a two-parent snapshot (or fast-forwards)
git log --graph --oneline  # see the lines join
```

## 08 · Rewriting history

**Problem:** last night's three messy snapshots should have been two clean ones.

You coded late on a branch called `drunk` and made three snapshots full of mistakes and their corrections. You need a way to talk about them. If `drunk` names the tip, then `drunk^` means its parent and `drunk^^` its grandparent. The snapshot you started from is `drunk^^^`.

Snapshots are frozen, so you can't edit them. Instead you build new ones. Copy the final state into `working`, remove the new file, and snapshot that with `drunk^^^` as its parent. Then copy the final state again and snapshot it with the first new one as parent. Last, move the name `drunk` to the newest snapshot.

"Rewriting" never changes a snapshot. It makes new ones and moves a name. The old ones are just unnamed.

**The rule.** History is rewritten by creating new snapshots and moving a branch name to them. Old snapshots stay until deleted.

### In real Git

Git also writes `HEAD~3` for `HEAD^^^`. Rewrite only snapshots nobody else has fetched yet: if Zoe built on the old ones, her history and yours will disagree.

```bash
git rebase -i drunk~3      # reorder, squash, split the last three
git commit --amend         # replace the tip with a corrected snapshot
git reset --soft HEAD~3    # move the name back, keep the changes staged
```

## 09 · The staging area

**Problem:** halfway through, your working folder holds two unrelated changes that deserve separate snapshots.

You add a third folder between `working` and the snapshots: `staging`. After each snapshot, staging starts as a copy of it. Whenever you finish a change in working, you decide whether it belongs in the next snapshot. If yes, you repeat that change in staging. If not, you leave it in working for later. Snapshots are now made from **staging**, not from working.

There is one trap. Stage your README edit, keep working, then edit README again. Staging still holds the first edit. Snapshot now, and the second edit is missing.

**The rule.** The next snapshot is exactly what's in staging. Every edit has to be staged to be included, even a second edit to a file you already staged.

### In real Git

Git calls staging the **index**. It's a single file, `.git/index`, rather than a folder, but it plays exactly this role.

```bash
git add README.md             # copy this version into staging
git add -p                    # stage only some hunks of a file
git restore --staged app.py   # take it back out of staging
git commit -m "Docs"          # snapshot = staging
git status                    # which files differ, and where
```

## 10 · Diffs

**Problem:** with three places your code can live, you lose track of what changed where.

A message tells you *what* you meant to change, not which lines changed. So you write a small program that compares two folders line by line. Four comparisons come up all the time.

Every diff is a comparison between two of these places. Knowing which two answers most "why isn't my change there?" questions.

**The rule.** A diff compares two snapshots of files. Pick the two places, and you know which diff to ask for.

### In real Git

```bash
git diff                  # working vs staging
git diff --staged         # staging vs last snapshot
git diff HEAD             # working vs last snapshot
git show a1b2c3d          # what that snapshot introduced
git diff main..feature    # how far two branches have drifted
```

## 11 · Objects, not copies

**Problem:** hundreds of near-identical project copies are filling the disk.

Most files don't change between snapshots, yet you store them again every time. Hashes fix this too. Make one folder, `objects`, and store each file there under the hash of its contents. That stored file is a **blob**. If an object with that name already exists, you already have it, and you skip it.

A folder becomes a small list: for each entry, the word `blob` or `tree`, a hash, and a name. That list is stored as an object too, a **tree**. Work from the deepest folder upward and you end with one root tree. Its hash goes into the message file, which is itself stored as an object: the snapshot. Since that hash now covers every file, two snapshots with the same name are guaranteed to hold the same files. You can delete the old snapshot folders and rebuild any of them from `objects`.

Snapshot 2 changed one file. It cost three new objects (snapshot, root tree, one blob). Everything else is shared by reference.

**The rule.** Git stores three kinds of object, all named by hash: blobs (file contents), trees (folders) and commits (snapshots). Unchanged content is stored once and shared.

### In real Git

Git also keeps file names in trees, not in blobs, so renaming a file reuses its blob.

```bash
git cat-file -t HEAD            # commit
git cat-file -p HEAD            # tree, parent, author, message
git cat-file -p HEAD^{tree}     # the root tree's entries
git ls-tree -r HEAD             # every blob in the snapshot
ls .git/objects                 # the objects folder itself
```

## 12 · Compression

**Problem:** even deduplicated, source code is a lot of text.

Text compresses very well, so you compress every object before writing it to disk. One detail is worth getting right: real Git computes the hash on the *uncompressed* content and then compresses with zlib (DEFLATE). That way an object's name depends only on what it contains, not on how it was squeezed.

Git goes one step further than the story. From time to time it packs many objects into a single **packfile** and stores similar versions of a file as differences from one another. Snapshots are still whole snapshots in concept; deltas are only a storage trick.

**The rule.** Objects are named by their content and stored compressed. How they are stored never changes their names.

### In real Git

```bash
git count-objects -vH   # loose objects vs packed, and their sizes
git gc                  # pack objects and clean up
```

## 13 · Nothing is lost

**Problem:** you deleted a branch, or a rewrite went wrong, and work seems gone.

Look back at what you built. Deleting a branch removes one line from the `branches` file. A rewrite moves a name. Neither touches a single object. Committed work is still in `objects`; you only need its hash to put a name on it again.

Git helps you find that hash. It keeps a diary, the **reflog**, of every position each branch and HEAD has pointed to. Delete a branch and the old tip is still in the diary: name it again and the work is back.

**The rule.** Committed work is almost impossible to lose. Names come and go; objects stay until Git's cleanup removes old unreachable ones, which by default waits weeks.

### In real Git

```bash
git reflog                    # where HEAD has been, newest first
git reflog show feature       # where one branch has been
git branch rescue a1b2c3d     # name the lost snapshot again
```

Uncommitted edits in working are the exception: they were never snapshotted, so there is nothing to recover. Commit early and often.

## What you invented, and what Git calls it

| You built | Git calls it | Where it lives | Commands |
| --- | --- | --- | --- |
| snapshot + message file | commit | an object in `.git/objects` | `git commit`, `git log` |
| parent line | parent | inside the commit | `git log --graph` |
| branches file | branch / ref | `.git/refs/heads/` | `git branch`, `git switch` |
| tags file | tag | `.git/refs/tags/` | `git tag` |
| "which branch am I on" | HEAD | `.git/HEAD` | `git status` |
| name from a hash | object ID (SHA-1) | everywhere | `git hash-object` |
| copy Zoe's snapshots | fetch / push / clone | remotes | `git fetch`, `git push` |
| two-parent snapshot | merge commit | an object | `git merge` |
| new snapshots, move name | rebase / amend / reset | refs + new objects | `git rebase -i` |
| staging folder | index | `.git/index` | `git add`, `git restore --staged` |
| folder comparison | diff | computed on demand | `git diff`, `git show` |
| file contents / folder lists | blob / tree | `.git/objects` | `git cat-file -p` |
| diary of name moves | reflog | `.git/logs/` | `git reflog` |

From here, any Git command is a combination of a few moves: write objects, move a name, copy a snapshot into working or staging, compare two places, or copy objects between computers. When a command feels like magic, ask which of those it is doing.
