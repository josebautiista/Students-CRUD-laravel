import { CalendarDate } from "@nextui-org/react";

export interface Teacher {
  identificacion: string;
  id?: number;
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

export interface Student {
  id?: number;
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

export interface Course {
  id?: number;
  name: string;
  description: string;
  duration: number;
  students?: Student[];
  teacher?: Teacher;
  teacher_id?: number;
}
