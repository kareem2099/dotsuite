import type { PrivacyLanguage } from "./privacy-language";

type GeneralPrivacySection = { title: string; paragraphs: string[]; bullets?: string[]; closing?: string };

export const privacyPageCopy = {
  "en": {
    "pageTitle": "Privacy policy",
    "back": "Back to home",
    "languages": "Languages",
    "generalTitle": "DotSuite & DotScramble"
  },
  "ar": {
    "pageTitle": "سياسة الخصوصية",
    "back": "العودة للرئيسية",
    "languages": "اللغات",
    "generalTitle": "DotSuite وDotScramble"
  },
  "de": {
    "pageTitle": "Datenschutzerklärung",
    "back": "Zur Startseite",
    "languages": "Sprachen",
    "generalTitle": "DotSuite und DotScramble"
  },
  "fr": {
    "pageTitle": "Politique de confidentialité",
    "back": "Retour à l’accueil",
    "languages": "Langues",
    "generalTitle": "DotSuite et DotScramble"
  },
  "ru": {
    "pageTitle": "Политика конфиденциальности",
    "back": "На главную",
    "languages": "Языки",
    "generalTitle": "DotSuite и DotScramble"
  }
};

export const generalPrivacyCopy: Record<PrivacyLanguage, GeneralPrivacySection[]> = {
  "en": [
    {
      "title": "1. Information We Collect",
      "paragraphs": [
        "We collect information you provide directly to us, such as when you create an account, update your profile, or contact us. This may include your name, email address, and any other information you choose to provide."
      ]
    },
    {
      "title": "2. How We Use Your Information",
      "paragraphs": [
        "We use the information we collect to provide, maintain, and improve our services, to communicate with you about updates and new features, and to protect our rights and the rights of users."
      ]
    },
    {
      "title": "3. DotScramble Desktop App",
      "paragraphs": [
        "DotScramble processes your photos on your computer. Photos, file names and their metadata never leave your device. When Pro is activated, the app contacts DotSuite to check the license, at activation and about once a day after that, and sends only:"
      ],
      "bullets": [
        "an anonymous computer ID (a one-way hash of the operating system’s machine ID), to enforce the 2-computer limit;",
        "a computer name you can recognize in your Devices list (operating system and host name) and the app version;",
        "daily counts of Pro use: how many photos were saved with Pro, processed by Batch or cleaned with Pro metadata modes, and how many AI detection or AI Evasion runs were made. Only numbers."
      ],
      "closing": "We use this to run the license, to show your devices, and to review refund requests, which are judged on whether Pro was used. Only DotSuite staff handling your account can see it. The Free plan sends nothing."
    },
    {
      "title": "4. Information Sharing",
      "paragraphs": [
        "We do not share your personal information with third parties except as described in this policy. We may share information with service providers who assist us in operating our platform."
      ]
    },
    {
      "title": "5. Data Security",
      "paragraphs": [
        "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
      ]
    },
    {
      "title": "6. Your Rights",
      "paragraphs": [
        "You have the right to access, update, or delete your personal information at any time. You can manage your account settings or contact us for assistance."
      ]
    },
    {
      "title": "7. Contact Us",
      "paragraphs": [
        "For questions about this privacy policy or to exercise your privacy rights, email:"
      ]
    }
  ],
  "ar": [
    {
      "title": "١. المعلومات التي نجمعها",
      "paragraphs": [
        "نجمع المعلومات التي تقدمها لنا مباشرة، مثل إنشاء حساب أو تحديث ملفك الشخصي أو التواصل معنا. قد يشمل ذلك اسمك وبريدك الإلكتروني وأي معلومات أخرى تختار تقديمها."
      ]
    },
    {
      "title": "٢. كيفية استخدام معلوماتك",
      "paragraphs": [
        "نستخدم المعلومات التي نجمعها لتقديم خدماتنا وصيانتها وتحسينها، وللتواصل معك بشأن التحديثات والميزات الجديدة، ولحماية حقوقنا وحقوق المستخدمين."
      ]
    },
    {
      "title": "٣. تطبيق DotScramble للكمبيوتر",
      "paragraphs": [
        "يعالج DotScramble صورك على جهاز الكمبيوتر. لا تغادر الصور أو أسماء الملفات أو بياناتها الوصفية جهازك. عند تفعيل Pro، يتصل التطبيق بـDotSuite للتحقق من الترخيص عند التفعيل ثم نحو مرة يوميًا، ويرسل فقط:"
      ],
      "bullets": [
        "معرّف كمبيوتر مجهول الهوية، ناتج عن تجزئة أحادية الاتجاه لمعرّف الجهاز في نظام التشغيل، لفرض حد الجهازين؛",
        "اسم كمبيوتر يمكنك تمييزه في قائمة الأجهزة، ويشمل نظام التشغيل واسم المضيف، وإصدار التطبيق؛",
        "أعداد الاستخدام اليومية لميزات Pro: عدد الصور المحفوظة باستخدام Pro أو المعالجة بالدفعات أو التي نُظفت بياناتها الوصفية بأوضاع Pro، وعدد مرات تشغيل اكتشاف الذكاء الاصطناعي أو AI Evasion. أرقام فقط."
      ],
      "closing": "نستخدم ذلك لتشغيل الترخيص وعرض أجهزتك ومراجعة طلبات الاسترداد، التي نقيّمها بناءً على استخدام Pro. يطّلع على هذه البيانات فقط موظفو DotSuite المعنيون بحسابك. لا ترسل الخطة المجانية شيئًا."
    },
    {
      "title": "٤. مشاركة المعلومات",
      "paragraphs": [
        "لا نشارك معلوماتك الشخصية مع جهات خارجية إلا كما هو موضح في هذه السياسة. قد نشارك المعلومات مع مزوّدي الخدمات الذين يساعدوننا في تشغيل منصتنا."
      ]
    },
    {
      "title": "٥. أمن البيانات",
      "paragraphs": [
        "نطبق تدابير تقنية وتنظيمية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو التغيير أو الإفصاح أو الإتلاف."
      ]
    },
    {
      "title": "٦. حقوقك",
      "paragraphs": [
        "يمكنك الوصول إلى معلوماتك الشخصية وتحديثها أو طلب حذفها في أي وقت. يمكنك إدارة إعدادات حسابك أو التواصل معنا للمساعدة."
      ]
    },
    {
      "title": "٧. التواصل معنا",
      "paragraphs": [
        "للاستفسار عن سياسة الخصوصية أو ممارسة حقوقك المتعلقة بالخصوصية، راسل:"
      ]
    }
  ],
  "de": [
    {
      "title": "1. Welche Informationen wir erheben",
      "paragraphs": [
        "Wir erheben Informationen, die Sie uns direkt mitteilen, etwa wenn Sie ein Konto erstellen, Ihr Profil aktualisieren oder uns kontaktieren. Dazu können Ihr Name, Ihre E-Mail-Adresse und weitere von Ihnen freiwillig bereitgestellte Angaben gehören."
      ]
    },
    {
      "title": "2. Wie wir Ihre Informationen verwenden",
      "paragraphs": [
        "Wir verwenden die erhobenen Informationen, um unsere Dienste bereitzustellen, zu warten und zu verbessern, Sie über Aktualisierungen und neue Funktionen zu informieren und unsere Rechte sowie die Rechte der Nutzer zu schützen."
      ]
    },
    {
      "title": "3. DotScramble-Desktop-App",
      "paragraphs": [
        "DotScramble verarbeitet Ihre Fotos auf Ihrem Computer. Fotos, Dateinamen und deren Metadaten verlassen Ihr Gerät nicht. Bei aktiviertem Pro kontaktiert die App DotSuite zur Lizenzprüfung bei der Aktivierung und danach etwa einmal täglich und übermittelt ausschließlich:"
      ],
      "bullets": [
        "eine anonyme Computer-ID, einen Einweg-Hash der Geräte-ID des Betriebssystems, zur Durchsetzung der Begrenzung auf zwei Computer;",
        "einen in Ihrer Geräteliste erkennbaren Computernamen mit Betriebssystem und Hostnamen sowie die App-Version;",
        "tägliche Pro-Nutzungszahlen: die Anzahl der mit Pro gespeicherten, per Stapelverarbeitung bearbeiteten oder mit Pro-Metadatenmodi bereinigten Fotos sowie die Anzahl der KI-Erkennungs- und AI-Evasion-Durchläufe. Ausschließlich Zahlen."
      ],
      "closing": "Wir verwenden diese Angaben zur Lizenzverwaltung, zur Anzeige Ihrer Geräte und zur Prüfung von Erstattungsanträgen, die anhand der Pro-Nutzung beurteilt werden. Nur DotSuite-Mitarbeiter, die Ihr Konto betreuen, können sie einsehen. Der kostenlose Tarif übermittelt nichts."
    },
    {
      "title": "4. Weitergabe von Informationen",
      "paragraphs": [
        "Wir geben personenbezogene Daten nur so an Dritte weiter, wie es in dieser Richtlinie beschrieben ist. Wir können Informationen mit Dienstleistern teilen, die uns beim Betrieb unserer Plattform unterstützen."
      ]
    },
    {
      "title": "5. Datensicherheit",
      "paragraphs": [
        "Wir setzen angemessene technische und organisatorische Maßnahmen ein, um personenbezogene Daten vor unbefugtem Zugriff, Veränderung, Offenlegung oder Vernichtung zu schützen."
      ]
    },
    {
      "title": "6. Ihre Rechte",
      "paragraphs": [
        "Sie können jederzeit auf Ihre personenbezogenen Informationen zugreifen, sie aktualisieren oder ihre Löschung beantragen. Verwalten Sie Ihre Kontoeinstellungen oder kontaktieren Sie uns für Unterstützung."
      ]
    },
    {
      "title": "7. Kontakt",
      "paragraphs": [
        "Bei Fragen zu dieser Datenschutzerklärung oder zur Ausübung Ihrer Datenschutzrechte schreiben Sie an:"
      ]
    }
  ],
  "fr": [
    {
      "title": "1. Informations collectées",
      "paragraphs": [
        "Nous collectons les informations que vous nous fournissez directement, par exemple lors de la création d’un compte, de la mise à jour de votre profil ou d’une prise de contact. Il peut s’agir de votre nom, de votre adresse e-mail et de toute autre information que vous choisissez de fournir."
      ]
    },
    {
      "title": "2. Utilisation de vos informations",
      "paragraphs": [
        "Nous utilisons les informations collectées pour fournir, maintenir et améliorer nos services, vous informer des mises à jour et des nouvelles fonctionnalités et protéger nos droits et ceux des utilisateurs."
      ]
    },
    {
      "title": "3. Application de bureau DotScramble",
      "paragraphs": [
        "DotScramble traite vos photos sur votre ordinateur. Les photos, noms de fichiers et métadonnées ne quittent jamais votre appareil. Lorsque Pro est activé, l’application contacte DotSuite pour vérifier la licence lors de l’activation, puis environ une fois par jour, et envoie uniquement :"
      ],
      "bullets": [
        "un identifiant anonyme de l’ordinateur, issu d’un hachage à sens unique de l’identifiant machine du système d’exploitation, pour appliquer la limite de deux ordinateurs ;",
        "un nom d’ordinateur reconnaissable dans votre liste d’appareils, comprenant le système d’exploitation et le nom d’hôte, ainsi que la version de l’application ;",
        "des compteurs quotidiens d’utilisation de Pro : nombre de photos enregistrées avec Pro, traitées par lot ou nettoyées avec les modes de métadonnées Pro, et nombre d’exécutions de la détection IA ou d’AI Evasion. Uniquement des nombres."
      ],
      "closing": "Ces informations servent à gérer la licence, afficher vos appareils et examiner les demandes de remboursement, évaluées selon l’utilisation de Pro. Seul le personnel DotSuite chargé de votre compte peut les consulter. L’offre gratuite n’envoie rien."
    },
    {
      "title": "4. Partage des informations",
      "paragraphs": [
        "Nous ne partageons vos informations personnelles avec des tiers que dans les conditions décrites dans cette politique. Nous pouvons partager des informations avec les prestataires qui nous aident à exploiter notre plateforme."
      ]
    },
    {
      "title": "5. Sécurité des données",
      "paragraphs": [
        "Nous appliquons des mesures techniques et organisationnelles appropriées pour protéger vos informations personnelles contre les accès, modifications, divulgations ou destructions non autorisés."
      ]
    },
    {
      "title": "6. Vos droits",
      "paragraphs": [
        "Vous pouvez accéder à vos informations personnelles, les mettre à jour ou demander leur suppression à tout moment. Vous pouvez gérer les paramètres de votre compte ou nous contacter pour obtenir de l’aide."
      ]
    },
    {
      "title": "7. Nous contacter",
      "paragraphs": [
        "Pour toute question sur cette politique ou pour exercer vos droits relatifs à la confidentialité, écrivez à :"
      ]
    }
  ],
  "ru": [
    {
      "title": "1. Какие сведения мы собираем",
      "paragraphs": [
        "Мы собираем сведения, которые вы предоставляете напрямую, например при создании аккаунта, обновлении профиля или обращении к нам. Это могут быть имя, адрес электронной почты и любые другие сведения, которые вы решите сообщить."
      ]
    },
    {
      "title": "2. Как мы используем сведения",
      "paragraphs": [
        "Собранные сведения используются для предоставления, поддержания и улучшения наших услуг, информирования об обновлениях и новых функциях, а также защиты наших прав и прав пользователей."
      ]
    },
    {
      "title": "3. Приложение DotScramble для компьютера",
      "paragraphs": [
        "DotScramble обрабатывает фотографии на вашем компьютере. Фотографии, имена файлов и их метаданные не покидают устройство. При активации Pro приложение связывается с DotSuite для проверки лицензии в момент активации и затем примерно раз в день, передавая только:"
      ],
      "bullets": [
        "анонимный идентификатор компьютера — результат одностороннего хеширования идентификатора машины в операционной системе, необходимый для соблюдения ограничения в два компьютера;",
        "узнаваемое название компьютера в списке устройств, включая операционную систему и имя хоста, а также версию приложения;",
        "суточные счётчики использования Pro: количество фотографий, сохранённых с Pro, обработанных пакетно или очищенных режимами метаданных Pro, и количество запусков обнаружения ИИ или AI Evasion. Только числа."
      ],
      "closing": "Эти сведения нужны для работы лицензии, отображения устройств и рассмотрения запросов на возврат средств, оцениваемых с учётом использования Pro. Их видят только сотрудники DotSuite, обслуживающие ваш аккаунт. Бесплатный тариф ничего не отправляет."
    },
    {
      "title": "4. Передача сведений",
      "paragraphs": [
        "Мы передаём персональные сведения третьим лицам только в случаях, описанных в этой политике. Сведения могут передаваться поставщикам услуг, помогающим обеспечивать работу нашей платформы."
      ]
    },
    {
      "title": "5. Безопасность данных",
      "paragraphs": [
        "Мы применяем надлежащие технические и организационные меры для защиты персональных сведений от несанкционированного доступа, изменения, раскрытия или уничтожения."
      ]
    },
    {
      "title": "6. Ваши права",
      "paragraphs": [
        "Вы можете в любое время получить доступ к персональным сведениям, обновить их или запросить их удаление. Управляйте настройками аккаунта или обратитесь к нам за помощью."
      ]
    },
    {
      "title": "7. Связь с нами",
      "paragraphs": [
        "По вопросам этой политики или для осуществления прав в отношении персональных данных напишите по адресу:"
      ]
    }
  ]
};
