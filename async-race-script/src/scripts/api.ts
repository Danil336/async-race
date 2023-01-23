const baseUrl = "http://127.0.0.1:3000";

type KeyValuePair = {
  [key: string]: string | number;
};

type CarParameters = {
  [key: string]: string;
};

type WinParameters = {
  [key: string]: number | string;
};

const path = {
  garage: "/garage",
  engine: "/engine",
  winners: "/winners",
};

const generateQueryString = (queryParams: KeyValuePair[]) =>
  queryParams.length
    ? `?${queryParams.map((x) => `${x.key}=${x.value}`).join("&")}`
    : "";

export const getCars = async (queryParams: KeyValuePair[]) => {
  const response = await fetch(
    `${baseUrl}${path.garage}${generateQueryString(queryParams)}`
  );
  const items = await response.json();

  const count = Number(response.headers.get("X-Total-Count"));

  return { items, count };
};

export const getCar = async (id: number) => {
  const response = await fetch(`${baseUrl}${path.garage}/${id}`);
  const car = await response.json();

  return car;
};

export const createCar = async (car: CarParameters) => {
  const response = await fetch(`${baseUrl}${path.garage}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  });
  const carResponse = await response.json();

  return carResponse;
};

export const updateCar = async (id: number, car: CarParameters) => {
  const response = await fetch(`${baseUrl}${path.garage}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  });
  const carResponse = await response.json();

  return carResponse;
};

export const deleteCar = async (id: number) => {
  const response = await fetch(`${baseUrl}${path.garage}/${id}`, {
    method: "DELETE",
  });
  const carResponse = await response.json();

  return carResponse;
};

export const driveOneCar = async (queryParams: KeyValuePair[]) => {
  const response = await fetch(
    `${baseUrl}${path.engine}${generateQueryString(queryParams)}`,
    {
      method: "PATCH",
    }
  );

  const carResponse = await response.json();

  return carResponse;
};

export const getWinners = async (queryParams: KeyValuePair[]) => {
  const response = await fetch(
    `${baseUrl}${path.winners}${generateQueryString(queryParams)}`
  );
  const items = await response.json();

  const count = Number(response.headers.get("X-Total-Count"));

  return { items, count };
};

export const getWinner = async (id: number) => {
  const response = await fetch(`${baseUrl}${path.winners}/${id}`);
  const car = await response.json();

  return car;
};

export const createWinner = async (car: WinParameters) => {
  const response = await fetch(`${baseUrl}${path.winners}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  });
  const carResponse = await response.json();

  return carResponse;
};

export const deleteWinner = async (id: number) => {
  const response = await fetch(`${baseUrl}${path.winners}/${id}`, {
    method: "DELETE",
  });
  const carResponse = await response.json();

  return carResponse;
};

export const updateWinner = async (id: number, car: WinParameters) => {
  const response = await fetch(`${baseUrl}${path.winners}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(car),
  });
  const carResponse = await response.json();

  return carResponse;
};

