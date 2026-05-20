export type Profile = {
  handle: string;
  name: string;
  title: string;
  location: string;
  status: string;
  bio: string[];
  highlights: string[];
  links: Array<{
    label: string;
    href: string;
    command: string;
  }>;
  tech: Array<{
    group: string;
    items: string[];
  }>;
  projects: Array<{
    name: string;
    description: string;
    stack: string[];
    href: string;
  }>;
  contact: {
    email: string;
    github: string;
  };
};

export const profile: Profile = {
  handle: "pim4n",
  name: "Piliman22",
  title: "Software Developer",
  location: "Japan",
  status: "Building web apps, APIs, and small tools.",
  bio: [
    "Node.js / TypeScript を中心に、実用的な Web アプリケーションや自動化ツールを作っています。",
    "シンプルに動き、あとから直しやすい設計を大事にしています。",
    "このページはブラウザではターミナル風 UI、curl ではテキストプロフィールとして表示されます。"
  ],
  highlights: [
    "Cloudflare Workers で軽量に配信",
    "プロフィール情報は src/profile.ts に集約",
    "curl / wget / httpie からは text/plain で応答",
    "GitHub リンクや技術スタックの追加が簡単"
  ],
  links: [
    {
      label: "GitHub",
      href: "https://github.com/Piliman22",
      command: "open github"
    }
  ],
  tech: [
    {
      group: "Languages",
      items: ["TypeScript", "JavaScript", "Node.js"]
    },
    {
      group: "Frontend",
      items: ["HTML", "CSS", "Vite"]
    },
    {
      group: "Platform",
      items: ["Cloudflare Workers", "Wrangler"]
    }
  ],
  projects: [
    {
      name: "Terminal Portfolio",
      description: "ターミナル風のポートフォリオ。ブラウザと curl の両方で読みやすく表示します。",
      stack: ["TypeScript", "Cloudflare Workers"],
      href: "https://github.com/Piliman22/PortfolioPage"
    }
  ],
  contact: {
    email: "pim4n@pim4n-net.com",
    github: "https://github.com/Piliman22"
  }
};
