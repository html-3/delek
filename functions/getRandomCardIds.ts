type Parameters = {cardIdList:string[]}

export default function getRandomCardIds({cardIdList}:Parameters) {
  // If the list has 10 or fewer elements, return the whole list
  if (cardIdList.length <= 10) {
      return cardIdList;
  }

  // Implementing the Fisher-Yates shuffle
  for (let i = cardIdList.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardIdList[i], cardIdList[j]] = [cardIdList[j], cardIdList[i]];
  }

  // Select the first 10 elements from the shuffled array
  return cardIdList.slice(0, 10);
}