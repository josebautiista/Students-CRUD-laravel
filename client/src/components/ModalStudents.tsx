import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { Course, Student } from "../types/data";
import { AddStudents } from "./AddStudents";
import { StudentsCourse } from "./StudentsCourse";
import { useEffect, useState } from "react";
import { api } from "../api/api";
import toast from "react-hot-toast";

interface ModalStudentsProps {
  isModalOpen: boolean;
  selectedCourse: number | undefined;
  handleCloseModal: () => void;
  students: Student[];
  loading: boolean;
}

export const ModalStudents = ({
  isModalOpen,
  selectedCourse,
  handleCloseModal,
  students,
  loading,
}: ModalStudentsProps) => {
  const [course, setCourse] = useState<Course>();
  const [reFetch, setReFetch] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!selectedCourse) return;
      try {
        const response = await api.get(`/courses/${selectedCourse}`);
        const data = response.data.course;
        setCourse(data);
      } catch {
        toast.error("Error al obtener los detalles del curso");
      }
    };

    fetchCourse();
  }, [selectedCourse, reFetch]);

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={handleCloseModal}
      className="max-w-4xl max-h-[90vh] overflow-y-auto"
    >
      <ModalContent>
        <ModalHeader>Gestión de Estudiantes</ModalHeader>
        <ModalBody>
          <Tabs aria-label="Options">
            <Tab key="estudiantes" title="Estudiantes">
              {course?.students && course.students.length > 0 ? (
                <StudentsCourse
                  course={course}
                  loading={loading}
                  setReFetch={setReFetch}
                />
              ) : (
                <p>No hay estudiantes registrados en este curso.</p>
              )}
            </Tab>
            <Tab key="agregar" title="Agregar Estudiantes">
              <AddStudents
                course={course}
                students={students}
                loading={loading}
                setReFetch={setReFetch}
              />
            </Tab>
          </Tabs>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
