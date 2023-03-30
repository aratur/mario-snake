import React from 'react';
import { render, screen } from '@testing-library/react';
import Points from './Points';

import TestStoreProvider from '../../tests';

describe('Points', () => {
  it('renders the coin image', () => {
    render(
      <TestStoreProvider>
        <Points />
      </TestStoreProvider>
    );
    const coinImage = screen.getByAltText('No of points');
    expect(coinImage).toBeInTheDocument();
  });

  it('renders the X symbol', () => {
    render(
      <TestStoreProvider>
        <Points />
      </TestStoreProvider>
    );
    const xSymbol = screen.getByText('X');
    expect(xSymbol).toBeInTheDocument();
  });

  it('renders the correct number of digits', () => {
    const mockPoints = { points: 123 };
    render(
      <TestStoreProvider stateOverride={mockPoints}>
        <Points />
      </TestStoreProvider>
    );
    const digits = screen.getAllByAltText(/[0-9]{1}/i);
    expect(digits).toHaveLength(4);
  });

  it('renders the correct digits', () => {
    const mockPoints = { points: 123 };
    render(
      <TestStoreProvider stateOverride={mockPoints}>
        <Points />
      </TestStoreProvider>
    );
    const digits = screen
      .getAllByAltText(/[0-9]{1}/)
      .map((digit) => digit.getAttribute('src')?.split('/').pop());
    expect(digits).toEqual(['0.svg', '1.png', '2.png', '3.png']);
  });
});
