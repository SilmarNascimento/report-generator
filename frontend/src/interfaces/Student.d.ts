import { BR_STATES } from "../constants/general";
import { CLASS_GROUP } from "../constants/students";

export type StudentResponse = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  enrollmentYear: number;
  classGroup: CLASS_GROUP;
  activationDate: string;
  photoUrl?: string;
  address?: {
    street?: string;
    number?: number;
    complement?: string;
    neighborhood: string;
    city: string;
    state: BR_STATES;
    zipCode: string;
  };
};

export type StudentRequest = {
  name: string;
  email: string;
  cpf: string;
  enrollmentYear: number;
  classGroup: CLASS_GROUP;
  activationDate: string;
  photoUrl?: string;
  address?: {
    street?: string;
    number?: number;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: BR_STATES;
    zipCode?: string;
  };
};
