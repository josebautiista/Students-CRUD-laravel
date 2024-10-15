import { useEffect, useState } from "react";
import { Input, Button, Textarea, Spacer } from "@nextui-org/react";
import { Course } from "../types/data";
import { courseSchema } from "../utils/validator";
import { api } from "../api/api";
import toast from "react-hot-toast";

interface Props {
  dataCourse: Course | undefined;
  setDataCourse: React.Dispatch<React.SetStateAction<Course | undefined>>;
}

export const FormCourses = ({ dataCourse, setDataCourse }: Props) => {
  const [data, setData] = useState<Course>({
    name: "",
    description: "",
    duration: 0,
  });

  useEffect(() => {
    if (dataCourse) {
      setData(dataCourse);
    }
  }, [dataCourse]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validation = courseSchema.safeParse(data);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.errors.forEach((error) => {
        newErrors[error.path[0]] = error.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      if (dataCourse) {
        await api.put(`/courses/${dataCourse.id}`, data);
        toast.success("Curso actualizado exitosamente");
      } else {
        await api.post("/courses", data);
        toast.success("Curso creado exitosamente");
      }
      setDataCourse(undefined);
      setData({ name: "", description: "", duration: 0 });
    } catch {
      toast.error("Error al actualizar el curso");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1">
      <Input
        type="text"
        name="name"
        label="Nombre del curso"
        placeholder="Ej. Curso de React"
        value={data.name}
        onChange={onChange}
        isInvalid={!!errors.name}
        errorMessage={errors.name}
        fullWidth
      />

      <Spacer y={1} />

      <Textarea
        name="description"
        label="Descripción del curso"
        placeholder="Escribe una breve descripción del curso..."
        value={data.description}
        onChange={onChange}
        isInvalid={!!errors.description}
        errorMessage={errors.description}
        fullWidth
        rows={4}
      />

      <Spacer y={1} />

      <Input
        type="number"
        name="duration"
        label="Duración del curso (en horas)"
        placeholder="Ej. 40"
        value={String(data.duration)}
        onChange={onChange}
        isInvalid={!!errors.duration}
        errorMessage={errors.duration}
        fullWidth
      />

      <Spacer y={1} />

      <div className="w-full flex justify-end">
        <Button type="submit" color="success" isLoading={loading}>
          {dataCourse ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  );
};
