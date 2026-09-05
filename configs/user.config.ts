import type { UserConfig } from "../src/site.config";

const userConfig: UserConfig = {
  title: "Achhaya",
  description:
    "Technical writing on software, distributed systems, and personal learnings.",

  url: "https://blog.achhaya.com",
  author: "Achhaya Pathak",

  logo: "/logo.svg",
  avatar: "/images/avatar/avatar.jpeg",

  navigation: [
    { title: "Writing", url: "/posts" },
    { title: "Archive", url: "/archive" },
    { title: "About", url: "/about" },
  ],

  footerLinks: [
    { title: "Portfolio", url: "https://achhaya.com" },
    { title: "RSS", url: "/rss.xml" },
    { title: "Archive", url: "/archive" },
  ],

  social: [
    {
      title: "GitHub",
      url: "https://github.com/achhayapathak",
      icon: "github",
    },
    {
      title: "LinkedIn",
      url: "https://linkedin.com/in/achhayapathak",
      icon: "linkedin",
    },
    {
      title: "X",
      url: "https://x.com/frozen_parantha",
      icon: "x",
    },
  ],

  footerCredits: "Engineered & written by Achhaya Pathak",

  postsPerPage: 8,
  recentPosts: 6,
  relatedPosts: 4,

  showLogo: false,
  showThemeToggle: true,
  showReadingTime: true,

  heroVariant: "studio",

  annotation: "Writing between filter coffees and terminal windows.",
};

export default userConfig;