import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SellProduct from './SellProduct';

// Mock contract object
const mockContract = {
  methods: {
    sellProduct: jest.fn().mockImplementation(() => ({
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

describe('SellProduct', () => {
  it('renders without crashing', () => {
    render(<SellProduct contract={mockContract} />);
    expect(screen.getByText('Sell Product')).toBeInTheDocument();
  });

  it('sells product', async () => {
    render(<SellProduct contract={mockContract} />);
    
    userEvent.type(screen.getByPlaceholderText('Enter product index'), '0');
    userEvent.type(screen.getByPlaceholderText('Enter quantity'), '10');
    userEvent.click(screen.getByText('Sell Product'));

    await waitFor(() => {
      expect(screen.getByText(`Sold "10" units of product at index "0" successfully!`)).toBeInTheDocument();
    });
  });

  it('handles error when selling product', async () => {
    const errorMessage = 'Error selling product: CALL_EXCEPTION';
    mockContract.methods.sellProduct.mockImplementationOnce(() => ({
      send: jest.fn().mockRejectedValue({ code: 'CALL_EXCEPTION', message: errorMessage }),
    }));

    render(<SellProduct contract={mockContract} />);
    
    userEvent.type(screen.getByPlaceholderText('Enter product index'), '0');
    userEvent.type(screen.getByPlaceholderText('Enter quantity'), '10');
    userEvent.click(screen.getByText('Sell Product'));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
