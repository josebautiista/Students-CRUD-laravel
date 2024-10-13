import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Skeleton,
  Button,
} from "@nextui-org/react";
import { api } from "../api/api";
import toast from "react-hot-toast";
import { Course, Student } from "../types/data";
import { ModalStudents } from "./ModalStudents";

interface Props {
  students: Student[];
  loading: boolean;
}

export default function DataTableCourse({
  students,
  loading: loadingStudents,
}: Props) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<number | undefined>(
    undefined
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await api.get("/courses");
        const data = response.data;
        setCourses(data);
      } catch {
        toast.error("Error al obtener los cursos");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const pages = Math.ceil(courses.length / rowsPerPage);

  const items: Course[] = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return courses.slice(start, end);
  }, [page, courses]);

  const handleOpenModal = (course: number | undefined) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(undefined);
  };

  return (
    <>
      <Table
        aria-label="Course data table with pagination"
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
          <TableColumn key="name">Nombre</TableColumn>
          <TableColumn key="description">Descripción</TableColumn>
          <TableColumn key="duration">Duración</TableColumn>
          <TableColumn key="ver">Ver Estudiantes</TableColumn>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
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
              </TableRow>
            ))
          ) : items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{`${item.duration} horas`}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    color="primary"
                    onClick={() => handleOpenModal(item.id)}
                  >
                    Ver
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No se encontraron cursos.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ModalStudents
        isModalOpen={isModalOpen}
        selectedCourse={selectedCourse}
        handleCloseModal={handleCloseModal}
        students={students}
        loading={loadingStudents}
      />
    </>
  );
}
