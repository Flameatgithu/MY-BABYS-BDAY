/* ═══════════════════════════════════════════════════════════════
   EDIT-ME FILE — this is your one-stop shop.
   Everything personal on the page flows from this file.
   Lines marked with ★ need *your* words or photos.
   Anything unmarked is fine as-is, but still tweakable.
   Quotes: use straight quotes " or ' inside strings, and escape
   them (like \" ) if the text itself contains the same one.
   ═══════════════════════════════════════════════════════════════ */

window.CONFIG = {

  /* ★ The big hero greeting. Any nickname — "Alishba", "Meri Pyari
     Alishba", "sweetheart" — whatever you actually call her. */
  greeting: "Meri Pyari Alishba",

  /* ★ The small in-line nickname used inside paragraphs. */
  nickname: "sweetheart",

  /* ─────────────── THE LETTER ─────────────── */

  letter: {
    /* ★ How the letter opens. */
    greeting: "My dearest Alishba,",

    /* ★ 1–6 paragraphs. Replace these samples with your own words —
       spelling mistakes you make on purpose are allowed. */
    body: [
      "Happy birthday, sweetheart. Before the cake, before the candles, before anyone starts singing loudly and slightly in the wrong key — I need you to know something: the world quietly, permanently got better the day you were born. I know that sounds like a line. It isn't. It's the truest sentence I've ever been lucky enough to mean.",
      "Every day I meet a new version of you. The sleepy morning version. The laugh-at-your-own-joke-halfway-through version. The stubborn, brilliant, kind version that carries everyone around you without even noticing. And every single day I think the same astonished thought: of all the people in the world, she picked me. I don't take that lightly. I never will.",
      "You make ordinary days feel like the good part of a movie — grocery runs turn into adventures, bad days turn into inside jokes, and silence with you is something I actually enjoy. Being loved by you is my favorite thing that has ever happened to me, and I intend to keep deserving it every single day.",
      "So today is yours. Fully, loudly, unapologetically yours. The poems below are four small attempts to say the unsayable; the cake further down literally has your name on it; and near the very end there is one thing you'll have to open. But mostly, today celebrates the original event — the day you arrived and started rearranging everything. Including me."
    ],

    /* ★ The line before your signature. */
    signoff: "Yours — today, tomorrow, and every ordinary day after,",

    /* ★ Your name (or the nickname she knows). */
    name: "Soban"
  },

  /* ─────────────── FOUR POEMS ───────────────
     ★ Four originals to keep, or rewrite each one with your own.
     One poem per pair of quotes, with \n forcing a new line.
     Poems read in order, roman numerals are automatic. */

  poems: [
    {
      title: "Candles",
      text: "The candle on a birthday cake\nis the bravest little light I know —\nit stands on a mountain of your sweetness\nand burns for exactly what you wish.\n\nSo lean in slow tonight, my love;\nlet the whole dark room lean with you.\nSome fires don't shine for applause.\nThey just wait, steady and gold,\nto hear what you'll ask for —\nthen spend themselves quietly,\nso the smoke can rise like a letter,\ncarrying your wish the long way home."
    },
    {
      title: "The Sound of You",
      text: "Your laugh enters a room\nthe way morning enters a window —\nuninvited, entirely welcome,\nchanging every answer of the light.\n\nI have heard orchestras pretend\nand rain do its very best.\nNothing gets close.\n\nSomewhere between your second sentence\nand the breath you take before laughing,\nI decided — quietly, completely —\nthat this is the sound I want\nat the end of every one of my days,\nand at the start of every one after."
    },
    {
      title: "Ordinary Magic",
      text: "Forget the fireworks;\nI'll take the regular things:\nthe playlist we argue over,\nyour goodnight text that reads like sunrise,\nthe way \"meri jaan\" leaves my mouth\nalready blushing.\n\nLove lives in kitchens and crooked sofas,\nin Sundays that refuse to end,\nin every boring hour made golden\njust because you're in it.\n\nSo give me all the ordinary —\nas long as it's ordinary with you."
    },
    {
      title: "Every Year From Now",
      text: "Today is yours, and the math is simple:\nevery birthday with you,\nI have loved you more than the last.\n\nSo let me be greedy about the future —\nmore frosting, more songs off-key,\nmore years of you growing lovelier\nwhile time politely looks away.\n\nIf anyone asks about my wish,\nI'll tell them the truth:\nit already came true.\nIt laughs at my worst jokes,\nsteals my dessert,\nand has her birthday today.\n\nHappy birthday, my love.\nHere's to every year from now."
    }
  ],

  /* ─────────────── SMALL NOTES ───────────────
     ★ Six short notes shown as pastel cards. Swap in real
       memories, inside jokes, or things you love about her. */

  notes: [
    "Thing I love, item #4,073: you get fully fluent in whatever you're obsessed with for exactly two weeks — and I love every single version of your accent.",
    "★ Replace with a real memory — e.g. our first \"you hang up… no, YOU hang up\" call: twenty minutes of polite refusal and one of my favorite nights ever.",
    "Official finding: you are my favorite notification, my favorite song on shuffle, and my favorite reason to check a mirror before leaving the apartment.",
    "Reminder, in case the mirror hasn't mentioned it lately: you make rooms warmer just by walking into them.",
    "Peer-reviewed fact: Tuesdays are statistically 100% better when you're in them.",
    "The long-term plan: keep choosing you. Renewably. No small print, ever."
  ],

  /* ─────────────── PHOTOS ───────────────
     ★ STEP 1 —make a folder named "photos" next to index.html.
     ★ STEP 2 —save your three pictures into it, with EXACT names:
               us-1.jpg, us-2.jpg, us-3.jpg (rename the files to match).
     Captions below the polaroids — change freely.
     (You can also tap a polaroid or drop a picture onto it any time.) */

  photos: [
    { src: "photos/us-1.jpg", caption: "exhibit a: my favorite person" },
    { src: "photos/us-2.jpg", caption: "the calm behind my loudest days" },
    { src: "photos/us-3.jpg", caption: "smitten, documented — the stickers agree" }
  ],

  /* ─────────────── THE QUIZ ───────────────
     ★ Five playful questions about you two. For each one:
       answer = which option is "correct" (0 = first, 1 = second,
       2 = third, 3 = fourth). Both replies are shown as feedback,
       so every answer still feels affectionate. Rewrite freely. */

  quiz: [
    {
      q: "Who fell first?",
      options: [
        "You did (and I noticed)",
        "Me. I fell first and I fell hardest.",
        "It was mutual. Suspiciously mutual.",
        "The universe staged the whole thing."
      ],
      answer: 1,
      right: "Correct. Full marks. My dignity never recovered.",
      wrong: "Incorrect, but adorable. The correct answer is: me — first, and farthest down."
    },
    {
      q: "Best part of any ordinary day?",
      options: [
        "Your good-morning voice",
        "Texting you \"made it home safe\" and meaning it several ways",
        "Any meal, as long as you're stealing my fries",
        "All of the above"
      ],
      answer: 3,
      right: "Obviously. A full sweep.",
      wrong: "Bold pick. The official answer was \"all of the above\" — but yours earns bonus style points."
    },
    {
      q: "Alishba's documented superpower?",
      options: [
        "Turning bad days into setups for good ones",
        "Winning every argument by smiling",
        "Remembering what I said, when I said it, down to the syllable",
        "All of the above — plus a hug on the tough days"
      ],
      answer: 3,
      right: "Full marks, obviously. Case closed.",
      wrong: "Not wrong, just incomplete — the full answer is the beautiful combination."
    },
    {
      q: "How long do I intend to love you?",
      options: [
        "Until the next season of our show drops",
        "Until the stars call it quits",
        "Forever — and then a mandatory bonus round",
        "Ask my luck. It already knows."
      ],
      answer: 2,
      right: "Correct. Indefinitely, and then some.",
      wrong: "So close. It's forever — with a bonus round, because rules are rules."
    },
    {
      q: "The prize for finishing this quiz is…",
      options: [
        "Confetti and light applause",
        "Unlimited affection, lifetime supply",
        "Full rights to all my dessert",
        "An evening with your favorite person — me"
      ],
      answer: 1,
      right: "Claimed and non-transferable. Enjoy the lifetime supply.",
      wrong: "The true answer was unlimited affection all along — but I admire the ambition."
    }
  ],

  /* Shown after the quiz. Tiers by score (5 questions total). */
  quizResults: {
    perfect: {
      title: "Perfect score — certified heart expert",
      msg: "Five for five. You know my heart as well as I do, which is romantic and slightly alarming. Happy birthday, brilliant girl."
    },
    four: {
      title: "Devastatingly close",
      msg: "One slip, zero consequences. You still win everything that matters."
    },
    three: {
      title: "Strong showing",
      msg: "Half the facts, all of the love. The second part always weighed more."
    },
    low: {
      title: "Chaotic good",
      msg: "Strategy unclear, charm absolute. You pass on vibes alone — congratulations."
    }
  },

  /* ─────────────── THE CAKE ─────────────── */

  cake: {
    /* ★ The name piped onto the cake. */
    topping: "Alishba",
    /* How many candles to blow out (looks best between 3 and 6). */
    count: 5,
    wish: "Status: granted. I checked with the universe — turns out she owed me a favor, and she cashed it in entirely for you."
  },

  /* ─────────────── SEALED NOTE ───────────────
     ★ The envelope's little "gift receipt". Keep it playful and
       honest — if you have a real surprise planned, hint at it. */

  envelope: {
    address: "to meri jaan, with love",
    kicker: "delivered by a very serious dove",
    title: "The mini surprise",
    items: [
      "Front-row tickets to a lifetime of being chosen on purpose.",
      "One (1) universe-class hug, redeemable immediately — no queue, no expiry.",
      "And a promise: your real gift is waiting in the real world. Ask your favorite person about it. He's counting the minutes."
    ],
    foot: "Redeemable whenever she looks at you. That offer is often."
  },

  /* ─────────────── FINALE ─────────────── */

  finale: {
    /* ★ A birthday wish in one more language. The French kept its
       day job below — replace it if you'd rather another one. */
    french: "Joyeux anniversaire, mon amour.",
    /* ★ Its English translation, shown right under. */
    trans: "— happy birthday, my love. May this year hand back even a little of the happiness you hand out.",
    /* ★ The final line she reads on the whole page. */
    closing: "Happy birthday, meri jaan. You are, and will always be, my favorite chapter.",
    /* ★ Colophon / made-by line. */
    madeBy: "made by hand, with love and an unreasonable attention span — Soban, the love of your life"
  },

  /* ─────────────── MUSIC (built-in) ───────────────
     A soft, coded-from-scratch melody. No audio files needed.
     Only ever starts when she presses the button. You can leave
     this block exactly as it is. */

  music: {
    label: "Play soft music",
    playing: "Pause the music"
  }
};
