import axios from "axios";
import { useEffect, useState } from "react";

interface getAdressProps {
  type: "province" | "city" | "district" | "subdistrict" | "postalcode";
  id?: number;
  cityId?: number;
}

const url = "https://alamat.thecloudalert.com/api";

type TAddress = { id: string; text: string };
export const useAdress = ({
  type = "province",
  id,
  cityId,
}: getAdressProps) => {
  const [province, setProvince] = useState<TAddress[]>([]);
  const [city, setCity] = useState<TAddress[]>([]);
  const [district, setDistrict] = useState<TAddress[]>([]);
  const [subdistrict, setSubdistrict] = useState<TAddress[]>([]);
  const [postalCode, setPostalCode] = useState<TAddress[]>([]);

  useEffect(() => {
    (async () => {
      const province = await axios.get(`${url}/provinsi/get/`);
      setProvince(province.data.result);
    })();
    if (type === "city" && id) {
      (async () => {
        const city = await axios.get(`${url}/kabkota/get/?d_provinsi_id=${id}`);
        setCity(city.data.result);
      })();
    }
    if (type === "district" && id) {
      (async () => {
        const district = await axios.get(
          `${url}/kecamatan/get/?d_kabkota_id=${id}`
        );
        setDistrict(district.data.result);
      })();
    }
    if (type === "subdistrict" && id) {
      (async () => {
        const subdistrict = await axios.get(
          `${url}/kelurahan/get/?d_kecamatan_id=${id}`
        );
        setSubdistrict(subdistrict.data.result);
      })();
    }
    if (type === "postalcode" && id && cityId) {
      (async () => {
        const postalcode = await axios.get(
          `${url}/kodepos/get/?d_kabkota_id=${cityId}&d_kecamatan_id=${id}`
        );
        setPostalCode(postalcode.data.result);
      })();
    }
  }, [type, id, cityId]);

  if (type === "city") {
    return city;
  }
  if (type === "district") {
    return district;
  }
  if (type === "subdistrict") {
    return subdistrict;
  }
  if (type === "postalcode") {
    return postalCode;
  }
  return province;
};
