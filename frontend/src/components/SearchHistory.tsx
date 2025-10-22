import { Card, Button } from 'flowbite-react';
import { Clock, Trash2 } from 'lucide-react';
import { useIPCheckStore } from '@/store/ipCheckStore';
import { getRiskLevel } from '@/utils/riskLevel';

export const SearchHistory = () => {
  const { history, loadFromHistory, clearHistory } = useIPCheckStore();

  if (history.length === 0) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return date.toLocaleDateString();
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
          const risk = getRiskLevel(item.data.abuseScore);
          const { abuseScore } = item.data;
          const badgeColor =
            abuseScore >= 75
              ? 'bg-red-100 text-red-700'
              : abuseScore >= 50
                ? 'bg-orange-100 text-orange-700'
                : abuseScore >= 25
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-green-100 text-green-700';

          return (
            <button
              key={item.id}
              onClick={() => loadFromHistory(item)}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-gray-900">
                      {item.ipAddress}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${badgeColor}`}>
                      {risk.text}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.data.country} • {item.data.isp}
                  </div>
                </div>
                <div className="text-xs text-gray-400 ml-2">
                  {formatDate(item.timestamp)}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};

