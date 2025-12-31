import ComplaintsList from '../complaints/ComplaintsList';

export default function ObservationsList() {
    return (
        <ComplaintsList 
            title="Historial de Observaciones" 
            allowedTypes={['observacion']} 
            hideTypeFilter={true} 
        />
    );
}