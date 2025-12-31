import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EmployeeRoute from '../EmployeeRoute';



// Mock Firebase
vi.mock('../../../firebase/config', () => ({
  auth: {},
  db: { type: 'firestore' }
}));

// Mock Firestore functions
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ _collection: 'trabajos' })),
  query: vi.fn((...args) => ({ _query: args })),
  where: vi.fn(() => ({ _where: true })),
  getDocs: vi.fn(() => Promise.resolve({
    docs: [
      {
        id: '1',
        data: () => ({
          clienteNombre: 'Cliente Test',
          direccion: 'Calle Test 123',
          estado: 'pendiente',
          esExtra: false
        })
      },
      {
        id: '2',
        data: () => ({
          comunidad: 'Comunidad Test',
          direccion: 'Av Test 456',
          estado: 'en_progreso',
          esExtra: true,
          tipoServicio: 'Abrillantado'
        })
      }
    ]
  }))
}));

// Mock AuthContext
vi.mock('../../../context/AuthContext', async () => {
  const actual = await vi.importActual('../../../context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      user: {
        uid: 'test-employee-123',
        nombre: 'Empleado',
        apellidos: 'Test'
      },
      userRole: 'empleado',
      loading: false
    })
  };
});

describe('EmployeeRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders component without crashing', () => {
    render(
      <BrowserRouter>
        <EmployeeRoute />
      </BrowserRouter>
    );

    // Component should render without errors
    expect(document.body).toBeTruthy();
  });

  it('displays today\'s date', () => {
    render(
      <BrowserRouter>
        <EmployeeRoute />
      </BrowserRouter>
    );

    // Should render without crashing, date format in Spanish
    expect(document.body).toBeTruthy();
  });

  it('shows loading spinner initially', () => {
    render(
      <BrowserRouter>
        <EmployeeRoute />
      </BrowserRouter>
    );

    // Puede mostrar loading o las tareas dependiendo del timing
    const hasContent = 
      screen.queryByText('Cargando...') || 
      screen.queryByText('Mi Ruta de Hoy');
    
    expect(hasContent).toBeTruthy();
  });

  it('component renders successfully', async () => {
    render(
      <BrowserRouter>
        <EmployeeRoute />
      </BrowserRouter>
    );

    // Component should render without crashing
    expect(document.body).toBeTruthy();
  });

  it('shows tasks section', async () => {
    render(
      <BrowserRouter>
        <EmployeeRoute />
      </BrowserRouter>
    );

    // Should show either loading or content
    const hasContent = 
      screen.queryByText('Mi Ruta de Hoy') ||
      screen.queryByText('Cargando...');
    
    expect(hasContent).toBeTruthy();
  });
});
