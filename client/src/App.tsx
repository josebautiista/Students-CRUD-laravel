import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import NavbarCustom from "./components/Navbar";
import { FormStudent } from "./components/FormStudent";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Toaster position="bottom-right" />
      <NavbarCustom />
      <div className="max-w-7xl mx-auto">
        <div className="flex w-full flex-col mt-4">
          <Tabs aria-label="Options">
            <Tab key="FormStudent" title="Formulario Estudiante">
              <Card>
                <CardBody>
                  <FormStudent />
                </CardBody>
              </Card>
            </Tab>
            <Tab key="formCourse" title="Formulario Cursos">
              <Card>
                <CardBody>
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur.
                </CardBody>
              </Card>
            </Tab>
            <Tab key="students" title="Estudiantes">
              <Card>
                <CardBody>
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa
                  qui officia deserunt mollit anim id est laborum.
                </CardBody>
              </Card>
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default App;
