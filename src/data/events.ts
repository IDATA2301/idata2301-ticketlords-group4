export type EventData = {
    slug: string;
    title: string;
    location: string;
    date: string;
    description: string;
    image?: string;
}

const imageModules = import.meta.glob("../assets/*.{png,jpg,jpeg,webp,avif,svg}", {
    eager: true,
    import: "default",
}) as Record<string, string>;

const imagesByFileName: Record<string, string> = Object.fromEntries(
    Object.entries(imageModules).map(([path, url]) => [path.split("/").pop() as string, url])
);

//date follows YYYY-MM-DD
export const EVENTS: Record<string, EventData> = {
    "el-hispanico-festivalo": {
        slug: "el-hispanico-festivalo",
        title: "El Hispanico Festivalo",
        location: "Bergen",
        date: "2026-06-12",
        description: "A vibrant celebration of Hispanic culture",
        image: imagesByFileName["hispanic-cultural.png"],
    },
    "hawaii-sunset-concert": {
        slug: "hawaii-sunset-concert",
        title: "Hawaii Sunset Concert",
        location: "Fårnebu Arena",
        date: "2026-08-12",
        description: "Live music with the sunset",
        image: imagesByFileName["beach-sunset.png"],
    },
    "lord-of-the-rings-trilogy": {
        slug: "lord-of-the-rings-trilogy",
        title: "Lord of the Rings Trilogy",
        location: "Ålesund Cinema",
        date: "2027-04-30",
        description: "Witness the acclaimed trilogy, that has defined the fantasy genre for over 2 decades, for a night in Ålesund cinema",
        image: imagesByFileName["lord-of-the-rings-triology.png"],
    },
    "cosplay-convention": {
        slug: "cosplay-convention",
        title: "Cosplay Convention",
        location: "Campus Ålesund",
        date: "2027-02-01",
        description: "Come show of your cosplay or just come watch others costume",
        image: imagesByFileName["cosplay-convention.png"],
    },
    "drage-vs-liavags": {
        slug: "drage-vs-liavags",
        title: "The Drage vs The Liavågs",
        location: "Campus Ålesund",
        date: "2027-04-23",
        description: "Watch the epic showdown of Drage vs The Liavågs live in campus backyard. Who will win?",

    },
    "jogeir-heart": {
        slug: "jogeir-heart",
        title: "Valentines day",
        location: "Campus Ålesund",
        date: "2027-02-14",
        description: "Celebrate the loveliest day of the year",
        image: imagesByFileName["jogeirHeart.jpg"],
    },
    "jogeir-funnyjunk-bakken": {
        slug: "jogeir-funnyjunk-bakken",
        title: "Jogeir, Funnyjunk og Bakken",
        location: "Bakken",
        date: "2027-06-25",
        description: "En historie om kjærlighet og konflikt",

    },
    "jogeir-finger": {
        slug: "jogeir-finger",
        title: "Jogeir: The kid named finger",
        location: "Myrvåg",
        date: "2027-07-17",
        description: "See the epic thriller"
    }

};