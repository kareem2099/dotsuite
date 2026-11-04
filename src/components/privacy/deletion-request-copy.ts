import type { PrivacyLanguage } from "./privacy-language";

const baseCopy = {
  en: {
    title: "Delete your DotReminder account & associated data",
    intro: "You can request deletion at any time, including after uninstalling the app. A DotSuite account or app installation is not required. Requests are handled by the DotReminder support team.",
    scope: "What is deleted",
    items: ["Your DotReminder sign-in account and linked sign-in / verification information.", "Your profile, reminders (including saved locations and notes), categories and templates.", "Your account’s device-session records in our database."],
    timing: "We verify that you own the account before deleting it. After verification, we complete the request within 30 days and email you when it is finished. If more information is needed to identify your account, we will explain what is needed. Never send a password, SMS code, authenticator code or identity document in your request.",
    warning: "Completed deletion is permanent. Deleting your DotReminder account does not delete your Google, Facebook or separate DotSuite account. Reminders can continue to notify you while a request is pending.",
    copies: "Local copies and provider data",
    retention: "Deletion removes the account-linked records listed above from our active systems. To remove local drafts, preferences and scheduled alarms on each device, clear DotReminder’s app storage or uninstall it. Copies you exported and device backups are under your control. Provider security/operational logs and AI submissions can be subject to the provider policies linked below; they are not covered by a promise that every provider copy disappears within 30 days. We request provider deletion for identifiable account-linked data where supported. Anonymous aggregate statistics that no longer identify you cannot be linked back to an account. We do not deliberately retain the profile, reminder, category, template or session records listed above after completing deletion. If a legal obligation requires an exception, we explain the affected information, reason and applicable retention period in our response.",
    email: "Account email address", uid: "Account ID (optional)",
    hint: "Use the email you use with DotReminder. If you cannot access that inbox, email support and describe the issue; do not send credentials.",
    submit: "Prepare deletion request email", fallback: "Or email us directly", draft: "Your email app will open a draft. Review it and press Send there. Opening this draft does not submit a request or delete your account.",
    preview: "Request text — you can copy this into any email app", subject: "DotReminder — account and associated data deletion request",
    body: "Please delete my DotReminder account and all associated account data: profile, reminders and saved locations, categories, templates and device-session records.\nAccount email: ", id: "\nAccount ID: ", ending: "\nPlease explain the account-ownership verification steps and confirm completion by email. I understand completed deletion is permanent.",
  },
  ar: {
    title: "حذف حساب DotReminder والبيانات المرتبطة به",
    intro: "يمكنك طلب الحذف في أي وقت، حتى بعد إزالة التطبيق. لا تحتاج إلى حساب DotSuite أو إعادة تثبيت التطبيق. يتولى فريق دعم DotReminder معالجة الطلبات.",
    scope: "ما الذي يُحذف؟",
    items: ["حساب تسجيل الدخول إلى DotReminder وبيانات تسجيل الدخول والتحقق المرتبطة به.", "ملفك الشخصي والتذكيرات، بما فيها المواقع والملاحظات المحفوظة، والفئات والقوالب.", "سجلات جلسات أجهزة حسابك في قاعدة بياناتنا."],
    timing: "نتحقق من ملكيتك للحساب قبل حذفه. بعد التحقق، ننفذ الطلب خلال ٣٠ يومًا ونبلغك بالبريد عند اكتماله. إذا احتجنا معلومات إضافية لتحديد الحساب، نوضح المطلوب. لا ترسل كلمة مرور أو رمز SMS أو رمز تطبيق المصادقة أو مستند هوية ضمن الطلب.",
    warning: "الحذف بعد اكتماله نهائي. حذف حساب DotReminder لا يحذف حساب Google أو Facebook أو حساب DotSuite المنفصل. قد تستمر تنبيهات التذكيرات أثناء معالجة الطلب.",
    copies: "النسخ المحلية وبيانات مزوّدي الخدمات",
    retention: "يحذف الطلب سجلات الحساب المذكورة أعلاه من أنظمتنا النشطة. لحذف المسودات والتفضيلات والتنبيهات المجدولة محليًا على كل جهاز، امسح بيانات DotReminder من إعدادات الجهاز أو أزل التطبيق. النسخ التي صدّرتها والنسخ الاحتياطية لجهازك تقع تحت تحكمك. قد تخضع سجلات الأمان والتشغيل ومدخلات الذكاء الاصطناعي لدى المزوّدين لسياساتهم المرتبطة أدناه؛ لا يشملها وعد باختفاء كل نسخة لدى كل مزوّد خلال ٣٠ يومًا. نطلب حذف البيانات المرتبطة بالحساب والقابلة للتحديد لدى المزوّدين حيثما تدعم خدماتهم ذلك. لا يمكن ربط الإحصاءات المجمّعة مجهولة الهوية بحساب بعينه. لا نحتفظ عمدًا بسجلات الملف الشخصي أو التذكيرات أو الفئات أو القوالب أو الجلسات المذكورة أعلاه بعد اكتمال الحذف. إذا تطلب التزام قانوني استثناءً، نوضح في ردنا البيانات المعنية والسبب ومدة الاحتفاظ المطبقة.",
    email: "البريد الإلكتروني للحساب", uid: "معرّف الحساب (اختياري)",
    hint: "استخدم بريد حسابك في DotReminder. إذا تعذر الوصول إليه، راسل الدعم واشرح المشكلة دون إرسال بيانات الدخول.",
    submit: "تجهيز رسالة طلب الحذف", fallback: "أو راسلنا مباشرة", draft: "سيفتح تطبيق البريد مسودة. راجعها واضغط إرسال داخله. فتح المسودة وحده لا يرسل الطلب ولا يحذف الحساب.",
    preview: "نص الطلب — يمكنك نسخه إلى أي تطبيق بريد", subject: "DotReminder — طلب حذف الحساب والبيانات المرتبطة به",
    body: "أرجو حذف حسابي في DotReminder وجميع بياناته المرتبطة: الملف الشخصي والتذكيرات والمواقع المحفوظة والفئات والقوالب وسجلات جلسات الأجهزة.\nبريد الحساب: ", id: "\nمعرّف الحساب: ", ending: "\nأرجو توضيح خطوات التحقق من ملكية الحساب وتأكيد اكتمال الحذف بالبريد. أفهم أن الحذف بعد اكتماله نهائي.",
  },
};

export const deletionRequestCopy = {
  ...baseCopy,

  "de": {
    "title": "Ihr DotReminder-Konto und zugehörige Daten löschen",
    "intro": "Sie können die Löschung jederzeit beantragen, auch nach der Deinstallation. Ein DotSuite-Konto oder die Installation der App ist dafür nicht erforderlich. Der DotReminder-Support bearbeitet die Anfragen.",
    "scope": "Was wird gelöscht?",
    "items": [
      "Ihr DotReminder-Anmeldekonto und die zugehörigen Anmelde- und Verifizierungsinformationen.",
      "Ihr Profil, Erinnerungen einschließlich gespeicherter Standorte und Notizen, Kategorien und Vorlagen.",
      "Die Gerätesitzungsdatensätze Ihres Kontos in unserer Datenbank."
    ],
    "timing": "Vor der Löschung prüfen wir, ob Ihnen das Konto gehört. Nach der Bestätigung schließen wir den Antrag innerhalb von 30 Tagen ab und informieren Sie per E-Mail. Falls wir weitere Angaben zur Zuordnung benötigen, erklären wir Ihnen diese. Senden Sie niemals Passwörter, SMS-Codes, Authenticator-Codes oder Ausweisdokumente mit Ihrem Antrag.",
    "warning": "Eine abgeschlossene Löschung ist endgültig. Die Löschung Ihres DotReminder-Kontos löscht nicht Ihr Google-, Facebook- oder separates DotSuite-Konto. Während der Bearbeitung können Erinnerungen weiterhin Benachrichtigungen auslösen.",
    "copies": "Lokale Kopien und Daten bei Dienstleistern",
    "retention": "Die Löschung entfernt die oben aufgeführten kontobezogenen Datensätze aus unseren aktiven Systemen. Um lokale Entwürfe, Einstellungen und geplante Alarme auf jedem Gerät zu entfernen, löschen Sie den App-Speicher von DotReminder oder deinstallieren Sie die App. Exportierte Kopien und Gerätesicherungen liegen unter Ihrer Kontrolle. Sicherheits- und Betriebsprotokolle sowie KI-Eingaben bei Anbietern können deren unten verlinkten Regeln unterliegen; wir versprechen nicht, dass jede Anbieterkopie innerhalb von 30 Tagen verschwindet. Soweit unterstützt, beantragen wir die Löschung identifizierbarer kontobezogener Daten bei den Anbietern. Anonyme Gesamtstatistiken, die Sie nicht mehr identifizieren, lassen sich keinem Konto zuordnen. Die oben aufgeführten Profil-, Erinnerungs-, Kategorie-, Vorlagen- und Sitzungsdatensätze bewahren wir nach Abschluss der Löschung nicht absichtlich auf. Erfordert eine gesetzliche Verpflichtung eine Ausnahme, erläutern wir die betroffenen Informationen, den Grund und die geltende Aufbewahrungsfrist in unserer Antwort.",
    "email": "E-Mail-Adresse des Kontos",
    "uid": "Konto-ID (optional)",
    "hint": "Verwenden Sie die E-Mail-Adresse Ihres DotReminder-Kontos. Haben Sie keinen Zugriff mehr auf dieses Postfach, schreiben Sie dem Support und beschreiben Sie das Problem, ohne Zugangsdaten zu senden.",
    "submit": "E-Mail zur Kontolöschung vorbereiten",
    "fallback": "Oder schreiben Sie uns direkt",
    "draft": "Ihr E-Mail-Programm öffnet einen Entwurf. Prüfen Sie ihn und klicken Sie dort auf Senden. Das Öffnen des Entwurfs übermittelt keinen Antrag und löscht Ihr Konto nicht.",
    "preview": "Antragstext – zum Kopieren in ein beliebiges E-Mail-Programm",
    "subject": "DotReminder – Antrag auf Löschung des Kontos und zugehöriger Daten",
    "body": "Bitte löschen Sie mein DotReminder-Konto und alle zugehörigen Kontodaten: Profil, Erinnerungen und gespeicherte Standorte, Kategorien, Vorlagen und Gerätesitzungsdatensätze.\nKonto-E-Mail: ",
    "id": "\nKonto-ID: ",
    "ending": "\nBitte erläutern Sie die Schritte zur Prüfung der Kontoinhaberschaft und bestätigen Sie die Löschung per E-Mail. Mir ist bekannt, dass die abgeschlossene Löschung endgültig ist."
  },
  "fr": {
    "title": "Supprimer votre compte DotReminder et les données associées",
    "intro": "Vous pouvez demander la suppression à tout moment, même après avoir désinstallé l’application. Aucun compte DotSuite ni installation de l’application n’est requis. Les demandes sont traitées par l’équipe d’assistance DotReminder.",
    "scope": "Éléments supprimés",
    "items": [
      "Votre compte de connexion DotReminder et les informations de connexion et de vérification associées.",
      "Votre profil, vos rappels, y compris les lieux et notes enregistrés, vos catégories et modèles.",
      "Les enregistrements des sessions de vos appareils dans notre base de données."
    ],
    "timing": "Nous vérifions que vous êtes titulaire du compte avant de le supprimer. Après vérification, nous exécutons la demande dans un délai de 30 jours et vous prévenons par e-mail. Si des informations supplémentaires sont nécessaires pour identifier le compte, nous vous indiquons lesquelles. N’envoyez jamais de mot de passe, de code SMS, de code d’authentification ou de pièce d’identité dans votre demande.",
    "warning": "La suppression, une fois terminée, est définitive. Supprimer votre compte DotReminder ne supprime pas vos comptes Google, Facebook ou votre compte DotSuite distinct. Les rappels peuvent continuer à produire des notifications pendant le traitement.",
    "copies": "Copies locales et données des prestataires",
    "retention": "La suppression retire de nos systèmes actifs les données liées au compte énumérées ci-dessus. Pour effacer les brouillons, préférences et alarmes programmées sur chaque appareil, effacez les données de stockage de DotReminder ou désinstallez l’application. Vous contrôlez les copies exportées et les sauvegardes de vos appareils. Les journaux de sécurité et de fonctionnement des prestataires et les données envoyées à l’IA peuvent relever des politiques indiquées ci-dessous ; nous ne promettons pas la disparition de toute copie chez chaque prestataire sous 30 jours. Nous demandons aux prestataires de supprimer les données identifiables liées au compte lorsque leurs services le permettent. Les statistiques agrégées anonymes qui ne vous identifient plus ne peuvent pas être reliées à un compte. Nous ne conservons pas délibérément les profils, rappels, catégories, modèles et sessions énumérés ci-dessus après exécution de la suppression. Si une obligation légale exige une exception, notre réponse précise les informations concernées, le motif et la durée de conservation applicable.",
    "email": "Adresse e-mail du compte",
    "uid": "Identifiant du compte (facultatif)",
    "hint": "Utilisez l’adresse de votre compte DotReminder. Si vous n’avez plus accès à cette boîte mail, contactez l’assistance et expliquez la situation sans envoyer vos identifiants de connexion.",
    "submit": "Préparer l’e-mail de demande de suppression",
    "fallback": "Ou écrivez-nous directement",
    "draft": "Votre application de messagerie ouvrira un brouillon. Vérifiez-le puis appuyez sur Envoyer dans cette application. Ouvrir le brouillon ne transmet pas de demande et ne supprime pas votre compte.",
    "preview": "Texte de la demande — à copier dans toute application de messagerie",
    "subject": "DotReminder — demande de suppression du compte et des données associées",
    "body": "Veuillez supprimer mon compte DotReminder et toutes les données associées : profil, rappels et lieux enregistrés, catégories, modèles et enregistrements des sessions des appareils.\nE-mail du compte : ",
    "id": "\nIdentifiant du compte : ",
    "ending": "\nVeuillez expliquer la vérification du titulaire du compte et confirmer la suppression par e-mail. Je comprends que la suppression terminée est définitive."
  },
  "ru": {
    "title": "Удалить аккаунт DotReminder и связанные данные",
    "intro": "Вы можете запросить удаление в любое время, в том числе после удаления приложения. Аккаунт DotSuite и установка приложения не требуются. Запросы обрабатывает служба поддержки DotReminder.",
    "scope": "Какие данные удаляются",
    "items": [
      "Аккаунт входа DotReminder и связанные сведения для входа и проверки.",
      "Ваш профиль, напоминания, включая сохранённые места и заметки, категории и шаблоны.",
      "Записи сеансов устройств вашего аккаунта в нашей базе данных."
    ],
    "timing": "Перед удалением мы проверяем, что аккаунт принадлежит вам. После проверки запрос выполняется в течение 30 дней; о завершении мы сообщаем по электронной почте. Если для определения аккаунта нужны дополнительные сведения, мы объясним, какие именно. Не отправляйте пароли, коды SMS, коды приложения-аутентификатора или документы, удостоверяющие личность.",
    "warning": "Завершённое удаление необратимо. Удаление аккаунта DotReminder не удаляет ваши аккаунты Google, Facebook или отдельный аккаунт DotSuite. Пока запрос обрабатывается, напоминания могут продолжать отправлять уведомления.",
    "copies": "Локальные копии и данные у поставщиков",
    "retention": "При удалении перечисленные выше записи аккаунта удаляются из наших активных систем. Чтобы удалить локальные черновики, настройки и запланированные сигналы на каждом устройстве, очистите хранилище DotReminder или удалите приложение. Экспортированные копии и резервные копии устройств находятся под вашим контролем. Журналы безопасности и работы поставщиков, а также данные, переданные ИИ, могут храниться по их правилам, ссылки на которые приведены ниже; мы не обещаем исчезновения всех копий у каждого поставщика за 30 дней. Мы запрашиваем удаление идентифицируемых данных аккаунта у поставщиков, когда их сервисы это поддерживают. Анонимная сводная статистика, которая больше не идентифицирует вас, не может быть связана с аккаунтом. После завершения удаления мы намеренно не сохраняем перечисленные выше записи профиля, напоминаний, категорий, шаблонов и сеансов. Если закон требует исключения, в ответе мы объясняем, какие сведения сохраняются, по какой причине и на какой применимый срок.",
    "email": "Электронная почта аккаунта",
    "uid": "Идентификатор аккаунта (необязательно)",
    "hint": "Укажите почту, которую используете в DotReminder. Если доступа к ней больше нет, напишите в поддержку и объясните ситуацию, не отправляя данные для входа.",
    "submit": "Подготовить письмо с запросом на удаление",
    "fallback": "Или напишите нам напрямую",
    "draft": "В почтовом приложении откроется черновик. Проверьте его и нажмите «Отправить» в этом приложении. Открытие черновика не отправляет запрос и не удаляет аккаунт.",
    "preview": "Текст запроса — можно скопировать в любое почтовое приложение",
    "subject": "DotReminder — запрос на удаление аккаунта и связанных данных",
    "body": "Прошу удалить мой аккаунт DotReminder и все связанные данные: профиль, напоминания и сохранённые места, категории, шаблоны и записи сеансов устройств.\nПочта аккаунта: ",
    "id": "\nИдентификатор аккаунта: ",
    "ending": "\nПожалуйста, объясните порядок проверки владельца аккаунта и подтвердите удаление по электронной почте. Я понимаю, что завершённое удаление необратимо."
  }

} satisfies Record<PrivacyLanguage, typeof baseCopy.en>;
