import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "../../../firebase/config";
import DocumentGenerator from "./DocumentGenerator";
import DocumentUploader from "./DocumentUploader";

import { Cliente, Empleado } from "../../../types";

function Documents() {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [employees, setEmployees] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsSnap, employeesSnap] = await Promise.all([
          getDocs(collection(db, "clientes")),
          getDocs(collection(db, "empleados")),
        ]);

        const clientsData = clientsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Cliente));

        const employeesData = employeesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Empleado));

        setClients(clientsData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error al cargar datos");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <DocumentGenerator
        clients={clients}
        employees={employees}
        loading={loading}
      />
      <DocumentUploader clients={clients} />
    </div>
  );
}

export default Documents;
