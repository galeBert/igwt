type Province = {
  id: string;
  text: string;
};
const useProvince = async (url: string) => {
  const getProvince = await fetch(url, { method: "GET" });
  const province = await getProvince.json();
  const result: Province[] = province.result;
  if (!result.length) {
    return [];
  }
  return result;
};
const useCity = async (id?: string) => {
  if (id) {
    const getProvince = await fetch(
      `https://alamat.thecloudalert.com/api/kabkota/get/?d_provinsi_id=${id}`,
      { method: "GET" }
    );
    const province = await getProvince.json();
    const result: Province[] = province.result;
    if (!result.length) {
      return [];
    }
    return result;
  }
  return [];
};

const useDistrict = async (id?: string) => {
  if (id) {
    const getProvince = await fetch(
      `https://alamat.thecloudalert.com/api/kecamatan/get/?d_kabkota_id=${id}`,
      { method: "GET" }
    );
    const province = await getProvince.json();
    const result: Province[] = province.result;
    if (!result.length) {
      return [];
    }
    return result;
  }
  return [];
};

const getPostalCode = async (cityId?: string, districtId?: string) => {
  console.log(districtId, cityId);

  if (districtId && cityId) {
    const getProvince = await fetch(
      `https://alamat.thecloudalert.com/api/kodepos/get/?d_kabkota_id=1&d_kecamatan_id=1`,
      { method: "GET" }
    );
    const province = await getProvince.json();
    const result: Province[] = province.result;
    console.log("result", result);

    if (!result.length) {
      return [];
    }
    return result;
  }
  return [];
};

export { useProvince, useCity, useDistrict, getPostalCode };
