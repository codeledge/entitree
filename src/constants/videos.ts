export interface VideoLink {
  qid: string;
  url: string;
  channel?: string;
  label?: string;
  title?: string;
  embedLink?: string;
  language?: string;
}

export const YOUTUBE_LINKS: Record<string, VideoLink> = {
  Q712401: {
    qid: "Q712401",
    url: "https://www.youtube.com/watch?v=xL2PpDXvfXA",
    embedLink: "https://www.youtube.com/embed/xL2PpDXvfXA",
    channel: "Entitree",
    label: "Salim family",
  },
  Q8409: {
    qid: "Q8409",
    url: "https://www.youtube.com/watch?v=NgK4fJ709Xo",
    embedLink: "https://www.youtube.com/embed/NgK4fJ709Xo",
    channel: "UsefulCharts",
    label: "Alexander the great",
  },
  Q6279: {
    qid: "Q6279",
    url: "https://www.youtube.com/watch?v=L-2eYJBZKXY",
    embedLink: "https://www.youtube.com/embed/L-2eYJBZKXY",
    channel: "UsefulCharts",
    label: "Joe Biden",
  },
  Q56226: {
    qid: "Q56226",
    url: "https://www.youtube.com/watch?v=SjKB3BQlgks",
    embedLink: "https://www.youtube.com/embed/SjKB3BQlgks",
    channel: "UsefulCharts",
    label: "Kim Jong-un",
  },
  Q180589: {
    qid: "Q180589",
    url: "https://www.youtube.com/watch?v=b48PqY2hd38",
    embedLink: "https://www.youtube.com/embed/b48PqY2hd38",
    channel: "UsefulCharts",
    label: "Boris Johnson",
  },
  Q9696: {
    qid: "Q9696",
    url: "https://www.youtube.com/watch?v=F9TZ5UHMPAE",
    embedLink: "https://www.youtube.com/embed/F9TZ5UHMPAE",
    title: "Kennedy Family Tree",
    channel: "UsefulCharts",
    label: "John F. Kennedy",
  },
  Q76988: {
    qid: "Q76988",
    url: "https://www.youtube.com/watch?v=hr1hisvjoAI",
    embedLink: "https://www.youtube.com/embed/hr1hisvjoAI",
    title: "Rothschild Family Tree",
    channel: "UsefulCharts",
    label: "Mayer Amschel Rothschild",
  },
  Q355288: {
    qid: "Q355288",
    url: "https://www.youtube.com/watch?v=sFqxYkraTrY",
    embedLink: "https://www.youtube.com/embed/sFqxYkraTrY",
    title: "Berry Gordy Family Tree | Jimmy Carter's Motown Cousins",
    channel: "UsefulCharts",
    label: "Berry Gordy",
  },
};
