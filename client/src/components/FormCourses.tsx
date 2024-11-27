import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Textarea,
  Spacer,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Course, Teacher } from "../types/data";
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
    teacher_id: undefined,
  });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await api.get("/teachers");
        setTeachers(response.data);
      } catch {
        toast.error("Error al cargar los profesores");
      }
    };
    fetchTeachers();
  }, []);

  useEffect(() => {
    if (dataCourse) {
      setData(dataCourse);
    }
  }, [dataCourse]);

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
    console.log("data", data);
    try {
      if (dataCourse) {
        await api.put(`/courses/${dataCourse.id}`, data);
        toast.success("Curso actualizado exitosamente");
      } else {
        await api.post("/courses", data);
        toast.success("Curso creado exitosamente");
      }
      setDataCourse(undefined);
      setData({
        name: "",
        description: "",
        duration: 0,
        teacher_id: undefined,
      });
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

      <Select
        label="Profesor"
        value={data.teacher_id ? data.teacher_id.toString() : ""}
        onChange={(e) =>
          setData({ ...data, teacher_id: Number(e.target.value) })
        }
        placeholder="Selecciona un profesor"
        isInvalid={!!errors.teacher_id}
        errorMessage={errors.teacher_id}
      >
        {teachers.map((teacher) => (
          <SelectItem
            key={teacher.id || `teacher_${Math.random()}`}
            value={teacher.id?.toString() || ""}
          >
            {`${teacher.first_name} ${teacher.last_name}`}
          </SelectItem>
        ))}
      </Select>

      <Spacer y={1} />

      <div className="w-full flex justify-end">
        <Button type="submit" color="success" isLoading={loading}>
          {dataCourse ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  );
};
