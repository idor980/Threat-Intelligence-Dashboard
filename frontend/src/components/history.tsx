import { Card, Button } from 'flowbite-react';
import { Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { useIPCheckStore } from '@/store/ip-check-store';
import { getRiskLevel } from '@/utils/risk-level';

export const SearchHistory = () => {
  const { history, loadFromHistory, clearHistory } = useIPCheckStore();

  if (history.length === 0) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const hoursDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    // If less than 24 hours, show relative time
    if (hoursDiff < 24) {
      return formatDistanceToNow(date, { addSuffix: true });
    }

    // Otherwise show formatted date
    return format(date, 'MMM d, yyyy');
  };

  return (
    <Card className="shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Recent Searches</h3>
        </div>
        <Button
          size="sm"
          color="gray"
          onClick={clearHistory}
          className="text-gray-600 hover:text-red-600"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="space-y-2">
        {history.map((item) => {
          const risk = getRiskLevel(item.data.abuseScore, item.data.threatScore);

          return (
            <button
              key={item.ipAddress}
              onClick={() => loadFromHistory(item)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-gray-900">{item.ipAddress}</span>
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${risk.bgColor} ${risk.color}`}
                    >
                      {risk.text}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.data.country} • {item.data.isp}
                  </div>
                </div>
                <div className="text-xs text-gray-400 ml-2">{formatDate(item.timestamp)}</div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};
