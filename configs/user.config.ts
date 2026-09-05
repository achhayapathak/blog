import type { UserConfig } from "../src/site.config";

const userConfig: UserConfig = {
  title: "Achhaya Pathak",
  description:
    "Achhaya Pathak",

  url: "https://blog.achhaya.com",
  author: "Achhaya Pathak",

  logo: "/avatar.png",
  avatar: "/avatar.png",

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
    {
      title: "Email",
      url: "mailto:info@achhaya.com",
      icon: "mail",
    },
  ],

  footerCredits: "Engineered & written by Achhaya Pathak",

  postsPerPage: 8,
  recentPosts: 6,
  relatedPosts: 4,

  showLogo: true,
  showThemeToggle: true,
  showReadingTime: true,

  heroVariant: "studio",

  annotation: "Writing between filter coffees and terminal windows.",
};

export default userConfig;