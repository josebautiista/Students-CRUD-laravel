import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import NavbarCustom from "./components/Navbar";
import { FormStudent } from "./components/FormStudent";
import toast, { Toaster } from "react-hot-toast";
import { FormCourses } from "./components/FormCourses";
import DataTableStudets from "./components/DataTable";
import DataTableCourse from "./components/DataTableCourse";
import { useEffect, useState } from "react";
import { Course, Student } from "./types/data";
import { api } from "./api/api";

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string>("FormStudent");
  const [dataCourse, setDataCourse] = useState<Course>();
  const [dataStudent, setDataStudent] = useState<Student>();
  const [reFetch, setReFetch] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const response = await api.get("/students");
        const data = response.data;
        setStudents(data);
      } catch {
        toast.error("Error al obtener los estudiantes");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [reFetch]);

  return (
    <div>
      <Toaster position="bottom-right" />
      <NavbarCustom />
      <div className="max-w-7xl mx-auto">
        <div className="flex w-full flex-col mt-4">
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={(key) => setSelected(key as string)}
          >
            <Tab key="FormStudent" title="Crear Estudiante">
              <Card>
                <CardBody>
                  <FormStudent
                    dataStudent={dataStudent}
                    setReFetch={setReFetch}
                    setDataStudent={setDataStudent}
                  />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="formCourse" title="Crear Cursos">
              <Card>
                <CardBody>
                  <FormCourses
                    dataCourse={dataCourse}
                    setDataCourse={setDataCourse}
                  />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="students" title="Estudiantes">
              <DataTableStudets
                students={students}
                loading={loading}
                setSelected={setSelected}
                setDataStudent={setDataStudent}
                setStudents={setStudents}
              />
            </Tab>
            <Tab key="courses" title="Cursos">
              <DataTableCourse
                students={students}
                loading={loading}
                setSelected={setSelected}
                setDataCourse={setDataCourse}
              />
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default App;
