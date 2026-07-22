export const siteContent = {
  landing: {
    envelopeTo: "Ms. Umema",
    envelopeAddress: "The Cozy Bedroom · Second Floor on the Left",
    letterHeader: "The School of Witchcraft, Wizardry & Terrible Jokes",
    letterGreeting: "Dear Umema,",
    letterBody: [
      "We are pleased to inform you that you have, once again, been accepted into a very particular circle. No O.W.L.s required, just years of surviving my terrible jokes and somehow not blocking my number.",
      "Please find enclosed a journey through old memories, something I found while going through old chats, and one letter that's been a long time coming. Term begins on the twenty-third of July, same as it does every year, whether either of us remembers to plan for it in advance or not.",
    ],
    letterSignoff: "Yours most sincerely,",
    letterSigner: "Your Favourite Idiot",
    letterSignerName: "Huzefa",
    beginCta: "Begin the Journey",
  },
  sorting: {
    warning: {
      title: "Fair Warning",
      body: [
        "This is not a regular pop quiz.",
        "It's a test on years of absolute chaos, condensed into five questions because the real story simply wouldn't fit on one page.",
        "Think of this as the highlight reel... not the complete disaster.",
      ],
      cta: "Let the Sorting Begin",
    },
    quizIntro: {
      title: "The Sorting Hat's Actual Test",
      subtitle: [
        "A trivia quiz about your own chaos...",
        "Not a personality quiz.",
        "A memory test.",
      ],
    },
    questions: [
      {
        prompt:
          "March 2023 — she gets a new phone number and messages Huzefa. What's the first thing she says?",
        answers: [
          "Hi, this is my new number",
          "Be my boyfriend",
          "Do you have my number saved?",
          "Something completely normal, because she's a normal person",
        ],
        correctIndex: 1,
        explanation:
          'New number. Zero introduction. Straight to "Be my boyfriend." Priorities.',
      },
      {
        prompt: "When finally asked to introduce herself, what fake name did she give first?",
        answers: [
          "Priya",
          "Nupur",
          "Riya",
          "Her actual name, obviously, because she's not chaotic at all",
        ],
        correctIndex: 1,
        explanation: '"I m Nupur." Got caught within the hour.',
      },
      {
        prompt: "Within the first hour of getting caught in the lie, what did she call him?",
        answers: ["Kamino kutto", "Idiot", "Weirdo", "Nothing, she was very calm about it"],
        correctIndex: 0,
        explanation:
          'Going from "Be my boyfriend" to insults in under an hour is honestly impressive.',
      },
      {
        prompt: "She once compared herself to a specific Harry Potter character. Who?",
        answers: [
          "Luna Lovegood",
          "Ginny Weasley",
          "Hermione Granger",
          "She's never seen Harry Potter and this whole website is a lie",
        ],
        correctIndex: 2,
        explanation: "Self-declared Hermione. Fully confident.",
      },
      {
        prompt: "And what has she been called, repeatedly, for years, that says otherwise?",
        answers: ["Sapkli", "Bestie", "Weirdo", "All of the above, honestly"],
        correctIndex: 0,
        explanation:
          'Plenty of nicknames came and went... **"Sapkli"** is the one that truly survived.',
      },
    ],
    revealPrimary: {
      house: "GRYFFINDOR",
      subtitle: "Bold, warm, a little bit Hermione, absolutely the main character.",
      body: "The hat barely had to think — courage runs loud in you. You show up for people, you say the true thing even when it costs you, and you have never once let a friend walk into a bad decision alone.",
    },
    revealTwist: {
      label: "But…",
      body: "The hat pauses. It sniffs. It says, quietly — Slytherin would have done nicely too. There is a cunning to you, a quiet cleverness, the kind that gets things done while everyone else is still discussing feelings. We love you for both.",
    },
    continueCta: "Onward",
  },
  map: {
    unlockPhrase: "I solemnly swear that I am up to no good.",
    unlockHint: "Tap the parchment",
    lockedTitle: "Mischief Managed",
    locations: [
      {
        title: "The Very First Hello",
        caption: "Where it all began — and neither of us knew what we were signing up for.",
      },
      {
        title: "The Kitchen at 2am",
        caption: "Half-cooked plans, fully honest conversations, one questionable snack.",
      },
      {
        title: "That One Trip",
        caption: "You know the one. The photos do not do it justice, but here they are anyway.",
      },
      {
        title: "The Uncontrollable Laughing Incident",
        caption: "We still can't say what was funny. Nobody was there. It was perfect.",
      },
      {
        title: "The Quiet Kind of Day",
        caption: "No agenda, no photos really — just being. Some of the best ones.",
      },
    ],
    closingLine: "Mischief managed.",
    continueCta: "To the Platform",
  },
  platform: {
    wallPrompt: "Run at the wall between platforms nine and ten.",
    wallHint: "Tap the bricks",
    letter: {
      dropCap: "T",
      firstLine: "o my dearest Umema,",
      paragraphs: [
        "here is a version of the world where I never met you, and I don't like thinking about it. It is smaller and quieter and considerably less funny. I am so glad we do not live in that version.",
        "You are the friend who remembers the small thing. Who shows up when it's inconvenient. Who has strong opinions about desserts and stronger ones about people who are unkind. You have a way of making ordinary rooms feel like they were waiting for you to walk into them.",
        "This year, may the magic be extremely on your side. May every plan go through. May the coffee be exactly how you like it. May every book you pick up be the good kind. May the people who love you find better and better ways to show it — starting, hopefully, with this.",
        "Happy birthday, you glorious troublemaker. The world is lucky to have you in it, and I am the luckiest of all.",
      ],
      signoff: "Always,",
      signer: "Me",
    },
    continueCta: "One Last Thing",
  },
  celebration: {
    catchHint: "Catch the Snitch",
    headline: "Happy Birthday, Umema",
    message:
      "Here's to another year of you — bold, brilliant, slightly chaotic, endlessly loved. Go make some magic.",
    replayCta: "Read it again",
  },
} as const;

export type SiteContent = typeof siteContent;
