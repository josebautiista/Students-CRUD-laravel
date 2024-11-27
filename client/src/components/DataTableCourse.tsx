import { useEffect, useMemo, useState, useCallback } from "react";
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
import { api } from "../api/api";
import toast from "react-hot-toast";
import { Course, Student } from "../types/data";
import { ModalStudents } from "./ModalStudents";
import { FaRegEye, FaPencilAlt, FaTrash, FaFilePdf } from "react-icons/fa"; // Cambia FaDownload a FaFilePdf
import { FaFileExcel } from "react-icons/fa"; // Importa el ícono de Excel
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Importa autotable para jsPDF

interface Props {
  students: Student[];
  loading: boolean;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  setDataCourse: React.Dispatch<React.SetStateAction<Course | undefined>>;
}

export default function DataTableCourse({
  students,
  loading: loadingStudents,
  setSelected,
  setDataCourse,
}: Props) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<number | undefined>(
    undefined
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const profile = localStorage.getItem("profile");

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

  const handleRemoveCourse = async (courseId: number) => {
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(courses.filter((course) => course.id !== courseId));
      toast.success("Curso eliminado correctamente");
    } catch {
      toast.error("Error al eliminar el curso");
    }
  };

  const handleDownloadCourse = async (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course) {
      toast.error("No se encontró el curso");
      return;
    }

    try {
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "letter",
      });

      const image = new Image();
      image.src = "/USCO_Logo.png";

      image.onload = () => {
        doc.addImage(image, "ICO", 40, 10, 50, 50);

        doc.setFontSize(16);
        doc.text(`Lista de Estudiantes - ${course.name}`, 110, 50);

        doc.setFontSize(12);
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 110, 65);
        if (course.teacher) {
          doc.text(
            `Profesor: ${course.teacher?.first_name} ${course.teacher?.last_name}`,
            110,
            80
          );
        }

        doc.autoTable({
          startY: 100,
          head: [
            [
              "Nombre",
              "Apellido",
              "Email",
              "Teléfono",
              "Fecha de Nacimiento",
              "Dirección",
              "Ciudad",
              "Departamento",
              "Nacionalidad",
            ],
          ],
          body: course.students?.map((student) => [
            student.first_name,
            student.last_name,
            student.email,
            student.phone,
            student.birth_date,
            student.address,
            student.city,
            student.state,
            student.nationality,
          ]),
          theme: "grid",
          styles: { fontSize: 10 },
          headStyles: { fillColor: [41, 128, 185] },
          alternateRowStyles: { fillColor: [245, 245, 245] },
        });

        doc.save(`Lista_de_Estudiantes_${course.name}.pdf`);
      };

      image.onerror = () => {
        toast.error("No se pudo cargar la imagen");
      };
    } catch {
      toast.error("Error al generar el PDF");
    }
  };

  const handleDownloadExcel = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course || !course.students) {
      toast.error("No se encontraron estudiantes para descargar");
      return;
    }

    const worksheetData = course.students.map((student) => ({
      Nombre: student.first_name,
      Apellido: student.last_name,
      Email: student.email,
      Teléfono: student.phone,
      Dirección: student.address,
      Ciudad: student.city,
      Estado: student.state,
      "Código Postal": student.postal_code,
      "Fecha de Nacimiento": student.birth_date,
      Género: student.gender,
      Nacionalidad: student.nationality,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");

    const fileName = `Lista_Estudiantes_${course.name.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const renderActions = useCallback(
    (courseId: number) => (
      <div className="relative flex items-center gap-2">
        <Tooltip content="Ver estudiantes">
          <span className="text-lg text-green-400 cursor-pointer active:opacity-50">
            <FaRegEye onClick={() => handleOpenModal(courseId)} />
          </span>
        </Tooltip>
        <Tooltip content="Editar">
          <span className="text-lg text-blue-400 cursor-pointer active:opacity-50">
            <FaPencilAlt
              onClick={() => {
                setSelected("formCourse");
                const course = courses.find((course) => course.id === courseId);
                if (course) setDataCourse(course);
              }}
            />
          </span>
        </Tooltip>
        <Tooltip content="Descargar lista de estudiantes (PDF)">
          <span className="text-lg text-red-500 cursor-pointer active:opacity-50">
            <FaFilePdf onClick={() => handleDownloadCourse(courseId)} />
          </span>
        </Tooltip>
        <Tooltip content="Descargar lista de estudiantes (Excel)">
          <span className="text-lg text-green-500 cursor-pointer active:opacity-50">
            <FaFileExcel onClick={() => handleDownloadExcel(courseId)} />
          </span>
        </Tooltip>
        <Tooltip color="danger" content="Eliminar">
          <span className="text-lg text-danger cursor-pointer active:opacity-50">
            <FaTrash onClick={() => handleRemoveCourse(courseId)} />
          </span>
        </Tooltip>
      </div>
    ),
    [courses]
  );

  return (
    <>
      <Table
        aria-label="Course data table with actions"
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
        classNames={{ wrapper: "min-h-[222px]" }}
      >
        <TableHeader>
          <TableHeader>
            <TableColumn key="name">Nombre</TableColumn>
            <TableColumn key="description">Descripción</TableColumn>
            <TableColumn key="duration">Duración</TableColumn>
            <TableColumn key="teacher">Profesor</TableColumn>
            <TableColumn key="actions">Acciones</TableColumn>
          </TableHeader>
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
              </TableRow>
            ))
          ) : items.length > 0 ? (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{`${item.duration} horas`}</TableCell>
                <TableCell>
                  {item.teacher
                    ? `${item.teacher.first_name} ${item.teacher.last_name}`
                    : "Sin asignar"}
                </TableCell>
                <TableCell>
                  {profile === "Administrador"
                    ? renderActions(item.id ?? 0)
                    : null}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
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
