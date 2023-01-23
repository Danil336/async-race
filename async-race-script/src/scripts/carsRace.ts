import { driveOneCar } from "./api";
import { createOneWinner } from "./winners";

const driveCars = async () => {
  startOneCar();
  startAllCars();
};

export const startOneCar = async () => {
  const allStartBtnsOnPage = document.querySelectorAll(".command_btn_go");

  allStartBtnsOnPage.forEach(async (startBtn) => {
    startBtn.addEventListener("click", async function startOneListener() {
      startBtn.removeEventListener("click", startOneListener);
      startBtn.classList.remove("active");

      const stopBtn = startBtn.parentElement?.children[1] as HTMLButtonElement;

      stopBtn.classList.add("active");

      const carToAnimate = startBtn?.parentElement?.parentElement?.children[1]
        .children[0] as HTMLDivElement;
      const carId = Number(startBtn.getAttribute("car-id"));

      const carInfo = await driveOneCar([
        { key: "id", value: carId },
        { key: "status", value: "started" },
      ]);

      const carSpeed = carInfo.velocity;

      const interval = 201 - carSpeed;

      stopBtn?.addEventListener("click", async function stopOneListener() {
        stopBtn.classList.remove("active");
        startBtn.classList.add("active");
        startBtn.addEventListener("click", startOneListener);
        await driveOneCar([
          { key: "id", value: carId },
          { key: "status", value: "stopped" },
        ]);
      });

      if (stopBtn.classList.contains("active")) {
        let pos = 4;

        const frame = () => {
          if (pos === 85) {
            clearInterval(drive);
          }
          pos++;
          carToAnimate.style.left = pos + "%";
        };
        const drive = setInterval(frame, interval);
        try {

          carToAnimate?.classList.add("finish");
        
          stopBtn.addEventListener("click", () => {
            clearInterval(drive);
            carToAnimate.style.left = "4%";
            carToAnimate?.classList.remove("finish");
          });

          await driveOneCar([
            { key: "id", value: carId },
            { key: "status", value: "drive" },
          ]);
        } catch {
          clearInterval(drive);
          console.error("Error 500: Engine is broken!");
        }
      }
    });
  });
};

const startAllCars = async function startAllListener() {
  const startRaceBtn = document.querySelector(
    ".all_cars_race_btn"
  ) as HTMLButtonElement;
  const stopRaceBtn = document.querySelector(
    ".all_cars_stop_btn"
  ) as HTMLButtonElement;

  const winnerAlert = document.querySelector(".winner_alert") as HTMLDivElement;

  startRaceBtn.addEventListener("click", async function startRaceListener() {
    startRaceBtn.removeEventListener("click", startRaceListener);
    startRaceBtn.classList.add("control_unactive");

    const allStartBtnsOnPage = document.querySelectorAll(
      ".command_btn_go"
    ) as NodeListOf<HTMLButtonElement>;
    const allStopBtnsOnPage = document.querySelectorAll(
      ".command_btn_stop"
    ) as NodeListOf<HTMLButtonElement>;

    const carCustomBtns = document.querySelectorAll(".car_control_btn");

    carCustomBtns.forEach((customBtn) => {
      customBtn.classList.add("car_control_unactive");
    });

    const allCarsToAnimate = document.querySelectorAll(".car_image");

    const countDown = document.querySelector(".count_down") as HTMLDivElement;
    countDown.classList.add("show_count_down");

    allStopBtnsOnPage.forEach((stopBtn) => {
      stopBtn.click();
    });
    allStartBtnsOnPage.forEach((startBtn) => {
      startBtn.classList.remove("active");
    });

    let allCarSpeeds: number[][] = [];

    allCarsToAnimate.forEach(async (carToAnimate) => {
      const carId = Number(
        carToAnimate.parentElement?.parentElement?.parentElement?.getAttribute(
          "car-id"
        )
      );

      const carInfo = await driveOneCar([
        { key: "id", value: carId },
        { key: "status", value: "started" },
      ]);

      const carSpeed = carInfo.velocity;

      allCarSpeeds.push([carId, carSpeed]);
    });

    const winnersArr: Array<Array<HTMLDivElement | number>> = [];

    setTimeout(() => {
      const allSpeeds: number[] = [];

      allCarSpeeds = allCarSpeeds.sort((a, b) => a[0] - b[0]);

      allCarSpeeds.forEach((elem) => {
        allSpeeds.push(elem[1]);
      });

      countDown.classList.remove("show_count_down");

      for (let i = 0; i < allCarSpeeds.length; i++) {
        const animateCar = allCarsToAnimate[i] as HTMLDivElement;

        const thisSpeed = allCarSpeeds[i][1];
        const interval = 201 - thisSpeed;

        setOneCarPosition(interval, animateCar, stopRaceBtn, winnersArr);

        stopRaceBtn.classList.remove("control_unactive");

        stopRaceBtn.addEventListener(
          "click",
          async function stopRaceListener() {
            startRaceBtn.addEventListener("click", startRaceListener);
            startRaceBtn.classList.remove("control_unactive");
            stopRaceBtn.classList.add("control_unactive");

            winnerAlert.classList.remove("show_count_down");

            carCustomBtns.forEach((customBtn) => {
              customBtn.classList.remove("car_control_unactive");
            });

            allStartBtnsOnPage.forEach((startBtn) => {
              startBtn.classList.add("active");
            });
          }
        );
      }
    }, 3000);
    setTimeout(() => {
      const winner = winnersArr[0];

      if (!winner) {
        setTimeout(() => {
          const winner = winnersArr[0];

          const winTime = (winner[0] as number) / 1000;
          const winnerName = (winner[1] as HTMLDivElement).getAttribute(
            "data-name"
          );

          winnerAlert.classList.add("show_count_down");
          winnerAlert!.innerText = `${winnerName} побеждает за ${winTime}s`;

          createOneWinner(winnerName!, winTime);
        }, 10000);
      } else {
        const winTime = (winner[0] as number) / 1000;
        const winnerName = (winner[1] as HTMLDivElement).getAttribute(
          "data-name"
        );

        winnerAlert.classList.add("show_count_down");
        winnerAlert!.innerText = `${winnerName} побеждает за ${winTime}s`;

        createOneWinner(winnerName!, winTime);
      }
    }, 8000);
  });
};

const setOneCarPosition = (
  interval: number,
  carToAnimate: HTMLDivElement,
  stopOneBtn: HTMLButtonElement,
  winnersArr?: Array<HTMLDivElement | number>[]
) => {
  try {
    let pos = 4;
    let timeToFinish = 0;
    const frame = () => {
      if (pos === 85) {
        clearInterval(drive);
        winnersArr?.push([timeToFinish, carToAnimate]);
      }
      setInterval(() => {
        timeToFinish++;
      }, 40);
      pos++;
      carToAnimate.style.left = pos + "%";
    };
  
    const drive = setInterval(frame, interval);
    carToAnimate?.classList.add("finish");
  
    stopOneBtn.addEventListener("click", () => {
      clearInterval(drive);
      carToAnimate.style.left = "4%";
      carToAnimate?.classList.remove("finish");
    });
  } catch {
    console.log(" ");
  }
};

export default driveCars;
