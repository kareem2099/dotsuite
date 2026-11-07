import type { DeletionRequestCopy } from "./deletion-request-copy";
import type { PrivacyLanguage } from "./privacy-language";
import type { PrivacyPolicyCopy } from "./privacy-policy-copy";

export const dotShredzillaPolicyCopy = {
  "en": {
    "title": "DotShredzilla: privacy & account deletion",
    "intro": "DotShredzilla is a DotSuite workout tracker for Android. This section explains what the app stores, why, and how to delete your account and all associated data.",
    "updated": "Last updated: November 7, 2026",
    "request": "Delete account and data",
    "policy": "Read the DotShredzilla policy",
    "sections": [
      [
        "Account and training data",
        "We use Firebase Authentication for sign-in with email and password or Google. It processes your user ID, email address, display name and authentication information. Firestore stores your profile (gender, age, height and weight from onboarding), your settings (units, rest time, theme, reminders, weekly goal, deload weeks and measurement schedule), your exercise library and workout lists, every set you log (exercise, reps, weight or plates, side, set type, tempo, notes and time), finished workouts, personal records and body measurements. We use this data only to run the app: show your history, progress charts, suggestions, records and insights, and sync them across your devices."
      ],
      [
        "Health and fitness information",
        "Body weight, body measurements and workout history are health and fitness information. We use them only to provide the app's features to you. We do not sell them, use them for advertising or share them with advertisers. Insights and suggestions in the app are general fitness information, not medical advice."
      ],
      [
        "Permissions and information on your device",
        "Notifications show the rest timer, workout reminders and app announcements. Vibration and a short wake lock keep the rest-timer alert on time while the screen is off. Camera and photo access are optional and only used to pick a profile picture, which stays on your device and is not uploaded. Network status is used to show when you are offline; sets you log offline are kept on the device and synced when you are back online. When you share a workout summary, the image goes only to the app you choose."
      ],
      [
        "Analytics, advertising and other providers",
        "The app includes Firebase Analytics, and Google AdMob serves only the rewarded ads you choose to watch on the Pro page. Depending on device settings, permissions and applicable consent, these services may process app interactions, device and app information, IP addresses and advertising or app-instance identifiers for analytics, ad delivery, measurement and abuse prevention. Firebase Remote Config and Google Play are used to check for app updates, and Firebase Cloud Messaging delivers notifications. Google/Firebase, Google sign-in and the hosting/email providers used for support process information needed for their services."
      ],
      [
        "DotShredzilla Pro, purchases and rewarded ads",
        "Pro for life and tips are bought through Google Play Billing. Google Play handles the payment; we never receive your card or payment details, only the purchase status needed to unlock Pro or thank you for a tip. Pro for life is linked to your Google Play account. Rewarded ads are optional and only play when you start one on the Pro page. When you finish one, Google AdMob sends our server (a Firebase Cloud Function) your DotShredzilla user ID and a transaction ID, signed by Google. The server then saves your Pro time on your account: when it ends, when your recent rewarded ads were watched (for the 24-hour limit) and recent transaction IDs (so each ad counts once). Your account also stores how many tips you sent, for the Supporter badge, and your chosen accent theme. We use this data only to provide Pro, and it is deleted with your account."
      ],
      [
        "Retention and control",
        "We keep your account and training data while you use the account, until you delete individual entries or your account. In the app you can edit or delete sets, finished workouts, personal records and body measurements at any time. Deleting your account in the app (Settings, then Account, then Delete account) removes your account and all associated data right away. You can also request deletion by email at support@dotsuite.dev. Removing the app or signing out does not delete cloud data."
      ]
    ],
    "linksTitle": "Service-provider information"
  },
  "ar": {
    "title": "DotShredzilla: الخصوصية وحذف الحساب",
    "intro": "DotShredzilla تطبيق من DotSuite لتسجيل التمارين على أندرويد. يوضح هذا القسم البيانات التي يحفظها التطبيق وسبب حفظها وطريقة حذف حسابك وكل البيانات المرتبطة به.",
    "updated": "آخر تحديث: ٧ نوفمبر ٢٠٢٦",
    "request": "حذف الحساب والبيانات",
    "policy": "قراءة سياسة DotShredzilla",
    "sections": [
      [
        "بيانات الحساب والتمرين",
        "نستخدم Firebase Authentication لتسجيل الدخول بالبريد الإلكتروني وكلمة المرور أو بحساب Google، وهو يعالج معرّف المستخدم والبريد الإلكتروني والاسم المعروض ومعلومات المصادقة. ويحفظ Firestore ملفك الشخصي (الجنس والعمر والطول والوزن من خطوات البداية)، وإعداداتك (الوحدات ووقت الراحة والمظهر والتذكيرات والهدف الأسبوعي وأسابيع الـ deload وموعد القياسات)، ومكتبة التمارين وقوائم التمرين، وكل مجموعة تسجلها (التمرين والعدات والوزن أو البلاطات والجانب ونوع المجموعة والتمبو والملاحظات والوقت)، والتمارين المكتملة والأرقام القياسية وقياسات الجسم. نستخدم هذه البيانات فقط لتشغيل التطبيق: عرض السجل ورسوم التقدّم والاقتراحات والأرقام القياسية والتحليلات، ومزامنتها بين أجهزتك."
      ],
      [
        "معلومات الصحة واللياقة",
        "وزن الجسم وقياساته وسجل التمارين معلومات صحة ولياقة. نستخدمها فقط لتقديم ميزات التطبيق لك، ولا نبيعها ولا نستخدمها في الإعلانات ولا نشاركها مع المعلنين. التحليلات والاقتراحات داخل التطبيق معلومات عامة عن اللياقة وليست نصيحة طبية."
      ],
      [
        "الأذونات والمعلومات على جهازك",
        "تُستخدم الإشعارات لعرض مؤقت الراحة وتذكيرات التمرين وإعلانات التطبيق. ويُستخدم الاهتزاز وإبقاء المعالج نشطًا لفترة قصيرة حتى يصل تنبيه انتهاء الراحة في موعده والشاشة مغلقة. الوصول إلى الكاميرا والصور اختياري ويُستخدم فقط لاختيار صورة الملف الشخصي، وتبقى الصورة على جهازك ولا تُرفع. وتُستخدم حالة الشبكة لإظهار أنك غير متصل؛ والمجموعات التي تسجلها دون إنترنت تبقى على الجهاز وتُزامن عند عودة الاتصال. وعند مشاركة ملخص تمرين تذهب الصورة فقط إلى التطبيق الذي تختاره."
      ],
      [
        "التحليلات والإعلانات ومزوّدو الخدمات الآخرون",
        "يتضمن التطبيق Firebase Analytics، ولا يعرض Google AdMob إلا الإعلانات بمكافأة التي تختار مشاهدتها من صفحة Pro. وبحسب إعدادات الجهاز والأذونات والموافقة المطبقة، قد تعالج هذه الخدمات تفاعلات التطبيق ومعلومات الجهاز والتطبيق وعناوين IP ومعرّفات الإعلانات أو نسخة التطبيق لأغراض التحليلات وعرض الإعلانات والقياس ومنع إساءة الاستخدام. ويُستخدم Firebase Remote Config وGoogle Play للتحقق من تحديثات التطبيق، ويوصل Firebase Cloud Messaging الإشعارات. ويعالج Google/Firebase وتسجيل الدخول بحساب Google ومزوّدو الاستضافة والبريد المستخدمون في الدعم المعلومات اللازمة لخدماتهم."
      ],
      [
        "DotShredzilla Pro والمشتريات والإعلانات بمكافأة",
        "يُشترى Pro مدى الحياة والتبرعات عبر Google Play Billing. يتولى Google Play عملية الدفع، ولا نستلم أبدًا بيانات بطاقتك أو الدفع، بل فقط حالة الشراء اللازمة لفتح Pro أو لشكرك على التبرع. ويرتبط Pro مدى الحياة بحساب Google Play. الإعلانات بمكافأة اختيارية ولا تعمل إلا إذا بدأتها من صفحة Pro. عند إكمال إعلان، يرسل Google AdMob إلى خادمنا (Firebase Cloud Function) معرّف المستخدم في DotShredzilla ومعرّف العملية بتوقيع من Google. ثم يحفظ الخادم وقت Pro في حسابك: موعد انتهائه، وأوقات الإعلانات بمكافأة الأخيرة (لحد الـ ٢٤ ساعة)، ومعرّفات العمليات الأخيرة (حتى يُحتسب كل إعلان مرة واحدة). ويحفظ حسابك أيضًا عدد التبرعات لإظهار شارة Supporter، واللون المميز الذي اخترته. نستخدم هذه البيانات فقط لتقديم Pro، وتُحذف مع حسابك."
      ],
      [
        "مدة الاحتفاظ والتحكم",
        "نحتفظ بحسابك وبيانات تمرينك طوال استخدامك للحساب، إلى أن تحذف عناصر منفردة أو تحذف الحساب. يمكنك داخل التطبيق تعديل أو حذف المجموعات والتمارين المكتملة والأرقام القياسية وقياسات الجسم في أي وقت. وحذف الحساب من داخل التطبيق (Settings ثم Account ثم Delete account) يزيل حسابك وكل البيانات المرتبطة به فورًا. ويمكنك أيضًا طلب الحذف عبر البريد support@dotsuite.dev. إزالة التطبيق أو تسجيل الخروج لا يحذف البيانات السحابية."
      ]
    ],
    "linksTitle": "معلومات مزوّدي الخدمات"
  },
  "de": {
    "title": "DotShredzilla: Datenschutz und Kontolöschung",
    "intro": "DotShredzilla ist ein Trainingstracker von DotSuite für Android. Dieser Abschnitt erklärt, welche Daten die App speichert, warum, und wie Sie Ihr Konto und alle zugehörigen Daten löschen.",
    "updated": "Zuletzt aktualisiert: 7. November 2026",
    "request": "Konto und Daten löschen",
    "policy": "Datenschutzhinweise zu DotShredzilla lesen",
    "sections": [
      [
        "Konto- und Trainingsdaten",
        "Wir verwenden Firebase Authentication für die Anmeldung mit E-Mail und Passwort oder mit Google. Dabei werden Ihre Nutzer-ID, E-Mail-Adresse, Ihr Anzeigename und Authentifizierungsinformationen verarbeitet. Firestore speichert Ihr Profil (Geschlecht, Alter, Größe und Gewicht aus der Einrichtung), Ihre Einstellungen (Einheiten, Pausenzeit, Design, Erinnerungen, Wochenziel, Deload-Wochen und Messrhythmus), Ihre Übungsbibliothek und Trainingslisten, jeden erfassten Satz (Übung, Wiederholungen, Gewicht oder Platten, Seite, Satzart, Tempo, Notizen und Zeit), abgeschlossene Trainings, persönliche Rekorde und Körpermaße. Wir nutzen diese Daten nur, um die App zu betreiben: Verlauf, Fortschrittsdiagramme, Vorschläge, Rekorde und Auswertungen anzuzeigen und sie zwischen Ihren Geräten zu synchronisieren."
      ],
      [
        "Gesundheits- und Fitnessdaten",
        "Körpergewicht, Körpermaße und Trainingsverlauf sind Gesundheits- und Fitnessdaten. Wir verwenden sie nur, um Ihnen die Funktionen der App bereitzustellen. Wir verkaufen sie nicht, nutzen sie nicht für Werbung und geben sie nicht an Werbetreibende weiter. Auswertungen und Vorschläge in der App sind allgemeine Fitnessinformationen und keine medizinische Beratung."
      ],
      [
        "Berechtigungen und Informationen auf Ihrem Gerät",
        "Benachrichtigungen zeigen den Pausentimer, Trainingserinnerungen und App-Mitteilungen. Vibration und eine kurze Wake-Lock-Sperre sorgen dafür, dass der Hinweis zum Pausenende auch bei ausgeschaltetem Bildschirm pünktlich kommt. Kamera- und Fotozugriff sind optional und dienen nur der Auswahl eines Profilbilds, das auf Ihrem Gerät bleibt und nicht hochgeladen wird. Der Netzwerkstatus zeigt an, wenn Sie offline sind; offline erfasste Sätze bleiben auf dem Gerät und werden synchronisiert, sobald Sie wieder online sind. Wenn Sie eine Trainingszusammenfassung teilen, geht das Bild nur an die App, die Sie auswählen."
      ],
      [
        "Analyse, Werbung und weitere Anbieter",
        "Die App enthält Firebase Analytics; Google AdMob liefert nur die Werbung mit Belohnung aus, die Sie auf der Pro-Seite selbst starten. Abhängig von Geräteeinstellungen, Berechtigungen und einer anwendbaren Einwilligung können diese Dienste App-Interaktionen, Geräte- und App-Informationen, IP-Adressen sowie Werbe- oder App-Instanz-IDs für Analyse, Anzeigenauslieferung, Messung und Missbrauchsverhinderung verarbeiten. Firebase Remote Config und Google Play werden zur Prüfung auf App-Updates verwendet, Firebase Cloud Messaging stellt Benachrichtigungen zu. Google/Firebase, die Google-Anmeldung sowie die für den Support genutzten Hosting- und E-Mail-Anbieter verarbeiten die für ihre Dienste nötigen Informationen."
      ],
      [
        "DotShredzilla Pro, Käufe und Werbung mit Belohnung",
        "Pro auf Lebenszeit und Trinkgelder werden über Google Play Billing gekauft. Google Play wickelt die Zahlung ab; wir erhalten nie Ihre Karten- oder Zahlungsdaten, sondern nur den Kaufstatus, der nötig ist, um Pro freizuschalten oder uns für ein Trinkgeld zu bedanken. Pro auf Lebenszeit ist mit Ihrem Google-Play-Konto verknüpft. Werbung mit Belohnung ist freiwillig und läuft nur, wenn Sie sie auf der Pro-Seite starten. Wenn Sie eine Werbung zu Ende sehen, sendet Google AdMob unserem Server (einer Firebase Cloud Function) Ihre DotShredzilla-Nutzer-ID und eine Transaktions-ID, von Google signiert. Der Server speichert dann Ihre Pro-Zeit in Ihrem Konto: wann sie endet, wann Ihre letzten Werbungen angesehen wurden (für die 24-Stunden-Grenze) und die letzten Transaktions-IDs (damit jede Werbung nur einmal zählt). Ihr Konto speichert außerdem, wie viele Trinkgelder Sie gegeben haben (für das Supporter-Abzeichen), und Ihre gewählte Akzentfarbe. Wir nutzen diese Daten nur, um Pro bereitzustellen; sie werden mit Ihrem Konto gelöscht."
      ],
      [
        "Speicherdauer und Kontrolle",
        "Wir speichern Ihr Konto und Ihre Trainingsdaten, solange Sie das Konto nutzen, bis Sie einzelne Einträge oder Ihr Konto löschen. In der App können Sie Sätze, abgeschlossene Trainings, persönliche Rekorde und Körpermaße jederzeit bearbeiten oder löschen. Das Löschen des Kontos in der App (Settings, dann Account, dann Delete account) entfernt Ihr Konto und alle zugehörigen Daten sofort. Sie können die Löschung auch per E-Mail an support@dotsuite.dev beantragen. Das Entfernen der App oder das Abmelden löscht keine Cloud-Daten."
      ]
    ],
    "linksTitle": "Informationen der Dienstleister"
  },
  "fr": {
    "title": "DotShredzilla : confidentialité et suppression du compte",
    "intro": "DotShredzilla est une application de suivi d'entraînement de DotSuite pour Android. Cette section explique quelles données l'application conserve, pourquoi, et comment supprimer votre compte et toutes les données associées.",
    "updated": "Dernière mise à jour : 7 novembre 2026",
    "request": "Supprimer le compte et les données",
    "policy": "Lire la politique de DotShredzilla",
    "sections": [
      [
        "Données de compte et d'entraînement",
        "Nous utilisons Firebase Authentication pour la connexion par e-mail et mot de passe ou avec Google. Ce service traite votre identifiant utilisateur, votre adresse e-mail, votre nom affiché et vos informations d'authentification. Firestore conserve votre profil (genre, âge, taille et poids saisis lors de la configuration), vos réglages (unités, temps de repos, thème, rappels, objectif hebdomadaire, semaines de décharge et rythme des mesures), votre bibliothèque d'exercices et vos listes d'entraînement, chaque série enregistrée (exercice, répétitions, poids ou plaques, côté, type de série, tempo, notes et heure), les séances terminées, vos records personnels et vos mensurations. Nous utilisons ces données uniquement pour faire fonctionner l'application : afficher l'historique, les graphiques de progression, les suggestions, les records et les analyses, et les synchroniser entre vos appareils."
      ],
      [
        "Informations de santé et de forme physique",
        "Le poids, les mensurations et l'historique d'entraînement sont des informations de santé et de forme physique. Nous les utilisons uniquement pour vous fournir les fonctionnalités de l'application. Nous ne les vendons pas, ne les utilisons pas pour la publicité et ne les partageons pas avec des annonceurs. Les analyses et suggestions de l'application sont des informations générales sur la forme physique, pas des conseils médicaux."
      ],
      [
        "Autorisations et informations sur votre appareil",
        "Les notifications affichent le minuteur de repos, les rappels d'entraînement et les annonces de l'application. Les vibrations et un bref maintien en éveil permettent à l'alerte de fin de repos d'arriver à l'heure, même écran éteint. L'accès à l'appareil photo et aux photos est facultatif et sert uniquement à choisir une photo de profil, qui reste sur votre appareil et n'est pas envoyée. L'état du réseau sert à indiquer que vous êtes hors ligne ; les séries enregistrées hors ligne restent sur l'appareil et sont synchronisées au retour de la connexion. Lorsque vous partagez un résumé de séance, l'image est envoyée uniquement à l'application que vous choisissez."
      ],
      [
        "Statistiques, publicité et autres prestataires",
        "L'application inclut Firebase Analytics, et Google AdMob ne diffuse que les publicités avec récompense que vous choisissez de regarder sur la page Pro. Selon les paramètres de l'appareil, les autorisations et le consentement applicable, ces services peuvent traiter les interactions avec l'application, des informations sur l'appareil et l'application, les adresses IP et les identifiants publicitaires ou d'instance d'application à des fins de statistiques, de diffusion publicitaire, de mesure et de prévention des abus. Firebase Remote Config et Google Play servent à vérifier les mises à jour, et Firebase Cloud Messaging envoie les notifications. Google/Firebase, la connexion Google et les prestataires d'hébergement et d'e-mail utilisés pour l'assistance traitent les informations nécessaires à leurs services."
      ],
      [
        "DotShredzilla Pro, achats et publicités avec récompense",
        "Pro à vie et les pourboires sont achetés via Google Play Billing. Google Play gère le paiement ; nous ne recevons jamais vos données de carte ou de paiement, seulement le statut d'achat nécessaire pour débloquer Pro ou vous remercier d'un pourboire. Pro à vie est lié à votre compte Google Play. Les publicités avec récompense sont facultatives et ne se lancent que si vous en démarrez une sur la page Pro. Quand vous en terminez une, Google AdMob envoie à notre serveur (une Firebase Cloud Function) votre identifiant utilisateur DotShredzilla et un identifiant de transaction, signés par Google. Le serveur enregistre alors votre temps Pro dans votre compte : sa date de fin, les heures de vos dernières publicités avec récompense (pour la limite sur 24 heures) et les derniers identifiants de transaction (pour que chaque publicité ne compte qu'une fois). Votre compte conserve aussi le nombre de pourboires envoyés, pour le badge Supporter, et la couleur d'accent choisie. Nous utilisons ces données uniquement pour fournir Pro, et elles sont supprimées avec votre compte."
      ],
      [
        "Conservation et contrôle",
        "Nous conservons votre compte et vos données d'entraînement tant que vous utilisez le compte, jusqu'à ce que vous supprimiez des éléments ou votre compte. Dans l'application, vous pouvez modifier ou supprimer à tout moment les séries, séances terminées, records personnels et mensurations. Supprimer votre compte dans l'application (Settings, puis Account, puis Delete account) efface immédiatement votre compte et toutes les données associées. Vous pouvez aussi demander la suppression par e-mail à support@dotsuite.dev. Désinstaller l'application ou vous déconnecter ne supprime pas les données en ligne."
      ]
    ],
    "linksTitle": "Informations des prestataires"
  },
  "ru": {
    "title": "DotShredzilla: конфиденциальность и удаление аккаунта",
    "intro": "DotShredzilla — трекер тренировок от DotSuite для Android. В этом разделе объясняется, какие данные хранит приложение, зачем, и как удалить аккаунт и все связанные с ним данные.",
    "updated": "Последнее обновление: 7 ноября 2026 г.",
    "request": "Удалить аккаунт и данные",
    "policy": "Прочитать политику DotShredzilla",
    "sections": [
      [
        "Данные аккаунта и тренировок",
        "Мы используем Firebase Authentication для входа по электронной почте и паролю или через Google. Сервис обрабатывает ваш идентификатор пользователя, адрес электронной почты, отображаемое имя и данные аутентификации. Firestore хранит ваш профиль (пол, возраст, рост и вес, указанные при настройке), настройки (единицы, время отдыха, тема, напоминания, недельная цель, разгрузочные недели и график замеров), библиотеку упражнений и списки тренировок, каждый записанный подход (упражнение, повторения, вес или количество плиток, сторона, тип подхода, темп, заметки и время), завершённые тренировки, личные рекорды и замеры тела. Мы используем эти данные только для работы приложения: чтобы показывать историю, графики прогресса, подсказки, рекорды и выводы и синхронизировать их между вашими устройствами."
      ],
      [
        "Информация о здоровье и физической форме",
        "Вес тела, замеры и история тренировок относятся к информации о здоровье и физической форме. Мы используем их только для работы функций приложения. Мы не продаём их, не используем для рекламы и не передаём рекламодателям. Выводы и подсказки в приложении — это общая информация о фитнесе, а не медицинская консультация."
      ],
      [
        "Разрешения и данные на устройстве",
        "Уведомления показывают таймер отдыха, напоминания о тренировках и объявления приложения. Вибрация и кратковременная блокировка сна нужны, чтобы сигнал окончания отдыха приходил вовремя при выключенном экране. Доступ к камере и фото необязателен и используется только для выбора фото профиля, которое остаётся на устройстве и не загружается. Состояние сети используется, чтобы показать, что вы офлайн; подходы, записанные без интернета, хранятся на устройстве и синхронизируются при восстановлении связи. Когда вы делитесь итогом тренировки, изображение отправляется только в выбранное вами приложение."
      ],
      [
        "Аналитика, реклама и другие поставщики",
        "Приложение использует Firebase Analytics, а Google AdMob показывает только ролики с вознаграждением, которые вы сами запускаете на странице Pro. В зависимости от настроек устройства, разрешений и применимого согласия эти сервисы могут обрабатывать взаимодействия с приложением, сведения об устройстве и приложении, IP-адреса и рекламные идентификаторы или идентификаторы экземпляра приложения для аналитики, показа рекламы, измерений и предотвращения злоупотреблений. Firebase Remote Config и Google Play используются для проверки обновлений, а Firebase Cloud Messaging доставляет уведомления. Google/Firebase, вход через Google и поставщики хостинга и почты, используемые для поддержки, обрабатывают сведения, необходимые для их услуг."
      ],
      [
        "DotShredzilla Pro, покупки и реклама с вознаграждением",
        "Pro навсегда и чаевые покупаются через Google Play Billing. Оплату обрабатывает Google Play; мы никогда не получаем данные вашей карты или платежа — только статус покупки, нужный, чтобы открыть Pro или поблагодарить за чаевые. Pro навсегда привязан к вашему аккаунту Google Play. Реклама с вознаграждением необязательна и запускается, только если вы сами начнёте ролик на странице Pro. Когда вы досмотрите ролик, Google AdMob отправляет нашему серверу (Firebase Cloud Function) ваш идентификатор пользователя DotShredzilla и идентификатор транзакции, подписанные Google. Затем сервер сохраняет в вашем аккаунте время Pro: когда оно закончится, когда были просмотрены последние ролики (для ограничения за 24 часа) и последние идентификаторы транзакций (чтобы каждый ролик засчитывался один раз). В аккаунте также хранится число отправленных чаевых — для значка Supporter — и выбранный акцентный цвет. Мы используем эти данные только для работы Pro, и они удаляются вместе с аккаунтом."
      ],
      [
        "Хранение и управление",
        "Мы храним ваш аккаунт и данные тренировок, пока вы пользуетесь аккаунтом, — до удаления отдельных записей или аккаунта. В приложении можно в любой момент изменить или удалить подходы, завершённые тренировки, личные рекорды и замеры тела. Удаление аккаунта в приложении (Settings, затем Account, затем Delete account) сразу удаляет аккаунт и все связанные с ним данные. Также можно запросить удаление по адресу support@dotsuite.dev. Удаление приложения или выход из аккаунта не удаляют данные в облаке."
      ]
    ],
    "linksTitle": "Информация поставщиков услуг"
  }
} satisfies Record<PrivacyLanguage, PrivacyPolicyCopy>;

export const dotShredzillaDeletionCopy = {
  "en": {
    "title": "Delete your DotShredzilla account & associated data",
    "intro": "You can delete your account and data at any time, including after uninstalling the app. A DotSuite account is not required.",
    "inApp": "Fastest way: in the app, open Settings, then Account, then Delete account. Your account and all the data listed below are deleted right away. You may be asked to sign in again first.",
    "scope": "What is deleted",
    "items": [
      "Your DotShredzilla sign-in account (email or Google sign-in).",
      "Your profile and settings, including gender, age, height, weight, units, goals and reminders.",
      "Your exercise library, workout lists and programs.",
      "Every logged set, finished workout and personal record.",
      "Your body measurements and body-weight entries.",
      "Your Pro time from rewarded ads, Supporter badge and accent theme (Pro for life stays with your Google Play account)."
    ],
    "timing": "For requests by email, we verify that you own the account before deleting it. After verification, we complete the request within 30 days and email you when it is finished. If more information is needed to identify your account, we will explain what is needed. Never send a password or verification code in your request.",
    "warning": "Completed deletion is permanent and your training history cannot be recovered. Deleting your DotShredzilla account does not delete your Google account or a separate DotSuite account.",
    "copies": "Local copies and provider data",
    "retention": "Deletion removes the account-linked records listed above from our active systems. Your profile picture, offline data waiting to sync and app preferences stay on your device until you clear DotShredzilla's app storage or uninstall it. Workout summaries you shared are under the control of the people and apps you sent them to. Provider security/operational logs can be subject to the provider policies linked below; they are not covered by a promise that every provider copy disappears within 30 days. Anonymous aggregate statistics that no longer identify you cannot be linked back to an account. If a legal obligation requires an exception, we explain the affected information, reason and applicable retention period in our response.",
    "email": "Account email address",
    "uid": "Account ID (optional)",
    "hint": "Use the email you sign in to DotShredzilla with. If you cannot access that inbox, email support and describe the issue; do not send credentials.",
    "submit": "Prepare deletion request email",
    "fallback": "Or email us directly",
    "draft": "Your email app will open a draft. Review it and press Send there. Opening this draft does not submit a request or delete your account.",
    "preview": "Request text — you can copy this into any email app",
    "subject": "DotShredzilla — account and associated data deletion request",
    "body": "Please delete my DotShredzilla account and all associated data: profile and settings, exercise library and workout lists, logged sets, workouts, personal records and body measurements.\nAccount email: ",
    "id": "\nAccount ID: ",
    "ending": "\nPlease explain the account-ownership verification steps and confirm completion by email. I understand completed deletion is permanent."
  },
  "ar": {
    "title": "حذف حساب DotShredzilla والبيانات المرتبطة به",
    "intro": "يمكنك حذف حسابك وبياناتك في أي وقت، حتى بعد إزالة التطبيق. لا يلزم وجود حساب DotSuite.",
    "inApp": "أسرع طريقة: داخل التطبيق افتح Settings ثم Account ثم Delete account. يُحذف حسابك وكل البيانات المذكورة أدناه فورًا، وقد يُطلب منك تسجيل الدخول مرة أخرى أولًا.",
    "scope": "ما الذي يُحذف",
    "items": [
      "حساب تسجيل الدخول إلى DotShredzilla (البريد الإلكتروني أو حساب Google).",
      "ملفك الشخصي وإعداداتك، بما في ذلك الجنس والعمر والطول والوزن والوحدات والأهداف والتذكيرات.",
      "مكتبة التمارين وقوائم التمرين والبرامج.",
      "كل مجموعة مسجلة وكل تمرين مكتمل وكل رقم قياسي.",
      "قياسات الجسم وسجلات وزن الجسم.",
      "وقت Pro المكتسب من الإعلانات بمكافأة وشارة Supporter واللون المميز (أما Pro مدى الحياة فيبقى مع حساب Google Play)."
    ],
    "timing": "في الطلبات عبر البريد نتحقق أولًا من ملكيتك للحساب قبل حذفه. وبعد التحقق ننفّذ الطلب خلال ٣٠ يومًا ونراسلك عند اكتماله. وإذا احتجنا معلومات إضافية لتحديد حسابك سنوضح ما نحتاجه. لا ترسل أبدًا كلمة مرور أو رمز تحقق في طلبك.",
    "warning": "الحذف المكتمل نهائي ولا يمكن استرجاع سجل تمارينك. حذف حساب DotShredzilla لا يحذف حساب Google أو حساب DotSuite المنفصل.",
    "copies": "النسخ المحلية وبيانات مزوّدي الخدمات",
    "retention": "يزيل الحذف السجلات المرتبطة بالحساب والمذكورة أعلاه من أنظمتنا النشطة. تبقى صورة ملفك الشخصي والبيانات غير المتصلة التي تنتظر المزامنة وتفضيلات التطبيق على جهازك إلى أن تمسح بيانات تطبيق DotShredzilla أو تزيله. وملخصات التمارين التي شاركتها تخضع لتحكم الأشخاص والتطبيقات التي أرسلتها إليهم. وقد تخضع سجلات الأمان والتشغيل لدى مزوّدي الخدمات لسياساتهم المرتبطة أدناه، ولا يشملها وعد باختفاء كل نسخة لدى المزوّد خلال ٣٠ يومًا. ولا يمكن ربط الإحصاءات المجمعة المجهولة التي لا تحدد هويتك بأي حساب. وإذا فرض التزام قانوني استثناءً، سنوضح في ردنا المعلومات المتأثرة والسبب ومدة الاحتفاظ المطبقة.",
    "email": "البريد الإلكتروني للحساب",
    "uid": "معرّف الحساب (اختياري)",
    "hint": "استخدم البريد الذي تسجل به الدخول إلى DotShredzilla. إذا لم تستطع الوصول إليه فراسل الدعم واشرح المشكلة، ولا ترسل بيانات الدخول.",
    "submit": "تجهيز رسالة طلب الحذف",
    "fallback": "أو راسلنا مباشرة",
    "draft": "سيفتح تطبيق البريد مسودة. راجعها ثم اضغط إرسال هناك. فتح المسودة لا يرسل الطلب ولا يحذف حسابك.",
    "preview": "نص الطلب — يمكنك نسخه إلى أي تطبيق بريد",
    "subject": "DotShredzilla — طلب حذف الحساب والبيانات المرتبطة به",
    "body": "يرجى حذف حسابي في DotShredzilla وكل البيانات المرتبطة به: الملف الشخصي والإعدادات ومكتبة التمارين وقوائم التمرين والمجموعات المسجلة والتمارين والأرقام القياسية وقياسات الجسم.\nالبريد الإلكتروني للحساب: ",
    "id": "\nمعرّف الحساب: ",
    "ending": "\nيرجى توضيح خطوات التحقق من ملكية الحساب وتأكيد اكتمال الحذف عبر البريد. أدرك أن الحذف المكتمل نهائي."
  },
  "de": {
    "title": "DotShredzilla-Konto und zugehörige Daten löschen",
    "intro": "Sie können Ihr Konto und Ihre Daten jederzeit löschen, auch nach der Deinstallation der App. Ein DotSuite-Konto ist nicht erforderlich.",
    "inApp": "Am schnellsten: Öffnen Sie in der App Settings, dann Account, dann Delete account. Ihr Konto und alle unten aufgeführten Daten werden sofort gelöscht. Eventuell müssen Sie sich vorher erneut anmelden.",
    "scope": "Was gelöscht wird",
    "items": [
      "Ihr DotShredzilla-Anmeldekonto (E-Mail oder Google-Anmeldung).",
      "Ihr Profil und Ihre Einstellungen, einschließlich Geschlecht, Alter, Größe, Gewicht, Einheiten, Ziele und Erinnerungen.",
      "Ihre Übungsbibliothek, Trainingslisten und Programme.",
      "Jeder erfasste Satz, jedes abgeschlossene Training und jeder persönliche Rekord.",
      "Ihre Körpermaße und Einträge zum Körpergewicht.",
      "Ihre Pro-Zeit aus Werbung mit Belohnung, das Supporter-Abzeichen und die Akzentfarbe (Pro auf Lebenszeit bleibt bei Ihrem Google-Play-Konto)."
    ],
    "timing": "Bei Anfragen per E-Mail prüfen wir vor der Löschung, dass Ihnen das Konto gehört. Nach der Prüfung erledigen wir die Anfrage innerhalb von 30 Tagen und benachrichtigen Sie per E-Mail. Falls wir weitere Angaben zur Identifizierung Ihres Kontos brauchen, erklären wir, was nötig ist. Senden Sie niemals ein Passwort oder einen Bestätigungscode.",
    "warning": "Eine abgeschlossene Löschung ist endgültig, Ihr Trainingsverlauf kann nicht wiederhergestellt werden. Das Löschen Ihres DotShredzilla-Kontos löscht weder Ihr Google-Konto noch ein separates DotSuite-Konto.",
    "copies": "Lokale Kopien und Daten bei Anbietern",
    "retention": "Die Löschung entfernt die oben aufgeführten kontobezogenen Datensätze aus unseren aktiven Systemen. Ihr Profilbild, offline gespeicherte Daten, die noch synchronisiert werden müssen, und App-Einstellungen bleiben auf Ihrem Gerät, bis Sie den App-Speicher von DotShredzilla löschen oder die App deinstallieren. Geteilte Trainingszusammenfassungen liegen bei den Personen und Apps, an die Sie sie gesendet haben. Sicherheits- und Betriebsprotokolle der Anbieter können den unten verlinkten Richtlinien unterliegen; für sie gilt kein Versprechen, dass jede Kopie beim Anbieter innerhalb von 30 Tagen verschwindet. Anonyme aggregierte Statistiken, die Sie nicht mehr identifizieren, lassen sich keinem Konto zuordnen. Falls eine gesetzliche Pflicht eine Ausnahme erfordert, nennen wir in unserer Antwort die betroffenen Informationen, den Grund und die geltende Speicherdauer.",
    "email": "E-Mail-Adresse des Kontos",
    "uid": "Konto-ID (optional)",
    "hint": "Verwenden Sie die E-Mail, mit der Sie sich bei DotShredzilla anmelden. Wenn Sie keinen Zugriff darauf haben, schreiben Sie dem Support und beschreiben Sie das Problem; senden Sie keine Zugangsdaten.",
    "submit": "E-Mail zur Löschanfrage vorbereiten",
    "fallback": "Oder schreiben Sie uns direkt",
    "draft": "Ihre E-Mail-App öffnet einen Entwurf. Prüfen Sie ihn und tippen Sie dort auf Senden. Das Öffnen des Entwurfs sendet keine Anfrage und löscht Ihr Konto nicht.",
    "preview": "Text der Anfrage — Sie können ihn in jede E-Mail-App kopieren",
    "subject": "DotShredzilla — Anfrage zur Löschung von Konto und zugehörigen Daten",
    "body": "Bitte löschen Sie mein DotShredzilla-Konto und alle zugehörigen Daten: Profil und Einstellungen, Übungsbibliothek und Trainingslisten, erfasste Sätze, Trainings, persönliche Rekorde und Körpermaße.\nE-Mail des Kontos: ",
    "id": "\nKonto-ID: ",
    "ending": "\nBitte erklären Sie die Schritte zur Bestätigung der Kontoinhaberschaft und bestätigen Sie den Abschluss per E-Mail. Mir ist bewusst, dass eine abgeschlossene Löschung endgültig ist."
  },
  "fr": {
    "title": "Supprimer votre compte DotShredzilla et les données associées",
    "intro": "Vous pouvez supprimer votre compte et vos données à tout moment, même après avoir désinstallé l'application. Un compte DotSuite n'est pas nécessaire.",
    "inApp": "Le plus rapide : dans l'application, ouvrez Settings, puis Account, puis Delete account. Votre compte et toutes les données listées ci-dessous sont supprimés immédiatement. Il peut vous être demandé de vous reconnecter avant.",
    "scope": "Ce qui est supprimé",
    "items": [
      "Votre compte de connexion DotShredzilla (e-mail ou connexion Google).",
      "Votre profil et vos réglages, y compris le genre, l'âge, la taille, le poids, les unités, les objectifs et les rappels.",
      "Votre bibliothèque d'exercices, vos listes d'entraînement et vos programmes.",
      "Chaque série enregistrée, séance terminée et record personnel.",
      "Vos mensurations et vos relevés de poids.",
      "Votre temps Pro obtenu par publicité, le badge Supporter et la couleur d'accent (Pro à vie reste lié à votre compte Google Play)."
    ],
    "timing": "Pour les demandes par e-mail, nous vérifions que le compte vous appartient avant de le supprimer. Après vérification, nous traitons la demande sous 30 jours et vous prévenons par e-mail. Si d'autres informations sont nécessaires pour identifier votre compte, nous vous indiquerons lesquelles. N'envoyez jamais de mot de passe ni de code de vérification.",
    "warning": "Une suppression terminée est définitive et votre historique d'entraînement ne peut pas être récupéré. Supprimer votre compte DotShredzilla ne supprime ni votre compte Google ni un compte DotSuite distinct.",
    "copies": "Copies locales et données des prestataires",
    "retention": "La suppression retire de nos systèmes actifs les enregistrements liés au compte listés ci-dessus. Votre photo de profil, les données hors ligne en attente de synchronisation et les préférences de l'application restent sur votre appareil jusqu'à ce que vous effaciez le stockage de DotShredzilla ou le désinstalliez. Les résumés de séance que vous avez partagés relèvent des personnes et applications auxquelles vous les avez envoyés. Les journaux de sécurité et d'exploitation des prestataires peuvent relever des politiques liées ci-dessous ; ils ne sont pas couverts par une promesse que chaque copie disparaisse sous 30 jours. Les statistiques agrégées anonymes qui ne vous identifient plus ne peuvent pas être rattachées à un compte. Si une obligation légale impose une exception, nous expliquons dans notre réponse les informations concernées, la raison et la durée de conservation applicable.",
    "email": "Adresse e-mail du compte",
    "uid": "Identifiant du compte (facultatif)",
    "hint": "Utilisez l'e-mail avec lequel vous vous connectez à DotShredzilla. Si vous n'y avez plus accès, écrivez à l'assistance en décrivant le problème ; n'envoyez pas vos identifiants.",
    "submit": "Préparer l'e-mail de demande de suppression",
    "fallback": "Ou écrivez-nous directement",
    "draft": "Votre application de messagerie ouvrira un brouillon. Vérifiez-le puis appuyez sur Envoyer. Ouvrir ce brouillon n'envoie aucune demande et ne supprime pas votre compte.",
    "preview": "Texte de la demande — vous pouvez le copier dans n'importe quelle messagerie",
    "subject": "DotShredzilla — demande de suppression du compte et des données associées",
    "body": "Merci de supprimer mon compte DotShredzilla et toutes les données associées : profil et réglages, bibliothèque d'exercices et listes d'entraînement, séries enregistrées, séances, records personnels et mensurations.\nE-mail du compte : ",
    "id": "\nIdentifiant du compte : ",
    "ending": "\nMerci d'expliquer les étapes de vérification de la propriété du compte et de confirmer la suppression par e-mail. Je comprends qu'une suppression terminée est définitive."
  },
  "ru": {
    "title": "Удаление аккаунта DotShredzilla и связанных данных",
    "intro": "Вы можете удалить аккаунт и данные в любой момент, в том числе после удаления приложения. Аккаунт DotSuite не требуется.",
    "inApp": "Быстрее всего: в приложении откройте Settings, затем Account, затем Delete account. Аккаунт и все перечисленные ниже данные удаляются сразу. Возможно, сначала потребуется войти снова.",
    "scope": "Что удаляется",
    "items": [
      "Ваш аккаунт для входа в DotShredzilla (почта или вход через Google).",
      "Профиль и настройки, включая пол, возраст, рост, вес, единицы, цели и напоминания.",
      "Библиотека упражнений, списки тренировок и программы.",
      "Все записанные подходы, завершённые тренировки и личные рекорды.",
      "Замеры тела и записи веса.",
      "Время Pro, полученное за рекламу, значок Supporter и акцентный цвет (Pro навсегда остаётся привязанным к аккаунту Google Play)."
    ],
    "timing": "При запросе по почте мы сначала проверяем, что аккаунт принадлежит вам. После проверки выполняем запрос в течение 30 дней и сообщаем об этом по почте. Если для поиска аккаунта понадобятся дополнительные сведения, мы объясним, какие именно. Никогда не отправляйте пароль или код подтверждения.",
    "warning": "Завершённое удаление необратимо, историю тренировок восстановить нельзя. Удаление аккаунта DotShredzilla не удаляет ваш аккаунт Google или отдельный аккаунт DotSuite.",
    "copies": "Локальные копии и данные поставщиков",
    "retention": "Удаление убирает перечисленные выше записи, связанные с аккаунтом, из наших рабочих систем. Фото профиля, офлайн-данные, ожидающие синхронизации, и настройки приложения остаются на устройстве, пока вы не очистите хранилище DotShredzilla или не удалите приложение. Итоги тренировок, которыми вы поделились, остаются у людей и в приложениях, куда вы их отправили. Журналы безопасности и работы поставщиков могут регулироваться их политиками по ссылкам ниже; на них не распространяется обещание, что каждая копия у поставщика исчезнет в течение 30 дней. Анонимную сводную статистику, которая больше не идентифицирует вас, нельзя связать с аккаунтом. Если правовая обязанность требует исключения, мы укажем в ответе затронутые сведения, причину и применимый срок хранения.",
    "email": "Электронная почта аккаунта",
    "uid": "Идентификатор аккаунта (необязательно)",
    "hint": "Укажите почту, с которой вы входите в DotShredzilla. Если доступа к ней нет, напишите в поддержку и опишите проблему; не отправляйте учётные данные.",
    "submit": "Подготовить письмо с запросом на удаление",
    "fallback": "Или напишите нам напрямую",
    "draft": "Почтовое приложение откроет черновик. Проверьте его и нажмите «Отправить». Открытие черновика не отправляет запрос и не удаляет аккаунт.",
    "preview": "Текст запроса — его можно скопировать в любое почтовое приложение",
    "subject": "DotShredzilla — запрос на удаление аккаунта и связанных данных",
    "body": "Прошу удалить мой аккаунт DotShredzilla и все связанные данные: профиль и настройки, библиотеку упражнений и списки тренировок, записанные подходы, тренировки, личные рекорды и замеры тела.\nПочта аккаунта: ",
    "id": "\nИдентификатор аккаунта: ",
    "ending": "\nПожалуйста, объясните порядок проверки владельца аккаунта и подтвердите удаление по электронной почте. Я понимаю, что завершённое удаление необратимо."
  }
} satisfies Record<PrivacyLanguage, DeletionRequestCopy>;
