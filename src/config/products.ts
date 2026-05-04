export interface IProduct {
  _id: string; // Used instead of MongoDB _id
  slug: string;
  extensionId?: string;
  category: "vscode" | "python" | "nextjs";
  githubRepo: string;
  hasLicense: boolean;
  price: number;
  order: number;
  translations: {
    en: { title: string; description: string };
    ar: { title: string; description: string };
    fr: { title: string; description: string };
    ru: { title: string; description: string };
    de: { title: string; description: string };
  };
}

export const products: IProduct[] = [
  {
    _id: "prod_codetune",
    slug: "codetune",
    extensionId: "codetune",
    category: "vscode",
    githubRepo: "kareem2099/codetune",
    hasLicense: false,
    price: 0,
    order: 1,
    translations: {
      en: { title: "CodeTune", description: "Fine-tune your VS Code experience" },
      ar: { title: "CodeTune", description: "خصص تجربة VS Code بتاعتك" },
      fr: { title: "CodeTune", description: "Personnalisez votre expérience VS Code" },
      ru: { title: "CodeTune", description: "Настройте VS Code под себя" },
      de: { title: "CodeTune", description: "Passen Sie VS Code an" },
    },
  },
  {
    _id: "prod_dotcommand",
    slug: "dotcommand",
    extensionId: "dotcommand",
    category: "vscode",
    githubRepo: "kareem2099/dotcommand",
    hasLicense: false,
    price: 0,
    order: 2,
    translations: {
      en: { title: "DotCommand", description: "Powerful command shortcuts for VS Code" },
      ar: { title: "DotCommand", description: "اختصارات أوامر قوية لـ VS Code" },
      fr: { title: "DotCommand", description: "Raccourcis de commandes pour VS Code" },
      ru: { title: "DotCommand", description: "Мощные команды для VS Code" },
      de: { title: "DotCommand", description: "Leistungsstarke Befehle für VS Code" },
    },
  },
  {
    _id: "prod_dotenvy",
    slug: "dotenvy",
    extensionId: "dotenvy",
    category: "vscode",
    githubRepo: "kareem2099/dotenvy",
    hasLicense: false,
    price: 0,
    order: 3,
    translations: {
      en: { title: "DotEnvy", description: "Manage your .env files easily in VS Code" },
      ar: { title: "DotEnvy", description: "إدارة ملفات .env بسهولة في VS Code" },
      fr: { title: "DotEnvy", description: "Gérez vos fichiers .env dans VS Code" },
      ru: { title: "DotEnvy", description: "Управление .env файлами в VS Code" },
      de: { title: "DotEnvy", description: ".env Dateien in VS Code verwalten" },
    },
  },
  {
    _id: "prod_dotfetch",
    slug: "dotfetch",
    extensionId: "dotfetch",
    category: "vscode",
    githubRepo: "kareem2099/DotFetch",
    hasLicense: false,
    price: 0,
    order: 4,
    translations: {
      en: { title: "DotFetch", description: "Fetch and display system info in VS Code" },
      ar: { title: "DotFetch", description: "عرض معلومات النظام في VS Code" },
      fr: { title: "DotFetch", description: "Affichez les infos système dans VS Code" },
      ru: { title: "DotFetch", description: "Системная информация в VS Code" },
      de: { title: "DotFetch", description: "Systeminfos in VS Code anzeigen" },
    },
  },
  {
    _id: "prod_dotreadme",
    slug: "dotreadme",
    extensionId: "dotreadme",
    category: "vscode",
    githubRepo: "kareem2099/DotReadme",
    hasLicense: false,
    price: 0,
    order: 5,
    translations: {
      en: { title: "DotReadme", description: "Preview and edit README files in VS Code" },
      ar: { title: "DotReadme", description: "معاينة وتحرير ملفات README في VS Code" },
      fr: { title: "DotReadme", description: "Prévisualisez les README dans VS Code" },
      ru: { title: "DotReadme", description: "Просмотр README в VS Code" },
      de: { title: "DotReadme", description: "README Vorschau in VS Code" },
    },
  },
  {
    _id: "prod_dotsense",
    slug: "dotsense",
    extensionId: "dotsense",
    category: "vscode",
    githubRepo: "kareem2099/dotsense",
    hasLicense: false,
    price: 0,
    order: 6,
    translations: {
      en: { title: "DotSense", description: "Smart code suggestions for VS Code" },
      ar: { title: "DotSense", description: "اقتراحات كود ذكية لـ VS Code" },
      fr: { title: "DotSense", description: "Suggestions de code intelligentes" },
      ru: { title: "DotSense", description: "Умные подсказки кода для VS Code" },
      de: { title: "DotSense", description: "Intelligente Code-Vorschläge" },
    },
  },
  {
    _id: "prod_dotshare",
    slug: "dotshare",
    extensionId: "dotshare",
    category: "vscode",
    githubRepo: "kareem2099/DotShare",
    hasLicense: true,
    price: 5,
    order: 7,
    translations: {
      en: { title: "DotShare", description: "Share code snippets directly from VS Code" },
      ar: { title: "DotShare", description: "شارك مقاطع الكود مباشرة من VS Code" },
      fr: { title: "DotShare", description: "Partagez du code depuis VS Code" },
      ru: { title: "DotShare", description: "Делитесь кодом из VS Code" },
      de: { title: "DotShare", description: "Code-Snippets aus VS Code teilen" },
    },
  },
];
