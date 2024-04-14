import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChangeProductPrice from './ChangeProductPrice';

// Mock contract object
const mockContract = {
  methods: {
    changeProductPrice: jest.fn().mockImplementation(() => ({
      send: jest.fn().mockResolvedValue(true),
    })),
  },
};

// Mock window.ethereum object
global.window.ethereum = {
  request: jest.fn().mockResolvedValue(['0x123']),
  on: jest.fn(),
  removeListener: jest.fn(),
};

describe('ChangeProductPrice', () => {
  it('renders without crashing', () => {
    render(<ChangeProductPrice contract={mockContract} />);
    expect(screen.getByText('Change Product Price')).toBeInTheDocument();
  });

  it('changes product price', async () => {
    render(<ChangeProductPrice contract={mockContract} />);
    
    userEvent.type(screen.getByPlaceholderText('Enter product index'), '0');
    userEvent.type(screen.getByPlaceholderText('Enter new price'), '100');
    userEvent.click(screen.getByText('Change Price'));

    await waitFor(() => {
      expect(screen.getByText(`Price for product at index "0" changed successfully!`)).toBeInTheDocument();
    });
  });

  it('handles error when changing product price', async () => {
    const errorMessage = 'Error changing product price: CALL_EXCEPTION';
    mockContract.methods.changeProductPrice.mockImplementationOnce(() => ({
      send: jest.fn().mockRejectedValue({ code: 'CALL_EXCEPTION', message: errorMessage }),
    }));

    render(<ChangeProductPrice contract={mockContract} />);
    
    userEvent.type(screen.getByPlaceholderText('Enter product index'), '0');
    userEvent.type(screen.getByPlaceholderText('Enter new price'), '100');
    userEvent.click(screen.getByText('Change Price'));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
