import { z } from "zod";
import { api } from "../api/api";
import { parseDate } from "@internationalized/date";
import { Student } from "../types/data";
import { Teacher } from "../types/data";
import toast from "react-hot-toast";

const today = new Date();
today.setHours(0, 0, 0, 0);

export const teacherSchema = z.object({
  first_name: z.string().max(255, "El primer nombre es demasiado largo"),
  last_name: z.string().max(255, "El apellido es demasiado largo"),
  email: z.string().email("El email no es válido").max(255),
  phone: z.string().max(10, "El teléfono debe tener como máximo 10 dígitos"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
});

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

export const courseSchema = z.object({
  name: z
    .string()
    .min(1, { message: "El nombre es obligatorio." })
    .max(255, { message: "El nombre no puede exceder 255 caracteres." }),
  description: z.string().min(1, { message: "La descripción es obligatoria." }),
  duration: z.union([
    z
      .string()
      .min(1, { message: "La duración debe ser un número entero positivo." }),
    z
      .number()
      .int()
      .positive({ message: "La duración debe ser un número entero positivo." }),
  ]),
});

export const handleSubmit = (
  e: React.FormEvent<HTMLFormElement>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  setData: React.Dispatch<React.SetStateAction<Student>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  todayString: string,
  dataStudent: Student | undefined,
  setReFetch: React.Dispatch<React.SetStateAction<boolean>>,
  setDataStudent: React.Dispatch<React.SetStateAction<Student | undefined>>
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

    const apiUrl = dataStudent ? `/students/${dataStudent.id}` : "/students";
    const apiMethod = dataStudent ? "put" : "post";

    api[apiMethod](apiUrl, dataObject)
      .then(() => {
        const successMessage = dataStudent
          ? "Estudiante actualizado exitosamente"
          : "Estudiante agregado exitosamente";

        toast.success(successMessage);
        setReFetch((prev) => !prev);
        setDataStudent(undefined);
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
        toast.error("Error al guardar el estudiante");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

    setErrors({});
  }
};

export const handleTeacherSubmit = (
  e: React.FormEvent<HTMLFormElement>,
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  setData: React.Dispatch<React.SetStateAction<Teacher>>, // Usa el tipo Teacher
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  todayString: string,
  dataTeacher: Teacher | undefined | null, // Cambia a Teacher
  setReFetch: React.Dispatch<React.SetStateAction<boolean>>,
  setDataTeacher: React.Dispatch<React.SetStateAction<Teacher | undefined>> // Cambia a Teacher
) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const dataObject = Object.fromEntries(formData.entries());

  const validation = teacherSchema.safeParse(dataObject); // Usa un esquema de validación para profesores

  if (!validation.success) {
    const newErrors: Record<string, string> = {};
    validation.error.errors.forEach((error) => {
      newErrors[error.path[0]] = error.message;
    });
    setErrors(newErrors);
  } else {
    setLoading(true);

    const apiUrl = dataTeacher ? `/teachers/${dataTeacher.id}` : "/teachers"; // Cambia la URL a "teachers"
    const apiMethod = dataTeacher ? "put" : "post"; // Usa PUT para actualizar y POST para crear

    api[apiMethod](apiUrl, dataObject)
      .then(() => {
        const successMessage = dataTeacher
          ? "Profesor actualizado exitosamente"
          : "Profesor agregado exitosamente";

        toast.success(successMessage);
        setReFetch((prev) => !prev);
        setDataTeacher(undefined);
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
      })
      .catch((err) => {
        toast.error("Error al guardar el profesor");
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

    setErrors({});
  }
};
