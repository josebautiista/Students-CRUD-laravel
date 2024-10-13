import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  Select,
  SelectItem,
  Image,
} from "@nextui-org/react";
import { ThemeSelector } from "../atoms/ThemeSelector";

export default function NavbarCustom() {
  const profiles = ["usuario", "administrador"];
  return (
    <Navbar maxWidth="xl" height="6rem">
      <NavbarBrand className="flex items-center gap-2">
        <Image
          alt="NextUI hero Image"
          src="https://www.usco.edu.co/imagen-institucional/favicon.ico"
        />
        <p className="text-2xl font-bold text-inherit">USCO</p>
      </NavbarBrand>
      <NavbarContent justify="end">
        <Select
          label="Perfil"
          size="md"
          defaultSelectedKeys={["usuario"]}
          className="w-52"
        >
          {profiles.map((profile) => (
            <SelectItem key={profile} value={profile}>
              {profile}
            </SelectItem>
          ))}
        </Select>

        <ThemeSelector />
        <NavbarItem className="flex items-center gap-2">
          <Avatar src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png" />
          <p className="text-xl font-semibold">Jhon Doe</p>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
