import ComplaintsList from '../complaints/ComplaintsList';

export default function ExtraJobsList() {
    return (
        <ComplaintsList 
            title="Gestión de Trabajos Extra" 
            allowedTypes={['extra']} 
            hideTypeFilter={true} 
        />
    );
}