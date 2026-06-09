import { Loader2 } from 'lucide-react';
import { useApiStore } from '../../stores/apiStore';
import { getColdStartMessage } from '../../services/httpClient';

export default function ServerWakeBanner() {
  const wakingUp = useApiStore((s) => s.wakingUp);
  const wakeAttempt = useApiStore((s) => s.wakeAttempt);

  if (!wakingUp) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[100] bg-amber-50 border-b border-amber-200 px-4 py-3 shadow-sm"
    >
      <div className="max-w-6xl mx-auto flex items-center gap-3 text-sm text-amber-900">
        <Loader2 className="w-4 h-4 shrink-0 animate-spin" aria-hidden="true" />
        <div>
          <p className="font-medium">Conectando ao servidor…</p>
          <p className="text-amber-800">
            {getColdStartMessage()}
            {wakeAttempt > 0 && ` Tentativa ${wakeAttempt} de 3.`}
          </p>
        </div>
      </div>
    </div>
  );
}
