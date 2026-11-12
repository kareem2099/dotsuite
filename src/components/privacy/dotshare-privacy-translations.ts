import type { DotSharePrivacyCopy } from "./dotshare-privacy-copy";

/**
 * German, French and Russian versions of the DotShare privacy policy.
 * Keep them in step with the English text in dotshare-privacy-copy.ts.
 * Interface labels (buttons, commands, menu paths) stay as DotShare and the
 * platforms show them, so readers can find them.
 */

export const de: DotSharePrivacyCopy = {
  eyebrow: "DotSuite · DotShare",
  title: "DotShare-Datenschutzrichtlinie",
  description: "Was die DotShare-Erweiterung für VS Code, der MCP-Server von dotshare-cli und die DotShare-Anmeldung über dotsuite.dev speichern, wohin Daten gehen und wie du sie löschst.",
  updated: "Zuletzt aktualisiert: 12. November 2026 (DotShare 3.7.0, dotshare-cli 3.1.0)",
  intro: [
    "DotShare ist ein Open-Source-Werkzeug für Entwickler von DotSuite. Es macht aus deinen Commits, Release Notes und deinem Code Beiträge und veröffentlicht sie in den sozialen Konten, die du verbindest. Diese Richtlinie gilt für die DotShare-Erweiterung für VS Code, das Paket `dotshare-cli` (die Kommandozeile und den lokalen MCP-Server für KI-Agenten), die DotShare-Anmeldung über dotsuite.dev und die Cloud-Planung von DotSuite, wenn du sie mit DotShare nutzt.",
    "DotShare arbeitet lokal. Zugangsdaten, Entwürfe und Verlauf bleiben auf deinem Gerät, und Beiträge gehen direkt von deinem Gerät an die jeweilige Plattform, außer du planst sie in der DotSuite-Cloud. Dein DotSuite-Konto, die Abrechnung und die Website dotsuite.dev selbst fallen unter die allgemeine Datenschutzrichtlinie von DotSuite.",
  ],
  glanceTitle: "Auf einen Blick",
  glance: {
    head: ["Daten", "Wo sie gespeichert sind", "Wer sie erhält"],
    rows: [
      ["Zugangsdaten der Plattformen (Tokens, App-Passwörter, Bot-Tokens, Webhooks, API-Schlüssel)", "Auf deinem Gerät: VS Code SecretStorage (Erweiterung) oder der Schlüsselbund deines Betriebssystems (CLI)", "Nur die Plattform, zu der sie gehören, wenn du veröffentlichst oder das Konto prüfst. DotSuite erhält nur dann eine Kopie, wenn du in der Cloud planst und vorher zustimmst."],
      ["API-Schlüssel für KI-Anbieter", "VS Code SecretStorage auf deinem Gerät", "Nur der KI-Anbieter, den du auswählst"],
      ["Entwürfe, Beitragsverlauf und Belege", "Auf deinem Gerät. Daten von CLI und MCP sind verschlüsselt (AES-256-GCM).", "Niemand, bis du veröffentlichst"],
      ["Repository-Kontext für KI-Entwürfe", "Wird von DotShare nicht gespeichert", "Der KI-Anbieter deiner Wahl, mit deinem eigenen Schlüssel, wenn du einen Entwurf anforderst"],
      ["Anmelde-Tokens von LinkedIn und X", "Werden an deinen Editor oder die CLI weitergegeben. dotsuite.dev speichert sie nur, wenn du ein Konto für die Cloud-Planung verbindest.", "Dein Editor oder die CLI, und DotSuite für die Cloud-Planung"],
      ["X-Beiträge über die X-App von DotShare", "DotSuite: das X-Token (verschlüsselt) und ein Eintrag zu den Kosten jedes Beitrags, ohne Beitragstext", "X, veröffentlicht von DotSuite und mit dem X-Budget deines Plans verrechnet"],
      ["Geplante Beiträge und ihre Bilder", "DotSuite-Server (nur wenn du in der Cloud planst)", "Der Planer von DotSuite, der sie auf den gewählten Plattformen veröffentlicht"],
    ],
  },
  promisesTitle: "Was wir nie tun",
  promises: [
    "Deine Daten verkaufen, vermieten oder für Werbung weitergeben. DotShare zeigt keine Werbung und enthält keine Werbe-Tracker.",
    "Telemetrie oder Analysedaten aus der Erweiterung, der CLI oder dem MCP-Server erfassen. Der Code von DotShare sendet keine.",
    "Etwas aus deinem Repository irgendwohin senden, außer dem, was du in einen KI-Entwurf (an deinen KI-Anbieter) oder einen Gist (an GitHub) übernimmst.",
    "Von selbst posten. Jeder Beitrag wird veröffentlicht, weil du oder ein KI-Agent nach deinen Anweisungen DotShare darum gebeten hat, ihn zu veröffentlichen oder zu planen. Der Skill und die Werkzeughinweise, die mit DotShare ausgeliefert werden, weisen Agenten an, dir eine Vorschau zu zeigen und auf deine Freigabe zu warten.",
    "Inhalte oder Daten von LinkedIn, X oder einer anderen Plattform nutzen, um ein Profil über dich zu erstellen, oder für irgendeinen anderen Zweck als das Veröffentlichen deiner Beiträge und das Anzeigen ihrer Ergebnisse.",
    "KI-Modelle mit deinen Inhalten trainieren. Wenn du einen KI-Anbieter nutzt, bestimmen dessen eigene Bedingungen, was mit deinen Eingaben geschieht.",
  ],
  tocTitle: "Inhalt",
  sections: [
    {
      id: "on-your-device",
      title: "1. Was auf deinem Gerät bleibt",
      blocks: [
        { p: "**VS-Code-Erweiterung.** Zugangsdaten liegen in VS Code SecretStorage, das den Anmeldedatenspeicher deines Betriebssystems verwendet. Dazu gehören die Tokens für LinkedIn und X (einschließlich Refresh-Token und Ablaufzeit von X), das Bot-Token und die Chat-ID für Telegram, die Discord-Webhook-URL, Handle und App-Passwort für Bluesky, Instanz und Zugriffstoken für Mastodon, der API-Schlüssel für Dev.to, die API-Schlüssel deiner KI-Anbieter und dein DotSuite-Schlüssel. Im Erweiterungsspeicher von VS Code auf deinem Gerät liegen deine Einstellungen und dein Verlauf: letzte Beiträge, der zuletzt veröffentlichte Beitrag, Entwürfe für GitHub Gists, das gewählte KI-Modell und die Sprache, deine Call-to-Action-Links und deine Zustimmungen." },
        { p: "**CLI und MCP-Server (`dotshare-cli`).** Alles liegt in `~/.dotshare` oder in dem Ordner, der in `DOTSHARE_HOME` gesetzt ist, mit privaten Dateiberechtigungen. `accounts.json` enthält nur ID, Namen und Plattform jedes Kontos. Zugangsdaten liegen im Schlüsselbund deines Betriebssystems. Entwürfe, eigene Vorlagen und das Veröffentlichungsprotokoll sind mit AES-256-GCM verschlüsselt, mit einem Hauptschlüssel im Schlüsselbund deines Betriebssystems. Das Protokoll speichert Fingerabdrücke von Anfragen, den Status und Belege (Beitrags-IDs und Links), aber keine Zugangsdaten und keinen vollständigen Beitragstext. Der MCP-Server liest Bilder nur aus den Ordnern, die du bei der Einrichtung freigibst (`DOTSHARE_MEDIA_ROOTS`)." },
        { p: "Weder die Erweiterung noch die CLI speichern deine Zugangsdaten im Klartext. Bekannte Geheimnisse werden aus Fehlermeldungen entfernt, bevor sie angezeigt oder protokolliert werden." },
      ],
    },
    {
      id: "platforms",
      title: "2. Veröffentlichen auf sozialen Plattformen",
      blocks: [
        { p: "Wenn du veröffentlichst, eine Vorschau erstellst oder ein Konto prüfst, sendet DotShare den Beitragstext, Bilder oder Videos und die passenden Zugangsdaten direkt von deinem Gerät an die API der Plattform. DotSuite-Server sind dabei nicht beteiligt. Für das, was du veröffentlichst, gilt danach die Datenschutzrichtlinie der jeweiligen Plattform." },
        { table: {
          head: ["Plattform", "Von deinem Gerät gesendet an"],
          rows: [
            ["LinkedIn", "`api.linkedin.com` (Beiträge, Medien-Uploads, erste Kommentare, dein Basisprofil, um in deinem Namen zu posten)"],
            ["X", "`api.x.com` (Beiträge, Medien-Uploads, dein Benutzername für Kontoprüfungen)"],
            ["Bluesky", "`bsky.social` (Anmeldung mit deinem App-Passwort, Beiträge, Bilder, Handle-Abfragen für @Erwähnungen)"],
            ["Mastodon", "Deine eigene Instanz (Beiträge, Medien, die Zeichen- und Medienlimits der Instanz)"],
            ["Telegram", "`api.telegram.org` mit deinem Bot-Token"],
            ["Discord", "Deine Webhook-URL auf `discord.com`"],
            ["Dev.to", "`dev.to` mit deinem API-Schlüssel"],
          ],
        } },
        { p: "**Beitragsstatistiken.** Wenn du oder ein Agent, den du nutzt, Statistiken zu einem Beitrag abruft, liest DotShare die öffentlichen Interaktionszahlen (Likes, Reposts, Antworten, Zitate, Impressionen oder Aufrufe) der Beiträge, die es veröffentlicht hat, von denselben Plattformen. Für Bluesky nutzt es die öffentliche API von Bluesky ohne Anmeldung. Gespeichert wird nur, was dir angezeigt wird." },
      ],
    },
    {
      id: "ai",
      title: "3. Entwürfe mit KI (optional)",
      blocks: [
        { p: "Wenn du DotShare um einen Entwurf bittest, sendet es eine Anfrage direkt von deinem Gerät an den gewählten KI-Anbieter (Google Gemini, OpenAI, Anthropic Claude, DeepSeek oder xAI Grok), mit deinem eigenen API-Schlüssel. Je nach Auswahl kann die Anfrage Commit-Nachrichten, Auszüge aus Changelog und README, Projektmetadaten, Teile von Codeänderungen aus dem gewählten Repository und deine eigenen Anweisungen enthalten. Sie läuft nicht über DotSuite. Wie die Anfrage verarbeitet und aufbewahrt wird, bestimmen die Bedingungen dieses Anbieters. Lass also alles weg, was du nicht mit ihm teilen möchtest." },
        { p: "KI-Agenten, die mit dem MCP-Server verbunden sind (etwa Codex, Claude Code oder Cursor), sind eigenständige Produkte. Was du ihnen sagst und was sie über die Werkzeuge von DotShare lesen, unterliegt den Richtlinien ihrer Anbieter. DotShare gibt einem Agenten niemals deine Zugangsdaten. Agenten arbeiten stattdessen mit Konto-IDs und Namen." },
      ],
    },
    {
      id: "github",
      title: "4. GitHub Gists und CodeSnap",
      blocks: [
        { p: "Zum Erstellen eines Gists nutzt DotShare deine GitHub-Anmeldung in VS Code (die Berechtigung `gist`) und sendet den ausgewählten Code als öffentlichen oder geheimen Gist an GitHub, wie du es wählst. Ein geheimer Gist ist für alle sichtbar, die seinen Link haben. CodeSnap-Screenshots werden in VS Code gezeichnet und auf deinem Gerät gespeichert. Sie verlassen es nur, wenn du einen an einen Beitrag anhängst. Wenn du ein Live-CodeSnap-Bild eines Gists einbindest (einen Link `dotsuite.dev/api/codesnap/gist/…`), liest dotsuite.dev diesen Gist bei Abruf des Bildes über die öffentliche API von GitHub, höchstens einmal alle 10 Minuten, und zeichnet ihn. Gespeichert wird nur das zwischengespeicherte Bild." },
      ],
    },
    {
      id: "sign-in",
      title: "5. Anmeldung bei LinkedIn und X über dotsuite.dev",
      blocks: [
        { p: "Die Anmeldung bei LinkedIn und X erfordert einen Server, der die App-Zugangsdaten von DotShare enthält. DotShare nutzt dafür `dotsuite.dev/api/connect`. DotShare 3.6 und älter nutzen `dotshare-auth-server.vercel.app`, das Tokens ebenfalls direkt an deinen Editor weitergibt, ohne sie zu speichern. Bei einer Anmeldung über dotsuite.dev gilt:" },
        { list: [
          "Dein Browser speichert für höchstens 10 Minuten ein signiertes HttpOnly-Cookie. Es enthält die zufälligen Sicherheitswerte der Anmeldung (state und PKCE-Verifier), die Plattform, den Editor oder die CLI, zu der zurückgekehrt wird, und bei Anmeldungen über das Dashboard deine DotSuite-Benutzer-ID. Es wird gelöscht, sobald die Anmeldung endet, ob erfolgreich oder nicht.",
          "LinkedIn oder X sendet einen Einmalcode an dotsuite.dev zurück, und der Server tauscht ihn gegen Tokens. Das App-Geheimnis von DotShare erreicht deinen Browser nie.",
          "**Anmeldung im Editor:** Die Tokens stehen in der Ergebnisseite, die deinen Editor öffnet (nur `vscode://`, `cursor://` und andere bekannte Editoren), und die Erweiterung speichert sie in SecretStorage. Der Server behält sie nicht.",
          "**Anmeldung über die CLI** (`dotshare-agent accounts connect`): Die Tokens werden mit einem Einmalschlüssel verschlüsselt, der nur im wartenden CLI-Prozess existiert, und an diesen über `127.0.0.1` gesendet. Sie erscheinen nie lesbar in einer URL, und der Server behält sie nicht.",
          "**Anmeldung über das Dashboard** (Connect in deinem DotSuite-Dashboard): Die Tokens werden wie in Abschnitt 6 beschrieben für die Cloud-Planung gespeichert, aber nur, wenn derselbe angemeldete DotSuite-Benutzer die Anmeldung begonnen und beendet hat.",
          "**Erneuerung des X-Tokens:** Zugriffstokens von X gelten etwa zwei Stunden. Zur Erneuerung sendet die Erweiterung oder die CLI ihr Refresh-Token an `dotsuite.dev/api/connect/refresh/x` und erhält ein neues Paar. Keines davon wird gespeichert.",
          "**X ab DotShare 3.8:** X-Tokens werden wie in Abschnitt 7 beschrieben in deinem DotSuite-Konto gespeichert und nie an dein Gerät gesendet, egal wie du dich anmeldest.",
          "Deine IP-Adresse wird genutzt, um die Anzahl von Anmelde- und Erneuerungsversuchen zu begrenzen. Fehler werden ohne Tokens protokolliert.",
          "Anmeldeseiten laden keine Analyse-Werkzeuge und keine Skripte von Drittanbietern.",
        ] },
        { table: {
          head: ["Angeforderte Berechtigung", "Wozu"],
          rows: [
            ["LinkedIn `openid`, `profile`", "Deine Mitglieds-ID ermitteln, damit Beiträge in deinem Namen erscheinen"],
            ["LinkedIn `w_member_social`", "Beiträge erstellen, Medien hochladen und den ersten Kommentar hinzufügen, den du schreibst"],
            ["X `tweet.read`, `users.read`", "Deinen Benutzernamen für Kontoprüfungen lesen und auf Wunsch die Statistiken deiner eigenen Beiträge"],
            ["X `tweet.write`, `media.write`", "Beiträge und Threads veröffentlichen sowie Bilder und Videos hochladen"],
            ["X `offline.access`", "Ein Refresh-Token erhalten, damit du dich nicht alle zwei Stunden neu anmelden musst"],
          ],
        } },
        { p: "Die Erweiterung fragt außerdem bei `dotsuite.dev` ab, welche Anmeldungen gerade verfügbar sind, um nicht verfügbare Schaltflächen zu deaktivieren. Diese Anfrage enthält keine personenbezogenen Daten." },
      ],
    },
    {
      id: "cloud",
      title: "6. Cloud-Planung von DotSuite (optional)",
      blocks: [
        { p: "Die Cloud-Planung veröffentlicht Beiträge zu einem festgelegten Zeitpunkt, auch wenn dein Computer ausgeschaltet ist. Sie erfordert ein DotSuite-Konto und ist der einzige Teil von DotShare, der Inhalte und Zugangsdaten auf DotSuite-Servern speichert. Wenn du nie in der Cloud planst und keine Konten im Dashboard verbindest, betrifft dich dieser Abschnitt nicht." },
        { list: [
          "**Zugangsdaten.** Du fügst sie auf eine von zwei Arten hinzu: indem du LinkedIn oder X im Dashboard verbindest (Abschnitt 5), oder indem du in der Erweiterung der Zustimmungsabfrage vor deiner ersten Cloud-Planung zustimmst; für Mastodon wird gesondert gefragt. Die Erweiterung sendet dann die gespeicherten Zugangsdaten der Plattformen, für die du planst (Telegram, LinkedIn, X, Bluesky, Mastodon oder Dev.to). Der Server verschlüsselt sie vor dem Speichern mit AES-256-GCM und nutzt sie nur, um die geplanten Beiträge zu veröffentlichen.",
          "**Geplante Beiträge.** Beitragstext, gewählte Plattformen, Bild-URLs, Zeitpunkt und Status, dazu die Zahl der Wiederholungsversuche und der letzte Fehler, falls die Veröffentlichung scheitert. Beiträge bleiben nach der Veröffentlichung in deinem Verlauf.",
          "**Bilder.** Bilder, die du planst, werden in den DotSuite-Speicher bei Cloudflare R2 hochgeladen und über eine öffentliche, nicht erratbare URL bereitgestellt, damit die Plattformen sie abrufen können. Wer diese URL kennt, kann das Bild ansehen. Bilder bleiben nach der Veröffentlichung erhalten und werden zusammen mit dem Beitrag gelöscht, wenn du dein DotSuite-Konto löschst.",
          "**Gerätekennung.** Anfragen der Erweiterung und der CLI enthalten einen nicht umkehrbaren SHA-256-Hash einer Gerätekennung (die Machine-ID von VS Code bzw. bei der CLI Hostname und Benutzername des Betriebssystems). Er dient Gerätelimits und der Missbrauchsvermeidung und lässt sich nicht in den ursprünglichen Wert zurückrechnen.",
          "**Aktivitätsdaten.** Die Veröffentlichungsaktivität dient Ratenlimits und der Missbrauchsvermeidung und wird nach 7 Tagen gelöscht. Sicherheits-Audit-Protokolle werden nach 90 Tagen gelöscht.",
          "**Infrastruktur.** Die DotSuite-API läuft unter `core.dotsuite.dev` bei Railway mit einer PostgreSQL-Datenbank. Bilder werden bei Cloudflare R2 gespeichert. Zahlungen für kostenpflichtige Pläne wickelt Lemon Squeezy ab; DotSuite erhält deine Kartendaten nie.",
        ] },
      ],
    },
    {
      id: "x-budget",
      title: "7. X-Beiträge und dein X-Budget",
      blocks: [
        { p: "X stellt DotSuite jeden Beitrag in Rechnung, der über die X-App von DotShare erstellt wird: zu den aktuellen Preisen von X 0,015 $ pro Beitrag und 0,20 $ für einen Beitrag mit Link. Damit das fair und planbar bleibt, veröffentlicht DotSuite X-Beiträge über die App von DotShare selbst und rechnet sie gegen ein monatliches X-Budget ab, das in deinem Plan enthalten ist. Geplante X-Beiträge funktionieren bereits so, und ab DotShare 3.8 auch X-Beiträge, die du sofort veröffentlichst." },
        { list: [
          "**Deine X-Verbindung.** Sobald X-Beiträge über DotSuite laufen, speichert die Anmeldung bei X die Verbindung in deinem DotSuite-Konto. Die X-Tokens werden auf den DotSuite-Servern verschlüsselt und nie an dein Gerät gesendet; dein Editor und die CLI erfahren nur, dass X verbunden ist.",
          "**Was für jeden X-Beitrag erfasst wird:** wann er veröffentlicht wurde, ob er als Beitrag mit Link galt, wie viele Bilder er hatte, die Schätzung laut Preistabelle, der Betrag, den X tatsächlich abgebucht hat (sofern messbar), was dir berechnet wurde, sein Status und seine X-Beitrags-ID. Diese Daten enthalten keinen Beitragstext. Deine letzten Abbuchungen und dein Restbudget siehst du im DotSuite-Dashboard.",
          "**Wie jede Abbuchung berechnet wird.** Jeder Beitrag wird vor dem Senden nach den veröffentlichten Preisen von X bepreist; alles, was ein Link sein könnte, wird als Link berechnet. DotSuite veröffentlicht X-Beiträge nacheinander und liest vor und nach jedem Beitrag sein eigenes X-Guthaben. Hat X mehr abgebucht als geschätzt, wird dir der tatsächlich abgebuchte Betrag berechnet. Dieses Guthaben gehört zum X-Konto von DotSuite und enthält keine Informationen über dich.",
          "**Limits.** Jeder Plan hat ein monatliches X-Budget, das am 1. (UTC) zurückgesetzt wird, und ein tägliches Limit für X-Beiträge pro Nutzer; zusätzlich gilt ein tägliches Gesamtlimit zum Schutz des Dienstes. Ein Beitrag, der ein Limit überschreiten würde, wird abgelehnt, bevor etwas gesendet wird.",
          "**Wenn etwas schiefgeht.** Ein Beitrag, den X ablehnt, wird nicht berechnet, abgesehen von Bildern, die X bereits angenommen hatte. Antwortet X nicht, wird der Beitrag berechnet und nie automatisch erneut gesendet, weil X ihn veröffentlicht haben könnte.",
          "**Aufbewahrung.** Die Daten zum X-Budget werden aufbewahrt, solange dein DotSuite-Konto besteht, und mit ihm gelöscht.",
          "**Stattdessen deine eigene X-App.** Du kannst mit der DotShare-CLI ein Zugriffstoken deiner eigenen X-Developer-App verwenden (`dotshare-agent accounts add`). Beiträge gehen dann von deinem Gerät an X, X rechnet direkt mit deinem eigenen Entwicklerkonto ab, und DotSuite ist nicht beteiligt.",
        ] },
      ],
    },
    {
      id: "choices",
      title: "8. Deine Wahlmöglichkeiten und das Löschen deiner Daten",
      blocks: [
        { list: [
          "**Zugangsdaten aus der Erweiterung entfernen.** Nutze **Clear all credentials** unten in den Einstellungen von DotShare oder führe **DotShare: Clear All Credentials** über die Befehlspalette aus (ab DotShare 3.7.0). In beiden Fällen bestätigst du zuerst. Dabei werden alle Plattform-Tokens und -Schlüssel, die Schlüssel deiner KI-Anbieter, das GitHub-Token, dein DotSuite-Schlüssel und deine Zustimmung zur Cloud-Synchronisierung von diesem Gerät gelöscht. Du kannst LinkedIn, X oder GitHub auch einzeln in den Einstellungen trennen oder dich mit **DotShare: Logout / Clear Token** von DotSuite abmelden.",
          "**CLI-Konten entfernen:** `dotshare-agent accounts remove <id>` löscht das Konto und seinen Eintrag im Schlüsselbund. Deine lokale Bibliothek bleibt in `~/.dotshare`, bis du diesen Ordner löschst.",
          "**Zugriff bei der Plattform widerrufen.** Das lokale Entfernen von Zugangsdaten widerruft sie nicht. Widerrufe sie dort, wo sie ausgestellt wurden: LinkedIn (Settings → Data privacy → Permitted services), X (Settings → Security and account access → Apps and sessions), Mastodon (Preferences → Account → Authorized apps), Bluesky (Settings → App passwords), Telegram (@BotFather → Token widerrufen), Discord (den Webhook löschen) und Dev.to (Settings → Extensions → API keys).",
          "**Geplante Beiträge abbrechen** in der Erweiterung oder mit `cancel_scheduled_post` bzw. `dotshare-agent cloud cancel`.",
          "**Eine Plattform von DotSuite trennen.** Wähle in deinem DotSuite-Dashboard unter DotShare → Connected Accounts bei einer verbundenen Plattform **Disconnect**. Die gespeicherten Zugangsdaten werden sofort gelöscht.",
          "**Alles löschen.** Wenn du dein DotSuite-Konto löschst (Dashboard → Settings → Delete account), werden zuerst alle verbundenen Plattform-Zugangsdaten, geplanten Beiträge samt Bildern, API-Schlüssel und Lizenzdaten gelöscht und danach das Konto selbst. Schlägt dabei etwas fehl, bleibt das Konto bestehen, damit du es erneut versuchen kannst. Abrechnungs-, Erstattungs- und Sicherheits-Audit-Daten werden für ihre gesetzlichen und sicherheitsbedingten Aufbewahrungsfristen behalten. Bilder, die du hochgeladen, aber nie einem geplanten Beitrag angehängt hast, sind nicht mit deinem Konto verknüpft; wende dich an support@dotsuite.dev, wenn eines entfernt werden soll.",
          "**Auskunft oder Berichtigung.** Frag unter derselben Adresse, was DotSuite über deine Nutzung von DotShare speichert, oder bitte uns, es zu berichtigen.",
        ] },
      ],
    },
    {
      id: "security",
      title: "9. Sicherheit",
      blocks: [
        { list: [
          "Alle Verbindungen zu Plattformen, KI-Anbietern und DotSuite nutzen HTTPS. Anfragen mit Zugangsdaten werden verweigert, wenn die TLS-Prüfung deaktiviert ist.",
          "Zugangsdaten sind im Ruhezustand verschlüsselt: auf deinem Gerät durch dein Betriebssystem, auf den DotSuite-Servern mit AES-256-GCM.",
          "Die Anmeldung gibt Tokens nur an bekannte Editor-Schemata oder an die verschlüsselte Übergabe an die CLI zurück, und jede Anmeldung ist durch einen einmaligen state-Wert und PKCE (X) geschützt.",
          "Die verschlüsselte Bibliothek der CLI lässt sich ohne den richtigen Schlüssel nicht öffnen, sodass ein kopierter Ordner allein deine Entwürfe nicht preisgibt.",
          "DotShare ist Open Source. Unter github.com/kareem2099/DotShare kannst du genau prüfen, was es sendet. Sicherheitsprobleme meldest du wie in der dortigen SECURITY.md beschrieben.",
        ] },
      ],
    },
    {
      id: "changes",
      title: "10. Änderungen und Kontakt",
      blocks: [
        { p: "Wenn sich der Umgang von DotShare mit Daten ändert, aktualisieren wir diese Seite und das Datum oben und vermerken die Änderung im CHANGELOG von DotShare. Für Fragen, Anfragen oder Anliegen schreib an support@dotsuite.dev." },
      ],
    },
  ],
  related: { title: "Weitere Informationen", general: "DotSuite-Datenschutzrichtlinie (Konto, Abrechnung, Website)", terms: "DotSuite-Nutzungsbedingungen", github: "Quellcode von DotShare" },
};

export const fr: DotSharePrivacyCopy = {
  eyebrow: "DotSuite · DotShare",
  title: "Politique de confidentialité de DotShare",
  description: "Ce que l'extension DotShare pour VS Code, le serveur MCP de dotshare-cli et la connexion DotShare via dotsuite.dev conservent, où vont les données et comment les supprimer.",
  updated: "Dernière mise à jour : 12 novembre 2026 (DotShare 3.7.0, dotshare-cli 3.1.0)",
  intro: [
    "DotShare est un outil open source pour développeurs, édité par DotSuite. Il transforme vos commits, notes de version et votre code en publications et les publie sur les comptes sociaux que vous connectez. Cette politique couvre l'extension DotShare pour VS Code, le paquet `dotshare-cli` (sa ligne de commande et son serveur MCP local pour les agents d'IA), la connexion DotShare via dotsuite.dev, ainsi que la planification dans le cloud DotSuite lorsque vous l'utilisez avec DotShare.",
    "DotShare fonctionne en local d'abord. Vos identifiants, brouillons et historique restent sur votre appareil, et les publications partent directement de votre appareil vers chaque plateforme, sauf si vous choisissez de les planifier dans le cloud DotSuite. Votre compte DotSuite, la facturation et le site dotsuite.dev lui-même relèvent de la politique de confidentialité générale de DotSuite.",
  ],
  glanceTitle: "En bref",
  glance: {
    head: ["Données", "Où elles sont conservées", "Qui les reçoit"],
    rows: [
      ["Identifiants des plateformes (jetons, mots de passe d'application, jetons de bot, webhooks, clés d'API)", "Sur votre appareil : VS Code SecretStorage (extension) ou le trousseau de votre système (CLI)", "Uniquement la plateforme concernée, lorsque vous publiez ou vérifiez le compte. DotSuite n'en reçoit une copie que si vous planifiez dans le cloud et l'acceptez au préalable."],
      ["Clés d'API des fournisseurs d'IA", "VS Code SecretStorage sur votre appareil", "Uniquement le fournisseur d'IA que vous choisissez"],
      ["Brouillons, historique des publications et reçus", "Sur votre appareil. Les données de la CLI et du MCP sont chiffrées (AES-256-GCM).", "Personne, jusqu'à ce que vous publiiez"],
      ["Contexte du dépôt pour les brouillons d'IA", "Non conservé par DotShare", "Le fournisseur d'IA de votre choix, avec votre propre clé, lorsque vous demandez un brouillon"],
      ["Jetons de connexion LinkedIn et X", "Transmis à votre éditeur ou à la CLI. dotsuite.dev ne les conserve que si vous connectez un compte pour la planification dans le cloud.", "Votre éditeur ou la CLI, et DotSuite pour la planification dans le cloud"],
      ["Publications X via l'application X de DotShare", "DotSuite : le jeton X (chiffré) et une trace du coût de chaque publication, sans son texte", "X, publiées par DotSuite et décomptées du budget X de votre offre"],
      ["Publications planifiées et leurs images", "Serveurs DotSuite (uniquement si vous planifiez dans le cloud)", "Le planificateur de DotSuite, qui les publie sur les plateformes choisies"],
    ],
  },
  promisesTitle: "Ce que nous ne faisons jamais",
  promises: [
    "Vendre, louer ou partager vos données à des fins publicitaires. DotShare n'affiche aucune publicité et ne contient aucun traceur publicitaire.",
    "Collecter de la télémétrie ou des statistiques d'usage depuis l'extension, la CLI ou le serveur MCP. Le code de DotShare n'en envoie aucune.",
    "Envoyer quoi que ce soit de votre dépôt où que ce soit, hormis ce que vous choisissez d'inclure dans un brouillon d'IA (vers votre fournisseur d'IA) ou un Gist (vers GitHub).",
    "Publier de lui-même. Chaque publication part parce que vous, ou un agent d'IA suivant vos instructions, avez demandé à DotShare de la publier ou de la planifier. Le skill et les consignes des outils fournis avec DotShare indiquent aux agents de vous montrer un aperçu et d'attendre votre accord.",
    "Utiliser des contenus ou des données de LinkedIn, X ou de toute autre plateforme pour établir votre profil, ou à toute autre fin que la publication de vos messages et l'affichage de leurs résultats.",
    "Entraîner des modèles d'IA sur vos contenus. Lorsque vous utilisez un fournisseur d'IA, ses propres conditions déterminent le sort de ce que vous lui envoyez.",
  ],
  tocTitle: "Sommaire",
  sections: [
    {
      id: "on-your-device",
      title: "1. Ce qui reste sur votre appareil",
      blocks: [
        { p: "**Extension VS Code.** Les identifiants sont conservés dans VS Code SecretStorage, qui s'appuie sur le magasin d'identifiants de votre système d'exploitation. Cela comprend les jetons LinkedIn et X (y compris le jeton d'actualisation de X et sa date d'expiration), le jeton du bot et l'identifiant de discussion Telegram, l'URL du webhook Discord, l'identifiant et le mot de passe d'application Bluesky, l'instance et le jeton d'accès Mastodon, la clé d'API Dev.to, les clés d'API de vos fournisseurs d'IA et votre clé DotSuite. Le stockage d'extension de VS Code sur votre appareil contient vos paramètres et votre historique : publications récentes, dernière publication, brouillons de GitHub Gists, modèle d'IA et langue choisis, liens d'appel à l'action et vos choix de consentement." },
        { p: "**CLI et serveur MCP (`dotshare-cli`).** Tout se trouve dans `~/.dotshare`, ou dans le dossier défini par `DOTSHARE_HOME`, avec des permissions de fichiers privées. `accounts.json` ne contient que l'identifiant, le nom et la plateforme de chaque compte. Les identifiants sont conservés dans le trousseau de votre système. Les brouillons, modèles personnalisés et le journal de publication sont chiffrés en AES-256-GCM, avec une clé principale conservée dans le trousseau de votre système. Le journal enregistre des empreintes de requêtes, l'état et des reçus (identifiants et liens des publications), mais ni identifiants ni texte complet des publications. Le serveur MCP ne lit des images que dans les dossiers que vous autorisez lors de la configuration (`DOTSHARE_MEDIA_ROOTS`)." },
        { p: "Ni l'extension ni la CLI ne conservent une copie en clair de vos identifiants. Les secrets connus sont retirés des messages d'erreur avant leur affichage ou leur journalisation." },
      ],
    },
    {
      id: "platforms",
      title: "2. Publier sur les plateformes sociales",
      blocks: [
        { p: "Lorsque vous publiez, prévisualisez ou vérifiez un compte, DotShare envoie le texte, les images ou vidéos et l'identifiant correspondant directement de votre appareil à l'API de la plateforme. Les serveurs DotSuite ne sont pas sur ce trajet. La politique de confidentialité de chaque plateforme s'applique ensuite à ce que vous publiez." },
        { table: {
          head: ["Plateforme", "Envoyé depuis votre appareil vers"],
          rows: [
            ["LinkedIn", "`api.linkedin.com` (publications, envois de médias, premiers commentaires, votre profil de base pour publier en votre nom)"],
            ["X", "`api.x.com` (publications, envois de médias, votre nom d'utilisateur pour vérifier le compte)"],
            ["Bluesky", "`bsky.social` (connexion avec votre mot de passe d'application, publications, images, recherche d'identifiants pour les @mentions)"],
            ["Mastodon", "Votre propre instance (publications, médias, limites de caractères et de médias de l'instance)"],
            ["Telegram", "`api.telegram.org` avec le jeton de votre bot"],
            ["Discord", "L'URL de votre webhook sur `discord.com`"],
            ["Dev.to", "`dev.to` avec votre clé d'API"],
          ],
        } },
        { p: "**Statistiques des publications.** Si vous, ou un agent que vous utilisez, demandez les statistiques d'une publication, DotShare lit sur les mêmes plateformes les compteurs publics d'interactions (mentions J'aime, republications, réponses, citations, impressions ou vues) des publications qu'il a publiées. Pour Bluesky, il utilise l'API publique de Bluesky sans connexion. Rien n'est conservé en dehors de ce qui vous est affiché." },
      ],
    },
    {
      id: "ai",
      title: "3. Rédaction par IA (facultatif)",
      blocks: [
        { p: "Lorsque vous demandez un brouillon à DotShare, il envoie une requête directement de votre appareil au fournisseur d'IA choisi (Google Gemini, OpenAI, Anthropic Claude, DeepSeek ou xAI Grok), avec votre propre clé d'API. Selon vos choix, la requête peut contenir des messages de commit, des extraits du changelog et du README, des métadonnées du projet, des parties de modifications de code du dépôt choisi et vos propres instructions. Elle ne passe pas par DotSuite. Les conditions de ce fournisseur déterminent le traitement et la conservation de votre requête : n'y mettez rien que vous ne souhaitez pas partager avec lui." },
        { p: "Les agents d'IA connectés au serveur MCP (comme Codex, Claude Code ou Cursor) sont des produits distincts. Ce que vous leur dites, et ce qu'ils lisent via les outils de DotShare, relève des politiques de leurs fournisseurs. DotShare ne transmet jamais vos identifiants à un agent. Les agents travaillent avec les identifiants et noms des comptes." },
      ],
    },
    {
      id: "github",
      title: "4. GitHub Gists et CodeSnap",
      blocks: [
        { p: "La création d'un Gist utilise votre connexion GitHub dans VS Code (l'autorisation `gist`) et envoie le code sélectionné à GitHub sous forme de gist public ou secret, selon votre choix. Un gist secret reste visible par toute personne disposant de son lien. Les captures CodeSnap sont dessinées dans VS Code et enregistrées sur votre appareil. Elles n'en sortent que si vous en joignez une à une publication. Si vous intégrez une image CodeSnap dynamique d'un gist (un lien `dotsuite.dev/api/codesnap/gist/…`), dotsuite.dev lit ce gist via l'API publique de GitHub lorsque l'image est demandée, au plus une fois toutes les 10 minutes, et la dessine. Rien n'est conservé en dehors de l'image mise en cache." },
      ],
    },
    {
      id: "sign-in",
      title: "5. Connexion à LinkedIn et X via dotsuite.dev",
      blocks: [
        { p: "La connexion à LinkedIn et X nécessite un serveur détenant les identifiants d'application de DotShare. DotShare utilise pour cela `dotsuite.dev/api/connect`. DotShare 3.6 et les versions antérieures utilisent `dotshare-auth-server.vercel.app`, qui transmet lui aussi les jetons directement à votre éditeur sans les conserver. Lors d'une connexion via dotsuite.dev :" },
        { list: [
          "Votre navigateur conserve un cookie signé HttpOnly pendant 10 minutes au plus. Il contient les valeurs de sécurité aléatoires de la connexion (state et vérificateur PKCE), la plateforme, l'éditeur ou la CLI vers lequel revenir et, pour les connexions depuis le tableau de bord, votre identifiant d'utilisateur DotSuite. Il est supprimé à la fin de la connexion, qu'elle réussisse ou non.",
          "LinkedIn ou X renvoie un code à usage unique à dotsuite.dev, et le serveur l'échange contre des jetons. Le secret d'application de DotShare n'atteint jamais votre navigateur.",
          "**Connexion depuis l'éditeur :** les jetons sont placés dans la page de résultat, qui ouvre votre éditeur (uniquement `vscode://`, `cursor://` et d'autres éditeurs connus), et l'extension les enregistre dans SecretStorage. Le serveur ne les conserve pas.",
          "**Connexion depuis la CLI** (`dotshare-agent accounts connect`) : les jetons sont chiffrés avec une clé à usage unique qui n'existe que dans le processus CLI en attente, puis lui sont envoyés sur `127.0.0.1`. Ils n'apparaissent jamais lisibles dans une URL, et le serveur ne les conserve pas.",
          "**Connexion depuis le tableau de bord** (Connect dans votre tableau de bord DotSuite) : les jetons sont conservés pour la planification dans le cloud comme décrit à la section 6, mais seulement si le même utilisateur DotSuite connecté a commencé et terminé la connexion.",
          "**Actualisation du jeton X :** les jetons d'accès X durent environ deux heures. Pour en renouveler un, l'extension ou la CLI envoie son jeton d'actualisation à `dotsuite.dev/api/connect/refresh/x` et reçoit une nouvelle paire. Aucun des deux n'est conservé.",
          "**X à partir de DotShare 3.8 :** les jetons X sont enregistrés dans votre compte DotSuite comme décrit à la section 7 et ne sont jamais envoyés à votre appareil, quelle que soit la façon dont vous vous connectez.",
          "Votre adresse IP sert à limiter le nombre de tentatives de connexion et d'actualisation. Les erreurs sont journalisées sans jetons.",
          "Les pages de connexion ne chargent aucun outil d'analyse ni script tiers.",
        ] },
        { table: {
          head: ["Autorisation demandée", "Pourquoi"],
          rows: [
            ["LinkedIn `openid`, `profile`", "Identifier votre identifiant de membre pour publier en votre nom"],
            ["LinkedIn `w_member_social`", "Créer des publications, envoyer des médias et ajouter le premier commentaire que vous rédigez"],
            ["X `tweet.read`, `users.read`", "Lire votre nom d'utilisateur pour vérifier le compte, et les statistiques de vos propres publications à votre demande"],
            ["X `tweet.write`, `media.write`", "Publier des messages et des fils, et envoyer des images et des vidéos"],
            ["X `offline.access`", "Obtenir un jeton d'actualisation pour ne pas devoir vous reconnecter toutes les deux heures"],
          ],
        } },
        { p: "L'extension demande aussi à `dotsuite.dev` quelles connexions sont disponibles, afin de désactiver les boutons indisponibles. Cette requête ne contient aucune donnée personnelle." },
      ],
    },
    {
      id: "cloud",
      title: "6. Planification dans le cloud DotSuite (facultatif)",
      blocks: [
        { p: "La planification dans le cloud publie vos messages à l'heure prévue, même lorsque votre ordinateur est éteint. Elle nécessite un compte DotSuite et c'est la seule partie de DotShare qui conserve vos contenus et identifiants sur les serveurs DotSuite. Si vous ne planifiez jamais dans le cloud et ne connectez aucun compte dans le tableau de bord, rien de cette section ne vous concerne." },
        { list: [
          "**Identifiants.** Vous les ajoutez de deux façons : en connectant LinkedIn ou X dans le tableau de bord (section 5), ou en acceptant, dans l'extension, la demande de consentement affichée avant votre première planification dans le cloud ; Mastodon fait l'objet d'une demande distincte. L'extension envoie alors les identifiants enregistrés des plateformes sur lesquelles vous planifiez (Telegram, LinkedIn, X, Bluesky, Mastodon ou Dev.to). Le serveur les chiffre en AES-256-GCM avant de les conserver et ne les utilise que pour publier vos messages planifiés.",
          "**Publications planifiées.** Le texte, les plateformes choisies, les URL des images, l'heure et l'état, ainsi que le nombre de tentatives et la dernière erreur en cas d'échec. Les publications restent dans votre historique après leur publication.",
          "**Images.** Les images que vous planifiez sont envoyées vers le stockage DotSuite sur Cloudflare R2 et servies depuis une URL publique impossible à deviner, afin que les plateformes puissent les récupérer. Toute personne disposant de cette URL peut voir l'image. Les images restent après la publication et sont supprimées avec la publication lorsque vous supprimez votre compte DotSuite.",
          "**Identifiant d'appareil.** Les requêtes de l'extension et de la CLI contiennent une empreinte SHA-256 irréversible d'un identifiant d'appareil (l'identifiant de machine de VS Code, ou le nom d'hôte et le nom d'utilisateur du système pour la CLI). Elle sert aux limites d'appareils et à la prévention des abus, et ne permet pas de retrouver la valeur d'origine.",
          "**Données d'activité.** L'activité de publication sert aux limites de débit et à la prévention des abus et est supprimée après 7 jours. Les journaux d'audit de sécurité sont supprimés après 90 jours.",
          "**Infrastructure.** L'API DotSuite fonctionne sur `core.dotsuite.dev` chez Railway avec une base de données PostgreSQL. Les images sont stockées sur Cloudflare R2. Les paiements des offres payantes sont gérés par Lemon Squeezy, et DotSuite ne reçoit jamais vos données de carte.",
        ] },
      ],
    },
    {
      id: "x-budget",
      title: "7. Les publications X et votre budget X",
      blocks: [
        { p: "X facture à DotSuite chaque publication faite via l'application X de DotShare : aux tarifs actuels de X, 0,015 $ par publication et 0,20 $ pour une publication contenant un lien. Pour que cela reste équitable et prévisible, les publications X faites via l'application de DotShare sont publiées par DotSuite et décomptées d'un budget X mensuel inclus dans votre offre. Les publications X planifiées fonctionnent déjà ainsi, et à partir de DotShare 3.8, les publications X immédiates aussi." },
        { list: [
          "**Votre connexion X.** Dès que les publications X passent par DotSuite, la connexion à X est enregistrée dans votre compte DotSuite. Les jetons X sont chiffrés sur les serveurs de DotSuite et ne sont jamais envoyés à votre appareil ; votre éditeur et la CLI savent seulement que X est connecté.",
          "**Ce qui est enregistré pour chaque publication X :** sa date, si elle a été comptée comme publication avec lien, son nombre d'images, l'estimation de la grille tarifaire, le montant réellement prélevé par X lorsqu'il a pu être mesuré, ce qui vous a été facturé, son état et son identifiant de publication X. Ces données ne contiennent pas le texte de la publication. Vos derniers prélèvements et votre budget restant s'affichent dans le tableau de bord DotSuite.",
          "**Comment chaque montant est calculé.** Chaque publication est tarifée selon les prix publiés par X avant son envoi, et tout ce qui pourrait être un lien est compté comme tel. DotSuite publie les messages X un par un et lit son propre solde de crédits X avant et après chacun. Si X a prélevé plus que l'estimation, vous êtes facturé du montant réellement prélevé. Ce solde appartient au compte X de DotSuite et ne contient aucune information vous concernant.",
          "**Limites.** Chaque offre comprend un budget X mensuel, réinitialisé le 1er (UTC), et une limite quotidienne de publications X par utilisateur ; DotSuite applique aussi une limite quotidienne globale pour protéger le service. Une publication qui dépasserait une limite est refusée avant tout envoi.",
          "**En cas de problème.** Une publication refusée par X n'est pas facturée, à l'exception des images déjà acceptées par X. Si X ne répond pas, la publication est facturée et n'est jamais renvoyée automatiquement, car X a pu la publier.",
          "**Conservation.** Les données du budget X sont conservées tant que votre compte DotSuite existe et sont supprimées avec lui.",
          "**Votre propre application X à la place.** Vous pouvez utiliser un jeton d'accès de votre propre application X Developer avec la CLI DotShare (`dotshare-agent accounts add`). Les publications partent alors de votre appareil vers X, X facture directement votre propre compte développeur, et DotSuite n'intervient pas.",
        ] },
      ],
    },
    {
      id: "choices",
      title: "8. Vos choix et la suppression de vos données",
      blocks: [
        { list: [
          "**Retirer les identifiants de l'extension.** Utilisez **Clear all credentials** en bas des paramètres de DotShare, ou exécutez **DotShare: Clear All Credentials** depuis la palette de commandes (DotShare 3.7.0 et versions ultérieures). Dans les deux cas, vous confirmez d'abord. Cela supprime de cet appareil tous les jetons et clés des plateformes, les clés de vos fournisseurs d'IA, le jeton GitHub, votre clé DotSuite et votre consentement à la synchronisation cloud. Vous pouvez aussi déconnecter LinkedIn, X ou GitHub un par un dans les paramètres, ou vous déconnecter de DotSuite avec **DotShare: Logout / Clear Token**.",
          "**Retirer des comptes de la CLI :** `dotshare-agent accounts remove <id>` supprime le compte et son entrée dans le trousseau. Votre bibliothèque locale reste dans `~/.dotshare` jusqu'à ce que vous supprimiez ce dossier.",
          "**Révoquer l'accès auprès de la plateforme.** Supprimer un identifiant en local ne le révoque pas. Révoquez-le là où il a été délivré : LinkedIn (Settings → Data privacy → Permitted services), X (Settings → Security and account access → Apps and sessions), Mastodon (Preferences → Account → Authorized apps), Bluesky (Settings → App passwords), Telegram (@BotFather → révoquer le jeton), Discord (supprimer le webhook) et Dev.to (Settings → Extensions → API keys).",
          "**Annuler des publications planifiées** depuis l'extension, ou avec `cancel_scheduled_post` / `dotshare-agent cloud cancel`.",
          "**Déconnecter une plateforme de DotSuite.** Dans votre tableau de bord DotSuite, sous DotShare → Connected Accounts, choisissez **Disconnect** sur une plateforme connectée. Son identifiant conservé est supprimé immédiatement.",
          "**Tout supprimer.** La suppression de votre compte DotSuite (Dashboard → Settings → Delete account) supprime d'abord tous les identifiants des plateformes connectées, les publications planifiées et leurs images, les clés d'API et les données de licence, puis le compte lui-même. Si une étape échoue, le compte est conservé pour que vous puissiez réessayer. Les données de facturation, de remboursement et d'audit de sécurité sont conservées pendant leurs durées légales et de sécurité. Les images envoyées mais jamais jointes à une publication planifiée ne sont pas liées à votre compte ; écrivez à support@dotsuite.dev si vous souhaitez en faire supprimer une.",
          "**Accès ou rectification.** Demandez à la même adresse ce que DotSuite conserve sur votre usage de DotShare, ou demandez-nous de le corriger.",
        ] },
      ],
    },
    {
      id: "security",
      title: "9. Sécurité",
      blocks: [
        { list: [
          "Toutes les connexions aux plateformes, aux fournisseurs d'IA et à DotSuite passent par HTTPS. Les requêtes contenant des identifiants sont refusées si la vérification TLS a été désactivée.",
          "Les identifiants sont chiffrés au repos : par votre système sur votre appareil, et en AES-256-GCM sur les serveurs DotSuite.",
          "La connexion ne renvoie les jetons qu'à des schémas d'éditeurs connus ou au transfert chiffré vers la CLI, et chaque connexion est protégée par une valeur state à usage unique et par PKCE (X).",
          "La bibliothèque chiffrée de la CLI refuse de s'ouvrir sans la bonne clé : un dossier copié ne suffit donc pas à exposer vos brouillons.",
          "DotShare est open source. Vous pouvez vérifier exactement ce qu'il envoie sur github.com/kareem2099/DotShare. Signalez les problèmes de sécurité comme indiqué dans son fichier SECURITY.md.",
        ] },
      ],
    },
    {
      id: "changes",
      title: "10. Modifications et contact",
      blocks: [
        { p: "Lorsque le traitement des données par DotShare change, nous mettons à jour cette page et la date en haut, et nous signalons le changement dans le CHANGELOG de DotShare. Pour toute question, demande ou préoccupation, écrivez à support@dotsuite.dev." },
      ],
    },
  ],
  related: { title: "Voir aussi", general: "Politique de confidentialité de DotSuite (compte, facturation, site)", terms: "Conditions d'utilisation de DotSuite", github: "Code source de DotShare" },
};

export const ru: DotSharePrivacyCopy = {
  eyebrow: "DotSuite · DotShare",
  title: "Политика конфиденциальности DotShare",
  description: "Что хранят расширение DotShare для VS Code, MCP-сервер dotshare-cli и вход в DotShare через dotsuite.dev, куда передаются данные и как их удалить.",
  updated: "Последнее обновление: 12 ноября 2026 г. (DotShare 3.7.0, dotshare-cli 3.1.0)",
  intro: [
    "DotShare — инструмент с открытым исходным кодом для разработчиков от DotSuite. Он превращает ваши коммиты, заметки о выпусках и код в публикации и размещает их в подключённых вами соцсетях. Эта политика распространяется на расширение DotShare для VS Code, пакет `dotshare-cli` (его командную строку и локальный MCP-сервер для ИИ-агентов), вход в DotShare через dotsuite.dev и облачное планирование DotSuite, если вы используете его вместе с DotShare.",
    "DotShare работает прежде всего локально. Учётные данные, черновики и история остаются на вашем устройстве, а публикации уходят с вашего устройства напрямую на каждую платформу, если только вы не решите запланировать их в облаке DotSuite. Ваш аккаунт DotSuite, оплата и сам сайт dotsuite.dev регулируются общей политикой конфиденциальности DotSuite.",
  ],
  glanceTitle: "Коротко",
  glance: {
    head: ["Данные", "Где хранятся", "Кто их получает"],
    rows: [
      ["Учётные данные платформ (токены, пароли приложений, токены ботов, вебхуки, API-ключи)", "На вашем устройстве: VS Code SecretStorage (расширение) или хранилище ключей вашей ОС (CLI)", "Только платформа, к которой они относятся, когда вы публикуете или проверяете аккаунт. DotSuite получает копию, только если вы планируете в облаке и заранее даёте согласие."],
      ["API-ключи ИИ-провайдеров", "VS Code SecretStorage на вашем устройстве", "Только выбранный вами ИИ-провайдер"],
      ["Черновики, история публикаций и квитанции", "На вашем устройстве. Записи CLI и MCP зашифрованы (AES-256-GCM).", "Никто, пока вы не опубликуете"],
      ["Контекст репозитория для ИИ-черновиков", "DotShare его не хранит", "Выбранный вами ИИ-провайдер, с вашим собственным ключом, когда вы запрашиваете черновик"],
      ["Токены входа LinkedIn и X", "Передаются в ваш редактор или CLI. dotsuite.dev хранит их, только если вы подключаете аккаунт для облачного планирования.", "Ваш редактор или CLI, а также DotSuite для облачного планирования"],
      ["Публикации в X через приложение DotShare", "DotSuite: токен X (в зашифрованном виде) и запись о стоимости каждой публикации, без её текста", "X; публикует DotSuite, списание из бюджета X вашего тарифа"],
      ["Запланированные публикации и их изображения", "Серверы DotSuite (только если вы планируете в облаке)", "Планировщик DotSuite, который публикует их на выбранных платформах"],
    ],
  },
  promisesTitle: "Чего мы никогда не делаем",
  promises: [
    "Не продаём, не сдаём в аренду и не передаём ваши данные для рекламы. В DotShare нет рекламы и рекламных трекеров.",
    "Не собираем телеметрию и аналитику из расширения, CLI или MCP-сервера. Код DotShare ничего такого не отправляет.",
    "Не отправляем ничего из вашего репозитория куда-либо, кроме того, что вы сами включаете в ИИ-черновик (вашему ИИ-провайдеру) или в Gist (на GitHub).",
    "Не публикуем ничего самостоятельно. Каждая публикация уходит потому, что вы или ИИ-агент, следующий вашим указаниям, попросили DotShare её опубликовать или запланировать. Навык и описания инструментов, которые поставляются с DotShare, требуют от агентов показать вам предпросмотр и дождаться вашего одобрения.",
    "Не используем контент или данные LinkedIn, X или любой другой платформы для составления вашего профиля или для чего-либо, кроме публикации ваших постов и показа их результатов.",
    "Не обучаем ИИ-модели на вашем контенте. Если вы пользуетесь ИИ-провайдером, судьбу отправленных данных определяют его собственные условия.",
  ],
  tocTitle: "Содержание",
  sections: [
    {
      id: "on-your-device",
      title: "1. Что остаётся на вашем устройстве",
      blocks: [
        { p: "**Расширение VS Code.** Учётные данные хранятся в VS Code SecretStorage, который использует хранилище учётных данных вашей операционной системы. Сюда входят токены LinkedIn и X (включая токен обновления X и срок его действия), токен бота и ID чата Telegram, URL вебхука Discord, хэндл и пароль приложения Bluesky, инстанс и токен доступа Mastodon, API-ключ Dev.to, API-ключи ваших ИИ-провайдеров и ваш ключ DotSuite. В хранилище расширений VS Code на вашем устройстве находятся ваши настройки и история: недавние публикации, последняя публикация, черновики GitHub Gists, выбранные ИИ-модель и язык, ваши ссылки призыва к действию и ваши решения о согласии." },
        { p: "**CLI и MCP-сервер (`dotshare-cli`).** Всё хранится в `~/.dotshare` или в папке, заданной в `DOTSHARE_HOME`, с закрытыми правами доступа к файлам. `accounts.json` содержит только ID, имя и платформу каждого аккаунта. Учётные данные хранятся в хранилище ключей вашей ОС. Черновики, собственные шаблоны и журнал публикаций зашифрованы AES-256-GCM мастер-ключом, который хранится в хранилище ключей вашей ОС. Журнал хранит отпечатки запросов, статус и квитанции (ID публикаций и ссылки), но не учётные данные и не полный текст публикаций. MCP-сервер читает изображения только из папок, которые вы разрешили при настройке (`DOTSHARE_MEDIA_ROOTS`)." },
        { p: "Ни расширение, ни CLI не хранят ваши учётные данные в открытом виде. Известные секреты удаляются из сообщений об ошибках до того, как те показываются или записываются в журнал." },
      ],
    },
    {
      id: "platforms",
      title: "2. Публикация в соцсетях",
      blocks: [
        { p: "Когда вы публикуете, делаете предпросмотр или проверяете аккаунт, DotShare отправляет текст публикации, изображения или видео и соответствующие учётные данные напрямую с вашего устройства в API платформы. Серверы DotSuite в этом не участвуют. Дальше к опубликованному применяется политика конфиденциальности самой платформы." },
        { table: {
          head: ["Платформа", "Куда отправляется с вашего устройства"],
          rows: [
            ["LinkedIn", "`api.linkedin.com` (публикации, загрузка медиа, первые комментарии, ваш базовый профиль для публикации от вашего имени)"],
            ["X", "`api.x.com` (публикации, загрузка медиа, ваше имя пользователя для проверки аккаунта)"],
            ["Bluesky", "`bsky.social` (вход по паролю приложения, публикации, изображения, поиск хэндлов для @упоминаний)"],
            ["Mastodon", "Ваш собственный инстанс (публикации, медиа, лимиты символов и медиа инстанса)"],
            ["Telegram", "`api.telegram.org` с токеном вашего бота"],
            ["Discord", "URL вашего вебхука на `discord.com`"],
            ["Dev.to", "`dev.to` с вашим API-ключом"],
          ],
        } },
        { p: "**Статистика публикаций.** Если вы или используемый вами агент запрашиваете статистику публикации, DotShare считывает с тех же платформ публичные счётчики вовлечённости (отметки «нравится», репосты, ответы, цитаты, показы или просмотры) для опубликованных им постов. Для Bluesky используется публичный API Bluesky без входа. Сохраняется только то, что показано вам." },
      ],
    },
    {
      id: "ai",
      title: "3. Черновики с помощью ИИ (по желанию)",
      blocks: [
        { p: "Когда вы просите DotShare написать черновик, он отправляет запрос напрямую с вашего устройства выбранному ИИ-провайдеру (Google Gemini, OpenAI, Anthropic Claude, DeepSeek или xAI Grok) с вашим собственным API-ключом. В зависимости от ваших настроек запрос может включать сообщения коммитов, фрагменты changelog и README, метаданные проекта, части изменений кода из выбранного репозитория и ваши собственные указания. Он не проходит через DotSuite. Обработку и хранение запроса определяют условия этого провайдера, поэтому не включайте то, чем не хотите с ним делиться." },
        { p: "ИИ-агенты, подключённые к MCP-серверу (например, Codex, Claude Code или Cursor), — отдельные продукты. То, что вы им сообщаете и что они читают через инструменты DotShare, регулируется политиками их провайдеров. DotShare никогда не передаёт агенту ваши учётные данные. Агенты работают с ID и названиями аккаунтов." },
      ],
    },
    {
      id: "github",
      title: "4. GitHub Gists и CodeSnap",
      blocks: [
        { p: "Для создания Gist используется ваш вход в GitHub в VS Code (разрешение `gist`), а выбранный код отправляется на GitHub как публичный или секретный gist — по вашему выбору. Секретный gist может увидеть любой, у кого есть ссылка. Скриншоты CodeSnap рисуются внутри VS Code и сохраняются на вашем устройстве. Они покидают его, только если вы прикрепите скриншот к публикации. Если вы встраиваете живое изображение CodeSnap для gist (ссылку `dotsuite.dev/api/codesnap/gist/…`), dotsuite.dev при запросе изображения читает этот gist через публичный API GitHub не чаще раза в 10 минут и рисует его. Ничего не сохраняется, кроме кэшированного изображения." },
      ],
    },
    {
      id: "sign-in",
      title: "5. Вход в LinkedIn и X через dotsuite.dev",
      blocks: [
        { p: "Для входа в LinkedIn и X нужен сервер, на котором хранятся учётные данные приложения DotShare. DotShare использует для этого `dotsuite.dev/api/connect`. DotShare 3.6 и более ранние версии используют `dotshare-auth-server.vercel.app`, который тоже передаёт токены прямо в ваш редактор, не сохраняя их. При входе через dotsuite.dev:" },
        { list: [
          "Ваш браузер хранит подписанный HttpOnly-cookie не дольше 10 минут. В нём находятся случайные защитные значения входа (state и верификатор PKCE), платформа, редактор или CLI, в который нужно вернуться, а для входа из панели управления — ваш ID пользователя DotSuite. Он удаляется по завершении входа, успешного или нет.",
          "LinkedIn или X возвращает на dotsuite.dev одноразовый код, и сервер обменивает его на токены. Секрет приложения DotShare никогда не попадает в ваш браузер.",
          "**Вход из редактора:** токены помещаются на страницу результата, которая открывает ваш редактор (только `vscode://`, `cursor://` и другие известные редакторы), и расширение сохраняет их в SecretStorage. Сервер их не хранит.",
          "**Вход из CLI** (`dotshare-agent accounts connect`): токены шифруются одноразовым ключом, который существует только в ожидающем процессе CLI, и отправляются ему на `127.0.0.1`. Они никогда не появляются в URL в читаемом виде, и сервер их не хранит.",
          "**Вход из панели управления** (Connect в панели DotSuite): токены сохраняются для облачного планирования, как описано в разделе 6, но только если вход начал и завершил один и тот же авторизованный пользователь DotSuite.",
          "**Обновление токена X:** токены доступа X действуют около двух часов. Чтобы обновить токен, расширение или CLI отправляет свой токен обновления на `dotsuite.dev/api/connect/refresh/x` и получает новую пару. Ни один из них не сохраняется.",
          "**X начиная с DotShare 3.8:** токены X сохраняются в вашем аккаунте DotSuite, как описано в разделе 7, и никогда не отправляются на ваше устройство, каким бы способом вы ни входили.",
          "Ваш IP-адрес используется для ограничения числа попыток входа и обновления. Ошибки записываются в журнал без токенов.",
          "Страницы входа не загружают инструменты аналитики и сторонние скрипты.",
        ] },
        { table: {
          head: ["Запрашиваемое разрешение", "Зачем"],
          rows: [
            ["LinkedIn `openid`, `profile`", "Определить ваш ID участника, чтобы публиковать от вашего имени"],
            ["LinkedIn `w_member_social`", "Создавать публикации, загружать медиа и добавлять написанный вами первый комментарий"],
            ["X `tweet.read`, `users.read`", "Читать ваше имя пользователя для проверки аккаунта и, по вашему запросу, статистику ваших публикаций"],
            ["X `tweet.write`, `media.write`", "Публиковать посты и треды, загружать изображения и видео"],
            ["X `offline.access`", "Получить токен обновления, чтобы не входить заново каждые два часа"],
          ],
        } },
        { p: "Расширение также спрашивает у `dotsuite.dev`, какие способы входа сейчас доступны, чтобы отключить недоступные кнопки. Этот запрос не содержит персональных данных." },
      ],
    },
    {
      id: "cloud",
      title: "6. Облачное планирование DotSuite (по желанию)",
      blocks: [
        { p: "Облачное планирование публикует посты в заданное время, даже когда ваш компьютер выключен. Для него нужен аккаунт DotSuite, и это единственная часть DotShare, которая хранит ваш контент и учётные данные на серверах DotSuite. Если вы никогда не планируете в облаке и не подключаете аккаунты в панели управления, этот раздел к вам не относится." },
        { list: [
          "**Учётные данные.** Вы добавляете их одним из двух способов: подключаете LinkedIn или X в панели управления (раздел 5) или соглашаетесь в расширении на запрос согласия, который появляется перед первым облачным планированием; для Mastodon согласие запрашивается отдельно. После этого расширение отправляет сохранённые учётные данные платформ, для которых вы планируете (Telegram, LinkedIn, X, Bluesky, Mastodon или Dev.to). Сервер шифрует их AES-256-GCM перед сохранением и использует только для публикации запланированных вами постов.",
          "**Запланированные публикации.** Текст публикации, выбранные платформы, URL изображений, время и статус, а также число повторных попыток и последняя ошибка, если публикация не удалась. Посты остаются в вашей истории после публикации.",
          "**Изображения.** Изображения для запланированных постов загружаются в хранилище DotSuite в Cloudflare R2 и раздаются по публичному URL, который невозможно угадать, чтобы платформы могли их получить. Любой, у кого есть этот URL, может открыть изображение. Изображения остаются после публикации и удаляются вместе с постом при удалении вашего аккаунта DotSuite.",
          "**Идентификатор устройства.** Запросы расширения и CLI содержат необратимый хеш SHA-256 идентификатора устройства (machine ID в VS Code, а для CLI — имя компьютера и имя пользователя ОС). Он используется для ограничения числа устройств и предотвращения злоупотреблений; восстановить по нему исходное значение невозможно.",
          "**Записи активности.** Активность публикаций используется для ограничения частоты и предотвращения злоупотреблений и удаляется через 7 дней. Журналы аудита безопасности удаляются через 90 дней.",
          "**Инфраструктура.** API DotSuite работает на `core.dotsuite.dev` в Railway с базой данных PostgreSQL. Изображения хранятся в Cloudflare R2. Платежи за платные тарифы обрабатывает Lemon Squeezy, и DotSuite никогда не получает данные вашей карты.",
        ] },
      ],
    },
    {
      id: "x-budget",
      title: "7. Публикации в X и ваш бюджет X",
      blocks: [
        { p: "X выставляет DotSuite счёт за каждую публикацию, сделанную через приложение DotShare в X: по текущим ценам X — 0,015 $ за публикацию и 0,20 $ за публикацию со ссылкой. Чтобы это оставалось честным и предсказуемым, публикации в X через приложение DotShare выполняет DotSuite, и они списываются с ежемесячного бюджета X, входящего в ваш тариф. Запланированные публикации в X уже работают так, а начиная с DotShare 3.8 — и публикации, которые вы отправляете сразу." },
        { list: [
          "**Ваше подключение к X.** Когда публикации в X идут через DotSuite, вход в X сохраняет подключение в вашем аккаунте DotSuite. Токены X хранятся на серверах DotSuite в зашифрованном виде и никогда не отправляются на ваше устройство; редактор и CLI знают только, что X подключён.",
          "**Что записывается для каждой публикации в X:** время публикации, считалась ли она публикацией со ссылкой, сколько в ней изображений, оценка по таблице цен, сумма, которую X фактически списал (если её удалось измерить), сколько списано с вас, статус и ID публикации в X. Текст публикации в этих записях не хранится. Последние списания и остаток бюджета видны в панели управления DotSuite.",
          "**Как рассчитывается каждое списание.** Каждая публикация оценивается по опубликованным ценам X до отправки, а всё, что может оказаться ссылкой, считается ссылкой. DotSuite публикует посты в X по одному и проверяет свой баланс кредитов X до и после каждого поста. Если X списал больше оценки, с вас списывается фактическая сумма. Этот баланс принадлежит аккаунту DotSuite в X и не содержит никакой информации о вас.",
          "**Ограничения.** У каждого тарифа есть ежемесячный бюджет X, который обнуляется 1-го числа (UTC), и дневной лимит публикаций в X на пользователя; кроме того, DotSuite применяет общий дневной лимит для защиты сервиса. Публикация, которая превысила бы лимит, отклоняется до какой-либо отправки.",
          "**Если что-то пошло не так.** Публикация, отклонённая X, не оплачивается, кроме изображений, которые X уже принял. Если X не ответил, публикация оплачивается и никогда не отправляется повторно автоматически, потому что X мог её опубликовать.",
          "**Хранение.** Записи бюджета X хранятся, пока существует ваш аккаунт DotSuite, и удаляются вместе с ним.",
          "**Ваше собственное приложение X.** Вы можете использовать токен доступа своего приложения X Developer в CLI DotShare (`dotshare-agent accounts add`). Тогда публикации идут с вашего устройства прямо в X, X выставляет счёт вашему собственному аккаунту разработчика, а DotSuite в этом не участвует.",
        ] },
      ],
    },
    {
      id: "choices",
      title: "8. Ваши возможности и удаление данных",
      blocks: [
        { list: [
          "**Удалить учётные данные из расширения.** Нажмите **Clear all credentials** внизу настроек DotShare или выполните **DotShare: Clear All Credentials** из палитры команд (DotShare 3.7.0 и новее). В обоих случаях вы сначала подтверждаете действие. С этого устройства удаляются все токены и ключи платформ, ключи ИИ-провайдеров, токен GitHub, ваш ключ DotSuite и согласие на облачную синхронизацию. Также можно отключить LinkedIn, X или GitHub по отдельности в настройках или выйти из DotSuite командой **DotShare: Logout / Clear Token**.",
          "**Удалить аккаунты CLI:** `dotshare-agent accounts remove <id>` удаляет аккаунт и его запись в хранилище ключей. Ваша локальная библиотека остаётся в `~/.dotshare`, пока вы не удалите эту папку.",
          "**Отозвать доступ на платформе.** Локальное удаление учётных данных их не отзывает. Отзовите их там, где они были выданы: LinkedIn (Settings → Data privacy → Permitted services), X (Settings → Security and account access → Apps and sessions), Mastodon (Preferences → Account → Authorized apps), Bluesky (Settings → App passwords), Telegram (@BotFather → отозвать токен), Discord (удалить вебхук) и Dev.to (Settings → Extensions → API keys).",
          "**Отменить запланированные публикации** в расширении или командами `cancel_scheduled_post` / `dotshare-agent cloud cancel`.",
          "**Отключить платформу от DotSuite.** В панели управления DotSuite в разделе DotShare → Connected Accounts выберите **Disconnect** у подключённой платформы. Сохранённые учётные данные удаляются сразу.",
          "**Удалить всё.** При удалении аккаунта DotSuite (Dashboard → Settings → Delete account) сначала удаляются все учётные данные подключённых платформ, запланированные публикации вместе с изображениями, API-ключи и данные лицензий, а затем сам аккаунт. Если какой-то шаг не удался, аккаунт сохраняется, чтобы вы могли повторить попытку. Данные об оплате, возвратах и аудите безопасности хранятся в течение предусмотренных законом и требованиями безопасности сроков. Изображения, которые вы загрузили, но так и не прикрепили к запланированной публикации, не связаны с вашим аккаунтом; если нужно удалить такое изображение, напишите на support@dotsuite.dev.",
          "**Доступ и исправление.** По тому же адресу можно узнать, что DotSuite хранит о вашем использовании DotShare, или попросить исправить эти данные.",
        ] },
      ],
    },
    {
      id: "security",
      title: "9. Безопасность",
      blocks: [
        { list: [
          "Все соединения с платформами, ИИ-провайдерами и DotSuite используют HTTPS. Запросы с учётными данными отклоняются, если проверка TLS отключена.",
          "Учётные данные хранятся в зашифрованном виде: на вашем устройстве — средствами ОС, на серверах DotSuite — с помощью AES-256-GCM.",
          "Вход возвращает токены только известным схемам редакторов или по зашифрованному каналу в CLI, а каждый вход защищён одноразовым значением state и PKCE (X).",
          "Зашифрованная библиотека CLI не открывается без правильного ключа, поэтому одна лишь копия папки не раскрывает ваши черновики.",
          "DotShare — проект с открытым исходным кодом. Проверить, что именно он отправляет, можно на github.com/kareem2099/DotShare. Сообщайте о проблемах безопасности, как описано в его файле SECURITY.md.",
        ] },
      ],
    },
    {
      id: "changes",
      title: "10. Изменения и контакты",
      blocks: [
        { p: "Если обработка данных в DotShare меняется, мы обновляем эту страницу и дату вверху и отмечаем изменение в CHANGELOG DotShare. С вопросами, запросами или опасениями пишите на support@dotsuite.dev." },
      ],
    },
  ],
  related: { title: "См. также", general: "Политика конфиденциальности DotSuite (аккаунт, оплата, сайт)", terms: "Условия использования DotSuite", github: "Исходный код DotShare" },
};
