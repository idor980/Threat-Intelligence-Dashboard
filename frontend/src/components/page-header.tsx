import { Shield } from 'lucide-react';

export const Header = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center mb-4">
        <Shield className="w-24 h-24 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Threat Intelligence Dashboard</h1>
      <p className="text-gray-600">Check IP addresses for threat intelligence and abuse reports</p>
    </div>
  );
};
