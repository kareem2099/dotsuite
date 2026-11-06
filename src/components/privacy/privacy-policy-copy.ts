import type { PrivacyLanguage } from "./privacy-language";

export type PrivacyPolicyCopy = { title: string; intro: string; updated: string; request: string; policy: string; sections: string[][]; linksTitle: string };

export const privacyPolicyCopy = {
  "en": {
    "title": "DotReminder: privacy & account deletion",
    "intro": "DotReminder is a DotSuite app. This section explains the Android app’s data practices and how to request deletion of your account and associated data.",
    "updated": "Last updated: November 4, 2026",
    "request": "Request account and data deletion",
    "policy": "Read the DotReminder policy",
    "sections": [
      [
        "Account and reminder data",
        "We use Firebase Authentication for sign-in and verification. It processes your user ID, email address, phone number if provided, linked Google or Facebook identity, and authentication and verification information. Firestore stores your profile, reminders (including titles, notes, dates, recurrence and optional locations), categories, templates and device session records. Session records include a generated session ID, device name/model and activity times. We use these records to provide your account, synchronize your reminders and show your signed-in devices."
      ],
      [
        "Permissions and information on your device",
        "Notifications and exact-alarm access let the app deliver reminders. Optional location access supports reminders based on a location you choose; a saved location and radius may be stored with that reminder. The app does not need access to your SMS inbox or contacts to verify a phone number. Biometric verification is performed by Android: DotReminder receives an authentication result, not your fingerprint or biometric template. App preferences, remembered email, scheduled-reminder information and temporary drafts may remain on your device."
      ],
      [
        "Optional AI assistance",
        "When you use AI chat, the text you submit and conversation context are sent to Google’s Gemini service to generate replies and reminder suggestions. Avoid submitting information you do not want processed by that service. Google’s applicable Gemini terms and retention rules govern that processing; we do not promise that these submissions are excluded from all provider retention or model improvement. Requests pass through the DotSuite backend, which verifies your Firebase account token and processes your account identifier, usage counters and a hashed network identifier to enforce access and usage limits. We do not store AI conversation content in this backend."
      ],
      [
        "Analytics, advertising and other providers",
        "The app includes Firebase Analytics and Google AdMob. Depending on device settings, permissions and applicable consent, these services may process app interactions, device and app information, IP addresses and advertising or app-instance identifiers for analytics, ad delivery, measurement and abuse prevention. Google/Firebase, Google sign-in, Facebook sign-in and the hosting/email providers used for support process information needed for their services. Do not assume that hiding an ad placement disables every SDK’s collection."
      ],
      [
        "Retention and control",
        "We retain your active account information and saved reminder data while you use the account, until you delete individual records or your verified account-deletion request is completed. You can edit or delete individual reminders, categories and templates in the app. For access, correction, deletion of specific information or a privacy question, email support@dotsuite.dev. Removing the app or signing out does not delete cloud data. The account-deletion process covers our account-linked records; independent provider logs, device backups and anonymous aggregate statistics are described separately there."
      ]
    ],
    "linksTitle": "Service-provider information"
  },
  "ar": {
    "title": "DotReminder: الخصوصية وحذف الحساب",
    "intro": "DotReminder تطبيق من DotSuite. يوضح هذا القسم كيفية التعامل مع بيانات تطبيق أندرويد وطريقة طلب حذف الحساب والبيانات المرتبطة به.",
    "updated": "آخر تحديث: ٤ نوفمبر ٢٠٢٦",
    "request": "طلب حذف الحساب والبيانات",
    "policy": "قراءة سياسة DotReminder",
    "sections": [
      [
        "بيانات الحساب والتذكيرات",
        "نستخدم Firebase Authentication لتسجيل الدخول والتحقق. تعالج الخدمة معرّف المستخدم والبريد الإلكتروني ورقم الهاتف عند تقديمه، وهوية Google أو Facebook المرتبطة، وبيانات المصادقة والتحقق. تخزن Firestore الملف الشخصي والتذكيرات، بما فيها العناوين والملاحظات والمواعيد والتكرار والمواقع الاختيارية، والفئات والقوالب وسجلات جلسات الأجهزة. تتضمن سجلات الجلسات معرّفًا مولّدًا واسم الجهاز وطرازه وأوقات النشاط. نستخدمها لتشغيل الحساب ومزامنة التذكيرات وعرض أجهزة تسجيل الدخول."
      ],
      [
        "الصلاحيات والبيانات على الجهاز",
        "تُستخدم صلاحيات الإشعارات والتنبيهات الدقيقة لتوصيل التذكيرات. يدعم إذن الموقع الاختياري التذكيرات المرتبطة بموقع تختاره، وقد يُحفظ الموقع ونطاقه مع التذكير. لا يحتاج التحقق من رقم الهاتف إلى قراءة صندوق رسائل SMS أو جهات الاتصال. يجري أندرويد التحقق بالبصمة، ويتلقى DotReminder نتيجة التحقق ولا يتلقى بصمتك أو قالبها. قد تبقى تفضيلات التطبيق والبريد المحفوظ وبيانات التنبيهات المجدولة والمسودات المؤقتة على جهازك."
      ],
      [
        "مساعدة الذكاء الاصطناعي الاختيارية",
        "عند استخدام محادثة الذكاء الاصطناعي، يُرسل النص الذي تقدمه وسياق المحادثة إلى خدمة Gemini من Google لإنتاج الردود واقتراح التذكيرات. تجنب تقديم معلومات لا ترغب في معالجتها بهذه الخدمة. تخضع المعالجة لشروط Gemini وقواعد الاحتفاظ المطبقة لدى Google؛ لا نَعِد باستثناء المدخلات من جميع أنواع احتفاظ المزوّد أو تحسين النماذج. تمر الطلبات عبر خادم DotSuite الذي يتحقق من توكن حساب Firebase ويعالج معرّف حسابك وعدادات الاستخدام ومعرّف شبكة مجزّأ لفرض حدود الوصول والاستخدام. لا نخزّن محتوى محادثة الذكاء الاصطناعي في هذا الخادم."
      ],
      [
        "التحليلات والإعلانات ومزوّدو الخدمات",
        "يتضمن التطبيق Firebase Analytics وGoogle AdMob. بحسب إعدادات الجهاز والصلاحيات والموافقة المطلوبة، قد تعالج هذه الخدمات تفاعلات التطبيق ومعلومات الجهاز والتطبيق وعنوان IP ومعرّفات الإعلانات أو نسخة التطبيق لأغراض التحليل وتوصيل الإعلانات وقياسها ومنع الإساءة. تعالج Google وFirebase وخدمات تسجيل الدخول من Google وFacebook ومزوّدو الاستضافة والبريد المستخدمون للدعم المعلومات اللازمة لخدماتهم. إخفاء موضع إعلان لا يعني تعطيل جميع عمليات جمع البيانات في حزم الخدمات."
      ],
      [
        "الاحتفاظ والتحكم في بياناتك",
        "نحتفظ ببيانات الحساب النشط والتذكيرات المحفوظة أثناء استخدام الحساب، إلى أن تحذف السجلات منفردة أو يكتمل طلب حذف الحساب بعد التحقق من ملكيته. يمكنك تعديل وحذف التذكيرات والفئات والقوالب من التطبيق. لطلب الوصول إلى بياناتك أو تصحيحها أو حذف معلومات محددة أو الاستفسار عن الخصوصية، تواصل بالبريد أدناه. إزالة التطبيق أو تسجيل الخروج لا يحذفان بيانات السحابة. يشمل مسار الحذف أدناه سجلاتنا المرتبطة بالحساب، ويوضح بصورة منفصلة وضع سجلات المزوّدين المستقلة ونسخ الجهاز والإحصاءات المجمّعة مجهولة الهوية."
      ]
    ],
    "linksTitle": "معلومات مزوّدي الخدمات"
  },
  "de": {
    "title": "DotReminder: Datenschutz und Kontolöschung",
    "intro": "DotReminder ist eine App von DotSuite. Dieser Abschnitt erläutert die Datenverarbeitung in der Android-App und wie Sie die Löschung Ihres Kontos und der zugehörigen Daten beantragen können.",
    "updated": "Zuletzt aktualisiert: 4. November 2026",
    "request": "Löschung von Konto und Daten beantragen",
    "policy": "Datenschutzhinweise zu DotReminder lesen",
    "sections": [
      [
        "Konto- und Erinnerungsdaten",
        "Wir verwenden Firebase Authentication für Anmeldung und Verifizierung. Der Dienst verarbeitet Ihre Nutzer-ID, E-Mail-Adresse, eine gegebenenfalls angegebene Telefonnummer, die verknüpfte Google- oder Facebook-Identität sowie Authentifizierungs- und Verifizierungsinformationen. Firestore speichert Ihr Profil, Erinnerungen einschließlich Titel, Notizen, Termine, Wiederholungen und optionaler Standorte, Kategorien, Vorlagen und Gerätesitzungen. Sitzungsdatensätze enthalten eine erzeugte Sitzungs-ID, Gerätenamen und -modell sowie Aktivitätszeiten. Wir verwenden diese Daten, um Ihr Konto bereitzustellen, Erinnerungen zu synchronisieren und angemeldete Geräte anzuzeigen."
      ],
      [
        "Berechtigungen und Daten auf Ihrem Gerät",
        "Benachrichtigungs- und genaue Alarmberechtigungen ermöglichen die Zustellung von Erinnerungen. Optionaler Standortzugriff unterstützt Erinnerungen an einem von Ihnen gewählten Ort; Standort und Umkreis können mit der Erinnerung gespeichert werden. Zur Telefonnummernverifizierung benötigt die App keinen Zugriff auf Ihren SMS-Posteingang oder Ihre Kontakte. Android führt die biometrische Prüfung durch: DotReminder erhält ein Authentifizierungsergebnis, nicht Ihren Fingerabdruck oder Ihre biometrische Vorlage. App-Einstellungen, gespeicherte E-Mail-Adressen, geplante Alarmdaten und vorübergehende Entwürfe können auf dem Gerät verbleiben."
      ],
      [
        "Optionale KI-Unterstützung",
        "Bei Nutzung des KI-Chats werden Ihre Eingaben und der Gesprächskontext an den Gemini-Dienst von Google übermittelt, um Antworten und Erinnerungsvorschläge zu erzeugen. Geben Sie keine Informationen ein, die dieser Dienst nicht verarbeiten soll. Es gelten die jeweiligen Gemini-Bedingungen und Aufbewahrungsregeln von Google. Wir versprechen nicht, dass Eingaben von jeder Aufbewahrung oder Modellverbesserung beim Anbieter ausgeschlossen sind. Anfragen laufen über das DotSuite-Backend. Es prüft Ihr Firebase-Kontotoken und verarbeitet Ihre Kontokennung, Nutzungszähler und eine gehashte Netzwerkkennung zur Durchsetzung von Zugriffs- und Nutzungslimits. Gesprächsinhalte werden in diesem Backend nicht gespeichert."
      ],
      [
        "Analyse, Werbung und andere Dienstleister",
        "Die App enthält Firebase Analytics und Google AdMob. Abhängig von Geräteeinstellungen, Berechtigungen und gegebenenfalls erforderlicher Einwilligung können diese Dienste App-Interaktionen, Geräte- und App-Informationen, IP-Adressen sowie Werbe- oder App-Instanzkennungen für Analyse, Werbeauslieferung, Erfolgsmessung und Missbrauchsschutz verarbeiten. Google/Firebase, die Anmeldedienste von Google und Facebook sowie die für den Support eingesetzten Hosting- und E-Mail-Anbieter verarbeiten die für ihre Dienste erforderlichen Informationen. Das Ausblenden einer Werbefläche deaktiviert nicht automatisch jede Datenerhebung durch SDKs."
      ],
      [
        "Aufbewahrung und Kontrolle",
        "Wir bewahren aktive Kontoinformationen und gespeicherte Erinnerungen auf, solange Sie das Konto verwenden, bis Sie einzelne Datensätze löschen oder Ihr verifizierter Antrag auf Kontolöschung abgeschlossen ist. Erinnerungen, Kategorien und Vorlagen können Sie in der App bearbeiten oder löschen. Für Auskunft, Berichtigung, Löschung bestimmter Informationen oder Datenschutzfragen schreiben Sie an die unten genannte Adresse. Deinstallation oder Abmeldung löscht keine Cloud-Daten. Das Löschverfahren umfasst unsere kontobezogenen Datensätze; unabhängige Anbieterprotokolle, Gerätesicherungen und anonyme Gesamtstatistiken werden gesondert im Löschabschnitt erläutert."
      ]
    ],
    "linksTitle": "Informationen der Dienstleister"
  },
  "fr": {
    "title": "DotReminder : confidentialité et suppression du compte",
    "intro": "DotReminder est une application de DotSuite. Cette section explique le traitement des données dans l’application Android et la procédure de demande de suppression du compte et des données associées.",
    "updated": "Dernière mise à jour : 4 novembre 2026",
    "request": "Demander la suppression du compte et des données",
    "policy": "Lire la politique de DotReminder",
    "sections": [
      [
        "Données du compte et des rappels",
        "Nous utilisons Firebase Authentication pour la connexion et la vérification. Ce service traite votre identifiant utilisateur, votre adresse e-mail, votre numéro de téléphone si vous le fournissez, votre identité Google ou Facebook associée, ainsi que les informations d’authentification et de vérification. Firestore conserve votre profil, vos rappels, notamment leurs titres, notes, dates, récurrences et lieux facultatifs, vos catégories, modèles et sessions sur les appareils. Les sessions comprennent un identifiant généré, le nom et le modèle de l’appareil et les heures d’activité. Ces données servent à fournir votre compte, synchroniser vos rappels et afficher les appareils connectés."
      ],
      [
        "Autorisations et données sur votre appareil",
        "Les autorisations de notification et d’alarmes exactes permettent de délivrer les rappels. L’accès facultatif à la position permet des rappels liés à un lieu choisi ; un lieu et un rayon peuvent être enregistrés avec le rappel. L’application n’a pas besoin d’accéder à votre boîte de réception SMS ou à vos contacts pour vérifier un numéro. Android effectue la vérification biométrique : DotReminder reçoit un résultat d’authentification, pas votre empreinte ni votre modèle biométrique. Les préférences, l’e-mail mémorisé, les alarmes programmées et les brouillons temporaires peuvent rester sur l’appareil."
      ],
      [
        "Assistance facultative par IA",
        "Lorsque vous utilisez la conversation IA, le texte envoyé et le contexte de la conversation sont transmis au service Gemini de Google afin de générer des réponses et des suggestions de rappels. N’envoyez pas d’informations que vous ne souhaitez pas voir traitées par ce service. Les conditions Gemini et les règles de conservation applicables de Google régissent ce traitement ; nous ne garantissons pas que ces saisies sont exclues de toute conservation ou amélioration des modèles par le fournisseur. Les demandes passent par le serveur DotSuite, qui vérifie le jeton du compte Firebase et traite l’identifiant du compte, des compteurs d’utilisation et un identifiant réseau haché pour appliquer les limites d’accès et d’utilisation. Nous ne conservons pas le contenu des conversations IA dans ce serveur."
      ],
      [
        "Analyse, publicité et autres prestataires",
        "L’application comprend Firebase Analytics et Google AdMob. Selon les réglages de l’appareil, les autorisations et le consentement applicable, ces services peuvent traiter les interactions avec l’application, des informations sur l’appareil et l’application, les adresses IP et les identifiants publicitaires ou d’instance d’application à des fins d’analyse, de diffusion et de mesure publicitaire et de prévention des abus. Google/Firebase, les services de connexion Google et Facebook et les prestataires d’hébergement et de messagerie du support traitent les informations nécessaires à leurs services. Masquer un emplacement publicitaire ne désactive pas automatiquement toute collecte des SDK."
      ],
      [
        "Conservation et contrôle",
        "Nous conservons les informations du compte actif et les rappels tant que vous utilisez le compte, jusqu’à la suppression de données individuelles ou l’exécution de votre demande de suppression après vérification. Vous pouvez modifier ou supprimer vos rappels, catégories et modèles dans l’application. Pour accéder à vos données, les rectifier, demander la suppression d’informations précises ou poser une question, écrivez à l’adresse indiquée ci-dessous. Désinstaller l’application ou se déconnecter ne supprime pas les données du cloud. La procédure de suppression couvre nos données liées au compte ; les journaux indépendants des fournisseurs, sauvegardes de l’appareil et statistiques agrégées anonymes sont traités séparément dans la section de suppression."
      ]
    ],
    "linksTitle": "Informations des prestataires"
  },
  "ru": {
    "title": "DotReminder: конфиденциальность и удаление аккаунта",
    "intro": "DotReminder — приложение DotSuite. В этом разделе описаны обработка данных в Android-приложении и порядок запроса на удаление аккаунта и связанных с ним данных.",
    "updated": "Последнее обновление: 4 ноября 2026 г.",
    "request": "Запросить удаление аккаунта и данных",
    "policy": "Прочитать политику DotReminder",
    "sections": [
      [
        "Данные аккаунта и напоминаний",
        "Для входа и проверки используется Firebase Authentication. Сервис обрабатывает идентификатор пользователя, адрес электронной почты, номер телефона, если он указан, связанную учётную запись Google или Facebook, а также сведения об аутентификации и проверке. Firestore хранит профиль, напоминания, включая заголовки, заметки, даты, повторения и необязательные места, категории, шаблоны и записи сеансов на устройствах. Записи сеансов включают сгенерированный идентификатор, название и модель устройства, а также время активности. Эти сведения нужны для работы аккаунта, синхронизации напоминаний и отображения устройств, на которых выполнен вход."
      ],
      [
        "Разрешения и данные на устройстве",
        "Разрешения на уведомления и точные будильники позволяют доставлять напоминания. Необязательный доступ к местоположению поддерживает напоминания для выбранного вами места; место и радиус могут сохраняться вместе с напоминанием. Для проверки номера телефона приложению не нужен доступ к входящим SMS или контактам. Биометрическую проверку выполняет Android: DotReminder получает результат аутентификации, а не отпечаток пальца или биометрический шаблон. Настройки приложения, сохранённый адрес почты, запланированные сигналы и временные черновики могут оставаться на устройстве."
      ],
      [
        "Необязательная помощь ИИ",
        "При использовании ИИ-чата отправленный текст и контекст беседы передаются сервису Gemini компании Google для создания ответов и предложений напоминаний. Не отправляйте сведения, которые вы не хотите передавать этому сервису. Обработка регулируется применимыми условиями Gemini и правилами хранения Google; мы не обещаем исключить эти данные из всех видов хранения или улучшения моделей у поставщика. Запросы проходят через сервер DotSuite, который проверяет токен аккаунта Firebase и обрабатывает идентификатор аккаунта, счётчики использования и хешированный сетевой идентификатор для ограничения доступа и использования. Содержание бесед с ИИ на этом сервере не сохраняется."
      ],
      [
        "Аналитика, реклама и другие поставщики",
        "Приложение включает Firebase Analytics и Google AdMob. В зависимости от настроек устройства, разрешений и применимого согласия эти сервисы могут обрабатывать действия в приложении, сведения об устройстве и приложении, IP-адреса, рекламные идентификаторы и идентификаторы экземпляра приложения для аналитики, показа и измерения рекламы и предотвращения злоупотреблений. Google/Firebase, сервисы входа Google и Facebook, а также поставщики хостинга и почты для поддержки обрабатывают сведения, необходимые для их работы. Скрытие рекламного блока не означает автоматического отключения всего сбора данных SDK."
      ],
      [
        "Хранение и управление данными",
        "Мы храним сведения активного аккаунта и сохранённые напоминания, пока вы пользуетесь аккаунтом, до удаления отдельных записей или исполнения подтверждённого запроса на удаление аккаунта. Напоминания, категории и шаблоны можно изменять и удалять в приложении. Для доступа к данным, их исправления, удаления отдельных сведений или вопросов о конфиденциальности напишите по адресу ниже. Выход из аккаунта или удаление приложения не удаляют облачные данные. Процедура удаления охватывает наши записи, связанные с аккаунтом; независимые журналы поставщиков, резервные копии устройства и анонимная сводная статистика описаны отдельно в разделе удаления."
      ]
    ],
    "linksTitle": "Информация поставщиков услуг"
  }
} satisfies Record<PrivacyLanguage, PrivacyPolicyCopy>;
