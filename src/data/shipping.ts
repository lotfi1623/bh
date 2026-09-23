export type ShippingPrice = {
  home: number;
  desk: number;
};

export const shippingPrices: Record<string, ShippingPrice> = {
  "01": { home: 1100, desk: 750 },  // Adrar
  "02": { home: 500, desk: 300 },   // Chlef
  "03": { home: 900, desk: 550 },   // Laghouat
  "04": { home: 800, desk: 450 },   // Oum El Bouaghi
  "05": { home: 800, desk: 450 },   // Batna
  "06": { home: 750, desk: 450 },   // Béjaïa
  "07": { home: 900, desk: 550 },   // Biskra
  "08": { home: 1000, desk: 750 },  // Béchar
  "09": { home: 600, desk: 400 },   // Blida
  "10": { home: 700, desk: 450 },   // Bouira
  "11": { home: 1550, desk: 1100 }, // Tamanrasset
  "12": { home: 950, desk: 550 },   // Tébessa
  "13": { home: 800, desk: 400 },   // Tlemcen
  "14": { home: 800, desk: 450 },   // Tiaret
  "15": { home: 700, desk: 400 },   // Tizi Ouzou
  "16": { home: 500, desk: 300 },   // Alger
  "17": { home: 900, desk: 550 },   // Djelfa
  "18": { home: 750, desk: 450 },   // Jijel
  "19": { home: 730, desk: 450 },   // Sétif
  "20": { home: 800, desk: 500 },   // Saïda
  "21": { home: 750, desk: 450 },   // Skikda
  "22": { home: 700, desk: 450 },   // Sidi Bel Abbès
  "23": { home: 730, desk: 450 },   // Annaba
  "24": { home: 800, desk: 450 },   // Guelma
  "25": { home: 720, desk: 450 },   // Constantine
  "26": { home: 650, desk: 450 },   // Médéa
  "27": { home: 700, desk: 450 },   // Mostaganem
  "28": { home: 800, desk: 450 },   // M'Sila
  "29": { home: 700, desk: 450 },   // Mascara
  "30": { home: 950, desk: 600 },   // Ouargla
  "31": { home: 650, desk: 400 },   // Oran
  "32": { home: 1000, desk: 750 },  // El Bayadh
  "33": { home: 1550, desk: 1150 }, // Illizi
  "34": { home: 700, desk: 400 },   // Bordj Bou Arreridj
  "35": { home: 700, desk: 400 },   // Boumerdès
  "36": { home: 800, desk: 500 },   // El Tarf
  "37": { home: 1300, desk: 800 },  // Tindouf
  "38": { home: 800, desk: 450 },   // Tissemsilt
  "39": { home: 1000, desk: 600 },  // El Oued
  "40": { home: 800, desk: 500 },   // Khenchela
  "41": { home: 800, desk: 500 },   // Souk Ahras
  "42": { home: 600, desk: 400 },   // Tipaza
  "43": { home: 750, desk: 450 },   // Mila
  "44": { home: 600, desk: 400 },   // Aïn Defla
  "45": { home: 950, desk: 600 },   // Naâma
  "46": { home: 700, desk: 450 },   // Aïn Témouchent
  "47": { home: 1000, desk: 550 },  // Ghardaïa
  "48": { home: 700, desk: 450 },   // Relizane
  "49": { home: 1100, desk: 800 },  // Timimoun
  "50": { home: 1550, desk: 1100 }, // Bordj Badji Mokhtar (Estimated)
  "51": { home: 900, desk: 550 },   // Ouled Djellal
  "52": { home: 1100, desk: 850 },  // Béni Abbès
  "53": { home: 1550, desk: 1100 }, // In Salah
  "54": { home: 1550, desk: 1100 }, // In Guezzam (Estimated)
  "55": { home: 1000, desk: 600 },  // Touggourt
  "56": { home: 2200, desk: 1600 }, // Djanet
  "57": { home: 950, desk: 600 },   // El M'Ghair
  "58": { home: 950, desk: 550 }    // El Meniaa
};

export function getShippingPrice(wilayaCode: string, type: "home" | "desk"): number {
  const price = shippingPrices[wilayaCode];
  if (!price) return 0;
  return type === "home" ? price.home : price.desk;
}
