import { getCars } from "./api";
import {necesseryCars} from "./generateCars";

let currentPage = 1;

const pagination = () => {
  carsCounter();
  paginator();
};

export const carsCounter = async () => {
  const garageTitle = document.querySelector(".garage_title") as HTMLDivElement;
  const cars = await getCars([]);
  const carsItems = cars.items;
  garageTitle!.innerText = `Garage (${carsItems.length})`;
};

export const paginator = () => {
  const nextPageBtn = document.querySelector(".next_btn");
  const prevPageBtn = document.querySelector(".prev_btn");
  const paginBtns = [nextPageBtn, prevPageBtn];

  const pageIndicator = document.querySelector(".page") as HTMLDivElement;

  paginBtns.forEach(btn => {
    btn?.addEventListener("click", async () => {
      const garageArea = document.querySelector(".cars") as HTMLDivElement;
      if(btn === nextPageBtn) {
        removePastCars(garageArea);

        currentPage++;
        pageIndicator.innerText = `Page #${currentPage}`;
        await necesseryCars(currentPage);
      } else if(currentPage >= 2) {
        removePastCars(garageArea);

        currentPage--;
        pageIndicator.innerText = `Page #${currentPage}`;
        await necesseryCars(currentPage);
      }
    });
  });
};

const removePastCars = (garageArea: HTMLDivElement) => {
  while(garageArea?.firstChild) {
    garageArea.removeChild(garageArea.firstChild);
  }
};

export default pagination;
