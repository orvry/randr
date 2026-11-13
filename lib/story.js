// All story copy and photo paths. Text in [brackets] is a placeholder (shown highlighted).
// **double asterisks** make text bold. Photos live in /public/photos (see README there).

export const hero = {
  photo: {
    src: "/photos/hero.jpg",
    alt: "The garden where Russelle and Rosie will be married",
  },
  names: ["Russelle", "Rosie"],
  headline: "We are getting married!",
  tagline:
    "Russelle & Rosie are tying the knot in a garden, and it’s only fun if you’re there.",
  date: "March 21, 2027 · Metro Manila",
};

export const couple = {
  eyebrow: "Meet the couple",
  title: "Before we became us",
  people: [
    {
      name: "Russelle",
      src: "/photos/russelle.jpg",
      alt: "Portrait of Russelle",
      intro:
        "[A short introduction to Russelle: what he loves, what makes him laugh, what he’s like on a Sunday morning.]",
    },
    {
      name: "Rosie",
      src: "/photos/rosie.jpg",
      alt: "Portrait of Rosie",
      intro:
        "[A short introduction to Rosie: what she loves, what makes her laugh, what she’s like on a Sunday morning.]",
    },
  ],
  together: {
    src: "/photos/together.jpg",
    alt: "Russelle and Rosie together",
    caption: "Better together",
  },
};

export const met = {
  title: "It started with a hello.",
  text: "It started on [date or month, year] at [place or event], when [what happened: a mutual friend introduced them, they sat next to each other, a message came out of nowhere]. Neither of them expected much that day, but Rosie remembers [a small detail] and Russelle remembers [a small detail]. They talked for [hours or until closing] and somehow it still felt too short. Looking back, that ordinary day quietly changed both of their lives.",
  polaroids: [
    {
      src: "/photos/met-1.jpg",
      alt: "Memory 1 of Russelle and Rosie",
      caption: "[the day we met]",
    },
    {
      src: "/photos/met-2.jpg",
      alt: "Memory 2 of Russelle and Rosie",
      caption: "[where it began]",
    },
    {
      src: "/photos/met-3.jpg",
      alt: "Memory 3 of Russelle and Rosie",
      caption: "[first hello]",
    },
    {
      src: "/photos/met-4.jpg",
      alt: "Memory 4 of Russelle and Rosie",
      caption: "[first of many]",
    },
    {
      src: "/photos/met-5.jpg",
      alt: "Memory 5 of Russelle and Rosie",
      caption: "[we knew]",
    },
    {
      src: "/photos/met-6.jpg",
      alt: "Memory 6 of Russelle and Rosie",
      caption: "[our song]",
    },
    {
      src: "/photos/met-7.jpg",
      alt: "Memory 7 of Russelle and Rosie",
      caption: "[road trip]",
    },
    {
      src: "/photos/met-8.jpg",
      alt: "Memory 8 of Russelle and Rosie",
      caption: "[sunday best]",
    },
    {
      src: "/photos/met-9.jpg",
      alt: "Memory 9 of Russelle and Rosie",
      caption: "[just us]",
    },
    {
      src: "/photos/met-10.jpg",
      alt: "Memory 10 of Russelle and Rosie",
      caption: "[silly us]",
    },
    {
      src: "/photos/met-11.jpg",
      alt: "Memory 11 of Russelle and Rosie",
      caption: "[golden hour]",
    },
    {
      src: "/photos/met-12.jpg",
      alt: "Memory 12 of Russelle and Rosie",
      caption: "[the long way home]",
    },
    {
      src: "/photos/met-13.jpg",
      alt: "Memory 13 of Russelle and Rosie",
      caption: "[cheers]",
    },
    {
      src: "/photos/met-14.jpg",
      alt: "Memory 14 of Russelle and Rosie",
      caption: "[our people]",
    },
    {
      src: "/photos/met-15.jpg",
      alt: "Memory 15 of Russelle and Rosie",
      caption: "[rainy day]",
    },
    {
      src: "/photos/met-16.jpg",
      alt: "Memory 16 of Russelle and Rosie",
      caption: "[new city]",
    },
    {
      src: "/photos/met-17.jpg",
      alt: "Memory 17 of Russelle and Rosie",
      caption: "[forever starts here]",
    },
    {
      src: "/photos/met-18.jpg",
      alt: "Memory 18 of Russelle and Rosie",
      caption: "[more to come]",
    },
  ],
};

export const adventures = {
  title: "A thousand little memories",
  // variant: full | polaroid | film
  items: [
    {
      variant: "full",
      date: "[Date]",
      place: "[Location]",
      caption: "Our first date",
      src: "/photos/moment-1.jpg",
      alt: "Our first date",
    },
    {
      variant: "polaroid",
      date: "[Date]",
      place: "[Location]",
      caption: "Our first trip",
      src: "/photos/moment-2.jpg",
      alt: "Our first trip together",
    },
    {
      variant: "film",
      date: "[Date]",
      place: "[Location]",
      caption: "Meeting the families",
      src: "/photos/moment-3.jpg",
      alt: "Meeting the families",
    },
    {
      variant: "full",
      date: "[Date]",
      place: "[Location]",
      caption: "A quiet Sunday",
      src: "/photos/moment-4.jpg",
      alt: "A quiet Sunday",
    },
    {
      variant: "polaroid",
      date: "[Date]",
      place: "[Location]",
      caption: "A milestone",
      src: "/photos/moment-5.jpg",
      alt: "A milestone moment",
    },
    {
      variant: "full",
      date: "[Date]",
      place: "[Location]",
      caption: "Right before the question",
      src: "/photos/moment-6.jpg",
      alt: "Just before the proposal",
    },
  ],
};

export const proposal = {
  eyebrow: "The proposal",
  title: "One question changed everything…",
  date: "[Date]",
  place: "[Location]",
  text: "Russelle planned a day that Rosie thought was [an ordinary outing]. Then [what happened], and Rosie’s first reaction was [laughing, crying, speechless]. The ring, the happy tears and the hugs that followed turned a simple day into the start of forever.",
  photo: { src: "/photos/proposal.jpg", alt: "The moment of the proposal" },
  ring: { src: "/photos/ring.jpg", alt: "The engagement ring" },
  yes: "SHE SAID YES!",
};

export const invitation = {
  eyebrow: "Your chapter begins",
  title: "You’re invited",
  text: "We would love for you to celebrate with us on **Sunday, March 21, 2027**, at **5:00 PM** in **Metro Manila, Philippines**. The ceremony will be held in a garden, followed by dinner, music and dancing. Your presence means more to us than any gift, so please let us know if you can join us.",
  facts: [
    { label: "When", value: "Sun, March 21 · 5:00 PM" },
    { label: "Where", value: "Metro Manila, Philippines" },
    { label: "Dress code", value: "Earthy tones, comfy shoes" },
  ],
  photo: {
    src: "/photos/invitation.jpg",
    alt: "Russelle and Rosie walking through the garden",
  },
};
