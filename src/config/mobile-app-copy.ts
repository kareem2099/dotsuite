import type { PrivacyLanguage } from "@/components/privacy/privacy-language";
import type { MobileAppId } from "./mobile-apps";

type Feature = readonly [title: string, description: string];
type ProductCopy = { category: string; headline: string; intro: string; features: readonly [Feature, Feature, Feature] };
type Copy = {
  catalog: string; catalogIntro: string; android: string; tools: string; details: string; install: string; screenshots: string;
  resources: string; resourceIntro: string; terms: string; privacy: string; deletion: string;
  support: string; source: string; legalIndex: string;
  apps: Record<MobileAppId, ProductCopy>;
};

export const mobileAppCopy = {
  en: {
    catalog: "All products", catalogIntro: "Explore DotSuite’s Android apps and tools for VS Code, Linux and the web.", android: "Android apps", tools: "Developer tools", details: "Explore app",
    install: "Get it on Google Play", screenshots: "A look inside", resources: "Support & legal",
    resourceIntro: "Find the app’s terms, see how your data is handled, or request account deletion.",
    terms: "Terms of use", privacy: "Privacy policy", deletion: "Delete account & data",
    support: "Email support", source: "Source on GitHub", legalIndex: "Android app privacy",
    apps: {
      dotreminder: { category: "Planning & reminders", headline: "A little less to remember.", intro: "Put everyday tasks, recurring reminders and upcoming plans in one place. Pick a time, add the details and see what’s next on your calendar.", features: [
        ["See what’s next", "Find your upcoming reminders at a glance and organize them into categories."],
        ["Set it for your schedule", "Choose a date and time, add notes and repeat reminders when you need them."],
        ["Plan around your calendar", "Browse your reminders by date and see what’s coming up before the day starts."],
      ] },
      dotshredzilla: { category: "Workout tracking", headline: "Make every set count.", intro: "Log your reps and weights, follow a workout and see how your lifts change over time. Keep training history and personal records close at hand.", features: [
        ["See your training at a glance", "Find your exercises, routines and progress in one place."],
        ["Stay in the session", "Record sets as you train and use the rest timer between sets."],
        ["Track your best lifts", "Review personal records and training history to see how far you’ve come."],
      ] },
    },
  },
  ar: {
    catalog: "كل المنتجات", catalogIntro: "استكشف تطبيقات أندرويد وأدوات DotSuite لـ VS Code ولينكس والويب.", android: "تطبيقات أندرويد", tools: "أدوات المطورين", details: "استكشف التطبيق",
    install: "حمّله من Google Play", screenshots: "جولة داخل التطبيق", resources: "الدعم والوثائق القانونية",
    resourceIntro: "اطّلع على شروط التطبيق، واعرف كيف نتعامل مع بياناتك، أو اطلب حذف حسابك.",
    terms: "شروط الاستخدام", privacy: "سياسة الخصوصية", deletion: "حذف الحساب والبيانات",
    support: "راسل الدعم", source: "الكود على GitHub", legalIndex: "خصوصية تطبيقات أندرويد",
    apps: {
      dotreminder: { category: "التخطيط والتذكيرات", headline: "خلّي بالك مرتاح.", intro: "اجمع مهامك اليومية وتذكيراتك المتكررة وخططك القادمة في مكان واحد. اختار الموعد، أضف التفاصيل، وشوف اللي جاي على التقويم.", features: [
        ["شوف اللي جاي", "اعرف تذكيراتك القادمة بنظرة واحدة ورتّبها في فئات."],
        ["تذكير على جدولك", "اختار اليوم والوقت، أضف ملاحظات، وكرّر التذكير حسب احتياجك."],
        ["خطّط بالتقويم", "استعرض التذكيرات حسب التاريخ واعرف اللي مستنيك قبل ما يبدأ اليوم."],
      ] },
      dotshredzilla: { category: "متابعة التمارين", headline: "كل مجموعة تفرق.", intro: "سجّل التكرارات والأوزان، تابع تمرينك، وشوف تطوّرك مع الوقت. سجل التمارين وأرقامك الشخصية دايمًا في متناولك.", features: [
        ["تمرينك في نظرة واحدة", "تلاقي التمارين والخطط وتقدّمك في مكان واحد."],
        ["ركّز في تمرينك", "سجّل مجموعاتك أثناء التمرين واستخدم مؤقّت الراحة بين المجموعات."],
        ["تابع أرقامك الشخصية", "راجع أفضل أوزانك وسجل تمارينك عشان تعرف وصلت لفين."],
      ] },
    },
  },
  de: {
    catalog: "Alle Produkte", catalogIntro: "Entdecken Sie die Android-Apps und Werkzeuge von DotSuite für VS Code, Linux und das Web.", android: "Android-Apps", tools: "Entwicklerwerkzeuge", details: "App entdecken",
    install: "Bei Google Play herunterladen", screenshots: "Ein Blick in die App", resources: "Support und Rechtliches",
    resourceIntro: "Hier finden Sie die Nutzungsbedingungen, Informationen zum Datenschutz und die Kontolöschung.",
    terms: "Nutzungsbedingungen", privacy: "Datenschutzerklärung", deletion: "Konto und Daten löschen",
    support: "Support per E-Mail", source: "Quellcode auf GitHub", legalIndex: "Datenschutz für Android-Apps",
    apps: {
      dotreminder: { category: "Planung und Erinnerungen", headline: "Weniger im Kopf behalten.", intro: "Sammeln Sie Aufgaben, wiederkehrende Erinnerungen und Pläne an einem Ort. Legen Sie Zeit und Details fest und sehen Sie im Kalender, was ansteht.", features: [
        ["Alles im Blick", "Sehen Sie bevorstehende Erinnerungen und sortieren Sie sie nach Kategorien."],
        ["Passend zu Ihrem Zeitplan", "Wählen Sie Datum und Uhrzeit, ergänzen Sie Notizen und legen Sie Wiederholungen fest."],
        ["Mit dem Kalender planen", "Sehen Sie Ihre Erinnerungen nach Datum und behalten Sie kommende Termine im Blick."],
      ] },
      dotshredzilla: { category: "Trainingstagebuch", headline: "Jeder Satz zählt.", intro: "Erfassen Sie Wiederholungen und Gewichte, folgen Sie Ihrem Training und verfolgen Sie Ihre Entwicklung. Verlauf und persönliche Bestleistungen bleiben griffbereit.", features: [
        ["Training im Überblick", "Übungen, Routinen und Fortschritt an einem Ort."],
        ["Im Training bleiben", "Erfassen Sie Ihre Sätze und nutzen Sie den Pausentimer dazwischen."],
        ["Bestleistungen verfolgen", "Überprüfen Sie Ihre persönlichen Rekorde und Ihren Trainingsverlauf."],
      ] },
    },
  },
  fr: {
    catalog: "Tous les produits", catalogIntro: "Découvrez les applications Android et les outils DotSuite pour VS Code, Linux et le Web.", android: "Applications Android", tools: "Outils de développement", details: "Découvrir l’application",
    install: "Télécharger sur Google Play", screenshots: "L’application en images", resources: "Assistance et mentions légales",
    resourceIntro: "Consultez les conditions, découvrez comment vos données sont traitées ou demandez la suppression de votre compte.",
    terms: "Conditions d’utilisation", privacy: "Politique de confidentialité", deletion: "Supprimer le compte et les données",
    support: "Contacter l’assistance", source: "Code sur GitHub", legalIndex: "Confidentialité des applications Android",
    apps: {
      dotreminder: { category: "Planification et rappels", headline: "Un peu moins à retenir.", intro: "Rassemblez tâches, rappels récurrents et projets au même endroit. Choisissez une heure, ajoutez les détails et consultez vos prochains rappels dans le calendrier.", features: [
        ["Voir ce qui arrive", "Repérez vos prochains rappels et classez-les par catégorie."],
        ["À votre rythme", "Choisissez la date et l’heure, ajoutez des notes et programmez des répétitions."],
        ["Planifier avec le calendrier", "Parcourez vos rappels par date et préparez votre journée."],
      ] },
      dotshredzilla: { category: "Suivi des entraînements", headline: "Chaque série compte.", intro: "Notez vos répétitions et vos charges, suivez votre séance et observez votre progression. Gardez votre historique et vos records à portée de main.", features: [
        ["Votre entraînement en un coup d’œil", "Retrouvez vos exercices, routines et progrès au même endroit."],
        ["Garder le rythme", "Notez vos séries et utilisez le minuteur de repos entre deux séries."],
        ["Suivre vos records", "Consultez vos meilleures performances et votre historique d’entraînement."],
      ] },
    },
  },
  ru: {
    catalog: "Все продукты", catalogIntro: "Откройте приложения DotSuite для Android и инструменты для VS Code, Linux и веба.", android: "Приложения для Android", tools: "Инструменты разработчика", details: "Обзор приложения",
    install: "Скачать в Google Play", screenshots: "Внутри приложения", resources: "Поддержка и документы",
    resourceIntro: "Ознакомьтесь с условиями, узнайте, как обрабатываются данные, или запросите удаление аккаунта.",
    terms: "Условия использования", privacy: "Политика конфиденциальности", deletion: "Удалить аккаунт и данные",
    support: "Написать в поддержку", source: "Код на GitHub", legalIndex: "Конфиденциальность приложений Android",
    apps: {
      dotreminder: { category: "Планирование и напоминания", headline: "Меньше держать в голове.", intro: "Храните задачи, повторяющиеся напоминания и планы в одном месте. Выберите время, добавьте детали и просматривайте ближайшие события в календаре.", features: [
        ["Что дальше", "Просматривайте ближайшие напоминания и распределяйте их по категориям."],
        ["По вашему расписанию", "Выберите дату и время, добавьте заметки и настройте повторение."],
        ["Планы в календаре", "Просматривайте напоминания по датам и готовьтесь к предстоящему дню."],
      ] },
      dotshredzilla: { category: "Дневник тренировок", headline: "Каждый подход важен.", intro: "Записывайте повторения и веса, следуйте плану тренировки и наблюдайте за прогрессом. История тренировок и личные рекорды всегда под рукой.", features: [
        ["Тренировки на виду", "Упражнения, планы и прогресс в одном месте."],
        ["В ритме тренировки", "Записывайте подходы и используйте таймер отдыха между ними."],
        ["Следите за рекордами", "Просматривайте личные рекорды и историю тренировок."],
      ] },
    },
  },
} satisfies Record<PrivacyLanguage, Copy>;
