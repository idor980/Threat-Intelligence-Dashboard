import { useState } from 'react';
import { Card, Button, TextInput, Label } from 'flowbite-react';
import { Search } from 'lucide-react';
import { useIPCheckStore } from '@/store/ip-check-store';
import { ErrorAlert } from '@/components/error-display';
import { ThreatDataDisplay } from '@/components/threat-data';
import { Header } from '@/components/page-header';
import { SearchHistory } from '@/components/history';

export const IPChecker = () => {
  const [ipAddress, setIpAddress] = useState('');
  const { data, loading, error, checkIP, setError, clearError } = useIPCheckStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedIP = ipAddress.trim();

    if (!trimmedIP) {
      setError('Please enter an IP address');
      return;
    }

    checkIP(trimmedIP);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIpAddress(e.target.value);
    // Clear error when user starts typing
    if (error) clearError();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <Header />

        {/* Main Card */}
        <Card className="shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={ipAddress}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="flex-1"
                  sizing="lg"
                  color="gray"
                />
                {loading ? (
                  <div className="flex items-center justify-center px-8">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <Button
                    type="submit"
                    size="lg"
                    className="px-4 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    <span>Check</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Error State */}
            {error && <ErrorAlert message={error} />}

            {/* Results Section */}
            {data && <ThreatDataDisplay data={data} />}
          </form>
        </Card>

        {/* Search History */}
        <SearchHistory />
      </div>
    </div>
  );
};
