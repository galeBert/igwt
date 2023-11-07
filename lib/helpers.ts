const translateToURLencoded = (obj: any) => {
  let formBody: any = [];
  for (let property in obj) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(obj[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return formBody;
};

const oneHourfromNowFlipFormat = () => {
  const oneHourFromNow = new Date(
    new Date().getTime() + 60 * 60 * 1000
  ).toLocaleString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h24",
  });

  const splitedDateTime = oneHourFromNow.split(",");
  const date = splitedDateTime[0];
  const time = splitedDateTime[1];

  const splitedDate = date.split("/");
  const month = splitedDate[0];
  const day = splitedDate[1];
  const year = splitedDate[2];

  const joinedDate = [year, month, day].join("-");
  return `${joinedDate}${time}`;
};

function removeDuplicateObjectFromArray<T>(array: T[], key: keyof T) {
  const check = new Set();
  return array.filter((obj) => !check.has(obj[key]) && check.add(obj[key]));
}
export {
  translateToURLencoded,
  oneHourfromNowFlipFormat,
  removeDuplicateObjectFromArray,
};
