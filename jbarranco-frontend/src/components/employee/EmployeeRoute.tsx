import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRightIcon, PlusCircleIcon } from '@heroicons/react/20/solid';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

interface Task {
    id: string;
    estado: string;
    clienteNombre?: string;
    comunidad?: string;
    direccion?: string;
    esExtra?: boolean;
    tipoServicio?: string;
}

function EmployeeRoute() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            if (!user) return;

            try {
                // Usar firestoreId si existe (caso fallback), sino uid
                const userId = user.firestoreId || user.uid;

                // Buscar trabajos asignados al empleado
                const q = query(
                    collection(db, 'trabajos'),
                    where('empleadoId', '==', userId),
                    where('estado', 'in', ['pendiente', 'en_progreso'])
                );

                const querySnapshot = await getDocs(q);
                const tasksData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        estado: data.estado || 'pendiente',
                        clienteNombre: data.clienteNombre,
                        comunidad: data.comunidad,
                        direccion: data.direccion,
                        esExtra: data.esExtra,
                        tipoServicio: data.tipoServicio
                    } as Task;
                });

                setTasks(tasksData);
            } catch (err) {
                console.error('Error al cargar la ruta:', err);
                setError('No se pudieron cargar las tareas.');
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [user]);

    if (loading) return <LoadingSpinner />;

    if (error) return (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
            {error}
        </div>
    );

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900">Mi Ruta de Hoy</h2>
            <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>

            <div className="mt-6 space-y-4">
                {tasks.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-lg shadow">
                        <p className="text-gray-500">No tienes tareas asignadas para hoy.</p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <button
                            key={task.id}
                            onClick={() => navigate(`/employee/tasks/${task.id}`)}
                            className={`w-full bg-white p-4 rounded-lg shadow text-left flex items-center justify-between transition-transform hover:scale-[1.02] ${task.estado === 'completado' ? 'opacity-60' : ''
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-3 h-3 rounded-full ${task.estado === 'completado' ? 'bg-brand-green' : 'bg-gray-300'}`}></div>
                                <div>
                                    <p className="font-medium text-gray-900">{task.clienteNombre || task.comunidad || 'Cliente sin nombre'}</p>
                                    <p className="text-sm text-gray-500">{task.direccion || 'Sin dirección'}</p>
                                    {task.esExtra && (
                                        <p className="text-xs text-brand-orange font-medium mt-1">
                                            <PlusCircleIcon className="h-4 w-4 inline mr-1" />
                                            Servicio Extra: {task.tipoServicio}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}

export default EmployeeRoute;