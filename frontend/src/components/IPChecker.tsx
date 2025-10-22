import { useState } from 'react';
import { Card, Button, TextInput, Label } from 'flowbite-react';
import { Search } from 'lucide-react';
import { useIPCheckStore } from '@/store/ipCheckStore';
import { ErrorAlert } from '@/components/ErrorAlert';
import { ThreatDataDisplay } from '@/components/ThreatDataDisplay';
import { Header } from '@/components/Header';
import { SearchHistory } from '@/components/SearchHistory';

export const IPChecker = () => {
  const [ipInput, setIpInput] = useState('');
  const { data, loading, error, checkIP, setError, clearError } = useIPCheckStore();

  const handleCheck = () => {
    const trimmedIP = ipInput.trim();
    if (!trimmedIP) {
      setError('Please enter an IP address');
      return;
    }
    clearError();
    checkIP(trimmedIP);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIpInput(e.target.value);
    // Clear errors when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleCheck();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <Header />

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
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
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
                    onClick={handleCheck}
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
          </div>
        </Card>

        {/* Search History */}
        <SearchHistory />
      </div>
    </div>
  );
};
