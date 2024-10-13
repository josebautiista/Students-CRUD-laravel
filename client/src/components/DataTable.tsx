import { useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  getKeyValue,
  Skeleton,
} from "@nextui-org/react";
import { Student } from "../types/data";

interface Props {
  students: Student[];
  loading: boolean;
}

export default function DataTableStudets({ students, loading }: Props) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const pages = Math.ceil(students.length / rowsPerPage);

  const items: Student[] = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return students.slice(start, end);
  }, [page, students]);

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
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={10} className="text-center">
              No students found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
