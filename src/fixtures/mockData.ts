import { Account, Message } from '../types/mail';

export const INITIAL_ACCOUNTS: Account[] = [
  {
    id: 'acc-work-sales',
    email: 'sales@cloudcorp.sa',
    displayName: 'CloudCorp Sales (IMAP/TLS)',
    provider: 'imap',
    groupName: 'العمل (Work)',
    status: 'ready',
    unreadCount: 4,
    totalCount: 48,
    lastSyncAt: new Date(Date.now() - 3 * 60000).toISOString(),
    syncIntervalMinutes: 5,
    color: '#176BD3',
  },
  {
    id: 'acc-personal-gmail',
    email: 'tariq.developer@gmail.com',
    displayName: 'Tariq Personal (Gmail OAuth)',
    provider: 'gmail',
    groupName: 'شخصي (Personal)',
    status: 'ready',
    unreadCount: 7,
    totalCount: 112,
    lastSyncAt: new Date(Date.now() - 7 * 60000).toISOString(),
    syncIntervalMinutes: 10,
    color: '#EA4335',
  },
  {
    id: 'acc-corp-outlook',
    email: 'billing@enterprise.onmicrosoft.com',
    displayName: 'Enterprise Billing (Microsoft Graph)',
    provider: 'outlook',
    groupName: 'العمل (Work)',
    status: 'rate_limited',
    unreadCount: 2,
    totalCount: 35,
    lastSyncAt: new Date(Date.now() - 25 * 60000).toISOString(),
    errorMessage: 'Graph API Throttled (429) - Retry after 120s',
    syncIntervalMinutes: 15,
    color: '#0078D4',
  },
  {
    id: 'acc-support-domain',
    email: 'support@devops-hub.io',
    displayName: 'DevOps Support (IMAP/SMTP)',
    provider: 'imap',
    groupName: 'العمل (Work)',
    status: 'auth_required',
    unreadCount: 1,
    totalCount: 19,
    lastSyncAt: new Date(Date.now() - 180 * 60000).toISOString(),
    errorMessage: 'App Password expired / Server rejected credentials',
    syncIntervalMinutes: 5,
    color: '#107C41',
  },
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-001',
    accountId: 'acc-work-sales',
    accountEmail: 'sales@cloudcorp.sa',
    accountColor: '#176BD3',
    folderId: 'inbox',
    remoteId: 'imap-4921',
    fromName: 'عبدالرحمن العتيبي',
    fromAddress: 'a.otaibi@riyadh-tech.com',
    toAddresses: ['sales@cloudcorp.sa'],
    ccAddresses: ['procurement@riyadh-tech.com'],
    subject: 'طلب عرض أسعار رسمي: تراخيص السحابة الهجينة وخوادم Apple Silicon',
    snippet: 'السلام عليكم ورحمة الله، نود الحصول على عرض سعر رسمي شامل الدعم الفني لمدة سنتين لتجهيز خوادم معالجة البيانات...',
    bodyPlain: `السلام عليكم ورحمة الله وبركاته،

الأخوة الأعزاء في فريق المبيعات،

نود الحصول على عرض سعر رسمي (RFP) معتمد لتوريد وتثبيت خوادم المعالجة السحابية المتوافقة مع معمارية ARM64 / Apple Silicon، مع الشروط التالية:

1. تراخيص لـ 250 مستخدم متزامن.
2. دعم فني مخصص (SLA 99.99%) لمدة 24 شهرًا.
3. إمكانية التكامل المحلي مع حلول البريد الإلكتروني المشفرة.

يرجى إرسال العرض في موعد أقصاه نهاية الأسبوع الحالي مع جدول مواعيد التنفيذ.

وتقبلوا فائق الاحترام والتقدير،
م. عبدالرحمن العتيبي
مدير البنية التحتية السحابية - شركة الرياض للتقنية`,
    bodyHtml: `<div dir="rtl" style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #142538;">
<p>السلام عليكم ورحمة الله وبركاته،</p>
<p>الأخوة الأعزاء في فريق المبيعات،</p>
<p>نود الحصول على <strong>عرض سعر رسمي (RFP)</strong> لتوريد وتثبيت خوادم المعالجة السحابية المتوافقة مع معمارية ARM64 / Apple Silicon:</p>
<ul style="padding-right: 20px;">
  <li>تراخيص لـ 250 مستخدم متزامن.</li>
  <li>دعم فني مخصص (SLA 99.99%) لمدة 24 شهرًا.</li>
  <li>إمكانية التكامل المحلي مع حلول البريد الإلكتروني المشفرة.</li>
</ul>
<p>يرجى إرسال العرض في موعد أقصاه نهاية الأسبوع الحالي مع جدول مواعيد التنفيذ.</p>
<p style="margin-top: 24px; border-top: 1px solid #D6E0EA; padding-top: 12px; font-size: 13px; color: #53657B;">
<strong>م. عبدالرحمن العتيبي</strong><br/>
مدير البنية التحتية السحابية — شركة الرياض للتقنية<br/>
هاتف: +966 11 400 9988
</p>
<img src="https://example.com/tracking-pixel.png" alt="Tracking Pixel" style="display:none;" />
</div>`,
    isRead: false,
    isStarred: true,
    hasAttachment: true,
    attachments: [
      {
        id: 'att-01',
        filename: 'RFP-CloudCorp-2026-Spec.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 2450000,
        isDownloaded: true,
      },
      {
        id: 'att-02',
        filename: 'Technical-Requirements.xlsx',
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        sizeBytes: 680000,
        isDownloaded: false,
      },
    ],
    receivedAt: new Date(Date.now() - 25 * 60000).toISOString(),
    direction: 'rtl',
  },
  {
    id: 'msg-002',
    accountId: 'acc-personal-gmail',
    accountEmail: 'tariq.developer@gmail.com',
    accountColor: '#EA4335',
    folderId: 'inbox',
    remoteId: 'gmail-18f92b',
    fromName: 'Sarah Jenkins',
    fromAddress: 'sarah.j@rust-lang-foundation.org',
    toAddresses: ['tariq.developer@gmail.com'],
    subject: 'Rust Tokio & Tauri 2: Async Mail Scheduling Benchmark Discussion',
    snippet: 'Hi Tariq, I reviewed your proposal on bounded connection pooling for high-density mailbox syncing. The token bucket approach looks solid...',
    bodyPlain: `Hi Tariq,

I reviewed your proposal on bounded connection pooling for high-density mailbox syncing with hundreds of IMAP/Graph accounts.

The token bucket approach with jittered backoff is definitely the right path. As you noted, running permanent IDLE sockets for 500+ accounts causes severe socket exhaustion and triggers provider rate limits.

A few recommendations:
1. Cap global concurrent sync tasks to 4 or 6 on Apple Silicon M-series.
2. Cache header envelopes first before fetching MIME message bodies on demand.
3. Make sure to isolate per-account token refreshes so one failed refresh does not stall the worker queue.

Let's do a short sync tomorrow if you have time.

Best regards,
Sarah Jenkins
Rust Systems Engineering`,
    isRead: false,
    isStarred: true,
    hasAttachment: false,
    receivedAt: new Date(Date.now() - 110 * 60000).toISOString(),
    direction: 'ltr',
  },
  {
    id: 'msg-003',
    accountId: 'acc-corp-outlook',
    accountEmail: 'billing@enterprise.onmicrosoft.com',
    accountColor: '#0078D4',
    folderId: 'inbox',
    remoteId: 'ms-graph-88902',
    fromName: 'Microsoft 365 Security Center',
    fromAddress: 'alerts@security.microsoft.com',
    toAddresses: ['billing@enterprise.onmicrosoft.com'],
    subject: '[Warning] Automated sync rate limit applied to Graph mailbox endpoint',
    snippet: 'Your application registered with Client ID 8e2b-40fa exceeded 10,000 requests in 10 minutes. Throttling active for 120 seconds.',
    bodyPlain: `Microsoft 365 Defender Notification

Service: Exchange Online / Microsoft Graph Mail
Tenant ID: enterprise-corp.onmicrosoft.com
Event: Application Request Throttling (HTTP 429)

Details:
The registered client application has exceeded the allowed burst rate of requests for this mailbox. Further requests will receive HTTP 429 responses with a Retry-After header.

Recommended Action:
- Implement exponential backoff and jitter.
- Use delta sync (@odata.deltaLink) to fetch only modified records instead of full folder walks.

Microsoft Cloud Security Team`,
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    receivedAt: new Date(Date.now() - 240 * 60000).toISOString(),
    direction: 'ltr',
  },
  {
    id: 'msg-004',
    accountId: 'acc-support-domain',
    accountEmail: 'support@devops-hub.io',
    accountColor: '#107C41',
    folderId: 'inbox',
    remoteId: 'imap-7731',
    fromName: 'سليمان الحربي',
    fromAddress: 's.harbi@k-systems.sa',
    toAddresses: ['support@devops-hub.io'],
    subject: 'تحديث شهادات الأمان TLS وربط النطاق الخاص بالمشروع',
    snippet: 'مرحبًا فريق الدعم، قمنا بتجديد شهادة Wildcard SSL عبر Let’s Encrypt ونود التأكد من تفعيل منفذ 993 للإيميل المشفر...',
    bodyPlain: `مرحبًا فريق الدعم،

نود إبلاغكم بأنه تم بنجاح تجديد شهادات SSL/TLS الخاصة بالنطاق الرئيسي k-systems.sa ونود التحقق من النقاط التالية:

- توافق شهادة TLS 1.3 مع سيرفر IMAP على المنفذ 993.
- عمل خادم SMTP المشفر عبر المنفذ 465 (SSL) أو 587 (STARTTLS).
- تحديث سجلات SPF وDKIM وDMARC لمنع وصول رسائل النظام إلى مجلد الرسائل المزعجة (Spam).

شاكرين لكم حسن تعاونكم الدائم.

سليمان الحربي
فريق هندسة النظم`,
    isRead: false,
    isStarred: false,
    hasAttachment: false,
    receivedAt: new Date(Date.now() - 380 * 60000).toISOString(),
    direction: 'rtl',
  },
  {
    id: 'msg-005',
    accountId: 'acc-work-sales',
    accountEmail: 'sales@cloudcorp.sa',
    accountColor: '#176BD3',
    folderId: 'inbox',
    remoteId: 'imap-4919',
    fromName: 'نوّاف الشمري',
    fromAddress: 'nawaf@venture-cap.com',
    toAddresses: ['sales@cloudcorp.sa'],
    subject: 'تأكيد موعد اجتماع مناقشة اتفاقية الشراكة السنوية',
    snippet: 'تم حجز قاعة الاجتماعات ليوم الثلاثاء الساعة 11:00 صباحًا بتوقيت الرياض. مرفق جدول الأعمال المبدئي للاطلاع...',
    bodyPlain: `تحية طيبة،

تم تأكيد موعد الاجتماع الافتراضي لمناقشة عقد الشراكة السنوي وتفاصيل الدعم المالي واللوجستي.

الموعد: الثلاثاء القادم 11:00 صباحًا بتوقيت الرياض.
الرابط: https://meet.cloudcorp.sa/partnership-2026

جدول الأعمال مرفق في المستند. نتطلع للقائكم المثمر.

تحياتي،
نوّاف الشمري`,
    isRead: true,
    isStarred: false,
    hasAttachment: true,
    attachments: [
      {
        id: 'att-03',
        filename: 'Agenda_Partnership_2026.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 850000,
        isDownloaded: false,
      },
    ],
    receivedAt: new Date(Date.now() - 1440 * 60000).toISOString(),
    direction: 'rtl',
  },
];

// Generator for synthetic stress-testing (1,000+ messages and 100+ accounts)
export function generateSyntheticMessages(count: number, accounts: Account[]): Message[] {
  const subjectsAr = [
    'تأكيد استلام الطلب والبدء في المعالجة',
    'تحديث هام حول سياسة أمان الحسابات وكلمات المرور',
    'تقرير الأداء الأسبوعي لمشروع البنية التحتية السحابية',
    'فواتير الخدمات الشهرية لشهر أكتوبر 2026',
    'دعوة لحضور ورشة عمل تقنيات Apple Silicon وتطبيقات سطح المكتب',
    'استفسار بخصوص تجديد الاشتراك السنوي',
  ];

  const subjectsEn = [
    'Quarterly security audit review and action items',
    'Deploying Tauri 2 desktop client on macOS Apple Silicon',
    'Invoice notification: Payment processed successfully',
    'Meeting summary: Performance benchmarks for 1000 mailboxes',
    'Scheduled maintenance window for core mail servers',
    'OAuth token refresh cycle confirmation',
  ];

  const sendersAr = [
    { name: 'فهد السديري', email: 'f.sudairi@domain-sa.com' },
    { name: 'هند القحطاني', email: 'hind.q@riyadh-tech.sa' },
    { name: 'خالد المنصور', email: 'khalid@finance-corp.org' },
    { name: 'منى الدوسري', email: 'mona@devops.net' },
  ];

  const sendersEn = [
    { name: 'Alex Morgan', email: 'alex.m@cloud-ops.io' },
    { name: 'Elena Rostova', email: 'elena@systems-dev.org' },
    { name: 'Marcus Chen', email: 'mchen@architecture-team.net' },
    { name: 'Jordan Bell', email: 'jordan@enterprise-mail.com' },
  ];

  const messages: Message[] = [...INITIAL_MESSAGES];

  for (let i = 1; i <= count; i++) {
    const isAr = i % 2 === 0;
    const account = accounts[i % accounts.length];
    const sender = isAr
      ? sendersAr[i % sendersAr.length]
      : sendersEn[i % sendersEn.length];
    const subjectPrefix = isAr
      ? subjectsAr[i % subjectsAr.length]
      : subjectsEn[i % subjectsEn.length];

    const subject = `#${i + 5} — ${subjectPrefix}`;
    const receivedTime = new Date(Date.now() - (i * 12 + 10) * 60000).toISOString();

    messages.push({
      id: `synthetic-msg-${i}`,
      accountId: account.id,
      accountEmail: account.email,
      accountColor: account.color,
      folderId: 'inbox',
      remoteId: `remote-${i}`,
      fromName: sender.name,
      fromAddress: sender.email,
      toAddresses: [account.email],
      subject: subject,
      snippet: isAr
        ? `هذا ملخص تركيبي للرسالة رقم ${i} لاختبار التمرير الافتراضي والأداء العالي...`
        : `Synthetic preview for message ${i} verifying virtualization and high-density performance...`,
      bodyPlain: isAr
        ? `السلام عليكم،\n\nهذا نص تركيبي للرسالة رقم ${i} لاختبار محرك الفهرسة والبحث والتمرير في MailHub.\n\nالتاريخ: ${receivedTime}\nالحساب: ${account.email}`
        : `Hello,\n\nThis is synthetic message #${i} generated to verify MailHub virtual list rendering and search.\n\nDate: ${receivedTime}\nAccount: ${account.email}`,
      isRead: i > 5,
      isStarred: i % 7 === 0,
      hasAttachment: i % 4 === 0,
      receivedAt: receivedTime,
      direction: isAr ? 'rtl' : 'ltr',
    });
  }

  return messages;
}

export function generateSyntheticAccounts(count: number): Account[] {
  const providers: Account['provider'][] = ['imap', 'gmail', 'outlook'];
  const groups = ['العمل (Work)', 'شخصي (Personal)', 'عملاء ومشاريع (Projects)', 'أرشفة (Archive)'];
  const colors = ['#176BD3', '#EA4335', '#0078D4', '#107C41', '#8A2BE2', '#D83B01'];

  const accounts: Account[] = [...INITIAL_ACCOUNTS];

  for (let i = 5; i <= count; i++) {
    const provider = providers[i % providers.length];
    const domain = provider === 'gmail' ? 'gmail.com' : provider === 'outlook' ? 'outlook.com' : `company-${i}.org`;
    const email = `account.${i}@${domain}`;
    const group = groups[i % groups.length];
    const color = colors[i % colors.length];

    accounts.push({
      id: `acc-synthetic-${i}`,
      email,
      displayName: `Account ${i} (${provider.toUpperCase()})`,
      provider,
      groupName: group,
      status: i % 15 === 0 ? 'rate_limited' : i % 25 === 0 ? 'auth_required' : 'ready',
      unreadCount: (i * 3) % 11,
      totalCount: 30 + (i * 7) % 150,
      lastSyncAt: new Date(Date.now() - (i * 4) * 60000).toISOString(),
      syncIntervalMinutes: 5,
      color,
    });
  }

  return accounts;
}
