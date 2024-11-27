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
import { FaTrash, FaPencilAlt, FaFilePdf, FaFileExcel } from "react-icons/fa";
import toast from "react-hot-toast";
import { api } from "../api/api";
import * as XLSX from "xlsx"; // Para exportar a Excel
import jsPDF from "jspdf"; // Para exportar a PDF
import "jspdf-autotable"; // Para tabla en PDF

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

  const handleRemoveStudent = async (studentId: number) => {
    try {
      await api.delete(`/students/${studentId}`);
      setStudents(students.filter((student) => student.id !== studentId));
      toast.success("Estudiante eliminado correctamente");
    } catch {
      toast.error("Error al eliminar el estudiante");
    }
  };

  const handleDownloadExcel = () => {
    const worksheetData = students.map((student) => ({
      Nombre: student.first_name,
      Apellido: student.last_name,
      Email: student.email,
      Teléfono: student.phone,
      "Fecha de Nacimiento": student.birth_date,
      Dirección: student.address,
      Ciudad: student.city,
      Departamento: student.state,
      Nacionalidad: student.nationality,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Estudiantes");
    XLSX.writeFile(workbook, "Lista_Estudiantes.xlsx");
  };

  const handleDownloadPDF = () => {
    if (students.length === 0) {
        toast.error("No hay estudiantes para descargar");
        return;
    }

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "letter",
    });

    const image = new Image();
    image.src = "/USCO_Logo.png";

    image.onload = () => {
        doc.addImage(image, "ICO", 40, 10, 50, 50);
        doc.text("Lista de Estudiantes", 110, 40);

        doc.autoTable({
            startY: 70,
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
            body: students.map((student) => [
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

        doc.save("Lista_Estudiantes.pdf");
    };

    image.onerror = () => {
        toast.error("No se pudo cargar la imagen");
    };
};


  useEffect(() => {
    setPage(1);
  }, [students]);

  const renderActions = useCallback(
    (studentId: number) => (
      <div className="relative flex items-center gap-2">
        <Tooltip content="Editar">
          <span className="text-lg text-blue-400 cursor-pointer active:opacity-50">
            <FaPencilAlt
              onClick={() => {
                setSelected("formStudent");
                const student = students.find((student) => student.id === studentId);
                if (student) setDataStudent(student);
              }}
            />
          </span>
        </Tooltip>
        <Tooltip color="danger" content="Eliminar">
          <span className="text-lg text-danger cursor-pointer active:opacity-50">
            <FaTrash onClick={() => handleRemoveStudent(studentId)} />
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
          <div className="flex w-full justify-between items-center">
            <div className="flex gap-2">
              <Tooltip content="Descargar lista de estudiantes (PDF)">
                <span className="text-lg text-red-500 cursor-pointer active:opacity-50">
                  <FaFilePdf onClick={handleDownloadPDF} />
                </span>
              </Tooltip>
              <Tooltip content="Descargar lista de estudiantes (Excel)">
                <span className="text-lg text-green-500 cursor-pointer active:opacity-50">
                  <FaFileExcel onClick={handleDownloadExcel} />
                </span>
              </Tooltip>
            </div>
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
        <TableColumn key="phone">Teléfono</TableColumn>
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
              {Array.from({ length: 9 }).map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className="h-3 w-4/5 rounded-lg" />
                </TableCell>
              ))}
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
                {profile === "Administrador" ? renderActions(item.id ?? 0) : null}
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
