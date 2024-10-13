import axios from "axios";
import { City } from "../types/departament";

export const fetchCities = async (id: number) => {
  try {
    const response = await axios.get(
      `https://api-colombia.com/api/v1/Department/${id}/cities`
    );
    const cities = response.data.map((city: City) => ({
      id: city.id,
      name: city.name,
    }));

    return cities;
  } catch (error) {
    console.error("Error al obtener las ciudades:", error);
    return [];
  }
};
