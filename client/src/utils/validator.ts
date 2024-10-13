import { z } from "zod";
import { api } from "../api/api";
import { parseDate } from "@internationalized/date";
import { Student } from "../types/data";
import toast from "react-hot-toast";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const studentSchema = z.object({
  first_name: z
    .string()
    .min(1, "El primer nombre es obligatorio")
    .max(255, "El primer nombre no debe exceder los 255 caracteres"),
  last_name: z
    .string()
    .min(1, "El segundo nombre es obligatorio")
    .max(255, "El segundo nombre no debe exceder los 255 caracteres"),
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("Debe ser un correo válido")
    .max(255, "El correo no debe exceder los 255 caracteres"),
  phone: z
    .string()
    .min(1, "El teléfono es obligatorio")
    .max(10, "El teléfono no debe exceder los 10 caracteres")
    .regex(/^\d+$/, "El teléfono debe contener solo números"),
  address: z
    .string()
    .max(100, "La dirección no debe exceder los 100 caracteres"),
  city: z.string().max(255, "La ciudad no debe exceder los 255 caracteres"),
  state: z
    .string()
    .max(255, "El departamento no debe exceder los 255 caracteres"),
  postal_code: z
    .string()
    .max(10, "El código postal no debe exceder los 10 caracteres"),
  birth_date: z
    .string()
    .min(1, "La fecha de nacimiento es obligatoria")
    .transform((val) => new Date(val))
    .refine((date) => date <= today, {
      message: "La fecha de nacimiento no puede ser mayor que hoy.",
    }),
  gender: z.string().max(50, "El género no debe exceder los 50 caracteres"),
  nationality: z
    .string()
    .max(255, "La nacionalidad no debe exceder los 255 caracteres"),
});

export const handleSubmit = (
  e: React.FormEvent<HTMLFormElement>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  setData: React.Dispatch<React.SetStateAction<Student>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  todayString: string
) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const dataObject = Object.fromEntries(formData.entries());

  const validation = studentSchema.safeParse(dataObject);

  if (!validation.success) {
    const newErrors: Record<string, string> = {};
    validation.error.errors.forEach((error) => {
      newErrors[error.path[0]] = error.message;
    });
    setErrors(newErrors);
  } else {
    setLoading(true);
    api
      .post("/students", dataObject)
      .then(() => {
        toast.success("Estudiante agregado exitosamente");
        setData({
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
      })
      .catch((err) => {
        toast.error("Error al agregar el estudiante");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
    setErrors({});
  }
};
