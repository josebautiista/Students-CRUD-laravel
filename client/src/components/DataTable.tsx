import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Skeleton,
  Tooltip,
} from "@nextui-org/react";
import { Student } from "../types/data";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import toast from "react-hot-toast";
import { api } from "../api/api";

interface Props {
  students: Student[];
  loading: boolean;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  setDataStudent: React.Dispatch<React.SetStateAction<Student | undefined>>;
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
}

export default function DataTableStudents({
  students,
  loading,
  setSelected,
  setDataStudent,
  setStudents,
}: Props) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const profile = localStorage.getItem("profile");

  const pages = Math.ceil(students.length / rowsPerPage);

  const items: Student[] = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return students.slice(start, end);
  }, [page, students]);

  const handleRemoveStudents = async (courseId: number) => {
    try {
      await api.delete(`/students/${courseId}`);
      setStudents(students.filter((student) => student.id !== courseId));
      toast.success("Estudiante eliminado correctamente");
    } catch {
      toast.error("Error al eliminar el estudiante");
    }
  };

  useEffect(() => {
    setPage(1);
  }, [students]);

  const renderActions = useCallback(
    (courseId: number) => (
      <div className="relative flex items-center gap-2">
        <Tooltip content="Editar">
          <span className="text-lg text-blue-400 cursor-pointer active:opacity-50">
            <FaPencil
              onClick={() => {
                setSelected("formStudent");
                const student = students.find(
                  (student) => student.id === courseId
                );
                if (student) setDataStudent(student);
              }}
            />
          </span>
        </Tooltip>
        <Tooltip color="danger" content="Eliminar">
          <span className="text-lg text-danger cursor-pointer active:opacity-50">
            <FaTrash onClick={() => handleRemoveStudents(courseId)} />
          </span>
        </Tooltip>
      </div>
    ),
    [students, setSelected]
  );

  return (
    <Table
      aria-label="Student data table with pagination"
      bottomContent={
        !loading && (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        )
      }
      classNames={{
        wrapper: "min-h-[222px]",
      }}
    >
      <TableHeader>
        <TableColumn key="first_name">Nombre</TableColumn>
        <TableColumn key="last_name">Apellidos</TableColumn>
        <TableColumn key="email">Email</TableColumn>
        <TableColumn key="phone">Telefono</TableColumn>
        <TableColumn key="birth_date">Fecha de Nacimiento</TableColumn>
        <TableColumn key="address">Dirección</TableColumn>
        <TableColumn key="city">Ciudad</TableColumn>
        <TableColumn key="state">Departamento</TableColumn>
        <TableColumn key="nationality">Nacionalidad</TableColumn>
        <TableColumn key="actions">Acciones</TableColumn>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-4/5 rounded-lg" />
              </TableCell>
            </TableRow>
          ))
        ) : items.length > 0 ? (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.first_name}</TableCell>
              <TableCell>{item.last_name}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.phone}</TableCell>
              <TableCell>{item.birth_date}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.city}</TableCell>
              <TableCell>{item.state}</TableCell>
              <TableCell>{item.nationality}</TableCell>
              <TableCell>
                {profile === "Administrador"
                  ? renderActions(item.id ?? 0)
                  : null}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={10} className="text-center">
              No se encontraron estudiantes.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
