import { BR_STATES } from "../constants/general";
import { CLASS_GROUP } from "../constants/students";

export type MockExamResponseType = {
  id: string;
  mockExamName: string;
  mockExamNumber: number;
  correctAnswers: number;
  ipmScore: number;
};

export type ClassGroupResponse = {
  classGroupName: string;
  responses: MockExamResponseType[];
};

export type YearlyResponse = {
  year: number;
  classGroupResponsesList: ClassGroupResponse[];
};

export type StudentResponse = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  enrollmentYear: number;
  classGroups: CLASS_GROUP[];
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
  responses: YearlyResponse[];
};

export type StudentRequest = {
  name: string;
  email: string;
  cpf: string;
  enrollmentYear: number;
  classGroups: CLASS_GROUP[];
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
