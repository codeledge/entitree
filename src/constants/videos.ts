export interface LINK {
  qid: string;
  url: string;
  channel?: string;
  label?: string;
  title?: string;
  embedLink?: string;
}

export const YOUTUBE_LINKS: LINK[] = [
  {
    qid: "Q8409",
    url: "https://www.youtube.com/watch?v=NgK4fJ709Xo",
    channel: "UsefulCharts",
    label: "Alexander the great",
  },
  {
    qid: "Q6279",
    url: "https://www.youtube.com/watch?v=L-2eYJBZKXY",
    channel: "UsefulCharts",
    label: "Joe Biden",
  },
  {
    qid: "Q56226",
    url: "https://www.youtube.com/watch?v=SjKB3BQlgks",
    channel: "UsefulCharts",
    label: "Kim Jong-un",
  },
  {
    qid: "Q180589",
    url: "https://www.youtube.com/watch?v=b48PqY2hd38",
    channel: "UsefulCharts",
    label: "Boris Johnson",
  },
  {
    qid: "Q9696",
    url: "https://www.youtube.com/watch?v=F9TZ5UHMPAE",
    title: "Kennedy Family Tree",
    channel: "UsefulCharts",
    label: "John F. Kennedy",
  },
  {
    qid: "Q76988",
    url: "https://www.youtube.com/watch?v=hr1hisvjoAI",
    title: "Rothschild Family Tree",
    channel: "UsefulCharts",
    label: "Mayer Amschel Rothschild",
  },
  {
    qid: "Q355288",
    url: "https://www.youtube.com/watch?v=hr1hisvjoAI",
    title: "Berry Gordy Family Tree | Jimmy Carter's Motown Cousins\n",
    channel: "UsefulCharts",
    label: "Berry Gordy",
  },
];
