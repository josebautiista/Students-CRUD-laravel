import { Input } from "@nextui-org/react";

interface CustomInputProps {
  type: string;
  name: string;
  label: string;
  value: string | number;
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
        value={String(value)}
        onChange={onChange}
        className="w-full"
        variant="flat"
        radius="sm"
        isInvalid={isInvalid}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default CustomInput;
