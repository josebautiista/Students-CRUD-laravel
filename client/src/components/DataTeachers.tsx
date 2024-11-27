import { useState, useEffect, useMemo } from "react";
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
import { FaFilePdf, FaFileExcel } from "react-icons/fa";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Teacher } from "../types/data";

interface Props {
  teachers: Teacher[];
  loading: boolean;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
  setDataTeacher: React.Dispatch<React.SetStateAction<Teacher | undefined>>;
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
}

export default function DataTableTeachers({ teachers, loading }: Props) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(teachers.length / rowsPerPage);

  const items: Teacher[] = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return teachers.slice(start, end);
  }, [page, teachers]);

  const handleDownloadExcel = () => {
    const worksheetData = teachers.map((teacher) => ({
      Identificación: teacher.identificacion,
      Nombre: teacher.first_name,
      Apellido: teacher.last_name,
      Email: teacher.email,
      Teléfono: teacher.phone,
      Dirección: teacher.address,
      Ciudad: teacher.city,
      Departamento: teacher.state,
      "Código Postal": teacher.postal_code,
      "Fecha de Nacimiento": teacher.birth_date,
      Género: teacher.gender,
      Nacionalidad: teacher.nationality,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Profesores");
    XLSX.writeFile(workbook, "Lista_Profesores.xlsx");
  };

  const handleDownloadPDF = () => {
    if (teachers.length === 0) {
      toast.error("No hay profesores para descargar");
      return;
    }

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "letter",
    });

    // Crear una nueva imagen y cargarla desde la carpeta 'public'
    const image = new Image();
    image.src = "/USCO_Logo.png"; // Ruta relativa a la carpeta 'public'

    image.onload = () => {
      // Agregar la imagen al PDF
      doc.addImage(image, "ICO", 40, 10, 50, 50); // X, Y, Width, Height

      // Agregar el título
      doc.setFontSize(18);
      doc.text("Lista de Profesores", 110, 40);

      // Generar la tabla con los datos de los profesores
      doc.autoTable({
        startY: 70, // Margen superior ajustado para dejar espacio a la imagen y título
        head: [
          [
            "Identificación",
            "Nombre",
            "Apellido",
            "Email",
            "Teléfono",
            "Dirección",
            "Ciudad",
            "Departamento",
            "Código Postal",
            "Fecha de Nacimiento",
            "Género",
            "Nacionalidad",
          ],
        ],
        body: teachers.map((teacher) => [
          teacher.identificacion,
          teacher.first_name,
          teacher.last_name,
          teacher.email,
          teacher.phone,
          teacher.address,
          teacher.city,
          teacher.state,
          teacher.postal_code,
          teacher.birth_date,
          teacher.gender,
          teacher.nationality,
        ]),
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      // Guardar el archivo PDF
      doc.save("Lista_Profesores.pdf");
    };

    image.onerror = () => {
      toast.error("No se pudo cargar la imagen");
    };
  };

  useEffect(() => {
    setPage(1);
  }, [teachers]);

  return (
    <Table
      aria-label="Teacher data table with pagination"
      bottomContent={
        !loading && (
          <div className="flex w-full justify-between items-center">
            <div className="flex gap-2">
              <Tooltip content="Descargar lista de profesores (PDF)">
                <span className="text-lg text-red-500 cursor-pointer active:opacity-50">
                  <FaFilePdf onClick={handleDownloadPDF} />
                </span>
              </Tooltip>
              <Tooltip content="Descargar lista de profesores (Excel)">
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
    >
      <TableHeader>
        <TableColumn key="identificacion">Identificación</TableColumn>
        <TableColumn key="first_name">Nombre</TableColumn>
        <TableColumn key="last_name">Apellidos</TableColumn>
        <TableColumn key="email">Email</TableColumn>
        <TableColumn key="phone">Teléfono</TableColumn>
        <TableColumn key="address">Dirección</TableColumn>
        <TableColumn key="city">Ciudad</TableColumn>
        <TableColumn key="state">Departamento</TableColumn>
        <TableColumn key="postal_code">Código Postal</TableColumn>
        <TableColumn key="birth_date">Fecha de Nacimiento</TableColumn>
        <TableColumn key="gender">Género</TableColumn>
        <TableColumn key="nationality">Nacionalidad</TableColumn>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              {Array.from({ length: 12 }).map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className="h-3 w-4/5 rounded-lg" />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : items.length > 0 ? (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.identificacion || "N/A"}</TableCell>
              <TableCell>{item.first_name || "N/A"}</TableCell>
              <TableCell>{item.last_name || "N/A"}</TableCell>
              <TableCell>{item.email || "N/A"}</TableCell>
              <TableCell>{item.phone || "N/A"}</TableCell>
              <TableCell>{item.address || "N/A"}</TableCell>
              <TableCell>{item.city || "N/A"}</TableCell>
              <TableCell>{item.state || "N/A"}</TableCell>
              <TableCell>{item.postal_code || "N/A"}</TableCell>
              <TableCell>{item.birth_date || "N/A"}</TableCell>
              <TableCell>{item.gender || "N/A"}</TableCell>
              <TableCell>{item.nationality || "N/A"}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={13} className="text-center">
              No se encontraron profesores.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
