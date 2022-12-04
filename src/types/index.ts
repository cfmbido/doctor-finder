export interface Doctor {
  photo: {
    url: string;
  };
  name: string;
  hospital: Hospital[];
  specialization: Specialization;
  about_preview: string;
  price: {
    formatted: string;
  };
}

export interface Hospital {
  id: string;
  name: string;
}

export interface Specialization {
  id: string;
  name: string;
}
