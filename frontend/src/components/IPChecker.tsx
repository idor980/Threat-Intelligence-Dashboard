import { useState } from 'react';
import { Card, Button, TextInput, Label, Spinner, Alert } from 'flowbite-react';
import { Shield, Search, AlertTriangle, Globe, Activity } from 'lucide-react';
import { useIPCheckStore } from '@/store/ipCheckStore';

export const IPChecker = () => {
  const [ipInput, setIpInput] = useState('');
  const { data, loading, error, checkIP } = useIPCheckStore();

  const handleCheck = () => {
    const trimmedIP = ipInput.trim();
    if (trimmedIP) {
      // Backend validates the IP address - no need for frontend validation
      checkIP(trimmedIP);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleCheck();
    }
  };

  const getRiskLevel = (abuseScore: number): { text: string; color: string; bgColor: string } => {
    if (abuseScore >= 75) return { text: 'High Risk', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (abuseScore >= 50)
      return { text: 'Medium Risk', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    if (abuseScore >= 25)
      return { text: 'Low Risk', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    return { text: 'Minimal Risk', color: 'text-green-600', bgColor: 'bg-green-50' };
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-20 h-20 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Threat Intelligence Dashboard</h1>
          <p className="text-gray-600">
            Check IP addresses for threat intelligence and abuse reports
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <div className="space-y-6">
            {/* Input Section */}
            <div>
              <Label htmlFor="ip-input" className="mb-2 block text-gray-700 font-medium">
                IP Address
              </Label>
              <div className="flex gap-3">
                <TextInput
                  id="ip-input"
                  type="text"
                  placeholder="Enter IP address (e.g., 8.8.8.8)"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  className="flex-1"
                  sizing="lg"
                  color="gray"
                />
                <Button
                  onClick={handleCheck}
                  disabled={loading || !ipInput.trim()}
                  size="lg"
                  color="blue"
                >
                  {loading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Check
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <Alert color="failure" icon={AlertTriangle} className="text-red-500">
                <span className="font-medium">Error:</span> {error}
              </Alert>
            )}

            {/* Results Section */}
            {data && (
              <div className="space-y-4">
                {/* Risk Overview */}
                <div
                  className={`${getRiskLevel(data.abuseScore).bgColor} border-2 ${getRiskLevel(data.abuseScore).color.replace('text', 'border')} rounded-lg p-6`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900">{data.ipAddress}</h3>
                      <p className="text-gray-600 mt-1">
                        {data.hostname || 'No hostname available'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`text-4xl font-bold ${getRiskLevel(data.abuseScore).color}`}>
                        {data.abuseScore}%
                      </div>
                      <div
                        className={`text-sm font-semibold mt-1 ${getRiskLevel(data.abuseScore).color}`}
                      >
                        {getRiskLevel(data.abuseScore).text}
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
                            className={`font-semibold ${data.vpnDetected ? 'text-orange-600' : 'text-green-600'}`}
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
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
