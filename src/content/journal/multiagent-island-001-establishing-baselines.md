---
title: (in-progress) New Beginnings
date: 2026-11-06 20:00
summary: Building the world & establishing baselines
thread: multiagent-island
entry: 1
project: multiagent-island
---

## Why I built this thing
### The real reasons that started it
In a nutshell:
- I freaking love Animal Crossing New Horizons
- I also freaking love complex systems (although my graduate research has been
closer to computational social science, so far)
- Multi-agent systems and cooperative AI has been suggested to me as a field of 
research by fellow Filipinos more established in the AI safety field, and I thought, "ooh, yeah that's interesting"
- Building this thing puts all of these together!

During BlueDot's technical AI safety course, I've learned how 
RLHF/RLAIHF, constitutions, and personas dictate how models behave, but these can vary 
with environment (hence evaluation awareness research), degrade over longer sessions,
or pretty much behave unexpectedly. AI can also have internal motives that they
can decide to hide, if in conflict with human instructions[^1].
This is pretty much what misalignment is all about, but I've started wondering
if it's possible that the reward conditions chosen during training may simply 
have some incompatibility or conflicts in the various situations these agents are deployed, resulting in natural
responses that to evaluators look like misalignment. During one of the sessions,
a fellow cohort-mate and I talked about whether things we regard as misalignment 
work similarly to human evolution. For example, during the hunter-gatherer stages, 
we had a lot of incentive to load up on sugar and fat, as these were high-energy 
sources that can sustain us between long periods of no food. The same reward
mechanism that contributed to our survival now leads to poorer health, now
that we no longer have to exert so much physical labor on an individual, daily
basis for our food supply, and worse, a lot of cheaper and faster options are
loaded up with sugar and fat, because again we were wired to like it. 

So I thought about further exploring this chain of thought with our pretrained 
models. One would argue it'd be better to simulate real working environments. I 
agree with that, but given my newbie state to AI safety, and the reasons
I enumerated above, I decided to start with this toy model, with the following questions:
- In an open-world game like Animal Crossing where there is no explicit "win" or "game over", 
what would agents decide to do?
- How would they distribute resources shared among them? If agents were able to
decide what they wanted to do for themselves, how will they cooperate?
- How would their personas/identities evolve as a function of environment and initial
conditions? Would proximity to the sea or river turn them into the island's fisherman?

[^1]: TODO: citations


## Why I built it this way
### Key constraint: money
I wanted to stay on Groq's free tiers. This meant a very frugal approach towards 
tokens. To be able to execute the typical villager actions in Animal Crossing,
I needed to do the following:
- **Mind and body separation**: I had LLM calls constrained within "mental" actions,
so doing tasks like randomly walking around the island and catching fish required
the villager to plan them in the morning, and pretty much mentally checkout during 
the physical tasks.
- **Letting the villager "budget" their mental energy**: I guess I could call this 
introversion and extroversion, but at the moment it's a daily choice rather
than a stable personality. Extroversion means that the AI villager decides
to spend more of their tokens on talking to other agents regardless of media 
(mail, visits, and some budget for random encounters), while introversion
means more time towards planning, private thoughts, and journaling in their diaries for the night.
- **Memory compression**: I still have to do some real research & calibration here, 
but right now, earlier memories fade, and things that go in the diary are better retained.
This is needed because without it, each passing day will require more and more tokens,
and I'd like to make everything fit within the free-tier limits. I'll find out 
whether this is actually feasible.


### Why diaries?
This is something not in ACNH that I introduced because I wanted to be able to 
keep track on how agents learn about the island. There's some info that I provide
via prompting, some that a non-agent Isabelle announces for the day, including 
a few fun facts about the island trickled over the whole game, but a huge 
component is learning by trial and error, in the same way a human player learns 
to play the game. Because I'm still figuring out how LLMs will deal with such an
environment, I implemented diaries to keep track of what's going on.


### What I think a good "baseline" looks like
I honestly do not know what to expect, but at the very least, I think I'll have
properly set up memory, learning, and mind-body coordination if:
- failed actions decrease over time
- agents _eventually_ learn chained actions, i.e. "I need wood, which I get from chopping 
down trees, which limits the amount of wood I can get in the future. Therefore I must plant trees"
