export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    question: "What is TUF Networks?",
    answer:
      "TUF Networks is a curated network of founders, builders, creators and operators brought together around ideas, experiences and meaningful conversations.",
  },
  {
    question: "Who is it for?",
    answer:
      "Students, freelancers, early-stage builders, professionals, artists and people exploring what’s possible. TUF Networks is curated for ambition, execution and curiosity.",
  },
  {
    question: "Is this another networking group?",
    answer:
      "No. TUF Networks is intentionally small, curated and relationship-first. The goal is not more connections; it is the right ones.",
  },
  {
    question: "How does membership work?",
    answer:
      "Access is curated. Start by requesting an invitation. Applications are reviewed for fit before an introduction.",
  },
  {
    question: "Where does TUF Networks happen?",
    answer:
      "TUF Networks begins in Kerala, with a vision to grow city by city. Gatherings take place in partner spaces and rooms built for conversation.",
  },
  {
    question: "What happens after I apply?",
    answer:
      "We review your application and, if there is a fit, follow up with next steps. Applying does not guarantee a place.",
  },
  {
    question: "What does “the room” mean?",
    answer:
      "The room is the network: the people, the spaces and the experiences that bring them together.",
  },
] as const;
