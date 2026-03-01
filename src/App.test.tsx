import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Add a more specific assertion based on your App content
    // For example, if your App has a specific heading:
    // expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(document.body).toBeDefined();
  });
});
