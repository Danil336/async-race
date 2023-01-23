import {
  getWinners,
  getWinner,
  createWinner,
  deleteWinner,
  updateWinner,
} from "./api";

type WinInfoArr = {
  [key: string]: string | number;
};

const winnersFn = () => {
  openWinnersPanel();

  closeWinnersPanel();

  renderWinners(1);

  winnersPagination(1);

  sortWinners();
};

const openWinnersPanel = () => {
  const toWinnersBtn = document.querySelector(".to_winners_btn");

  const garageAttributes = document.querySelectorAll(".in_garage");
  const winnersAttribute = document.querySelector(".winners");

  const countDown = document.querySelector(".count_down");
  const winnerAlert = document.querySelector(".winner_alert");

  toWinnersBtn?.addEventListener("click", () => {
    garageAttributes.forEach((elem) => {
      elem.classList.add("in_garage_unshown");
    });
    winnersAttribute?.classList.remove("in_garage_unshown");

    countDown?.classList.add("in_garage_unshown");
    winnerAlert?.classList.add("in_garage_unshown");
  });
};

const closeWinnersPanel = () => {
  const toGarageBtn = document.querySelector(".to_garage_btn");

  const garageAttributes = document.querySelectorAll(".in_garage");
  const winnersAttribute = document.querySelector(".winners");

  const countDown = document.querySelector(".count_down");
  const winnerAlert = document.querySelector(".winner_alert");

  toGarageBtn?.addEventListener("click", () => {
    garageAttributes.forEach((elem) => {
      elem.classList.remove("in_garage_unshown");
    });
    winnersAttribute?.classList.add("in_garage_unshown");

    countDown?.classList.remove("in_garage_unshown");
    winnerAlert?.classList.remove("in_garage_unshown");
  });
};

const generatedWinner = (
  winName: string,
  winCounter: number,
  winTime: number
) => `
<div class="win_number">yes</div>
<div class="win_name">${winName}</div>
<div class="win_counter">${winCounter}</div>
<div class="win_time">${winTime}</div>
`;

const renderWinners = async (pageNumber: number, sortBy?: string, order?: string) => {
  const firstWinner = await getWinner(1);
  if (firstWinner.time === 10) {
    deleteWinner(1);
  }

  const winnersArea = document.querySelector(".cars_winners");
  const winnersTitle = document.querySelector(
    ".winners_title"
  ) as HTMLDivElement;
  const winnersPage = document.querySelector(".winners_page") as HTMLDivElement;

  const winnersOnePage = await getWinners([
    { key: "_page", value: pageNumber },
    { key: "_limit", value: 10 },
    { key: "_sort", value: sortBy || "time"},
    { key: "_order", value: order || "ASC" },
  ]);

  const allWinners = await getWinners([]);

  const winItems: WinInfoArr[] = winnersOnePage.items;

  winnersTitle.innerText = `Winners (${allWinners.items.length})`;
  winnersPage.innerText = `Page #${pageNumber}`;

  winItems.forEach((winInfo) => {
    const winner = document.createElement("div");
    winner.classList.add("winner");
    winner.innerHTML = generatedWinner(
      winInfo.name as string,
      +winInfo.wins,
      +winInfo.time
    );

    winnersArea?.appendChild(winner);
  });
};

export const createOneWinner = async (winnerName: string, winTime: number) => {
  let isUpdated = false;
  const allWinners = await getWinners([]);
  const winnersItems: WinInfoArr[] = allWinners.items;
  winnersItems.forEach(async (elem) => {
    if (elem.name === winnerName) {
      const allWinners = document.querySelectorAll(
        ".winner"
      ) as NodeListOf<HTMLDivElement>;
      allWinners.forEach((winner) => {
        const winnersName = (winner.children[1] as HTMLDivElement).innerText;
        const winnersWins = winner.children[2] as HTMLDivElement;
        const winnersTime = winner.children[3] as HTMLDivElement;
        if (winnersName === elem.name) {
          winnersWins.innerText = ((elem.wins as number) + 1).toString();
          if (winTime < elem.time) {
            winnersTime.innerText = winTime.toString();
          }
        }
      });
      isUpdated = true;
      await updateWinner(elem.id as number, {
        name: winnerName,
        time: winTime < elem.time ? winTime : elem.time,
        wins: (elem.wins as number) + 1,
      });
    }
  });
  if (isUpdated === false) {
    const winnersTitle = document.querySelector(
      ".winners_title"
    ) as HTMLDivElement;
    const winnersArea = document.querySelector(".cars_winners");

    await createWinner({
      name: winnerName,
      time: winTime,
      wins: 1,
    });

    const winnersOnePage = await getWinners([
      { key: "_page", value: 1 },
      { key: "_limit", value: 10 },
      { key: "_sort", value: "time"},
      { key: "_order", value: "ASC" },
    ]);

    if (winnersOnePage.items.length <= 9) {
      const newWinner = document.createElement("div");
      newWinner.classList.add("winner");
      newWinner.innerHTML = generatedWinner(winnerName, 1, winTime);

      winnersArea?.appendChild(newWinner);
    }

    winnersTitle.innerText = `Winners (${allWinners.items.length + 1})`;
  }
};

const winnersPagination = (pageNumber: number) => {
  const nextPageWinners = document.querySelector(".winners_next_btn");
  const prevPageWinners = document.querySelector(".winners_prev_btn");

  const winnersArea = document.querySelector(".cars_winners");

  nextPageWinners?.addEventListener("click", async () => {
    while (winnersArea?.firstChild) {
      winnersArea.removeChild(winnersArea.firstChild);
    }

    pageNumber += 1;

    await renderWinners(pageNumber);
  });

  prevPageWinners?.addEventListener("click", async () => {
    if (pageNumber >= 2) {
      while (winnersArea?.firstChild) {
        winnersArea.removeChild(winnersArea.firstChild);
      }

      pageNumber -= 1;

      await renderWinners(pageNumber);
    }
  });
};

const sortWinners = async () => {
  const forWinsBtn = document.querySelector(".winner_wins");
  const forTimeBtn = document.querySelector(".winner_best_time");

  forTimeBtn?.addEventListener("click", async () => {
    if(forTimeBtn.getAttribute("data-order") === "ASC") {
      forTimeBtn.setAttribute("data-order", "DESC");

      const winnersArea = document.querySelector(".cars_winners");
  
      while (winnersArea?.firstChild) {
        winnersArea.removeChild(winnersArea.firstChild);
      }
  
      renderWinners(1, "time", "DESC");
    } else{
      forTimeBtn.setAttribute("data-order", "ASC");

      const winnersArea = document.querySelector(".cars_winners");
  
      while (winnersArea?.firstChild) {
        winnersArea.removeChild(winnersArea.firstChild);
      }
  
      renderWinners(1, "time", "ASC");
    }
  });

  forWinsBtn?.addEventListener("click", async () => {
    if(forWinsBtn.getAttribute("data-order") === "ASC") {
      forWinsBtn.setAttribute("data-order", "DESC");

      const winnersArea = document.querySelector(".cars_winners");
  
      while (winnersArea?.firstChild) {
        winnersArea.removeChild(winnersArea.firstChild);
      }
  
      renderWinners(1, "wins", "DESC");
    } else{
      forWinsBtn.setAttribute("data-order", "ASC");

      const winnersArea = document.querySelector(".cars_winners");
  
      while (winnersArea?.firstChild) {
        winnersArea.removeChild(winnersArea.firstChild);
      }
  
      renderWinners(1, "wins", "ASC");
    }
  });
};

export default winnersFn;
