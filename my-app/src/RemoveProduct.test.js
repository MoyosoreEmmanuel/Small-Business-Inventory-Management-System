import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RemoveProduct from './RemoveProduct';

// Mock contract object
const mockContract = {
  methods: {
    removeProduct: jest.fn().mockImplementation(() => ({
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

describe('RemoveProduct', () => {
  it('renders without crashing', () => {
    render(<RemoveProduct contract={mockContract} />);
    expect(screen.getByText('Remove Product')).toBeInTheDocument();
  });

  it('removes product', async () => {
    render(<RemoveProduct contract={mockContract} />);
    
    userEvent.type(screen.getByPlaceholderText('Enter product index'), '0');
    userEvent.click(screen.getByText('Remove Product'));

    await waitFor(() => {
      expect(screen.getByText(`Product at index "0" removed successfully!`)).toBeInTheDocument();
    });
  });

  it('handles error when removing product', async () => {
    const errorMessage = 'Error removing product: CALL_EXCEPTION';
    mockContract.methods.removeProduct.mockImplementationOnce(() => ({
      send: jest.fn().mockRejectedValue({ code: 'CALL_EXCEPTION', message: errorMessage }),
    }));

    render(<RemoveProduct contract={mockContract} />);
    
    userEvent.type(screen.getByPlaceholderText('Enter product index'), '0');
    userEvent.click(screen.getByText('Remove Product'));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
