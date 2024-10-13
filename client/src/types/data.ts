import { CalendarDate } from "@nextui-org/react";

export interface Student {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  birth_date: CalendarDate;
  gender: string;
  nationality: string;
}
