import React, { useState, useEffect } from "react";
import InputSelectMultiple from "../components/InputSelectMultiple";
import axios from "axios";
import type { Doctor, Hospital, Specialization } from "../types";

function Home() {
  const [listDoctors, setListDoctors] = useState<Doctor[]>([]);
  const [listHospitals, setListHospitals] = useState<Hospital[]>([]);
  const [listSpecializations, setListSpecializations] = useState<
    Specialization[]
  >([]);

  const [filterName, setFilterName] = useState<string>("");
  const [filterHospital, setFilterHospital] = useState<Hospital[]>([]);
  const [filterSpecialization, setFilterSpecialization] = useState<
    Specialization[]
  >([]);

  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("https://run.mocky.io/v3/c9a2b598-9c93-4999-bd04-0194839ef2dc")
      .then(({ data }) => {
        const fetchedDoctors = data.data;
        const uniqueHospitals = fetchedDoctors.reduce(
          (acc: Hospital[], curr: Doctor) => {
            const temp = [];
            for (let i = 0; i < curr.hospital.length; i++) {
              const isDuplicate = acc.some((el: Hospital) => {
                return el.id === curr.hospital[i].id;
              });
              if (!isDuplicate) {
                temp.push(curr.hospital[i]);
              }
            }
            return [...acc, ...temp];
          },
          []
        );
        const uniqueSpecializations = fetchedDoctors.reduce(
          (acc: Specialization[], curr: Doctor) => {
            const isDuplicate = acc.some((el: Specialization) => {
              return el.id === curr.specialization.id;
            });

            if (!isDuplicate) {
              return [...acc, curr.specialization];
            }

            return [...acc];
          },
          []
        );
        setListDoctors(data.data);
        setListHospitals(uniqueHospitals);
        setListSpecializations(uniqueSpecializations);
        setFilterHospital(uniqueHospitals);
        setFilterSpecialization(uniqueSpecializations);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filteredData = listDoctors.reduce((acc: Doctor[], curr: Doctor) => {
      const {
        name: currName,
        specialization: currSpecialization,
        hospital: currHospital,
      } = curr;

      const matchedName = currName
        .toLowerCase()
        .includes(filterName.toLowerCase());

      const matchedSpecialization = filterSpecialization.some(
        (specialization: Specialization) => {
          return specialization.id === currSpecialization.id;
        }
      );

      const matchedHospital = filterHospital.some((hospital: Hospital) => {
        const isMatch = currHospital.some((doctorHospital: Hospital) => {
          return hospital.id === doctorHospital.id;
        });
        return isMatch;
      });

      if (matchedName && matchedSpecialization && matchedHospital) {
        return [...acc, curr];
      }

      return [...acc];
    }, []);

    setFilteredDoctors(filteredData);
  }, [listDoctors, filterName, filterSpecialization, filterHospital]);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Network Error...</div>;

  return (
    <div className="bg-sky-100 min-h-screen p-8">
      {/* Filter */}
      <div className="bg-green-100 shadow-lg rounded-md px-4 py-4 mb-10">
        <h3 className="text-lg font-bold mb-4">Doctor Finder</h3>
        <div className="space-x-4 flex">
          <input
            placeholder="Name"
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            className="w-64 outline-none focus:ring-2 focus:ring-sky-300 px-2 py-1"
          />
          <InputSelectMultiple
            title="Hospital"
            listOptions={listHospitals}
            filterInput={filterHospital}
            setFilter={setFilterHospital}
          />
          <InputSelectMultiple
            title="Specialization"
            listOptions={listSpecializations}
            filterInput={filterSpecialization}
            setFilter={setFilterSpecialization}
          />
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-2 gap-4">
        {filteredDoctors.map((doctor: Doctor, idx: number) => {
          return (
            <div
              key={idx}
              className="bg-white w-full p-4 flex space-x-4 overflow-hidden rounded-md shadow-md"
            >
              <div className="w-32 h-32 bg-white rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={doctor.photo.url}
                  alt={doctor.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="w-full relative">
                <h3 className="font-bold text-base mb-2">{doctor.name}</h3>
                <h4 className="w-fit px-4 py-1 rounded-md font-semibold text-sm text-emerald-400 bg-emerald-50 mb-3">
                  {doctor.hospital[0].name} - {doctor.specialization.name}
                </h4>
                <p className="text-sm text-left pr-4 mb-8">
                  {doctor.about_preview.replace(/&nbsp;/g, " ")}
                </p>
                <div className="absolute bottom-0 right-0 text-sky-600 font-bold">
                  {doctor.price.formatted}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
