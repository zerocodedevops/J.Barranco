import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
    it('renders with default message', () => {
        render(<LoadingSpinner />);
        expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
        render(<LoadingSpinner message="Procesando datos..." />);
        expect(screen.getByText('Procesando datos...')).toBeInTheDocument();
    });

    it('applies correct size class for small spinner', () => {
        const { container } = render(<LoadingSpinner size="sm" />);
        const spinnerDiv = container.firstChild;
        expect(spinnerDiv).toHaveClass('h-32');
    });

    it('applies correct size class for medium spinner', () => {
        const { container } = render(<LoadingSpinner size="md" />);
        const spinnerDiv = container.firstChild;
        expect(spinnerDiv).toHaveClass('h-64');
    });

    it('applies correct size class for large spinner', () => {
        const { container } = render(<LoadingSpinner size="lg" />);
        const spinnerDiv = container.firstChild;
        expect(spinnerDiv).toHaveClass('h-96');
    });

    it('defaults to full screen height when no size provided', () => {
        const { container } = render(<LoadingSpinner />);
        const spinnerDiv = container.firstChild;
        expect(spinnerDiv).toHaveClass('h-screen');
    });

    it('has animated pulse effect', () => {
        render(<LoadingSpinner />);
        const messageElement = screen.getByText('Cargando...');
        expect(messageElement).toHaveClass('animate-pulse');
    });

    it('has brand blue text color', () => {
        render(<LoadingSpinner />);
        const messageElement = screen.getByText('Cargando...');
        expect(messageElement).toHaveClass('text-brand-blue');
    });
});
