import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { IPChecker } from './ip-check';
import { useIPCheckStore } from '@/store/ip-check-store';

describe('IPChecker Component', () => {
  beforeEach(() => {
    // Reset store state before each test
    useIPCheckStore.setState({
      data: null,
      loading: false,
      error: null,
      history: [],
    });
  });

  it('should render input field and check button', () => {
    render(<IPChecker />);

    expect(screen.getByPlaceholderText(/enter ip address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check/i })).toBeInTheDocument();
  });

//   it('should display error message when error exists', () => {
//     useIPCheckStore.setState({ error: 'Invalid IP address' });
//     render(<IPChecker />);

//     expect(screen.getByText('Invalid IP address')).toBeInTheDocument();
//   });

//   it('should disable input while loading', () => {
//     useIPCheckStore.setState({ loading: true });
//     render(<IPChecker />);

//     const input = screen.getByPlaceholderText(/enter ip address/i);
//     expect(input).toBeDisabled();
//   });

//   it('should display threat data when available', () => {
//     useIPCheckStore.setState({
//       data: {
//         ipAddress: '8.8.8.8',
//         hostname: 'dns.google',
//         isp: 'Google LLC',
//         country: 'United States',
//         abuseScore: 0,
//         recentReports: 0,
//         vpnDetected: false,
//         threatScore: 0,
//       },
//     });

//     render(<IPChecker />);

//     expect(screen.getByText('8.8.8.8')).toBeInTheDocument();
//     expect(screen.getByText('United States')).toBeInTheDocument();
//     expect(screen.getByText('Google LLC')).toBeInTheDocument();
//   });
});

