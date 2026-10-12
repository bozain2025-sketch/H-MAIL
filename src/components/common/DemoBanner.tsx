import React from 'react';
import { useMailStore } from '../../store/mailStore';
import { X } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { isDemoMode, settings, openAccountManager, loadStressTestData } = useMailStore();
  const [dismissed, setDismissed] = React.useState(false);

  if (!isDemoMode || dismissed) return null;

  const isRtl = settings.language === 'ar';

  return (
    <aside
      aria-label={isRtl ? 'تنبيه وضع البيانات التجريبية' : 'Synthetic demo mode banner'}
      className="bg-ui-accent-soft/80 border-b border-ui-accent/20 px-3 py-1.5 flex items-center justify-between text-xs text-ui-fg select-none z-20"
    >
      <div className="flex items-center gap-2 truncate">
        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-ui-accent text-ui-fg-on-accent font-mono">
          Demo Fixture
        </span>
        <span className="truncate text-[11.5px] text-ui-fg">
          {isRtl
            ? 'تطبيق MailHub يعمل حاليًا بالبيانات التركيبية الآمنة لتقييم الواجهة والمزامنة. يمكنك ربط الحسابات الحقيقية عبر معالج الإضافة.'
            : 'MailHub is running with synthetic demo fixtures. Real accounts can be connected in the Account Manager.'}
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => loadStressTestData(100, 1000)}
          className="text-[11px] font-semibold text-ui-accent hover:underline hidden sm:inline"
        >
          {isRtl ? 'اختبار 1000 رسالة' : 'Simulate 1,000 msgs'}
        </button>

        <button
          onClick={openAccountManager}
          className="text-[11px] font-semibold text-ui-accent hover:underline"
        >
          {isRtl ? 'إدارة الحسابات' : 'Manage Accounts'}
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="p-0.5 text-ui-fg-muted hover:text-ui-fg rounded"
          title={isRtl ? 'إخفاء التنبيه' : 'Dismiss'}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
