import { Button, DatePicker, Select, SelectItem } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { fetchDepartments } from "../data/departament";
import { City, Departament } from "../types/departament";
import { fetchCities } from "../data/city";
import { handleTeacherSubmit } from "../utils/validator";
import CustomInput from "../atoms/CustomInput";
import { genders } from "../data/genders";
import { parseDate } from "@internationalized/date";
import { Teacher } from "../types/data";
import { api } from "../api/api";

interface Props {
  dataTeacher: Teacher | undefined;
  setReFetch: React.Dispatch<React.SetStateAction<boolean>>;
  setDataTeacher: React.Dispatch<React.SetStateAction<Teacher | undefined>>;
}

export const FormTeacher = ({
  dataTeacher,
  setReFetch,
  setDataTeacher,
}: Props) => {
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];
  const [data, setData] = useState<Teacher>({
    identificacion: "",
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
  const [foundTeacher, setFoundTeacher] = useState<Teacher | null>(null);

  useEffect(() => {
    if (dataTeacher) {
      setData({
        ...dataTeacher,
        birth_date: parseDate(String(dataTeacher.birth_date)),
      });
    }
  }, [dataTeacher]);

  useEffect(() => {
    if (foundTeacher) {
      setData({
        ...foundTeacher,
        birth_date: parseDate(String(foundTeacher.birth_date)),
      });
    }
  }, [foundTeacher]);

  useEffect(() => {
    const getDepartments = async () => {
      const departmentsData = await fetchDepartments();
      setDepartments(departmentsData);
    };

    getDepartments();
  }, []);

  const handleChangeTeacher = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (e.target.value !== "") {
      const fetchTeacher = await api.get(`/teachers/${e.target.value}`);
      console.log("fetchTeacher", fetchTeacher.data);
      if (fetchTeacher.data !== null) {
        setFoundTeacher(fetchTeacher.data);
      }
    } else {
      setData({
        identificacion: "",
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
      setFoundTeacher(null);
    }
  };

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
        handleTeacherSubmit(
          e,
          setErrors,
          setData,
          setLoading,
          todayString,
          dataTeacher ? dataTeacher : foundTeacher,
          setReFetch,
          setDataTeacher
        )
      }
    >
      <CustomInput
        type="text"
        name="identificacion"
        label="Identificación"
        value={data.identificacion}
        onChange={handleChangeTeacher}
        isInvalid={Boolean(errors.identificacion)}
        errorMessage={errors.identificacion}
      />
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
        label="Apellido"
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
        label="Teléfono"
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
        label="Código Postal"
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
        label="Género"
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
          {dataTeacher || foundTeacher ? "Actualizar" : "Registrar"}
        </Button>
      </div>
    </form>
  );
};
