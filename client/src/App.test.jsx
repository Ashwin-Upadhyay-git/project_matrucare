import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';

describe('App', () => {
  it('renders the home page hero content', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByText(/AI Hackathon for Social Impact/i)).toBeInTheDocument();
    expect(screen.getByText(/Register Now/i)).toBeInTheDocument();
  });
});
