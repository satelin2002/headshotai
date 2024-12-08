import Link from "next/link";
import Image from "next/image";

interface Style {
  name: string;
  image: string;
}

const styles: Style[] = [
  {
    name: "Grey",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725592466/styles/grey-female_1.jpg",
  },
  {
    name: "Black",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/black-female.jpg",
  },
  {
    name: "Blue",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/blue-female.jpg",
  },
  {
    name: "Cafe",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/cafe-female.jpg",
  },
  {
    name: "Office",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/office-female.jpg",
  },
  {
    name: "Outdoor",
    image:
      "https://res.cloudinary.com/duz3pqofn/image/upload/v1725589489/styles/outdoor-female.jpg",
  },
];

export function PhotoStylesGrid() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {styles.map((style) => (
          <Link
            key={style.name}
            href={`/app/create-photos/?style=${encodeURIComponent(style.name)}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-muted"
          >
            <Image
              src={style.image}
              alt={style.name}
              fill
              className="object-cover transition-transform group-hover:scale-110 duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              quality={100}
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <p className="text-base font-medium text-white">{style.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
