import { renderCars } from "./generateCars";
import driveCars from "./carsRace";
import winnersFn from "./winners";

const appFn = async () => {
  await renderCars(1); // and pagination

  await driveCars();

  winnersFn();
};

appFn();
