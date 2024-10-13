import { Input } from "@nextui-org/react";

interface CustomInputProps {
  type: string;
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isInvalid?: boolean;
  errorMessage?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  type,
  name,
  label,
  value,
  onChange,
  isInvalid = false,
  errorMessage = "",
}) => {
  return (
    <div className="w-full">
      <Input
        type={type}
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        className="w-full"
        variant="bordered"
        radius="sm"
        isInvalid={isInvalid}
        errorMessage={errorMessage} // Mostrar el mensaje de error si existe
      />
    </div>
  );
};

export default CustomInput;
