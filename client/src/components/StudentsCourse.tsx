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
  course: Course | null;
  loading: boolean;
  setReFetch: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StudentsCourse = ({
  course,
  loading,
  setReFetch,
}: AddStudentsProps) => {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<number>>(
    new Set()
  );
  const [loadingStudents, setLoadingStudents] = useState(false);

  const pages = useMemo(() => {
    if (!course?.students) return 0;
    return course ? Math.ceil(course.students.length / rowsPerPage) : 0;
  }, [course, rowsPerPage]);

  const items: Student[] = useMemo(() => {
    if (!course?.students) return [];
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return course.students.slice(start, end);
  }, [page, course]);

  const handleSelectionChange = (newSelectedKeys: Set<number>) => {
    setSelectedStudentIds(newSelectedKeys);
  };

  const handleRemoveStudents = async () => {
    if (!course || selectedStudentIds.size === 0) return;

    setLoadingStudents(true);
    try {
      await api.delete(`/courses/${course.id}/students`, {
        data: {
          students: selectedStudentIds,
        },
      });

      setReFetch((prev) => !prev);
      toast.success("Estudiantes eliminados con éxito");
      setSelectedStudentIds(new Set());
    } catch {
      toast.error("Error al eliminar estudiantes");
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
          color="danger"
          onClick={handleRemoveStudents}
          isLoading={loadingStudents}
        >
          Eliminar estudiantes
        </Button>
      </div>
    </>
  );
};
