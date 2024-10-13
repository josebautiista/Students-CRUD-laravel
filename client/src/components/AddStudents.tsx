import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { Course, Student } from "../types/data";
import { useMemo, useState } from "react";
import { api } from "../api/api";
import toast from "react-hot-toast";

interface AddStudentsProps {
  course: Course | undefined;
  students: Student[];
  loading: boolean;
  setReFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AddStudents = ({
  course,
  students,
  loading,
  setReFetch,
}: AddStudentsProps) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(
    new Set()
  );
  const [loadingStudents, setLoadingStudents] = useState(false);
  const availableStudents = useMemo(() => {
    if (!course) return students;

    const selectedStudentIds = new Set(
      course.students?.map((student) => student.id)
    );
    return students.filter((student) => !selectedStudentIds.has(student.id));
  }, [students, course]);

  const pages = Math.ceil(availableStudents.length / rowsPerPage);

  const items: Student[] = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return availableStudents.slice(start, end);
  }, [page, availableStudents]);

  const handleSelectionChange = (newSelectedKeys: Set<number>) => {
    setSelectedStudentIds(newSelectedKeys);
  };

  const handleAddStudents = async () => {
    if (!course || selectedStudentIds.size === 0) return;

    setLoadingStudents(true);
    try {
      const response = await api.post(`/courses/${course.id}/students`, {
        students: Array.from(selectedStudentIds),
        status: "active",
      });

      if (response.status === 200) {
        setReFetch((prev) => !prev);
        toast.success("Estudiantes agregados con éxito");
        setSelectedStudentIds(new Set());
      }
    } catch {
      toast.error("Error al añadir estudiantes");
    } finally {
      setLoadingStudents(false);
    }
  };

  return (
    <>
      <Table
        aria-label="Lista de estudiantes disponibles"
        selectionMode="multiple"
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
                onChange={setPage}
              />
            </div>
          )
        }
        selectedKeys={selectedStudentIds}
        onSelectionChange={(keys) => handleSelectionChange(keys as Set<number>)}
      >
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Apellido</TableColumn>
          <TableColumn>Email</TableColumn>
        </TableHeader>
        <TableBody>
          {items.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.first_name}</TableCell>
              <TableCell>{student.last_name}</TableCell>
              <TableCell>{student.email}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-end mt-5">
        <Button
          isDisabled={selectedStudentIds.size === 0}
          color="success"
          onClick={handleAddStudents}
          isLoading={loadingStudents}
        >
          Añadir Estudiantes
        </Button>
      </div>
    </>
  );
};
