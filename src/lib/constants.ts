export const STYLES = [
  {
    id: "grey",
    name: "Grey",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725592466/styles/grey-female_1.jpg",
  },
  {
    id: "black",
    name: "Black",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/black-female.jpg",
  },
  {
    id: "blue",
    name: "Blue",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/blue-female.jpg",
  },
  {
    id: "red",
    name: "Red",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/red-female.jpg",
  },
  {
    id: "green",
    name: "Green",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/green-female.jpg",
  },
  {
    id: "yellow",
    name: "Yellow",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/yellow-female.jpg",
  },
  {
    id: "purple",
    name: "Purple",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/purple-female.jpg",
  },
  {
    id: "orange",
    name: "Orange",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/orange-female.jpg",
  },
] as const;

export type Style = (typeof STYLES)[number];
