import { Button, DatePicker, Select, SelectItem } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { fetchDepartments } from "../data/departament";
import { City, Departament } from "../types/departament";
import { fetchCities } from "../data/city";
import { handleSubmit } from "../utils/validator";
import CustomInput from "../atoms/CustomInput";
import { genders } from "../data/genders";
import { parseDate } from "@internationalized/date";
import { Student } from "../types/data";

interface Props {
  dataStudent: Student | undefined;
  setReFetch: React.Dispatch<React.SetStateAction<boolean>>;
  setDataStudent: React.Dispatch<React.SetStateAction<Student | undefined>>;
}

export const FormStudent = ({
  dataStudent,
  setReFetch,
  setDataStudent,
}: Props) => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const [data, setData] = useState<Student>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
    birth_date: parseDate(todayString),
    gender: "",
    nationality: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [departments, setDepartments] = useState<Departament[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataStudent) {
      setData({
        ...dataStudent,
        birth_date: parseDate(String(dataStudent.birth_date)),
      });
    }
  }, [dataStudent]);

  useEffect(() => {
    const getDepartments = async () => {
      const departmentsData = await fetchDepartments();
      setDepartments(departmentsData);
    };

    getDepartments();
  }, []);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setData({ ...data, [e.target.name]: e.target.value });

  const handleDepartmentChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const departmentName = e.target.value;
    const citiesData = await fetchCities(
      departments.find((d) => d.name === departmentName)?.id || 0
    );
    setCities(citiesData);
    setData({
      ...data,
      state: departmentName,
      city: "",
    });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setData({ ...data, city: cityName });
  };

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      onSubmit={(e) =>
        handleSubmit(
          e,
          setErrors,
          setData,
          setLoading,
          todayString,
          dataStudent,
          setReFetch,
          setDataStudent
        )
      }
    >
      <CustomInput
        type="text"
        name="first_name"
        label="Primer Nombre"
        value={data.first_name}
        onChange={onChange}
        isInvalid={Boolean(errors.first_name)}
        errorMessage={errors.first_name}
      />
      <CustomInput
        type="text"
        name="last_name"
        label="Segundo Nombre"
        value={data.last_name}
        onChange={onChange}
        isInvalid={Boolean(errors.last_name)}
        errorMessage={errors.last_name}
      />
      <CustomInput
        type="email"
        name="email"
        label="Email"
        value={data.email}
        onChange={onChange}
        isInvalid={Boolean(errors.email)}
        errorMessage={errors.email}
      />
      <CustomInput
        type="text"
        name="phone"
        label="Telefono"
        value={data.phone}
        onChange={onChange}
        isInvalid={Boolean(errors.phone)}
        errorMessage={errors.phone}
      />
      <CustomInput
        type="text"
        name="address"
        label="Dirección"
        value={data.address}
        onChange={onChange}
        isInvalid={Boolean(errors.address)}
        errorMessage={errors.address}
      />
      <Select
        label="Departamento"
        className="w-full"
        onChange={handleDepartmentChange}
        errorMessage={errors.state}
        value={data.state}
        variant="flat"
        radius="sm"
        name="state"
      >
        {departments.map((department) => (
          <SelectItem key={department.name} value={department.name}>
            {department.name}
          </SelectItem>
        ))}
      </Select>
      <Select
        label="Ciudad"
        className="w-full"
        onChange={handleCityChange}
        value={data.city}
        errorMessage={errors.city}
        isInvalid={Boolean(errors.city)}
        disabled={!data.state}
        variant="flat"
        radius="sm"
        name="city"
      >
        {cities.map((city) => (
          <SelectItem key={city.name} value={city.name}>
            {city.name}
          </SelectItem>
        ))}
      </Select>
      <CustomInput
        type="text"
        name="postal_code"
        label="Codigo Postal"
        value={data.postal_code}
        onChange={onChange}
        isInvalid={Boolean(errors.postal_code)}
        errorMessage={errors.postal_code}
      />
      <DatePicker
        name="birth_date"
        label="Fecha de Nacimiento"
        value={data.birth_date}
        onChange={(newDate) => setData({ ...data, birth_date: newDate })}
        isInvalid={Boolean(errors.birth_date)}
        errorMessage={errors.birth_date}
        variant="flat"
      />
      <Select
        label="Genero"
        className="w-full"
        onChange={onChange}
        value={data.gender}
        errorMessage={errors.gender}
        isInvalid={Boolean(errors.gender)}
        variant="flat"
        radius="sm"
        name="gender"
      >
        {genders.map((g) => (
          <SelectItem key={g} value={g}>
            {g}
          </SelectItem>
        ))}
      </Select>
      <CustomInput
        type="text"
        name="nationality"
        label="Nacionalidad"
        value={data.nationality}
        onChange={onChange}
        isInvalid={Boolean(errors.nationality)}
        errorMessage={errors.nationality}
      />
      <div className="w-full md:col-span-2 flex justify-end">
        <Button
          type="submit"
          color="success"
          size="lg"
          className="text-white font-bold"
          isLoading={loading}
        >
          {dataStudent ? "Actualizar" : "Registrar"}
        </Button>
      </div>
    </form>
  );
};
