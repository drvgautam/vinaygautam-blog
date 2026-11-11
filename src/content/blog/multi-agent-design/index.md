---
title: "A multi-agent writing system with eleven critics"
summary: "How I designed a review pipeline of one writer and eleven cold editors to check guides a language model wrote about language models — and where the process still leaks."
date: 2026-11-11
tags:
  - Multi-agent
  - AI engineering
  - LLM
  - Writing systems
draft: false
bannerImage: header_image_multi_agent_design.webp
bannerCaption: "One writer, eleven cold editors, and a fixed path through review."
---

How do you get a machine that can't tell when it's wrong to tell you when it's wrong?

That was the question I ended up with after I started using a language model to help write a series of guides about language models. The model writes well. That's the problem. It writes so well that a wrong number looks exactly like a right one, and a step it skipped looks exactly like a step it took.

Here's an example. An early draft of my guide on pre-training said that training a large model "repeats one step billions of times." It sounds right. Billions is the kind of number you associate with these models. But a step, in that guide, means one batch update, and GPT-3 took about 94,000 of those. [1] Billions is the number of tokens it predicted, not the number of steps. The sentence was off by four orders of magnitude and read perfectly.

What caught it was not me. It was a second model, reading the draft cold, with instructions to check every number against its source. And when I went to write in the correct number, I found it needed a qualification too: the batch size was ramped up at the start of training, so 94,000 is a floor. A fluent sentence hid a wrong number, and the corrected number hid an assumption. There's no bottom to this. You just decide how far down you're going to check.

## The job

I wanted each guide to meet four conditions. Every number comes from code the reader can run. Every claim that isn't obvious points to a source. The twelve guides use one symbol for each quantity and one word for each idea. And the reader, a strong engineer who has never trained a model, can follow every step.

Notice that a program can check only the first of these. The other three need judgment. And the only cheap source of judgment I had was the same kind of model that wrote the draft.

That's the design problem in one sentence: how to get reliable judgment out of unreliable judges.

## Why a second reader

The obvious move is to ask the model to check its own work. This doesn't work, and it's worth understanding why, because the reason shapes everything else.

When you write something, you know what you meant. So when you reread it, you read what you meant, not what's on the page. Everyone who has ever shipped a typo knows this. A model has the same problem in a purer form. Its context, everything it read and wrote while drafting, is still in front of it when it reviews. It fills the gaps from memory, because the memory is right there.

So the reviewer has to start empty. In my system each editor is a fresh agent that receives a short message containing file paths and nothing else: the spec for its job, the house style, the guide. No summary of the draft. No history. No hint from the writer about what it was trying to do. The editor reads the guide the way a stranger would, and a stranger is who the guide is for.

This buys less than you'd hope. An empty context hides the writer's intentions. It doesn't hide what the two models share from training. The writer and the editors are the same model, and an error the model makes confidently it can make twice, once writing and once approving. I'll come back to this.

## One critic per crime

The next thing I learned is that a reviewer told to check everything checks nothing. Ask one model to read for accuracy, clarity, style, consistency and missing steps, and you get ten vague findings, most of them about style, because style is the easiest thing to have an opinion about.

So there are eleven editors, and each owns one kind of problem. Accuracy recomputes numbers and opens the papers. Code reads the examples for what they implement, not just whether they run. Completeness reads as the intended reader, with only the concepts earlier guides have taught. Currency looks for claims that will go stale. Misconceptions looks for sentences that are true but leave a false belief behind. Conversational catches the lecture register. Slop catches the fingerprints of machine prose. Figures checks the pictures against the text. Three more check the guide against the other eleven guides.

The rule that makes this work is that when two editors could flag the same thing, one of them owns it and the other stays silent. Wrong numbers go to accuracy. Em-dashes go to slop. Stale claims go to currency. Text that's correct but impossible to follow goes to completeness. Without this rule, you don't get eleven reviews; you get eleven opinions about the same paragraph.

Every finding has to quote the exact words it objects to. This sounds like a formality, and it's the most important rule in the system. An editor that has to quote can't object to a sentence that isn't there. And the writer can find every objection by searching.

## Scripts count, models judge

A model is bad at counting and good at judging, so anything that can be counted goes to a script. Before any editor reads a draft, a script checks its length, flags any stretch of more than three paragraphs without a heading or a figure, flags long sentences, and reruns every code block to compare its output with the page, character for character. The script runs again after the editors, because fixes add words and a guide that fit its budget before review usually doesn't after.

The code check is the one piece of real ground truth in the system, and it's worth being exact about what it proves. A passing block means that on my machine, that day, the code printed what the page says it printed. It doesn't mean the code implements the right equation. The code editor is there for that, and the code editor is a model.

The split matters most for the slop editor. You could ask a model "are there too many three-item lists in this guide?" and it would guess. Instead a script finds every three-item list and hands them over with their surrounding sentences, and the editor decides which ones are padding. A regex can find every "not X, but Y" in a draft. Only a reader can tell which ones have a real X.

## The order

The editors run one after another, in a fixed order, and the order is the design.

Substance comes first: code, accuracy, currency, misconceptions, completeness. Then the line editors. Then figures. Then the script again. Then the three series editors. The reason is simple once you see it. There's no point polishing the rhythm of a sentence the accuracy editor is about to delete. Fix what is said before how it's said.

They could run in parallel. They don't, on purpose. Two editors reading the same paragraph at once will sometimes ask for opposite fixes, one wanting a caveat added and the other wanting the paragraph cut. In sequence, the second editor sees the first one's fix. And the ownership rule only works if each editor reads a draft already clean of the problems earlier editors own.

What this costs is time. Across the twelve guides the records show about 200 editor rounds, every one of them waiting for the one before. I didn't track the hours or the bill, which I now think was a mistake, because the question "is the eleventh editor worth it?" can only be answered with those numbers, and I can't answer it.

<figure class="diagram-expand">
  <img src="/blog/multi-agent-design/multi-agent-design-fig1.svg?v=3" alt="Five workflow patterns, and the three this system uses" width="2400" height="1110" />
  <div class="diagram-expand__actions">
    <button type="button" data-diagram-expand>Expand diagram</button>
  </div>
  <figcaption>The five patterns Anthropic describes. [2] This system is a chain of stages, each stage a loop between writer and editor, all of it run by one writer that starts the editors as workers. The roster is fixed in a file. Nothing is routed and nothing runs in parallel. Click the figure to read it at full size.</figcaption>
</figure>

## The loop, and where it leaks

Each editor returns a verdict and up to ten findings, ranked high, medium or low. The writer fixes what it accepts, logs what it rejects and why, and sends the draft back. The loop ends when the editor says it's satisfied, meaning no high findings and at most two medium, or after three rounds.

Every number in that rule is a leak, and I want to name them, because a diagram of this system looks much tighter than the system is.

Two medium findings may stand at each of eleven editors. So a guide can pass with twenty-odd known weaknesses, each minor on its own, and nobody looks at them together until the end.

Ten findings is a cap. An editor that finds fifteen problems reports ten and says there are more. Which ten depends on the editor's ranking, which is a judgment.

Three rounds is a limit, and the records are honest about it: when an editor is still unsatisfied after three, the summary says so, and the open findings come to me. The embeddings guide's consistency editor ended that way. So did the inference guide's completeness editor. That part works.

The leak I didn't expect is quieter. Twice, an editor was satisfied on its third round but left a few small findings. The writer applied them. And the revised text was never sent back, because the rounds were used up. So the verdict on file describes a draft that no longer exists. The fix is a rule: a change goes back to the editor that asked for it, and if there are no rounds left, the summary says "applied, unconfirmed." I haven't written that rule yet. I'm telling you so you don't assume I have.

<figure class="diagram-expand">
  <img src="/blog/multi-agent-design/multi-agent-design-fig2.svg?v=3" alt="How each guide moves through review" width="2000" height="1800" />
  <div class="diagram-expand__actions">
    <button type="button" data-diagram-expand>Expand diagram</button>
  </div>
  <figcaption>One writer, eleven cold editors, two script gates, two decisions that are mine, and the files that remember things between guides. Click the figure to read it at full size.</figcaption>
</figure>

## What enforces this

Nothing, in the sense you probably mean.

The order of the stages, the roster, the round limit and the pass rule are all written in files the writer reads. The script gate is the only check that's code. What proves a stage ran is the report it leaves behind, one file per editor per round. If the writer skipped an editor, the file would be missing, and that's all that would happen.

I used to think this was a weakness I should fix with a controller. Now I think it's the right trade for this kind of work. The writer acts like an agent inside a stage, deciding how to fix a finding, which code to run, what to cut. But it doesn't decide the stages. A fixed path is auditable: every guide got the same review, every run can be compared with every other, and when something slips through I can point to the stage that let it. A system that chose its own review process would be more capable and less trustworthy, and for a guide that's going to teach someone, trustworthy is the one that matters.

## Memory

An agent remembers nothing between conversations, and twelve guides were written across many. So the series' memory is a folder of plain files. One lists every symbol and what it means. One lists every term and its declared synonyms. One says which guide introduces which idea. One is a ledger of simplifications: every place a guide says something not quite true for the reader's sake, and the guide that later corrects it.

The ledger is the file I'd keep if I could keep only one. Teaching requires leaving things out, and the danger is that a convenient omission hardens into a false statement nobody ever revisits. The first row of the ledger records that Guide 1 says "for now, think of a token as roughly a word," and names the sections of Guide 2 that take it back. That gives a later editor something exact to check, instead of a feeling that something was fudged.

The three series editors are the write path into these files. When one of them finds a term the glossary lacks, it proposes the row, and the writer adds it in the same change as the fix. The next guide starts from the updated file. This is the only reason the twelve guides agree with each other, and it's also a maintenance cost: a stale glossary propagates errors as efficiently as a current one prevents them.

## Where I come in

I appear twice.

The first time is before any prose exists. I write a brief: who the reader is, what they should be able to do at the end, the sections and their word budgets, what's out of scope. The writer turns this into an outline and stops until I approve it. This is the cheapest decision in the system. Changing an outline takes a minute. Restructuring a guide eleven editors have already read takes a day.

It's also the one check that's purely mine, and here's a gap I only noticed while writing this: the editors defend pieces of the structure, a mechanism introduced before the problem it solves, a term used before it's defined, but none of them reads the brief and asks whether the finished guide delivers it. The brief is an input to the writer and invisible to the reviewers.

The second time is the end. The writer produces a table: every editor, how many rounds, its final verdict, every finding still open. Then it stops. Its instructions say it never marks a guide as shipped. That's my job, and it's only as good as the table. Everything unresolved has to be in it.

## What the records show

Across the twelve guides there were 131 first-round reviews. (Eleven editors times twelve guides is 132; the missing one is Guide 1's figures review, skipped because I didn't have the dev server running, and the summary says so.) Of those, 77 were satisfied on the first read and 54 were not.

I want to be careful about what that proves. It proves the editors found things and the writer acted on them. It doesn't tell you how many of the accepted findings were right, how many real errors got through, or whether eleven editors beat one. The pre-training example at the top shows the correction path working once. It doesn't tell you how often.

One more thing the records show. The completeness editor can read as either of two people: the engineer who's never trained a model, or an ML practitioner who has trained classifiers but never a language model. The spec says to use the second for the later guides. The pipeline hard-codes the first. I built a second reader and never turned it on, and the lifecycle guides have been checked for one audience only.

## Who checks the checkers

This is where the shared-blind-spot problem comes back. Every editor runs on the same model as the writer. An empty context hides intentions, not beliefs. The cheapest improvement I can see is a second model from a different company on the accuracy editor, with any disagreement treated as a finding to settle against the source. Two judges trained by different companies are less likely to share a blind spot than one judge run twice. Agreement still wouldn't prove a claim. But disagreement would be a flag I'm not getting now.

For facts, though, the stronger check isn't another model. It's getting closer to the source: run the code, open the paper, compare the sentence to the passage it cites. And for whether the guide teaches, the stronger check isn't a model playing a beginner. It's a beginner. A model pretending not to know something can flag a gap. It can't tell you that someone understood.

The experiment I haven't run is small. Take a few passages. Review them three ways: not at all, with one broad reviewer, with the full pipeline. Have someone independent count the real errors before and after, including the ones the fixes introduced. Count the hours. Until I do that, what I have is a record of a process and the changes it made, not a measured error rate. I'd rather say that than let the diagram say otherwise.

## What I'd tell you to do

Write down what "wrong" means for your content, in terms something could check. Then, for each kind of wrong, decide whether a program can catch it or a reader has to. Give each reader one job, and one set of problems it alone owns. Start every reader with nothing but file paths. Make every finding quote the text. Tie every verdict to the exact draft it read. Put the stopping rules where you can see them, and don't let a one-word label hide why a loop ended.

Then, before you add a twelfth reviewer, measure whether the eleventh did anything.

The thing I keep coming back to is that the review process itself needed review, and the only way I found its leaks was by reading its own records as a stranger would. Which is, of course, the whole method.

## Notes

[1] Brown, T. B., et al. (2020). *Language models are few-shot learners.* Table 2.1 gives the 3.2M-token batch and 300B training tokens; Appendix B describes the batch-size ramp. https://arxiv.org/abs/2005.14165

[2] Schluntz and Zhang, *Building effective agents*, Anthropic, December 2024. https://www.anthropic.com/research/building-effective-agents. The editors run as Claude Code subagents: https://code.claude.com/docs/en/sub-agents

A companion piece, *One writer, eleven critics*, goes through what this system got wrong in more detail.
