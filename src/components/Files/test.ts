type Includes<Array extends Array, Item> = Item extends keyof Array
  ? Array[Item] extends undefined
    ? false
    : true
  : false;

type isPillarMen = Includes<["Kars", "Esidisi", "Wamuu", "Santana"], "Esidisi">; // expected to be `false`

export {};
