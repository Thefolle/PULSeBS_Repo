import { render, screen } from '@testing-library/react';
import request from 'supertest';
import '@babel/polyfill';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
