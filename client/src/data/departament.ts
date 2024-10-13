import axios from "axios";
import { Departament } from "../types/departament";

export const fetchDepartments = async () => {
  try {
    const response = await axios.get(
      "https://api-colombia.com/api/v1/Department"
    );
    const departments = response.data.map((department: Departament) => ({
      id: department.id,
      name: department.name,
      description: department.description,
    }));

    return departments;
  } catch (error) {
    console.error("Error al obtener los departamentos:", error);
    return [];
  }
};
