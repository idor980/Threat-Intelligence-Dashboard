import { Globe, Activity } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import type { ThreatIntelligenceData } from '@shared/types';
import { getRiskLevel } from '@/utils/riskLevel';

type ThreatDataDisplayProps = {
  data: ThreatIntelligenceData;
};

export const ThreatDataDisplay = ({ data }: ThreatDataDisplayProps) => {
  const riskLevel = getRiskLevel(data.abuseScore);

  return (
    <div className="space-y-4">
      {/* Risk Overview */}
      <div
        className={twMerge(
          'border-2 rounded-lg p-6',
          riskLevel.bgColor,
          riskLevel.color.replace('text', 'border')
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900">{data.ipAddress}</h3>
            <p className="text-gray-600 mt-1">{data.hostname || 'No hostname available'}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className={twMerge('text-4xl font-bold', riskLevel.color)}>{data.abuseScore}%</div>
            <div className={twMerge('text-sm font-semibold mt-1', riskLevel.color)}>
              {riskLevel.text}
            </div>
          </div>
        </div>
      </div>

      {/* Details Section - Using Flexbox */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Location & ISP */}
        <div className="flex-1 border border-gray-200 rounded-lg p-5 bg-white">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <Globe className="w-5 h-5 text-blue-600" />
            Location & ISP
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Country:</span>
              <span className="font-semibold text-gray-900">{data.country}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">ISP:</span>
              <span className="font-semibold text-gray-900">{data.isp}</span>
            </div>
          </div>
        </div>

        {/* Threat Indicators */}
        <div className="flex-1 border border-gray-200 rounded-lg p-5 bg-white">
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
            <Activity className="w-5 h-5 text-orange-600" />
            Threat Indicators
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recent Reports:</span>
              <span className="font-semibold text-gray-900">{data.recentReports}</span>
            </div>
            {data.vpnDetected !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">VPN Detected:</span>
                <span
                  className={twMerge(
                    'font-semibold',
                    data.vpnDetected ? 'text-orange-600' : 'text-green-600'
                  )}
                >
                  {data.vpnDetected ? 'Yes' : 'No'}
                </span>
              </div>
            )}
            {data.threatScore !== undefined && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Threat Score:</span>
                <span className="font-semibold text-gray-900">{data.threatScore}%</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
