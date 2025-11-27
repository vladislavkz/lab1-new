import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test } from 'vitest';
import Counter from './Counter';

test('renders initial count', () => {
  render(<Counter />);
  const countElement = screen.getByText(/count is 0/i);
  expect(countElement).toBeInTheDocument();
});

test('increments count when button is clicked', () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: /count is 0/i });
  
  fireEvent.click(button);
  expect(screen.getByText(/count is 1/i)).toBeInTheDocument();
  
  fireEvent.click(button);
  expect(screen.getByText(/count is 2/i)).toBeInTheDocument();
});

test('renders component description', () => {
  render(<Counter />);
  const descriptionElement = screen.getByText(/Counter component is working!/i);
  expect(descriptionElement).toBeInTheDocument();
});